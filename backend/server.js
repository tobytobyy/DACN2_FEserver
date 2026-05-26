#!/usr/bin/env node
'use strict';

/**
 * Lightweight local backend for the HealthCare React Native app.
 *
 * It intentionally uses only Node.js built-in modules so the app can run the
 * backend without installing extra packages. Data is kept in memory because the
 * current mobile app only needs a development API that matches its screens.
 */

const { Buffer } = require('buffer');
const http = require('http');
const crypto = require('crypto');
const { URL } = require('url');

const HOST = process.env.BE_HOST || '0.0.0.0';
const PORT = Number(process.env.BE_PORT || process.env.PORT || 8080);
const PUBLIC_BASE_URL = process.env.BE_PUBLIC_URL || `http://localhost:${PORT}`;
const DEFAULT_OTP = process.env.BE_DEFAULT_OTP || '123456';

const state = {
  users: new Map(),
  tokens: new Map(),
  refreshTokens: new Map(),
  otpRequests: new Map(),
  chatSessions: new Map(),
  activeWorkouts: new Map(),
  workouts: [],
  uploads: new Map(),
  foodLogs: [],
};

const sampleFoods = [
  {
    code: 'chicken-rice',
    name: 'Chicken rice',
    calories: 520,
    protein: 34,
    carbs: 58,
    fat: 14,
    score: 0.91,
  },
  {
    code: 'beef-pho',
    name: 'Beef pho',
    calories: 430,
    protein: 27,
    carbs: 54,
    fat: 10,
    score: 0.78,
  },
  {
    code: 'mixed-salad',
    name: 'Mixed salad',
    calories: 260,
    protein: 9,
    carbs: 22,
    fat: 15,
    score: 0.66,
  },
];

function id(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}

function nowIso() {
  return new Date().toISOString();
}

function json(res, status, body) {
  const payload = JSON.stringify(body ?? {});
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  res.end(payload);
}

function notFound(res) {
  json(res, 404, { message: 'Route not found' });
}

function badRequest(res, message) {
  json(res, 400, { message });
}

function unauthorized(res) {
  json(res, 401, { message: 'Unauthorized' });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const contentType = req.headers['content-type'] || '';
      if (!buffer.length) return resolve(null);
      if (contentType.includes('application/json')) {
        try {
          return resolve(JSON.parse(buffer.toString('utf8')));
        } catch (error) {
          return reject(new Error('Invalid JSON body'));
        }
      }
      resolve(buffer);
    });
    req.on('error', reject);
  });
}

function normalizeIdentifier(value) {
  return String(value || 'demo@health.local')
    .trim()
    .toLowerCase();
}

