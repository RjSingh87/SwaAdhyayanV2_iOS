import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import ModalMsg from "react-native-modal";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SWATheam } from '../../constant/ConstentValue';

const MsgModal = ({ msgModalVisible }) => {
  return (
    <ModalMsg
      isVisible={msgModalVisible.status}
      animationInTiming={600}
      animationOutTiming={1000}
      style={{ width: '100%', margin: 0 }}>
      <TouchableOpacity style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: 60, height: 60, backgroundColor: SWATheam.SwaWhite, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
          {msgModalVisible.type == 'success' ?
            <AntDesign name='checkcircleo' size={30} color={SWATheam.SwaBlue} /> :
            <MaterialIcons name='error-outline' size={30} color={SWATheam.SwaRed} />
          }
        </View>
        <View style={{ flex: 1.5, justifyContent: 'center', backgroundColor: SWATheam.SwaWhite, padding: 10, borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
          <Text style={{ color: SWATheam.SwaGray }}>{msgModalVisible.msg}</Text>
        </View>
      </View>
      <TouchableOpacity style={{ flex: .3 }} />
    </ModalMsg>
  )
}

export default MsgModal

const styles = StyleSheet.create({})