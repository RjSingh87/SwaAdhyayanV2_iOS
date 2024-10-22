import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SWATheam } from '../../../../constant/ConstentValue'

const CertificateIconsView = ({ certificateAction }) => {
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <TouchableOpacity style={{ backgroundColor: SWATheam.SwaWhite, width: '40%', height: 120, borderRadius: 6, justifyContent: 'center', alignItems: 'center', elevation: 9 }} onPress={() => { certificateAction('create') }}>
          <Image source={(require("../../../assets/report.png"))} style={{ height: 80, width: 80, resizeMode: 'contain' }} />
          <Text style={{ color: SWATheam.SwaBlack }}>Create Certificate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: SWATheam.SwaWhite, width: '40%', height: 120, borderRadius: 6, justifyContent: 'center', alignItems: 'center', elevation: 9 }} onPress={() => { certificateAction('issue') }}>
          <Image source={(require("../../../assets/septReportIcon.png"))} style={{ height: 80, width: 80, resizeMode: 'contain' }} />
          <Text style={{ color: SWATheam.SwaBlack }}>Issued Certificate</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CertificateIconsView

const styles = StyleSheet.create({})