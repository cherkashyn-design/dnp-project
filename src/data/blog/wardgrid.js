// Article that uses the Wardgrid case (a concept) as its worked example.
// The numbers inside Wardgrid's deck slides are part of the design, so the article does not quote them.
import cover from "../../../portfolio/Wardgrid/Preview.webp";
import week from "../../../portfolio/Wardgrid/4-1.webp";
import openShift from "../../../portfolio/Wardgrid/4-2.webp";
import conflict from "../../../portfolio/Wardgrid/4-3.webp";
import cell from "../../assets/blog/wardgrid/one-cell-three-states.webp";

export const wardgridPost = {
  slug: "design-for-the-worst-day-b2b-software-ux",
  title: "Design for the worst day: UX lessons from a hospital rota concept",
  // The page title in search results: short enough not to be cut.
  seoTitle: "Design for the worst day: B2B SaaS UX lessons | Do Not Press",
  excerpt:
    "Complex B2B software is judged on its worst day. How to design the hard moments first, with Wardgrid, a concept for hospital shift cover, as the example.",
  tags: ["B2B SaaS", "Product Design", "UX"],
  publishedAt: "2026-11-15",
  publishedLabel: "Nov 15, 2026",
  case: "wardgrid",
  cover,
  coverAlt: "An open night shift in the Wardgrid app, with the button Take this shift",
  content: [
    {
      text: "Most B2B software is shown on a good day: the data is clean, everyone is free, every button works. It is judged on a bad one. For a ward manager in a hospital, a bad day looks like this: someone calls in sick at six in the morning, a night shift is open, and the rules about rest between shifts still have to hold.",
    },
    {
      text: "Wardgrid is a platform that builds a ward’s rota and finds cover for open shifts. We designed it from nothing, starting with that bad day. This article is the method, so you can use it on your own product.",
    },
    {
      type: "note",
      text: "Wardgrid is a concept by Do Not Press, not a client project. It makes no medical claims and holds no patient data, and the figures inside its slides are part of the design, not research. The full concept is in the [Wardgrid case](/cases/wardgrid).",
    },
    { type: "h2", text: "Write the worst day down first" },
    {
      text: "Before any screen, write the hard moments as short scenes. Who is in trouble, what time is it, and what do they need to do in the next ten minutes? For Wardgrid the list was short:",
    },
    {
      type: "ul",
      items: [
        "A shift opens at short notice and has to be covered.",
        "A change breaks a rule, for example a third night in a row.",
        "Nobody who is free fits the rules.",
        "Next week’s rota is ready and has to be published.",
      ],
    },
    {
      text: "These scenes become the spine of the product. The normal week view matters, but it is where people look. The hard moments are where they act, and where they decide whether to trust the tool.",
    },
    { type: "h2", text: "Find the one element everything is made of" },
    {
      text: "A rota is a grid of cells: people down the side, days across the top. So the whole design was built from one cell in three states: covered, open and in conflict. The same cell draws the logo (five cells that melt into each other), the brand pictures and the interface.",
    },
    {
      type: "image",
      src: cell,
      alt: "Diagram: one rota cell in three states, covered, open and in conflict, and where each state appears",
      caption: "One cell, three states. Learn them once, and they read the same everywhere.",
    },
    {
      text: "This is more than a brand idea. When an interface has one main element with a few clear states, people learn it once. An open shift looks the same in the grid, in a push message and on the phone. Orange is used for an open shift and for nothing else, so it can be spotted from across the room.",
    },
    {
      type: "image",
      src: week,
      ratio: "4 / 3",
      alt: "The Wardgrid week view: a grid of staff and days, with open shifts marked in orange",
      caption: "The week of one ward on one screen. Open shifts are the only orange on the page.",
    },
    { type: "h2", text: "Design each hard moment as a short flow" },
    {
      text: "Each scene from the list becomes a flow with as few steps as possible, and each step shows what happens next.",
    },
    { type: "h3", text: "An open shift" },
    {
      text: "The manager does not phone round. The app finds the people who fit: rested, inside their hours, with the right skills. It asks them, the first to say yes takes the shift, and the rota closes the gap. The panel shows each stage: asked, accepted, covered.",
    },
    {
      type: "image",
      src: openShift,
      ratio: "4 / 3",
      alt: "A phone panel for a night shift that has been covered, with the rules it was checked against",
      caption: "The open-shift panel: who took the shift, and the rules it was checked against.",
    },
    { type: "h3", text: "A broken rule" },
    {
      text: "When a change breaks a rule, an error message is not enough. The panel names the rule, for example “that would be his third night in a row”, and offers a fix, such as a swap with someone for whom the change is fine. The manager approves the fix in one tap.",
    },
    {
      type: "image",
      src: conflict,
      ratio: "4 / 3",
      alt: "A phone panel that names a broken rest rule and shows the swap that fixed it",
      caption: "The conflict panel names the rule and shows the swap that fixes it.",
    },
    {
      text: "The general rule: in any product with constraints, show which rule broke and offer at least one way to fix it. A red mark without a way out only hands the problem back to the person.",
    },
    { type: "h2", text: "Test it on the bad day" },
    {
      text: "When you test a complex product, script the worst day, not the tour. Give the tester a scene, “Thursday night is open and it is six in the morning”, and watch whether they can close it without help. Time it. Note every place they stop. Then do the same for the broken rule and the empty week.",
    },
    {
      text: "A product that handles those scenes well usually handles the normal week too. The reverse is rarely true.",
    },
    { type: "h2", text: "Checklist for complex B2B software" },
    {
      type: "ol",
      items: [
        "Write the three to five worst moments as short scenes before drawing screens.",
        "Find the one element the product is made of, and give it a few clear states.",
        "Keep one colour for the one state that needs action.",
        "Turn every scene into a short flow that shows its stage.",
        "When a rule breaks, name the rule and offer a fix.",
        "Make the same state look the same everywhere: the grid, the phone, the message.",
        "Test with scripted bad days, not with a tour.",
      ],
    },
    {
      text: "The whole concept, from the logo to the phone app, is in the [Wardgrid case](/cases/wardgrid). Building a complex product for people who work under pressure? [Tell us about it](/contact).",
    },
  ],
};
