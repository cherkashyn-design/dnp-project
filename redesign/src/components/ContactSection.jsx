import { useState } from "react";

import checkIcon from "../assets/icons/check.svg";
import copyIcon from "../assets/icons/copy.svg";
import telegram from "../assets/icons/telegram.svg";
import whatsapp from "../assets/icons/whatsapp.svg";
import { appHref } from "../base.js";
import { budgets, email, phone, telegramUrl, whatsappUrl } from "../data/content.js";

function goApp(event, href) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  window.history.pushState({}, "", appHref(href));
  window.dispatchEvent(new PopStateEvent("popstate"));
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
  const [budget, setBudget] = useState(budgets[0]);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
    } catch {
      setCopied("");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (submitting || sent) return;

    const form = event.currentTarget;
    const data = new FormData(form);
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

    if (!form.reportValidity()) return;

    setSubmitting(true);
    try {
      await submitContact(payload);
      setSent(true);
      form.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={page ? "contact is-page" : "section contact"} id="contact" data-ink>
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
            <button className="copy-icon" type="button" aria-label="Copy phone number" onClick={() => copy(phone)}>
              <img src={copied === phone ? checkIcon : copyIcon} alt="" />
            </button>
          </div>
        </div>
      </div>
      <hr />
      <form onSubmit={onSubmit} noValidate={false}>
        <div className="hp-field" aria-hidden="true">
          <span>Website</span>
          <input className="field" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="field-row">
          <div className="field-label">Your Name</div>
          <div className="field-control">
            <input
              className="field"
              name="name"
              required
              placeholder="Alex"
              aria-label="Your Name"
              disabled={sent || submitting}
            />
            <span className="field-error">Please enter your name</span>
          </div>
        </div>
        <div className="field-row">
          <div className="field-label">Email</div>
          <div className="field-control">
            <input
              className="field"
              type="email"
              name="email"
              required
              placeholder="example@mail.com"
              aria-label="Email"
              disabled={sent || submitting}
            />
            <span className="field-error">Enter a valid email</span>
          </div>
        </div>
        <div className="field-row">
          <div className="field-label">Project Name</div>
          <div className="field-control">
            <input
              className="field"
              name="project"
              required
              placeholder="DNP Studio"
              aria-label="Project Name"
              disabled={sent || submitting}
            />
            <span className="field-error">Please enter a project name</span>
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
          <button className="button-l is-reverse" type="submit" disabled={sent || submitting}>
            <span>{sent ? "Sent" : submitting ? "Sending…" : "Send Details"}</span>
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
    </section>
  );
}
