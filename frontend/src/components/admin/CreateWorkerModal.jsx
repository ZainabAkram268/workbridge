import React, { useState } from "react";
import api from "../../services/api";

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];

const formatPhone = (v) => {
  const digits = v.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 4) return digits;
  return digits.slice(0, 4) + "-" + digits.slice(4);
};

const formatCnic = (v) => {
  const digits = v.replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return digits.slice(0, 5) + "-" + digits.slice(5);
  return digits.slice(0, 5) + "-" + digits.slice(5, 12) + "-" + digits.slice(12);
};

const validate = (form) => {
  const errors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (form.fullName.trim().length < 3) {
    errors.fullName = "Name must be at least 3 characters.";
  } else if (!/^[a-zA-Z\s]+$/.test(form.fullName.trim())) {
    errors.fullName = "Name can only contain letters and spaces.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^03[0-9]{2}-[0-9]{7}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid format: 03XX-XXXXXXX.";
  }

  if (!form.cnicNumber.trim()) {
    errors.cnicNumber = "CNIC number is required.";
  } else if (!/^35202-[0-9]{7}-[0-9]$/.test(form.cnicNumber.trim())) {
    errors.cnicNumber = "CNIC must start with 35202 and follow format: 35202-XXXXXXX-X.";
  }

  return errors;
};

export default function CreateWorkerModal({ open, onClose, onCreated }) {
  const [form, setForm]         = useState({ fullName: "", phone: "", cnicNumber: "", preferredCity: "Lahore" });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (k, v) => {
    if (k === "fullName") {
      v = v.replace(/[^a-zA-Z\s]/g, "").slice(0, 40);
      setErrors((e) => ({ ...e, fullName: undefined }));
    }

    if (k === "phone") {
      v = formatPhone(v);
      const digits = v.replace(/\D/g, "");
      if (digits.length >= 2 && !digits.startsWith("03")) {
        setErrors((e) => ({ ...e, phone: "Phone must start with 03." }));
      } else if (v.length === 12 && !/^03[0-9]{2}-[0-9]{7}$/.test(v)) {
        setErrors((e) => ({ ...e, phone: "Enter a valid format: 03XX-XXXXXXX." }));
      } else {
        setErrors((e) => ({ ...e, phone: undefined }));
      }
    }

    if (k === "cnicNumber") {
      v = formatCnic(v);
      const digits = v.replace(/\D/g, "");
      if (digits.length >= 5 && !digits.startsWith("35202")) {
        setErrors((e) => ({ ...e, cnicNumber: "Pakistani CNIC must start with 35202." }));
      } else if (v.length === 15 && !/^[0-9]{5}-[0-9]{7}-[0-9]$/.test(v)) {
        setErrors((e) => ({ ...e, cnicNumber: "Enter CNIC in format: 35202-XXXXXXX-X." }));
      } else {
        setErrors((e) => ({ ...e, cnicNumber: undefined }));
      }
    }

    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      await api.post("/admin/workers/create", form);

      const newWorker = {
        _id: "aw_" + Date.now(),
        userId: { fullName: form.fullName },
        phone: form.phone,
        preferredCity: form.preferredCity,
        services: [],
        status: "admin_created",
      };

      onCreated?.(newWorker);
      setForm({ fullName: "", phone: "", cnicNumber: "", preferredCity: "Lahore" });
      setErrors({});
    } catch (err) {
      setApiError(err.message || "Failed to create worker.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ fullName: "", phone: "", cnicNumber: "", preferredCity: "Lahore" });
    setErrors({});
    setApiError("");
    onClose();
  };

  if (!open) return null;

  const fields = [
    { key: "fullName",   label: "Full Name",       placeholder: "Ahmed Khan",       hint: "Letters only, min 3 chars" },
    { key: "phone",      label: "Phone (WhatsApp)", placeholder: "03XX-XXXXXXX",     hint: "e.g. 0309-1234567" },
    { key: "cnicNumber", label: "CNIC Number",      placeholder: "35202-XXXXXXX-X",  hint: "e.g. 35202-1234567-8" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-xl font-extrabold text-gray-900 mb-1">Create Worker Account</h2>
        <p className="text-sm text-gray-500 mb-5">OTP verification is skipped for admin-created accounts.</p>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {apiError}
          </div>
        )}

        <div className="space-y-4 mb-6">
          {fields.map(({ key, label, placeholder, hint }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors[key]
                    ? "border-red-400 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-teal-400"
                }`}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
              />
              {errors[key] ? (
                <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">{hint}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred City</label>
            <select
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={form.preferredCity}
              onChange={(e) => set("preferredCity", e.target.value)}
            >
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating…" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}