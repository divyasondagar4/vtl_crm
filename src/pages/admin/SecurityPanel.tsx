import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/StatusPill";
import { Shield, Eye } from "lucide-react";

const loginLogs = [
  { user: "Aarav Mehta", device: "MacBook Pro · Chrome", ip: "192.168.1.12", time: "2 min ago", status: "success" },
  { user: "Priya Shah", device: "iPhone 15 · Safari", ip: "192.168.1.44", time: "18 min ago", status: "success" },
  { user: "unknown@?.com", device: "Windows · Firefox", ip: "201.45.9.88", time: "1 h ago", status: "failed" },
  { user: "Rohan Kapoor", device: "Windows · Edge", ip: "192.168.1.67", time: "3 h ago", status: "success" },
];

const faceLogs = [
  { user: "Diya Nair", confidence: 98, time: "9:04 AM", status: "verified" },
  { user: "Dev Malhotra", confidence: 72, time: "9:12 AM", status: "retry" },
  { user: "Ananya Rao", confidence: 96, time: "9:18 AM", status: "verified" },
];

export default function SecurityPanel() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground mt-1">Logins and face verifications.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Login logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loginLogs.map((l, i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-muted/40">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{l.user}</p>
                  <p className="text-xs text-muted-foreground truncate">{l.device} · {l.ip}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusPill label={l.status} variant={l.status === "success" ? "success" : "destructive"} />
                  <span className="text-[11px] text-muted-foreground">{l.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Face verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {faceLogs.map((f, i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-muted/40">
                <div>
                  <p className="text-sm font-medium">{f.user}</p>
                  <p className="text-xs text-muted-foreground">Confidence: {f.confidence}%</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusPill label={f.status} variant={f.status === "verified" ? "success" : "warning"} />
                  <span className="text-[11px] text-muted-foreground">{f.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
