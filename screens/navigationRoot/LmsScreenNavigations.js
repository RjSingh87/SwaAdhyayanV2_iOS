import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import SwaDrawer from '../common/SwaDrawer'
import BottomScreenNavigation from './BottomScreenNavigation'
import SubIconsScreen from '../lmsScreen/SubIconsScreen'
import ActivityListScreen from '../lmsScreen/ActivityListScreen'
import PdfViewer from '../common/PdfViewer'
import ChapterItemList from '../common/ChapterItemList'
import ActivityView from '../common/ActivityView'
import VideoView from '../common/VideoView'
import ViewFunBagScreen from '../lmsScreen/ViewFunBagScreen'
import SeptAttempt from '../lmsScreen/SEPT/SeptAttempt'
import AcademicReport from '../lmsScreen/SEPT/septReport/AcademicReport'
import LearningReport from '../lmsScreen/SEPT/septReport/LearningReport'
import MultipleIntellReport from '../lmsScreen/SEPT/septReport/MultipleIntellReport'
import KnowingMeReport from '../lmsScreen/SEPT/septReport/KnowingMeReport'
import BrainDominReport from '../lmsScreen/SEPT/septReport/BrainDominReport'
import TimeTable from '../lmsScreen/TimeTable'
import EditProfile from '../userScreens/EditProfile'
import GameViewer from '../common/GameViewer'
import NCERT from '../lmsScreen/NCRT/NCERT'
import ViewReport from '../lmsScreen/REPORTs/ViewReport'
import CbseSafal from '../lmsScreen/CBSE_Safal/CbseSafal'
import McqAct from '../lmsScreen/CBSE_Safal/McqAct'
import SwaSharing from '../lmsScreen/SwaSharing'
// import AssessmentPdfViewer from '../lmsScreen/Assessment/AssessmentPdfViewer'
import StudentList from '../lmsScreen/StudentList'
import AssessMarksEntry from '../lmsScreen/marksEntryScreens/AssessMarksEntry'
import Attendance from '../lmsScreen/Attendance'
import Assessment from '../lmsScreen/Assessment/attempteScreens/componets/assessment/Assessment'
import AttemptHolder from '../lmsScreen/Assessment/attempteScreens/componets/assessment/AttemptHolder'
import Co_ScholasticIndicator from '../lmsScreen/marksEntryScreens/Co_ScholasticIndicator'
import IndicatorGradeEntry from '../lmsScreen/marksEntryScreens/IndicatorGradeEntry'
import NotbookSEAMarksEntry from '../lmsScreen/marksEntryScreens/NotbookSEAMarksEntry'
import HomeWorkReports from '../lmsScreen/homeWork/teacher/HomeWorkReports'
import LiveClass from '../lmsScreen/liveClass/LiveClass'
import LiveClassList from '../lmsScreen/liveClass/LiveClassList'
import AssessmentQuesView from '../lmsScreen/Assessment/assessmentQuesView'
import AssessGenerateQuesView from '../lmsScreen/Assessment/AssessGenerateQuesView'
import Safal from '../lmsScreen/Assessment/Safal'
import DetailAnalyticalReportView from '../lmsScreen/REPORTs/DetailAnalyticalReportView'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const LmsScreenNavigations = ({ navigation, route }) => {

  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={DrawerNavigation} options={{ headerShown: false }} />
      <Stack.Screen name="subIconScreen" component={SubIconsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="activityListScreen" component={ActivityListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ViewFunBag" component={ViewFunBagScreen} options={{ headerShown: false }} />
      <Stack.Screen name="pdfView" component={PdfViewer} options={{ headerShown: false, }} />
      <Stack.Screen name="chapterItem" component={ChapterItemList} options={{ headerShown: false }} />
      <Stack.Screen name="activityView" component={ActivityView} options={{ headerShown: false }} />
      <Stack.Screen name="videoView" component={VideoView} options={{ headerShown: false }} />
      <Stack.Screen name="septAttempt" component={SeptAttempt} options={{ headerShown: false }} />
      <Stack.Screen name="gameView" component={GameViewer} options={{ headerShown: false }} />
      {/* Sept_report */}
      <Stack.Screen name="septAcademicReport" component={AcademicReport} options={{ headerShown: false }} />
      <Stack.Screen name="septLearningReport" component={LearningReport} options={{ headerShown: false }} />
      <Stack.Screen name="septMultipleIntellReport" component={MultipleIntellReport} options={{ headerShown: false }} />
      <Stack.Screen name="septKnowingMeReport" component={KnowingMeReport} options={{ headerShown: false }} />
      <Stack.Screen name="septBrainDominReport" component={BrainDominReport} options={{ headerShown: false }} />
      {/* Sept_report */}
      {/* Report */}
      <Stack.Screen name="viewReport" component={ViewReport} options={{ headerShown: false }} />
      <Stack.Screen name="detailAnalyticalList" component={DetailAnalyticalReportView} options={{ headerShown: false }} />

      {/* Report */}
      {/* Ncert */}
      <Stack.Screen name="ncert" component={NCERT} options={{ headerShown: false }} />
      {/* Ncert */}
      <Stack.Screen name="cbseSafal" component={CbseSafal} options={{ headerShown: false }} />
      <Stack.Screen name="mcqScreen" component={McqAct} options={{ headerShown: false }} />
      {/* timeTable */}
      <Stack.Screen name="timeTable" component={TimeTable} options={{ headerShown: false }} />
      <Stack.Screen name="editProfile" component={EditProfile} options={{ headerShown: false }} />
      {/* timeTable */}
      {/* assessment */}
      {/* <Stack.Screen name="assGenerator" component={AssessmentView} options={{headerShown:false}}/>*/}
      <Stack.Screen name="assGenerateQueList" component={AssessGenerateQuesView} options={{ headerShown: false }} />
      <Stack.Screen name="queListAssGenerator" component={AssessmentQuesView} options={{ headerShown: false }} />
      {/* <Stack.Screen name="asspdfView" component={AssessmentPdfViewer} options={{headerShown:false}}/> */}
      <Stack.Screen name="Assessment" component={Assessment} options={{ headerShown: false }} />
      <Stack.Screen name="AttemptHolder" component={AttemptHolder} options={{ headerShown: false }} />

      {/* assessment */}
      {/* swaShare */}
      <Stack.Screen name="swaShare" component={SwaSharing} options={{ headerShown: false }} />
      {/* swaShare */}
      <Stack.Screen name="studentList" component={StudentList} options={{ headerShown: false }} />
      {/* <Stack.Screen name="contactUs" component={ContactUs} options={{headerShown:false}}/>*/}
      {/* marks Entry */}
      <Stack.Screen name="assMarkEntry" component={AssessMarksEntry} options={{ headerShown: false }} />
      <Stack.Screen name="coScholasticIndicator" component={Co_ScholasticIndicator} options={{ headerShown: false }} />
      <Stack.Screen name="indicatorGradeEntry" component={IndicatorGradeEntry} options={{ headerShown: false }} />
      <Stack.Screen name="nootbookMarksEntry" component={NotbookSEAMarksEntry} options={{ headerShown: false }} />
      {/* marks Entry */}
      {/* attendance */}
      <Stack.Screen name="attendance" component={Attendance} options={{ headerShown: false }} />
      {/* attendance */}
      {/* homework */}
      <Stack.Screen name="homeWorkReport" component={HomeWorkReports} options={{ headerShown: false }} />
      {/* homework */}
      {/* LiveClass */}
      <Stack.Screen name="liveClass" component={LiveClass} options={{ headerShown: false }} />
      <Stack.Screen name="liveClassList" component={LiveClassList} options={{ headerShown: false }} />
      {/* LiveClass */}
      <Stack.Screen name="safalPP" component={Safal} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}
export default LmsScreenNavigations
const DrawerNavigation = ({ navigation, route }) => {
  return (
    <Drawer.Navigator drawerContent={props => <SwaDrawer{...props}
      screenOptions={{
        drawerStyle: {
          borderRadius: 0,
          elevation: 0,
        },
      }}
    />}

    >
      {/* drawerContent={props => <SwaDrawer{...props}/>} */}
      <Drawer.Screen name="bottomTab" component={BottomScreenNavigation} options={{ headerShown: false }} />
    </Drawer.Navigator>
  )
}