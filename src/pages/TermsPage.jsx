import { LegalPage } from "./LegalPage.jsx";
import { email } from "../data/site.js";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="21 September 2026">
      <p>
        These Terms of Use (“Terms”) govern access to and use of the DoNotPress website at
        donotpress.studio and related online contact forms. By using the site, you agree to these
        Terms. If you do not agree, please do not use the site.
      </p>
      <p>
        These Terms are intended to be interpreted under the laws of Georgia, including the Civil
        Code of Georgia and other applicable legislation. Nothing in these Terms limits mandatory
        consumer or other rights that cannot be waived under Georgian law.
      </p>

      <h2>1. Who we are</h2>
      <p>
        The website is operated by DoNotPress (“we”, “us”, “our”). For questions about these Terms,
        contact <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>2. Website purpose</h2>
      <p>
        The site presents our design portfolio and allows prospective clients to send project
        enquiries. Content is provided for general information. Portfolio case studies describe past
        work and do not guarantee identical outcomes for future projects.
      </p>

      <h2>3. No binding offer from browsing alone</h2>
      <p>
        Viewing the website does not create a contract for design services. A binding engagement
        arises only if we and you expressly agree in writing (for example, a proposal, statement of
        work, or service agreement) under the Civil Code of Georgia and related rules on formation of
        contracts.
      </p>

      <h2>4. Contact form and enquiries</h2>
      <p>
        If you submit a contact request, you confirm that the information you provide is accurate and
        that you are authorised to share it. Submitting a form is an invitation for us to contact you
        about your enquiry; it does not oblige us to accept a project or provide a quote.
      </p>
      <p>
        Personal data submitted through the site is handled as described in our{" "}
        <a href="/privacy">Privacy Policy</a>, in line with the Law of Georgia on Personal Data
        Protection.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the site in any way that violates Georgian law or third-party rights</li>
        <li>Attempt to gain unauthorised access to the site, servers, or related systems</li>
        <li>Interfere with or disrupt the site’s operation, security, or integrity</li>
        <li>Upload or transmit malware, spam, or harmful content</li>
        <li>Scrape or harvest content or contact details by automated means without our prior written consent</li>
        <li>Misrepresent your identity or affiliation when contacting us</li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        Unless otherwise stated, website text, graphics, logos, case imagery, videos, and other
        materials are owned by DoNotPress or used under licence. You may view and temporarily store
        pages for personal, non-commercial use. You may not copy, modify, distribute, publicly
        display, or create derivative works from site materials without our prior written permission,
        except where mandatory law (including limited quotation or other permitted uses under
        Georgian copyright legislation) allows otherwise.
      </p>
      <p>
        Client brand marks shown in case studies remain the property of their respective owners and
        are used for portfolio illustration.
      </p>

      <h2>7. Third-party links</h2>
      <p>
        The site may link to third-party websites. We are not responsible for their content, policies,
        or practices. Accessing third-party sites is at your own risk.
      </p>

      <h2>8. Disclaimer of warranties</h2>
      <p>
        The site is provided on an “as is” and “as available” basis. To the fullest extent permitted by
        Georgian law, we disclaim warranties of uninterrupted availability, error-free operation, or
        fitness for a particular purpose regarding the website itself. This disclaimer does not affect
        warranties or remedies that cannot be excluded for paid services under a separate written
        contract.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by Georgian law, DoNotPress is not liable for indirect,
        incidental, or consequential losses arising from use of, or inability to use, the website,
        including loss of data or business opportunity, except where liability cannot be limited
        (including for wilful misconduct or other cases where limitation is prohibited).
      </p>
      <p>
        Nothing in these Terms excludes liability that cannot be excluded under the mandatory rules
        of Georgia.
      </p>

      <h2>10. Indemnity</h2>
      <p>
        You agree to indemnify and hold DoNotPress harmless from claims, damages, and expenses
        (including reasonable legal fees) arising from your misuse of the site or your breach of these
        Terms, to the extent permitted by law.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these Terms from time to time. The “Last updated” date will change when we do.
        Continued use of the site after changes take effect means you accept the revised Terms,
        except where a different form of acceptance is required by law.
      </p>

      <h2>12. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of Georgia. Courts of Georgia have jurisdiction over
        disputes arising from or related to these Terms and use of the website, without prejudice to
        mandatory jurisdiction or consumer protection rules that may apply to you.
      </p>
      <p>
        Before filing a claim, we encourage you to contact us at{" "}
        <a href={`mailto:${email}`}>{email}</a> so we can try to resolve the matter amicably.
      </p>

      <h2>13. Severability</h2>
      <p>
        If any provision of these Terms is held invalid or unenforceable under Georgian law, the
        remaining provisions continue in full force and effect.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these Terms: <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <p className="legal-note">
        This page is a general website terms notice and does not constitute legal advice. For advice
        on a specific matter, consult a qualified lawyer admitted in Georgia.
      </p>
    </LegalPage>
  );
}
