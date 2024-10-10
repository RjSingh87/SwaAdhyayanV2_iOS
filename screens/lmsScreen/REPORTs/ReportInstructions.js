import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SWATheam } from '../../../constant/ConstentValue'

const ReportInstructions = ({ instruction }) => {
  return (
    <View>
      <Text style={{ color: SWATheam.SwaGray, padding: 4, fontStyle: 'italic' }}>{instruction}</Text>
    </View>
  )
}

export default ReportInstructions

const styles = StyleSheet.create({})