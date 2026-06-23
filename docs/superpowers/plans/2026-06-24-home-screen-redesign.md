# Home Screen Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild HomeScreen with a polished gradient header, live metrics from `/health/daily-aggregate`, and two new scrollable sections (reference ranges + RSS health articles).

**Architecture:** A central `useHomeData()` hook aggregates DailyAggregate + RSS; HomeScreen passes data down to all cards as props — no card fetches independently. WaterContext gains `initializeForDay()` to seed today's water from the server on mount.

**Tech Stack:** React Native 0.82 / TypeScript / TanStack Query v5 / react-native-linear-gradient (already installed v2.8.3) / react-native-rss-parser (to install) / Axios / React Context

## Global Constraints

- React Native 0.82.1, React 19.1.1 — no deprecated APIs
- TypeScript — no `any` unless at JSON parsing boundaries
- Path aliases: `@components/*`, `@context/*`, `@assets/*`, `@screens/*`, `@types/*` — always use them
- Always use the `api` Axios instance from `src/services/api.ts` (has auth interceptor + `unwrapApiData()`)
- TanStack Query v5 — `useQuery`, `useQueries`, `useMutation` (not v4 syntax)
- Conventional commits: use `npm run commit` or write message manually
- Primary color `#2D8C83`; spacing from `src/assets/theme/index.ts`
- No new libraries beyond `react-native-rss-parser`

---

### Task 1: Install dependency + define shared types

**Files:**
- Create: `src/types/home.ts`

**Interfaces:**
- Produces: `DailyMetrics`, `Article` — imported by every subsequent task

- [ ] **Step 1: Install react-native-rss-parser**

```bash
cd d:/DATN/DACN2_FEserver
npm install react-native-rss-parser
```

Expected: `added 1 package` (JS-only library — no native rebuild needed).

- [ ] **Step 2: Verify the /health/daily-aggregate response shape**

With the Spring Boot backend running (`cd ../DACN2_BEserver && ./mvnw spring-boot:run`), call:

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8080/health/daily-aggregate?date=$(date +%Y-%m-%d)"
```

Confirm the response contains (at minimum): `totalSteps`, `totalCaloriesOut`, `avgHeartRate`, `totalSleepMinutes`, `totalWaterMl`. If field names differ, adjust the `DailyMetrics` interface in the next step to match.

- [ ] **Step 3: Create `src/types/home.ts`**

```typescript
export interface DailyMetrics {
  date: string;
  totalSteps: number | null;
  totalCaloriesOut: number | null;
  avgHeartRate: number | null;
  totalSleepMinutes: number | null;
  totalWaterMl: number | null;
}

