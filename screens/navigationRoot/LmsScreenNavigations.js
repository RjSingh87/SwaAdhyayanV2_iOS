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
import AssessmentPdfViewer from '../lmsScreen/Assessment/AssessmentPdfViewer'
import Assessment from '../lmsScreen/Assessment/attempteScreens/componets/assessment/Assessment'
import AttemptHolder from '../lmsScreen/Assessment/attempteScreens/componets/assessment/AttemptHolder'
import SeptAttempt from '../lmsScreen/SEPT/SeptAttempt'
import AcademicReport from '../lmsScreen/SEPT/septReport/AcademicReport'
import LearningReport from '../lmsScreen/SEPT/septReport/LearningReport'
import MultipleIntellReport from '../lmsScreen/SEPT/septReport/MultipleIntellReport'
import KnowingMeReport from '../lmsScreen/SEPT/septReport/KnowingMeReport'
import BrainDominReport from '../lmsScreen/SEPT/septReport/BrainDominReport'
import NCERT from '../lmsScreen/NCRT/NCERT'
import PdfViewer from '../common/PdfViewer'
import GameViewer from '../common/GameViewer'
import VideoView from '../common/VideoView'
import IndicatorGradeEntry from '../lmsScreen/marksEntryScreens/IndicatorGradeEntry'
import Co_ScholasticIndicator from '../lmsScreen/marksEntryScreens/Co_ScholasticIndicator'
import NotbookSEAMarksEntry from '../lmsScreen/marksEntryScreens/NotbookSEAMarksEntry'
import AssessMarksEntry from '../lmsScreen/marksEntryScreens/AssessMarksEntry'






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
      <Stack.Screen name="septAttempt" component={SeptAttempt} options={{ headerShown: false }} />
      <Stack.Screen name="pdfView" component={PdfViewer} options={{ headerShown: false }} />
      <Stack.Screen name="gameView" component={GameViewer} options={{ headerShown: false }} />
      <Stack.Screen name="videoView" component={VideoView} options={{ headerShown: false }} />


      {/* ------->>Report-------<< */}
      <Stack.Screen name="viewReport" component={ViewReport} options={{ headerShown: false }} />
      <Stack.Screen name="detailAnalyticalList" component={DetailAnalyticalReportView} options={{ headerShown: false }} />
      {/* ------->>Report-------<< */}

      {/* ------->>Sept Report-------<< */}
      <Stack.Screen name="septAcademicReport" component={AcademicReport} options={{ headerShown: false }} />
      <Stack.Screen name="septLearningReport" component={LearningReport} options={{ headerShown: false }} />
      <Stack.Screen name="septMultipleIntellReport" component={MultipleIntellReport} options={{ headerShown: false }} />
      <Stack.Screen name="septKnowingMeReport" component={KnowingMeReport} options={{ headerShown: false }} />
      <Stack.Screen name="septBrainDominReport" component={BrainDominReport} options={{ headerShown: false }} />
      {/* ------->>Sept Report-------<< */}



      {/* ------->>Assessment-------<< */}
      <Stack.Screen name="assGenerateQueList" component={AssessGenerateQuesView} options={{ headerShown: false }} />
      <Stack.Screen name="queListAssGenerator" component={AssessmentQuesView} options={{ headerShown: false }} />
      <Stack.Screen name="asspdfView" component={AssessmentPdfViewer} options={{ headerShown: false }} />
      <Stack.Screen name="Assessment" component={Assessment} options={{ headerShown: false }} />
      <Stack.Screen name="AttemptHolder" component={AttemptHolder} options={{ headerShown: false }} />
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

      {/* marks Entry */}
      <Stack.Screen name="assMarkEntry" component={AssessMarksEntry} options={{ headerShown: false, }} />
      <Stack.Screen name="coScholasticIndicator" component={Co_ScholasticIndicator} options={{ headerShown: false }} />
      <Stack.Screen name="indicatorGradeEntry" component={IndicatorGradeEntry} options={{ headerShown: false }} />
      <Stack.Screen name="nootbookMarksEntry" component={NotbookSEAMarksEntry} options={{ headerShown: false }} />
      {/* marks Entry */}


      <Stack.Screen name="ncert" component={NCERT} options={{ headerShown: false }} />

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