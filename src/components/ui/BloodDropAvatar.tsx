import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface BloodDropAvatarProps {
  bloodType: string;
  lastDonationDate?: Date;
  className?: string;
  size?: "sm" | "md" | "lg";
  name?: string;
}

const bloodTypeColors = {
  "O+": "bg-blood",
  "O-": "bg-blood/80",
  "A+": "bg-medical-blue",
  "A-": "bg-medical-blue/80",
  "B+": "bg-green-500",
  "B-": "bg-green-500/80",
  "AB+": "bg-purple-500",
  "AB-": "bg-purple-500/80",
};

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export default function BloodDropAvatar({
  bloodType,
  lastDonationDate,
  className,
  size = "md",
  name,
}: BloodDropAvatarProps) {
  const [isEligible, setIsEligible] = useState(true);
  const [pulseSpeed, setPulseSpeed] = useState(2);
  const [daysSinceDonation, setDaysSinceDonation] = useState<number | null>(null);
  const [donationProgress, setDonationProgress] = useState(0);
  const [donationStatus, setDonationStatus] = useState<"recent" | "eligible" | "urgent">("recent");
  const [formattedDate, setFormattedDate] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Get initials from name if provided
  const initials = name ? name.split(" ").map(part => part[0]).join("") : "";

  useEffect(() => {
    if (lastDonationDate) {
      const daysSinceLastDonation = Math.floor(
        (new Date().getTime() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      setDaysSinceDonation(daysSinceLastDonation);
      
      // Format the date in AM/PM format
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };
      const formattedDateString = lastDonationDate.toLocaleDateString('en-US', options);
      setFormattedDate(formattedDateString);
      
      // Assuming 56 days (8 weeks) is the minimum time between donations
      const isEligibleToDonate = daysSinceLastDonation >= 56;
      setIsEligible(isEligibleToDonate);
      
      // Calculate progress towards next donation (0-100%)
      const progress = Math.min(100, (daysSinceLastDonation / 56) * 100);
      setDonationProgress(progress);
      
      // Determine donation status based on time since last donation
      if (daysSinceLastDonation < 56) {
        setDonationStatus("recent");
      } else if (daysSinceLastDonation < 120) { // Less than 4 months
        setDonationStatus("eligible");
      } else {
        setDonationStatus("urgent");
      }
      
      // Adjust pulse speed based on eligibility
      setPulseSpeed(isEligibleToDonate ? 1.5 : 3);
    }
  }, [lastDonationDate]);

  // Get status color based on donation status
  const getStatusColor = () => {
    switch (donationStatus) {
      case "recent":
        return "bg-amber-500";
      case "eligible":
        return "bg-green-500";
      case "urgent":
        return "bg-red-500";
      default:
        return "bg-amber-500";
    }
  };

  // Get status text based on donation status
  const getStatusText = () => {
    switch (donationStatus) {
      case "recent":
        return "Recently donated";
      case "eligible":
        return "Eligible to donate";
      case "urgent":
        return "Urgent: Donation needed";
      default:
        return "Recently donated";
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group",
        sizeClasses[size],
        className
      )}
    >
      {/* Outer glow effect */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full",
          bloodTypeColors[bloodType as keyof typeof bloodTypeColors] || "bg-blood",
          "opacity-20 blur-xl"
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main blood drop */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full",
          bloodTypeColors[bloodType as keyof typeof bloodTypeColors] || "bg-blood",
          "flex items-center justify-center text-white font-bold",
          "shadow-lg"
        )}
        animate={{
          scale: [1, 1.05, 1],
          y: [0, -2, 0],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-xs">{initials || bloodType}</span>
      </motion.div>

      {/* Holographic effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Status indicator dot */}
      {lastDonationDate && (
        <div className="absolute -bottom-1 -right-1">
          <div 
            className={cn(
              "w-2 h-2 rounded-full",
              getStatusColor()
            )}
          />
        </div>
      )}

      {/* Tooltip that appears on hover */}
      {lastDonationDate && daysSinceDonation !== null && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-background/90 px-2 py-1 rounded-md shadow-md text-xs whitespace-nowrap">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">
                {daysSinceDonation} {daysSinceDonation === 1 ? 'day' : 'days'} ago
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {getStatusText()}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5 border-t border-border/50 pt-0.5">
              {formattedDate}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 