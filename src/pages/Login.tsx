import { useNavigate } from "react-router-dom";
import { useUser, UserRole } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ClipboardList, Users, Store } from "lucide-react";

const roles: { role: UserRole; label: string; description: string; icon: typeof ClipboardList; path: string }[] = [
  {
    role: "planner",
    label: "Wedding Planner",
    description: "Manage weddings, clients, vendors, and budgets",
    icon: ClipboardList,
    path: "/planner/dashboard",
  },
  {
    role: "client",
    label: "Couple / Client",
    description: "Plan your wedding, track progress, and connect with vendors",
    icon: Users,
    path: "/client/dashboard",
  },
  {
    role: "vendor",
    label: "Vendor",
    description: "Manage bookings, services, and communicate with clients",
    icon: Store,
    path: "/vendor/dashboard",
  },
];

export default function Login() {
  const { setRole } = useUser();
  const navigate = useNavigate();

  const handleSelect = (role: UserRole, path: string) => {
    setRole(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-blush/30 via-background to-wedding-cream/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <Heart className="h-10 w-10 text-primary fill-primary mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">Welcome to WedPlan</h1>
          <p className="text-muted-foreground">Choose how you'd like to continue</p>
        </div>

        <div className="grid gap-4">
          {roles.map((r) => (
            <Card
              key={r.role}
              className="cursor-pointer border-border/50 hover:border-primary/50 hover:shadow-md transition-all group"
              onClick={() => handleSelect(r.role, r.path)}
            >
              <CardContent className="flex items-center gap-5 p-6">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <r.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{r.label}</CardTitle>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0">
                  Enter →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
