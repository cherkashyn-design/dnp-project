import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import backIcon from "../assets/icons/back-icon.svg";
import dnpLogo from "../assets/brand/dnp-logo.png";
import productDesignIcon from "../assets/icons/contact-tags/product-design.svg";
import landingPageIcon from "../assets/icons/contact-tags/landing-page.svg";
import pitchDeckIcon from "../assets/icons/contact-tags/pitch-deck.svg";
import brandIdentityIcon from "../assets/icons/contact-tags/brand-identity.svg";
import plusIcon from "../assets/icons/contact-tags/plus.svg";
import closeIcon from "../assets/icons/contact-tags/close.svg";
import checkIcon from "../assets/icons/contact-tags/check.svg";
import successCheck from "../assets/contact/success-check.png";
import backCasesIcon from "../assets/contact/back-cases-icon.svg";
import { ContactMediaCarousel } from "../components/contact/ContactMediaCarousel.jsx";
import { SiteFooter } from "../components/home/HomeChrome.jsx";
import { useHeaderScrolled } from "../hooks/useHeaderScrolled.js";

const HELP_OPTIONS = [
  { id: "product-design", label: "Product Design", icon: productDesignIcon },
  { id: "landing-page", label: "Landing Page", icon: landingPageIcon },
  { id: "pitch-deck", label: "Pitch Deck", icon: pitchDeckIcon },
  { id: "brand-identity", label: "Brand Identity", icon: brandIdentityIcon },
];

const BUDGET_OPTIONS = ["$5k+", "$10k+", "$25k+", "Not sure"];

