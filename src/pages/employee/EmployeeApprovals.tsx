import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Inbox, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { useDataStore, LeaveRequest } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";

const tabs: { key: string; label: string; icon: any; msg: string }[] = [
  { key: "All", label: "All Requests", icon: Inbox, msg: "No requests found." },
  { key: "Pending", label: "Pending", icon: Clock, msg: "No pending approvals. Enjoy the calm ✨" },
  { key: "Approved", label: "Approved", icon: CheckCircle2, msg: "Nothing approved yet — your future requests will show here." },
  { key: "Rejected", label: "Rejected", icon: XCircle, msg: "No rejections. Keep it up!" },
  { key: "Regularization", label: "Regularization", icon: RefreshCw, msg: "No regularization requests." },
];

export default function EmployeeApprovals() {
  const { leaves } = useDataStore();
  const { user } = useAuthStore();
  const mine = leaves.filter((l) => l.name === user?.name);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Approvals</h1>
        <p className="text-muted-foreground mt-1">Track the status of your leave requests.</p>
      </div>

      <Tabs defaultValue="Pending">
        <TabsList>
          {tabs.map((t) => {
            const count = t.key === "All"
              ? mine.length
              : t.key === "Regularization"
                ? mine.filter(l => l.type === "Regularization").length
                : mine.filter((l) => l.status === t.key).length;
            return (
              <TabsTrigger key={t.key} value={t.key} className="gap-2">
                {t.label} <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">{count}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tabs.map((t) => {
          const items = t.key === "All"
            ? mine
            : t.key === "Regularization"
              ? mine.filter(l => l.type === "Regularization")
              : mine.filter((l) => l.status === t.key);
          return (
            <TabsContent key={t.key} value={t.key} className="mt-5">
              {items.length === 0 ? (
                <EmptyState icon={t.icon} title={`No ${t.label.toLowerCase()} requests`} description={t.msg} />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((l) => (
                    <Card key={l.id} className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold">{l.type} leave</p>
                        <StatusPill
                          label={l.status}
                          variant={l.status === "Approved" ? "success" : l.status === "Rejected" ? "destructive" : "warning"}
                        />
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <div><span className="text-muted-foreground">From </span>{l.from}</div>
                        <div><span className="text-muted-foreground">To </span>{l.to}</div>
                        <div><span className="text-muted-foreground">Days </span>{l.days}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{l.reason}</p>
                      <p className="text-xs text-muted-foreground pt-1 border-t">Applied on {l.appliedOn}</p>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
