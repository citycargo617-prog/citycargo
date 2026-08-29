import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AuthUser {
  phone: string;
  name: string;
  type: "shipper" | "truck-owner";
}

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isOtpSent: boolean;
  otpPhone: string;
  login: (phone: string, name: string, type: AuthUser["type"]) => void;
  logout: () => void;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  resetOtpState: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");

  const login = useCallback((phone: string, name: string, type: AuthUser["type"]) => {
    setUser({ phone, name, type });
    setIsOtpSent(false);
    setOtpPhone("");
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsOtpSent(false);
    setOtpPhone("");
  }, []);

  const sendOtp = useCallback(async (phone: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));
    setOtpPhone(phone);
    setIsOtpSent(true);
    return true;
  }, []);

  const verifyOtp = useCallback(
    async (otp: string): Promise<boolean> => {
      // Simulate API delay
      await new Promise((r) => setTimeout(r, 600));
      // Accept any 6-digit OTP for demo
      if (otp.length === 6) {
        setUser({ phone: otpPhone, name: "Fleet Owner", type: "truck-owner" });
        setIsOtpSent(false);
        return true;
      }
      return false;
    },
    [otpPhone],
  );

  const resetOtpState = useCallback(() => {
    setIsOtpSent(false);
    setOtpPhone("");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isOtpSent,
        otpPhone,
        login,
        logout,
        sendOtp,
        verifyOtp,
        resetOtpState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
