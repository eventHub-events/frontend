"use client"
import Spinner from "@/components/ui/Spinner";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const withRoleProtection = (
  WrappedComponent: React.FC,
  allowedRoles: string[]
): React.FC => {
  const ProtectedComponent: React.FC = () => {
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();
    const[loading,setLoading]= useState(true)

    useEffect(() => {
      const timeout = setTimeout(() => {
        setLoading(false);
        if (!user || !allowedRoles.includes(user.role)) {
          router.replace("/");
        }
      }, 500); 

      return () => clearTimeout(timeout);
    }, [user]);

    if (loading) return <Spinner />

    return <WrappedComponent />;
  };

  
  ProtectedComponent.displayName = `withRoleProtection(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ProtectedComponent;
};
