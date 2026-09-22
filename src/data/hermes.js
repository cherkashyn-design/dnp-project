import hermesPreview from "../../portfolio/Hermes/Preview.webp";
import hermesSummaryVideo from "../../portfolio/Hermes/Summary.webm";
import hermesSummaryVideoMobile from "../../portfolio/Hermes/Summary.mobile.webm";
import hermesSummaryPoster from "../../portfolio/Hermes/Summary.webp";
import hermesNavPreview from "../../portfolio/Hermes/Previews/Preview-Preview.webp";
import hermesNavSlide1 from "../../portfolio/Hermes/Previews/Slide-1-Preview.webp";
import hermesNavSlide2 from "../../portfolio/Hermes/Previews/Slide-2-Preview.webp";
import hermesNavSlide3 from "../../portfolio/Hermes/Previews/Slide-3-Preview.webp";
import hermesNavSlide4 from "../../portfolio/Hermes/Previews/Slide-4-Preview.webp";
import hermesNavSlide5 from "../../portfolio/Hermes/Previews/Slide-5-Preview.webp";
import hermesNavSlide6 from "../../portfolio/Hermes/Previews/Slide-6-Preview.webp";
import hermesNavSlide7 from "../../portfolio/Hermes/Previews/Slide-7-Preview.webp";
import hermesNavSlide8 from "../../portfolio/Hermes/Previews/Slide-8-Preview.webp";
import hermesNavSlide9 from "../../portfolio/Hermes/Previews/Slide-9-Preview.webp";
import hermesNavSlide10 from "../../portfolio/Hermes/Previews/Slide-10-Preview.webp";
import hermesNavSlide11 from "../../portfolio/Hermes/Previews/Slide-11-Preview.webp";
import hermesNavSlide12 from "../../portfolio/Hermes/Previews/Slide-12-Preview.webp";
import hermesSlide1 from "../../portfolio/Hermes/Slide-1.webm";
import hermesSlide1Mobile from "../../portfolio/Hermes/Slide-1.mobile.webm";
import hermesSlide1Poster from "../../portfolio/Hermes/Slide-1.webp";
import hermesSlide2P1 from "../../portfolio/Hermes/Slide-2/p1.webp";
import hermesSlide2P2 from "../../portfolio/Hermes/Slide-2/p2.webp";
import hermesSlide3 from "../../portfolio/Hermes/Slide-3.webp";
import hermesSlide4P1 from "../../portfolio/Hermes/Slide-4/p1.webm";
import hermesSlide4P1Mobile from "../../portfolio/Hermes/Slide-4/p1.mobile.webm";
import hermesSlide4P1Poster from "../../portfolio/Hermes/Slide-4/p1.webp";
import hermesSlide4P2 from "../../portfolio/Hermes/Slide-4/p2.webm";
import hermesSlide4P2Mobile from "../../portfolio/Hermes/Slide-4/p2.mobile.webm";
import hermesSlide4P2Poster from "../../portfolio/Hermes/Slide-4/p2.webp";
import hermesSlide5 from "../../portfolio/Hermes/Slide-5.webp";
import hermesSlide6 from "../../portfolio/Hermes/Slide-6.webp";
import hermesSlide7P1 from "../../portfolio/Hermes/Slide-7/p1.webp";
import hermesSlide7P2 from "../../portfolio/Hermes/Slide-7/p2.webp";
import hermesSlide8 from "../../portfolio/Hermes/Slide-8.webp";
import hermesSlide9P1 from "../../portfolio/Hermes/Slide-9/p1.webp";
import hermesSlide9P2 from "../../portfolio/Hermes/Slide-9/p2.webp";
import hermesSlide10 from "../../portfolio/Hermes/Slide-10.webp";
import hermesSlide11 from "../../portfolio/Hermes/Slide-11.webp";

