// Article that uses the Nodity case (client work) as its worked example.
// Facts and numbers about the project come only from the published case (src/data/genie.js).
import cover from "../../../portfolio/Genie/Preview.webp";
import panel from "../../../portfolio/Genie/Slide-1/p2.webp";
import workflow from "../../../portfolio/Genie/Slide-2.webp";
import agent from "../../../portfolio/Genie/Slide-4.webp";
import community from "../../../portfolio/Genie/Slide-5/p2.webp";
import levels from "../../assets/blog/nodity/three-levels-of-control.webp";

export const nodityPost = {
  slug: "node-based-editor-ux-design",
  title: "How to design a node-based editor people can actually use",
  // The page title in search results: short enough not to be cut.
  seoTitle: "Node-based editor UX design: a worked example | Do Not Press",
  excerpt:
    "Node editors give full control and scare most new users away. How to keep the power and lower the entry, with Nodity, an AI node editor, as the example.",
  tags: ["Product Design", "AI Tools", "SaaS"],
  publishedAt: "2026-11-15",
  publishedLabel: "Nov 15, 2026",
  case: "nodity",
  cover,
  coverAlt: "The Nodity node-based AI editor on a laptop",
  content: [
    {
      text: "Node-based editors give people full control. Every model, setting and step is a box, and you wire the boxes together. That is why experts love tools like ComfyUI. It is also why many new users close them within minutes: an empty canvas and a long list of node types is not a starting point.",
    },
    {
      text: "Nodity, a US startup, set out to build a better version of ComfyUI: full control over AI models through nodes, without the setup. This article follows the design decisions behind it, as a method for any product that has to be both powerful and easy to start with.",
    },
    {
      type: "note",
      text: "Nodity is client work. Facts and numbers below come from the published [Nodity case](/cases/nodity).",
    },
    { type: "h2", text: "Remove the setup before you touch the interface" },
    {
      text: "Much of what makes node tools hard has nothing to do with the canvas. It is installing, downloading large models and sending files back and forth. Nodity’s first decision was to be a web platform: files are shared instantly, teammates edit together, and nobody has to download large models.",
    },
    {
      text: "Before you redesign a single screen, list everything a user must do before their first result. Each step you remove there is worth more than any polish later.",
    },
    { type: "h2", text: "Start with one node, and hide the rest" },
    {
      text: "The first thing a user meets is one node: enter a prompt, get a result. Detailed settings such as the model, iterations, creativity, seed and style live in a side panel that opens only when needed.",
    },
    {
      type: "image",
      src: panel,
      ratio: "4 / 3",
      alt: "A Nodity video node with its side panel of detailed settings open",
      caption: "One node for a first result. The detailed settings wait in the side panel.",
    },
    {
      text: "This is progressive disclosure: show the simplest useful version first, and reveal more control as the user asks for it. In a node editor it has three levels.",
    },
    {
      type: "ol",
      items: [
        "One node: a prompt and a result.",
        "The side panel: every setting of that node.",
        "Connected nodes: workflows, built by wiring nodes together.",
      ],
    },
    {
      type: "image",
      src: levels,
      alt: "Diagram: three levels of control, one node, the side panel, connected nodes, with an agent and ready workflows as shortcuts",
      caption: "Three levels of control, and two shortcuts past the blank canvas.",
    },
    {
      type: "image",
      src: workflow,
      ratio: "4 / 3",
      alt: "Nodes connected on a canvas: an image passes through a depth node into the next step",
      caption: "Connected nodes: the full power, one step later.",
    },
    { type: "h2", text: "Let an agent draft the workflow" },
    {
      text: "The hardest moment in a node editor is the blank canvas. Nodity’s answer is an AI agent that builds a workflow from a few words. The user adds references, answers a few short questions about what they need, and picks one of the options the agent suggests, for example a better option and a cheaper one, each with its cost in credits.",
    },
    {
      type: "image",
      src: agent,
      ratio: "4 / 3",
      alt: "The Nodity AI agent panel suggesting two train-generator workflows, a better one and a cheaper one",
      caption: "The agent suggests workflows. The user picks one and can still edit every node.",
    },
    {
      text: "The important part is what comes after. The agent’s result is an ordinary workflow, made of the same nodes, and fully editable. The agent is a starting point, not a black box. That keeps the system simple for beginners and fully customisable for experts.",
    },
    { type: "h2", text: "Borrow from the community" },
    {
      text: "The second way past the blank canvas is someone else’s work. In Nodity’s community catalogue, a ready workflow opens with one click, with no manual download or setup. Authors can publish their own workflows and earn from them, because the platform shares revenue with them, and that keeps the catalogue growing.",
    },
    {
      type: "image",
      src: community,
      ratio: "4 / 3",
      alt: "A community workflow card in Nodity with a preview image and a Start using button",
      caption: "A community workflow: read the details, then start using it.",
    },
    { type: "h2", text: "Measure tasks, not opinions" },
    {
      text: "For a tool like this, the useful test is task success: give people a real task and count how many finish it. The published case reports 80% success at building a workflow from nodes and 92% at training a LoRA. The product gathered 40K waitlist sign-ups, and it was sold to ComfyUI, where it is being adapted as ComfyUI Cloud.",
    },
    {
      text: "Pick the two or three tasks that define your product, test them on every major version, and watch the numbers, not only the comments.",
    },
    { type: "h2", text: "Checklist for powerful tools" },
    {
      type: "ol",
      items: [
        "List every step before the first result, and remove what you can.",
        "Open with the simplest useful version: one node, one result.",
        "Put detail in a side panel, not on the canvas.",
        "Offer two ways past the blank canvas: an agent and ready templates.",
        "Make anything the agent builds fully editable, from the same parts.",
        "Reward the people who make templates.",
        "Measure task success on the two or three tasks that define the product.",
      ],
    },
    {
      text: "See the nodes, the agent and the community screens in the [Nodity case](/cases/nodity). If your product is powerful but hard to start with, [let’s talk](/contact).",
    },
  ],
};
