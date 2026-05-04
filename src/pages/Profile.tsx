import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Mail, Phone, MapPin, Briefcase, IdCard, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    location: user?.location ?? "",
    bio: user?.bio ?? "",
    department: user?.department ?? "",
  });

  const initials = user?.name.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "??";

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    toast.success("Profile updated");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your public details.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Avatar + summary */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="card-3d border-0">
            <CardContent className="p-6 text-center space-y-4">
              <div className="relative inline-block">
                <div className="absolute -inset-2 rounded-full bg-sage-3d opacity-50 blur-xl" />
                <Avatar className="h-28 w-28 mx-auto border-4 border-card shadow-3d relative">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-sage-3d shadow-3d flex items-center justify-center text-primary-foreground hover:scale-105 transition-smooth">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="font-bold text-lg">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role} · {user?.department}</p>
              </div>
              <div className="space-y-2 pt-3 border-t border-border text-left">
                <div className="flex items-center gap-2 text-sm"><IdCard className="h-4 w-4 text-muted-foreground" /> {user?.empId}</div>
                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> <span className="truncate">{user?.email}</span></div>
                <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {user?.phone}</div>
                <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /> {user?.location}</div>
                <div className="flex items-center gap-2 text-sm"><Briefcase className="h-4 w-4 text-muted-foreground" /> {user?.department}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit form */}
        <Card className="lg:col-span-2 card-3d border-0">
          <CardHeader><CardTitle>Edit details</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input value={form.name} onChange={set("name")} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={set("email")} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={set("phone")} />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={form.location} onChange={set("location")} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Department</Label>
                <Input value={form.department} onChange={set("department")} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Bio</Label>
                <Textarea value={form.bio} onChange={set("bio")} className="min-h-[100px]" />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" className="bg-sage-3d shadow-3d border-0 text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" /> Save changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
