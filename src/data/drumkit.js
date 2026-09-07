import drumkitPreview from "../../portfolio/Drumkit-UI/lottie/Preview.jpg";
import drumkitNavPreview from "../../portfolio/Drumkit-UI/lottie/Previews/Preview-Preview.jpg";
import drumkitNavSlide1 from "../../portfolio/Drumkit-UI/lottie/Previews/Slide-1-Preview.jpg";
import drumkitNavSlide2 from "../../portfolio/Drumkit-UI/lottie/Previews/Slide-2-Preview.jpg";
import drumkitNavSlide3 from "../../portfolio/Drumkit-UI/lottie/Previews/Slide-3-Preview.jpg";
import drumkitNavSlide4 from "../../portfolio/Drumkit-UI/lottie/Previews/Slide-4-Preview.jpg";
import drumkitNavSlide5 from "../../portfolio/Drumkit-UI/lottie/Previews/Slide-5-Preview.jpg";
import drumkitNavSlide6 from "../../portfolio/Drumkit-UI/lottie/Previews/Slide-6-Preview.jpg";
import drumkitNavSlide7 from "../../portfolio/Drumkit-UI/lottie/Previews/Slide-7-Preview.jpg";
import drumkitNavSlide8 from "../../portfolio/Drumkit-UI/lottie/Previews/Slide-8-Preview.jpg";
import drumkitNavSlide9 from "../../portfolio/Drumkit-UI/lottie/Previews/Slide-9-Preview.jpg";
import drumkitSlide2 from "../../portfolio/Drumkit-UI/lottie/Slide-2.jpg";
import drumkitSlide3P1 from "../../portfolio/Drumkit-UI/lottie/Slide-3/p1.jpg";
import drumkitSlide3P2 from "../../portfolio/Drumkit-UI/lottie/Slide-3/p2.jpg";
import drumkitSlide5Background from "../../portfolio/Drumkit-UI/lottie/Slide-5/Background.jpg";
import drumkitSlide5Carrier from "../../portfolio/Drumkit-UI/lottie/Slide-5/Content/Carrier.svg";
import drumkitSlide5Quote from "../../portfolio/Drumkit-UI/lottie/Slide-5/Content/Quote.svg";
import drumkitSlide5Loan from "../../portfolio/Drumkit-UI/lottie/Slide-5/Content/Loan.svg";
import drumkitSlide5Track from "../../portfolio/Drumkit-UI/lottie/Slide-5/Content/Track.svg";
import drumkitSlide5Autoreplies from "../../portfolio/Drumkit-UI/lottie/Slide-5/Content/Autoreplies.svg";
import drumkitSlide5Quote1 from "../../portfolio/Drumkit-UI/lottie/Slide-5/Content/Quote-1.svg";
import drumkitSlide5Autoreplies3 from "../../portfolio/Drumkit-UI/lottie/Slide-5/Content/Autoreplies-3.svg";
import drumkitSlide5Quote3 from "../../portfolio/Drumkit-UI/lottie/Slide-5/Content/Quote-3.svg";

export const drumkitFavicon = "https://www.google.com/s2/favicons?domain=drumkit.ai&sz=32";

export { drumkitPreview, drumkitSlide2, drumkitSlide3P1, drumkitSlide3P2, drumkitSlide5Background };

export const drumkitSlide4Animations = [
  {
    label: "Quick Quote",
    load: () => import("../../portfolio/Drumkit-UI/lottie/Slide-4-Quick-Quote.json"),
  },
  {
    label: "Integrated Sidebar",
    load: () => import("../../portfolio/Drumkit-UI/lottie/Slide-4-Integrated-Sidebar.json"),
  },
  {
    label: "Load building",
    load: () => import("../../portfolio/Drumkit-UI/lottie/Slide-4-Load-building.json"),
  },
  {
    label: "Smart Autoreplies",
    load: () => import("../../portfolio/Drumkit-UI/lottie/Slide-4-Smart-Autoreplies.json"),
  },
];

export const drumkitSlide9Animations = [
  {
    label: "Appointment",
    load: () => import("../../portfolio/Drumkit-UI/lottie/Slide-9-Appointment.json"),
  },
  {
    label: "Digital Freight Matching",
    load: () => import("../../portfolio/Drumkit-UI/lottie/Slide-9-Digital-Freight-Matching.json"),
  },
  {
    label: "Smart Autoreplies",
    load: () => import("../../portfolio/Drumkit-UI/lottie/Slide-9-Smart-Autoreplies.json"),
  },
  {
    label: "Track and Trace",
    load: () => import("../../portfolio/Drumkit-UI/lottie/Slide-9-Track-and-Trace.json"),
  },
];

export const loadDrumkitSlide6 = () => import("../../portfolio/Drumkit-UI/lottie/Slide-6-Automate-data-entry.json");
export const loadDrumkitSlide7 = () => import("../../portfolio/Drumkit-UI/lottie/Slide-7-Simplify-SOPs.json");
export const loadDrumkitSlide8 = () => import("../../portfolio/Drumkit-UI/lottie/Slide-8-Analyze-metrics.json");

export const drumkitSlide5Cards = [
  drumkitSlide5Carrier,
  drumkitSlide5Quote,
  drumkitSlide5Loan,
  drumkitSlide5Track,
  drumkitSlide5Autoreplies,
  drumkitSlide5Quote1,
  drumkitSlide5Autoreplies3,
  drumkitSlide5Quote3,
];

export const drumkitNavigationItems = [
  { src: drumkitNavPreview, href: "#case-hero", label: "Hero" },
  { src: drumkitNavSlide1, href: "#case-landing-motion", label: "Landing animation" },
  { src: drumkitNavSlide2, href: "#case-landing-process", label: "Landing process" },
  { src: drumkitNavSlide3, href: "#case-feature-row", label: "Main features and integrations" },
  { src: drumkitNavSlide4, href: "#case-product-motion", label: "Feature animations" },
  { src: drumkitNavSlide5, href: "#case-sidebar-preview", label: "Sidebar" },
  { src: drumkitNavSlide6, href: "#case-feature-load-mail", label: "Load and mail integration" },
  { src: drumkitNavSlide7, href: "#case-feature-sops", label: "Simplify SOPs" },
  { src: drumkitNavSlide8, href: "#case-feature-dashboard", label: "Management dashboard" },
  { src: drumkitNavSlide9, href: "#case-summary-preview", label: "Summary" },
];
