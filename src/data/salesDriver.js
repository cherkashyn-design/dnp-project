import salesDriverNavPreview from "../../portfolio/SalesDriver/Previews/Preview-Preview.jpg";
import salesDriverNavSlide1 from "../../portfolio/SalesDriver/Previews/Slide-1-Preview.jpg";
import salesDriverNavSlide2 from "../../portfolio/SalesDriver/Previews/Slide-2-Preview.jpg";
import salesDriverNavSlide3 from "../../portfolio/SalesDriver/Previews/Slide-3-Preview.jpg";
import salesDriverNavSlide4 from "../../portfolio/SalesDriver/Previews/Slide-4-Preview.jpg";
import salesDriverNavSlide5 from "../../portfolio/SalesDriver/Previews/Slide-5-Preview.jpg";
import salesDriverNavSlide6 from "../../portfolio/SalesDriver/Previews/Slide-6-Preview.jpg";
import salesDriverNavSlide7 from "../../portfolio/SalesDriver/Previews/Slide-7-Preview.jpg";
import salesDriverNavSlide8 from "../../portfolio/SalesDriver/Previews/Slide-8-Preview.jpg";
import salesDriverNavSlide9 from "../../portfolio/SalesDriver/Previews/Slide-9-Preview.jpg";
import salesDriverNavSlide10 from "../../portfolio/SalesDriver/Previews/Slide-10-Preview.jpg";
import salesDriverNavSlide11 from "../../portfolio/SalesDriver/Previews/Slide-11-Preview.jpg";
import salesDriverSlide1 from "../../portfolio/SalesDriver/Slide-1.jpg";
import salesDriverSlide2 from "../../portfolio/SalesDriver/Slide-2.jpg";
import salesDriverSlide3P1 from "../../portfolio/SalesDriver/Slide-3/p1.jpg";
import salesDriverSlide3P2 from "../../portfolio/SalesDriver/Slide-3/p2.jpg";
import salesDriverSlide4 from "../../portfolio/SalesDriver/Slide-4.jpg";
import salesDriverSlide5P1 from "../../portfolio/SalesDriver/Slide-5/p1.jpg";
import salesDriverSlide5P2 from "../../portfolio/SalesDriver/Slide-5/p2.jpg";
import salesDriverSlide6 from "../../portfolio/SalesDriver/Slide-6.jpg";
import salesDriverSlide7 from "../../portfolio/SalesDriver/Slide-7.jpg";
import salesDriverSlide8 from "../../portfolio/SalesDriver/Slide-8.jpg";
import salesDriverSlide9 from "../../portfolio/SalesDriver/Slide-9.jpg";
import salesDriverSlide10P1 from "../../portfolio/SalesDriver/Slide-10/p1.jpg";
import salesDriverSlide10P2 from "../../portfolio/SalesDriver/Slide-10/p2.jpg";

