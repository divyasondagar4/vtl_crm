import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { StatusPill } from "@/components/StatusPill";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { exportCsv } from "@/utils/csv";
import { toast } from "sonner";

// Generate mock attendance map for current month
const today = new Date();
function buildMonthStatus() {
  const map: Record<string, "Present" | "Absent" | "Leave"> = {};
  for (let i = 1; i <= today.getDate(); i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), i);
    const day = d.getDay();
    if (day === 0 || day === 6) continue;
    const seed = (i * 7) % 10;
    map[format(d, "yyyy-MM-dd")] = seed === 1 ? "Absent" : seed === 2 ? "Leave" : "Present";
  }
  return map;
}

const statusMap = buildMonthStatus();

export default function EmployeeAttendance() {
  const [selected, setSelected] = useState<Date | undefined>(today);

  const presentDays = Object.entries(statusMap).filter(([, v]) => v === "Present").map(([k]) => new Date(k));
  const absentDays = Object.entries(statusMap).filter(([, v]) => v === "Absent").map(([k]) => new Date(k));
  const leaveDays = Object.entries(statusMap).filter(([, v]) => v === "Leave").map(([k]) => new Date(k));

  const key = selected ? format(selected, "yyyy-MM-dd") : "";
  const selectedStatus = statusMap[key];

  const handleExport = () => {
    const rows = Object.entries(statusMap).map(([date, status]) => ({ date, status }));
    exportCsv("my-attendance.csv", rows);
    toast.success("CSV downloaded");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Attendance</h1>
          <p className="text-muted-foreground mt-1">Calendar view of your working days.</p>
        </div>
        <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{format(today, "MMMM yyyy")}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              className="rounded-md"
              modifiers={{ present: presentDays, absent: absentDays, leave: leaveDays }}
              modifiersClassNames={{
                present: "bg-success/15 text-success font-semibold hover:bg-success/25",
                absent: "bg-destructive/15 text-destructive font-semibold hover:bg-destructive/25",
                leave: "bg-warning/15 text-warning font-semibold hover:bg-warning/25",
              }}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Legend</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm"><span className="h-3 w-3 rounded bg-success" /> Present</div>
              <div className="flex items-center gap-2 text-sm"><span className="h-3 w-3 rounded bg-destructive" /> Absent</div>
              <div className="flex items-center gap-2 text-sm"><span className="h-3 w-3 rounded bg-warning" /> Leave</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Selected day</CardTitle></CardHeader>
            <CardContent>
              {selected ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium">{format(selected, "EEEE, MMMM d")}</p>
                  {selectedStatus ? (
                    <>
                      <StatusPill
                        label={selectedStatus}
                        variant={selectedStatus === "Present" ? "success" : selectedStatus === "Absent" ? "destructive" : "warning"}
                      />
                      {selectedStatus === "Present" && (
                        <div className="text-sm space-y-1 pt-2 border-t">
                          <p><span className="text-muted-foreground">Check-in: </span>9:12 AM</p>
                          <p><span className="text-muted-foreground">Check-out: </span>6:34 PM</p>
                          <p><span className="text-muted-foreground">Hours: </span>8h 22m</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Weekend or no data.</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Pick a day to see details.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
