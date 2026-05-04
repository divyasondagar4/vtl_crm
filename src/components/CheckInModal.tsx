import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckInModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onVerified: () => void;
}

export function CheckInModal({ open, onOpenChange, onVerified }: CheckInModalProps) {
    const [step, setStep] = useState<"face" | "location" | "done" | null>(null);
    const [faceProgress, setFaceProgress] = useState(0);
    const [locProgress, setLocProgress] = useState(0);

    const faceTimer = useRef<number | null>(null);
    const locTimer = useRef<number | null>(null);

    useEffect(() => {
        if (open) {
            setStep("face");
            setFaceProgress(0);
            setLocProgress(0);
            runFaceScan();
        } else {
            setStep(null);
            if (faceTimer.current) window.clearInterval(faceTimer.current);
            if (locTimer.current) window.clearInterval(locTimer.current);
        }
    }, [open]);

    const runFaceScan = () => {
        if (faceTimer.current) window.clearInterval(faceTimer.current);
        faceTimer.current = window.setInterval(() => {
            setFaceProgress((p) => {
                if (p >= 100) {
                    window.clearInterval(faceTimer.current!);
                    setTimeout(() => {
                        setStep("location");
                        runLocation();
                    }, 400);
                    return 100;
                }
                return p + 4;
            });
        }, 70);
    };

    const runLocation = () => {
        if (locTimer.current) window.clearInterval(locTimer.current);
        locTimer.current = window.setInterval(() => {
            setLocProgress((p) => {
                if (p >= 100) {
                    window.clearInterval(locTimer.current!);
                    setTimeout(() => {
                        setStep("done");
                        setTimeout(() => {
                            onVerified();
                        }, 800);
                    }, 400);
                    return 100;
                }
                return p + 5;
            });
        }, 70);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-6 bg-card/95 backdrop-blur-3xl shadow-3d border-border/50 overflow-hidden hide-close-btn">
                <AnimatePresence mode="wait">
                    {step === "face" && (
                        <motion.div
                            key="face"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="space-y-6 text-center"
                        >
                            <div className="space-y-1">
                                <h2 className="login-welcome text-2xl">Face Verification</h2>
                                <p className="login-welcome-sub">Align your face to begin the scan.</p>
                            </div>

                            <div className="relative mx-auto w-44 h-44">
                                <div className="absolute inset-0 rounded-full login-verify-ring" />
                                <div className="absolute inset-2 rounded-full login-verify-inner flex items-center justify-center overflow-hidden">
                                    <ScanFace className="h-16 w-16 text-primary" />
                                    <motion.div
                                        className="absolute left-0 right-0 h-0.5 bg-primary/70 shadow-[0_0_16px_hsl(var(--primary))]"
                                        initial={{ top: "10%" }}
                                        animate={{ top: ["10%", "90%", "10%"] }}
                                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </div>
                                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="48" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
                                    <circle
                                        cx="50" cy="50" r="48" fill="none"
                                        stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round"
                                        strokeDasharray={`${(faceProgress / 100) * 301.6} 301.6`}
                                        className="transition-all duration-100"
                                    />
                                </svg>
                            </div>

                            <div className="flex justify-center gap-2">
                                {[0, 16, 33, 50, 66, 83].map((threshold) => (
                                    <div
                                        key={threshold}
                                        className={cn(
                                            "biometric-dot transition-all duration-300",
                                            faceProgress >= threshold && "biometric-dot-active"
                                        )}
                                    />
                                ))}
                            </div>

                            <div>
                                <p className="text-sm font-semibold tabular-nums login-brand-name">{faceProgress}%</p>
                                <p className="text-xs login-welcome-sub mt-1">
                                    {faceProgress < 30 ? "Detecting face contours..." : faceProgress < 60 ? "Mapping biometric points..." : faceProgress < 100 ? "Matching records..." : "✓ Verified"}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step === "location" && (
                        <motion.div
                            key="location"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="space-y-6 text-center"
                        >
                            <div className="space-y-1">
                                <h2 className="login-welcome text-2xl">Location Check</h2>
                                <p className="login-welcome-sub">Ensuring you are inside the active radius.</p>
                            </div>

                            <div className="relative mx-auto w-44 h-44">
                                <div className="absolute inset-0 rounded-3xl login-verify-ring" />
                                <div className="absolute inset-2 rounded-3xl login-verify-inner flex items-center justify-center">
                                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
                                        <MapPin className="h-16 w-16 text-primary" />
                                    </motion.div>
                                </div>
                                <motion.div
                                    className="absolute inset-0 rounded-3xl border-2 border-primary/30"
                                    animate={{ scale: [1, 1.15], opacity: [0.6, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </div>

                            <div className="space-y-2 px-6">
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ background: "linear-gradient(90deg, #1D9E75, #25d499)" }}
                                        animate={{ width: `${locProgress}%` }}
                                        transition={{ duration: 0.1 }}
                                    />
                                </div>
                                <p className="text-xs login-welcome-sub">
                                    {locProgress < 30 ? "Pinging GPS satellites..." : locProgress < 60 ? "Resolving coordinates..." : locProgress < 100 ? "VTL HQ · Ahmedabad, IN" : "✓ Inside VTL geofence"}
                                </p>
                                {locProgress >= 30 && locProgress < 100 && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] font-mono login-welcome-sub">
                                        23.0225° N, 72.5714° E
                                    </motion.p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {step === "done" && (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-4 py-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="mx-auto h-20 w-20 rounded-full bg-sage-3d shadow-3d flex items-center justify-center"
                            >
                                <CheckCircle2 className="h-10 w-10 text-white" />
                            </motion.div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold login-welcome">Checked In!</h2>
                                <p className="text-sm login-welcome-sub">You are now successfully on the clock.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