export interface Article {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string | null;
  source: string;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/types/home.ts package.json package-lock.json
git commit -m "feat: add shared home types and install react-native-rss-parser"
```

---

### Task 2: RSS service

**Files:**
- Create: `src/services/rss.ts`
- Create: `src/__tests__/services/rss.test.ts`

**Interfaces:**
- Produces: `fetchHealthArticles(): Promise<Article[]>` — consumed by `useHomeData`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/services/rss.test.ts`:

```typescript
import { fetchHealthArticles } from '../../services/rss';

global.fetch = jest.fn();

describe('fetchHealthArticles', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns parsed articles on success', async () => {
    const mockXml = `<?xml version="1.0"?>
      <rss version="2.0"><channel>
        <item>
          <title>Bài viết sức khỏe</title>
          <link>https://vnexpress.net/bai-viet-1.html</link>
          <pubDate>Mon, 24 Jun 2026 10:00:00 +0700</pubDate>
          <description><![CDATA[<img src="https://img.example.com/thumb.jpg"/>Mô tả]]></description>
        </item>
      </channel></rss>`;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => mockXml,
    });

    const articles = await fetchHealthArticles();
    expect(articles).toHaveLength(1);
    expect(articles[0].title).toBe('Bài viết sức khỏe');
    expect(articles[0].link).toBe('https://vnexpress.net/bai-viet-1.html');
    expect(articles[0].source).toBe('VnExpress');
  });

  it('returns empty array on network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    expect(await fetchHealthArticles()).toEqual([]);
  });

  it('returns empty array on non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    expect(await fetchHealthArticles()).toEqual([]);
  });

  it('returns at most 5 articles', async () => {
    const items = Array.from({ length: 10 }, (_, i) => `
      <item>
        <title>Article ${i}</title>
        <link>https://vnexpress.net/article-${i}.html</link>
        <pubDate>Mon, 24 Jun 2026 10:00:00 +0700</pubDate>
      </item>`).join('');

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () =>
        `<?xml version="1.0"?><rss version="2.0"><channel>${items}</channel></rss>`,
    });

    const articles = await fetchHealthArticles();
    expect(articles.length).toBeLessThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern=rss.test
```

Expected: FAIL with "Cannot find module '../../services/rss'"

- [ ] **Step 3: Implement `src/services/rss.ts`**

```typescript
import RSSParser from 'react-native-rss-parser';
import type { Article } from '../types/home';

const VNEXPRESS_HEALTH_RSS = 'https://vnexpress.net/rss/suc-khoe.rss';
const MAX_ARTICLES = 5;

const extractThumbnail = (description: string | undefined): string | null => {
  if (!description) return null;
  const match = description.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
};

export const fetchHealthArticles = async (): Promise<Article[]> => {
  try {
    const response = await fetch(VNEXPRESS_HEALTH_RSS);
    if (!response.ok) return [];

    const xml = await response.text();
    const feed = await RSSParser.parse(xml);

    return feed.items.slice(0, MAX_ARTICLES).map(item => ({
      title: item.title ?? '',
      link: item.links?.[0]?.url ?? '',
      pubDate: item.published ?? '',
      thumbnail: extractThumbnail(item.description ?? undefined),
      source: 'VnExpress',
    }));
  } catch {
    return [];
  }
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern=rss.test
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/services/rss.ts src/__tests__/services/rss.test.ts
git commit -m "feat: add RSS service for VnExpress health articles"
```

---

### Task 3: useHomeData hook

**Files:**
- Create: `src/hooks/useHomeData.ts`
- Create: `src/__tests__/hooks/useHomeData.test.ts`

**Interfaces:**
- Consumes: `DailyMetrics`, `Article` from `src/types/home.ts`; `fetchHealthArticles()` from `src/services/rss.ts`; `api`, `unwrapApiData` from `src/services/api.ts`; `useUser()` from `src/context/UserContext.tsx`
- Produces:
  ```typescript
  useHomeData(): {
    metrics: DailyMetrics | null;
    weekMetrics: DailyMetrics[];   // last 7 days, for streak calculation
    user: User | null;
    articles: Article[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  }
  ```

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/hooks/useHomeData.test.ts`:

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useHomeData } from '../../hooks/useHomeData';

jest.mock('../../services/api', () => ({
  api: { get: jest.fn() },
  unwrapApiData: (data: any) => data?.data ?? data,
}));

jest.mock('../../services/rss', () => ({
  fetchHealthArticles: jest.fn().mockResolvedValue([
    {
      title: 'Article 1',
      link: 'https://example.com/1',
      pubDate: '',
      thumbnail: null,
      source: 'VnExpress',
    },
  ]),
}));

jest.mock('../../context/UserContext', () => ({
  useUser: () => ({
    user: {
      id: '1',
      displayIdentifier: 'user@example.com',
      profile: { fullName: 'Test User' },
    },
  }),
}));

// useFocusEffect is a no-op in tests (no navigation context)
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

const { api } = require('../../services/api');

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(
    QueryClientProvider,
    { client: new QueryClient({ defaultOptions: { queries: { retry: false } } }) },
    children,
  );

describe('useHomeData', () => {
  const mockMetrics = {
    date: '2026-06-24',
    totalSteps: 8000,
    totalCaloriesOut: 500,
    avgHeartRate: 72,
    totalSleepMinutes: 420,
    totalWaterMl: 1500,
  };

  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockMetrics });
  });

  afterEach(() => jest.clearAllMocks());

  it('returns metrics from daily-aggregate', async () => {
    const { result } = renderHook(() => useHomeData(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.metrics?.totalSteps).toBe(8000);
    expect(result.current.metrics?.avgHeartRate).toBe(72);
  });

  it('returns articles from RSS', async () => {
    const { result } = renderHook(() => useHomeData(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.articles).toHaveLength(1);
    expect(result.current.articles[0].title).toBe('Article 1');
  });

  it('returns user from UserContext', async () => {
    const { result } = renderHook(() => useHomeData(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user?.profile?.fullName).toBe('Test User');
  });

  it('sets isLoading true initially', () => {
    api.get.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useHomeData(), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern=useHomeData.test
```

Expected: FAIL with "Cannot find module '../../hooks/useHomeData'"

- [ ] **Step 3: Implement `src/hooks/useHomeData.ts`**

```typescript
import { useCallback, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { api, unwrapApiData } from '../services/api';
import { fetchHealthArticles } from '../services/rss';
import { useUser } from '../context/UserContext';
import type { DailyMetrics, Article } from '../types/home';

const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

const fetchDailyMetrics = async (date: string): Promise<DailyMetrics | null> => {
  try {
    const res = await api.get(`/health/daily-aggregate?date=${date}`);
    return unwrapApiData<DailyMetrics>(res.data);
  } catch {
    return null;
  }
};

export const useHomeData = () => {
  const { user } = useUser();

  const today = useMemo(() => formatDate(new Date()), []);

  const last7Days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return formatDate(d);
      }),
    [],
  );

  const todayQuery = useQuery({
    queryKey: ['daily-aggregate', today],
    queryFn: () => fetchDailyMetrics(today),
    staleTime: 0,
  });

  const weekQueries = useQueries({
    queries: last7Days.map(date => ({
      queryKey: ['daily-aggregate', date],
      queryFn: () => fetchDailyMetrics(date),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const articlesQuery = useQuery({
    queryKey: ['health-articles'],
    queryFn: fetchHealthArticles,
    staleTime: 30 * 60 * 1000,
  });

  const refetch = todayQuery.refetch;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const weekMetrics = weekQueries
    .map(q => q.data)
    .filter((d): d is DailyMetrics => d != null);

  return {
    metrics: todayQuery.data ?? null,
    weekMetrics,
    user,
    articles: articlesQuery.data ?? [],
    isLoading: todayQuery.isLoading || articlesQuery.isLoading,
    isError: todayQuery.isError,
    refetch,
  };
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern=useHomeData.test
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useHomeData.ts src/__tests__/hooks/useHomeData.test.ts
git commit -m "feat: add useHomeData hook aggregating DailyAggregate and RSS"
```

---

### Task 4: Add initializeForDay to WaterContext

**Files:**
- Modify: `src/context/WaterContext.tsx`
- Create: `src/__tests__/context/WaterContext.test.ts`

**Interfaces:**
- Produces: `initializeForDay(ml: number): void` added to `WaterContextType` and `useWater()` return; all existing methods unchanged

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/context/WaterContext.test.ts`:

```typescript
import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { WaterProvider, useWater } from '../../context/WaterContext';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(WaterProvider, null, children);

describe('WaterContext - initializeForDay', () => {
  it('initializes currentIntake from server value', () => {
    const { result } = renderHook(() => useWater(), { wrapper });
    expect(result.current.currentIntake).toBe(0);

    act(() => { result.current.initializeForDay(1500); });

    expect(result.current.currentIntake).toBe(1500);
  });

  it('does not re-initialize if already called (idempotent)', () => {
    const { result } = renderHook(() => useWater(), { wrapper });

    act(() => { result.current.initializeForDay(1500); });
    act(() => { result.current.addWater(250); });
    act(() => { result.current.initializeForDay(1500); }); // second call → no-op

    expect(result.current.currentIntake).toBe(1750); // not reset to 1500
  });

  it('addWater and deleteLog still work after initialization', () => {
    const { result } = renderHook(() => useWater(), { wrapper });

    act(() => { result.current.initializeForDay(1000); });
    act(() => { result.current.addWater(250); });
    expect(result.current.currentIntake).toBe(1250);

    const logId = result.current.history[0].id;
    act(() => { result.current.deleteLog(logId, 250); });
    expect(result.current.currentIntake).toBe(1000);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern=WaterContext.test
```

Expected: FAIL — `initializeForDay is not a function`

- [ ] **Step 3: Update `src/context/WaterContext.tsx`**

Replace the entire file:

```typescript
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from 'react';

export type WaterLog = {
  id: string;
  amount: number;
  time: string;
};

interface WaterContextType {
  dailyTarget: number;
  setDailyTarget: (amount: number) => void;
  cupSize: number;
  setCupSize: (amount: number) => void;
  currentIntake: number;
  history: WaterLog[];
  addWater: (amount: number) => void;
  deleteLog: (id: string, amount: number) => void;
  initializeForDay: (ml: number) => void;
}

const WaterContext = createContext<WaterContextType | undefined>(undefined);

export const WaterProvider = ({ children }: { children: ReactNode }) => {
  const [dailyTarget, setDailyTarget] = useState(2000);
  const [cupSize, setCupSize] = useState(250);
  const [currentIntake, setCurrentIntake] = useState(0);
  const [history, setHistory] = useState<WaterLog[]>([]);
  const [initialized, setInitialized] = useState(false);

  const addWater = (amount: number) => {
    const timeString = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newLog: WaterLog = {
      id: Date.now().toString(),
      amount,
      time: timeString,
    };
    setCurrentIntake(prev => Math.max(0, prev + amount));
    setHistory(prev => [newLog, ...prev]);
  };

  const deleteLog = (id: string, amount: number) => {
    setCurrentIntake(prev => Math.max(0, prev - amount));
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const initializeForDay = useCallback(
    (ml: number) => {
      if (initialized) return;
      setCurrentIntake(ml);
      setInitialized(true);
    },
    [initialized],
  );

  return (
    <WaterContext.Provider
      value={{
        dailyTarget,
        setDailyTarget,
        cupSize,
        setCupSize,
        currentIntake,
        history,
        addWater,
        deleteLog,
        initializeForDay,
      }}
    >
      {children}
    </WaterContext.Provider>
  );
};

export const useWater = () => {
  const context = useContext(WaterContext);
  if (!context) throw new Error('useWater must be used within a WaterProvider');
  return context;
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- --testPathPattern=WaterContext.test
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/context/WaterContext.tsx src/__tests__/context/WaterContext.test.ts
git commit -m "feat: add initializeForDay to WaterContext for server-seeded intake"
```

---

### Task 5: Refactor ActivityCard to accept external data props

**Files:**
- Modify: `src/components/Home/ActivityCard/ActivityCard.tsx`

**Interfaces:**
- Props change from (no props) to:
  ```typescript
  type Props = {
    steps: number | null;
    calories: number | null;
    targetSteps?: number;
    targetCalories?: number;
  }
  ```
- The `useActivityToday` hook in `index.ts` is left in place but no longer used by this component.

- [ ] **Step 1: Rewrite `src/components/Home/ActivityCard/ActivityCard.tsx`**

```typescript
import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import FootstepIcon from '@assets/icons/svgs/footprint_1515.svg';
import FireIcon from '@assets/icons/svgs/calories_1515.svg';
import styles from './styles';

const DEFAULT_STEPS_TARGET = 10000;
const DEFAULT_CALORIES_TARGET = 1000;

type Props = {
  steps: number | null;
  calories: number | null;
  targetSteps?: number;
  targetCalories?: number;
};

const ActivityCard: React.FC<Props> = ({
  steps,
  calories,
  targetSteps = DEFAULT_STEPS_TARGET,
  targetCalories = DEFAULT_CALORIES_TARGET,
}) => {
  const progressSteps =
    steps != null ? Math.min((steps / targetSteps) * 100, 100) : 0;
  const progressCalories =
    calories != null ? Math.min((calories / targetCalories) * 100, 100) : 0;

  const getProgressStyle = (percent: number, color: string): ViewStyle => ({
    width: `${percent}%` as `${number}%`,
    backgroundColor: color,
  });

  const stepsLabel = steps != null ? steps.toLocaleString() : '–';
  const caloriesLabel = calories != null ? String(calories) : '–';

  return (
    <View style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>Activity today</Text>
        <View style={styles.targetBadge}>
          <Text style={styles.targetText}>{progressCalories.toFixed(0)}%</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statLabelRow}>
            <FootstepIcon />
            <Text style={styles.statLabel}>FOOTSTEP</Text>
          </View>
          <Text style={styles.statValue}>{stepsLabel}</Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                getProgressStyle(progressSteps, '#10B981'),
              ]}
            />
          </View>
          <Text style={styles.unitText}>
            Target: {targetSteps.toLocaleString()} steps
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statLabelRow}>
            <FireIcon />
            <Text style={styles.statLabel}>CALO</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.statValue}>{caloriesLabel}</Text>
            {calories != null && <Text style={styles.unitText}> kcal</Text>}
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                getProgressStyle(progressCalories, '#EF4444'),
              ]}
            />
          </View>
          <Text style={styles.unitText}>Target: {targetCalories} kcal</Text>
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
```

- [ ] **Step 2: Run lint**

```bash
npm run lint -- src/components/Home/ActivityCard/ActivityCard.tsx
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Home/ActivityCard/ActivityCard.tsx
git commit -m "refactor: ActivityCard accepts external data props, removes internal fetch"
```

---

### Task 6: Update HeartSleepGrid for nullable data

**Files:**
- Modify: `src/components/Home/HeartSleepGrid/HeartSleepGrid.tsx`

**Interfaces:**
- Props change from `{ heartRate: number; heartStatus: HeartStatus; sleepHours: number; sleepMinutes: number; sleepTargetHours: number }` to:
  ```typescript
  type Props = {
    heartRate: number | null;
    sleepMinutes: number | null;
  }
  ```
- Status labels and sleep hours/minutes breakdown are now computed internally.

- [ ] **Step 1: Rewrite `src/components/Home/HeartSleepGrid/HeartSleepGrid.tsx`**

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import HeartIcon from '@assets/icons/svgs/heart.svg';
import PulseLine from '@assets/icons/svgs/heart_beat_2022.svg';
import MoonIcon from '@assets/icons/svgs/sleep_2424.svg';
import styles from './styles';

const SLEEP_TARGET_HOURS = 8;

type StatusLabel = { label: string; color: string };

const getHeartStatus = (bpm: number | null): StatusLabel => {
  if (bpm === null) return { label: 'No data', color: '#9CA3AF' };
  if (bpm < 60) return { label: 'Low', color: '#F97316' };
  if (bpm <= 100) return { label: 'Normal', color: '#10B981' };
  return { label: 'High', color: '#EF4444' };
};

const getSleepStatus = (totalMinutes: number | null): StatusLabel => {
  if (totalMinutes === null) return { label: 'No data', color: '#9CA3AF' };
  const h = totalMinutes / 60;
  if (h < 6) return { label: 'Low', color: '#F97316' };
  if (h <= 9) return { label: 'Normal', color: '#10B981' };
  return { label: 'Long', color: '#F97316' };
};

type Props = {
  heartRate: number | null;
  sleepMinutes: number | null;
};

const HeartCard: React.FC<{ heartRate: number | null }> = ({ heartRate }) => {
  const status = getHeartStatus(heartRate);
  return (
    <View style={styles.smallCard}>
      <View style={styles.heartDecorCircle} />
      <View style={styles.headerRow}>
        <View style={styles.heartIconCircle}>
          <HeartIcon color="#DF394C" fill="#DF394C" width={20} height={20} />
        </View>
        <Text style={styles.smallCardTitle}>Heart beat</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.bigValue}>
          {heartRate != null ? String(heartRate) : '–'}
        </Text>
        {heartRate != null && <Text style={styles.smallUnit}> BPM</Text>}
      </View>
      <View style={styles.statusRow}>
        <PulseLine color={status.color} fill={status.color} />
        <Text style={[styles.heartStatusText, { color: status.color }]}>
          {status.label}
        </Text>
      </View>
    </View>
  );
};

const SleepCard: React.FC<{ sleepMinutes: number | null }> = ({ sleepMinutes }) => {
  const status = getSleepStatus(sleepMinutes);
  const hours = sleepMinutes != null ? Math.floor(sleepMinutes / 60) : null;
  const mins = sleepMinutes != null ? sleepMinutes % 60 : null;
  const displayValue =
    hours != null && mins != null
      ? `${hours}h ${String(mins).padStart(2, '0')}`
      : '–';

  return (
    <View style={styles.smallCard}>
      <View style={styles.sleepDecorCircle} />
      <View style={styles.headerRow}>
        <View style={styles.sleepIconCircle}>
          <MoonIcon color="#6366F1" fill="#6366F1" width={20} height={20} />
        </View>
        <Text style={styles.smallCardTitle}>Sleep</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.bigValue}>{displayValue}</Text>
      </View>
      <Text style={[styles.targetLabel, { color: status.color }]}>
        {status.label}
      </Text>
      <Text style={styles.targetLabel}>Target: {SLEEP_TARGET_HOURS}h</Text>
    </View>
  );
};

const HeartSleepGrid: React.FC<Props> = ({ heartRate, sleepMinutes }) => (
  <View style={styles.gridContainer}>
    <HeartCard heartRate={heartRate} />
    <SleepCard sleepMinutes={sleepMinutes} />
  </View>
);

export default HeartSleepGrid;
```

- [ ] **Step 2: Run lint**

```bash
npm run lint -- src/components/Home/HeartSleepGrid/HeartSleepGrid.tsx
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Home/HeartSleepGrid/HeartSleepGrid.tsx
git commit -m "refactor: HeartSleepGrid accepts nullable props, computes status internally"
```

---

### Task 7: Redesign HeaderSection

**Files:**
- Modify: `src/components/Home/HeaderSection/HeaderSection.tsx`
- Modify: `src/components/Home/HeaderSection/styles.tsx`

**Interfaces:**
- Props change from `{ email: string; displayName?: string; avatarUrl?: string | null; greeting?: string; onPressAvatar?: () => void }` to:
  ```typescript
  type Props = {
    displayName?: string;
    avatarUrl?: string | null;
    streakDays?: number;       // 0 = hide pill
    onPressAvatar?: () => void;
  }
  ```
- `email` and `greeting` props are removed; greeting is computed internally from system time.

- [ ] **Step 1: Replace `src/components/Home/HeaderSection/styles.tsx`**

```typescript
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  gradient: {
    width: '100%',
    paddingBottom: 20,
    paddingTop: 12,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: 1,
  },
  greetingText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: 12,
    gap: 4,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  avatarButton: {
    padding: 2,
    marginLeft: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

- [ ] **Step 2: Replace `src/components/Home/HeaderSection/HeaderSection.tsx`**

```typescript
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import UserAvatar from '@assets/icons/svgs/account_circle.svg';
import styles from './styles';

type Props = {
  displayName?: string;
  avatarUrl?: string | null;
  streakDays?: number;
  onPressAvatar?: () => void;
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = (): string =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const HeaderSection: React.FC<Props> = ({
  displayName,
  avatarUrl,
  streakDays = 0,
  onPressAvatar,
}) => {
  const name = displayName?.trim() || 'there';

  return (
    <LinearGradient
      colors={['#2D8C83', '#1a5c56']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.content}>
        <View style={styles.leftCol}>
          <Text style={styles.greetingText}>
            {getGreeting()}, {name} 👋
          </Text>
          <Text style={styles.dateText}>{formatDate()}</Text>
          {streakDays > 0 && (
            <View style={styles.streakPill}>
              <Text>🔥</Text>
              <Text style={styles.streakText}>Day {streakDays} streak</Text>
            </View>
          )}
        </View>

        <Pressable style={styles.avatarButton} onPress={onPressAvatar}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <UserAvatar width={28} height={28} color="#FFFFFF" />
            </View>
          )}
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default HeaderSection;
```

- [ ] **Step 3: Run lint**

```bash
npm run lint -- src/components/Home/HeaderSection/
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/Home/HeaderSection/HeaderSection.tsx \
        src/components/Home/HeaderSection/styles.tsx
git commit -m "feat: redesign HeaderSection with gradient, time-based greeting, streak pill"
```

---

### Task 8: ReferenceRangesCard

**Files:**
- Create: `src/components/Home/ReferenceRangesCard/index.tsx`
- Create: `src/components/Home/ReferenceRangesCard/styles.tsx`

**Interfaces:**
- Consumes: `DailyMetrics | null` from `src/types/home.ts`
- Props: `{ metrics: DailyMetrics | null }`

- [ ] **Step 1: Create `src/components/Home/ReferenceRangesCard/styles.tsx`**

```typescript
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  card: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardNormal: { borderColor: '#10B981' },
  cardLow: { borderColor: '#F97316' },
  cardHigh: { borderColor: '#EF4444' },
  emoji: { fontSize: 22, marginBottom: 6 },
  metricName: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 2 },
  rangeText: { fontSize: 12, color: '#6B7280' },
  unitText: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
});
```

- [ ] **Step 2: Create `src/components/Home/ReferenceRangesCard/index.tsx`**

```typescript
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import type { DailyMetrics } from '../../../types/home';
import styles from './styles';

