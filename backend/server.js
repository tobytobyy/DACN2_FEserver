#!/usr/bin/env node
'use strict';

/**
 * Backend Server cho ứng dụng HealthCare React Native
 * Kết nối MongoDB Atlas Cloud & Tích hợp Roboflow AI
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Đọc cấu hình bảo mật từ file .env

const app = express();

// ==========================================
// 1. MIDDLEWARES CẤU HÌNH SERVER
// ==========================================
app.use(cors());
// Tăng giới hạn kích thước body lên 15mb để nhận được chuỗi ảnh Base64 từ điện thoại gửi lên
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// ==========================================
// 2. KẾT NỐI DATABASE (MONGODB ATLAS)
// ==========================================
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/HealthcareDB';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('🔥 [Database] Kết nối MongoDB Atlas thành công!'))
  .catch(err =>
    console.error('❌ [Database] Lỗi kết nối MongoDB:', err.message),
  );

// ==========================================
// 3. ĐỊNH NGHĨA CÁC MONGOOSE SCHEMAS (MODELS)
// ==========================================

// Bảng lưu lịch sử Uống Nước (Water Tracker)
const WaterLog = mongoose.model(
  'WaterLog',
  new mongoose.Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true }, // lượng nước bằng ml
    createdAt: { type: Date, default: Date.now },
  }),
);

// Bảng lưu lịch sử Đếm Bước Chân (Footstep Counting)
const StepLog = mongoose.model(
  'StepLog',
  new mongoose.Schema(
    {
      userId: { type: String, required: true },
      steps: { type: Number, required: true },
      caloriesBurned: { type: Number },
      distanceKm: { type: Number },
      date: { type: String, required: true }, // Định dạng YYYY-MM-DD để dễ thống kê theo ngày
    },
    { timestamps: true },
  ),
);

// Bảng lưu lịch sử Quét Dinh Dưỡng Thức Ăn (Calories Scan)
const FoodLog = mongoose.model(
  'FoodLog',
  new mongoose.Schema({
    userId: { type: String, required: true },
    foodName: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number },
    scannedAt: { type: Date, default: Date.now },
  }),
);

// ==========================================
// 4. ĐỊNH NGHĨA CÁC ENDPOINTS (API ROUTES)
// ==========================================

// --- ROUTE KIỂM TRA SERVER CHẠY KHÔNG ---
app.get('/', (req, res) => {
  res.json({ status: 'running', message: 'HealthCare API đã sẵn sàng!' });
});

// --- CHỨC NĂNG 1: WATER TRACKER API ---
// Thêm lịch sử uống nước
app.post('/api/water/add', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount)
      return res
        .status(400)
        .json({ success: false, message: 'Thiếu thông tin dữ liệu.' });

    const newWaterLog = new WaterLog({ userId, amount });
    await newWaterLog.save();

    res
      .status(201)
      .json({
        success: true,
        message: 'Đã ghi nhận lượng nước!',
        data: newWaterLog,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Lấy lịch sử uống nước của một User
app.get('/api/water/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await WaterLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- CHỨC NĂNG 2: FOOTSTEP COUNTING API ---
// Đồng bộ hóa bước chân
app.post('/api/steps/sync', async (req, res) => {
  try {
    const { userId, steps, caloriesBurned, distanceKm, date } = req.body;

    // Tìm xem hôm nay user đã có bản ghi bước chân chưa, có thì cập nhật, chưa thì tạo mới (Upsert)
    const updatedLog = await StepLog.findOneAndUpdate(
      { userId, date },
      { steps, caloriesBurned, distanceKm },
      { new: true, upsert: true },
    );

    res.json({
      success: true,
      message: 'Đồng bộ bước chân thành công!',
      data: updatedLog,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- CHỨC NĂNG 3: CALORIES SCAN + ROBOFLOW AI INTEGRATION ---
app.post('/api/nutrition/scan', async (req, res) => {
  try {
    const { userId, imageBase64 } = req.body;

    if (!imageBase64) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Không tìm thấy dữ liệu hình ảnh (Base64)!',
        });
    }

    // Làm sạch chuỗi Base64 (bỏ phần data:image/jpeg;base64, nếu phía client gửi kèm)
    const cleanBase64 = imageBase64.includes(',')
      ? imageBase64.split(',')[1]
      : imageBase64;

    // Lấy thông tin tài khoản Roboflow từ môi trường bảo mật .env
    const ROBOFLOW_API_KEY = process.env.ROBOFLOW_API_KEY;
    const MODEL_ID = process.env.ROBOFLOW_MODEL_ID;
    const VERSION = process.env.ROBOFLOW_VERSION || '1';

    const roboflowUrl = `https://detect.roboflow.com/${MODEL_ID}/${VERSION}?api_key=${ROBOFLOW_API_KEY}`;

    // 1. Tiến hành gọi sang API của Roboflow AI để nhận diện món ăn
    console.log('🤖 Đang gửi ảnh sang Roboflow AI phân tích...');
    const responseAI = await axios({
      method: 'POST',
      url: roboflowUrl,
      data: cleanBase64,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const predictions = responseAI.data.predictions;
    if (!predictions || predictions.length === 0) {
      return res.json({
        success: false,
        message:
          'AI không thể nhận diện được món ăn này. Vui lòng chụp rõ hơn!',
      });
    }

    // Lấy món ăn có độ tin cậy tốt nhất (khung định vị vật thể đầu tiên)
    const topPrediction = predictions[0].class; // ví dụ trả về nhãn text: "salad" hoặc "pho"
    const confidence = (predictions[0].confidence * 100).toFixed(1); // độ chính xác %

    // 2. Định nghĩa một bảng dữ liệu tra cứu giá trị dinh dưỡng tĩnh
    // (Trong thực tế bạn có thể tạo một collection riêng trong MongoDB cho bảng dinh dưỡng này)
    const nutritionDatabase = {
      pho: {
        foodName: 'Phở Bò',
        calories: 350,
        protein: 18,
        carbs: 45,
        fat: 11,
      },
      com_tam: {
        foodName: 'Cơm Tấm Sườn Trứng',
        calories: 550,
        protein: 26,
        carbs: 65,
        fat: 19,
      },
      salad: {
        foodName: 'Salad Ức Gà Dầu Giấm',
        calories: 160,
        protein: 15,
        carbs: 7,
        fat: 4,
      },
      banh_mi: {
        foodName: 'Bánh Mì Thịt Nguội',
        calories: 400,
        protein: 12,
        carbs: 48,
        fat: 14,
      },
    };

    // Đối chiếu kết quả AI trả về với Database dinh dưỡng
    const nutritionResult = nutritionDatabase[topPrediction] || {
      foodName: `Món ăn lạ (${topPrediction})`,
      calories: 250,
      protein: 10,
      carbs: 30,
      fat: 8,
    };

    // 3. Tự động lưu lịch sử quét thành công của User này vào MongoDB
    if (userId) {
      const log = new FoodLog({
        userId,
        foodName: nutritionResult.foodName,
        calories: nutritionResult.calories,
        protein: nutritionResult.protein,
        carbs: nutritionResult.carbs,
        fat: nutritionResult.fat,
      });
      await log.save();
    }

    // 4. Phản hồi đầy đủ thông tin sạch về cho ứng dụng React Native hiển thị lên BottomSheet
    res.json({
      success: true,
      aiInfo: { label: topPrediction, confidence: `${confidence}%` },
      nutrition: nutritionResult,
    });
  } catch (error) {
    console.error('❌ Lỗi xử lý Quét AI:', error.message);
    res
      .status(500)
      .json({
        success: false,
        message: 'Lỗi kết nối hệ thống AI xử lý hình ảnh.',
      });
  }
});

// ==========================================
// 5. KHỞI CHẠY SERVER PORT LẮNG NGHE
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 [Server] Node.js Backend đang chạy tại Port: ${PORT}`);
  console.log(`====================================================`);
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// ==========================================
// ĐỊNH NGHĨA SCHEMAS MỚI
// ==========================================

// 1. Schema Người dùng (Hỗ trợ phân quyền Admin/User)
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Phân tầng quyền hạn
    isVerified: { type: Boolean, default: false }, // Chỉ cho đăng nhập khi đã xác thực OTP
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

// 2. Schema Lưu trữ mã OTP tạm thời (Tự động xóa sau 5 phút)
const OTPSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } }, // Hết hạn sau 300 giây (5 phút)
});

const OTP = mongoose.model('OTP', OTPSchema);

// ==========================================
// CẤU HÌNH DỊCH VỤ GỬI OTP (EMAIL & SMS)
// ==========================================
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// Hàm tạo mã OTP 6 số ngẫu nhiên
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ==========================================
// CÁC API ENDPOINTS XÁC THỰC (AUTH ROUTES)
// ==========================================

// --- 1. API ĐĂNG KÝ (Tạo tài khoản tài trạng thái chờ & Gửi OTP đồng thời) ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Kiểm tra xem email hoặc số điện thoại đã tồn tại chưa
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Email hoặc Số điện thoại đã được đăng ký!',
        });
    }

    // Mã hóa mật khẩu bảo mật trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới (Mặc định quyền 'user' nếu không truyền admin)
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'user',
    });
    await newUser.save();

    // Tạo mã OTP
    const otpCode = generateOTP();
    const newOTP = new OTP({ userId: newUser._id, code: otpCode });
    await newOTP.save();

    // GỬI OTP QUA EMAIL
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🧬 Mã Xác Thực OTP Ứng Dụng HealthCare',
        text: `Mã OTP của bạn là: ${otpCode}. Mã này có hiệu lực trong vòng 5 phút.`,
      });
      console.log(`✉️ Đã gửi Email OTP tới hệ thống: ${email}`);
    } catch (emailError) {
      console.log(
        '⚠️ Cảnh báo Email chưa gửi được (Do cấu hình .env dùng tài khoản ảo):',
        emailError.message,
      );
    }

    console.log(`\n======================================================`);
    console.log(`🔑 [DEV] MÃ OTP CỦA TÀI KHOẢN KÍCH HOẠT LÀ: ${otpCode}`);
    console.log(`======================================================\n`);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Vui lòng lấy mã OTP được cấp để xác thực.',
      userId: newUser._id,
    });

    // GỬI OTP QUA SMS (Bọc trong try-catch phòng trường hợp số điện thoại ảo/lỗi cấu hình Twilio)
    try {
      await twilioClient.messages.create({
        body: `[HealthCare AI] Mã xác thực OTP của bạn là: ${otpCode}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone, // Đảm bảo số điện thoại gửi lên có mã quốc gia, ví dụ: +84941393xxx
      });
    } catch (smsError) {
      console.log(
        '⚠️ Cảnh báo SMS Twilio chưa gửi được (Cần số điện thoại thật định dạng quốc tế):',
        smsError.message,
      );
    }

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Đã gửi mã OTP đến Email và Số điện thoại.',
      userId: newUser._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- 2. API XÁC THỰC MÃ OTP ---
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { userId, otpCode } = req.body;

    // Tìm mã OTP trong DB khớp với User
    const validOTP = await OTP.findOne({ userId, code: otpCode });
    if (!validOTP) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Mã OTP không chính xác hoặc đã hết hạn!',
        });
    }

    // Kích hoạt trạng thái verified cho người dùng
    await User.findByIdAndUpdate(userId, { isVerified: true });

    // Xóa mã OTP sau khi dùng xong
    await OTP.deleteOne({ _id: validOTP._id });

    res.json({
      success: true,
      message: 'Xác thực tài khoản thành công! Bây giờ bạn có thể đăng nhập.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- 3. API ĐĂNG NHẬP (Phân tầng quyền Admin / User dựa trên Token) ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: 'Tài khoản không tồn tại!' });

    // Kiểm tra tài khoản đã kích hoạt OTP chưa
    if (!user.isVerified) {
      return res
        .status(401)
        .json({
          success: false,
          message: 'Tài khoản chưa được xác thực kích hoạt OTP!',
        });
    }

    // Đối chiếu kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: 'Mật khẩu không chính xác!' });

    // Tạo mã JWT Token đính kèm ID và Quyền Hạn (Role)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }, // Token sống trong 7 ngày
    );

    // Trả thông tin sạch về cho Front-End điều hướng màn hình
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Gửi về giá trị 'user' hoặc 'admin'
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
