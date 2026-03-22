import mobileAds, { AdsConsent } from 'react-native-google-mobile-ads';

export const initializeAds = () => {
    // 1. Initialize AdMob
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('AdMob SDK Initialized');
      });

    // 2. Request Tracking Consent (iOS Compliance)
    AdsConsent.requestInfoUpdate().then(() => {
      AdsConsent.loadAndShowConsentFormIfRequired();
    });
};