export const salesDriverCase = {
    title: "Sales Driver - Ads Tool",
    subtitle: "AI B2B tool to get leads in one tap",
    heroAlt: "Sales Driver phone mockup with Get Leads button",
    heroImage: salesDriverPreview,
    tags: ["Branding", "Landing", "Deck"],
    navigationItems: [
      { src: salesDriverNavPreview, href: "#case-hero", label: "Hero" },
      { src: salesDriverNavSlide1, href: "#case-salesdriver-concept-1", label: "Design concept card" },
      { src: salesDriverNavSlide2, href: "#case-salesdriver-concept-2", label: "Design concept mobile" },
      { src: salesDriverNavSlide3, href: "#case-design-concept-row-3", label: "Design concept details" },
      { src: salesDriverNavSlide4, href: "#case-salesdriver-landing-1", label: "Landing page desktop" },
      { src: salesDriverNavSlide5, href: "#case-landing-page-row-2", label: "Landing page mobile" },
      { src: salesDriverNavSlide6, href: "#case-salesdriver-landing-3", label: "Landing page showcase" },
      { src: salesDriverNavSlide7, href: "#case-salesdriver-brand-1", label: "Brand system" },
      { src: salesDriverNavSlide8, href: "#case-salesdriver-brand-2", label: "Brand print" },
      { src: salesDriverNavSlide9, href: "#case-salesdriver-deck-1", label: "Pitch deck" },
      { src: salesDriverNavSlide10, href: "#case-pitch-deck-row-2", label: "Pitch deck details" },
      { src: salesDriverNavSlide11, href: "#case-salesdriver-summary", label: "Summary" },
    ],
    overview: [
      [
        "[ GOAL ]",
        "To build standalone brand for AI sales tool. It should be technical and modern",
      ],
      [
        "[ IDEA ]",
        "Usually AI B2B tools takes a lot of time to setting up. It’s a tool which automatically analyzes your business artifacts and provides the leads by a simple button “Get leads”. No need specialists to setting up",
      ],
    ],
    sections: [
      {
        id: "case-design-concept",
        title: "Design concept",
        description:
          "As a result of brainstorming we build acid modern design solution for the brand and presented it",
        mediaRows: [
          [
            {
              id: "case-salesdriver-concept-1",
              src: salesDriverSlide1,
              caption:
                "We found non usual solution for the business card. We are keep the idea of the one tap “Get leads” even for phisical objects",
            },
          ],
          [
            {
              id: "case-salesdriver-concept-2",
              src: salesDriverSlide2,
              caption:
                "Based on analytics main users is still uses mobile, so we had mobile first approach for this B2B product",
            },
          ],
          [
            {
              id: "case-salesdriver-concept-3a",
              src: salesDriverSlide3P1,
              caption: "We bought green paper for the docs to standalone",
            },
            {
              id: "case-salesdriver-concept-3b",
              src: salesDriverSlide3P2,
              caption: "Unique style for peach decks",
            },
          ],
        ],
      },
      {
        id: "case-landing-page",
        title: "Landing page",
        description: "We rebuild the landing page in our style based on AIDA sales pattern",
        mediaRows: [
          [
            {
              id: "case-salesdriver-landing-1",
              src: salesDriverSlide4,
            },
          ],
          [
            {
              id: "case-salesdriver-landing-2a",
              src: salesDriverSlide5P1,
            },
            {
              id: "case-salesdriver-landing-2b",
              src: salesDriverSlide5P2,
            },
          ],
          [
            {
              id: "case-salesdriver-landing-3",
              src: salesDriverSlide6,
            },
          ],
        ],
      },
      {
        id: "case-brand-system",
        title: "Brand system",
        description: "Clear rules and assents for the brand team to expand the style",
        mediaRows: [
          [
            {
              id: "case-salesdriver-brand-1",
              src: salesDriverSlide7,
            },
          ],
          [
            {
              id: "case-salesdriver-brand-2",
              src: salesDriverSlide8,
            },
          ],
        ],
      },
      {
        id: "case-pitch-deck",
        title: "Pitch deck",
        description: "Important tool for B2B sales build from stratch",
        mediaRows: [
          [
            {
              id: "case-salesdriver-deck-1",
              src: salesDriverSlide9,
            },
          ],
          [
            {
              id: "case-salesdriver-deck-2a",
              src: salesDriverSlide10P1,
            },
            {
              id: "case-salesdriver-deck-2b",
              src: salesDriverSlide10P2,
            },
          ],
        ],
      },
    ],
    summary: {
      title: "Summary",
      description:
        "We have branding, pith deck and landing. Everything you need to get traffic to your startup",
      stats: [
        ["+78%", "Website conversion rate"],
        ["+120%", "More leads remember us for a month after first touch"],
      ],
      imageId: "case-salesdriver-summary",
      mockup: {
        mockupId: "6c74029d-5a3f-4757-8157-8b0aef91630d",
        aspectRatio: "16 / 9",
        trigger: "load",
        triggerLoop: true,
        cursorAffectPage: false,
        cursorRange: "14-100-15-100",
        clickRange: "25-14-26-14",
        backgroundColor: "#000000",
      },
    },
  };
