// Article that uses the One Gallon case (a concept) as its worked example.
import cover from "../../../portfolio/OneGallon/Preview.webp";
import builder from "../../../portfolio/OneGallon/1-4.webp";
import voice from "../../../portfolio/OneGallon/1-6.webp";
import screenshots from "../../../portfolio/OneGallon/1-7.webp";
import website from "../../../portfolio/OneGallon/2-1.webp";
import kit from "../../assets/blog/onegallon/launch-kit.webp";

export const oneGallonPost = {
  slug: "mobile-app-launch-checklist-brand-screenshots-website",
  title: "Your app is designed. Here is what it still needs before launch",
  // The page title in search results: short enough not to be cut.
  seoTitle: "Mobile app launch checklist: brand, screenshots, website",
  excerpt:
    "A finished app design is not a launch. A checklist for the brand, App Store screenshots, posts and website, with the One Gallon concept as the example.",
  tags: ["Mobile App", "Branding", "Launch"],
  publishedAt: "2026-11-15",
  publishedLabel: "Nov 15, 2026",
  case: "one-gallon",
  cover,
  coverAlt: "The One Gallon logo on soft blue ribbons of light",
  content: [
    {
      text: "Many founders reach the same point. The app screens are done, the build is on its way, and launch is a few weeks out. Then someone asks for the App Store screenshots, the icon, the first posts and the website. None of it is ready, because so far the design was only the app.",
    },
    {
      text: "This article is a checklist for that gap. The worked example is One Gallon, a water tracker that logs a drink from a photo of your glass.",
    },
    {
      type: "note",
      text: "One Gallon is a concept by Do Not Press: we started from an existing app design and built everything a launch needs around it. It is not a client project, and there are no launch results to report. The full concept is in the [One Gallon case](/cases/one-gallon).",
    },
    { type: "h2", text: "Start from the app, not from a moodboard" },
    {
      text: "The fastest way to a brand that fits is to take it from the product. The app already has colours, a type style and a feel. A brand made separately, from a moodboard, often fights the screens it is meant to sell.",
    },
    {
      text: "One Gallon’s app was built on soft blue pictures of light in water. So the brand idea became “light through water”, and the brand colours came straight from those screens: azure, sky, lilac, a deep blue, mist and ink.",
    },
    {
      text: "There is a practical side too. The picture of light in water was made in code, as two backgrounds: ribbons of light and sun caustics. Every new post, story or page can get a fresh background in seconds, in the right style, without waiting for a designer.",
    },
    {
      type: "image",
      src: builder,
      ratio: "4 / 3",
      alt: "The One Gallon logo on a blue background, next to a panel of sliders that change the background",
      caption: "The background builder: the brand’s moving picture, rebuilt with a few sliders.",
    },
    { type: "h2", text: "The launch kit, item by item" },
    {
      text: "Here is what a small consumer app needs on launch day. Not all of it is design work, but all of it needs design decisions.",
    },
    {
      type: "image",
      src: kit,
      alt: "Diagram: the app in the middle, surrounded by the six parts of a launch kit",
      caption: "Everything around the app that has to be ready on launch day.",
    },
    {
      type: "ul",
      items: [
        "An app icon and a logo, tested at real sizes: the icon in a phone’s grid, the logo in a small avatar.",
        "App Store screenshots, usually five to eight, each with one message.",
        "A short tone of voice: how the app talks when you reach your goal, miss a day or come back.",
        "Social templates: posts and stories that someone other than the designer can fill in.",
        "A website, often a single screen, with a download button.",
        "One icon set, used in the app, on the site and in the posts.",
      ],
    },
    {
      text: "Write the list down early and give each item an owner and a date. The usual failure is not bad design. It is screenshots made the night before release.",
    },
    { type: "h2", text: "App Store screenshots sell one idea each" },
    {
      text: "Screenshots are read in the time it takes to scroll past them. Each one needs a short message and a screen that proves it. One Gallon’s main idea is that you photograph a drink instead of typing it in, so the screenshots say exactly that: snap your drink, logged in a second, any glass, any size.",
    },
    {
      type: "ul",
      items: [
        "One message per screenshot, in a few words, large enough to read on a phone.",
        "Show the real screen that proves the message, not a decorative mockup.",
        "Put the main idea first. Many people only see the first two or three.",
        "Keep the background and type the same across the set, so it reads as one story.",
      ],
    },
    {
      type: "image",
      src: screenshots,
      ratio: "4 / 3",
      alt: "A row of App Store screenshots for One Gallon, each with a short headline above the app screen",
      caption: "App Store screenshots: one message each, the main idea first.",
    },
    { type: "h2", text: "Give the app a voice" },
    {
      text: "A tracker talks to people every day, so the words matter as much as the screens. A short tone-of-voice page saves many small arguments later. One Gallon talks like a friend with a stopwatch: short, warm, a little dry. “Good job! 10 oz added. 118 to go.” “Five days in a row. Keep pouring.” “Snap it. Sip it. Done.”",
    },
    {
      text: "Write five or six lines for the moments that repeat: the first log, a goal reached, a missed day, a streak. Then use the same lines in the app, the posts and the store page.",
    },
    {
      type: "image",
      src: voice,
      ratio: "4 / 3",
      alt: "Four short lines in the One Gallon tone of voice, set as rounded labels",
      caption: "Tone of voice: the lines the app uses every day.",
    },
    { type: "h2", text: "One screen is enough for the website" },
    {
      text: "For a small consumer app, the website has two jobs: say what the app does, and send people to the store. One Gallon’s site is one screen in two halves, with the words on the left and one picture at a time on the right. At the end the whole screen turns into water.",
    },
    {
      text: "If you have time for only one page, make it this: a headline that names the result (“Hit one gallon of water daily”), one sentence on how it works, a download button, and a few short sections that each answer one question.",
    },
    {
      type: "image",
      src: website,
      ratio: "4 / 3",
      alt: "The One Gallon website: a large headline on the left and the app on a blue background on the right",
      caption: "The concept website: the words on the left, one picture at a time on the right.",
    },
    { type: "h2", text: "Launch checklist" },
    {
      type: "ol",
      items: [
        "The brand comes from the app’s own colours and pictures.",
        "The logo and the icon are tested at real sizes.",
        "App Store screenshots: one message each, the main idea first.",
        "Five or six tone-of-voice lines for the moments that repeat.",
        "Post and story templates that someone else can fill in.",
        "A one-screen website with a clear download button.",
        "One icon set across the app, the site and the posts.",
        "Every item has an owner and a date before launch week.",
      ],
    },
    {
      text: "The whole concept, from the logo to the moving backgrounds, is in the [One Gallon case](/cases/one-gallon). If your app is designed and launch is close, [we can build the rest of the kit](/contact).",
    },
  ],
};
