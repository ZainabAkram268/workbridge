import React, { useState } from "react";
import { Wrench, X, Check, ArrowLeft, Car, Home, Leaf, Baby, ChefHat, Zap, Shield } from "lucide-react";

const SERVICE_ICON = {
  Drivers:           <Car        className="w-3 h-3" />,
  "Domestic Helpers":<Home       className="w-3 h-3" />,
  Gardeners:         <Leaf       className="w-3 h-3" />,
  Babysitters:       <Baby       className="w-3 h-3" />,
  Cooks:             <ChefHat   className="w-3 h-3" />,
  Electricians:      <Zap        className="w-3 h-3" />,
  Plumbers:          <Wrench     className="w-3 h-3" />,
  "Security Guards": <Shield     className="w-3 h-3" />,
};

function initials(n = "") {
  return n.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

/**
 * WorkerReviewModal — admin approve/reject dialog.
 * Props: open, worker, onClose, onApprove(workerId), onReject(workerId, reason)
 */
export default function WorkerReviewModal({ open, worker, onClose, onApprove, onReject }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason]       = useState("");
  const MIN = 20;

  const handleClose = () => {
    setRejecting(false);
    setReason("");
    onClose();
  };

  const handleReject = () => {
    if (reason.length < MIN) return;
    onReject(worker._id, reason);
    handleClose();
  };

  if (!open || !worker) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-xl font-extrabold text-gray-900 mb-5">Review Worker Profile</h2>

        {/* Worker summary */}
        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center flex-shrink-0">
            {initials(worker.userId?.fullName)}
          </div>
          <div>
            <div className="font-bold text-gray-900">{worker.userId?.fullName}</div>
            <div className="text-sm text-gray-500">{worker.phone} · {worker.preferredCity}</div>
            <div className="text-xs text-gray-400 mt-0.5">Submitted: {worker.submittedAt}</div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-5">
          <div className="text-xs text-gray-500 font-medium mb-2">Services Applied For:</div>
          <div className="flex flex-wrap gap-2">
            {(worker.services || []).map((s) => (
              <span key={s} className="bg-teal-light text-teal-dark text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                {SERVICE_ICON[s] || <Wrench className="w-3 h-3" />} {s}
              </span>
            ))}
          </div>
        </div>

        {/* Rejection textarea */}
        {rejecting && (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Rejection Reason <span className="text-red-500">*</span>{" "}
              <span className="font-normal text-gray-400">(min {MIN} chars)</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this profile cannot be approved..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
            />
            <div className={`text-xs mt-1 ${reason.length < MIN ? "text-red-400" : "text-gray-400"}`}>
              {reason.length} / {MIN} minimum
            </div>
          </div>
        )}

        {/* Actions */}
        {!rejecting ? (
          <div className="flex gap-3">
  <button
    onClick={() => { onApprove(worker._id); handleClose(); }}
    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
  >
    <Check className="w-4 h-4" /> Approve
  </button>
  <button onClick={() => setRejecting(true)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
    <X className="w-4 h-4" /> Reject
  </button>
  <button onClick={handleClose} className="border border-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
    Close
  </button>
</div>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => setRejecting(false)} className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleReject}
              disabled={reason.length < MIN}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Rejection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}