// Wardgrid case. Every slide has a picture in portfolio/Wardgrid (1-6.webp is slide 1.6).
// Slides that move or can be used are shown live: the page frames /wardgrid/case.html?only=1.6&embed
// (the files in redesign/public/wardgrid, copied there by to-dnp.mjs of the case), with the picture as a poster underneath.
const pictures = import.meta.glob("../../portfolio/Wardgrid/*.webp", { eager: true, import: "default" });
const picture = (id) => pictures[`../../portfolio/Wardgrid/${id.replace(".", "-")}.webp`];

const still = (id) => ({ id: `case-wardgrid-${id.replace(".", "-")}`, src: picture(id), shape: "slide" });
const live = (id, label, interactive = false) => ({ ...still(id), type: "embed", embed: id, folder: "wardgrid", label, interactive });

export const wardgridCase = {
  title: "Wardgrid",
  subtitle: "Brand, website and product design for a platform that builds a hospital ward's rota and finds cover for open shifts.",
  heroAlt: "An open night shift in the Wardgrid app, with the button Take this shift",
  heroImage: pictures["../../portfolio/Wardgrid/Preview.webp"],
  heroCover: "wardgrid", // the animated cover (a shift being taken in the app) instead of the picture
  tags: ["Branding", "Landing", "SaaS", "Mobile app"],
  concept: true, // not a client project: the case page says so next to the services
  overview: [
    [
      "[ GOAL ]",
      "Design, from nothing, a product a ward manager would trust on a bad day: someone is off sick, a night shift is open, and the rules about rest still have to hold.",
    ],
    [
      "[ IDEA ]",
      "Every cell covered. A rota is a grid of cells, so the mark, the pictures and the interface are all built from one cell in three states: covered, open, in conflict.",
    ],
  ],
  sections: [
    {
      id: "case-wardgrid-branding",
      title: "Branding",
      description: "A mark of five cells that melt into each other, and the pictures, type and carriers around it.",
      mediaRows: [
        [live("1.1", "Logo on the brand backgrounds")],
        [still("1.2"), still("1.3")],
        [live("1.4", "Icons"), live("1.5", "Tone of voice")],
        [live("1.7", "Staff badge"), still("1.8")],
        [live("1.12", "Picture editor", true)], // the visitor can use it
        [still("1.9"), still("1.10")],
        [still("1.11")],
      ],
    },
    {
      id: "case-wardgrid-deck",
      title: "Pitch deck",
      description: "Ten slides for the sales team: the empty cell, what it costs, and how Wardgrid closes it.",
      mediaRows: [[still("2.1")], [still("2.2"), still("2.3")], [still("2.4"), still("2.5")], [live("2.6", "All slides of the deck")]],
    },
    {
      id: "case-wardgrid-website",
      title: "Website",
      description: "One page that sells a demo: the promise, how it works, numbers, pricing.",
      mediaRows: [[still("3.1")], [still("3.2"), still("3.3")], [live("3.4", "The website on a desktop")], [live("3.5", "The website on a phone")]],
    },
    {
      id: "case-wardgrid-platform",
      title: "Platform",
      description: "The week of one ward on one screen, and the hard moments: an open shift, a broken rule, nobody free.",
      mediaRows: [
        [still("4.1")],
        [live("4.2", "The open-shift panel: asked, accepted, covered"), live("4.3", "The conflict panel: a broken rule fixed by a swap")],
        [live("4.4", "An open shift is asked for and covered")],
        [still("4.5"), still("4.6")],
        [still("4.7")],
        [still("4.8"), still("4.9")],
        [live("4.10", "Screens of the platform")],
      ],
    },
  ],
};
