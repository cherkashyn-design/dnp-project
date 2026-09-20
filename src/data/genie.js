import geniePreview from "../../portfolio/Genie/Preview.webp";
import genieNavPreview from "../../portfolio/Genie/Previews/Preview-Preview.webp";
import genieNavSlide1 from "../../portfolio/Genie/Previews/Slide-1-Preview.webp";
import genieNavSlide2 from "../../portfolio/Genie/Previews/Slide-2-Preview.webp";
import genieNavSlide3 from "../../portfolio/Genie/Previews/Slide-3-Preview.webp";
import genieNavSlide4 from "../../portfolio/Genie/Previews/Slide-4-Preview.webp";
import genieNavSlide5 from "../../portfolio/Genie/Previews/Slide-5-Preview.webp";
import genieNavSlide6 from "../../portfolio/Genie/Previews/Slide-6-Preview.webp";
import genieNavSlide7 from "../../portfolio/Genie/Previews/Slide-7-Preview.webp";
import genieNavSlide8 from "../../portfolio/Genie/Previews/Slide-8-Preview.webp";
import genieNavSlide9 from "../../portfolio/Genie/Previews/Slide-9-Preview.webp";
import genieSummaryVideo from "../../portfolio/Genie/Summary.webm";
import genieSlide1P1 from "../../portfolio/Genie/Slide-1/p1.webm";
import genieSlide1P1Poster from "../../portfolio/Genie/Slide-1/p1.webp";
import genieSlide1P2 from "../../portfolio/Genie/Slide-1/p2.webp";
import genieSlide2 from "../../portfolio/Genie/Slide-2.webp";
import genieSlide3P1 from "../../portfolio/Genie/Slide-3/p1.webp";
import genieSlide3P2 from "../../portfolio/Genie/Slide-3/p2.webp";
import genieSlide4 from "../../portfolio/Genie/Slide-4.webp";
import genieSlide5P1 from "../../portfolio/Genie/Slide-5/p1.webp";
import genieSlide5P2 from "../../portfolio/Genie/Slide-5/p2.webm";
import genieSlide5P2Poster from "../../portfolio/Genie/Slide-5/p2.webp";
import genieSlide6 from "../../portfolio/Genie/Slide-6.webm";
import genieSlide6Poster from "../../portfolio/Genie/Slide-6.webp";
import genieSlide7P1 from "../../portfolio/Genie/Slide-7/p1.webp";
import genieSlide7P2 from "../../portfolio/Genie/Slide-7/p2.webp";
import genieProfile from "../../portfolio/Genie/Slide-8/Profile.webp";
import genieWishPoints from "../../portfolio/Genie/Slide-8/Wish-Points.webp";
import genieInvites from "../../portfolio/Genie/Slide-8/Invites.webp";
import genieBillings from "../../portfolio/Genie/Slide-8/Billings.webp";
import genieSecurity from "../../portfolio/Genie/Slide-8/Security.webp";
import genieApiSettings from "../../portfolio/Genie/Slide-8/API-Settings.webp";

