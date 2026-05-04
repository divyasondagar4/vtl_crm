import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { StatusPill } from "@/components/StatusPill";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useDataStore, LeaveRequest } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { differenceInCalendarDays } from "date-fns";

const balances = [
  { label: "Casual", used: 4, total: 12, accent: "bg-gradient-primary" },
  { label: "Sick", used: 2, total: 8, accent: "bg-gradient-warm" },
  { label: "Earned", used: 6, total: 18, accent: "bg-gradient-success" },
  { label: "Unpaid", used: 0, total: 30, accent: "bg-gradient-primary" },
];

export default function EmployeeLeaves() {
  const { leaves, addLeave } = useDataStore();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<LeaveRequest["type"]>("Casual");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [half, setHalf] = useState(false);
  const [reason, setReason] = useState("");

  const myLeaves = leaves.filter((l) => l.name === user?.name);

  const handleApply = () => {
    if (!from || !to || !reason.trim() || !user) { toast.error("Please fill all fields"); return; }
    const days = Math.max(1, differenceInCalendarDays(new Date(to), new Date(from)) + 1);
    addLeave({
      empId: user.empId, name: user.name, type,
      from, to, days: half ? 0.5 : days, reason, halfDay: half,
    });
    toast.success("Leave request submitted");
    setOpen(false);
    setFrom(""); setTo(""); setReason(""); setHalf(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Leaves</h1>
          <p className="text-muted-foreground mt-1">Balances and requests.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary shadow-md"><Plus className="h-4 w-4 mr-2" /> Apply leave</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[460px]">
            <DialogHeader><DialogTitle>Apply for leave</DialogTitle></DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="space-y-1.5">
                <Label>Leave type</Label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Sick">Sick</SelectItem>
                    <SelectItem value="Earned">Earned</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>From</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
                <div className="space-y-1.5"><Label>To</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div><p className="text-sm font-medium">Half day</p><p className="text-xs text-muted-foreground">Counts as 0.5 days</p></div>
                <Switch checked={half} onCheckedChange={setHalf} />
              </div>
              <div className="space-y-1.5">
                <Label>Reason</Label>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Briefly describe..." className="min-h-[80px]" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleApply} className="bg-gradient-primary">Submit request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {balances.map((b) => (
          <Card key={b.label} className="p-4 hover:shadow-md transition-smooth">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">{b.label}</p>
              <div className={`h-8 w-8 rounded-lg ${b.accent} shadow-sm`} />
            </div>
            <p className="text-3xl font-bold tracking-tight">{b.total - b.used}<span className="text-base text-muted-foreground font-normal">/{b.total}</span></p>
            <p className="text-xs text-muted-foreground mb-2">days remaining</p>
            <Progress value={((b.total - b.used) / b.total) * 100} className="h-1.5" />
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {myLeaves.length === 0 ? (
            <p className="text-sm text-muted-foreground p-6 text-center">You have no leave history yet.</p>
          ) : myLeaves.map((l) => (
            <div key={l.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-sm">{l.type} leave · {l.days} day{l.days > 1 ? "s" : ""}</p>
                <p className="text-xs text-muted-foreground">{l.from} → {l.to}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l.reason}</p>
              </div>
              <StatusPill label={l.status} variant={l.status === "Approved" ? "success" : l.status === "Rejected" ? "destructive" : "warning"} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
