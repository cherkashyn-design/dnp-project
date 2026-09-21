import comfyPreview from "../../portfolio/ComfyUI/Preview.webp";
import comfySummaryVideo from "../../portfolio/ComfyUI/Summary.webm";
import comfySummaryPoster from "../../portfolio/ComfyUI/Summary.webp";
import comfyNavPreview from "../../portfolio/ComfyUI/Previews/Preview-Preview.webp";
import comfyNavSlide1 from "../../portfolio/ComfyUI/Previews/Slide-1-Preview.webp";
import comfyNavSlide2 from "../../portfolio/ComfyUI/Previews/Slide-2-Preview.webp";
import comfyNavSlide3 from "../../portfolio/ComfyUI/Previews/Slide-3-Preview.webp";
import comfyNavSlide4 from "../../portfolio/ComfyUI/Previews/Slide-4-Preview.webp";
import comfyNavSlide5 from "../../portfolio/ComfyUI/Previews/Slide-5-Preview.webp";
import comfyNavSlide6 from "../../portfolio/ComfyUI/Previews/Slide-6-Preview.webp";
import comfyNavSlide7 from "../../portfolio/ComfyUI/Previews/Slide-7-Preview.webp";
import comfySlide1P1 from "../../portfolio/ComfyUI/Slide-1/p1.webm";
import comfySlide1P1Poster from "../../portfolio/ComfyUI/Slide-1/p1.webp";
import comfySlide1P2 from "../../portfolio/ComfyUI/Slide-1/p2.webp";
import comfySlide2 from "../../portfolio/ComfyUI/Slide-2.webp";
import comfySlide3 from "../../portfolio/ComfyUI/Slide-3.webm";
import comfySlide3Poster from "../../portfolio/ComfyUI/Slide-3.webp";
import comfySlide4P1 from "../../portfolio/ComfyUI/Slide-4/p1.webp";
import comfySlide4P2 from "../../portfolio/ComfyUI/Slide-4/p2.webp";
import comfySlide5 from "../../portfolio/ComfyUI/Slide-5.webp";
import comfySlide6P1 from "../../portfolio/ComfyUI/Slide-6/p1.webm";
import comfySlide6P1Poster from "../../portfolio/ComfyUI/Slide-6/p1.webp";
import comfySlide6P2 from "../../portfolio/ComfyUI/Slide-6/p2.webp";

export const comfyuiCase = {
  title: "ComfyUI - pro AI tool",
  subtitle:
    "It’s most popular node system which helps to make fully customizable workflows",
  heroAlt: "ComfyUI pro AI tool on a desktop monitor mockup",
  heroImage: comfyPreview,
  tags: ["SaaS", "App"],
  navigationItems: [
    { src: comfyNavPreview, href: "#case-hero", label: "Hero" },
    { src: comfyNavSlide1, href: "#case-workflows-row-1", label: "Workflows" },
    { src: comfyNavSlide2, href: "#case-comfy-workflows-2", label: "Workflow canvas" },
    { src: comfyNavSlide3, href: "#case-comfy-started-1", label: "Get started" },
    { src: comfyNavSlide4, href: "#case-get-started-row-2", label: "Get started details" },
    { src: comfyNavSlide5, href: "#case-comfy-assets-1", label: "Team assets" },
    { src: comfyNavSlide6, href: "#case-team-assets-row-2", label: "Assets details" },
    { src: comfyNavSlide7, href: "#case-comfy-summary", label: "Summary" },
  ],
  overview: [
    ["[ GOAL ]", "To simplify ComfyUI and make it usable for cross-teams."],
    [
      "[ SOLUTION ]",
      "Make a cloud version of ComfyUI with possibility to share files and use already made workflows with a simple chat for a marketing teams.",
    ],
  ],
  sections: [
    {
      id: "case-workflows",
      title: "Use workflows easily",
      description: "AI artists develop, marketing team use.",
      mediaRows: [
        [
          {
            id: "case-comfy-workflows-1a",
            type: "video",
            src: comfySlide1P1,
            poster: comfySlide1P1Poster,
          },
          { id: "case-comfy-workflows-1b", src: comfySlide1P2 },
        ],
        [{ id: "case-comfy-workflows-2", src: comfySlide2 }],
      ],
    },
    {
      id: "case-get-started",
      title: "Get started in Comfy",
      description:
        "No need to keep your files locally, no need to remember file structure. Whole ComfyUI management in one place.",
      mediaRows: [
        [
          {
            id: "case-comfy-started-1",
            type: "video",
            src: comfySlide3,
            poster: comfySlide3Poster,
          },
        ],
        [
          { id: "case-comfy-started-2a", src: comfySlide4P1 },
          { id: "case-comfy-started-2b", src: comfySlide4P2 },
        ],
      ],
    },
    {
      id: "case-team-assets",
      title: "Manage your team assets in one place",
      description: "Workflows, files and templates saved in cloud help teams to keep synced.",
      mediaRows: [
        [{ id: "case-comfy-assets-1", src: comfySlide5 }],
        [
          {
            id: "case-comfy-assets-2a",
            type: "video",
            src: comfySlide6P1,
            poster: comfySlide6P1Poster,
          },
          { id: "case-comfy-assets-2b", src: comfySlide6P2 },
        ],
      ],
    },
  ],
  summary: {
    title: "Summary",
    description: "Nous Portal is published and became a part of Hermes ecosystem.",
    stats: [
      ["98%", "More Hermes paid users after publishing"],
      ["35%", "Users started using multiple agents"],
      ["120K", "Sign-ups in first month"],
    ],
    imageId: "case-comfy-summary",
    navPreview: comfyNavSlide7,
    video: comfySummaryVideo,
    poster: comfySummaryPoster,
  },
};
