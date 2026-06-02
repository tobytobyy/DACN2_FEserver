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
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const HOST = process.env.BE_HOST || '0.0.0.0';
const PORT = Number(process.env.BE_PORT || process.env.PORT || 8080);
const PUBLIC_BASE_URL = process.env.BE_PUBLIC_URL || `http://localhost:${PORT}`;
const DEFAULT_OTP = process.env.BE_DEFAULT_OTP || '123456';
const DB_PATH =
  process.env.BE_DB_PATH || path.join(__dirname, 'data', 'db.json');

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
  feedback: [],
  medicationPlans: [],
};
const medicineDictionary = [
  {
    id: 'paracetamol',
    name: 'Paracetamol',
    category: 'Giảm đau / hạ sốt',
    summary:
      'Thường dùng để giảm đau nhẹ đến vừa và hạ sốt. Cần tránh dùng quá liều, đặc biệt khi có bệnh gan.',
    commonDosage: 'Theo chỉ định bác sĩ; người lớn thường 500mg/lần.',
    cautions: [
      'Không tự ý dùng quá liều.',
      'Tránh phối hợp nhiều thuốc cùng chứa paracetamol.',
    ],
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    category: 'Kháng viêm không steroid',
    summary:
      'Có thể hỗ trợ giảm đau, hạ sốt và kháng viêm. Nên dùng sau ăn và thận trọng nếu có bệnh dạ dày/thận.',
    commonDosage:
      'Theo chỉ định bác sĩ; không dùng kéo dài khi chưa được tư vấn.',
    cautions: [
      'Có thể kích ứng dạ dày.',
      'Không phù hợp với một số người bệnh thận hoặc đang dùng thuốc chống đông.',
    ],
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    category: 'Kháng sinh',
    summary:
      'Kháng sinh beta-lactam, chỉ nên dùng khi có chỉ định. Cần uống đủ liệu trình để hạn chế kháng thuốc.',
    commonDosage: 'Theo đơn bác sĩ, tùy loại nhiễm khuẩn.',
    cautions: [
      'Không tự ý dùng kháng sinh.',
      'Báo bác sĩ nếu dị ứng penicillin.',
    ],
  },
  {
    id: 'loratadine',
    name: 'Loratadine',
    category: 'Kháng histamine',
    summary:
      'Thường dùng để giảm triệu chứng dị ứng như hắt hơi, sổ mũi, ngứa mắt.',
    commonDosage: 'Theo hướng dẫn trên đơn/nhãn thuốc.',
    cautions: [
      'Tham khảo bác sĩ nếu đang mang thai, cho con bú hoặc có bệnh nền.',
    ],
  },
];

const sampleFoods = [
  {
    code: 'chicken-rice',
    name: 'Chicken rice',
    calories: 520,
    protein: 34,
    carbs: 58,
    fat: 14,
    serving: '1 đĩa vừa (~420g)',
    aiInsight:
      'Khẩu phần giàu tinh bột và đạm, phù hợp sau vận động; nên thêm rau để tăng chất xơ.',
    score: 0.91,
  },
  {
    code: 'beef-pho',
    name: 'Beef pho',
    calories: 430,
    protein: 27,
    carbs: 54,
    fat: 10,
    serving: '1 tô vừa (~500ml)',
    aiInsight:
      'Món nước có natri tương đối cao; cân bằng bằng nước lọc và rau trong bữa tiếp theo.',
    score: 0.78,
  },
  {
    code: 'mixed-salad',
    name: 'Mixed salad',
    calories: 260,
    protein: 9,
    carbs: 22,
    fat: 15,
    serving: '1 tô salad (~300g)',
    aiInsight:
      'Bữa nhẹ nhiều chất xơ; nếu dùng làm bữa chính hãy bổ sung thêm nguồn đạm nạc.',
    score: 0.66,
  },
];

function ensureDbDirectory() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

function serializeDb() {
  return {
    users: [...state.users.entries()],
    tokens: [...state.tokens.entries()],
    refreshTokens: [...state.refreshTokens.entries()],
    otpRequests: [...state.otpRequests.entries()],
    chatSessions: [...state.chatSessions.entries()],
    workouts: state.workouts,
    uploads: [...state.uploads.entries()],
    foodLogs: state.foodLogs,
    feedback: state.feedback,
    medicationPlans: state.medicationPlans,
  };
}

