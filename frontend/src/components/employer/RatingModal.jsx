import React, { useState } from "react";
import Modal from "../ui/Modal";
import StarRating from "../ui/StarRating";

export default function RatingModal({ open, onClose, onSubmit }) {
  const [rating, setRating]     = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!rating) return;
    onSubmit({ rating, feedback });
    setRating(0); setFeedback("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Rate this Worker" maxWidth={420}>
      <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: "14px" }}>
        Share your experience (within 7 days of completion)
      </p>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <StarRating value={rating} onChange={setRating} size={32} />
      </div>
      <textarea className="wb-input" rows={3} maxLength={300}
        placeholder="Optional feedback (max 300 characters)"
        value={feedback} onChange={e => setFeedback(e.target.value)}
        style={{ marginBottom: "6px", resize: "none" }} />
      <div style={{ fontSize: "12px", color: "#9ca3af", textAlign: "right", marginBottom: "20px" }}>
        {feedback.length}/300
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={onClose}
          style={{ flex: 1, padding: "12px", background: "white", border: "1.5px solid #1e1e1e", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}>
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={!rating}
          style={{ flex: 1, padding: "12px", background: !rating ? "#e5e5e5" : "#1e1e1e", color: !rating ? "#9ca3af" : "white", border: "none", borderRadius: "10px", fontWeight: 700, cursor: !rating ? "not-allowed" : "pointer" }}>
          Submit Rating
        </button>
      </div>
    </Modal>
  );
}