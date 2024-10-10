import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import GraphLegend from './GraphLegend'
import { GlobleData } from '../../../../Store'
import AcademicProficiency from './AcademicProficiency'
import { SWATheam } from '../../../../constant/ConstentValue'
import LearningReport from '../../SEPT/septReport/LearningReport'
import LearningStyle from './LearningStyle'
import MultipleIntelligences from './MultipleIntelligences'
import KnowingMe from './KnowingMe'
import BrainDominance from './BrainDominance'

const ConsolidatedReport = ({ reportData, testType, type }) => {
    const { userData } = useContext(GlobleData)
    let testLable = ''
    if (reportData?.APP?.totalPercentage <= 40) {
        testLable = "Beginner"
    } else if (reportData?.APP?.totalPercentage >= 40 && reportData?.APP?.totalPercentage >= 60) {
        testLable = "Average"
    } else if (reportData?.APP?.totalPercentage >= 61 && reportData?.APP?.totalPercentage <= 80) {
        testLable = "Advance"
    } else {
        testLable = "Proficient"
    }

    return (
        <View style={{ width: '100%' }}>
            <ScrollView>
                {reportData.APP != null ?
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: '500', color: userData.data.colors.mainTheme, borderBottomWidth: .5, padding: 10 }}> Academic Proficiency Profile </Text>
                        <GraphLegend testType={testType} reportData={reportData} type={type == 'student' ? "studentConslAcmid" : 'consolidateAPP'} />
                        <ScrollView>
                            <AcademicProficiency reportData={reportData} testType={testType} type={type} />
                        </ScrollView>
                        {reportData?.APP?.totalPercentage != undefined ?
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ padding: 10, color: SWATheam.SwaBlack, textAlign: 'center', fontWeight: '500' }}>{testLable} {reportData?.APP?.totalPercentage}%</Text>
                            </View> : null
                        }
                    </View> :
                    <View style={{ padding: 10, backgroundColor: SWATheam.SwaLightBlue }}>
                        <Text style={{ textAlign: 'center', color: SWATheam.SwaBlue }}>Academic Proficiency Profile Test Not Attempted.</Text>
                    </View>
                }
                {reportData.LS != null ?
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: '500', color: userData.data.colors.mainTheme, borderBottomWidth: .5, padding: 10, marginBottom: 10 }}> Learning Style </Text>
                        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LearningStyle reportData={reportData} testType={testType} />
                        </ScrollView>
                    </View> :
                    <View style={{ padding: 10, backgroundColor: SWATheam.SwaLightBlue }}>
                        <Text style={{ textAlign: 'center', color: SWATheam.SwaBlue }}>Learning Style Test Not Attempted.</Text>
                    </View>
                }
                {reportData.MI != null ?
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: '500', color: userData.data.colors.mainTheme, borderBottomWidth: .5, padding: 10, marginBottom: 10 }}>  Multiple Intelligences</Text>
                        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <MultipleIntelligences reportData={reportData} testType={testType} type={type} />
                        </ScrollView>
                    </View> :
                    <View style={{ padding: 10, backgroundColor: SWATheam.SwaLightBlue }}>
                        <Text style={{ textAlign: 'center', color: SWATheam.SwaBlue }}>Multiple Intelligence Test Not Attempted.</Text>
                    </View>
                }
                {reportData.KM != null ?
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: '500', color: userData.data.colors.mainTheme, borderBottomWidth: .5, padding: 10, marginBottom: 10 }}>  Knowing Me</Text>
                        <GraphLegend testType={testType} reportData={reportData} type={type == 'student' ? 'studentConslknowingMe' : 'consolidateKM'} />
                        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <KnowingMe reportData={reportData} testType={testType} type={type} />
                        </ScrollView>
                    </View> :
                    <View style={{ padding: 10, backgroundColor: SWATheam.SwaLightBlue }}>
                        <Text style={{ textAlign: 'center', color: SWATheam.SwaBlue }}>Knowing Me Test Not Attempted.</Text>
                    </View>
                }
                {reportData.BD != null ?
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: '500', color: userData.data.colors.mainTheme, borderBottomWidth: .5, padding: 10, marginBottom: 10 }}>Brain Dominance</Text>
                        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <BrainDominance reportData={reportData} testType={testType} type={type} />
                        </ScrollView>
                    </View> :
                    <View style={{ padding: 10, backgroundColor: SWATheam.SwaLightBlue }}>
                        <Text style={{ textAlign: 'center', color: SWATheam.SwaBlue }}>Brain Dominance Test Not Attempted.</Text>
                    </View>
                }
            </ScrollView>
        </View>
    )
}

export default ConsolidatedReport

const styles = StyleSheet.create({})