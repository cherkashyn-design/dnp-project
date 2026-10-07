import yummo from "../assets/cases/yummo.webp";
import nodify from "../assets/cases/nodify.webp";
import salesDriver from "../assets/cases/sales-driver.webp";
import drumkit from "../assets/cases/drumkit.webp";

export const cases = [
  {
    slug: "yummo-food-guide-for-moms",
    name: "Yummo - Food guide for moms",
    title: "Yummo",
    tags: ["Branding", "Landing", "App"],
    image: yummo,
    summary: "Brand and product surface moms can trust at a glance.",
  },
  {
    slug: "nodify",
    name: "Nodify - node based AI editor",
    title: "Nodify",
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
    tags: ["Web UI / SaaS", "Landing"],
    image: drumkit,
    summary: "Logistics SaaS that fits the real workflow.",
  },
];

export function getCase(slug) {
  return cases.find((item) => item.slug === slug) ?? null;
}
