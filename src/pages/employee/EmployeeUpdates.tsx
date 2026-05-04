import { useState } from "react";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusPill } from "@/components/StatusPill";
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function EmployeeUpdates() {
  const { updates, addUpdate } = useDataStore();
  const { user } = useAuthStore();
  const [text, setText] = useState("");

  const handlePost = () => {
    if (!text.trim() || !user) return;
    addUpdate({ empId: user.empId, name: user.name, role: user.role, text: text.trim() });
    setText("");
    toast.success("Update posted");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Daily Updates</h1>
        <p className="text-muted-foreground mt-1">Share what you're working on today.</p>
      </div>

      <div className="max-w-3xl space-y-4">
        <Card className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-semibold">
                {user?.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="What did you ship today?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[90px] resize-none"
              />
              <div className="flex justify-end">
                <Button onClick={handlePost} disabled={!text.trim()} className="bg-gradient-primary">
                  <Send className="h-4 w-4 mr-2" /> Post update
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {updates.map((u, i) => (
            <Card key={u.id} className="p-4 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
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
      </div>
    </div>
  );
}
