
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ORBIT_SIZE = Math.min(SCREEN_WIDTH - 120, 230);
const ICON_SIZE = 54;

// Default fallback icons (emojis) if no image icons are provided
const defaultIcons = [
  { emoji: '🧠', angle: 0 },
  { emoji: '🧑‍💻', angle: 72 },
  { emoji: '👁️', angle: 144 },
  { emoji: '🧠', angle: 216 },
  { emoji: '🤖', angle: 288 },
];

export default function SAOrbitAnimation({ icons: iconsProp, onIconPress }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const counterRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const radius = ORBIT_SIZE / 2 - ICON_SIZE / 2;

  // Build icons array: use prop images if available, else default emojis
  const orbitIcons = (iconsProp && iconsProp.length > 0)
    ? iconsProp.map((item, index) => ({
      imageUrl: item.imageUrl,
      angle: (360 / iconsProp.length) * index,
      originalIndex: index,
    }))
    : defaultIcons.map((item, index) => ({ emoji: item.emoji, angle: item.angle, originalIndex: index }));

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.orbitContainer,
          {
            width: ORBIT_SIZE,
            height: ORBIT_SIZE,
          },
        ]}
      >
        {/* Circular orbit */}
        <View style={styles.orbitLine} />

        {/* Only the outer icons revolve around the center */}
        <Animated.View
          style={[
            styles.rotatingLayer,
            {
              width: ORBIT_SIZE,
              height: ORBIT_SIZE,
              transform: [{ rotate }],
            },
          ]}
        >
          {orbitIcons.map((item, index) => {
            const angle = (item.angle * Math.PI) / 180;

            const x =
              ORBIT_SIZE / 2 +
              radius * Math.sin(angle) -
              ICON_SIZE / 2;

            const y =
              ORBIT_SIZE / 2 -
              radius * Math.cos(angle) -
              ICON_SIZE / 2;

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => onIconPress && onIconPress(item.originalIndex)}
                style={[
                  styles.iconPosition,
                  {
                    left: x,
                    top: y,
                  },
                ]}
              >
                {/* Counter-rotation keeps each icon upright */}
                <Animated.View
                  style={[
                    styles.iconCircle,
                    {
                      transform: [{ rotate: counterRotate }],
                    },
                  ]}
                >
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.iconImage}
                    />
                  ) : (
                    <Text style={styles.iconEmoji}>
                      {item.emoji}
                    </Text>
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Fixed center logo — outside the rotating layer */}
        <View style={styles.centerLogo}>
          <Image source={require('../assets/SW_Logo.png')} style={{ width: 42, height: 42, borderRadius: 21, resizeMode: "contain" }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  orbitContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  orbitLine: {
    position: 'absolute',
    width: '82%',
    height: '82%',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#a3dfd9',
  },

  rotatingLayer: {
    position: 'absolute',
  },

  iconPosition: {
    position: 'absolute',
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconCircle: {
    width: ICON_SIZE - 4,
    height: ICON_SIZE - 4,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: '#b1e8e2',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 7,
    elevation: 3,
  },

  iconImage: {
    width: ICON_SIZE - 16,
    height: ICON_SIZE - 16,
    resizeMode: 'contain',
  },

  iconEmoji: {
    fontSize: 24,
    textAlign: 'center',
  },

  centerLogo: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#C8E8E5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  logoText: {
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: -4,
  },

  logoRed: {
    color: '#F02755',
  },

  logoBlue: {
    color: '#1687BD',
  },

  logoDot: {
    position: 'absolute',
    right: 10,
    top: 12,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#1687BD',
  },
});
