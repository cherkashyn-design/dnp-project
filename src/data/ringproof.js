// Ringproof case. Every slide has a picture in portfolio/Ringproof (1-6.webp is slide 1.6).
// Slides that move or can be used are shown live: the page frames /ringproof/case.html?only=1.6&embed
// (the files in redesign/public/ringproof), with the picture as a poster underneath.
const pictures = import.meta.glob("../../portfolio/Ringproof/*.webp", { eager: true, import: "default" });
const picture = (id) => pictures[`../../portfolio/Ringproof/${id.replace(".", "-")}.webp`];

const still = (id) => ({ id: `case-ringproof-${id.replace(".", "-")}`, src: picture(id), shape: "slide" });
const live = (id, label) => ({ ...still(id), type: "embed", embed: id, label });

export const ringproofCase = {
  title: "Ringproof",
  subtitle: "Brand, website and product design for a tool that tests bank support lines with simulated calls.",
  heroAlt: "Ringproof logo on a blue gradient",
  heroImage: pictures["../../portfolio/Ringproof/Preview.webp"],
  heroCover: "ringproof", // the animated cover instead of the picture
  tags: ["Branding", "Landing", "SaaS"],
  overview: [
    [
      "[ GOAL ]",
      "Give a new support-testing product one voice across everything a bank sees: the logo, the sales deck, the website and the platform where the results live.",
    ],
    [
      "[ IDEA ]",
      "Sound, made visible. The mark is a ring built from bars of a waveform, numbers are set in dots like a call display, and every picture is a wave or a blur of motion.",
    ],
  ],
  sections: [
    {
      id: "case-ringproof-branding",
      title: "Branding",
      description: "A mark built from bars of sound, and the pictures, type and carriers around it.",
      mediaRows: [
        [live("1.1", "Logo on the brand backgrounds")],
        [still("1.2"), still("1.3")],
        [live("1.4", "Icons"), live("1.5", "Tone of voice")],
        [live("1.6", "Business cards")],
        [live("1.7", "Badges"), still("1.8")],
        // the two editors can be used, and they have their own shape and no poster
        [{ id: "case-ringproof-1-12", type: "embed", embed: "1.12", label: "Background and logo editors", shape: "editors", interactive: true }],
        [still("1.9"), still("1.10")],
        [still("1.11")],
      ],
    },
    {
      id: "case-ringproof-deck",
      title: "Pitch deck",
      description: "The deck Ringproof shows to a bank's head of customer experience.",
      mediaRows: [[still("2.1")], [still("2.2"), still("2.3")], [still("2.4"), still("2.5")], [live("2.6", "All slides of the deck")]],
    },
    {
      id: "case-ringproof-website",
      title: "Website",
      description: "A marketing site that explains the product in one scroll.",
      mediaRows: [[still("3.1")], [still("3.2"), still("3.3")], [live("3.4", "The website on a desktop"), live("3.5", "The website on a phone")]],
    },
    {
      id: "case-ringproof-platform",
      title: "Platform",
      description: "The product itself: 22 screens for campaigns, scenarios and single test calls.",
      mediaRows: [[still("4.1")], [still("4.2"), still("4.3")], [still("4.4")], [live("4.5", "Result tiles"), live("4.6", "Call recording")], [live("4.7", "Screens of the platform")]],
    },
  ],
};