type RangeStatus = 'normal' | 'low' | 'high' | 'neutral';

interface MetricRef {
  key: string;
  emoji: string;
  name: string;
  range: string;
  unit: string;
  getStatus: (m: DailyMetrics | null) => RangeStatus;
}

const REFERENCE_METRICS: MetricRef[] = [
  {
    key: 'heart',
    emoji: '💓',
    name: 'Nhịp tim',
    range: '60 – 100',
    unit: 'bpm',
    getStatus: m => {
      if (!m || m.avgHeartRate == null) return 'neutral';
      if (m.avgHeartRate < 60) return 'low';
      if (m.avgHeartRate <= 100) return 'normal';
      return 'high';
    },
  },
  {
    key: 'sleep',
    emoji: '😴',
    name: 'Giấc ngủ',
    range: '7 – 9',
    unit: 'giờ',
    getStatus: m => {
      if (!m || m.totalSleepMinutes == null) return 'neutral';
      const h = m.totalSleepMinutes / 60;
      if (h < 7) return 'low';
      if (h <= 9) return 'normal';
      return 'high';
    },
  },
  {
    key: 'steps',
    emoji: '🚶',
    name: 'Bước chân',
    range: '8.000 – 10.000',
    unit: 'bước/ngày',
    getStatus: m => {
      if (!m || m.totalSteps == null) return 'neutral';
      if (m.totalSteps < 8000) return 'low';
      if (m.totalSteps <= 10000) return 'normal';
      return 'high';
    },
  },
  {
    key: 'water',
    emoji: '💧',
    name: 'Uống nước',
    range: '1.5 – 2.5',
    unit: 'L/ngày',
    getStatus: m => {
      if (!m || m.totalWaterMl == null) return 'neutral';
      const L = m.totalWaterMl / 1000;
      if (L < 1.5) return 'low';
      if (L <= 2.5) return 'normal';
      return 'high';
    },
  },
  {
    key: 'bmi',
    emoji: '⚖️',
    name: 'BMI',
    range: '18.5 – 24.9',
    unit: 'kg/m²',
    getStatus: () => 'neutral',
  },
  {
    key: 'bp',
    emoji: '🩺',
    name: 'Huyết áp',
    range: '90/60 – 120/80',
    unit: 'mmHg',
    getStatus: () => 'neutral',
  },
];

