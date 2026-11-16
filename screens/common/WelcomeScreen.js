import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { SWATheam } from '../../constant/ConstentValue'

const WelcomeScreen = ({ navigation }) => {

  useEffect(() => {
    const safeNavigate = () => {
      try {
        const state = navigation?.getState?.();
        const routeNames = state?.routeNames || [];
        if (routeNames.includes('splash')) {
          navigation.navigate('splash');
        }
      } catch (e) {}
    };

    let timer = setTimeout(safeNavigate, 2000);

    const unsubscribe = navigation.addListener('focus', () => {
      clearTimeout(timer);
      timer = setTimeout(safeNavigate, 2000);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: SWATheam.SwaBlue, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require('../assets/splash.png')} style={{ height: '100%', width: '100%' }} />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
