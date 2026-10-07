import assetsPreview from "../assets/blog/assets-and-styles/preview-example-of-the-style-description.webp";
import assetsStructure from "../assets/blog/assets-and-styles/example-of-asset-structure.webp";
import assetsStylesStructure from "../assets/blog/assets-and-styles/styles-structure.webp";
import assetsStylesExample from "../assets/blog/assets-and-styles/example-of-styles.webp";

import componentsPreview from "../assets/blog/components-and-documentation/preview.webp";
import componentsUnite from "../assets/blog/components-and-documentation/preview-unite-design-mindmap-and-dev-team-with-design-system-documentation.webp";
import componentsMindmap from "../assets/blog/components-and-documentation/example-of-component-mindmap.webp";
import componentsDocStructure from "../assets/blog/components-and-documentation/design-documentation-structure-example.webp";
import componentsDescription from "../assets/blog/components-and-documentation/example-of-component-description.webp";
import componentsSummary from "../assets/blog/components-and-documentation/summary.webp";

import funnelPreview from "../assets/blog/funnel/preview.webp";

import highLoadPreview from "../assets/blog/high-load/preview.webp";
import highLoadUnderstand from "../assets/blog/high-load/emphatize-and-define-stages-are-part-of-the-understand.webp";
import highLoadMentalModel from "../assets/blog/high-load/example-of-mental-model.webp";
import highLoadHowMightWe from "../assets/blog/high-load/how-might-we-example.webp";
import highLoadReverseBrainstorm from "../assets/blog/high-load/reverse-brainstorming-example.webp";
import highLoadScamper from "../assets/blog/high-load/scamper-framework-example.webp";
import highLoadRice from "../assets/blog/high-load/rice-example.webp";
import highLoadKano from "../assets/blog/high-load/kano-model-example.webp";
import highLoadImpactEffort from "../assets/blog/high-load/impact-vs-effort-matrix-example.webp";
import highLoadIa from "../assets/blog/high-load/information-architecture-example.webp";
import highLoadUseCases from "../assets/blog/high-load/use-cases-example.webp";
import highLoadMapFlow from "../assets/blog/high-load/map-flow-example.webp";
import highLoadSequence from "../assets/blog/high-load/sequence-example.webp";
import highLoadDesignSystem from "../assets/blog/high-load/design-system-elements-example.webp";
import highLoadPrototype from "../assets/blog/high-load/prototype-example.webp";
import highLoadAnalytics from "../assets/blog/high-load/popular-analytics-tools-google-analytics-hotjar-others.webp";
import highLoadDesignThinking from "../assets/blog/high-load/design-thinking-cycle-one-of-the-best-design-processes.webp";

import variablesPreview from "../assets/blog/variables/preview.webp";
import variablesHierarchy from "../assets/blog/variables/variables-in-the-design-system-hierarchy.webp";
import variablesStructure from "../assets/blog/variables/structure-of-variables.webp";
import variablesBrandUi from "../assets/blog/variables/link-between-brand-colors-and-ui-colors.webp";
import variablesTokenModes from "../assets/blog/variables/example-of-token-modes.webp";
import variablesLineWeight from "../assets/blog/variables/example-of-line-weight.webp";
import variablesSpacing from "../assets/blog/variables/example-of-component-spacing.webp";
import variablesGapModes from "../assets/blog/variables/desktop-and-mobile-modes-for-gap-300-spacing-token.webp";
import variablesText from "../assets/blog/variables/example-of-text-styles.webp";
import variablesRadius from "../assets/blog/variables/corner-radius-token-example.webp";
import variablesAnimation from "../assets/blog/variables/example-of-animation-description.webp";

export const blogMedia = {
  components: {
    preview: componentsPreview,
    unite: componentsUnite,
    mindmap: componentsMindmap,
    docStructure: componentsDocStructure,
    description: componentsDescription,
    summary: componentsSummary,
  },
  assets: {
    preview: assetsPreview,
    assetStructure: assetsStructure,
    stylesStructure: assetsStylesStructure,
    stylesExample: assetsStylesExample,
  },
  variables: {
    preview: variablesPreview,
    hierarchy: variablesHierarchy,
    structure: variablesStructure,
    brandUi: variablesBrandUi,
    tokenModes: variablesTokenModes,
    lineWeight: variablesLineWeight,
    spacing: variablesSpacing,
    gapModes: variablesGapModes,
    text: variablesText,
    radius: variablesRadius,
    animation: variablesAnimation,
  },
  funnel: {
    preview: funnelPreview,
  },
  highLoad: {
    preview: highLoadPreview,
    understand: highLoadUnderstand,
    mentalModel: highLoadMentalModel,
    howMightWe: highLoadHowMightWe,
    reverseBrainstorm: highLoadReverseBrainstorm,
    scamper: highLoadScamper,
    rice: highLoadRice,
    kano: highLoadKano,
    impactEffort: highLoadImpactEffort,
    ia: highLoadIa,
    useCases: highLoadUseCases,
    mapFlow: highLoadMapFlow,
    sequence: highLoadSequence,
    designSystem: highLoadDesignSystem,
    prototype: highLoadPrototype,
    analytics: highLoadAnalytics,
    designThinking: highLoadDesignThinking,
  },
};

export const blogCovers = {
  "design-system-best-practices-components-and-documentation": blogMedia.components.preview,
  "design-system-best-practices-assets-and-styles": blogMedia.assets.preview,
  "design-system-best-practices-variables": blogMedia.variables.preview,
  "how-to-optimize-conversion-in-your-funnels": blogMedia.funnel.preview,
  "how-to-design-complex-professional-software-highload-interface": blogMedia.highLoad.preview,
  // Original site had no dedicated heuristic cover folder; use a distinct article visual.
  "how-to-do-the-heuristic-evaluation-ux-audit": blogMedia.highLoad.mentalModel,
};