function persistDb() {
  try {
    ensureDbDirectory();
    fs.writeFileSync(DB_PATH, JSON.stringify(serializeDb(), null, 2), 'utf8');
  } catch (error) {
    console.warn('Persist database failed:', error.message);
  }
}

function hydrateDb() {
  try {
    if (!fs.existsSync(DB_PATH)) return;
    const raw = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    state.users = new Map(raw.users || []);
    state.tokens = new Map(raw.tokens || []);
    state.refreshTokens = new Map(raw.refreshTokens || []);
    state.otpRequests = new Map(raw.otpRequests || []);
    state.chatSessions = new Map(raw.chatSessions || []);
    state.uploads = new Map(raw.uploads || []);
    state.workouts = Array.isArray(raw.workouts) ? raw.workouts : [];
    state.foodLogs = Array.isArray(raw.foodLogs) ? raw.foodLogs : [];
    state.feedback = Array.isArray(raw.feedback) ? raw.feedback : [];
    state.medicationPlans = Array.isArray(raw.medicationPlans)
      ? raw.medicationPlans
      : [];
  } catch (error) {
    console.warn(
      'Load database failed, starting with empty database:',
      error.message,
    );
  }
}

hydrateDb();

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
    healthMetrics: {
      heightCm: 0,
      weightKg: 0,
      bloodType: null,
      conditions: [],
    },
    goals: { stepGoal: 10000, waterGoalMl: 2000, sleepGoalHours: 8 },
    status: 'ACTIVE',
    roles: ['USER'],
    lastLoginAt: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  state.users.set(normalized, user);
  persistDb();
  return user;
}