const INITIAL_FORM = {
  name: "",
  email: "",
  company: "",
  building: "",
  helpTags: [],
  customTags: [],
  budget: "Not sure",
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [composingCustom, setComposingCustom] = useState(false);
  const [customDraft, setCustomDraft] = useState("");
  const [budgetIndicator, setBudgetIndicator] = useState({ left: 0, width: 0 });
  const customInputRef = useRef(null);
  const budgetRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const companyRef = useRef(null);
  const hasScrolled = useHeaderScrolled();

  const fieldErrors = useMemo(
    () => ({
      name: !form.name.trim(),
      email: !form.email.trim() || !isValidEmail(form.email.trim()),
      company: !form.company.trim(),
    }),
    [form.name, form.email, form.company],
  );

  const hasFieldErrors = fieldErrors.name || fieldErrors.email || fieldErrors.company;

  useEffect(() => {
    if (composingCustom) {
      customInputRef.current?.focus();
    }
  }, [composingCustom]);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const group = budgetRef.current;
      if (!group) {
        return;
      }
      const selected = group.querySelector(".contact-budget-option.is-selected");
      if (!selected) {
        return;
      }
      setBudgetIndicator({
        left: selected.offsetLeft,
        width: selected.offsetWidth,
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [form.budget]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const toggleHelpTag = (label) => {
    setForm((current) => {
      const selected = current.helpTags.includes(label)
        ? current.helpTags.filter((item) => item !== label)
        : [...current.helpTags, label];
      return { ...current, helpTags: selected };
    });
  };

  const removeCustomTag = (label) => {
    setForm((current) => ({
      ...current,
      customTags: current.customTags.filter((item) => item !== label),
    }));
  };

  const commitCustomTag = () => {
    const tag = customDraft.trim();
    if (!tag) {
      return;
    }

    setForm((current) => {
      if (current.helpTags.includes(tag) || current.customTags.includes(tag)) {
        return current;
      }
      return {
        ...current,
        customTags: [...current.customTags, tag],
      };
    });
    setCustomDraft("");
    setComposingCustom(true);
    requestAnimationFrame(() => {
      customInputRef.current?.focus();
    });
  };

  const cancelCustomCompose = () => {
    setCustomDraft("");
    setComposingCustom(false);
  };

  const handleCustomKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitCustomTag();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancelCustomCompose();
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.assign("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    setShowErrors(true);
    setSubmitError("");

    if (hasFieldErrors) {
      if (fieldErrors.name) {
        nameRef.current?.focus();
      } else if (fieldErrors.email) {
        emailRef.current?.focus();
      } else if (fieldErrors.company) {
        companyRef.current?.focus();
      }
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      building: form.building.trim(),
      helpTags: [...form.helpTags, ...form.customTags],
      budget: form.budget,
    };

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-layout">
        <aside className="contact-media" aria-hidden="true">
          <div className="contact-media-frame">
            <ContactMediaCarousel />
          </div>
        </aside>

        <section className="contact-panel">
          <header className={["contact-header", hasScrolled ? "is-scrolled" : ""].filter(Boolean).join(" ")}>
            <div className="contact-header-fade" aria-hidden="true" />
            <button type="button" className="contact-back vt-back" aria-label="Go back" onClick={handleBack}>
              <img src={backIcon} alt="" aria-hidden="true" />
            </button>
            <a className="logo vt-logo" href="/" aria-label="DoNotPress home">
              <img src={dnpLogo} alt="DoNotPress" />
            </a>
          </header>

          <div className="contact-content">
            {submitted ? (
              <div className="contact-success" role="status">
                <img className="contact-success-icon" src={successCheck} alt="" aria-hidden="true" />
                <div className="contact-success-copy">
                  <h1>Thanks</h1>
                  <p>We received your request. We&apos;ll get back to you within 24 hours.</p>
                </div>
                <a className="contact-success-cta" href="/">
                  <img src={backCasesIcon} alt="" aria-hidden="true" />
                  <span>Back to cases</span>
                </a>
              </div>
            ) : (
              <>
                <div className="contact-heading">
                  <h1>Contact Us</h1>
                  <p>A few quick details is all we need. We&apos;ll get back to you within 24 hours.</p>
                </div>

                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <fieldset className="contact-section">
                  <legend>Your Info</legend>
                  <label
                    className={["contact-field", showErrors && fieldErrors.name ? "is-invalid" : ""]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className="visually-hidden">Your name</span>
                    <input
                      ref={nameRef}
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={updateField("name")}
                      aria-invalid={showErrors && fieldErrors.name ? "true" : "false"}
                      required
                    />
                  </label>
                  <label
                    className={["contact-field", showErrors && fieldErrors.email ? "is-invalid" : ""]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className="visually-hidden">Email</span>
                    <input
                      ref={emailRef}
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={updateField("email")}
                      aria-invalid={showErrors && fieldErrors.email ? "true" : "false"}
                      required
                    />
                  </label>
                </fieldset>

                <fieldset className="contact-section">
                  <legend>Company Info</legend>
                  <label
                    className={["contact-field", showErrors && fieldErrors.company ? "is-invalid" : ""]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className="visually-hidden">Company or project name</span>
                    <input
                      ref={companyRef}
                      type="text"
                      name="company"
                      autoComplete="organization"
                      placeholder="Company/Project name"
                      value={form.company}
                      onChange={updateField("company")}
                      aria-invalid={showErrors && fieldErrors.company ? "true" : "false"}
                      required
                    />
                  </label>
                  <label className="contact-field contact-field-textarea">
                    <span className="visually-hidden">What are you building?</span>
                    <textarea
                      name="building"
                      placeholder="What are you building?"
                      rows={4}
                      value={form.building}
                      onChange={updateField("building")}
                    />
                  </label>
                </fieldset>

                <fieldset className="contact-section">
                  <legend>
                    What do you need help with?{" "}
                    <span className="contact-optional">(Optional)</span>
                  </legend>
                  <div className="contact-tag-options" role="group" aria-label="Help topics">
                    {HELP_OPTIONS.map((option) => {
                      const selected = form.helpTags.includes(option.label);
                      return (
                        <button
                          key={option.id}
                          type="button"
                          className={["contact-tag", selected ? "is-selected" : ""]
                            .filter(Boolean)
                            .join(" ")}
                          aria-pressed={selected}
                          onClick={() => toggleHelpTag(option.label)}
                        >
                          <span className="contact-tag-leading" aria-hidden="true">
                            <img src={option.icon} alt="" />
                          </span>
                          <span className="contact-tag-label">{option.label}</span>
                          <span className="contact-tag-trailing" aria-hidden="true">
                            <img src={closeIcon} alt="" />
                          </span>
                        </button>
                      );
                    })}

                    {form.customTags.map((tag) => (
                      <button
                        key={`custom-${tag}`}
                        type="button"
                        className="contact-tag is-selected is-custom"
                        onClick={() => removeCustomTag(tag)}
                      >
                        <span className="contact-tag-label">{tag}</span>
                        <span className="contact-tag-trailing is-visible" aria-hidden="true">
                          <img src={closeIcon} alt="" />
                        </span>
                      </button>
                    ))}

                    {composingCustom ? (
                      <div className="contact-tag is-composing contact-custom-composer">
                        <button
                          type="button"
                          className="contact-tag-icon-btn"
                          aria-label="Confirm custom request"
                          onClick={commitCustomTag}
                        >
                          <img src={checkIcon} alt="" aria-hidden="true" />
                        </button>
                        <input
                          ref={customInputRef}
                          type="text"
                          className="contact-tag-input"
                          value={customDraft}
                          placeholder="Custom request"
                          aria-label="Custom request"
                          onChange={(event) => setCustomDraft(event.target.value)}
                          onKeyDown={handleCustomKeyDown}
                        />
                        <button
                          type="button"
                          className="contact-tag-icon-btn"
                          aria-label="Close custom request"
                          onClick={cancelCustomCompose}
                        >
                          <img src={closeIcon} alt="" aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="contact-tag is-add-custom contact-custom-composer"
                        onClick={() => setComposingCustom(true)}
                      >
                        <img src={plusIcon} alt="" aria-hidden="true" />
                        <span>Add custom request</span>
                      </button>
                    )}
                  </div>
                </fieldset>

                <fieldset className="contact-section">
                  <legend>Do you have budget in Mind?</legend>
                  <div className="contact-budget" role="radiogroup" aria-label="Budget" ref={budgetRef}>
                    <span
                      className="contact-budget-indicator"
                      aria-hidden="true"
                      style={{
                        transform: `translateX(${budgetIndicator.left}px)`,
                        width: `${budgetIndicator.width}px`,
                      }}
                    />
                    {BUDGET_OPTIONS.map((option) => {
                      const selected = form.budget === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          className={["contact-budget-option", selected ? "is-selected" : ""]
                            .filter(Boolean)
                            .join(" ")}
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setForm((current) => ({ ...current, budget: option }))}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="contact-actions">
                  <button className="contact-submit" type="submit" disabled={submitting}>
                    {submitting ? "Sending…" : "Send Details"}
                  </button>
                  {submitError ? (
                    <p className="contact-submit-error" role="alert">
                      {submitError}
                    </p>
                  ) : null}
                  <p className="contact-terms">
                    By clicking “Send Details” you accept our{" "}
                    <a href="/terms">Terms of Use</a> &amp;{" "}
                    <a href="/privacy">Privacy Policy</a>
                  </p>
                </div>
              </form>
              </>
            )}
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
