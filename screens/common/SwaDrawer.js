import { StyleSheet, Text, View, Image, Platform } from 'react-native'
import React, { useContext } from 'react'
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'
import { Drawer } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'

const SwaDrawer = ({ navigation, route }) => {
  const { userData, logOut } = useContext(GlobleData)
  return (
    <View style={{ flex: 1, marginTop: Platform.OS == "ios" ? 0 : 20 }}>
      <View style={{ backgroundColor: userData.data.colors.mainTheme, height: Platform.OS == "ios" ? 180 : 150, justifyContent: 'flex-end', paddingBottom: 10 }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
          <View style={{ height: 70, width: 70, backgroundColor: SWATheam.SwaWhite, borderRadius: 50, borderWidth: 2, borderColor: userData.data.colors.hoverTheme, overflow: 'hidden' }}>
            <Image source={{ uri: userData.data.profilePath }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center', padding: 8, }}>
            <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500', textTransform: 'capitalize' }}>{userData.data.fullname}</Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, marginTop: 10 }}>
        <Drawer.Section
          showDivider={false}>
          <Drawer.Item
            label="Home"
            icon={({ size }) => <AntDesign color={userData.data.colors.mainTheme} size={size} name='user' />}
            onPress={() => { navigation.closeDrawer() }}
          />
          <Drawer.Item
            label="Contact Us"
            icon={({ size }) => <Ionicons color={userData.data.colors.mainTheme} size={size} name='call-outline' />}
            onPress={() => { navigation.closeDrawer() }}
          />
          <Drawer.Item
            label="Log Out"
            icon={({ size }) => <AntDesign color={userData.data.colors.mainTheme} size={size} name='logout' />}
            onPress={(() => { logOut(navigation, 'logout') })}
          />
        </Drawer.Section>
      </View>
      <View style={{ height: 25, borderTopWidth: .5, justifyContent: 'center', alignItems: 'center' }}>
        {/* <Text style={{ textAlign: 'center', fontSize: 12 }}>V-{DeviceInfo.getVersion()}</Text> */}
      </View>

    </View>
  )
}

export default SwaDrawer

const styles = StyleSheet.create({})