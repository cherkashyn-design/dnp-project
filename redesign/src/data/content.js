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
    shot: caseShot("nodity"),
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
      "DNP is excellent and incredibly talented. They move fast, sweat the details, and stay positive and persistent through every round of design changes. Thoughtful throughout and a pleasure to work with. I would gladly work with them again.",
    avatar: dhruv,
    logo: drumkitLogo,
    logoAlt: "Drumkit",
  },
  {
    name: "Orkhan M.",
    role: "Founder, Nodity",
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
      "DNP delivered quickly and got the details right the first time. When our requirements changed, they adapted without friction and kept the process easy on our side. I’d gladly work with them again.",
    avatar: vasyl,
    logo: templateRocketLogo,
    logoAlt: "TemplateRocket",
  },
];

export const faqs = [
  {
    question: "What do I need to get started?",
    answer:
      "A link to your product or prototype and a rough deadline. No deck or brief required: we start with a 30-minute call and reply within one business day",
  },
  {
    question: "How much does a project cost?",
    answer:
      "Projects start at $8k. The price depends on scope, and you get both the scope and the price in writing before any work starts",
  },
  {
    question: "How do we work together?",
    answer:
      "In a shared Slack channel. You see progress as it happens and give feedback directly, without waiting on a weekly status deck",
  },
  {
    question: "What do I get at the end?",
    answer:
      "Figma files structured for development, plus a design system, guidelines, and prompts, so your team and AI tools stay consistent after we leave",
  },
];

export const budgets = ["$8k+", "$20k+", "$50k+", "Not sure"];
