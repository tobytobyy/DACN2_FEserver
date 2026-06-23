# Home Screen Redesign — Design Spec
**Date:** 2026-06-24
**Project:** DACN2 HealthCare App (DACN2_FEserver)
**Status:** Approved, ready for implementation

---

## 1. Problem Statement

The current HomeScreen has three issues:
1. **Static data** — `HeartSleepGrid` is fully hardcoded (heartRate=78, sleep=7h20m); `WaterCard` resets to 0 on every app open (local state only, never initialized from server).
2. **Sparse layout** — Only 3 cards; no scrollable content; users see everything at once with nothing to explore.
3. **Weak header** — Solid mint green (#98F6D6) block, generic "Welcome!" greeting, no visual personality.

---

## 2. Goals

- Sync all metrics (heart rate, sleep, steps, calories, water) from a single backend source.
- Enrich the home screen with two new scrollable sections: health reference ranges and RSS health articles.
- Redesign the header to be more polished and personalized (Nike Run / Strava minimal style).

---

## 3. Architecture & Data Flow

### 3.1 Central Hook: `useHomeData()`

**File:** `src/hooks/useHomeData.ts`

Single hook that aggregates all HomeScreen data:

```
useHomeData()
  ├── GET /health/daily-aggregate?date=today   → steps, calories, heartRate, sleepMinutes, waterMl
  ├── user (from UserContext — already loaded)  → displayName, avatarUrl
  └── fetchRssArticles()                        → VnExpress Sức Khỏe RSS → Article[]
        source: https://vnexpress.net/rss/suc-khoe.rss
        parser: react-native-rss-parser
```

**Return shape:**
```typescript
{
  metrics: DailyMetrics | null;   // from daily-aggregate
  user: UserProfile;              // from UserContext
  articles: Article[];            // from RSS
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}
```

### 3.2 Refresh Strategy

| Data source | Refresh trigger | Cache / staleTime |
|---|---|---|
| `/health/daily-aggregate` | `useFocusEffect` (on screen focus) | TanStack default (0) |
| UserContext (`/auth/me`) | Already managed by UserContext | — |
| RSS articles | Mount only | `staleTime: 30 minutes` |

### 3.3 Dependencies

- **`react-native-linear-gradient`** — already installed (v2.8.3); used for header gradient.
- **`react-native-rss-parser`** — new install required; lightweight RSS/XML parser for React Native.

---

## 4. Header Redesign

**Component:** `src/components/Home/HeaderSection/HeaderSection.tsx`

### Layout

```
┌─────────────────────────────────────────────┐
│  [gradient: #2D8C83 → #1a5c56]              │
│                                             │
│  Good morning, Minh 👋          [  Avatar ] │
│  Tue, 24 Jun 2026                [  48px  ] │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  🔥 Today's streak   ·  Day 7       │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Spec

| Property | Value |
|---|---|
| Background | Gradient `#2D8C83` → `#1a5c56` (vertical, LinearGradient) |
| Height | ~160px (down from 240px) |
| Greeting | Time-based: "Good morning" / "Good afternoon" / "Good evening" |
| Greeting language | English greeting + Vietnamese name (e.g. "Good morning, Minh 👋") |
| Date line | Short format, white at 70% opacity |
| Avatar | 48px circle, white 2px border, top-right; tap → navigate to Settings |
| Streak pill | Small badge showing consecutive active days. `useHomeData()` fetches `/health/daily-aggregate` for the last 7 days; "active day" = `totalSteps > 0` OR `totalCaloriesOut > 0`. If the endpoint does not support date-range queries or returns no data, the pill is hidden. |

---

## 5. Metrics Cards — Data Sync

All cards receive data from `useHomeData()` → `metrics` (DailyAggregate). No card fetches independently.

### 5.1 Data Mapping

| Card | DailyAggregate field | Fallback |
|---|---|---|
| ActivityCard — steps | `totalSteps` | Show `–` (no estimation) |
| ActivityCard — calories | `totalCaloriesOut` | Show `–` |
| HeartSleepGrid — heart rate | `avgHeartRate` | Show `–` + label "No data" |
| HeartSleepGrid — sleep | `totalSleepMinutes` | Show `–` |
| WaterCard | `totalWaterMl` (init value) | Init to 0 |

### 5.2 Status Labels (computed in FE)

**Heart Rate:**
- `< 60 bpm` → Low (orange)
- `60–100 bpm` → Normal (green)
- `> 100 bpm` → High (red)

**Sleep:**
- `< 6h` → Low (orange)
- `6–9h` → Normal (green)
- `> 9h` → High (orange)

### 5.3 WaterCard Hybrid Strategy

WaterContext is kept for optimistic add/delete interactions (instant UI feedback). On HomeScreen mount, `totalWaterMl` from DailyAggregate is used to **initialize** WaterContext for the current day, replacing the current hard-reset-to-0 behavior.

### 5.4 Loading State

While `useHomeData()` is loading: all cards display an animated gray skeleton placeholder. No stale values are shown.

### 5.5 Card Layout (unchanged)

```
[  ActivityCard        — full width  ]
[  HeartCard  ]  [  SleepCard       ]
[  WaterCard           — full width  ]
```

---

## 6. New Content Sections

### 6.1 Reference Ranges Card

**Component:** `src/components/Home/ReferenceRangesCard/`

Horizontally scrollable FlatList of metric reference cards. Data is hardcoded in FE (no API needed).

**6 metrics displayed:**

| Metric | Normal Range | Unit |
|---|---|---|
| Nhịp tim | 60 – 100 | bpm |
| Giấc ngủ | 7 – 9 | giờ |
| Bước chân | 8.000 – 10.000 | bước/ngày |
| Uống nước | 1.5 – 2.5 | L/ngày |
| BMI | 18.5 – 24.9 | kg/m² |
| Huyết áp | 90/60 – 120/80 | mmHg |

**Dynamic highlight:** If today's value (from DailyAggregate) is outside the normal range for a given metric, the card gets an orange border. If within range → green border. If no data → neutral (no border).

### 6.2 Articles Section

**Component:** `src/components/Home/ArticlesSection/`

**Source:** VnExpress Sức Khỏe RSS — `https://vnexpress.net/rss/suc-khoe.rss`

**Article item layout:**
```
┌──────┬────────────────────────────┐
│ img  │ Article title (2 lines max) │
│ 72px │ VnExpress · 2 giờ trước    │
└──────┴────────────────────────────┘
```

**Behavior:**
- Shows 5 most recent articles.
- Tap → `Linking.openURL(article.link)` opens system browser.
- "Xem thêm" button at bottom → opens `https://vnexpress.net/suc-khoe` in browser.
- **Error handling:** If RSS fetch fails (network error, CORS block, parse error), the entire section is silently hidden — no crash, no error message.
- **Image fallback:** If article has no thumbnail, show a default health icon placeholder.

---

## 7. Full HomeScreen Scroll Order

```
1. HeaderSection          (gradient, time-based greeting, avatar, streak pill)
2. ActivityCard           (steps + calories — from DailyAggregate)
3. HeartSleepGrid         (heart rate + sleep — from DailyAggregate)
4. WaterCard              (optimistic local + initialized from DailyAggregate)
5. ReferenceRangesCard    (horizontal scroll, 6 metrics, dynamic border highlight)
6. ArticlesSection        (5 RSS articles from VnExpress, hidden on fetch failure)
```

---

## 8. Files Changed / Created

### Modified
| File | Change |
|---|---|
| `src/screens/AppScreen/Home/HomeScreen.tsx` | Rebuilt — uses `useHomeData()`, renders new scroll layout |
| `src/components/Home/HeaderSection/HeaderSection.tsx` | Gradient, time-based greeting, streak pill |
| `src/components/Home/HeaderSection/styles.tsx` | New gradient + layout styles |
| `src/components/Home/HeartSleepGrid/HeartSleepGrid.tsx` | Remove hardcode, accept dynamic props + null state |
| `src/components/Home/WaterCard/WaterCard.tsx` | Accept initialWaterMl from DailyAggregate |
| `src/context/WaterContext.tsx` | Add `initializeForDay(ml)` action |

### Created
| File | Purpose |
|---|---|
| `src/hooks/useHomeData.ts` | Central data hook (DailyAggregate + RSS) |
| `src/components/Home/ReferenceRangesCard/index.tsx` | Horizontal reference ranges card |
| `src/components/Home/ReferenceRangesCard/styles.tsx` | Styles |
| `src/components/Home/ArticlesSection/index.tsx` | RSS articles list |
| `src/components/Home/ArticlesSection/styles.tsx` | Styles |
| `src/services/rss.ts` | RSS fetch + parse helper |
| `src/types/home.ts` | Shared types: `DailyMetrics`, `Article` |

### Dependency Added
- `react-native-rss-parser` (parse RSS XML from VnExpress)

---

## 9. Out of Scope

- Backend changes — all data already exists in `/health/daily-aggregate` and `/auth/me`.
- Push notifications or background refresh.
- Saving articles as bookmarks.
- BMI and blood pressure display in metrics cards (reference ranges card only — no server data for these yet).
- WebView in-app article reader.
