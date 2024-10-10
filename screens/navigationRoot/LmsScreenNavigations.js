import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import BottomScreenNavigation from './BottomScreenNavigation'
import SwaDrawer from '../common/SwaDrawer'
import StudentList from '../lmsScreen/StudentList'
import Attendance from '../lmsScreen/Attendance'
import TimeTable from '../lmsScreen/TimeTable'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import SwaSharing from '../lmsScreen/SwaSharing'
import Safal from '../lmsScreen/Assessment/Safal'
import LiveClass from '../lmsScreen/liveClass/LiveClass'
import LiveClassList from '../lmsScreen/liveClass/LiveClassList'
import SubIconsScreen from '../lmsScreen/SubIconsScreen'
import ActivityListScreen from '../lmsScreen/ActivityListScreen'
import ActivityView from '../common/ActivityView'
import ViewReport from '../lmsScreen/REPORTs/ViewReport'
import DetailAnalyticalReportView from '../lmsScreen/REPORTs/DetailAnalyticalReportView'
import AssessGenerateQuesView from '../lmsScreen/Assessment/AssessGenerateQuesView'
import AssessmentQuesView from '../lmsScreen/Assessment/assessmentQuesView'
// import NCERT from '../lmsScreen/NCRT/NCERT'






const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()


const LmsScreenNavigations = ({ navigation, route }) => {
  const { logOut } = useContext(GlobleData)
  return (

    <Stack.Navigator>
      <Stack.Screen name="home" component={DrawerNavigation} options={{ headerShown: false }} />
      <Stack.Screen name="subIconScreen" component={SubIconsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="activityListScreen" component={ActivityListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="activityView" component={ActivityView} options={{ headerShown: false }} />


      {/* ------->>Sept Report-------<< */}
      <Stack.Screen name="viewReport" component={ViewReport} options={{ headerShown: false }} />
      <Stack.Screen name="detailAnalyticalList" component={DetailAnalyticalReportView} options={{ headerShown: false }} />
      {/* ------->>Sept Report-------<< */}



      {/* ------->>Assessment-------<< */}
      <Stack.Screen name="assGenerateQueList" component={AssessGenerateQuesView} options={{ headerShown: false }} />
      <Stack.Screen name="queListAssGenerator" component={AssessmentQuesView} options={{ headerShown: false }} />
      {/* ------->>Assessment-------<< */}


      <Stack.Screen name="studentList" component={StudentList} options={{ headerShown: false }} />
      <Stack.Screen name="attendance" component={Attendance} options={{ headerShown: false }} />
      <Stack.Screen name="timeTable" component={TimeTable} options={{ headerShown: false }} />
      <Stack.Screen name="swaShare" component={SwaSharing} options={{ headerShown: false }} />
      <Stack.Screen name="safalPP" component={Safal} options={{ headerShown: false }} />

      {/* ------->>LiveClass-------<< */}
      <Stack.Screen name="liveClass" component={LiveClass} options={{ headerShown: false }} />
      <Stack.Screen name="liveClassList" component={LiveClassList} options={{ headerShown: false }} />
      {/* ------->>LiveClass-------<< */}


      {/* <Stack.Screen name="ncert" component={NCERT} options={{ headerShown: false }} /> */}

    </Stack.Navigator>
  )
}

export default LmsScreenNavigations

const DrawerNavigation = ({ navigation, route }) => {
  return (
    <Drawer.Navigator
      drawerContent={props => <SwaDrawer{...props} />}
    >
      <Drawer.Screen name="bottomTab" component={BottomScreenNavigation} options={{ headerShown: false }} />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({})