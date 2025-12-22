import React, { createContext, useContext, useState } from 'react';

/**
 * Interface mô tả toàn bộ dữ liệu & hành động
 * mà AuthContext sẽ cung cấp cho app
 */
interface AuthContextType {
  /**
   * Trạng thái đăng nhập
   * true  = đã đăng nhập
   * false = chưa đăng nhập
   */
  isAuthenticated: boolean;

  /**
   * Hàm đăng nhập
   * Thường sẽ được gọi sau khi login thành công
   */
  login: () => void;

  /**
   * Hàm đăng xuất
   * Dùng khi user bấm Logout
   */
  logout: () => void;
}

/**
 * Tạo AuthContext
 * - Giá trị mặc định là null
 * - Bắt buộc phải dùng trong AuthProvider
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * AuthProvider
 *
 * Component bọc toàn bộ app (hoặc một phần app)
 * để cung cấp trạng thái đăng nhập cho mọi component con
 *
 * Ví dụ:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /**
   * State lưu trạng thái đăng nhập
   * Mặc định: chưa đăng nhập
   *
   * 👉 Sau này có thể:
   * - đọc từ AsyncStorage
   * - đọc từ token
   * - gọi API check session
   */
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Hàm login
   * - Set trạng thái đăng nhập = true
   * - Thực tế có thể thêm logic:
   *   + lưu token
   *   + gọi API
   */
  const login = () => {
    setIsAuthenticated(true);
  };

  /**
   * Hàm logout
   * - Reset trạng thái đăng nhập
   * - Có thể mở rộng:
   *   + clear token
   *   + clear AsyncStorage
   */
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    /**
     * Provider truyền dữ liệu xuống toàn bộ cây component con
     */
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

/**
 * Custom hook: useAuth
 *
 * 👉 Giúp component sử dụng AuthContext dễ dàng hơn
 * 👉 Tránh phải gọi useContext(AuthContext) ở khắp nơi
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  /**
   * Nếu hook được dùng bên ngoài AuthProvider
   * thì throw error để dev biết dùng sai
   */
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
