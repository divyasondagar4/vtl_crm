import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "admin" | "manager" | "employee";

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  language: "en" | "hi" | "gu";
  timezone: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  empId: string;
  role: Role;
  department: string;
  phone: string;
  bio: string;
  location: string;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  preferences: UserPreferences;
  login: (role: Role) => void;
  logout: () => void;
  updateProfile: (patch: Partial<AuthUser>) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
}

const demoUsers: Record<Role, AuthUser> = {
  admin: {
    id: "u-001",
    name: "Aarav Mehta",
    email: "aarav@vibetechlabs.com",
    empId: "VTL-001",
    role: "admin",
    department: "Leadership",
    phone: "+91 98765 43210",
    bio: "Founder & Head of Operations at Vibe Tech Labs. Building calmer workplaces.",
    location: "Ahmedabad, IN",
  },
  manager: {
    id: "u-002",
    name: "Priya Shah",
    email: "priya@vibetechlabs.com",
    empId: "VTL-014",
    role: "manager",
    department: "Engineering",
    phone: "+91 98123 11122",
    bio: "Engineering Manager. Loves clean code and quiet mornings.",
    location: "Bengaluru, IN",
  },
  employee: {
    id: "u-003",
    name: "Rohan Kapoor",
    email: "rohan@vibetechlabs.com",
    empId: "VTL-042",
    role: "employee",
    department: "Engineering",
    phone: "+91 99000 22113",
    bio: "Full-stack engineer. Plant parent. Coffee enthusiast.",
    location: "Pune, IN",
  },
};

const defaultPrefs: UserPreferences = {
  theme: "system",
  emailNotifications: true,
  pushNotifications: true,
  weeklyReport: true,
  language: "en",
  timezone: "Asia/Kolkata",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      preferences: defaultPrefs,
      login: (role) => set({ user: demoUsers[role] }),
      logout: () => set({ user: null }),
      updateProfile: (patch) =>
        set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),
      updatePreferences: (patch) =>
        set((s) => ({ preferences: { ...s.preferences, ...patch } })),
    }),
    { name: "vtl-auth" }
  )
);
