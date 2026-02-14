"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import PremiumNotify from "../ui/Notification"// The component we made earlier

type NotificationType = "success" | "error" | "warning" | "info";

interface NotifyContextType {
  notify: (title: string, message: string, type?: NotificationType) => void;
}

const NotifyContext = createContext<NotifyContextType | undefined>(undefined);

export const NotifyProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState({
    show: false,
    title: "",
    message: "",
    type: "success" as NotificationType,
  });

  const notify = (title: string, message: string, type: NotificationType = "success") => {
    setState({ show: true, title, message, type });
  };

  const close = () => setState((prev) => ({ ...prev, show: false }));

  return (
    <NotifyContext.Provider value={{ notify }}>
      {children}
      <PremiumNotify 
        {...state} 
        onClose={close} 
      />
    </NotifyContext.Provider>
  );
};

// Custom Hook for easy access
export const useNotify = () => {
  const context = useContext(NotifyContext);
  if (!context) throw new Error("useNotify must be used within a NotifyProvider");
  return context;
};