export const genieCase = {
  title: "Genie node based AI editor",
  subtitle: "A US startup giving full control over AI models with a node system",
  heroAlt: "Genie node based AI editor on a laptop mockup",
  heroImage: geniePreview,
  tags: ["SaaS", "App"],
  // Nav thumbs: Preview + Slide-1…9 in numeric order.
  navigationItems: [
    { src: genieNavPreview, href: "#case-hero", label: "Hero" },
    { src: genieNavSlide1, href: "#case-nodes-row-1", label: "Nodes basics" },
    { src: genieNavSlide2, href: "#case-genie-nodes-2", label: "Nodes workflows" },
    { src: genieNavSlide3, href: "#case-genie-ai-row-1", label: "Genie AI refs" },
    { src: genieNavSlide4, href: "#case-genie-ai-2", label: "Genie AI options" },
    { src: genieNavSlide5, href: "#case-community-row-1", label: "Community catalogue" },
    { src: genieNavSlide6, href: "#case-genie-community-2", label: "Community publish" },
    { src: genieNavSlide7, href: "#case-file-manager-row-1", label: "File manager" },
    { src: genieNavSlide8, href: "#case-profile", label: "Profile" },
    { src: genieNavSlide9, href: "#case-genie-summary", label: "Summary" },
  ],
  overview: [
    ["[ GOAL ]", "To build a better version of ComfyUI"],
    [
      "[ SOLUTION ]",
      "1. Make a web platform where you share files instantly, edit with your teammates, and skip downloading large models.\n2. Open community content in one click, with no manual download or setup. We share revenue with authors to keep them motivated.\n3. An AI agent helps build workflows instead of doing everything by hand, so the system stays simple but fully customizable.",
    ],
  ],
  sections: [
    {
      id: "case-nodes",
      title: "Nodes",
      description: "The core of the product is fully editable, detailed model settings.",
      kicker: "Use basic nodes to generate content",
      mediaRows: [
        [
          {
            id: "case-genie-nodes-1a",
            type: "video",
            src: genieSlide1P1,
            poster: genieSlide1P1Poster,
            caption: "Just enter a prompt and get a result",
          },
          {
            id: "case-genie-nodes-1b",
            src: genieSlide1P2,
            caption: "Use the side panel for detailed settings",
          },
        ],
        [
          {
            id: "case-genie-nodes-2",
            src: genieSlide2,
            caption: "Connect nodes to each other to create workflows",
          },
        ],
      ],
    },
    {
      id: "case-genie-ai",
      title: "Genie AI",
      description: "Use an agent to generate complex workflows with a few simple words",
      mediaRows: [
        [
          {
            id: "case-genie-ai-1a",
            src: genieSlide3P1,
            caption: "Add your references",
          },
          {
            id: "case-genie-ai-1b",
            src: genieSlide3P2,
            caption: "Specify your needs",
          },
        ],
        [
          {
            id: "case-genie-ai-2",
            src: genieSlide4,
            caption: "Pick an option",
          },
        ],
      ],
    },
    {
      id: "case-community",
      title: "Community",
      description: "Reuse community workflows instead of building everything from scratch",
      mediaRows: [
        [
          {
            id: "case-genie-community-1a",
            src: genieSlide5P1,
            caption: "Search the catalogue",
          },
          {
            id: "case-genie-community-1b",
            type: "video",
            src: genieSlide5P2,
            poster: genieSlide5P2Poster,
            caption: "View details",
          },
        ],
        [
          {
            id: "case-genie-community-2",
            type: "video",
            src: genieSlide6,
            poster: genieSlide6Poster,
            caption: "Publish your own workflows and earn",
          },
        ],
      ],
    },
    {
      id: "case-file-manager",
      title: "File manager",
      description: "Keep canvases, projects, and assets organized in one place",
      mediaRows: [
        [
          {
            id: "case-genie-files-1a",
            src: genieSlide7P1,
            caption: "Create and manage canvases and projects",
          },
          {
            id: "case-genie-files-1b",
            src: genieSlide7P2,
            caption: "Manage files inside canvases",
          },
        ],
      ],
    },
    {
      id: "case-profile",
      title: "Profile",
      description: "Manage your public presence, billing, and account settings",
      tabs: [
        {
          id: "case-genie-profile-public",
          label: "Public Profile",
          src: genieProfile,
          caption: "Manage your public information",
        },
        {
          id: "case-genie-profile-wish",
          label: "Wish Points",
          src: genieWishPoints,
          caption: "Track and spend Wish Points",
        },
        {
          id: "case-genie-profile-invites",
          label: "Invites",
          src: genieInvites,
          caption: "Invite people and grow the community",
        },
        {
          id: "case-genie-profile-billings",
          label: "Billings",
          src: genieBillings,
          caption: "Manage billing and subscriptions",
        },
        {
          id: "case-genie-profile-security",
          label: "Security",
          src: genieSecurity,
          caption: "Secure your account",
        },
        {
          id: "case-genie-profile-api",
          label: "API Settings",
          src: genieApiSettings,
          caption: "Configure API keys and access",
        },
      ],
    },
  ],
  summary: {
    title: "Summary",
    description:
      "We tested the technology and user flows. The product was sold to ComfyUI and is now being adapted as ComfyUI Cloud.",
    stats: [
      ["80%", "Success building workflows from nodes"],
      ["92%", "Success training a LoRA"],
      ["40K", "Waitlist sign ups"],
    ],
    imageId: "case-genie-summary",
    navPreview: genieNavSlide9,
    video: genieSummaryVideo,
    poster: geniePreview,
  },
};
