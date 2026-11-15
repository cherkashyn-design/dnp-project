// Article that uses the Draftlex case as its worked example.
// Draftlex is a real product; the redesign was not ordered, so the article calls it a concept, as the case page does.
import cover from "../../../portfolio/Draftlex/Preview.webp";
import steps from "../../../portfolio/Draftlex/2-2.webp";
import structure from "../../../portfolio/Draftlex/3-2.webp";
import clause from "../../../portfolio/Draftlex/3-3.webp";
import seal from "../../../portfolio/Draftlex/1-8.webp";
import flow from "../../assets/blog/draftlex/review-first-flow.webp";

export const draftlexPost = {
  slug: "how-to-design-ai-drafting-tool-lawyers-trust",
  title: "How to design an AI drafting tool lawyers will trust",
  // The page title in search results: short enough not to be cut.
  seoTitle: "How to design an AI tool lawyers will trust | Do Not Press",
  excerpt:
    "Trust is the product in legal AI. A method for designing AI drafting tools, with the Draftlex concept as the worked example and a checklist at the end.",
  tags: ["AI Product Design", "Legal Tech", "SaaS"],
  publishedAt: "2026-11-15",
  publishedLabel: "Nov 15, 2026",
  case: "draftlex",
  cover,
  coverAlt: "The Draftlex seal: the name set letter by letter in a ring of drops",
  content: [
    {
      text: "Lawyers do not buy an AI tool because it writes fast. They buy it when they can check what it wrote, quickly, and put their name under it. So in legal AI the interface has one main job: make the work easy to check.",
    },
    {
      type: "note",
      text: "Draftlex is a real product. This redesign was not ordered by its team: it is a concept by Do Not Press, made to work through the ideas below. No client results are claimed here. The full concept is in the [Draftlex case](/cases/draftlex).",
    },
    { type: "h2", text: "Trust is the product" },
    {
      text: "In most software a mistake costs a click. In a contract, a wrong clause can cost a client money years later, and the lawyer who signed it carries the blame. That changes what good UX means. Speed still matters, but only after three questions have answers: what did the AI write, what is it based on, and what did I change?",
    },
    {
      text: "If the interface cannot answer those three questions at a glance, the lawyer reads everything again. Then the tool saves no time, and it gets dropped.",
    },
    { type: "h2", text: "Keep the workflow, change the surface" },
    {
      text: "Draftlex already had a structure that worked: four steps from a title to a contract. Basic settings (the document, the country, the language), more details, a review of the structure, final edits. We kept all four.",
    },
    {
      text: "This is the first decision worth copying. When a product has a working flow, a redesign should not move the steps around to look new. People who use it every day have learned it. Change how each step looks and how clearly it shows its state, and leave the order alone.",
    },
    {
      type: "image",
      src: steps,
      ratio: "4 / 3",
      alt: "The Draftlex website section that lists four steps from a title to a signed page",
      caption: "Four steps from a title to a signed page, as the concept website explains them.",
    },
    {
      text: "The order itself builds trust. The lawyer approves the structure, the list of sections, before the AI writes a word of the text. Nothing appears in the contract that the lawyer did not first agree to in outline.",
    },
    {
      type: "image",
      src: flow,
      alt: "Diagram: four steps, with the lawyer approving the outline before the AI writes and checking each clause after",
      caption: "Review first: the person approves the outline, the AI writes inside it, the person checks every clause.",
    },
    {
      type: "image",
      src: structure,
      ratio: "4 / 3",
      alt: "The Review structure screen: a list of contract sections that can be added, moved or removed",
      caption: "Review structure: the outline can be edited before any clause is written.",
    },
    { type: "h2", text: "Show what the AI wrote, and what changed" },
    {
      text: "The second job is to make machine-written text visible. In the concept, one blue is used for everything that is selected or new, and for nothing else. A clause the AI has just written is marked; once the lawyer accepts it, it becomes plain text on the white sheet.",
    },
    {
      type: "ul",
      items: [
        "One colour means new or selected. If the same blue also paints buttons, links and decoration, it stops meaning anything.",
        "Edits are asked for in plain words, next to the clause: “Add interest on late rent at 3% above base.” The request stays in view while the clause is rewritten.",
        "The contract is shown as a document: a white sheet, a serif, numbered clauses. Lawyers read contracts as pages, not as form fields.",
        "A draft check sits beside the text and points to what still needs a look. It tells the lawyer where to read, not that the work is done.",
      ],
    },
    {
      type: "image",
      src: clause,
      ratio: "4 / 3",
      alt: "A Rent and deposit section with a plain-words request above it and one rewritten clause marked in blue",
      caption: "A clause rewritten on request. The request stays above the text, and the new lines are marked.",
    },
    { type: "h2", text: "Look serious without looking old" },
    {
      text: "Legal brands tend to fall into one of two traps: marble columns and navy blue, or a generic tech startup that a partner at a law firm would not take seriously. The concept sits between them.",
    },
    {
      text: "The idea is “every clause accounted for”. The name ends in a full stop, the full stop becomes a seal, and the seal is a ring of drops that spells the name. Around it: a serif for the contract text, a clean sans for the interface, paper with cut corners, and one blue.",
    },
    {
      type: "image",
      src: seal,
      ratio: "4 / 3",
      alt: "A signed contract page with the Draftlex seal stamped beside the signatures",
      caption: "The seal on a signed page: the mark comes from the act of signing.",
    },
    {
      text: "The lesson works for any professional tool. Borrow the signals of the profession, such as a seal, a page or a serif, and leave its clichés. One borrowed signal used everywhere does more than five used once.",
    },
    { type: "h2", text: "Checklist for AI tools in regulated work" },
    {
      type: "ol",
      items: [
        "On any screen, can a user tell which text the AI wrote and which a person wrote or approved?",
        "Does the user approve the outline before the AI writes the content?",
        "Is every AI edit tied to a visible request in plain words?",
        "Is there one colour or mark that means new, used for nothing else?",
        "Is the output shown in the form the user will finally sign or send: a page, not a form?",
        "Does the review step point to what needs checking, rather than declaring the work correct?",
        "Can the result leave the tool in the format the firm already uses, such as .DOC or PDF?",
      ],
    },
    {
      text: "If the answer to any of these is no, fix that before adding another AI feature. A faster model will not win back a user who has stopped trusting the screen.",
    },
    {
      text: "The whole concept, from the seal to the platform screens, is in the [Draftlex case](/cases/draftlex). If you are building an AI tool for lawyers, doctors or finance teams and need this kind of review-first design, [talk to us](/contact).",
    },
  ],
};