export const hermesCase = {
  title: "Hermes Cloud - AI admin panel",
  subtitle:
    "It’s an AI agent with smart context, no need to create new chats, keep all in one place and chat with AI via web app, telegram or API",
  heroAlt: "Hermes Cloud AI admin panel on a laptop mockup",
  heroImage: hermesPreview,
  tags: ["SaaS", "App"],
  navigationItems: [
    { src: hermesNavPreview, href: "#case-hero", label: "Hero" },
    { src: hermesNavSlide1, href: "#case-hermes-usage-1", label: "Usage" },
    { src: hermesNavSlide2, href: "#case-usage-row-2", label: "Usage details" },
    { src: hermesNavSlide3, href: "#case-hermes-billing-1", label: "Billing" },
    { src: hermesNavSlide4, href: "#case-billing-row-2", label: "Billing details" },
    { src: hermesNavSlide5, href: "#case-hermes-settings-1", label: "Settings" },
    { src: hermesNavSlide6, href: "#case-hermes-agents-1", label: "Agents" },
    { src: hermesNavSlide7, href: "#case-agents-row-2", label: "Agents mobile" },
    { src: hermesNavSlide8, href: "#case-hermes-deploy-1", label: "Deploy flow" },
    { src: hermesNavSlide9, href: "#case-deploy-flow-row-2", label: "Deploy details" },
    { src: hermesNavSlide10, href: "#case-hermes-api-1", label: "API keys" },
    { src: hermesNavSlide11, href: "#case-hermes-tokens-1", label: "Tokens pricing" },
    { src: hermesNavSlide12, href: "#case-hermes-summary", label: "Summary" },
  ],
  overview: [
    [
      "[ GOAL ]",
      "To build useful admin panel to manage AI agents, but keep strong visual part. Branding is important.",
    ],
    [
      "[ SOLUTION ]",
      "Strongly structured solution with mind-maps and user tests with Hermes aesthetic.",
    ],
  ],
  sections: [
    {
      id: "case-usage",
      title: "Usage",
      description: "To see all the spends",
      mediaRows: [
        [
          {
            id: "case-hermes-usage-1",
            type: "video",
            src: hermesSlide1,
            srcMobile: hermesSlide1Mobile,
            poster: hermesSlide1Poster,
          },
        ],
        [
          { id: "case-hermes-usage-2a", src: hermesSlide2P1 },
          { id: "case-hermes-usage-2b", src: hermesSlide2P2 },
        ],
      ],
    },
    {
      id: "case-billing",
      title: "Billing",
      description: "To view balance and setup subscription",
      mediaRows: [
        [{ id: "case-hermes-billing-1", src: hermesSlide3 }],
        [
          {
            id: "case-hermes-billing-2a",
            type: "video",
            src: hermesSlide4P1,
            srcMobile: hermesSlide4P1Mobile,
            poster: hermesSlide4P1Poster,
          },
          {
            id: "case-hermes-billing-2b",
            type: "video",
            src: hermesSlide4P2,
            srcMobile: hermesSlide4P2Mobile,
            poster: hermesSlide4P2Poster,
          },
        ],
      ],
    },
    {
      id: "case-settings",
      title: "Settings",
      description: "To setup profile info",
      mediaRows: [[{ id: "case-hermes-settings-1", src: hermesSlide5 }]],
    },
    {
      id: "case-agents",
      title: "Agents",
      description: "To manage contexts",
      mediaRows: [
        [{ id: "case-hermes-agents-1", src: hermesSlide6 }],
        [
          { id: "case-hermes-agents-2a", src: hermesSlide7P1 },
          { id: "case-hermes-agents-2b", src: hermesSlide7P2 },
        ],
      ],
    },
    {
      id: "case-deploy-flow",
      title: "Deploy flow",
      description: "To deploy the agent",
      mediaRows: [
        [{ id: "case-hermes-deploy-1", src: hermesSlide8 }],
        [
          { id: "case-hermes-deploy-2a", src: hermesSlide9P1 },
          { id: "case-hermes-deploy-2b", src: hermesSlide9P2 },
        ],
      ],
    },
    {
      id: "case-api-keys",
      title: "API keys",
      description: "To manage access to the agents",
      mediaRows: [[{ id: "case-hermes-api-1", src: hermesSlide10 }]],
    },
    {
      id: "case-tokens-pricing",
      title: "Tokens pricing",
      description: "To make the pricing policy clear",
      mediaRows: [[{ id: "case-hermes-tokens-1", src: hermesSlide11 }]],
    },
  ],
  summary: {
    title: "Summary",
    description: "Nous Portal is published and became a part of Hermes ecosystem",
    stats: [
      ["98%", "More Hermes paid users after publishing"],
      ["35%", "Users started using multiple agents"],
      ["120K", "Sign-ups in first month"],
    ],
    imageId: "case-hermes-summary",
    navPreview: hermesNavSlide12,
    video: hermesSummaryVideo,
    videoMobile: hermesSummaryVideoMobile,
    poster: hermesSummaryPoster,
  },
};
