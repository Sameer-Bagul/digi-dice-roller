import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const AD_UNIT_ID = __DEV__ ? TestIds.BANNER : (process.env.EXPO_PUBLIC_AD_UNIT_ID_BANNER || '');

interface AdBannerProps {
  onLoad?: () => void;
  onError?: (error: any) => void;
  visible?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ onLoad, onError, visible = true }) => {
  if (!visible || !AD_UNIT_ID) return null;

  return (
    <View style={styles.adContainer}>
      <BannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={onLoad}
        onAdFailedToLoad={onError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});
