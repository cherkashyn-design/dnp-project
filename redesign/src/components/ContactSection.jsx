import { useEffect, useMemo, useRef, useState } from "react";

import successCheck from "../assets/contact/success-check.png";
import checkIcon from "../assets/icons/check.svg";
import copyIcon from "../assets/icons/copy.svg";
import telegram from "../assets/icons/telegram.svg";
import whatsapp from "../assets/icons/whatsapp.svg";
import { appHref } from "../base.js";
import { budgets, email, phone, telegramUrl, whatsappUrl } from "../data/content.js";
import { CopiedToast } from "./CopiedToast.jsx";

const COPY_TOAST_MS = 2200;

function goApp(event, href) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  window.history.pushState({}, "", appHref(href));
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateFields({ name, emailValue, project }) {
  const errors = {};

  if (!name) {
    errors.name = "Please enter your name";
  }

  if (!emailValue) {
    errors.email = "Please enter your email";
  } else if (!isValidEmail(emailValue)) {
    errors.email = "Enter a valid email address";
  }

  if (!project) {
    errors.project = "Please enter a project name";
  }

  return errors;
}

async function submitContact(payload) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.error || "Something went wrong. Please try again.");
  }
  return result;
}

export function ContactSection({ page = false }) {
  const [copied, setCopied] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [budget, setBudget] = useState(budgets[0]);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", project: "", message: "" });

  const sectionRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const projectRef = useRef(null);
  const toastTimer = useRef(0);

  const animateSentCollapse = () => {
    const section = sectionRef.current;
    if (!(section instanceof HTMLElement)) {
      setSent(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSent(true);
      return;
    }

    const from = section.getBoundingClientRect().height;
    section.style.height = `${from}px`;
    section.style.overflow = "hidden";
    setSent(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const to = section.scrollHeight;
        section.style.transition =
          "height 0.65s cubic-bezier(0.22, 1, 0.36, 1), padding 0.65s cubic-bezier(0.22, 1, 0.36, 1)";
        section.style.height = `${to}px`;

        const finish = (event) => {
          if (event.target !== section || (event.propertyName && event.propertyName !== "height")) return;
          section.style.height = "";
          section.style.overflow = "";
          section.style.transition = "";
          section.removeEventListener("transitionend", finish);
        };
        section.addEventListener("transitionend", finish);
      });
    });
  };

  const fieldErrors = useMemo(
    () =>
      validateFields({
        name: values.name.trim(),
        emailValue: values.email.trim(),
        project: values.project.trim(),
      }),
    [values.name, values.email, values.project],
  );

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setToastOpen(true);
      setToastKey((key) => key + 1);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => {
        setToastOpen(false);
        setCopied("");
        toastTimer.current = 0;
      }, COPY_TOAST_MS);
    } catch {
      setCopied("");
      setToastOpen(false);
    }
  };

  const updateValue = (field) => (event) => {
    const next = event.target.value;
    setValues((current) => ({ ...current, [field]: next }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (submitting || sent) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setShowErrors(true);
    setSubmitError("");

    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      company: String(data.get("project") || "").trim(),
      building: String(data.get("message") || "").trim(),
      budget,
      helpTags: [],
      website: String(data.get("website") || "").trim(),
    };

    const errors = validateFields({
      name: payload.name,
      emailValue: payload.email,
      project: payload.company,
    });

    if (errors.name) {
      nameRef.current?.focus();
      return;
    }
    if (errors.email) {
      emailRef.current?.focus();
      return;
    }
    if (errors.project) {
      projectRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await submitContact(payload);
      setShowErrors(false);
      setValues({ name: "", email: "", project: "", message: "" });
      form.reset();
      animateSentCollapse();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const nameInvalid = showErrors && Boolean(fieldErrors.name);
  const emailInvalid = showErrors && Boolean(fieldErrors.email);
  const projectInvalid = showErrors && Boolean(fieldErrors.project);

  return (
    <section
      ref={sectionRef}
      className={page ? `contact is-page${sent ? " is-sent" : ""}` : `section contact${sent ? " is-sent" : ""}`}
      id="contact"
      data-ink
    >
      <CopiedToast open={toastOpen} restartKey={toastKey} />
      <div className="contact-intro">
        {page ? (
          <h1 className="section-title" data-reveal>
            Let’s grow something great
          </h1>
        ) : (
          <h2 className="section-title" data-reveal>
            Let’s grow something great
          </h2>
        )}
        <p className="contact-lead">
          Do Not Press is a design agency ready when you are. Tell us about the product, the plans, and
          the deadline. 30-min call · no deck required · reply in 1 business day.
        </p>
      </div>
      <hr />
      <div className="contact-block">
        <div className="copy-row">
          <div className="field-label">Our Email</div>
          <button
            className={copied === email ? "copy-box is-copied" : "copy-box"}
            type="button"
            onClick={() => copy(email)}
          >
            <span>{email}</span>
            <span className="copy-icon" aria-hidden="true">
              <img src={copied === email ? checkIcon : copyIcon} alt="" />
            </span>
          </button>
        </div>
        <div className="copy-row">
          <div className="field-label">Whatsapp / Telegram</div>
          <div className={copied === phone ? "copy-box is-copied" : "copy-box"}>
            <div className="copy-box-content">
              <button className="copy-box-main" type="button" onClick={() => copy(phone)}>
                <span>{phone}</span>
              </button>
              <span className="contact-icons">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                  <img src={whatsapp} alt="" />
                </a>
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on Telegram">
                  <img src={telegram} alt="" />
                </a>
              </span>
            </div>
            <button className="copy-icon" type="button" aria-label="Copy phone number" onClick={() => copy(phone)}>
              <img src={copied === phone ? checkIcon : copyIcon} alt="" />
            </button>
          </div>
        </div>
      </div>
      <hr />
      {sent ? (
        <div className="contact-success" role="status" aria-live="polite">
          <img className="contact-success-icon" src={successCheck} alt="" aria-hidden="true" />
          <div className="contact-success-copy">
            <p className="contact-success-title">Thanks</p>
            <p className="contact-success-text">
              We received your request. We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>
      ) : (
      <form onSubmit={onSubmit} noValidate>
        <div className="hp-field" aria-hidden="true">
          <span>Website</span>
          <input className="field" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="field-row">
          <div className="field-label">Your Name</div>
          <div className={nameInvalid ? "field-control is-invalid" : "field-control"}>
            <input
              ref={nameRef}
              className="field"
              name="name"
              value={values.name}
              onChange={updateValue("name")}
              placeholder="Alex"
              aria-label="Your Name"
              aria-invalid={nameInvalid}
              aria-describedby={nameInvalid ? "contact-name-error" : undefined}
              disabled={sent || submitting}
            />
            {nameInvalid ? (
              <span className="field-error" id="contact-name-error" role="alert">
                {fieldErrors.name}
              </span>
            ) : null}
          </div>
        </div>
        <div className="field-row">
          <div className="field-label">Email</div>
          <div className={emailInvalid ? "field-control is-invalid" : "field-control"}>
            <input
              ref={emailRef}
              className="field"
              type="email"
              name="email"
              value={values.email}
              onChange={updateValue("email")}
              placeholder="example@mail.com"
              aria-label="Email"
              aria-invalid={emailInvalid}
              aria-describedby={emailInvalid ? "contact-email-error" : undefined}
              disabled={sent || submitting}
            />
            {emailInvalid ? (
              <span className="field-error" id="contact-email-error" role="alert">
                {fieldErrors.email}
              </span>
            ) : null}
          </div>
        </div>
        <div className="field-row">
          <div className="field-label">Project Name</div>
          <div className={projectInvalid ? "field-control is-invalid" : "field-control"}>
            <input
              ref={projectRef}
              className="field"
              name="project"
              value={values.project}
              onChange={updateValue("project")}
              placeholder="DNP Studio"
              aria-label="Project Name"
              aria-invalid={projectInvalid}
              aria-describedby={projectInvalid ? "contact-project-error" : undefined}
              disabled={sent || submitting}
            />
            {projectInvalid ? (
              <span className="field-error" id="contact-project-error" role="alert">
                {fieldErrors.project}
              </span>
            ) : null}
          </div>
        </div>
        <div className="field-row">
          <div className="field-label">Your Budget</div>
          <div className="segments" role="radiogroup" aria-label="Your Budget">
            {budgets.map((option) => (
              <button
                key={option}
                type="button"
                className={budget === option ? "is-active" : ""}
                onClick={() => setBudget(option)}
                disabled={sent || submitting}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="field-row">
          <div className="field-label">
            Message
            <span className="field-optional">Optional</span>
          </div>
          <div className="field-control">
            <textarea
              className="field"
              name="message"
              value={values.message}
              onChange={updateValue("message")}
              placeholder="What are you building?"
              aria-label="Message"
              disabled={sent || submitting}
            />
          </div>
        </div>
        {submitError ? (
          <div className="field-row">
            <div />
            <p className="form-submit-error" role="alert">
              {submitError}
            </p>
          </div>
        ) : null}
        <div className="field-row">
          <div />
          <button className="button-l is-reverse" type="submit" disabled={submitting}>
            <span>{submitting ? "Sending…" : "Send Details"}</span>
          </button>
        </div>
        <div className="field-row">
          <div />
          <p className="legal-note">
            By clicking “Send Details” you accept our{" "}
            <a href={appHref("/terms")} onClick={(event) => goApp(event, "/terms")}>
              Terms
            </a>{" "}
            &amp;{" "}
            <a href={appHref("/privacy")} onClick={(event) => goApp(event, "/privacy")}>
              Privacy Policy
            </a>
          </p>
        </div>
      </form>
      )}
    </section>
  );
}
