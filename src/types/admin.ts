
// Common admin types
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

// User Management types
export interface User {
  id: string;
  name: string;
  email: string;
  bloodType: string;
  location: string;
  status: "verified" | "pending" | "rejected" | "banned";
  registeredDate: string;
  documents: string[];
  phone?: string;
  age?: number | string;
}

// Request Management types
export interface BloodRequest {
  id: string;
  title: string;
  bloodType: string;
  location: string;
  status: "urgent" | "scheduled" | "ongoing" | "completed";
  deadline: string;
  createdAt: string;
  description: string;
  matched: boolean;
}
