import { useNavigate, useParams } from "react-router-dom";
import { useEmployees } from "@/hooks/useEmployees";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Pencil, Trash2, Mail, Phone, Building2,
  Briefcase, DollarSign, CalendarDays, Clock, UserCheck,
  Star, FileText, Award,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { format, differenceInMonths, differenceInYears } from "date-fns";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, loading, deleteEmployee, getEmployee } = useEmployees();

  const emp = id ? getEmployee(id) : undefined;

  const handleDelete = async () => {
    if (!emp) return;
    try {
      await deleteEmployee(emp.id);
      toast({ title: "Deleted", description: `${emp.name} has been removed.` });
      navigate("/dashboard/employees");
    } catch {
      toast({ title: "Error", description: "Failed to delete employee.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground">Loading...</div>;
  }

  if (!emp) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4">Employee not found.</p>
        <Button variant="outline" onClick={() => navigate("/dashboard/employees")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Employees
        </Button>
      </div>
    );
  }

  const joinDate = new Date(emp.joiningDate);
  const now = new Date();
  const tenureYears = differenceInYears(now, joinDate);
  const tenureMonths = differenceInMonths(now, joinDate) % 12;
  const tenureText = tenureYears > 0
    ? `${tenureYears}y ${tenureMonths}m`
    : `${tenureMonths}m`;

  const initials = emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  // Generate a simulated activity timeline based on employee data
  const activities = [
    {
      icon: UserCheck,
      title: "Employee Onboarded",
      description: `${emp.name} joined the ${emp.department} department as ${emp.role}.`,
      date: emp.joiningDate,
      color: "bg-secondary",
    },
    {
      icon: FileText,
      title: "Profile Created",
      description: "Employee record was created in the system.",
      date: emp.joiningDate,
      color: "bg-primary",
    },
    {
      icon: Award,
      title: "Department Assignment",
      description: `Assigned to ${emp.department} department.`,
      date: emp.joiningDate,
      color: "bg-secondary",
    },
    {
      icon: Star,
      title: "Role Assigned",
      description: `Designated as ${emp.role}.`,
      date: emp.joiningDate,
      color: "bg-primary",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/employees")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Employee Profile</h1>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary to-secondary" />
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="-mt-14 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-card bg-primary text-3xl font-bold text-primary-foreground shadow-lg">
                {initials}
              </div>
              <div className="pb-1">
                <h2 className="text-2xl font-bold">{emp.name}</h2>
                <p className="text-muted-foreground">{emp.role}</p>
                <Badge variant="secondary" className="mt-1">{emp.department}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/dashboard/employees/edit/${emp.id}`)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {emp.name}?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{emp.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{emp.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium">{emp.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{emp.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <p className="text-sm font-medium">${emp.salary.toLocaleString()} / year</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Joining Date</p>
                  <p className="text-sm font-medium">{format(joinDate, "MMM d, yyyy")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats + Timeline */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> Tenure
                </div>
                <span className="text-sm font-semibold">{tenureText}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" /> Monthly
                </div>
                <span className="text-sm font-semibold">${Math.round(emp.salary / 12).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" /> Started
                </div>
                <span className="text-sm font-semibold">{format(joinDate, "MMM yyyy")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 pl-6 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-border">
                {activities.map((activity, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full ${activity.color}`}>
                      <activity.icon className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground/60">
                        {format(new Date(activity.date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
