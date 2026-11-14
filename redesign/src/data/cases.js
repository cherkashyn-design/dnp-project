import yummo from "../assets/cases/yummo.webp";
import nodify from "../assets/cases/nodify.webp";
import salesDriver from "../assets/cases/sales-driver.webp";
import drumkit from "../assets/cases/drumkit.webp";
import ringproof from "../../../portfolio/Ringproof/Preview.webp";

// A case with hidden: true stays in the code but is not shown anywhere: no card, no page, no link.
const allCases = [
  {
    slug: "ringproof",
    name: "Ringproof - Support testing for banks",
    title: "Ringproof",
    tags: ["Concept", "Branding", "Landing", "SaaS"],
    image: ringproof,
    cover: "ringproof", // cards show the animated cover (ProjectMedia) instead of the picture
    summary: "Brand, website and product design for a tool that tests bank support lines with simulated calls.",
  },
  {
    slug: "yummo-food-guide-for-moms",
    name: "Yummo - Food guide for moms",
    title: "Yummo",
    hidden: true,
    tags: ["Branding", "Landing", "App"],
    image: yummo,
    summary: "Brand and product surface moms can trust at a glance.",
  },
  {
    slug: "nodity",
    name: "Nodity - node based AI editor",
    title: "Nodity",
    tags: ["SaaS", "App"],
    image: nodify,
    summary:
      "A US startup which is providing full control on AI models with nodes system.",
  },
  {
    slug: "sales-driver-ads-tool",
    name: "Sales Driver - Ads Tool",
    title: "Sales Driver",
    tags: ["Branding", "Landing", "Deck"],
    image: salesDriver,
    summary: "Ads tool story that converts from deck to product.",
  },
  {
    slug: "drumkit-logistic-saas",
    name: "Drumkit - Logistic SaaS",
    title: "Drumkit",
    hidden: true,
    tags: ["Web UI / SaaS", "Landing"],
    image: drumkit,
    summary: "Logistics SaaS that fits the real workflow.",
  },
];

export const cases = allCases.filter((item) => !item.hidden);

export function getCase(slug) {
  return cases.find((item) => item.slug === slug) ?? null;
}
