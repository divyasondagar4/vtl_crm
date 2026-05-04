import { useState, useMemo } from "react";
import { Plus, Search, Download, Trash2, Camera, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useDataStore, Employee } from "@/store/dataStore";
import { toast } from "sonner";
import { exportCsv } from "@/utils/csv";

const emptyForm: Omit<Employee, "id"> = {
  name: "", email: "", empId: "", role: "employee", department: "Engineering",
  reportsTo: "—", joiningDate: new Date().toISOString().slice(0, 10),
  faceStatus: "pending", status: "active",
};

export default function UserManagement() {
  const { employees, addEmployee, deleteEmployee } = useDataStore();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const departments = useMemo(
    () => ["all", ...Array.from(new Set(employees.map((e) => e.department)))],
    [employees]
  );

  const filtered = employees.filter((e) =>
    (dept === "all" || e.department === dept) &&
    (q === "" || [e.name, e.email, e.empId].some((v) => v.toLowerCase().includes(q.toLowerCase())))
  );

  const handleAdd = () => {
    if (!form.name || !form.email || !form.empId) {
      toast.error("Please fill in name, email and employee ID");
      return;
    }
    addEmployee(form);
    toast.success(`${form.name} added to the team`);
    setForm(emptyForm);
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage employees, roles and access.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportCsv("employees.csv", filtered)}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-md">
                <Plus className="h-4 w-4 mr-2" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Add new employee</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Full name</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Employee ID</Label>
                    <Input value={form.empId} onChange={(e) => setForm({ ...form, empId: e.target.value })} placeholder="VTL-021" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Role</Label>
                    <Select value={form.role} onValueChange={(v: any) => setForm({ ...form, role: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Department</Label>
                    <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Reports to</Label>
                    <Input value={form.reportsTo} onChange={(e) => setForm({ ...form, reportsTo: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Joining date</Label>
                    <Input type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleAdd} className="bg-gradient-primary">Add employee</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <div className="relative flex-1 w-full sm:min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, email or ID" className="pl-9 w-full" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>{d === "all" ? "All departments" : d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No users found" description="Try adjusting your filters or search." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Employee</TableHead>
                  <TableHead>EMP ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Reports to</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Face</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                            {e.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{e.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{e.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{e.empId}</TableCell>
                    <TableCell>
                      <StatusPill label={e.role} variant={e.role === "admin" ? "info" : e.role === "manager" ? "warning" : "muted"} />
                    </TableCell>
                    <TableCell className="text-sm">{e.department}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{e.reportsTo}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{e.joiningDate}</TableCell>
                    <TableCell>
                      <StatusPill label={e.faceStatus} variant={e.faceStatus === "registered" ? "success" : "warning"} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast("Upload face UI (demo)")}>
                          <Camera className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast("Edit form (demo)")}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => { deleteEmployee(e.id); toast.success(`${e.name} removed`); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
