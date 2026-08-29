import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface BookingData {
  pickupCity: string;
  dropCity: string;
  goodsType: string;
  truckTypeId: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
  loadingDate: string;
  instructions: string;
  insuranceOptIn: boolean;
  estimatedPrice: number;
  bookingId: string;
}

interface BookingState {
  step: number;
  data: Partial<BookingData>;
  setStep: (step: number) => void;
  updateData: (partial: Partial<BookingData>) => void;
  reset: () => void;
  confirmBooking: () => string;
}

const BookingContext = createContext<BookingState | null>(null);

function generateBookingId() {
  return `CC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<BookingData>>({});

  const updateData = useCallback((partial: Partial<BookingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setStep(1);
    setData({});
  }, []);

  const confirmBooking = useCallback((): string => {
    const id = generateBookingId();
    setData((prev) => ({ ...prev, bookingId: id }));
    setStep(5); // confirmation step
    return id;
  }, []);

  return (
    <BookingContext.Provider value={{ step, data, setStep, updateData, reset, confirmBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
