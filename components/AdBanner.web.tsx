import React from 'react';

interface AdBannerProps {
  onLoad?: () => void;
  onError?: (error: any) => void;
  visible?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = () => {
  // Return null on web to avoid native AdMob dependency issues
  return null;
};
