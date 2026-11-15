// Slides 1.8 and 1.9 of the case: social posts and stories of One Gallon. Positive, short, some with people.
// Photographs are stock pictures from Unsplash (assets/photos/SOURCES.md) under the brand's haze.
// Needs icons.js, brand.js (logo, photo, flow, caustics, grain) and app.js (phone) loaded first.

// A square post is drawn at 1080 x 1080, a story at 1080 x 1920; both are scaled to their place on the slide.
const post = (inner, cls = "") => `<div class="post-box"><div class="post ${cls}">${inner}</div></div>`;
const story = (inner, cls = "") => `<div class="story-box"><div class="story ${cls}">${inner}</div></div>`;
const corner = logo(1.05, "position:absolute;left:64px;top:64px");
const pill = (name, text, cls = "") => `<b class="pill ${cls}">${icon(name, 44)}${text}</b>`;

const SOCIAL_SLIDES = {
  // 1.8 — six posts: people in the top row; numbers, words and the app in the bottom row.
  "1.8": () => `<div class="posts grid">
    ${post(`${photo("smile-shaker", "50% 20%")}${grain(0.25)}${corner}<p class="line">Good job!</p>${pill("check", "128 / 128 oz", "dark")}`, "light-logo")}
    ${post(`${photo("two-sky", "50% 40%")}${grain(0.25)}${corner}<p class="line">Better<br />together.</p>${pill("flame", "5 day streak")}`)}
    ${post(`${photo("smile-steps", "50% 30%")}${grain(0.25)}${corner}<p class="line">Sip. Snap.<br />Done.</p>${pill("scan-line", "10 oz added")}`)}
    ${post(`${caustics({ surface: "azure", ripple: 0.45 }, "bg", 540, 540)}${grain(0.2)}${corner}<p class="fig">128<i>oz</i></p><p class="small">One Gallon. Every day.</p>`)}
    ${post(`${flow({ set: "lilac", seed: 9, count: 4 }, "bg", 400, 400)}${grain()}${corner}<p class="line top">Your glass<br />is the<br />button.</p><p class="small">Photograph it. It’s logged.</p>`)}
    ${post(`${flow({ set: "deep", seed: 6, count: 2, width: 0.26 }, "bg", 400, 400)}${grain()}${corner}${phone("added", 1.5, "position:absolute;left:223px;top:-420px")}`, "white")}
  </div>`,
  // 1.9 — stories.
  "1.9": () => `<div class="posts">
    ${story(`${photo("smile-court", "50% 30%")}${grain(0.25)}${corner}<p class="line">Day five.<br />Still pouring.</p>${pill("flame", "5 day streak", "dark")}`)}
    ${story(`${caustics({ surface: "sky", ripple: 0.5, warmth: 0.7 }, "bg", 405, 720)}${grain(0.2)}${corner}<p class="when">3:00 PM</p><p class="line mid">Halfway<br />there.</p><p class="fig">64<i>oz</i></p>`)}
    ${story(`${photo("glass-smile", "50% 30%")}${grain(0.25)}${corner}<p class="line">First glass<br />of the day.</p>${pill("check", "10 oz added")}`)}
  </div>`,
};
