import React from "react";

export default function CostEstimator({ rate = 0, qty = 1, unit = "hr" }) {
  const total = rate * qty;
  return (
    <div style={{ background: "#1e1e1e", borderRadius: "14px", padding: "20px 24px" }}>
      <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "4px" }}>Estimated Cost</div>
      <div style={{ fontSize: "32px", fontWeight: 800, color: "#5ecfb8" }}>
        PKR {total.toLocaleString()}
      </div>
      <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
        PKR {rate.toLocaleString()}/{unit} × {qty} {unit}{qty > 1 ? "s" : ""}
      </div>
    </div>
  );
}