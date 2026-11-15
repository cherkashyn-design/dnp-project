// Article that uses the Sales Driver case (client work) as its worked example.
// Facts about the project come only from the published case (src/data/salesDriver.js).
import cover from "../../assets/blog/sales-driver/cover.webp";
import card from "../../../portfolio/SalesDriver/Slide-1.webp";
import landing from "../../../portfolio/SalesDriver/Slide-4.webp";
import mobile from "../../../portfolio/SalesDriver/Slide-6.webp";
import aida from "../../assets/blog/sales-driver/aida-landing-map.webp";

export const salesDriverPost = {
  slug: "aida-landing-page-structure-b2b-example",
  title: "AIDA landing page structure: a worked example from a B2B AI tool",
  // The page title in search results: short enough not to be cut.
  seoTitle: "AIDA landing page structure: a B2B example | Do Not Press",
  excerpt:
    "How to build a landing page on AIDA, block by block, with the Sales Driver landing as the example: one action, mobile first, and a checklist.",
  tags: ["Conversion", "Landing Page", "B2B"],
  publishedAt: "2026-11-15",
  publishedLabel: "Nov 15, 2026",
  case: "sales-driver-ads-tool",
  cover,
  coverAlt: "A landing page split into four blocks marked A, I, D and A, with one green button",
  content: [
    {
      text: "AIDA, short for attention, interest, desire and action, is an old model of how people move towards a purchase. It is still the most useful way to plan a landing page, because it forces one question for every block: which step does this block serve?",
    },
    {
      parts: [
        "This article walks through the model block by block. The example is the landing page we rebuilt for Sales Driver, an AI tool that finds B2B leads. For AIDA across a whole funnel, see our earlier article on ",
        {
          label: "optimising funnel conversion",
          href: "https://medium.com/design-bootcamp/how-to-optimize-conversion-in-your-funnels-03182d39fd02",
        },
        ".",
      ],
    },
    {
      type: "note",
      text: "Sales Driver is client work. Everything said here about the project comes from the published [Sales Driver case](/cases/sales-driver-ads-tool).",
    },
    {
      type: "image",
      src: aida,
      alt: "Diagram: a landing page split into blocks, each marked attention, interest, desire or action",
      caption: "Every block serves one of the four steps. A block that serves none is cut.",
    },
    { type: "h2", text: "Start with the one action" },
    {
      text: "Before planning any block, decide the single thing the page asks for. Sales Driver had an easy answer, because the product is built around it. The tool analyses a company’s own materials and returns leads, with no specialist needed to set it up. The whole product is one button: “Get leads”.",
    },
    {
      text: "So the page has one action, and the brand repeats it everywhere. Even the business card is designed as that button.",
    },
    {
      type: "image",
      src: card,
      ratio: "32 / 25",
      alt: "A Sales Driver business card with a large round green Get leads button printed on it",
      caption: "The business card keeps the one-tap “Get leads” idea, even on paper.",
    },
    {
      text: "If your page asks for a demo, a trial and a newsletter with the same weight, it asks for nothing. Choose one, and make the others quiet links.",
    },
    { type: "h2", text: "Attention: say what it does in the first screen" },
    {
      text: "The first screen has one job: make the right visitor stay. That means naming the result, not the technology. On the Sales Driver landing the headline says “B2B leads generator”, and the “Get leads” button sits right beside it. A visitor knows what the product does before they scroll.",
    },
    {
      type: "ul",
      items: [
        "Name the result the buyer wants, in their words.",
        "Put the main action in the first screen.",
        "Use the strongest visual you have. Here it is the green button itself.",
      ],
    },
    {
      type: "image",
      src: landing,
      ratio: "32 / 25",
      alt: "The Sales Driver landing page on a laptop, with the headline B2B leads generator and a green Get leads button",
      caption: "The first screen: what the product does, and the button that does it.",
    },
    { type: "h2", text: "Interest and desire: explain, then prove" },
    {
      text: "Interest is about how it works. Desire is about why it is worth it. Keep them in that order: explain the mechanism in a few short steps, then show proof, such as numbers, examples and names you are allowed to publish.",
    },
    {
      text: "Two mistakes are common here. The first is showing proof before the visitor understands what is being proved. The second is a features list where every feature gets the same weight. Pick the two or three features that answer the buyer’s real worry. For a B2B AI tool that worry is usually “how much setup will this take?”, and Sales Driver’s answer is “none”.",
    },
    { type: "h2", text: "Action: repeat the one button" },
    {
      text: "The action block should not bring in anything new. Repeat the promise and the button from the first screen. A visitor who scrolled to the end has read your arguments. They need a clear way to act, not one more section.",
    },
    { type: "h2", text: "Design for the screen people actually use" },
    {
      text: "B2B is often assumed to be a desktop business. For Sales Driver, the analytics showed that most users were on their phones, so the landing was designed mobile first. Check your own numbers before you decide: the answer changes the order of the blocks, the length of the headline and where the button sits.",
    },
    {
      type: "image",
      src: mobile,
      ratio: "8 / 5",
      alt: "Three phones showing the Sales Driver landing page, with the Get leads button at the bottom",
      caption: "Mobile first: the landing on phones, with the button within reach.",
    },
    { type: "h2", text: "What came out of it" },
    {
      text: "Along with the landing, the project covered the brand, a brand system the client’s team can extend, and a pitch deck. The published case reports +78% in website conversion rate.",
    },
    {
      text: "A landing page never works alone. The offer, the traffic and the brand all play a part, so read a number like this as the result of the whole package, not of one layout.",
    },
    { type: "h2", text: "AIDA landing page checklist" },
    {
      type: "ol",
      items: [
        "One main action, chosen before any block is planned.",
        "The first screen names the result and shows the action.",
        "Every block is marked attention, interest, desire or action. A block that serves none is cut.",
        "How it works comes before proof.",
        "Only the two or three features that answer the buyer’s main worry.",
        "The last block repeats the first promise and the same button.",
        "The layout follows the device your visitors actually use.",
      ],
    },
    {
      text: "See the brand, the landing and the deck in the [Sales Driver case](/cases/sales-driver-ads-tool). If your landing page asks for too many things at once, [we can help you choose one](/contact).",
    },
  ],
};
