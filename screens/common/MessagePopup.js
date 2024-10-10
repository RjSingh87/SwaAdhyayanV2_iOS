import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'



const MessagePopup = ({ goBack, closeModule }) => {
  const { userData } = useContext(GlobleData)

  return (
    <Modal
      animationType="slide"
      transparent={true}
    >
      <View style={styles.garyContainer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => closeModule()}
        />

        <View style={styles.listBox}>
          <Image source={require("../assets/Success.png")} style={{ width: 80, height: 80, tintColor: userData.data.colors.mainTheme }} />
          <View style={{ marginVertical: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: userData.data.colors.mainTheme, textAlign: 'center' }}>Success!</Text>
            <Text style={{ textAlign: 'center', marginVertical: 4, color: SWATheam.SwaGray }}>You have successfully submitted exam.</Text>
          </View>
          <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, padding: 8, borderRadius: 4, width: 100, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => goBack()}
          >
            <Text style={{ fontWeight: 'bold', color: SWATheam.SwaWhite }}>OK</Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => closeModule()}
        />
      </View>
    </Modal>
  )
}

export default MessagePopup

const styles = StyleSheet.create({
  garyContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  listBox: {
    backgroundColor: SWATheam.SwaWhite,
    height: '40%',
    width: "80%",
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  }
})