const STATUS_BORDER: Record<RangeStatus, object> = {
  normal: styles.cardNormal,
  low: styles.cardLow,
  high: styles.cardHigh,
  neutral: {},
};

type Props = { metrics: DailyMetrics | null };

const ReferenceRangesCard: React.FC<Props> = ({ metrics }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Chỉ số tham chiếu</Text>
    <FlatList
      data={REFERENCE_METRICS}
      keyExtractor={item => item.key}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => {
        const status = item.getStatus(metrics);
        return (
          <View style={[styles.card, STATUS_BORDER[status]]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.metricName}>{item.name}</Text>
            <Text style={styles.rangeText}>{item.range}</Text>
            <Text style={styles.unitText}>{item.unit}</Text>
          </View>
        );
      }}
    />
  </View>
);

export default ReferenceRangesCard;
```

- [ ] **Step 3: Run lint**

```bash
npm run lint -- src/components/Home/ReferenceRangesCard/
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/Home/ReferenceRangesCard/
git commit -m "feat: add ReferenceRangesCard with dynamic metric highlighting"
```

---

### Task 9: ArticlesSection

**Files:**
- Create: `src/components/Home/ArticlesSection/index.tsx`
- Create: `src/components/Home/ArticlesSection/styles.tsx`

**Interfaces:**
- Consumes: `Article[]` from `src/types/home.ts`
- Props: `{ articles: Article[] }`. Renders nothing when `articles` is empty.

- [ ] **Step 1: Create `src/components/Home/ArticlesSection/styles.tsx`**

```typescript
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  section: { marginTop: 16, marginBottom: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  seeMoreText: { fontSize: 13, color: '#2D8C83', fontWeight: '500' },
  articleRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  thumbnail: { width: 80, height: 80 },
  thumbnailPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: { fontSize: 28 },
  articleContent: { flex: 1, padding: 10, justifyContent: 'center' },
  articleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 18,
  },
  articleMeta: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
});
```

- [ ] **Step 2: Create `src/components/Home/ArticlesSection/index.tsx`**

```typescript
import React from 'react';
import { FlatList, Image, Linking, Pressable, Text, View } from 'react-native';
import type { Article } from '../../../types/home';
import styles from './styles';

