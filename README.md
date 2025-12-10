# HealthCare App (DACN2)

Dự án ứng dụng di động theo dõi sức khỏe được xây dựng bằng **React Native**, hỗ trợ người dùng theo dõi các chỉ số sức khỏe như bước chân, nhịp tim, giấc ngủ và tính toán calo.

## 🌟 Tính năng chính

- **Xác thực người dùng (Auth):** Đăng nhập, Đăng ký.
- **Calories Scan:** Quét và tính toán lượng calo (sử dụng Camera).
- **Foot Step Counting:** Đếm bước chân hàng ngày.
- **Heart Measurement:** Đo và theo dõi nhịp tim.
- **Sleep Tracking:** Theo dõi chất lượng giấc ngủ.
- **Settings:** Cài đặt ứng dụng và tài khoản.

## 🛠 Công nghệ sử dụng

- **Core:** React Native (0.82.1), React (19.1.1), TypeScript.
- **Navigation:** React Navigation v7 (Native Stack, Bottom Tabs).
- **State Management & Data Fetching:** TanStack Query (React Query), Context API.
- **UI & Assets:**
  - `react-native-svg` & `react-native-vector-icons` (Icons & Images).
  - `react-native-linear-gradient` (UI Styling).
  - `react-native-calendars` (Lịch theo dõi).
- **Camera:** `react-native-vision-camera`.
- **Code Quality:** ESLint, Prettier, Husky, Commitlint.

## 📂 Cấu trúc thư mục

```
src/
├── assets/          # Tài nguyên (Fonts, Icons, Images, Theme)
├── components/      # Các component tái sử dụng (Auth, Home, Common...)
├── context/         # Global State (AuthContext)
├── navigation/      # Cấu hình điều hướng (AppStack, AuthStack, BottomTab)
├── screens/         # Màn hình chính (CaloriesScan, HeartMeasurement, etc.)
└── types/           # Định nghĩa kiểu dữ liệu TypeScript
```

## 🚀 Hướng dẫn cài đặt & Chạy dự án

### 1. Yêu cầu môi trường

- Node.js (>= 18)
- JDK 17 (cho Android)
- Ruby (cho iOS CocoaPods)
- Xcode (macOS) & Android Studio

### 2. Cài đặt dependencies

```bash
# Cài đặt thư viện npm
npm install
# Hoặc
yarn install
```

### 3. Cấu hình cho iOS (Quan trọng)

Do dự án sử dụng các native modules, bạn cần cài đặt Pods. Nếu gặp lỗi về phiên bản Ruby, hãy đảm bảo bạn đang sử dụng Ruby tương thích với hệ thống (khuyến nghị dùng `rbenv` hoặc `rvm`).

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### 4. Chạy ứng dụng

**Khởi động Metro Bundler:**

```bash
npm start
```

**Chạy trên Android:**

```bash
npm run android
```

**Chạy trên iOS:**

```bash
npm run ios
```

## ⚠️ Các vấn đề thường gặp (Troubleshooting)

### Lỗi Icon hoặc SVG không hiển thị

Dự án sử dụng alias `@icons`. Đảm bảo bạn đã cấu hình đúng trong `babel.config.js` và `tsconfig.json`.

- Đường dẫn đúng: `src/assets/icons/svgs/*.svg`

### Lỗi CocoaPods trên iOS

Nếu gặp lỗi liên quan đến `ffi` hoặc phiên bản Ruby khi chạy `pod install`:

1.  Kiểm tra `Gemfile` trong thư mục `ios/`.
2.  Chạy `bundle update` để cập nhật dependencies của Ruby.
3.  Sử dụng `bundle exec pod install` thay vì `pod install` trực tiếp.

## 🤝 Đóng góp (Contribution)

Dự án tuân thủ quy chuẩn commit **Conventional Commits**.
Ví dụ:

- `feat: add login screen`
- `fix: fix header alignment`
- `chore: update dependencies`

Sử dụng lệnh sau để commit đúng chuẩn:

```bash
npm run commit
```
