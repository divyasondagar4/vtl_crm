import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDataStore, LeaveRequest } from "@/store/dataStore";
import { toast } from "sonner";

const tabs: LeaveRequest["status"][] = ["Pending", "Approved", "Rejected"];

export default function LeaveManagement() {
  const { leaves, setLeaveStatus } = useDataStore();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Leave Management</h1>
        <p className="text-muted-foreground mt-1">Review and act on leave requests.</p>
      </div>

      <Tabs defaultValue="Pending">
        <TabsList>
          {tabs.map((t) => {
            const count = leaves.filter((l) => l.status === t).length;
            return (
              <TabsTrigger key={t} value={t} className="gap-2">
                {t} <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">{count}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tabs.map((t) => {
          const items = leaves.filter((l) => l.status === t);
          return (
            <TabsContent key={t} value={t} className="mt-5">
              {items.length === 0 ? (
                <EmptyState title={`No ${t.toLowerCase()} leaves`} description="You're all caught up!" />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((l) => (
                    <Card key={l.id} className="p-4 space-y-3 hover:shadow-md transition-smooth">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{l.name}</p>
                          <p className="text-xs font-mono text-muted-foreground">{l.empId}</p>
                        </div>
                        <StatusPill label={l.type} variant="info" />
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <div><span className="text-muted-foreground">From </span>{l.from}</div>
                        <div><span className="text-muted-foreground">To </span>{l.to}</div>
                        <div><span className="text-muted-foreground">Days </span>{l.days}</div>
                      </div>
                      <p className="text-sm bg-muted/40 rounded-lg p-3">{l.reason}</p>
                      {t === "Pending" && (
                        <div className="flex gap-2 pt-1">
                          <Button size="sm" className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                            onClick={() => { setLeaveStatus(l.id, "Approved"); toast.success("Leave approved"); }}>
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={() => { setLeaveStatus(l.id, "Rejected"); toast("Leave rejected"); }}>
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
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
