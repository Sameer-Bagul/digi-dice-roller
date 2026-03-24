export const initializeAds = async (): Promise<void> => {
  // No-op on web to avoid native AdMob dependency issues
  console.log("AdMob initialization skipped on web");
};
