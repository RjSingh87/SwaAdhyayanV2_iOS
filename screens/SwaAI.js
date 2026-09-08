import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { SWATheam } from '../constant/ConstentValue';
import { useNavigation } from '@react-navigation/native';

const SwaAI = ({ }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [floatAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const scale = floatAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.03, 1],
  });

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          transform: [
            { translateY },
            { scale },
          ],
        },
      ]}>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('TeacherAiScannerDemo')}
        style={styles.container}>

        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../assets/AiLogo_1.png')}
          />
        </View>

        <Text style={styles.text}>Swa-AI</Text>

      </TouchableOpacity>
    </Animated.View>
  );
};

export default SwaAI;

const styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },

  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },

  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },

  text: {
    color: SWATheam.SwaBlue,
    fontSize: 13,
    fontWeight: 'bold',
  },
});