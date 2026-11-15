// Article that uses the Ringproof case (a concept) as its worked example.
// Quotes and figures inside Ringproof's slides are part of the design, so the article does not quote them.
import cover from "../../assets/blog/ringproof/cover.webp";
import numerals from "../../../portfolio/Ringproof/1-3.webp";
import problem from "../../../portfolio/Ringproof/2-2.webp";
import tiles from "../../../portfolio/Ringproof/4-5.webp";
import recording from "../../../portfolio/Ringproof/4-6.webp";
import chain from "../../assets/blog/ringproof/one-idea-every-surface.webp";

export const ringproofPost = {
  slug: "b2b-saas-brand-from-logo-to-dashboard",
  title: "One idea from logo to dashboard: a B2B SaaS brand that holds together",
  // The page title in search results: short enough not to be cut.
  seoTitle: "B2B SaaS branding: one idea from logo to dashboard",
  excerpt:
    "Why B2B brands fall apart between the logo, the deck and the product, and how one idea holds them together. Worked example: the Ringproof concept.",
  tags: ["Branding", "B2B SaaS", "Brand System"],
  publishedAt: "2026-11-15",
  publishedLabel: "Nov 15, 2026",
  case: "ringproof",
  cover,
  coverAlt: "A ring of sound bars around a dot-matrix score, with result tiles beside it",
  content: [
    {
      text: "Many B2B startups look like three companies. The logo was made by one freelancer, the sales deck by the founder late at night, and the product by the engineers from a component kit. A buyer meets all three in the same week and hears three different stories.",
    },
    {
      text: "The fix is not a thicker brand book. It is one idea strong enough to shape every surface, from the mark to the numbers on a dashboard. Ringproof shows how that works.",
    },
    {
      type: "note",
      text: "Ringproof is a concept by Do Not Press: an invented product, not a client project. Names, quotes and figures inside its slides are part of the design. The full concept is in the [Ringproof case](/cases/ringproof).",
    },
    {
      text: "Ringproof tests a bank’s support line with simulated calls. It phones support the way a customer would, tries to get a real task done, such as blocking a lost card, and reports whether it worked.",
    },
    { type: "h2", text: "Choose an idea, not a style" },
    {
      text: "A style is a set of choices: a colour, a font, a corner radius. An idea is the sentence those choices come from. For Ringproof the sentence is “sound, made visible”. Everything the product does happens inside a phone call, and calls are invisible, so the brand shows them.",
    },
    { text: "A good brand idea for a B2B product passes three tests:" },
    {
      type: "ul",
      items: [
        "It comes from what the product actually does, not from its category.",
        "It can produce a mark, pictures and a way to set numbers.",
        "It still works inside the product, on a dense screen, not only on a poster.",
      ],
    },
    {
      type: "image",
      src: chain,
      alt: "Diagram: one sentence, sound made visible, leading to the mark, the numbers, the pictures, the deck and the product",
      caption: "One sentence, five surfaces. Each one can be traced back to the idea.",
    },
    { type: "h2", text: "Let the idea draw the mark, the numbers and the pictures" },
    { text: "From “sound, made visible” came three things:" },
    {
      type: "ul",
      items: [
        "The mark: a ring built from the bars of a waveform.",
        "The numbers: set in dots, like a call display. A score or a call time reads as if it came from the line itself.",
        "The pictures: waves and blurs of motion, never stock photos of smiling call-centre agents.",
      ],
    },
    {
      text: "The palette stays quiet: ink, graphite, a soft blue signal, mist, stone and paper. Green and red are kept for pass and fail only. In a product about results, those two colours must mean exactly one thing each.",
    },
    {
      type: "image",
      src: numerals,
      ratio: "4 / 3",
      alt: "The Ringproof type specimen with a row of dot-matrix numerals",
      caption: "Dot numerals, like a call display, for every number that matters.",
    },
    { type: "h2", text: "Carry it into the sales deck" },
    {
      text: "The deck is often where a brand breaks first, because it is made in a hurry. Ringproof’s deck is written for one person: a bank’s head of customer experience. It tells one story. Your reports say the call was answered; they don’t say the card was blocked. Then come three steps from a phone number to proof, and the six checks that decide pass or fail.",
    },
    {
      text: "Here the brand idea does real work. The problem slide is laid out like a call log, and the score uses the same dot numerals as the product. When the buyer opens the platform after the demo, it already looks familiar.",
    },
    {
      type: "image",
      src: problem,
      ratio: "4 / 3",
      alt: "A dark deck slide comparing what the phone system logged with what the customer actually got",
      caption: "The problem slide: what the reports show, and what the customer got.",
    },
    { type: "h2", text: "And into the product" },
    {
      text: "This is the test most brand ideas fail. A dashboard is dense, and there is no room for a big wave. So the idea shrinks to its parts: dot numerals for scores and times, a waveform for each call recording, green and red only for pass and fail.",
    },
    {
      type: "image",
      src: tiles,
      ratio: "4 / 3",
      alt: "Result tiles showing a call outcome, a score, the call length and a row of pass and fail dots",
      caption: "Result tiles: the outcome, the score and the checks, in the brand’s dot numerals.",
    },
    {
      type: "image",
      src: recording,
      ratio: "4 / 3",
      alt: "A call recording drawn as two waveforms, with a checklist of the caller’s tasks and a transcript",
      caption: "A call recording as two waveforms, caller and agent, with the moments that matter marked.",
    },
    {
      text: "The rule we use: in the product, the brand should be visible in the details and invisible in the workflow. People came to read a result, not to admire a logo.",
    },
    { type: "h2", text: "Checklist: does your brand hold together?" },
    {
      type: "ol",
      items: [
        "Can you say the brand idea in one sentence?",
        "Does that sentence come from what the product does?",
        "Can you trace the mark, the pictures and the number style back to it?",
        "Does the sales deck use the same type, numbers and colours as the product?",
        "Do the colours that mean something, such as pass, fail or new, mean only that?",
        "Put the logo, one deck slide and one product screen side by side. Do they look like one company?",
      ],
    },
    {
      text: "The whole concept, with the deck and 22 platform screens, is in the [Ringproof case](/cases/ringproof). If your logo, deck and product tell three stories, [we can make them tell one](/contact).",
    },
  ],
};
