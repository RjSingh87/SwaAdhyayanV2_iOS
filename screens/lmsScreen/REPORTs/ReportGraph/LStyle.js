import React from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Animated, FlatList, Alert, Dimensions } from 'react-native'
import { VictoryChart, VictoryAxis, VictoryBar } from 'victory-native'

const LStyle = ({ closeModal, student, classId, section, userData, subTopic, reportData}) => {

  return (
    <View style={styles.graphContainer}>
      <VictoryChart
        width={350}
        animate={{ duration: 1000 }}
        domainPadding={{ x: 30 }}
        domain={{ y: [0, 100] }}
        justifyContenr={'center'}

      >
        <VictoryAxis crossAxis />
        <VictoryAxis dependentAxis
          style={
            {
              grid: { stroke: 'rgba(0,0,0,0.2)', strokeDasharray: "8, 4" },
            }
          }
          tickFormat={(tick) => `${tick}`}
        />

        <VictoryBar
          data={reportData}
          labels={({ datum }) => `${datum.y}%`}
          style={
            {
              data: { fill: ({ datum }) => datum.color },
            }
          }  //
          barWidth={30}
        />
      </VictoryChart>
      <View style={{ position: "absolute", left: -20, top: 145, transform: [{ rotate: "-90deg" }] }}>
        <Text style={{ fontSize: 12, }}>Percentage (%)</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 12, }}>VAK Report (in 100%)</Text>
      </View>
    </View>
  )
}

export default LStyle;
const styles = StyleSheet.create({
  graphContainer: {
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 20



  }
})