const VNEXPRESS_HEALTH_URL = 'https://vnexpress.net/suc-khoe';

const formatRelativeTime = (pubDate: string): string => {
  if (!pubDate) return '';
  try {
    const diff = Date.now() - new Date(pubDate).getTime();
    const hours = Math.floor(diff / 3_600_000);
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  } catch {
    return '';
  }
};

type Props = { articles: Article[] };

const ArticlesSection: React.FC<Props> = ({ articles }) => {
  if (articles.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bài viết sức khỏe</Text>
        <Pressable onPress={() => Linking.openURL(VNEXPRESS_HEALTH_URL)}>
          <Text style={styles.seeMoreText}>Xem thêm</Text>
        </Pressable>
      </View>

      <FlatList
        data={articles}
        keyExtractor={item => item.link}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.articleRow}
            onPress={() => Linking.openURL(item.link)}
          >
            {item.thumbnail ? (
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Text style={styles.placeholderEmoji}>🏥</Text>
              </View>
            )}
            <View style={styles.articleContent}>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.articleMeta}>
                {item.source} · {formatRelativeTime(item.pubDate)}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default ArticlesSection;
```

- [ ] **Step 3: Run lint**

```bash
npm run lint -- src/components/Home/ArticlesSection/
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/Home/ArticlesSection/
git commit -m "feat: add ArticlesSection with VnExpress RSS and silent error fallback"
```

---

### Task 10: Rebuild HomeScreen

**Files:**
- Modify: `src/screens/AppScreen/Home/HomeScreen.tsx`

**Interfaces:**
- Consumes everything from Tasks 1–9. No new exports.

- [ ] **Step 1: Rewrite `src/screens/AppScreen/Home/HomeScreen.tsx`**

The Settings tab route name is `'SettingsTab'` (confirmed in `src/navigation/BottomTab/BottomTab.tsx:88`).

```typescript
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HeaderSection from '@components/Home/HeaderSection/HeaderSection';
import ActivityCard from '@components/Home/ActivityCard/ActivityCard';
import HeartSleepGrid from '@components/Home/HeartSleepGrid/HeartSleepGrid';
import WaterCard from '@components/Home/WaterCard/WaterCard';
import ReferenceRangesCard from '@components/Home/ReferenceRangesCard';
import ArticlesSection from '@components/Home/ArticlesSection';

