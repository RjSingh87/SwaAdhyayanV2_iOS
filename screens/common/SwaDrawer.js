import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Platform } from 'react-native'
import Modal from "react-native-modal";
import React, { useContext, useState } from 'react'
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'
import { Drawer } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
// import DefaultImg from '../assets/'
const SwaDrawer = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { userData, logOut } = useContext(GlobleData)
  const [photoPath, setPhotoPath] = useState({ path: '', status: false })
  function viewPhoto(path) {
    setPhotoPath((prev) => {
      return { ...prev, path: path, status: true }
    })
  }
  function closeImg() {
    setPhotoPath((prev) => {
      return { ...prev, status: false }
    })
  }
  return (
    <SafeAreaProvider style={{ paddingTop: insets.top, marginBottom: insets.bottom, backgroundColor: userData?.data?.colors?.mainTheme }}>
      <View style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme }}>
        <View style={{ backgroundColor: userData?.data?.colors?.mainTheme, height: Platform.Version >= 33 ? (113 + insets.top) : (140 + insets.top), justifyContent: 'flex-end', paddingBottom: 10 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={{ height: Platform.Version >= 33 ? 100 : 80, width: Platform.Version >= 33 ? 100 : 80, backgroundColor: SWATheam.SwaWhite, borderRadius: 50, borderWidth: 2, borderColor: userData?.data?.colors?.hoverTheme, overflow: 'hidden' }} onPress={() => viewPhoto(userData.data.profilePath)}>
              <Image source={{ uri: userData?.data?.profilePath }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 8, }}>
              <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500', textTransform: 'capitalize' }}>{userData?.data?.fullname}</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 10, backgroundColor: SWATheam.SwaWhite, paddingVertical: 20 }}>
          <Drawer.Section
            showDivider={false}>
            <Drawer.Item
              label="Home"
              icon={({ size }) => <AntDesign color={userData?.data?.colors?.mainTheme} size={size} name='user' />}
              onPress={() => { navigation.closeDrawer() }}
            />
            {/* <Drawer.Item
            label="Contact Us"
            icon={({size}) =><Ionicons color={userData.data.colors.mainTheme} size={size} name='call-outline'/>}
            onPress={()=>{navigation.closeDrawer()}}
          /> */}
            <Drawer.Item
              label="Log Out"
              icon={({ size }) => <AntDesign color={userData?.data?.colors?.mainTheme} size={size} name='logout' />}
              onPress={(() => { logOut(navigation, 'logout') })}
            />
          </Drawer.Section>
        </View>
        <View style={{ height: 30, borderTopWidth: .5, justifyContent: 'center', alignItems: 'center', backgroundColor: SWATheam.SwaWhite }}>
          {/* <Text style={{ textAlign: 'center', fontSize: 12, color: SWATheam.SwaGray }}>V-{DeviceInfo.getVersion()}</Text> */}
        </View>

        <Modal isVisible={photoPath.status}
          animationInTiming={300}
          animationOutTiming={900}
          style={{ width: '100%', margin: 0 }}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={() => closeImg()} />
          <View style={{ flex: 1 }}>
            <Image source={{ uri: photoPath.path }} style={{ resizeMode: 'contain', width: '100%', height: '100%' }} />
            <TouchableOpacity style={{ padding: 15, justifyContent: 'center', alignItems: 'center' }} onPress={() => closeImg()}>
              <Text style={{ padding: 6, borderRadius: 6, backgroundColor: SWATheam.SwaBlue, textAlign: 'center', width: '50%', color: SWATheam.SwaWhite }}>CLOSE</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => closeImg()} />
        </Modal>



      </View>
    </SafeAreaProvider>
  )
}
export default SwaDrawer
const styles = StyleSheet.create({})