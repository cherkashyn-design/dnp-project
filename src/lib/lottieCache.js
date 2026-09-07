const lottieDataCache = new Map();

export function loadLottieCached(loadAnimation) {
  if (!loadAnimation) {
    return Promise.reject(new Error("Missing Lottie loader"));
  }

  if (lottieDataCache.has(loadAnimation)) {
    return lottieDataCache.get(loadAnimation);
  }

  const pending = loadAnimation()
    .then((module) => module.default ?? module)
    .then((data) => {
      lottieDataCache.set(loadAnimation, Promise.resolve(data));
      return data;
    })
    .catch((error) => {
      lottieDataCache.delete(loadAnimation);
      throw error;
    });

  lottieDataCache.set(loadAnimation, pending);
  return pending;
}
