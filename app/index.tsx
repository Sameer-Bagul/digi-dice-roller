import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Modal, Linking, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '@/hooks/useGame';
import { useColorScheme } from '@/hooks/use-color-scheme';
import DiceBoard from '@/components/DiceBoard';
import { ThemedText } from '@/components/themed-text';
import Constants from 'expo-constants';
import { Colors } from '@/constants/theme';
import { PaperBackground } from '@/components/PaperBackground';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const PLAYER_COLORS = ['#FF5252', '#448AFF', '#4CAF50', '#FFD740'];
const AD_UNIT_ID = __DEV__ ? TestIds.BANNER : (process.env.EXPO_PUBLIC_AD_UNIT_ID_BANNER || '');

export default function DiceScreen() {
  const { results, isRolling, rollDice, players, currentPlayerIndex, diceCount, setDiceCount, addPlayer, removePlayer } = useGame();
  const colorScheme = useColorScheme() ?? 'light';
  const [showDropdown, setShowDropdown] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [namingSlot, setNamingSlot ] = useState<number | null>(null); // For naming modal
  const [tempName, setTempName] = useState('');
  const [adVisible, setAdVisible] = useState(true); // Control ad container visibility

  const renderPlayer = (index: number, positionStyle: any) => {
    const player = players[index];
    const isActive = currentPlayerIndex === index;
    const color = PLAYER_COLORS[index];
    const isOpposite = index < 2; // Players sitting on other side

    return (
      <View style={[styles.playerWrapper, positionStyle, isOpposite && { transform: [{ rotate: '180deg' }] }]}>
        <View style={[
          styles.playerBadge, 
          { backgroundColor: player ? color : 'rgba(0,0,0,0.05)', borderColor: 'rgba(255,255,255,0.2)' },
          isActive && { shadowColor: color, elevation: 20, shadowOpacity: 0.6, shadowRadius: 15 },
        ]}>
          {player && (
            <View style={styles.glossHighlight} />
          )}
          {player ? (
            <View style={styles.playerInfo}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color="#fff" />
              </View>
              <ThemedText style={styles.playerName}>{player}</ThemedText>
              
              <Pressable 
                onPress={() => removePlayer(index)}
                style={styles.removePlayerButton}
              >
                <Ionicons name="close-circle-sharp" size={24} color="rgba(255,255,255,0.6)" />
              </Pressable>
            </View>
          ) : (
            <Pressable 
              onPress={() => {
                setNamingSlot(index);
                setTempName(`Player ${index + 1}`);
              }} 
              style={styles.addPlayerButton}
            >
              <Ionicons name="add-circle" size={40} color={color} />
            </Pressable>
          )}
        </View>

        {/* Floating Roll Button - NOW VISIBLE OUTSIDE CLIPPED AREA */}
        {player && isActive && !isRolling && (
          <Pressable
            onPress={rollDice}
            style={({ pressed }) => [
              styles.playerRollButton,
              pressed && { opacity: 0.8 }
            ]}
          >
            <ThemedText style={styles.playerRollText}>ROLL</ThemedText>
          </Pressable>
        )}
        {player && isActive && isRolling && (
          <View style={styles.playerRollingBadge}>
            <ThemedText style={styles.playerRollingText}>...</ThemedText>
          </View>
        )}
      </View>
    );
  };

  return (
    <PaperBackground>
      {/* Immersive 3D Canvas Background */}
      <View style={StyleSheet.absoluteFill}>
        <DiceBoard results={results} isRolling={isRolling} />
      </View>

      <View style={styles.container}>
        {/* 4 Corners for Players - TOUCHING THE CORNER */}
        {renderPlayer(0, styles.topLeft)}
        {renderPlayer(1, styles.topRight)}
        {renderPlayer(2, styles.bottomLeft)}
        {renderPlayer(3, styles.bottomRight)}

        {/* Center Container is now just a pass-through since dice are in the background */}
        <View style={styles.centerContainer} pointerEvents="none" />

        {/* Minimalist Bottom Control Bar */}
        <View style={styles.bottomControlBar}>
          <View style={styles.topBarLeft} />
          
          <View style={styles.topBarCenter}>
            <Pressable 
              onPress={() => setShowDropdown(!showDropdown)}
              style={styles.dropdownHeader}
            >
              <ThemedText style={styles.dropdownHeaderText}>DICE: {diceCount}</ThemedText>
              <Ionicons name={showDropdown ? "chevron-down" : "chevron-up"} size={16} color="black" />
            </Pressable>
          </View>

          <View style={styles.topBarRight}>
            <Pressable 
              onPress={() => setIsInfoVisible(true)}
              style={styles.headerInfoButton}
            >
              <Ionicons name="information-circle-outline" size={28} color="rgba(0,0,0,0.4)" />
            </Pressable>
          </View>
          
          {showDropdown && (
            <View style={styles.dropdownList}>
              {[1, 2, 3, 4].map((count) => (
                <Pressable
                  key={count}
                  onPress={() => {
                    setDiceCount(count);
                    setShowDropdown(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <ThemedText style={[styles.dropdownItemText, diceCount === count && { fontWeight: 'bold' }]}>
                    {count} {count === 1 ? 'DIE' : 'DICE'}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Center Container is now just a pass-through since dice are in the background */}
        <View style={styles.centerContainer} pointerEvents="none" />

        {/* Live Banner Ad */}
        {adVisible && (
          <View style={styles.adContainer}>
            <BannerAd
              unitId={AD_UNIT_ID}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
              onAdFailedToLoad={(error) => {
                console.error('Ad failed to load: ', error);
                setAdVisible(false);
              }}
            />
          </View>
        )}

        {/* Info Modal */}
        <Modal
        visible={isInfoVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsInfoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Digi Dice Roller</ThemedText>
              <Pressable onPress={() => setIsInfoVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            
            <View style={styles.modalBody}>
              <ThemedText style={styles.aboutText}>
                A premium, immersive 3D dice rolling experience for your tabletop games. 
                Designed for speed, fairness, and a high-fidelity feel.
              </ThemedText>
              
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Ionicons name="cube-outline" size={20} color="#666" />
                  <ThemedText style={styles.featureText}>Realistic 3D Physics</ThemedText>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="people-outline" size={20} color="#666" />
                  <ThemedText style={styles.featureText}>Up to 4 Players Local Play</ThemedText>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="options-outline" size={20} color="#666" />
                  <ThemedText style={styles.featureText}>Customizable Dice Count</ThemedText>
                </View>
              </View>

              <Pressable 
                onPress={() => Linking.openURL('https://example.com/privacy-policy')}
                style={styles.policyButton}
              >
                <Ionicons name="shield-checkmark-outline" size={18} color="#007AFF" />
                <ThemedText style={styles.policyButtonText}>Privacy Policy</ThemedText>
              </Pressable>
            </View>

            <ThemedText style={styles.versionText}>Version {Constants.expoConfig?.version || '1.0.0'}</ThemedText>
          </View>
        </View>
      </Modal>

      {/* Naming Modal */}
      <Modal
        visible={namingSlot !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setNamingSlot(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Enter Name</ThemedText>
            <TextInput
              style={styles.nameInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Player Name"
              maxLength={12}
              autoFocus
            />
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                if (namingSlot !== null) {
                  addPlayer(namingSlot, tempName.trim() || `Player ${namingSlot + 1}`);
                  setNamingSlot(null);
                }
              }}
            >
              <ThemedText style={styles.modalButtonText}>JOIN GAME</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80, // Space for dropdown header
  },
  bottomControlBar: {
    position: 'absolute',
    bottom: 40, // Above ad
    left: 0,
    right: 0,
    height: 70,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fffef0', 
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  topBarLeft: {
    flex: 1,
  },
  topBarCenter: {
    flex: 2,
    alignItems: 'center',
  },
  topBarRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerInfoButton: {
    padding: 5,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  dropdownHeaderText: {
    color: 'black',
    fontWeight: '900',
    marginRight: 6,
    fontSize: 14,
    letterSpacing: 1,
  },
  dropdownList: {
    position: 'absolute',
    bottom: 60, // Open UP
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: 110,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  dropdownItem: {
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dropdownItemText: {
    color: 'black',
    fontSize: 14,
  },
  playerWrapper: {
    position: 'absolute',
    width: 110,
    height: 130,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerBadge: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  glossHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  activePlayerBadge: {
    // Handled dynamically in component for shadow color
  },
  topLeft: { top: 15, left: 15 },
  topRight: { top: 15, right: 15 },
  bottomLeft: { bottom: 120, left: 15 }, 
  bottomRight: { bottom: 120, right: 15 }, 
  playerInfo: {
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  playerName: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  playerRollButton: {
    position: 'absolute',
    top: -50, // Towards center for both top (rotated) and bottom players
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  playerRollText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  removePlayerButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    padding: 4,
    zIndex: 20,
  },
  playerRollingBadge: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
  },
  playerRollingText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  addPlayerButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 400,
  },
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
  floatingInfoButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
  },
  modalBody: {
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  policyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    marginTop: 10,
  },
  policyButtonText: {
    color: '#007AFF',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 14,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginTop: 10,
  },
  nameInput: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  modalButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 15,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.7)',
    lineHeight: 20,
  },
});
