import mobileAds, { AdsConsent } from "react-native-google-mobile-ads";

export const initializeAds = async (): Promise<void> => {
  try {
    await mobileAds().initialize();
    console.log("AdMob SDK Initialized");
  } catch (error) {
    console.warn("AdMob SDK initialization failed:", error);
    return;
  }

  try {
    await AdsConsent.requestInfoUpdate();
    await AdsConsent.loadAndShowConsentFormIfRequired();
  } catch (error) {
    // Consent errors should never block app startup.
    console.warn("Ad consent flow failed:", error);
  }
};
