
import { User, BloodRequest } from "@/types/admin";

// Mock user data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    bloodType: "O+",
    location: "San Francisco, CA",
    status: "verified",
    registeredDate: "April 15, 2023",
    documents: ["ID Card", "Blood Test Report"]
  },
  {
    id: "2",
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    bloodType: "A-",
    location: "Oakland, CA",
    status: "pending",
    registeredDate: "June 22, 2023",
    documents: ["ID Card", "Medical Certificate"]
  },
  {
    id: "3",
    name: "Michael Davis",
    email: "michael.davis@example.com",
    bloodType: "B+",
    location: "San Jose, CA",
    status: "rejected",
    registeredDate: "May 10, 2023",
    documents: ["Driver's License"]
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    bloodType: "AB+",
    location: "Palo Alto, CA",
    status: "pending",
    registeredDate: "July 3, 2023",
    documents: ["Passport", "Blood Test Report"]
  },
  {
    id: "5",
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    bloodType: "O-",
    location: "Berkeley, CA",
    status: "verified",
    registeredDate: "March 28, 2023",
    documents: ["ID Card", "Medical Certificate"]
  }
];

// Mock blood request data
export const mockRequests: BloodRequest[] = [
  {
    id: "1",
    title: "Emergency Transfusion",
    bloodType: "O+",
    location: "San Francisco General Hospital",
    status: "urgent",
    deadline: "Today, 6:00 PM",
    createdAt: "Today, 10:24 AM",
    description: "Patient needs emergency blood transfusion after vehicle accident. Critical condition.",
    matched: false
  },
  {
    id: "2",
    title: "Scheduled Surgery",
    bloodType: "A-",
    location: "UCSF Medical Center",
    status: "scheduled",
    deadline: "Jul 24, 2023",
    createdAt: "Jul 10, 2023",
    description: "Blood needed for scheduled heart surgery. 2 donors required.",
    matched: true
  },
  {
    id: "3",
    title: "Leukemia Treatment",
    bloodType: "B+",
    location: "Stanford Medical Center",
    status: "ongoing",
    deadline: "Weekly until Aug 30",
    createdAt: "Jun 15, 2023",
    description: "Regular blood platelets needed for ongoing leukemia treatment.",
    matched: true
  },
  {
    id: "4",
    title: "Kidney Transplant",
    bloodType: "AB+",
    location: "Kaiser Permanente Medical Center",
    status: "scheduled",
    deadline: "Jul 18, 2023",
    createdAt: "Jul 5, 2023",
    description: "Blood needed for scheduled kidney transplant surgery.",
    matched: false
  },
  {
    id: "5",
    title: "Burn Treatment",
    bloodType: "O-",
    location: "Santa Clara Valley Medical Center",
    status: "urgent",
    deadline: "Tomorrow, 9:00 AM",
    createdAt: "Today, 2:15 PM",
    description: "Patient with severe burns needs universal donor blood.",
    matched: false
  }
];
