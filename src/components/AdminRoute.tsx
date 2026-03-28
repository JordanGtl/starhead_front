'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem("sh_token")) {
      router.replace("/login");
    } else if (isAuthenticated && !user?.roles.includes("ROLE_ADMIN")) {
      router.replace("/");
    }
  }, [isAuthenticated, user, router]);

  // Session en cours de chargement (token présent mais /me pas encore résolu)
  if (!isAuthenticated && localStorage.getItem("sh_token")) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (!user?.roles.includes("ROLE_ADMIN")) return null;

  return <>{children}</>;
};

export default AdminRoute;
