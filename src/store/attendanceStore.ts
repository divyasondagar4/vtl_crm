import { create } from "zustand";

export type AttendanceStatus = "idle" | "checked-in" | "on-break";

interface AttendanceState {
  status: AttendanceStatus;
  checkInAt: number | null;
  totalBreakMs: number;
  breakStartAt: number | null;
  breaks: { start: number; end: number }[];
  checkIn: () => void;
  startBreak: () => void;
  endBreak: () => void;
  checkOut: () => void;
  reset: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  status: "idle",
  checkInAt: null,
  totalBreakMs: 0,
  breakStartAt: null,
  breaks: [],
  checkIn: () => set({ status: "checked-in", checkInAt: Date.now(), totalBreakMs: 0, breaks: [] }),
  startBreak: () => set({ status: "on-break", breakStartAt: Date.now() }),
  endBreak: () => {
    const { breakStartAt, totalBreakMs, breaks } = get();
    if (!breakStartAt) return;
    const now = Date.now();
    set({
      status: "checked-in",
      breakStartAt: null,
      totalBreakMs: totalBreakMs + (now - breakStartAt),
      breaks: [...breaks, { start: breakStartAt, end: now }],
    });
  },
  checkOut: () => set({ status: "idle", checkInAt: null, breakStartAt: null }),
  reset: () => set({ status: "idle", checkInAt: null, totalBreakMs: 0, breakStartAt: null, breaks: [] }),
}));
