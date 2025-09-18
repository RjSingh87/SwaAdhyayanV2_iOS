import { StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions } from 'react-native'
import React, { useContext } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'
const { width, height } = Dimensions.get('window')

const SwaHeader = ({ title, leftIcon, rightIcon, onClickLeftIcon, onClickRightIcon }) => {
  const { userData } = useContext(GlobleData)
  return (
    <View style={[styles.header, { backgroundColor: userData?.data?.colors?.mainTheme, }]}>
      <TouchableOpacity style={styles.btn}
        onPress={() => onClickLeftIcon()}
      >
        <AntDesign name={leftIcon} size={25} color={SWATheam.SwaWhite} />
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
        <Text style={{ fontWeight: '700', color: SWATheam.SwaWhite, textAlign: 'center', fontSize: 16 }}>{title.length > 35 ? title.substring(0, 31) + '...' : title}</Text>
      </View>
      <View style={styles.btn}
      // onPress={()=>onClickRightIcon()}
      >
        {/* <AntDesign name={rightIcon} size={25} color={SWATheam.SwaWhite}/> */}
      </View>
    </View>
  )
}

export default SwaHeader

const styles = StyleSheet.create({
  header: {
    width: width,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop:Platform.OS === 'android'?24:0,
    paddingVertical: 10,
    paddingHorizontal: 6,
    elevation: 9
  },
  shadowProp: {
    borderBottomWidth: 1
  },
  btn: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }
})