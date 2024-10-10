import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import { SWATheam } from '../../constant/ConstentValue';

const SplashScreen = ({ navigation }) => {
  const Skip = ({ ...prop }) => {
    return (
      <TouchableOpacity
        style={{
          width: 48,
          height: 48,
          marginHorizontal: 10,
          alignItems: "center",
          justifyContent: "center"
        }}
        {...prop}
      >
        <Text style={{ color: SWATheam.SwaWhite }}>Skip</Text>
      </TouchableOpacity>

    )
  }
  const Next = ({ ...prop }) => {
    return (
      <TouchableOpacity
        style={{
          width: 48,
          height: 48,
          marginHorizontal: 10,
          alignItems: "center",
          justifyContent: "center"
        }}
        {...prop}
      >
        <Text style={{ color: SWATheam.SwaWhite }}>Next</Text>
      </TouchableOpacity>

    )
  }

  return (
    <Onboarding
      onSkip={() => navigation.replace("Login")}
      onDone={() => navigation.navigate("Login")}
      // bottomBarColor='#fff'                            
      controlStatusBar={false}
      containerStyles={{ paddingBottom: 25 }}
      imageContainerStyles={{ paddingVertical: 10 }}
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      pages={[
        {
          backgroundColor: SWATheam.SwaBlue,
          image: <Image source={require('../assets/swa_sept_small.png')} />,
          title: 'SEPT',
          subtitle: `Swa-Adhyayan Entrants' Profiling Test`,
        },
        {
          backgroundColor: SWATheam.SwaBlue,
          image: <Image source={require('../assets/swa_learning_small.png')} />,
          title: 'Swa-Learning',
          subtitle: 'Swa-Adhyayan means Self-Learning!',
        },
        {
          backgroundColor: SWATheam.SwaBlue,
          image: <Image source={require('../assets/swa_assessment_small.png')} />,
          title: 'Swa-Assessment',
          subtitle: '10000+ Assessment Questions',
        },
        {
          backgroundColor: SWATheam.SwaBlue,
          image: <Image source={require('../assets/swa_report-small.png')} />,
          title: 'Reports',
          subtitle: 'View Reports',
        },
        {
          backgroundColor: SWATheam.SwaBlue,
          image: <Image source={require('../assets/swa_sharing_small.png')} />,
          title: 'Swa-Sharing',
          subtitle: 'Exclusive feature of our sharing platform',
        },
      ]}
    />
  )
}

export default SplashScreen

const styles = StyleSheet.create({})