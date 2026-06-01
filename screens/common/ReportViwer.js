import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'
import React, { useContext } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'
import AcademicProficiency from '../lmsScreen/REPORTs/ReportGraph/AcademicProficiency'
import LearningStyle from '../lmsScreen/REPORTs/ReportGraph/LearningStyle'
import MultipleIntelligences from '../lmsScreen/REPORTs/ReportGraph/MultipleIntelligences'
import KnowingMe from '../lmsScreen/REPORTs/ReportGraph/KnowingMe'
import GraphLegend from '../lmsScreen/REPORTs/ReportGraph/GraphLegend'
import BrainDominance from '../lmsScreen/REPORTs/ReportGraph/BrainDominance'
import ConsolidatedReport from '../lmsScreen/REPORTs/ReportGraph/ConsolidatedReport'
import ClassWiseReportTypeA from '../lmsScreen/SEPT/classWiseReport/ClassWiseReportTypeA'
import ClassWiseReportTypeB from '../lmsScreen/SEPT/classWiseReport/ClassWiseReportTypeB'
import AllSubjectsDifficultyAnalysisReport from '../lmsScreen/REPORTs/studentWiseReport/AllSubjectsDifficultyAnalysisReport'
import SubjectWiseComHensProgReport from '../lmsScreen/REPORTs/studentWiseReport/SubjectWiseComHensProgReport'
import HalfYearlyAndAnnualProgressReport from '../lmsScreen/REPORTs/studentWiseReport/HalfYearlyAndAnnualProgressReport'
import DetailedAnalyticalReportsGraph from '../lmsScreen/REPORTs/ReportGraph/DetailedAnalyticalReportsGraph'
import DetailedAnalyticalReportStudentGraph from '../lmsScreen/REPORTs/ReportGraph/DetailedAnalyticalReportStudentGraph'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';


