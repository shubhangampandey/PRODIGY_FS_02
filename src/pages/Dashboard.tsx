import { useEmployees } from "@/hooks/useEmployees";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Building2, TrendingUp, UserPlus, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CHART_COLORS = [
  "hsl(220, 60%, 20%)",
  "hsl(174, 60%, 45%)",
  "hsl(220, 60%, 40%)",
  "hsl(174, 60%, 30%)",
  "hsl(220, 40%, 55%)",
  "hsl(174, 40%, 60%)",
  "hsl(220, 30%, 65%)",
  "hsl(174, 30%, 50%)",
];

const Dashboard = () => {
  const { employees, loading } = useEmployees();
  const navigate = useNavigate();

  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const departments = [...new Set(employees.map((e) => e.department))];

  const deptData = departments.map((dept) => {
    const deptEmps = employees.filter((e) => e.department === dept);
    return { name: dept, count: deptEmps.length, salary: deptEmps.reduce((s, e) => s + e.salary, 0) };
  });

  const stats = [
    { label: "Total Employees", value: employees.length, icon: Users, color: "bg-primary" },
    { label: "Departments", value: departments.length, icon: Building2, color: "bg-secondary" },
    { label: "Total Payroll", value: `$${totalSalary.toLocaleString()}`, icon: DollarSign, color: "bg-primary" },
    {
      label: "Avg Salary",
      value: employees.length ? `$${Math.round(totalSalary / employees.length).toLocaleString()}` : "$0",
      icon: TrendingUp,
      color: "bg-secondary",
    },
  ];

  // Recent employees (last 5)
  const recentEmployees = [...employees].slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your workforce</p>
        </div>
        <Button onClick={() => navigate("/dashboard/employees/add")}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <div className={cn(stat.color, "flex h-9 w-9 items-center justify-center rounded-lg")}>
                <stat.icon className="h-4 w-4 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      {employees.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employees by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deptData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(174, 60%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Salary Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={deptData} dataKey="salary" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {deptData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Employees */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Employees</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/employees")}>
            View all <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : recentEmployees.length === 0 ? (
            <p className="text-muted-foreground text-sm">No employees yet.</p>
          ) : (
            <div className="space-y-3">
              {recentEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.role} • {emp.department}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">${emp.salary.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