function issueTokens(user) {
  const accessToken = id('access');
  const refreshToken = id('refresh');
  state.tokens.set(accessToken, user.id);
  state.refreshTokens.set(refreshToken, user.id);
  user.lastLoginAt = nowIso();
  user.updatedAt = nowIso();
  persistDb();
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
    healthMetrics: user.healthMetrics || {},
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

function buildDailyAiAnalysis({ date, summary }) {
  const steps =
    Number(String(summary?.steps || '0').replace(/[^0-9]/g, '')) || 0;
  const heart =
    Number(String(summary?.heartRate || '78').replace(/[^0-9]/g, '')) || 78;
  const sleepMatch = String(summary?.sleep || '7h 0m').match(
    /(\d+)h\s*(\d+)?/i,
  );
  const sleepHours = sleepMatch
    ? Number(sleepMatch[1]) + Number(sleepMatch[2] || 0) / 60
    : 7;

  const readinessScore = Math.max(
    45,
    Math.min(
      96,
      Math.round(
        55 +
          Math.min(steps, 10000) / 250 +
          Math.min(sleepHours, 8.5) * 3 -
          Math.max(heart - 85, 0) * 0.6,
      ),
    ),
  );

  const focus = [];
  if (steps < 7000) focus.push('Tăng vận động nhẹ sau bữa ăn 10-15 phút.');
  if (sleepHours < 7) focus.push('Ưu tiên ngủ sớm hơn 30 phút tối nay.');
  if (heart > 90)
    focus.push('Theo dõi stress, caffeine và nghỉ 5 phút thở chậm.');
  if (focus.length === 0)
    focus.push('Duy trì nhịp sinh hoạt hiện tại và thêm rau xanh ở bữa chính.');

  return {
    date,
    readinessScore,
    summary: `AI đánh giá ngày ${date}: mức sẵn sàng ${readinessScore}/100 dựa trên bước chân, nhịp tim và giấc ngủ.`,
    targetUsers: [
      'Người bận rộn cần theo dõi sức khỏe hằng ngày nhanh.',
      'Người đang kiểm soát cân nặng, calories và thói quen vận động.',
      'Người mới bắt đầu luyện tập cần gợi ý dễ hiểu, không thay thế bác sĩ.',
    ],
    missingForHealthApp: [
      'Đồng bộ dữ liệu thiết bị đeo để thay mock heart/sleep bằng số đo thật.',
      'Nhật ký calories theo ngày, mục tiêu macro cá nhân hóa và cảnh báo dị ứng.',
      'Feedback sau trải nghiệm để đo độ chính xác AI và độ dễ dùng của UI.',
    ],
    optimizations: [
      'Ưu tiên offline-first cache cho dashboard, lịch và nhật ký món ăn.',
      'Thêm kiểm tra chất lượng tín hiệu khi đo nhịp tim bằng camera.',
      'Hiển thị confidence/khẩu phần khi AI nhận diện món ăn để người dùng chỉnh lại.',
    ],
    actionPlan: focus,
    disclaimer:
      'Thông tin do AI tạo chỉ để tham khảo sức khỏe tổng quát, không dùng để chẩn đoán hoặc cấp cứu.',
  };
}

function isHealthQuestion(content, hasImage) {
  if (hasImage) return true;
  const text = String(content || '').toLowerCase();
  return /health|sức khỏe|suc khoe|tim|heart|bpm|nhịp tim|nhip tim|thuốc|thuoc|medicine|medication|đơn thuốc|don thuoc|đau|dau|sốt|sot|ngủ|ngu|sleep|nước|nuoc|water|calo|calorie|nutrition|dinh dưỡng|dinh duong|bước|buoc|step|walk|huyết áp|huyet ap|blood pressure|đường huyết|duong huyet|stress|căng thẳng|can nang|cân nặng|height|weight|exercise|tập|tap/i.test(
    text,
  );
}

async function chatAssistantReply(content, hasImage) {
  const text = String(content || '').trim();
  if (!isHealthQuestion(text, hasImage)) {
    return 'Tôi không thể hỗ trợ bạn ngoài vấn đề sức khỏe';
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (apiKey) {
    try {
      const Groq = require('groq');
      const client = new Groq({ apiKey });
      const completion = await client.chat.completions.create({
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        temperature: 0.3,
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content:
              'Bạn là trợ lý sức khỏe trong app theo dõi sức khỏe. Chỉ trả lời câu hỏi liên quan sức khỏe, thuốc, dinh dưỡng, vận động, giấc ngủ, nước uống. Nếu nội dung không liên quan sức khỏe, trả lời đúng câu: Tôi không thể hỗ trợ bạn ngoài vấn đề sức khỏe. Luôn nhắc người dùng đi khám/cấp cứu khi có triệu chứng nghiêm trọng và không thay thế bác sĩ.',
          },
          {
            role: 'user',
            content: hasImage ? `${text}\nNgười dùng có gửi kèm ảnh.` : text,
          },
        ],
      });
      const answer = completion.choices?.[0]?.message?.content?.trim();
      if (answer) return answer;
    } catch (error) {
      console.warn('Groq health assistant fallback:', error.message);
    }
  }

  if (hasImage) {
    return 'Mình đã nhận ảnh của bạn. Nếu đây là ảnh món ăn, hãy dùng Calories Scan để phân tích calories; nếu là vấn đề sức khỏe nghiêm trọng, hãy liên hệ bác sĩ.';
  }
  if (/thuốc|thuoc|medicine|medication/i.test(text))
    return 'Bạn có thể dùng mục Nhắc thuốc để tra cứu thông tin thuốc, đặt giờ uống và theo dõi số lượng còn lại. Lưu ý dùng thuốc theo đơn bác sĩ.';
  if (/water|nước|nuoc/i.test(text))
    return 'Bạn nên chia lượng nước trong ngày thành nhiều lần uống nhỏ và theo dõi mục tiêu hằng ngày.';
  if (/sleep|ngủ|ngu/i.test(text))
    return 'Hãy cố gắng ngủ đúng giờ, hạn chế màn hình trước khi ngủ và duy trì 7-9 giờ ngủ mỗi đêm.';
  if (/step|walk|bước|đi bộ/i.test(text))
    return 'Một mục tiêu tốt là 8.000-10.000 bước/ngày. Bạn có thể bắt đầu bằng các đoạn đi bộ ngắn sau bữa ăn.';
  if (/calo|calorie|nutrition|dinh dưỡng|dinh duong/i.test(text))
    return 'Bạn nên ghi nhận khẩu phần, calories và macro mỗi bữa. Nếu có ảnh món ăn, hãy dùng Calories Scan để ước tính nhanh.';
  return 'Mình có thể hỗ trợ các vấn đề sức khỏe như dinh dưỡng, thuốc, nhịp tim, giấc ngủ, nước uống và vận động. Bạn hãy mô tả triệu chứng hoặc mục tiêu sức khỏe cụ thể hơn nhé.';
}

