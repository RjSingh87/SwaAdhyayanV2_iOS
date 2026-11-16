import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useContext } from 'react'
import { fBTheme } from '../../constant';
// import Lottie from 'lottie-react-native';
import NetInfo from "@react-native-community/netinfo";
import Modal from "react-native-modal";
import { SWATheam } from '../../constant/ConstentValue';
import { GlobleData } from '../../Store';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const CheckInternet = ({ isConnected, setIsConnected }) => {
  const insets = useSafeAreaInsets();
  const { userData } = useContext(GlobleData)
  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);
  //     setIsConnected(state.isConnected)
  //   });
  //   return () => {
  //     unsubscribe();
  //   }
  // }, [isConnected])


  useEffect(() => {

    NetInfo.fetch().then(state => {

      const connected =
        state.isConnected === true &&
        state.isInternetReachable !== false;

      setIsConnected(connected);

    });

    const unsubscribe = NetInfo.addEventListener(state => {

      const connected =
        state.isConnected === true &&
        state.isInternetReachable !== false;

      console.log("Internet:", connected);

      setIsConnected(connected);

    });

    return () => unsubscribe();

  }, []);



  return (
    <>
      {isConnected ? null :
        (
          <Modal
            isVisible={!isConnected}
            animationInTiming={300}
            animationOutTiming={300}
            style={{ width: '100%', margin: 0 }}
          >
            <View style={{ flex: 1, backgroundColor: !userData?.isLogin ? SWATheam.SwaBlue : userData?.data?.colors?.mainTheme, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require(`../assets/no-internet.gif`)} style={{ width: 80, height: 80, resizeMode: 'contain' }} />
              {/* <Lottie source={require(`../assets/noInternet.json`)}
                autoPlay loop
                style={styles.animationStyle} /> */}
              <Text style={{ fontWeight: '700', color: SWATheam.SwaWhite, fontSize: 16, marginBottom: 10 }}>No Internet Connection</Text>
              <Text style={{ color: SWATheam.SwaWhite }}>Please check your internet connectivity and try again</Text>
            </View>
          </Modal>
        )}
    </>
  )
}

export default CheckInternet
const styles = StyleSheet.create({
  animationStyle: {
    width: 150,
    height: 150,
    alignSelf: 'center'
  }
})