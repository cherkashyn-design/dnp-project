import yummoPreview from "../../portfolio/Yummo/Preview.jpg";
import yummoNavPreview from "../../portfolio/Yummo/Previews/Preview-Preview.jpg";
import yummoNavSlide1 from "../../portfolio/Yummo/Previews/Slide-1-Preview.jpg";
import yummoNavSlide2 from "../../portfolio/Yummo/Previews/Slide-2-Preview.jpg";
import yummoNavSlide3 from "../../portfolio/Yummo/Previews/Slide-3-Preview.jpg";
import yummoNavSlide4 from "../../portfolio/Yummo/Previews/Slide-4-Preview.jpg";
import yummoNavSlide5 from "../../portfolio/Yummo/Previews/Slide-5-Preview.jpg";
import yummoNavSlide6 from "../../portfolio/Yummo/Previews/Slide-6-Preview.jpg";
import yummoNavSlide7 from "../../portfolio/Yummo/Previews/Slide-7-Preview.jpg";
import yummoNavSlide8 from "../../portfolio/Yummo/Previews/Slide-8-Preview.jpg";
import yummoNavSlide9 from "../../portfolio/Yummo/Previews/Slide-9-Preview.jpg";
import yummoNavSlide10 from "../../portfolio/Yummo/Previews/Slide-10-Preview.jpg";
import yummoNavSlide11 from "../../portfolio/Yummo/Previews/Slide-11-Preview.jpg";
import yummoSlide1 from "../../portfolio/Yummo/Slide-1.jpg";
import yummoSlide2 from "../../portfolio/Yummo/Slide-2.jpg";
import yummoSlide3 from "../../portfolio/Yummo/Slide-3.jpg";
import yummoSlide4P1 from "../../portfolio/Yummo/Slide-4/p1.jpg";
import yummoSlide4P2 from "../../portfolio/Yummo/Slide-4/p2.jpg";
import yummoSlide5 from "../../portfolio/Yummo/Slide-5.jpg";
import yummoSlide6 from "../../portfolio/Yummo/Slide-6.jpg";
import yummoSlide7 from "../../portfolio/Yummo/Slide-7.jpg";
import yummoSlide8 from "../../portfolio/Yummo/Slide-8.jpg";
import yummoSlide9P1 from "../../portfolio/Yummo/Slide-9/p1.jpg";
import yummoSlide9P2 from "../../portfolio/Yummo/Slide-9/p2.jpg";
import yummoSlide10 from "../../portfolio/Yummo/Slide-10.jpg";

const yummoFavicon = "https://www.google.com/s2/favicons?domain=yummoapp.com&sz=32";

export const yummoCase = {
    title: "Yummo - Food guide for moms",
    subtitle: "Ukrainian B2C mobile app to build healthy meal plans for the babies",
    heroAlt: "Yummo mobile app on a phone mockup",
    heroImage: yummoPreview,
    tags: ["Branding", "Landing", "App"],
    productionLink: {
      href: "https://yummoapp.com",
      label: "yummoapp.com",
      favicon: yummoFavicon,
    },
    navigationItems: [
      { src: yummoNavPreview, href: "#case-hero", label: "Hero" },
      { src: yummoNavSlide1, href: "#case-yummo-app-1", label: "App catalogue" },
      { src: yummoNavSlide2, href: "#case-yummo-app-2", label: "App calendar" },
      { src: yummoNavSlide3, href: "#case-yummo-app-3", label: "App recipes" },
      { src: yummoNavSlide4, href: "#case-app-design-row-4", label: "App knowledge" },
      { src: yummoNavSlide5, href: "#case-yummo-landing-1", label: "Landing hero" },
      { src: yummoNavSlide6, href: "#case-yummo-landing-2", label: "Landing features" },
      { src: yummoNavSlide7, href: "#case-yummo-landing-3", label: "Landing continuation" },
      { src: yummoNavSlide8, href: "#case-yummo-landing-4", label: "Landing more" },
      { src: yummoNavSlide9, href: "#case-landing-page-row-5", label: "Landing knowledge" },
      { src: yummoNavSlide10, href: "#case-yummo-landing-6", label: "Landing footer" },
      { src: yummoNavSlide11, href: "#case-yummo-summary", label: "Summary" },
    ],
    overview: [
      [
        "[ GOAL ]",
        "Redesign the app based on beta testers feedback, make the design system more development friendly, sync production and design.",
      ],
      [
        "[ IDEA ]",
        "Make positive and synced design system. Recipes, plates, products - all of them require custom approach, so we need to help parents to build balanced meal plan.",
      ],
    ],
    sections: [
      {
        id: "case-app-design",
        title: "App design",
        description: "You can find it in App Store and Google Play",
        mediaRows: [
          [
            {
              id: "case-yummo-app-1",
              src: yummoSlide1,
              caption: "Find your food in catalogue",
            },
          ],
          [
            {
              id: "case-yummo-app-2",
              src: yummoSlide2,
              caption: "Read tips and add to your calendar",
            },
          ],
          [
            {
              id: "case-yummo-app-3",
              src: yummoSlide3,
              caption: "Search for ideas at the Recipes and Plates",
            },
          ],
          [
            {
              id: "case-yummo-app-4a",
              src: yummoSlide4P1,
              caption: "Learn more in Knowledge",
            },
            {
              id: "case-yummo-app-4b",
              src: yummoSlide4P2,
              caption: "Get subscription for advanced features",
            },
          ],
        ],
      },
      {
        id: "case-landing-page",
        title: "Landing page",
        description: "Our adds linked to this page, we are explaining key features and push to download",
        mediaRows: [
          [{ id: "case-yummo-landing-1", src: yummoSlide5 }],
          [{ id: "case-yummo-landing-2", src: yummoSlide6 }],
          [{ id: "case-yummo-landing-3", src: yummoSlide7 }],
          [{ id: "case-yummo-landing-4", src: yummoSlide8 }],
          [
            { id: "case-yummo-landing-5a", src: yummoSlide9P1 },
            { id: "case-yummo-landing-5b", src: yummoSlide9P2 },
          ],
          [{ id: "case-yummo-landing-6", src: yummoSlide10 }],
        ],
      },
    ],
    summary: {
      title: "Summary",
      description:
        "We have well structured redesigned app. Also, we have roadmap for future retention features, but it’s already affected user experience",
      stats: [
        ["+30%", "Website conversion rate"],
        ["+31%", "Daily active users rate"],
        ["6000+", "Users at the first week after release"],
      ],
      imageId: "case-yummo-summary",
      mockup: {
        mockupId: "cb0bf7e2-dc4f-4a4e-81ec-6ef0f8cb9982",
        aspectRatio: "16 / 9",
        trigger: "load",
        triggerLoop: true,
        cursorRange: "18-54-18-48",
        zoomMode: "fov",
        zoomAmount: "63",
        zoomDuration: "800",
      },
    },
  };