const ReportViwer = ({ closeModule, reportData, selectedField, reportName, testType, reportSubIconID, reportChildIconSequence, userType, selectedIcon, subjectID }) => {
    const insets = useSafeAreaInsets();
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



    return (
        <Modal
            animationType="slide"
            transparent={true}
        >
            <View style={styles.garyContainer}>
                <TouchableOpacity
                    style={{ flex: (reportSubIconID == 60 && (testType == 6 || (testType == 1 || testType == 4))) || reportSubIconID == 62 && testType != 4 || ((userType == 6 || userType == 5) && (userType == 6 || userType == 5) && selectedIcon?.subIconID != 100) || reportSubIconID == 63 && testType == 1 || reportSubIconID == 63 && (testType == 4 || testType == 5) || (reportSubIconID == 64 && testType == 1 || testType == 2) || reportData.type == "detailAnlytical" || reportData.type == "detailAnlyticalStudentWise" ? .1 : .5 }}
                    onPress={() => closeModule()} />
                <View style={{ flex: 1, borderRadius: 6 }}>

                    <View style={{ backgroundColor: userData.data.colors.mainTheme, padding: 10, borderTopRightRadius: 6, borderTopLeftRadius: 6, }}>
                        <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: '500', borderBottomWidth: (userData.data.userTypeID == 5 || userData.data.userTypeID == 6) ? 0 : .7, borderColor: SWATheam.SwaWhite, paddingVertical: 10, textTransform: 'uppercase' }}>{reportName}</Text>
                        {reportSubIconID != 63 && testType != 4 ?
                            <>
                                {((userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2)) && reportData.type != "detailAnlytical" ?
                                    <>
                                        <View style={{ flexDirection: 'row', paddingVertical: 6 }}>
                                            {selectedField?.student != null ?
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: SWATheam.SwaWhite }}>{selectedField?.student.fullName}</Text>
                                                </View> : null
                                            }
                                            {reportData.type != "detailAnlyticalStudentWise" ?
                                                <View style={{ width: 100 }}>
                                                    <Text style={{ color: SWATheam.SwaWhite }}>Class ({selectedField?.class.classDesc}-{selectedField?.section.sectionName})</Text>
                                                </View> :
                                                <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                                                    <Text style={{ color: SWATheam.SwaWhite, width: 100 }}>Class: </Text>
                                                    <Text style={{ color: SWATheam.SwaWhite }}>{reportData.data.reportDetails.class}-{reportData.data.reportDetails.section}</Text>

                                                </View>
                                            }
                                        </View>
                                        {reportData.type == "detailAnlyticalStudentWise" ?
                                            <>
                                                <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                                                    <View style={{ width: 100 }}>
                                                        <Text style={{ color: SWATheam.SwaWhite }}>Subject:</Text>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: SWATheam.SwaWhite }}>{reportData.data.reportDetails.subjectName}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                                                    <View style={{ width: 100 }}>
                                                        <Text style={{ color: SWATheam.SwaWhite }}>Asses Name:</Text>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: SWATheam.SwaWhite }}>{reportData.data.reportDetails.assessmentName.length > 30 ? reportData.data.reportDetails.assessmentName.substring(0, 27) + "..." : reportData.data.reportDetails.assessmentName}</Text>
                                                    </View>
                                                </View>
                                            </> : null
                                        }
                                    </>
                                    :
                                    <>
                                        {(userData.data.userTypeID == 5 || userData.data.userTypeID == 6) ?
                                            null :
                                            <>
                                                <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                                                    <View style={{ width: 100 }}>
                                                        <Text style={{ color: SWATheam.SwaWhite }}>Name:</Text>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: SWATheam.SwaWhite }}>{reportData?.data?.assessmentDetails?.fullName} ({reportData?.data?.assessmentDetails?.class}-{reportData.data?.assessmentDetails?.section})</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                                                    <View style={{ width: 100 }}>
                                                        <Text style={{ color: SWATheam.SwaWhite }}>Subject:</Text>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: SWATheam.SwaWhite }}>{reportData?.data?.assessmentDetails?.subject}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', paddingVertical: 2 }}>
                                                    <View style={{ width: 100 }}>
                                                        <Text style={{ color: SWATheam.SwaWhite }}>Asses Name:</Text>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ color: SWATheam.SwaWhite }}>{reportData?.data?.assessmentDetails?.assessmentName.length > 30 ? reportData?.data?.assessmentDetails?.assessmentName.substring(0, 27) + "..." : reportData?.data?.assessmentDetails?.assessmentName}</Text>
                                                    </View>
                                                </View>
                                            </>

                                        }
                                    </>
                                }
                            </> : null
                        }
                    </View>
                    <View style={{ flex: 1, backgroundColor: SWATheam.SwaWhite, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                        {reportSubIconID == 60 || (userType == 6 || userType == 5) && (selectedIcon?.subIconID != 103 && selectedIcon?.subIconID != 104 && selectedIcon?.subIconID != 102 && selectedIcon?.subIconID != 101 && selectedIcon?.subIconID != 100 && selectedIcon?.subIconID != 99 && selectedIcon?.subIconID != 98 && selectedIcon?.subIconID != 106 && selectedIcon?.subIconID != 105) ?
                            <>
                                {((userType != 4 || userType != 2) && testType != 6) || ((userType == 6 || userType == 5) && testType != undefined) ?

                                    <>

                                        {selectedIcon?.subIconID == 105 ?
                                            <HalfYearlyAndAnnualProgressReport reportData={reportData} reportSubIconID={reportSubIconID} testType={testType} userType={userType} selectedIcon={selectedIcon} />
                                            :
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
                                                    <>
                                                        <ConsolidatedReport reportData={reportData} testType={testType} type="student" />
                                                        {/* <View style={{ justifyContent: 'center' }}>
                                                <Text style={{ padding: 10, color: SWATheam.SwaBlack, textAlign: 'center', fontWeight: '500' }}>{testLable} {testType == 6 ? reportData?.APP?.totalPercentage : reportData?.data?.totalPercentage}%</Text>
                                            </View> */}
                                                    </>
                                                    : null
                                                }

                                            </ScrollView>
                                        }
                                    </> :
                                    <>
                                        <ConsolidatedReport reportData={reportData} testType={testType} />
                                    </>
                                }
                            </> : reportSubIconID == 62 || reportSubIconID == 63 || reportSubIconID == 64 || userType == 5 && (selectedIcon?.subIconID == 103 || selectedIcon?.subIconID == 104) || selectedIcon?.subIconID == 102 || selectedIcon?.subIconID == 101 || selectedIcon?.subIconID == 100 || selectedIcon?.subIconID == 100 || selectedIcon?.subIconID == 99 || selectedIcon?.subIconID == 98 || selectedIcon?.subIconID == 106 || selectedIcon?.subIconID == 105 ?
                                <>
                                    {reportSubIconID == 62 && testType < 5 || (reportSubIconID == 63 && testType == 2) || reportSubIconID == 64 && (testType == 1 || testType == 2) || selectedIcon?.subIconID == 99 || selectedIcon?.subIconID == 98 ?
                                        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <GraphLegend testType={testType} reportData={reportData} reportSubIconID={reportSubIconID} reportChildIconSequence={reportChildIconSequence} subIcon={selectedIcon?.subIconID} />
                                            <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <ClassWiseReportTypeA reportData={reportData} reportSubIconID={reportSubIconID} testType={testType} subIcon={selectedIcon?.subIconID} />
                                            </ScrollView>
                                        </ScrollView>
                                        :
                                        reportSubIconID == 62 && (testType == 5 || testType == 6 || testType == 7) || userType == 5 && selectedIcon?.subIconID == 103 || selectedIcon?.subIconID == 104 || selectedIcon?.subIconID == 102 ?
                                            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <GraphLegend testType={testType} reportData={reportData} reportSubIconID={reportSubIconID} reportChildIconSequence={reportChildIconSequence} subIcon={selectedIcon?.subIconID == 104 || selectedIcon?.subIconID == 102 ? selectedIcon : selectedIcon?.subIconID} />
                                                <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <ClassWiseReportTypeB reportData={reportData} reportSubIconID={reportSubIconID} testType={testType} subIcon={selectedIcon?.subIconID} />
                                                </ScrollView>
                                            </ScrollView>
                                            : reportSubIconID == 63 && testType == 1 || selectedIcon?.subIconID == 101 ?
                                                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <GraphLegend testType={testType} reportData={reportData} reportSubIconID={reportSubIconID} reportChildIconSequence={reportChildIconSequence} subIcon={selectedIcon?.subIconID} />
                                                    <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <AllSubjectsDifficultyAnalysisReport reportData={reportData} reportSubIconID={reportSubIconID} testType={testType} subIcon={selectedIcon?.subIconID} />
                                                    </ScrollView>
                                                </ScrollView>
                                                : reportSubIconID == 63 && testType == 3 || selectedIcon?.subIconID == 100 ?
                                                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <GraphLegend testType={testType} reportData={reportData} reportSubIconID={reportSubIconID} reportChildIconSequence={reportChildIconSequence} subIcon={selectedIcon?.subIconID} />
                                                        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                            <SubjectWiseComHensProgReport reportData={reportData} reportSubIconID={reportSubIconID} testType={testType} subIcon={selectedIcon?.subIconID} />
                                                        </ScrollView>
                                                    </ScrollView>
                                                    : (reportSubIconID == 63 && (testType == 4 || testType == 5)) || (selectedIcon?.subIconID == 106 || selectedIcon?.subIconID == 105) ?
                                                        <HalfYearlyAndAnnualProgressReport reportData={reportData} reportSubIconID={reportSubIconID} testType={testType} userType={userType} selectedIcon={selectedIcon?.subIconID} />
                                                        : null
                                    }
                                </> : reportData.type == "detailAnlytical" ?
                                    <ScrollView style={{ width: '100%', }}>
                                        <>
                                            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase' }}>Overall Class Report</Text>
                                            <View style={{ width: '90%', alignSelf: 'center', borderRadius: 6, backgroundColor: SWATheam.SwaWhite, marginVertical: 20, elevation: 9, }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                                    <View style={{ padding: 2, flex: 1, }}>
                                                        <Text style={{ color: SWATheam.SwaBlack }}>Beginner</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                                        <View style={{}}>
                                                            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>0-40%</Text>
                                                        </View>
                                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                            <FontAwesome name="graduation-cap" color={"#e93c12"} size={25} />
                                                        </View>
                                                    </View>
                                                </View>

                                                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                                    <View style={{ padding: 2, flex: 1, }}>
                                                        <Text style={{ color: SWATheam.SwaBlack }}>Average</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                                        <View style={{}}>
                                                            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>41-60%</Text>
                                                        </View>
                                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                            <FontAwesome name="graduation-cap" color={"#009aff"} size={25} />
                                                        </View>
                                                    </View>
                                                </View>

                                                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                                    <View style={{ padding: 2, flex: 1, }}>
                                                        <Text style={{ color: SWATheam.SwaBlack }}>Advance</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                                        <View style={{}}>
                                                            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>61-80%</Text>
                                                        </View>
                                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                            <FontAwesome name="graduation-cap" color={"#911a5c"} size={25} />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, }}>
                                                    <View style={{ padding: 2, flex: 1, }}>
                                                        <Text style={{ color: SWATheam.SwaBlack }}>Proficient</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                                        <View style={{}}>
                                                            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>81-100%</Text>
                                                        </View>
                                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                            <FontAwesome name="graduation-cap" color={"#2e630b"} size={25} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <DetailedAnalyticalReportsGraph reportData={reportData} />
                                        </>
                                    </ScrollView>
                                    : reportData.type == "detailAnlyticalStudentWise" ?
                                        <ScrollView style={{ width: '100%' }}>
                                            <DetailedAnalyticalReportStudentGraph reportData={reportData} subjectID={subjectID} />
                                        </ScrollView>
                                        :
                                        null
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
                    style={{ flex: (reportSubIconID == 60 && (testType == 6 || (testType == 1 || testType == 4))) || reportSubIconID == 62 && testType != 4 || ((userType == 6 || userType == 5) && (userType == 6 || userType == 5) && selectedIcon?.subIconID != 100) || reportSubIconID == 63 && testType == 1 || reportSubIconID == 63 && (testType == 4 || testType == 5) || (reportSubIconID == 64 && testType == 1 || testType == 2) || reportData.type == "detailAnlytical" || reportData.type == "detailAnlyticalStudentWise" ? .1 : .5 }}
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