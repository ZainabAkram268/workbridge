import React from "react";
import Badge from "../ui/Badge";
import { Clock, Check, Circle, CircleDot, CheckCircle, X, AlarmClock, Shield } from "lucide-react";

const STATUS_MAP = {
  "Requested":             { variant: "requested",   icon: <Clock size={12} />,       label: "Requested" },
  "Accepted":              { variant: "accepted",    icon: <Check size={12} />,       label: "Accepted" },
  "In Progress":           { variant: "in-progress", icon: <CircleDot size={12} />,   label: "In Progress" },
  "Awaiting Confirmation": { variant: "awaiting",    icon: <CircleDot size={12} />,   label: "Awaiting Confirm" },
  "Completed":             { variant: "completed",   icon: <CheckCircle size={12} />, label: "Completed" },
  "Rejected":              { variant: "rejected",    icon: <X size={12} />,           label: "Rejected" },
  "Cancelled":             { variant: "cancelled",   icon: <X size={12} />,           label: "Cancelled" },
  "Expired":               { variant: "expired",     icon: <AlarmClock size={12} />,  label: "Expired" },
  "Available":             { variant: "available",   icon: <Circle size={12} />,      label: "Available" },
  "Busy":                  { variant: "busy",        icon: <Circle size={12} />,      label: "Busy" },
  "Pending Verification":  { variant: "pending",     icon: <Clock size={12} />,       label: "Pending" },
  "Active":                { variant: "verified",    icon: <Shield size={12} />,      label: "Active" },
};

export default function StatusBadge({ status = "" }) {
  const config = STATUS_MAP[status] || { variant: "default", icon: null, label: status };
  return (
    <Badge variant={config.variant}>
      <span className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </span>
    </Badge>
  );
}