import { useHomeData } from '../../../hooks/useHomeData';
import { useWater } from '@context/WaterContext';
import type { DailyMetrics } from '../../../types/home';

const SkeletonBox: React.FC<{ height: number; marginBottom?: number }> = ({
  height,
  marginBottom = 12,
}) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.skeleton, { height, marginBottom, opacity }]}
    />
  );
};

// weekMetrics[0] = today, weekMetrics[1] = yesterday, etc.
// null fields count as 0 (inactive) — streak breaks on first inactive day.
const calculateStreak = (weekMetrics: DailyMetrics[]): number => {
  let streak = 0;
  for (const day of weekMetrics) {
    const active =
      (day.totalSteps ?? 0) > 0 || (day.totalCaloriesOut ?? 0) > 0;
    if (active) streak++;
    else break;
  }
  return streak;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { metrics, weekMetrics, user, articles, isLoading } = useHomeData();
  const { initializeForDay } = useWater();

  useEffect(() => {
    if (metrics?.totalWaterMl != null) {
      initializeForDay(metrics.totalWaterMl);
    }
  }, [metrics?.totalWaterMl, initializeForDay]);

  const streakDays = calculateStreak(weekMetrics);
  const profile = user?.profile;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D8C83" />

      <HeaderSection
        displayName={profile?.fullName || user?.username}
        avatarUrl={profile?.avatarUrl}
        streakDays={streakDays}
        onPressAvatar={() => navigation.navigate('SettingsTab')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <>
            <SkeletonBox height={120} />
            <SkeletonBox height={100} />
            <SkeletonBox height={100} />
          </>
        ) : (
          <>
            <ActivityCard
              steps={metrics?.totalSteps ?? null}
              calories={metrics?.totalCaloriesOut ?? null}
            />
            <HeartSleepGrid
              heartRate={metrics?.avgHeartRate ?? null}
              sleepMinutes={metrics?.totalSleepMinutes ?? null}
            />
            <WaterCard />
          </>
        )}

        <ReferenceRangesCard metrics={metrics ?? null} />
        <ArticlesSection articles={articles} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  skeleton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
  },
});

