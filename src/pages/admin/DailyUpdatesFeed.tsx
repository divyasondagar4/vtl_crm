import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusPill } from "@/components/StatusPill";
import { useDataStore } from "@/store/dataStore";
import { formatDistanceToNow } from "date-fns";

export default function DailyUpdatesFeed() {
  const { updates } = useDataStore();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const filtered = updates.filter(u => u.timestamp.startsWith(date));

  return (
    <div className="space-y-6 w-full max-w-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Daily Updates</h1>
          <p className="text-muted-foreground mt-1">Share your progress and see what the team accomplished.</p>
        </div>

        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border/50 rounded-xl shadow-sm cursor-pointer hover:bg-muted/50 transition-smooth">
            <span className="font-medium">{format(new Date(date), "dd-MM-yyyy")}</span>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
            <Pencil className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <p className="text-muted-foreground">No updates posted on today yet.</p>
        </div>
      ) : (
        <div className="w-full space-y-3">
          {filtered.map((u, i) => (
            <Card key={u.id} className="p-4 hover:shadow-md transition-smooth animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-semibold">
                    {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-sm">{u.name}</p>
                    <StatusPill label={u.role} variant="muted" />
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDistanceToNow(new Date(u.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm mt-2 leading-relaxed">{u.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
