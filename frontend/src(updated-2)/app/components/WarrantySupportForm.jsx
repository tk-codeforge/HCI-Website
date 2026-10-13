"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import api from "@/utils/api";
import { buildLeadMetadata, getLeadDeviceType } from "@/utils/leadForms";

export default function WarrantySupportForm({
  heading,
  description,
  submitLabel = "SUBMIT REQUEST",
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    place: "",
    query: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const setField = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!formData.terms) {
      setError("Please accept the Terms of Use and Privacy Policy.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit contact number.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        place: formData.place.trim(),
        query: `Warranty Support Request: ${formData.query.trim()}`,
        ...buildLeadMetadata({
          pathname,
          leadFormType: "warranty",
          leadFormName: "Warranty Support Form",
          ctaText: submitLabel,
          deviceType: getLeadDeviceType(),
        }),
      };

      const response = await api.post("/user-queries", payload);

      if (response.status !== 201 && response.status !== 200) {
        throw new Error("Submission failed.");
      }

      setMessage(
        "Thanks. Your warranty support request has been received."
      );

      setFormData({
        name: "",
        mobile: "",
        email: "",
        place: "",
        query: "",
        terms: false,
      });

      window.setTimeout(() => {
        router.push("/thank-you");
      }, 1200);
    } catch (submitError) {
      console.error("Warranty support form submission error:", submitError);
      setError(
        submitError?.response?.data?.message ||
          "We could not submit your request right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (message) {
    return (
      <div className="warranty-support-success text-center">
        <FaCheckCircle size={52} color="#22c55e" className="mb-3" />
        <h3>{message}</h3>
        <p>Please wait while we take you to the confirmation page.</p>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .warranty-support-form {
          display: grid;
          gap: 16px;
        }

        .warranty-field {
          width: 100%;
          border: 1px solid #e6e6e6;
          border-radius: 8px;
          padding: 13px 14px;
          color: #222;
          background: #fff;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .warranty-field:focus {
          border-color: #ff914d;
          box-shadow: 0 0 0 3px rgba(255, 145, 77, 0.12);
        }

        .warranty-submit {
          border: 0;
          border-radius: 6px;
          padding: 14px 22px;
          background: #ff914d;
          color: #fff;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .warranty-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(255, 145, 77, 0.24);
        }

        .warranty-submit:disabled {
          cursor: not-allowed;
          opacity: 0.6;
          transform: none;
          box-shadow: none;
        }

        .warranty-check-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 12px;
          line-height: 1.5;
          color: #6b7280;
        }

        .warranty-check-row a {
          color: #ff914d;
          text-decoration: none;
          font-weight: 600;
        }

        .warranty-alert {
          border-radius: 7px;
          padding: 10px 12px;
          font-size: 13px;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="warranty-support-form">
        {error && (
          <div className="warranty-alert alert alert-danger mb-0">
            {error}
          </div>
        )}

        <div className="row g-3">
          <div className="col-md-6">
            <input
              className="warranty-field"
              name="name"
              placeholder="Full Name"
              autoComplete="name"
              value={formData.name}
              onChange={(event) =>
                setField("name", event.target.value)
              }
              required
            />
          </div>

          <div className="col-md-6">
            <input
              className="warranty-field"
              name="mobile"
              placeholder="Contact No. (10 digits)"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              autoComplete="tel"
              value={formData.mobile}
              onChange={(event) =>
                setField(
                  "mobile",
                  event.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              required
            />
          </div>

          <div className="col-md-6">
            <input
              className="warranty-field"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={formData.email}
              onChange={(event) =>
                setField("email", event.target.value)
              }
            />
          </div>

          <div className="col-md-6">
            <input
              className="warranty-field"
              name="place"
              placeholder="Place / Location"
              autoComplete="address-level2"
              value={formData.place}
              onChange={(event) =>
                setField("place", event.target.value)
              }
              required
            />
          </div>

          <div className="col-12">
            <textarea
              className="warranty-field"
              name="query"
              rows={5}
              placeholder="Tell us about the warranty concern"
              value={formData.query}
              onChange={(event) =>
                setField("query", event.target.value)
              }
              required
            />
          </div>

          <div className="col-12">
            <label className="warranty-check-row">
              <input
                type="checkbox"
                checked={formData.terms}
                onChange={(event) =>
                  setField("terms", event.target.checked)
                }
                style={{ marginTop: 3, accentColor: "#ff914d" }}
              />

              <span>
                I agree to the{" "}
                <a href="/term-and-condition">
                  Terms of Use
                </a>{" "}
                and{" "}
                <a href="/privacy-policy">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="warranty-submit"
              disabled={loading}
            >
              {loading ? "SUBMITTING..." : submitLabel}
              {!loading && (
                <FaArrowRight
                  size={12}
                  style={{ marginLeft: 8 }}
                />
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-3 text-muted small">{heading}</div>
      <div className="visually-hidden">{description}</div>
    </>
  );
}