function getOrCreateUser(identifier) {
  const normalized = normalizeIdentifier(identifier);
  if (state.users.has(normalized)) return state.users.get(normalized);

  const isEmail = normalized.includes('@');
  const user = {
    id: id('usr'),
    username: isEmail ? normalized.split('@')[0] : normalized,
    primaryEmail: isEmail
      ? normalized
      : `${normalized.replace(/\D/g, '') || 'phone'}@health.local`,
    displayIdentifier: normalized,
    profile: null,
    settings: {},
    goals: { stepGoal: 10000, waterGoalMl: 2000, sleepGoalHours: 8 },
    status: 'ACTIVE',
    roles: ['USER'],
    lastLoginAt: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  state.users.set(normalized, user);
  return user;
}

function issueTokens(user) {
  const accessToken = id('access');
  const refreshToken = id('refresh');
  state.tokens.set(accessToken, user.id);
  state.refreshTokens.set(refreshToken, user.id);
  user.lastLoginAt = nowIso();
  user.updatedAt = nowIso();
  return { accessToken, refreshToken, expiresInSeconds: 60 * 60 * 24 };
}

function currentUser(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const userId = token ? state.tokens.get(token) : null;
  if (!userId) return null;
  return [...state.users.values()].find(user => user.id === userId) || null;
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    primaryEmail: user.primaryEmail,
    displayIdentifier: user.displayIdentifier,
    profile: user.profile,
    settings: user.settings,
    goals: user.goals,
    status: user.status,
    roles: user.roles,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function wrapped(data) {
  return { data };
}

function haversineKm(a, b) {
  if (!a || !b || typeof a.lat !== 'number' || typeof b.lat !== 'number')
    return 0;
  const toRad = value => (value * Math.PI) / 180;
  const radiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * radiusKm * Math.asin(Math.sqrt(h));
}

function workoutStats(workout) {
  const endMs = workout.endedAt
    ? new Date(workout.endedAt).getTime()
    : Date.now();
  const activeDurationMs = Math.max(
    0,
    endMs - new Date(workout.startedAt).getTime() - workout.pausedDurationMs,
  );
  const distanceKm = Number(workout.distanceKm.toFixed(2));
  const steps = workout.steps || Math.max(0, Math.round(distanceKm * 1250));
  const caloriesOut = Math.round(distanceKm * 62 + steps * 0.035);
  return {
    trackingId: workout.trackingId,
    distanceKm,
    activeDurationMs,
    steps,
    caloriesOut,
    avgPaceSecPerKm:
      distanceKm > 0 ? Math.round(activeDurationMs / 1000 / distanceKm) : null,
    updatedAt: nowIso(),
  };
}

function workoutRecord(workout) {
  const stats = workoutStats(workout);
  return {
    id: workout.trackingId,
    workoutType: workout.workoutType,
    time: { startAt: workout.startedAt, endAt: workout.endedAt || nowIso() },
    distanceKm: stats.distanceKm,
    steps: stats.steps,
    caloriesOut: stats.caloriesOut,
    avgPaceSecPerKm: stats.avgPaceSecPerKm,
  };
}

function chatAssistantReply(content, hasImage) {
  const text = String(content || '').trim();
  if (hasImage) {
    return 'Mình đã nhận ảnh của bạn. Nếu đây là ảnh món ăn, hãy dùng Calories Scan để phân tích calo chi tiết hơn nhé.';
  }
  if (/water|nước/i.test(text))
    return 'Bạn nên chia lượng nước trong ngày thành nhiều lần uống nhỏ và theo dõi mục tiêu hằng ngày.';
  if (/sleep|ngủ/i.test(text))
    return 'Hãy cố gắng ngủ đúng giờ, hạn chế màn hình trước khi ngủ và duy trì 7-9 giờ ngủ mỗi đêm.';
  if (/step|walk|bước|đi bộ/i.test(text))
    return 'Một mục tiêu tốt là 8.000-10.000 bước/ngày. Bạn có thể bắt đầu bằng các đoạn đi bộ ngắn sau bữa ăn.';
  return `Mình đã ghi nhận: "${
    text || 'tin nhắn của bạn'
  }". Bạn muốn mình tư vấn về bước chân, giấc ngủ, nước uống hay dinh dưỡng?`;
}

async function handle(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, null);

  const url = new URL(req.url, PUBLIC_BASE_URL);
  const path = url.pathname;
  const method = req.method;
  const body = await readBody(req);

  if (method === 'GET' && (path === '/' || path === '/health')) {
    return json(res, 200, {
      ok: true,
      service: 'DACN2 local backend',
      time: nowIso(),
    });
  }

  if (method === 'POST' && path === '/auth/otp/request') {
    const identifier = normalizeIdentifier(body?.identifier);
    const otpRequest = {
      otpRequestId: id('otp'),
      identifier,
      channel: body?.channel || 'EMAIL',
      code: DEFAULT_OTP,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    state.otpRequests.set(otpRequest.otpRequestId, otpRequest);
    return json(res, 200, {
      otpRequestId: otpRequest.otpRequestId,
      expiresInSeconds: 300,
      devCode: DEFAULT_OTP,
    });
  }

  if (method === 'POST' && path === '/auth/otp/verify') {
    const otpRequest = state.otpRequests.get(body?.otpRequestId);
    const validCode =
      String(body?.code || '') === DEFAULT_OTP ||
      /^\d{6}$/.test(String(body?.code || ''));
    if (!otpRequest || otpRequest.expiresAt < Date.now() || !validCode)
      return unauthorized(res);
    const user = getOrCreateUser(body?.identifier || otpRequest.identifier);
    const isNewUser = !user.profile;
    const tokens = issueTokens(user);
    return json(res, 200, {
      ...tokens,
      userId: user.id,
      sessionId: id('ses'),
      displayIdentifier: user.displayIdentifier,
      isNewUser,
    });
  }

  if (method === 'POST' && path === '/auth/login') {
    const user = getOrCreateUser(
      body?.identifier || body?.email || 'demo@health.local',
    );
    const tokens = issueTokens(user);
    return json(res, 200, { user: publicUser(user), tokens });
  }

  if (method === 'POST' && path === '/auth/refresh') {
    const userId = state.refreshTokens.get(body?.refreshToken);
    const user = [...state.users.values()].find(item => item.id === userId);
    if (!user) return unauthorized(res);
    return json(res, 200, {
      user: publicUser(user),
      tokens: issueTokens(user),
    });
  }

  if (method === 'POST' && path === '/auth/logout')
    return json(res, 200, { ok: true });

  if (method === 'GET' && path === '/auth/me') {
    const user = currentUser(req) || getOrCreateUser('demo@health.local');
    return json(res, 200, publicUser(user));
  }

  if (method === 'PUT' && path === '/users/me/profile') {
    const user = currentUser(req) || getOrCreateUser('demo@health.local');
    user.profile = {
      fullName: body?.fullName || user.username,
      avatarUrl: body?.avatarUrl || null,
      gender: body?.gender || null,
      birthDate: body?.birthDate || null,
      birthday: body?.birthDate || null,
      heightCm: Number(body?.heightCm || 0),
      height: Number(body?.heightCm || 0),
      weightKg: Number(body?.weightKg || 0),
      weight: Number(body?.weightKg || 0),
    };
    user.updatedAt = nowIso();
    return json(res, 200, publicUser(user));
  }

  if (method === 'POST' && path === '/media/chat/presign-put')
    return createPresign(res, 'chat', body);
  if (method === 'POST' && path === '/media/nutrition/presign-put')
    return createPresign(res, 'nutrition', body);

  const uploadMatch = path.match(/^\/uploads\/([^/]+)\/(.+)$/);
  if (uploadMatch && method === 'PUT') {
    const objectKey = `${uploadMatch[1]}/${decodeURIComponent(uploadMatch[2])}`;
    state.uploads.set(objectKey, {
      objectKey,
      contentType: req.headers['content-type'] || 'application/octet-stream',
      sizeBytes: Buffer.isBuffer(body) ? body.length : 0,
      uploadedAt: nowIso(),
    });
    return json(res, 200, { ok: true, objectKey });
  }

  if (method === 'POST' && path === '/nutrition/analyze') {
    if (!body?.objectKey) return badRequest(res, 'objectKey is required');
    const candidates = sampleFoods.map(food => ({
      ...food,
      serving: '1 portion',
      macros: { protein: food.protein, carbs: food.carbs, fat: food.fat },
      nutrition: {
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
      },
    }));
    return json(
      res,
      200,
      wrapped({
        isFood: true,
        message: 'Food detected by local backend mock analyzer.',
        primaryCandidate: candidates[0],
        candidates,
        rawRef: body.objectKey,
      }),
    );
  }

  if (method === 'POST' && path === '/nutrition/logs/confirm') {
    const food =
      sampleFoods.find(item => item.code === body?.foodCode) || sampleFoods[0];
    const log = { id: id('foodlog'), ...body, food, loggedAt: nowIso() };
    state.foodLogs.push(log);
    return json(res, 200, wrapped(log));
  }

  if (method === 'POST' && path === '/nutrition/logs/cancel')
    return json(res, 200, wrapped({ ok: true, ...body }));

  if (method === 'GET' && path === '/chat/sessions') {
    return json(
      res,
      200,
      wrapped(
        [...state.chatSessions.values()].sort((a, b) =>
          b.updatedAt.localeCompare(a.updatedAt),
        ),
      ),
    );
  }

  if (method === 'POST' && path === '/chat/sessions') {
    const session = {
      id: id('chat'),
      title: 'New chat',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      messages: [],
    };
    state.chatSessions.set(session.id, session);
    return json(res, 200, wrapped(session));
  }

  const chatMessagesMatch = path.match(/^\/chat\/sessions\/([^/]+)\/messages$/);
  if (chatMessagesMatch && method === 'GET') {
    const session = state.chatSessions.get(chatMessagesMatch[1]);
    return json(res, 200, wrapped(session ? session.messages : []));
  }
  if (chatMessagesMatch && method === 'POST') {
    let session = state.chatSessions.get(chatMessagesMatch[1]);
    if (!session) {
      session = {
        id: chatMessagesMatch[1],
        title: 'New chat',
        createdAt: nowIso(),
        updatedAt: nowIso(),
        messages: [],
      };
      state.chatSessions.set(session.id, session);
    }
    const userMessage = {
      id: id('msg'),
      role: 'USER',
      content: body?.content || '',
      imageObjectKey: body?.imageObjectKey || null,
      createdAt: nowIso(),
    };
    const assistantMessage = {
      id: id('msg'),
      role: 'ASSISTANT',
      content: chatAssistantReply(body?.content, Boolean(body?.imageObjectKey)),
      createdAt: nowIso(),
    };
    session.messages.push(userMessage, assistantMessage);
    session.title = userMessage.content
      ? userMessage.content.slice(0, 40)
      : session.title;
    session.updatedAt = nowIso();
    return json(res, 200, wrapped({ userMessage, assistantMessage }));
  }

  if (method === 'POST' && path === '/health/workouts/tracking/start') {
    const workout = {
      trackingId: id('trk'),
      workoutType: body?.workoutType || 'WALK',
      startedAt: nowIso(),
      endedAt: null,
      points: [],
      distanceKm: 0,
      steps: 0,
      pausedAt: null,
      pausedDurationMs: 0,
    };
    state.activeWorkouts.set(workout.trackingId, workout);
    return json(res, 200, {
      trackingId: workout.trackingId,
      startedAt: workout.startedAt,
    });
  }

  const trackingMatch = path.match(
    /^\/health\/workouts\/tracking\/([^/]+)\/(points|steps|pause|resume|end)$/,
  );
  if (trackingMatch)
    return handleTracking(
      res,
      trackingMatch[1],
      trackingMatch[2],
      method,
      body,
    );

  if (method === 'GET' && path === '/health/workouts') {
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const fromMs = from ? new Date(from).getTime() : -Infinity;
    const toMs = to ? new Date(to).getTime() : Infinity;
    const records = [
      ...state.workouts,
      ...[...state.activeWorkouts.values()].map(workoutRecord),
    ]
      .filter(record => {
        const start = new Date(record.time.startAt).getTime();
        return start >= fromMs && start <= toMs;
      })
      .sort(
        (a, b) =>
          new Date(b.time.endAt).getTime() - new Date(a.time.endAt).getTime(),
      );
    return json(res, 200, records);
  }

  return notFound(res);
}

function createPresign(res, scope, body) {
  const contentType = body?.contentType || 'application/octet-stream';
  const extension = contentType.includes('png')
    ? 'png'
    : contentType.includes('jpeg') || contentType.includes('jpg')
    ? 'jpg'
    : 'bin';
  const objectKey = `${scope}/${id('upload')}.${extension}`;
  const uploadUrl = `${PUBLIC_BASE_URL}/uploads/${objectKey}`;
  return json(
    res,
    200,
    wrapped({
      objectKey,
      uploadUrl,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      publicUrl: uploadUrl,
    }),
  );
}

function handleTracking(res, trackingId, action, method, body) {
  if (method !== 'POST') return notFound(res);
  const workout = state.activeWorkouts.get(trackingId);
  if (!workout) return notFound(res);

  if (action === 'points') {
    const points = Array.isArray(body?.points) ? body.points : [];
    for (const point of points) {
      const previous = workout.points[workout.points.length - 1];
      workout.distanceKm += haversineKm(previous, point);
      workout.points.push(point);
    }
    return json(res, 200, workoutStats(workout));
  }

  if (action === 'steps') {
    workout.steps = Math.max(workout.steps, Number(body?.stepsTotal || 0));
    return json(res, 200, workoutStats(workout));
  }

  if (action === 'pause') {
    workout.pausedAt = workout.pausedAt || Date.now();
    return json(res, 200, { ok: true, pausedAt: nowIso() });
  }

  if (action === 'resume') {
    if (workout.pausedAt)
      workout.pausedDurationMs += Date.now() - workout.pausedAt;
    workout.pausedAt = null;
    return json(res, 200, { ok: true, resumedAt: nowIso() });
  }

  if (action === 'end') {
    workout.endedAt = nowIso();
    const record = workoutRecord(workout);
    state.workouts.push(record);
    state.activeWorkouts.delete(trackingId);
    return json(res, 200, record);
  }

  return notFound(res);
}

const server = http.createServer((req, res) => {
  handle(req, res).catch(error => {
    console.error(error);
    json(res, 500, { message: error.message || 'Internal server error' });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`DACN2 local backend listening on http://${HOST}:${PORT}`);
  console.log(`Public URL for presigned uploads: ${PUBLIC_BASE_URL}`);
  console.log(`Development OTP code: ${DEFAULT_OTP}`);
});
