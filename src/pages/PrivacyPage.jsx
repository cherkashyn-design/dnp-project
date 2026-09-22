import { LegalPage } from "./LegalPage.jsx";
import { email } from "../data/site.js";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="21 September 2026">
      <p>
        This Privacy Policy explains how DoNotPress (“we”, “us”, “our”) collects, uses, stores, and
        protects personal data when you use our website at donotpress.studio and related contact
        forms. We process personal data in accordance with the Law of Georgia on Personal Data
        Protection (adopted 14 June 2023; core provisions in force from 1 March 2024) and other
        applicable legislation of Georgia.
      </p>

      <h2>1. Data controller</h2>
      <p>
        The data controller is DoNotPress. For privacy-related requests, contact us at{" "}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>2. What personal data we collect</h2>
      <p>Depending on how you interact with us, we may process:</p>
      <ul>
        <li>Identity and contact details (for example, name, email address, company or project name)</li>
        <li>Information you voluntarily provide about your project, budget preferences, and service needs</li>
        <li>
          Technical data automatically generated when you visit the site (for example, IP address,
          browser type, device information, pages viewed, and approximate location derived from IP)
        </li>
        <li>Communication content if you email us or submit a contact request</li>
      </ul>
      <p>
        We do not intentionally collect special categories of personal data (such as health, biometric,
        or political data). Please do not submit such information through our forms.
      </p>

      <h2>3. Purposes and legal bases</h2>
      <p>We process personal data only for specified, explicit, and legitimate purposes, including:</p>
      <ul>
        <li>
          Responding to contact requests and discussing potential design work — based on steps prior
          to entering into a contract, and/or your consent where required
        </li>
        <li>
          Operating, securing, and improving our website — based on our legitimate interests, balanced
          against your rights and freedoms
        </li>
        <li>Complying with legal obligations under Georgian law</li>
      </ul>
      <p>
        Where processing is based on consent, you may withdraw consent at any time without affecting
        the lawfulness of processing carried out before withdrawal.
      </p>

      <h2>4. Whether providing data is mandatory</h2>
      <p>
        Fields marked as required on our contact form are needed so we can identify you and reply.
        If you do not provide them, we may be unable to process your request. Optional fields help us
        understand your project but are not required to submit the form.
      </p>

      <h2>5. Recipients and processors</h2>
      <p>
        We may share personal data with trusted service providers acting on our instructions (for
        example, hosting, analytics, or email delivery providers), solely as needed to operate the
        website and communicate with you. We do not sell personal data.
      </p>
      <p>
        Where a processor is used, we take steps consistent with Georgian law so that processing is
        carried out under appropriate contractual and organisational safeguards.
      </p>

      <h2>6. International transfers</h2>
      <p>
        Some service providers may process data outside Georgia. Where personal data is transferred
        abroad, we take measures designed to ensure an adequate level of protection as required by
        the Law of Georgia on Personal Data Protection.
      </p>

      <h2>7. Retention</h2>
      <p>
        We keep personal data only for as long as necessary for the purposes described above. Contact
        enquiries are typically retained for up to 24 months after the last meaningful communication,
        unless a longer period is required for an active project, legal claims, or statutory
        obligations. When the purpose is achieved, data is erased, destroyed, or retained in a
        depersonalised form where appropriate.
      </p>

      <h2>8. Security</h2>
      <p>
        We apply organisational and technical measures appropriate to the risks of processing,
        including access controls and secure transmission where reasonably available, to protect
        personal data against unauthorised or unlawful processing, accidental loss, destruction, or
        damage.
      </p>

      <h2>9. Your rights</h2>
      <p>
        Under the Law of Georgia on Personal Data Protection, you may have the right, subject to
        legal conditions and exceptions, to:
      </p>
      <ul>
        <li>Receive information about the processing of your personal data</li>
        <li>Access your personal data</li>
        <li>Request correction of inaccurate or incomplete data</li>
        <li>Request erasure, blocking, or termination of processing</li>
        <li>Object to processing based on legitimate interests, where applicable</li>
        <li>Withdraw consent where processing is consent-based</li>
        <li>Lodge a complaint with the Personal Data Protection Service of Georgia</li>
      </ul>
      <p>
        To exercise these rights, email <a href={`mailto:${email}`}>{email}</a>. We will respond
        within the timeframes required by Georgian law.
      </p>

      <h2>10. Cookies and similar technologies</h2>
      <p>
        Our website may use essential cookies required for basic operation and, where used, analytics
        tools that help us understand site usage. You can control cookies through your browser
        settings. Disabling certain cookies may affect site functionality.
      </p>

      <h2>11. Children</h2>
      <p>
        Our services are directed to businesses and professionals. We do not knowingly collect
        personal data from children. If you believe a child has provided us personal data, contact us
        and we will take appropriate steps to delete it.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The “Last updated” date at the top of
        this page will change when we do. Continued use of the website after an update constitutes
        notice of the revised policy, except where consent is required by law for a specific change.
      </p>

      <h2>13. Supervisory authority</h2>
      <p>
        If you believe your data protection rights have been violated, you may lodge a complaint with
        the Personal Data Protection Service of Georgia (pdps.ge), without prejudice to any other
        administrative or judicial remedy available under Georgian law.
      </p>

      <p className="legal-note">
        This page is provided for transparency and does not constitute legal advice. If you need
        advice specific to your situation, consult a qualified lawyer admitted in Georgia.
      </p>
    </LegalPage>
  );
}
