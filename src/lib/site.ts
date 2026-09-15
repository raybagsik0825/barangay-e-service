import {
  Bell,
  Scale,
  ShieldCheck,
  FileText,
  Users,
  Landmark,
  FileSignature,
  File,
  CalendarDays,
  MapPin,
  CheckCircle2,
  ShieldAlert,
  Search,
  Lock,
  ChevronDown,
  Download,
  Facebook,
  Twitter,
  Mail,
  Phone,
  Clock,
  ArrowUp,
  Package,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const siteConfig = {
  name: "Barangay E-Services",
  description:
    "Digital Barangay Services & Safety Portal — community announcements, Lupon hearing schedules, crime registry, and PNP document access.",
  hotline: "(02) 8123-4567",
  pnp: "(02) 8987-6543",
  emergency: "911",
} as const;

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Announcements", href: "#announcements" },
  { label: "Hearings", href: "#hearings" },
  { label: "Safety", href: "#crime-db" },
  { label: "PNP Portal", href: "#pnp-portal" },
  { label: "Lost & Found", href: "#lost-found" },
] as const;

export const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Bell,
    title: "Community Announcements",
    description:
      "Stay updated with critical barangay developments, projects, health advisories, and official events.",
  },
  {
    icon: Scale,
    title: "Lupon & Hearing System",
    description:
      "Track complaint schedules, subpoena issuances, and Lupon member availability efficiently online.",
  },
  {
    icon: ShieldCheck,
    title: "Crime Registry & Safety",
    description:
      "Access public safety records and offender profiles for community awareness and vigilance.",
  },
  {
    icon: FileText,
    title: "PNP Document Access",
    description:
      "Seamless digital transmission of Certificates to File Action (CFA) and case files to local PNP offices.",
  },
];

export const stats = [
  { icon: Users, value: 2450, label: "Registered Residents", tone: "blue" },
  { icon: Landmark, value: 183, label: "Cases Resolved", tone: "green" },
  { icon: ShieldAlert, value: 47, label: "Active Alerts", tone: "red" },
  { icon: FileSignature, value: 312, label: "Documents Filed", tone: "yellow" },
] as const;

export const announcements = [
  {
    date: "September 5, 2026",
    title: "Barangay Clean-up Drive & Dengue Awareness Program",
    description:
      "All residents are invited to join the upcoming community clean-up drive starting at 6:00 AM at the Barangay Hall Plaza. Free health kits will be distributed.",
  },
  {
    date: "August 28, 2026",
    title: "Notice of Lupon Tagapamayapa General Assembly",
    description:
      "A meeting will be held for all appointed Lupon members regarding updated legal procedures for conciliation and mediation.",
  },
  {
    date: "August 15, 2026",
    title: "Road Repair Advisory — Purok 2 Main Road",
    description:
      "Paving and drainage improvement works will commence on August 18. Residents are advised to use alternate routes during construction hours.",
  },
] as const;

export const crimes = [
  {
    status: "Active Alert",
    badge: "danger",
    icon: ShieldAlert,
    title: "Incident: Theft Report",
    location: "Zone 3, Main Market",
    description:
      "Reported suspects and incident details updated for public awareness.",
  },
  {
    status: "Resolved",
    badge: "success",
    icon: CheckCircle2,
    title: "Incident: Public Disturbance",
    location: "Purok 2",
    description: "Resolved through Barangay Lupon intervention. Record logged.",
  },
  {
    status: "Under Investigation",
    badge: "warning",
    icon: Search,
    title: "Incident: Vandalism",
    location: "Community Center",
    description: "Profile details captured for reference and investigation.",
  },
] as const;

export const lostAndFound = [
  {
    type: "lost" as const,
    title: "Brown Leather Wallet",
    location: "Barangay Hall Plaza",
    date: "September 10, 2026",
    description:
      "Contains valid IDs and cash. Last seen near the registration desk during the clean-up drive.",
  },
  {
    type: "found" as const,
    title: "Samsung Galaxy A15",
    location: "Purok 2, Main Road",
    date: "September 8, 2026",
    description:
      "Found near the road repair area. Phone is locked. Owner may claim at the Barangay Hall with valid ID.",
  },
  {
    type: "lost" as const,
    title: "Child's Red Backpack",
    location: "Community Center",
    date: "September 6, 2026",
    description:
      "Belonging of a Grade 3 student. Contains school supplies and a lunch box. Please return to the Barangay Hall.",
  },
  {
    type: "found" as const,
    title: "Set of House Keys",
    location: "Zone 3, Near Market Entrance",
    date: "September 4, 2026",
    description:
      "Three keys on a keychain with a small flashlight. Found by a market vendor and turned over to the Barangay Hall.",
  },
  {
    type: "found" as const,
    title: "Gold Bracelet",
    location: "Barangay Hall Plaza",
    date: "September 2, 2026",
    description:
      "Found on a bench during the general assembly. Owner must present proof of ownership to claim.",
  },
  {
    type: "lost" as const,
    title: "Prescription Eyeglasses",
    location: "Purok 1, Near Health Center",
    date: "August 30, 2026",
    description:
      "Black-framed eyeglasses with progressive lenses. Last seen at the health center waiting area.",
  },
] as const;

// Re-export icon set for components
export const Icons = {
  CalendarDays,
  MapPin,
  Search,
  Lock,
  ChevronDown,
  Download,
  Facebook,
  Twitter,
  Mail,
  Phone,
  Clock,
  ArrowUp,
  ShieldAlert,
  File,
  Package,
  HelpCircle,
};