export default HomeScreen;
```

- [ ] **Step 3: Run lint**

```bash
npm run lint -- src/screens/AppScreen/Home/HomeScreen.tsx
```

Expected: No errors

- [ ] **Step 4: Run all tests**

```bash
npm test
```

Expected: All tests pass (including the 3 new test files from Tasks 2–4)

- [ ] **Step 5: Start the app and verify manually on emulator**

```bash
# Terminal 1
npm start

# Terminal 2
npm run android
```

Navigate to the Home tab and verify:
- [ ] Header shows teal gradient (not mint), time-based greeting ("Good morning/afternoon/evening"), avatar on the right
- [ ] Streak pill visible if user has step/calorie data; hidden if `weekMetrics` are all zero
- [ ] ActivityCard shows live steps/calories from DailyAggregate (or `–` if no data today)
- [ ] HeartSleepGrid shows live heart rate/sleep with correct color label (not hardcoded 78 bpm)
- [ ] WaterCard starts at today's synced value (not 0) when opening app fresh
- [ ] ReferenceRangesCard scrolls horizontally with 6 metric cards; cards with out-of-range values show colored borders
- [ ] ArticlesSection shows up to 5 VnExpress articles with thumbnails/fallback emoji; tap opens system browser
- [ ] "Xem thêm" button opens `https://vnexpress.net/suc-khoe` in browser
- [ ] Skeleton placeholders animate while data loads
- [ ] Disable network → articles section hidden, metrics show `–`, no crash

- [ ] **Step 6: Commit**

```bash
git add src/screens/AppScreen/Home/HomeScreen.tsx
git commit -m "feat: rebuild HomeScreen with live data sync and new content sections"
```
