"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

type UserRole = "admin" | "organizer" | "user";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

interface CurrentUser {
  role: UserRole;
  id:string,
  name:string;
  email:string
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const router = useRouter();

  // Get data from all role slices
  const admin = useAppSelector((state) => state.adminAuth.admin);
  const organizer = useAppSelector((state) => state.organizerAuth.organizer);
  const user = useAppSelector((state) => state.auth.user);
   const [isClient, setIsClient] = useState(false);
    useEffect(() => {
    setIsClient(true); 
  }, []);


  // Identify logged-in user with role
  const currentUser: CurrentUser | null = useMemo(() => {
    if (admin) return { ...admin, role: "admin" };
    if (organizer) return { ...organizer, role: "organizer" };
    if (user) return { ...user, role: "user" };
    return null;
  }, [admin, organizer, user]);

 useEffect(() => {
    if (isClient) {
      if (!currentUser) {
         router.push(`/${allowedRoles[0]}/login`);
            // router.push("/");
      } else if (!allowedRoles.includes(currentUser.role)) {
        router.push("/unauthorized");
      }
    }
  }, [isClient, currentUser, allowedRoles, router]);

  if (!isClient) return null;

  return <>{currentUser && allowedRoles.includes(currentUser.role) && children}</>;
};

export default ProtectedRoute;
