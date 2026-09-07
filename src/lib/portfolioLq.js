import { registerLqMap } from "../components/media/ProgressiveImage.jsx";

const portfolioRasterImages = import.meta.glob("../../portfolio/**/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
});

const lqByFullUrl = new Map();

for (const [path, url] of Object.entries(portfolioRasterImages)) {
  if (/\.lq\.(jpe?g|png)$/i.test(path)) {
    continue;
  }

  const lqPath = path.replace(/\.(jpe?g|png)$/i, ".lq.jpg");
  const lqUrl = portfolioRasterImages[lqPath];

  if (lqUrl) {
    lqByFullUrl.set(url, lqUrl);
  }
}

registerLqMap(lqByFullUrl);
