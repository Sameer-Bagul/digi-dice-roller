import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';

type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

interface GameState {
  players: (string | null)[];
  currentPlayerIndex: number;
  diceCount: number;
  results: DiceValue[];
  isRolling: boolean;
  addPlayer: (index: number, name: string) => void;
  removePlayer: (index: number) => void;
  setDiceCount: (count: number) => void;
  rollDice: () => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<(string | null)[]>(['Player 1', null, null, null]);
  const playersRef = useRef(players);
  useEffect(() => {
    playersRef.current = players;
  }, [players]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceCount, _setDiceCount] = useState(1);
  const setDiceCount = useCallback((count: number) => {
    _setDiceCount(count);
    setResults((prev) => {
      if (prev.length === count) return prev;
      if (prev.length < count) {
        return [...prev, ...Array(count - prev.length).fill(1)];
      }
      return prev.slice(0, count);
    });
  }, []);
  const [results, setResults] = useState<DiceValue[]>([1]);
  const [isRolling, setIsRolling] = useState(false);

  const addPlayer = useCallback((index: number, name: string) => {
    if (index >= 0 && index < 4) {
      setPlayers((prev) => {
        const next = [...prev];
        next[index] = name;
        return next;
      });
    }
  }, []);

  const removePlayer = useCallback((index: number) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[index] = null;
      // Ensure at least one player exists or reset to Player 1 if everything is empty
      const activeCount = next.filter(p => p !== null).length;
      if (activeCount === 0) {
        next[0] = 'Player 1';
      }
      return next;
    });

    // Reset turn if current player is removed or becomes null
    setCurrentPlayerIndex((prev) => {
      if (prev === index || playersRef.current[prev] === null) {
        // Find first available player starting from index 0
        for (let i = 0; i < 4; i++) {
          if (playersRef.current[i] !== null) return i;
        }
        return 0; 
      }
      return prev;
    });
  }, []);

  const rollDice = useCallback(() => {
    if (isRolling) return;
    
    setIsRolling(true);
    // Initial impact
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Subtle vibrations during the roll
    const hapticInterval = setInterval(() => {
      Haptics.selectionAsync();
    }, 150);

    // Simulate roll duration
    setTimeout(() => {
      clearInterval(hapticInterval);
      const newResults = Array.from({ length: diceCount }, () => 
        (Math.floor(Math.random() * 6) + 1) as DiceValue
      );
      setResults(newResults);
      setIsRolling(false);
      
      // Final landing haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Switch to next VALID player
      setCurrentPlayerIndex((prev) => {
        let next = (prev + 1) % 4;
        // Skip null slots
        for (let i = 0; i < 4; i++) {
          if (playersRef.current[next] !== null) return next;
          next = (next + 1) % 4;
        }
        return next;
      });
    }, 1000);
  }, [diceCount, isRolling, players]);

  return (
    <GameContext.Provider value={{
      players,
      currentPlayerIndex,
      diceCount,
      results,
      isRolling,
      addPlayer,
      removePlayer,
      setDiceCount,
      rollDice,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
