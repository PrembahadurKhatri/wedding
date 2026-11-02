"use client";

import { FormEvent, useRef, useState } from "react";

type RsvpStatus = "idle" | "submitting" | "unavailable" | "success";
type RsvpField = "name" | "phone" | "email" | "guests" | "attendance";
type RsvpErrors = Partial<Record<RsvpField, string>>;
type RsvpResponse = { saved?: boolean; message?: string };

function validateForm(form: HTMLFormElement): RsvpErrors {
  const data = new FormData(form);
  const errors: RsvpErrors = {};
  const name = String(data.get("name") ?? "").trim();
  const phone = String(data.get("phone") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const guestCount = Number(data.get("guests"));
  const attendance = data.get("attendance");
  const digits = phone.replace(/\D/g, "");

  if (name.length < 2) {
    errors.name = "Please enter your name (at least 2 characters).";
  } else if (name.length > 120) {
    errors.name = "Please keep your name under 120 characters.";
  }

  if (!/^\+?[\d\s().-]{7,24}$/.test(phone) || digits.length < 7) {
    errors.phone = "Enter a valid phone number with at least 7 digits.";
  }

  const emailField = form.elements.namedItem("email");
  if (
    email &&
    emailField instanceof HTMLInputElement &&
    !emailField.validity.valid
  ) {
    errors.email = "Enter a valid email address, or leave this field empty.";
  }

  if (!Number.isInteger(guestCount) || guestCount < 1) {
    errors.guests = "Please enter at least 1 guest.";
  }

  if (attendance !== "accepts" && attendance !== "declines") {
    errors.attendance = "Please confirm whether you can attend.";
  }

  return errors;
}

export default function RsvpForm() {
  const [status, setStatus] = useState<RsvpStatus>("idle");
  const [errors, setErrors] = useState<RsvpErrors>({});
  const submissionInFlight = useRef(false);

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionInFlight.current) return;

    const form = event.currentTarget;
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    setStatus("idle");

    if (Object.keys(validationErrors).length > 0) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    submissionInFlight.current = true;
    setStatus("submitting");

    try {
      // The form data is deliberately not sent until private RSVP storage exists.
      const response = await fetch("/api/rsvp", { method: "POST" });
      const result = (await response.json()) as RsvpResponse;

      if (response.ok && result.saved === true) {
        setStatus("success");
        form.reset();
        return;
      }

      setStatus("unavailable");
    } catch {
      setStatus("unavailable");
    } finally {
      submissionInFlight.current = false;
    }
  }

  function clearError(field: RsvpField) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <div className="rsvp__confirmation rsvp__confirmation--success" role="status">
        <span aria-hidden="true">♡</span>
        <p>Thank you. Your reply has been securely received.</p>
      </div>
    );
  }

  return (
    <>
      {status === "unavailable" && (
        <div className="rsvp__notice rsvp__notice--error" role="alert">
          <strong>Your RSVP wasn’t sent or saved.</strong>
          <p>
            This website does not yet have private RSVP storage connected.
            Please contact the couple directly to reply.
          </p>
        </div>
      )}
      <form className="rsvp-form" noValidate onSubmit={submitRsvp}>
        <label className="rsvp-form__field">
          GUEST NAME <span aria-hidden="true">*</span>
          <input
            aria-describedby={errors.name ? "rsvp-name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            maxLength={120}
            minLength={2}
            name="name"
            onChange={() => clearError("name")}
            placeholder="Your full name"
            required
            type="text"
          />
          {errors.name && <span className="rsvp-form__error" id="rsvp-name-error">{errors.name}</span>}
        </label>

        <div className="rsvp-form__row">
          <label className="rsvp-form__field">
            PHONE NUMBER <span aria-hidden="true">*</span>
            <input
              aria-describedby={errors.phone ? "rsvp-phone-error" : "rsvp-phone-hint"}
              aria-invalid={Boolean(errors.phone)}
              autoComplete="tel"
              maxLength={24}
              name="phone"
              onChange={() => clearError("phone")}
              pattern="[+0-9() .-]{7,24}"
              placeholder="+977 98XXXXXXXX"
              required
              title="Enter at least 7 digits; spaces, +, parentheses, periods, and hyphens are allowed."
              type="tel"
            />
            {errors.phone ? (
              <span className="rsvp-form__error" id="rsvp-phone-error">{errors.phone}</span>
            ) : (
              <span className="rsvp-form__hint" id="rsvp-phone-hint">At least 7 digits</span>
            )}
          </label>

          <label className="rsvp-form__field">
            EMAIL ADDRESS <span className="rsvp-form__optional">(OPTIONAL)</span>
            <input
              aria-describedby={errors.email ? "rsvp-email-error" : undefined}
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              maxLength={254}
              name="email"
              onChange={() => clearError("email")}
              placeholder="you@example.com"
              type="email"
            />
            {errors.email && <span className="rsvp-form__error" id="rsvp-email-error">{errors.email}</span>}
          </label>
        </div>

        <label className="rsvp-form__field rsvp-form__guests">
          NUMBER OF GUESTS <span aria-hidden="true">*</span>
          <input
            aria-describedby={errors.guests ? "rsvp-guests-error" : undefined}
            aria-invalid={Boolean(errors.guests)}
            inputMode="numeric"
            min={1}
            name="guests"
            onChange={() => clearError("guests")}
            required
            step={1}
            type="number"
            defaultValue={1}
          />
          {errors.guests && <span className="rsvp-form__error" id="rsvp-guests-error">{errors.guests}</span>}
        </label>

        <fieldset
          aria-describedby={errors.attendance ? "rsvp-attendance-error" : undefined}
          aria-invalid={Boolean(errors.attendance)}
          className="rsvp-form__attendance"
        >
          <legend>ATTENDANCE CONFIRMATION <span aria-hidden="true">*</span></legend>
          <label className="rsvp-form__choice">
            <input
              name="attendance"
              onChange={() => clearError("attendance")}
              required
              type="radio"
              value="accepts"
            />
            <span>JOYFULLY ACCEPTS</span>
          </label>
          <label className="rsvp-form__choice">
            <input
              name="attendance"
              onChange={() => clearError("attendance")}
              type="radio"
              value="declines"
            />
            <span>REGRETFULLY DECLINES</span>
          </label>
          {errors.attendance && (
            <span className="rsvp-form__error" id="rsvp-attendance-error">{errors.attendance}</span>
          )}
        </fieldset>

        <label className="rsvp-form__field">
          DIETARY REQUIREMENTS <span className="rsvp-form__optional">(OPTIONAL)</span>
          <input
            maxLength={300}
            name="dietary"
            onChange={() => setStatus("idle")}
            placeholder="Please share any dietary needs"
            type="text"
          />
        </label>

        <label className="rsvp-form__field">
          PERSONAL MESSAGE <span className="rsvp-form__optional">(OPTIONAL)</span>
          <textarea
            maxLength={1000}
            name="message"
            onChange={() => setStatus("idle")}
            placeholder="A note for the couple"
            rows={3}
          />
        </label>

        <button
          className="rsvp-form__submit"
          disabled={status === "submitting"}
          type="submit"
        >
          <span>
            {status === "submitting" ? "CHECKING RSVP SERVICE…" : "SEND YOUR REPLY"}
          </span>
          <span aria-hidden="true">{status === "submitting" ? "…" : "↗"}</span>
        </button>
        <p className="rsvp-form__privacy">
          Your contact details stay in this form and are not sent or stored until
          private RSVP storage is connected.
        </p>
      </form>
    </>
  );
}
