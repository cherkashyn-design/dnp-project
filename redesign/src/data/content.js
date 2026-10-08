import { cases } from "./cases.js";
import dhruv from "../assets/people/dhruv.webp";
import orkhan from "../assets/people/orkhan.webp";
import vasyl from "../assets/people/vasyl.webp";
import drumkitLogo from "../assets/logos/drumkit.svg";
import nodityLogo from "../assets/logos/nodity.svg";
import templateRocketLogo from "../assets/logos/templaterocket.svg";

export const email = "contact@donotpress.com";
export const phone = "+995 551 155 743";
export const phoneE164 = "995551155743";
export const whatsappUrl = `https://wa.me/${phoneE164}`;
export const telegramUrl = `https://t.me/+${phoneE164}`;

function caseShot(slug) {
  return cases.find((item) => item.slug === slug) ?? null;
}

export const services = [
  {
    number: "01",
    title: "Product design",
    description:
      "Ship-ready flows and UI for complex SaaS, structured for development, not just Figma polish",
    shot: caseShot("nodify"),
  },
  {
    number: "02",
    title: "Websites",
    description:
      "Landing pages and product sites built to convert, with message and visual aligned end to end",
    shot: caseShot("yummo-food-guide-for-moms"),
  },
  {
    number: "03",
    title: "Brand identity",
    description:
      "Logo, type, colour, and guidelines your team and AI tools can reuse without drifting",
    shot: caseShot("sales-driver-ads-tool"),
  },
];

export const testimonials = [
  {
    name: "Dhruv G.",
    role: "Founder, Drumkit & Axle Technologies",
    quote:
      "DNP is excellent and incredibly talented. They are rapid and pretty detail-oriented. They also got a very positive attitude, is persistent through design changes/requests, and thoughtful throughout. They a pleasure to work with and I would gladly work with they again.",
    avatar: dhruv,
    logo: drumkitLogo,
    logoAlt: "Drumkit",
  },
  {
    name: "Orkhan M.",
    role: "Founder, Nodify",
    quote:
      "DNP is sharp and surprisingly fast. They dig into complex AI product detail without losing the big picture. Great attitude through iterations, and they stay thoughtful about UX even when the scope moves. A pleasure to partner with. I’d bring them in again without hesitation.",
    avatar: orkhan,
    logo: nodityLogo,
    logoAlt: "Nodity",
  },
  {
    name: "Vasyl F.",
    role: "Founder, TemplateRocket",
    quote:
      "DNP is excellent, talented and rapid. They’re detail-oriented and keep a positive attitude when requirements change. Thoughtful throughout the process and easy to collaborate with. I’d gladly work with them again.",
    avatar: vasyl,
    logo: templateRocketLogo,
    logoAlt: "TemplateRocket",
  },
];

export const faqs = [
  {
    question: "What do I need to get started?",
    answer:
      "We have design system and docs in each project, so that’s easy to personalize to your project with agentic AI",
  },
  {
    question: "Where can I find more information?",
    answer:
      "We have design system and docs in each project, so that’s easy to personalize to your project with agentic AI",
  },
  {
    question: "Who should I contact for support?",
    answer:
      "We have design system and docs in each project, so that’s easy to personalize to your project with agentic AI",
  },
  {
    question: "How long will the setup process take?",
    answer:
      "We have design system and docs in each project, so that’s easy to personalize to your project with agentic AI",
  },
];

export const budgets = ["$8k+", "$20k+", "$50k+", "Not sure"];
