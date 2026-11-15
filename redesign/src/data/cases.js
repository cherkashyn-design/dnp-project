import yummo from "../assets/cases/yummo.webp";
import nodify from "../assets/cases/nodify.webp";
import salesDriver from "../assets/cases/sales-driver.webp";
import drumkit from "../assets/cases/drumkit.webp";
import ringproof from "../../../portfolio/Ringproof/Preview.webp";
import wardgrid from "../../../portfolio/Wardgrid/Preview.webp";
import oneGallon from "../../../portfolio/OneGallon/Preview.webp";
import draftlex from "../../../portfolio/Draftlex/Preview.webp";

// A case with hidden: true stays in the code but is not shown anywhere: no card, no page, no link.
const allCases = [
  {
    slug: "draftlex",
    name: "Draftlex - Contract templates drafted with AI",
    title: "Draftlex",
    tags: ["Concept", "Branding", "Landing", "SaaS"],
    image: draftlex,
    cover: "draftlex", // cards show the animated cover (ProjectMedia) instead of the picture
    summary: "A new brand, website and platform for lawyers who draft contract templates with AI.",
  },
  {
    slug: "one-gallon",
    name: "One Gallon - Water tracker that counts for you",
    title: "One Gallon",
    tags: ["Concept", "Branding", "Landing", "Mobile app"],
    image: oneGallon,
    cover: "onegallon", // cards show the animated cover (ProjectMedia) instead of the picture
    summary: "Brand, website and app for a water tracker that logs a drink from a photo of your glass.",
  },
  {
    slug: "wardgrid",
    name: "Wardgrid - Shift cover for hospital wards",
    title: "Wardgrid",
    tags: ["Concept", "Branding", "Landing", "SaaS"],
    image: wardgrid,
    cover: "wardgrid", // cards show the animated cover (ProjectMedia) instead of the picture
    summary: "Brand, website and product design for a platform that builds a hospital ward's rota and finds cover for open shifts.",
  },
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

// The order in which cases are shown on the home page (the Cases page has the same list in CasesPage.jsx).
const order = ["sales-driver-ads-tool", "nodity", "ringproof", "wardgrid", "draftlex", "one-gallon"];
const place = (item) => (order.indexOf(item.slug) + 1 || order.length + 1);

export const cases = allCases.filter((item) => !item.hidden).sort((a, b) => place(a) - place(b));

export function getCase(slug) {
  return cases.find((item) => item.slug === slug) ?? null;
}
