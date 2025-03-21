
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Droplet, Users, ShieldCheck, AlertTriangle } from "lucide-react";

// Mock data for stats
const stats = [
  { 
    title: "Total Donors", 
    value: 2143, 
    change: "+12%", 
    icon: <Users className="h-8 w-8 text-medical-blue" />,
    description: "Registered donors in the system"
  },
  { 
    title: "Pending Verifications", 
    value: 37, 
    change: "+3", 
    icon: <ShieldCheck className="h-8 w-8 text-yellow-500" />,
    description: "Donor profiles awaiting verification"
  },
  { 
    title: "Active Requests", 
    value: 28, 
    change: "-5", 
    icon: <Droplet className="h-8 w-8 text-blood" />,
    description: "Current blood donation requests"
  },
  { 
    title: "Urgent Needs", 
    value: 8, 
    change: "+2", 
    icon: <AlertTriangle className="h-8 w-8 text-destructive" />,
    description: "High priority blood requests"
  },
];

// Mock data for charts
const donationsByBloodType = [
  { name: "O+", value: 35 },
  { name: "A+", value: 25 },
  { name: "B+", value: 15 },
  { name: "AB+", value: 8 },
  { name: "O-", value: 7 },
  { name: "A-", value: 5 },
  { name: "B-", value: 3 },
  { name: "AB-", value: 2 },
];

const donationsByMonth = [
  { name: "Jan", donations: 45 },
  { name: "Feb", donations: 52 },
  { name: "Mar", donations: 48 },
  { name: "Apr", donations: 61 },
  { name: "May", donations: 55 },
  { name: "Jun", donations: 67 },
  { name: "Jul", donations: 62 },
  { name: "Aug", donations: 59 },
  { name: "Sep", donations: 74 },
  { name: "Oct", donations: 78 },
  { name: "Nov", donations: 71 },
  { name: "Dec", donations: 82 },
];

const BLOOD_TYPE_COLORS = [
  "#e74c3c", // O+
  "#c0392b", // A+
  "#e67e22", // B+
  "#d35400", // AB+
  "#9b59b6", // O-
  "#8e44ad", // A-
  "#3498db", // B-
  "#2980b9", // AB-
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="rounded-full p-2 bg-secondary">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className={`mt-2 text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-destructive'}`}>
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Donations by Blood Type</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donationsByBloodType}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {donationsByBloodType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLOOD_TYPE_COLORS[index % BLOOD_TYPE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Donations</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="donations" fill="#ea384c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
