import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Square, Coffee, Clock, CalendarDays, MessageSquare, User,
  Pause, AlertTriangle, Sparkles, CheckCircle2, ScanFace, MapPin, ArrowLeft, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useAttendanceStore } from "@/store/attendanceStore";
import { CheckInModal } from "@/components/CheckInModal";
import { useAuthStore } from "@/store/authStore";
import { useDataStore } from "@/store/dataStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

function formatDuration(ms: number) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const FULL_DAY_MS = 8 * 60 * 60 * 1000;

type VerifyStep = "face" | "location" | "done" | null;

export default function EmployeeDashboard() {
  const { user } = useAuthStore();
  const { addUpdate, leaves } = useDataStore();
  const { status, checkInAt, totalBreakMs, breakStartAt, breaks, checkIn, startBreak, endBreak, checkOut } = useAttendanceStore();
  const [now, setNow] = useState(Date.now());
  const [coDialog, setCoDialog] = useState(false);
  const [workNote, setWorkNote] = useState("");
  const [earlyReason, setEarlyReason] = useState("");

  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const currentBreak = breakStartAt ? now - breakStartAt : 0;
  const workMs = checkInAt ? now - checkInAt - totalBreakMs - currentBreak : 0;
  const isEarly = workMs < FULL_DAY_MS;
  const pendingApprovals = leaves.filter((l) => l.empId === user?.empId && l.status === "Pending").length;

  const handleCheckIn = () => {
    setShowVerifyModal(true);
  };

  const handleVerified = () => {
    setShowVerifyModal(false);
    checkIn();
    toast.success("Checked in. Have a great day!");
  };

  const handleBreak = () => {
    if (status === "on-break") { endBreak(); toast("Back from break"); }
    else { startBreak(); toast("Break started"); }
  };

  const openCheckout = () => {
    setWorkNote("");
    setEarlyReason("");
    setCoDialog(true);
  };

  const confirmCheckout = () => {
    if (!workNote.trim()) {
      toast.error("Please share what you worked on today");
      return;
    }
    if (isEarly && !earlyReason.trim()) {
      toast.error("Please add a reason for early check-out");
      return;
    }
    if (user) {
      addUpdate({ empId: user.empId, name: user.name, role: user.role, text: workNote.trim() });
    }
    checkOut();
    setCoDialog(false);
    toast.success(isEarly ? "Checked out early. Take care!" : "Checked out. See you tomorrow!");
  };

  const quickActions = [
    { label: "Apply Leave", icon: CalendarDays, to: "/employee/leaves", accent: "icon-3d-sage" },
    { label: "Attendance", icon: Clock, to: "/employee/attendance", accent: "icon-3d-peach" },
    { label: "Updates", icon: MessageSquare, to: "/employee/updates", accent: "icon-3d-powder" },
    { label: "Profile", icon: User, to: "/profile", accent: "icon-3d-cream" },
  ];

  const completedPct = Math.min(100, Math.round((workMs / FULL_DAY_MS) * 100));

  return (
    <div className="space-y-6">
      <CheckInModal open={showVerifyModal} onOpenChange={setShowVerifyModal} onVerified={handleVerified} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ letterSpacing: '-0.5px' }}>Hi, {user?.name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">{completedPct}% of your day</span>
        </div>
      </div>

      {/* Check-in hero card — 3D sage */}
      <Card className="relative overflow-hidden border-0 shadow-3d rounded-3xl min-h-[220px] flex flex-col justify-center">
        <div className="absolute inset-0 bg-sage-3d" />
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-12 -left-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />

        <CardContent className="relative p-6 sm:p-8 text-primary-foreground">
          <AnimatePresence mode="wait">
            <motion.div
              key="idle-working"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            >
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">
                  {status === "idle" ? "You're off the clock" : status === "on-break" ? "On break" : "Currently working"}
                </p>
                <motion.p
                  key={status}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-4xl sm:text-6xl font-bold tabular-nums tracking-tight"
                >
                  {formatDuration(workMs)}
                </motion.p>
                {status !== "idle" && (
                  <p className="mt-2 text-sm text-primary-foreground/85">
                    Checked in at {format(new Date(checkInAt!), "h:mm a")} · {breaks.length} breaks taken
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {status === "idle" ? (
                  <Button size="lg" onClick={handleCheckIn}
                    className="h-14 px-8 bg-white text-primary hover:bg-white/90 font-semibold shadow-3d animate-pulse-ring rounded-2xl border-0">
                    <Play className="h-5 w-5 mr-2 fill-primary" /> Check In
                  </Button>
                ) : (
                  <>
                    <Button size="lg" onClick={handleBreak}
                      className="h-14 px-6 bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold backdrop-blur rounded-2xl">
                      {status === "on-break" ? <><Play className="h-5 w-5 mr-2" /> Resume</> : <><Coffee className="h-5 w-5 mr-2" /> Break</>}
                    </Button>
                    <Button size="lg" onClick={openCheckout}
                      className="h-14 px-6 bg-destructive hover:bg-destructive/90 font-semibold shadow-3d rounded-2xl">
                      <Square className="h-5 w-5 mr-2 fill-current" /> Check Out
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Quick actions — peach + powder + sage 3D */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {pendingApprovals > 0 && (
          <Link to="/employee/leaves" className="col-span-2 lg:col-span-4">
            <Card className="border-0 shadow-lg text-white hover:-translate-y-1 transition-smooth cursor-pointer mb-1 border-glow-shine" style={{ background: "var(--gradient-success)" }}>
              <CardContent className="p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">You have {pendingApprovals} pending approval{pendingApprovals > 1 ? "s" : ""}</p>
                    <p className="text-xs text-white/80">Your leave requests are currently under review.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
        {quickActions.map((qa, i) => (
          <Link to={qa.to} key={qa.label}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="soft-3d border-0 p-4 hover:-translate-y-1 transition-smooth cursor-pointer h-full">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-3", qa.accent)}>
                  <qa.icon className={cn("h-5 w-5", qa.accent === "icon-3d-sage" ? "text-primary-foreground" : "text-foreground/80")} />
                </div>
                <p className="font-semibold text-sm">{qa.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Go to {qa.label.toLowerCase()}</p>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Break history */}
      <Card className="card-3d border-0">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><Pause className="h-4 w-4" /> Break history</CardTitle>
          <span className="text-xs text-muted-foreground">Total: {formatDuration(totalBreakMs + currentBreak)}</span>
        </CardHeader>
        <CardContent>
          {breaks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No breaks yet today.</p>
          ) : (
            <div className="space-y-2">
              {breaks.map((b, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-peach-3d shadow-sm flex items-center justify-center">
                      <Coffee className="h-4 w-4 text-foreground/80" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Break #{i + 1}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(b.start), "h:mm a")} – {format(new Date(b.end), "h:mm a")}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{formatDuration(b.end - b.start)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart checkout dialog */}
      <Dialog open={coDialog} onOpenChange={setCoDialog}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Square className="h-5 w-5 text-primary" /> Wrap up your day
            </DialogTitle>
            <DialogDescription>
              Worked {formatDuration(workMs)} today · {completedPct}% of an 8h day
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            {isEarly && (
              <div className="rounded-2xl border border-warning/40 bg-warning/10 p-3.5 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-warning-foreground">Early check-out</p>
                  <p className="text-xs text-muted-foreground">You haven't completed 8 hours yet. Please share a reason below.</p>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>What did you work on today? <span className="text-destructive">*</span></Label>
              <Textarea
                value={workNote}
                onChange={(e) => setWorkNote(e.target.value)}
                placeholder="Shipped X, paired with Y on Z, reviewed 3 PRs..."
                className="min-h-[90px] rounded-2xl"
              />
              <p className="text-[11px] text-muted-foreground">This will also post to the Daily Updates feed.</p>
            </div>

            {isEarly && (
              <div className="space-y-1.5">
                <Label>Reason for early check-out <span className="text-destructive">*</span></Label>
                <Textarea
                  value={earlyReason}
                  onChange={(e) => setEarlyReason(e.target.value)}
                  placeholder="Doctor appointment, family emergency, half-day approved..."
                  className="min-h-[70px] rounded-2xl"
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCoDialog(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={confirmCheckout} className="bg-sage-3d shadow-3d border-0 text-primary-foreground rounded-xl">
              Confirm check-out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