async function handle(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, null);

  const url = new URL(req.url, PUBLIC_BASE_URL);
  const requestPath = url.pathname;
  const method = req.method;
  const body = await readBody(req);

  if (method === 'GET' && (requestPath === '/' || requestPath === '/health')) {
    return json(res, 200, {
      ok: true,
      service: 'DACN2 local backend',
      time: nowIso(),
    });
  }

  if (method === 'POST' && requestPath === '/auth/otp/request') {
    const identifier = normalizeIdentifier(body?.identifier);
    const otpRequest = {
      otpRequestId: id('otp'),
      identifier,
      channel: body?.channel || 'EMAIL',
      code: DEFAULT_OTP,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    state.otpRequests.set(otpRequest.otpRequestId, otpRequest);
    persistDb();
    return json(res, 200, {
      otpRequestId: otpRequest.otpRequestId,
      expiresInSeconds: 300,
      devCode: DEFAULT_OTP,
    });
  }

  if (method === 'POST' && requestPath === '/auth/otp/verify') {
    const otpRequest = state.otpRequests.get(body?.otpRequestId);
    const validCode =
      String(body?.code || '') === DEFAULT_OTP ||
      /^\d{6}$/.test(String(body?.code || ''));
    if (!otpRequest || otpRequest.expiresAt < Date.now() || !validCode)
      return unauthorized(res);
    const user = getOrCreateUser(body?.identifier || otpRequest.identifier);
    const isNewUser = !user.profile;
    const tokens = issueTokens(user);
    persistDb();
    return json(res, 200, {
      ...tokens,
      userId: user.id,
      sessionId: id('ses'),
      displayIdentifier: user.displayIdentifier,
      isNewUser,
    });
  }

  if (method === 'POST' && requestPath === '/auth/login') {
    const user = getOrCreateUser(
      body?.identifier || body?.email || 'demo@health.local',
    );
    const tokens = issueTokens(user);
    return json(res, 200, { user: publicUser(user), tokens });
  }

  if (method === 'POST' && requestPath === '/auth/register') {
    const identifier = normalizeIdentifier(
      body?.identifier || body?.email || body?.phone || 'demo@health.local',
    );
    const user = getOrCreateUser(identifier);
    if (body?.fullName) {
      user.profile = {
        ...(user.profile || {}),
        fullName: body.fullName,
        avatarUrl: body?.avatarUrl || user.profile?.avatarUrl || null,
      };
    }
    user.updatedAt = nowIso();
    const tokens = issueTokens(user);
    persistDb();
    return json(res, 200, { user: publicUser(user), tokens });
  }

  if (method === 'POST' && requestPath === '/auth/refresh') {
    const userId = state.refreshTokens.get(body?.refreshToken);
    const user = [...state.users.values()].find(item => item.id === userId);
    if (!user) return unauthorized(res);
    return json(res, 200, {
      user: publicUser(user),
      tokens: issueTokens(user),
    });
  }

  if (method === 'POST' && requestPath === '/auth/logout')
    return json(res, 200, { ok: true });

  if (method === 'GET' && requestPath === '/auth/me') {
    const user = currentUser(req) || getOrCreateUser('demo@health.local');
    return json(res, 200, publicUser(user));
  }

  if (method === 'PUT' && requestPath === '/users/me/profile') {
    const user = currentUser(req) || getOrCreateUser('demo@health.local');
    const previousProfile = user.profile || {};
    const heightCm = Number(body?.heightCm ?? previousProfile.heightCm ?? 0);
    const weightKg = Number(body?.weightKg ?? previousProfile.weightKg ?? 0);
    user.profile = {
      ...previousProfile,
      fullName: body?.fullName || previousProfile.fullName || user.username,
      avatarUrl: body?.avatarUrl ?? previousProfile.avatarUrl ?? null,
      gender: body?.gender ?? previousProfile.gender ?? null,
      birthDate: body?.birthDate ?? previousProfile.birthDate ?? null,
      birthday: body?.birthDate ?? previousProfile.birthday ?? null,
      heightCm,
      height: heightCm,
      weightKg,
      weight: weightKg,
    };
    user.healthMetrics = {
      ...(user.healthMetrics || {}),
      heightCm,
      weightKg,
      bloodType: body?.bloodType ?? user.healthMetrics?.bloodType ?? null,
      conditions: Array.isArray(body?.conditions)
        ? body.conditions
        : user.healthMetrics?.conditions || [],
      updatedAt: nowIso(),
    };
    user.updatedAt = nowIso();
    persistDb();
    return json(res, 200, publicUser(user));
  }

  if (method === 'PUT' && requestPath === '/users/me/health-metrics') {
    const user = currentUser(req) || getOrCreateUser('demo@health.local');
    user.healthMetrics = {
      ...(user.healthMetrics || {}),
      heightCm: Number(body?.heightCm ?? user.healthMetrics?.heightCm ?? 0),
      weightKg: Number(body?.weightKg ?? user.healthMetrics?.weightKg ?? 0),
      bloodType: body?.bloodType ?? user.healthMetrics?.bloodType ?? null,
      conditions: Array.isArray(body?.conditions)
        ? body.conditions
        : user.healthMetrics?.conditions || [],
      restingHeartRate: Number(
        body?.restingHeartRate ?? user.healthMetrics?.restingHeartRate ?? 0,
      ),
      updatedAt: nowIso(),
    };
    user.updatedAt = nowIso();
    persistDb();
    return json(res, 200, wrapped(user.healthMetrics));
  }

  if (method === 'POST' && requestPath === '/media/chat/presign-put')
    return createPresign(res, 'chat', body);
  if (method === 'POST' && requestPath === '/media/nutrition/presign-put')
    return createPresign(res, 'nutrition', body);

  const uploadMatch = requestPath.match(/^\/uploads\/([^/]+)\/(.+)$/);
  if (uploadMatch && method === 'PUT') {
    const objectKey = `${uploadMatch[1]}/${decodeURIComponent(uploadMatch[2])}`;
    state.uploads.set(objectKey, {
      objectKey,
      contentType: req.headers['content-type'] || 'application/octet-stream',
      sizeBytes: Buffer.isBuffer(body) ? body.length : 0,
      uploadedAt: nowIso(),
    });
    persistDb();
    return json(res, 200, { ok: true, objectKey });
  }

  if (method === 'POST' && requestPath === '/ai/feedback') {
    const feedback = {
      id: id('fb'),
      rating: Number(body?.rating || 0),
      comment: String(body?.comment || ''),
      context: body?.context || 'general',
      createdAt: nowIso(),
    };
    state.feedback.push(feedback);
    persistDb();
    return json(res, 200, wrapped(feedback));
  }

  if (method === 'POST' && requestPath === '/ai/daily-analysis') {
    console.log('BODY=', body);
    return json(
      res,
      200,
      wrapped(
        buildDailyAiAnalysis({
          date: body?.date || nowIso().slice(0, 10),
          summary: body?.summary,
        }),
      ),
    );
  }

  if (method === 'POST' && requestPath === '/nutrition/analyze') {
    if (!body?.objectKey) return badRequest(res, 'objectKey is required');
    const candidates = sampleFoods.map(food => ({
      code: food.code,
      score: food.score,
      status: food.score >= 0.7 ? 'OK' : 'UNKNOWN',
      serving: food.serving,
      aiInsight: food.aiInsight,
      foodItem: {
        name: food.name,
        kcal: food.calories,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        serving: food.serving,
      },
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

  if (method === 'POST' && requestPath === '/nutrition/logs/confirm') {
    const food =
      sampleFoods.find(item => item.code === body?.foodCode) || sampleFoods[0];
    const log = { id: id('foodlog'), ...body, food, loggedAt: nowIso() };
    state.foodLogs.push(log);
    persistDb();
    return json(res, 200, wrapped(log));
  }

  if (method === 'POST' && requestPath === '/nutrition/logs/cancel')
    return json(res, 200, wrapped({ ok: true, ...body }));

  if (method === 'GET' && requestPath === '/medications/search') {
    const q = String(url.searchParams.get('q') || '')
      .trim()
      .toLowerCase();
    const results = medicineDictionary.filter(item =>
      `${item.name} ${item.category} ${item.summary}`.toLowerCase().includes(q),
    );
    return json(res, 200, wrapped(q ? results : medicineDictionary));
  }

  if (method === 'GET' && requestPath === '/medication-plans') {
    const user = currentUser(req) || getOrCreateUser('demo@health.local');
    const plans = state.medicationPlans
      .filter(plan => plan.userId === user.id)
      .sort((a, b) =>
        String(a.reminderTime).localeCompare(String(b.reminderTime)),
      );
    return json(res, 200, wrapped(plans));
  }

  if (method === 'POST' && requestPath === '/medication-plans') {
    const user = currentUser(req) || getOrCreateUser('demo@health.local');
    const totalQuantity = Math.max(1, Number(body?.totalQuantity || 1));
    const plan = {
      id: id('medplan'),
      userId: user.id,
      medicineName: String(body?.medicineName || '').trim(),
      dosage: String(body?.dosage || '1 viên').trim(),
      totalQuantity,
      quantityRemaining: Math.min(
        totalQuantity,
        Math.max(0, Number(body?.quantityRemaining ?? totalQuantity)),
      ),
      reminderTime: String(body?.reminderTime || '08:00'),
      notes: String(body?.notes || ''),
      status: 'ACTIVE',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      completedAt: null,
    };
    if (!plan.medicineName) return badRequest(res, 'medicineName is required');
    state.medicationPlans.push(plan);
    persistDb();
    return json(res, 200, wrapped(plan));
  }

  const medicationPlanMatch = requestPath.match(
    /^\/medication-plans\/([^/]+)(?:\/(take))?$/,
  );
  if (medicationPlanMatch) {
    const user = currentUser(req) || getOrCreateUser('demo@health.local');
    const plan = state.medicationPlans.find(
      item => item.id === medicationPlanMatch[1] && item.userId === user.id,
    );
    if (!plan) return notFound(res);

    if (method === 'DELETE' && !medicationPlanMatch[2]) {
      state.medicationPlans = state.medicationPlans.filter(
        item => item.id !== plan.id,
      );
      persistDb();
      return json(res, 200, wrapped({ ok: true }));
    }

    if (method === 'PATCH' && !medicationPlanMatch[2]) {
      Object.assign(plan, {
        medicineName: body?.medicineName ?? plan.medicineName,
        dosage: body?.dosage ?? plan.dosage,
        totalQuantity: Number(body?.totalQuantity ?? plan.totalQuantity),
        quantityRemaining: Number(
          body?.quantityRemaining ?? plan.quantityRemaining,
        ),
        reminderTime: body?.reminderTime ?? plan.reminderTime,
        notes: body?.notes ?? plan.notes,
        updatedAt: nowIso(),
      });
      persistDb();
      return json(res, 200, wrapped(plan));
    }

    if (method === 'POST' && medicationPlanMatch[2] === 'take') {
      const amount = Math.max(1, Number(body?.amount || 1));
      plan.quantityRemaining = Math.max(
        0,
        Number(plan.quantityRemaining || 0) - amount,
      );
      plan.updatedAt = nowIso();
      if (plan.quantityRemaining === 0 && plan.status !== 'COMPLETED') {
        plan.status = 'COMPLETED';
        plan.completedAt = nowIso();
      }
      persistDb();
      return json(
        res,
        200,
        wrapped({
          ...plan,
          completed: plan.quantityRemaining === 0,
          message:
            plan.quantityRemaining === 0
              ? 'Bạn đã sử dụng hết thuốc. Hãy kê đơn tiếp theo nếu có.'
              : 'Đã ghi nhận uống thuốc.',
        }),
      );
    }
  }

  if (method === 'GET' && requestPath === '/chat/sessions') {
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

  if (method === 'POST' && requestPath === '/chat/sessions') {
    const session = {
      id: id('chat'),
      title: 'New chat',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      messages: [],
    };
    state.chatSessions.set(session.id, session);
    persistDb();
    return json(res, 200, wrapped(session));
  }

  const chatMessagesMatch = requestPath.match(
    /^\/chat\/sessions\/([^/]+)\/messages$/,
  );
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
      content: await chatAssistantReply(
        body?.content,
        Boolean(body?.imageObjectKey),
      ),
      createdAt: nowIso(),
    };
    session.messages.push(userMessage, assistantMessage);
    session.title = userMessage.content
      ? userMessage.content.slice(0, 40)
      : session.title;
    session.updatedAt = nowIso();
    persistDb();
    return json(res, 200, wrapped({ userMessage, assistantMessage }));
  }

  if (method === 'POST' && requestPath === '/health/workouts/tracking/start') {
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
    persistDb();
    return json(res, 200, {
      trackingId: workout.trackingId,
      startedAt: workout.startedAt,
    });
  }

  const trackingMatch = requestPath.match(
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

  if (method === 'GET' && requestPath === '/health/workouts') {
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
    persistDb();
    persistDb();
    return json(res, 200, workoutStats(workout));
  }

  if (action === 'steps') {
    workout.steps = Math.max(workout.steps, Number(body?.stepsTotal || 0));
    return json(res, 200, workoutStats(workout));
  }

  if (action === 'pause') {
    workout.pausedAt = workout.pausedAt || Date.now();
    persistDb();
    return json(res, 200, { ok: true, pausedAt: nowIso() });
  }

  if (action === 'resume') {
    if (workout.pausedAt)
      workout.pausedDurationMs += Date.now() - workout.pausedAt;
    workout.pausedAt = null;
    persistDb();
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
