// src/utils/toastService.ts
import { toast, ToastOptions,ToastIcon,ToastContent, Slide } from 'react-toastify';
import { CSSProperties  } from 'react';


const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccess = (message: ToastContent) =>
  toast.success(message, {
    ...baseOptions,
    style: {
      background: '#d1fae5',
      color: '#065f46',
      borderLeft: '5px solid #10b981',
    } as CSSProperties,
    icon: "✅" as unknown as ToastIcon,
        transition: Slide,
  });
export const showError = (message: string) =>
  toast.error(message, {
    ...baseOptions,
    style: {
      background: '#fee2e2',
      color: '#991b1b',
      borderLeft: '5px solid #ef4444',
    },
    icon: "❌" as unknown as ToastIcon
  });

export const showWarning = (message: string) =>
  toast.warning(message, {
    ...baseOptions,
    style: {
      background: '#fef9c3',
      color: '#92400e',
      borderLeft: '5px solid #facc15',
    },
    icon: "⚠️" as unknown as ToastIcon
  });

export const showInfo = (message: string) =>
  toast.info(message, {
    ...baseOptions,
    style: {
      background: '#dbeafe',
      color: '#1e3a8a',
      borderLeft: '5px solid #3b82f6',
    },
    icon: "ℹ️" as unknown  as ToastIcon
  });
