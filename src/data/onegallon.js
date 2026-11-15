// One Gallon case. Every slide has a picture in portfolio/OneGallon (1-6.webp is slide 1.6).
// Slides that move or can be used are shown live: the page frames /onegallon/case.html?only=1.6&embed
// (the files in redesign/public/onegallon, copied there by to-dnp.mjs of the case), with the picture as a poster underneath.
const pictures = import.meta.glob("../../portfolio/OneGallon/*.webp", { eager: true, import: "default" });
const picture = (id) => pictures[`../../portfolio/OneGallon/${id.replace(".", "-")}.webp`];

const still = (id) => ({ id: `case-onegallon-${id.replace(".", "-")}`, src: picture(id), shape: "slide" });
const live = (id, label, interactive = false) => ({ ...still(id), type: "embed", embed: id, folder: "onegallon", label, interactive });

export const oneGallonCase = {
  title: "One Gallon",
  subtitle: "Brand, website and app for a water tracker that counts for you: photograph a drink and it is logged.",
  heroAlt: "The One Gallon logo on soft blue ribbons of light",
  heroImage: pictures["../../portfolio/OneGallon/Preview.webp"],
  heroCover: "onegallon", // the animated cover (the logo on the brand's moving picture) instead of the picture
  tags: ["Branding", "Landing", "Mobile app"],
  concept: true, // not a client project: the case page says so next to the services
  overview: [
    [
      "[ GOAL ]",
      "Take a finished app design, a tracker that logs water from a photo of your glass, and give it everything a launch needs: a brand, App Store screenshots, social posts and a website.",
    ],
    [
      "[ IDEA ]",
      "Light through water. The app's soft blue pictures became two backgrounds made in code, ribbons of light and sun caustics, that move slowly behind the logo, the posts and the site, and that a visitor can rebuild with a few sliders.",
    ],
  ],
  sections: [
    {
      id: "case-onegallon-branding",
      title: "Branding",
      description: "A brand grown out of the app: its logo, colours and type, a picture of light in water made in code, and how it looks in the App Store and in a feed.",
      mediaRows: [
        [live("1.1", "Logo on the brand backgrounds")],
        [still("1.2"), still("1.3")],
        [live("1.4", "Background builder", true)], // the visitor can use it
        [live("1.5", "Icons"), live("1.6", "Tone of voice")],
        [live("1.7", "App Store screenshots")],
        [still("1.8")], // posts: three of them are stock photographs of people (Unsplash)
        [still("1.9")], // stories: two of them are stock photographs of people (Unsplash)
      ],
    },
    {
      id: "case-onegallon-website",
      title: "Website",
      description: "One screen in two halves: the words on the left, one illustration at a time on the right, and an ending that turns the whole screen into water.",
      // The website's Pricing illustration is a stock photograph of a person (ILLUSTRATIONS.pricing in public/onegallon/site.js).
      mediaRows: [[live("2.1", "The website on a desktop")], [live("2.2", "The website on a phone")]],
    },
    {
      id: "case-onegallon-app",
      title: "App",
      description: "The app as it was designed: photograph a drink, check the amount, watch the day fill.",
      mediaRows: [[still("3.1")], [still("3.2"), still("3.3")], [live("3.4", "Screens of the app")]],
    },
  ],
};
