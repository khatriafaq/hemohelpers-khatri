
import { useState } from "react";
import { cn } from "@/lib/utils";

type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

interface BloodTypeSelectorProps {
  value: BloodType | null;
  onChange: (value: BloodType) => void;
  className?: string;
}

const BloodTypeSelector = ({ value, onChange, className }: BloodTypeSelectorProps) => {
  const bloodTypes: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {bloodTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={cn(
            "p-3 rounded-lg transition-all duration-200 flex items-center justify-center",
            value === type
              ? "bg-blood text-white font-medium shadow-sm"
              : "bg-secondary hover:bg-secondary/80 text-foreground/70"
          )}
        >
          {type}
        </button>
      ))}
    </div>
  );
};

export default BloodTypeSelector;
