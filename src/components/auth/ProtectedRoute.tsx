import { Navigate, useLocation } from "react-router-dom";
import { useUser, UserRole } from "@/contexts/UserContext";
import { Heart } from "lucide-react";

interface Props {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { user, role, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-blush/30 via-background to-wedding-cream/30">
        <Heart className="h-10 w-10 text-primary fill-primary animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && role && role !== allowedRole) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <>{children}</>;
}
