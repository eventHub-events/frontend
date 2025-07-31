import React from "react";

interface EventHubIconProps {
  size?: number;
  className?: string;
}

const EventHubIcon: React.FC<EventHubIconProps> = ({ 
  size = 24,
  className = ""
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient background circle */}
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" /> {/* violet-600 */}
          <stop offset="50%" stopColor="#38BDF8" /> {/* azure-500 */}
          <stop offset="100%" stopColor="#3B82F6" /> {/* blue-500 */}
        </linearGradient>
      </defs>
      
      {/* Modern calendar with event indicators */}
      <path
        d="M5 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V8C3 6.89543 3.89543 6 5 6Z"
        stroke="url(#iconGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 4V8M8 4V8M3 10H21"
        stroke="url(#iconGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Event dots */}
      <circle cx="12" cy="14" r="1" fill="url(#iconGradient)" />
      <circle cx="16" cy="14" r="1" fill="url(#iconGradient)" />
      <circle cx="8" cy="14" r="1" fill="url(#iconGradient)" />
      <circle cx="12" cy="17" r="1" fill="url(#iconGradient)" />
    </svg>
  );
};

export default EventHubIcon;