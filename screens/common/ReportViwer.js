import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'
import { PieChart, ProgressChart } from "react-native-chart-kit";
import AcademicProficiency from '../lmsScreen/REPORTs/ReportGraph/AcademicProficiency'
import LearningStyle from '../lmsScreen/REPORTs/ReportGraph/LearningStyle'
import MultipleIntelligences from '../lmsScreen/REPORTs/ReportGraph/MultipleIntelligences'
import KnowingMe from '../lmsScreen/REPORTs/ReportGraph/KnowingMe'
import GraphLegend from '../lmsScreen/REPORTs/ReportGraph/GraphLegend'
import BrainDominance from '../lmsScreen/REPORTs/ReportGraph/BrainDominance'
import ConsolidatedReport from '../lmsScreen/REPORTs/ReportGraph/ConsolidatedReport'
import ClassWiseReportTypeA from '../lmsScreen/SEPT/classWiseReport/ClassWiseReportTypeA'
import ClassWiseReportTypeB from '../lmsScreen/SEPT/classWiseReport/ClassWiseReportTypeB'
import MultipleBarGroupGraph from '../lmsScreen/REPORTs/ReportGraph/MultipleBarGroupGraph'
import AllSubjectsDifficultyAnalysisReport from '../lmsScreen/REPORTs/studentWiseReport/AllSubjectsDifficultyAnalysisReport'
import SubjectWiseComHensProgReport from '../lmsScreen/REPORTs/studentWiseReport/SubjectWiseComHensProgReport'
import HalfYearlyProgressReport from '../lmsScreen/REPORTs/studentWiseReport/HalfYearlyAndAnnualProgressReport'
import HalfYearlyAndAnnualProgressReport from '../lmsScreen/REPORTs/studentWiseReport/HalfYearlyAndAnnualProgressReport'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ReportViwer = ({ closeModule, reportData, selectedField, reportName, testType, reportSubIconID, reportChildIconSequence, type, selectedIcon }) => {
    const { userData } = useContext(GlobleData)
    let testLable = ''
    if (reportData?.data?.totalPercentage <= 40 || reportData?.APP?.totalPercentage <= 40) {
        testLable = "Beginner"
    } else if ((reportData?.data?.totalPercentage >= 40 && reportData?.data?.totalPercentage <= 60) || (reportData?.APP?.totalPercentage >= 40 && reportData?.APP?.totalPercentage <= 60)) {
        testLable = "Average"
    } else if ((reportData?.data?.totalPercentage >= 61 && reportData?.data?.totalPercentage <= 80) || (reportData?.APP?.totalPercentage >= 61 && reportData?.APP?.totalPercentage <= 80)) {
        testLable = "Advance"
    } else {
        testLable = "Proficient"
    }

    console.log(reportSubIconID, testType)

    return (
        <Modal
            animationType="slide"
            transparent={true}
        >
            <View style={styles.garyContainer}>
                <TouchableOpacity
                    style={{ flex: (reportSubIconID == 60 && (testType == 6 || (testType == 1 || testType == 4))) || reportSubIconID == 62 && testType != 4 || type == "student" || reportSubIconID == 63 && testType == 1 || reportSubIconID == 63 && (testType == 4 || testType == 5) || (reportSubIconID == 64 && testType == 1 || testType == 2) ? .1 : .5 }}
                    onPress={() => closeModule()} />
                <View style={{ flex: 1, borderRadius: 6 }}>
                    <View style={{ backgroundColor: userData.data.colors.mainTheme, padding: 10, borderTopRightRadius: 6, borderTopLeftRadius: 6, }}>
                        <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: '500', borderBottomWidth: .7, borderColor: SWATheam.SwaWhite, paddingVertical: 10, textTransform: 'uppercase' }}>{reportName}</Text>
                        {reportSubIconID != 63 && testType != 4 || reportSubIconID != 63 && testType != 4 ?
                            <>
                                {(userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ?
                                    <View style={{ flexDirection: 'row', paddingVertical: 6 }}>
                                        {selectedField.student != null ?
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: SWATheam.SwaWhite }}>{selectedField.student.fullName}</Text>
                                            </View> : null
                                        }
                                        <View style={{ width: 100 }}>
                                            <Text style={{ color: SWATheam.SwaWhite }}>Class ({selectedField.class.classDesc}-{selectedField.section.sectionName})</Text>
                                        </View>
                                    </View> : null
                                }
                            </> : null

                        }
                    </View>
                    <View style={{ flex: 1, backgroundColor: SWATheam.SwaWhite, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                        {reportSubIconID == 60 || type == "student" ?
                            <>
                                {(type != "student" && testType != 6) || (type == "student" && testType != undefined) ?
                                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <GraphLegend testType={testType} reportData={reportData} reportSubIconID={reportSubIconID} reportChildIconSequence={reportChildIconSequence} />
                                        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            {testType == 1 ?
                                                <AcademicProficiency reportData={reportData} testType={testType} />
                                                : testType == 2 ?
                                                    <LearningStyle reportData={reportData} testType={testType} />
                                                    : testType == 3 ?
                                                        <MultipleIntelligences reportData={reportData} testType={testType} />
                                                        : testType == 4 ?
                                                            <KnowingMe reportData={reportData} testType={testType} />
                                                            : testType == 5 ?
                                                                <BrainDominance reportData={reportData} testType={testType} />
                                                                : null
                                            }
                                        </ScrollView>
                                        {reportData?.data?.totalPercentage != undefined || reportData?.APP?.totalPercentage != undefined ?
                                            <View style={{ justifyContent: 'center' }}>
                                                <Text style={{ padding: 10, color: SWATheam.SwaBlack, textAlign: 'center', fontWeight: '500' }}>{testLable} {testType == 6 ? reportData?.APP?.totalPercentage : reportData?.data?.totalPercentage}%</Text>
                                            </View> : null
                                        }

                                    </ScrollView> :
                                    <>
                                        <ConsolidatedReport reportData={reportData} testType={testType} type={type} />
                                    </>
                                }
                            </> : reportSubIconID == 62 || reportSubIconID == 63 || reportSubIconID == 64 ?
                                <>
                                    {reportSubIconID == 62 && testType < 5 || (reportSubIconID == 63 && testType == 2) || reportSubIconID == 64 && (testType == 1 || testType == 2) ?
                                        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <GraphLegend testType={testType} reportData={reportData} reportSubIconID={reportSubIconID} reportChildIconSequence={reportChildIconSequence} />
                                            <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <ClassWiseReportTypeA reportData={reportData} reportSubIconID={reportSubIconID} testType={testType} />
                                            </ScrollView>
                                        </ScrollView>
                                        :
                                        reportSubIconID == 62 && (testType == 5 || testType == 6 || testType == 7) ?
                                            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <GraphLegend testType={testType} reportData={reportData} reportSubIconID={reportSubIconID} reportChildIconSequence={reportChildIconSequence} />
                                                <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <ClassWiseReportTypeB reportData={reportData} reportSubIconID={reportSubIconID} testType={testType} />
                                                </ScrollView>
                                            </ScrollView> : reportSubIconID == 63 && testType == 1 ?
                                                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <GraphLegend testType={testType} reportData={reportData} reportSubIconID={reportSubIconID} reportChildIconSequence={reportChildIconSequence} />
                                                    <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <AllSubjectsDifficultyAnalysisReport reportData={reportData} reportSubIconID={reportSubIconID} testType={testType} />
                                                    </ScrollView>
                                                </ScrollView>
                                                : reportSubIconID == 63 && testType == 3 ?
                                                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        {/* <GraphLegend testType={testType} reportData={reportData} reportSubIconID={reportSubIconID} reportChildIconSequence={reportChildIconSequence} /> */}
                                                        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                            <SubjectWiseComHensProgReport reportData={reportData} reportSubIconID={reportSubIconID} testType={testType} />
                                                        </ScrollView>
                                                    </ScrollView>
                                                    : reportSubIconID == 63 && (testType == 4 || testType == 5) ?
                                                        <HalfYearlyAndAnnualProgressReport reportData={reportData} reportSubIconID={reportSubIconID} testType={testType} /> : null
                                    }
                                </> : null
                        }
                    </View>
                    <TouchableOpacity style={{ backgroundColor: userData.data.colors.liteTheme, borderBottomRightRadius: 6, borderBottomLeftRadius: 6, justifyContent: 'center', alignItems: 'center', padding: 6 }}
                        onPress={() => closeModule()}>
                        <View style={{ backgroundColor: userData.data.colors.mainTheme, width: 100, padding: 8, borderRadius: 6 }}>
                            <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: '500' }}>Close</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{ flex: (reportSubIconID == 60 && (testType == 6 || (testType == 1 || testType == 4))) || reportSubIconID == 62 && testType != 4 || type == "student" || reportSubIconID == 63 && testType == 1 || reportSubIconID == 63 && (testType == 4 || testType == 5) || (reportSubIconID == 64 && testType == 1 || testType == 2) ? .1 : .5 }}
                    onPress={() => closeModule()}
                />
            </View>
        </Modal>
    )
}

export default ReportViwer

const styles = StyleSheet.create({
    garyContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center'
    },
    listBox: {
        backgroundColor: SWATheam.SwaWhite,
        width: "100%",
        maxHeight: '80%',
        // alignSelf: 'center',
        borderRadius: 6,
    },
})