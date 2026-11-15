// Draftlex case. Every slide has a picture in portfolio/Draftlex (1-6.webp is slide 1.6).
// Slides that move are shown live: the page frames /draftlex/case.html?only=1.6&embed
// (the files in redesign/public/draftlex, copied there by to-dnp.mjs of the case), with the picture as a poster underneath.
// Draftlex is a real product; its owner does not mind the case. The redesign was not ordered, so it is marked a concept.
const pictures = import.meta.glob("../../portfolio/Draftlex/*.webp", { eager: true, import: "default" });
const picture = (id) => pictures[`../../portfolio/Draftlex/${id.replace(".", "-")}.webp`];

const still = (id) => ({ id: `case-draftlex-${id.replace(".", "-")}`, src: picture(id), shape: "slide" });
const live = (id, label) => ({ ...still(id), type: "embed", embed: id, folder: "draftlex", label });

export const draftlexCase = {
  title: "Draftlex",
  subtitle: "A new brand, website and product design for a platform where lawyers draft contract templates with AI.",
  heroAlt: "The Draftlex seal: the name set letter by letter in a ring of drops, on the brand's blue",
  heroImage: pictures["../../portfolio/Draftlex/Preview.webp"],
  heroCover: "draftlex", // the animated cover (the seal ring turning slowly) instead of the picture
  tags: ["Branding", "Landing", "SaaS", "Mobile"],
  concept: true, // a redesign nobody ordered: the case page says so next to the services
  overview: [
    [
      "[ GOAL ]",
      "Keep the structure of a working product, four steps from a title to a contract a lawyer can sign, and give it a look a law firm would trust: a brand, a website and the platform itself.",
    ],
    [
      "[ IDEA ]",
      "Every clause accounted for. The name ends in a full stop, the full stop becomes a seal, and the seal is a ring of drops that spells the name. Around it: paper with cut corners, a serif for the contract, one blue.",
    ],
  ],
  sections: [
    {
      id: "case-draftlex-branding",
      title: "Branding",
      description: "A serif name that ends in a blue full stop, a seal ring of drops that spells it, and paper with cut corners.",
      mediaRows: [
        [live("1.1", "Logo on the brand backgrounds")],
        [still("1.2"), still("1.3")],
        [live("1.4", "Icons"), still("1.5")],
        [still("1.6")],
        [live("1.7", "Business cards")],
        [live("1.8", "The seal on a signed page"), live("1.9", "Social posts")],
      ],
    },
    {
      id: "case-draftlex-website",
      title: "Website",
      description: "One page in the soft style of the product: round white cards on a grey ground, and pieces of the product instead of whole screens.",
      mediaRows: [[still("2.1")], [still("2.2"), still("2.3")], [live("2.4", "The website on a desktop")], [live("2.5", "The website on a phone")]],
    },
    {
      id: "case-draftlex-platform",
      title: "Platform",
      description: "Four steps from a title to a signed page, built on a ready component library: one round panel, the contract on a white sheet, one blue for what is selected or new.",
      mediaRows: [
        [still("3.1")],
        [live("3.2", "A section is added to the structure"), live("3.3", "A clause is written on request")],
        [still("3.4")],
        [still("3.5"), still("3.6")],
        [live("3.7", "The platform on a phone")],
        [live("3.8", "Screens of the platform")],
      ],
    },
  ],
};
