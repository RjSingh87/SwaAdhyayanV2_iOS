import { StyleSheet, Text, View, ScrollView, Dimensions, Image } from 'react-native'
import React, { useContext } from 'react'
import { SWATheam } from '../../../../constant/ConstentValue'
import { StackedBarChart, PieChart } from "react-native-chart-kit";
import { GlobleData } from '../../../../Store';
const windowWidth = Dimensions.get('window').width;

const DetailedAnalyticalReportStudentGraph = ({ reportData, subjectID }) => {
    const { userData } = useContext(GlobleData)

    console.log(JSON.stringify(reportData), 'check reportData')
    console.log(subjectID, 'check selectedField')

    const data = {
        labels: ["Engage", "Explore", "Extend"],
        // legend: ["Engage", "L2"],
        data: [
            [reportData.data.subjectDifficulty[subjectID.subjectID].percentage.engage, 100 - reportData.data.subjectDifficulty[subjectID.subjectID].percentage.engage],
            [reportData.data.subjectDifficulty[subjectID.subjectID].percentage.explore, 100 - reportData.data.subjectDifficulty[subjectID.subjectID].percentage.explore],
            [reportData.data.subjectDifficulty[subjectID.subjectID].percentage.extend, 100 - reportData.data.subjectDifficulty[subjectID.subjectID].percentage.extend],

        ],
        barColors: ["#4e9221", "#ff7d5e"]
    };
    const data1 = [
        {
            population: reportData.data.subjectMarks.userMarks.percentage,
            color: "#ab72ad",
            name: "Seoul",
        },
        {
            population: reportData.data.subjectMarks.maxMarks.percentage,
            color: "#62b2ff",
            name: "Seoul",
        },
        {
            population: reportData.data.subjectMarks.minMarks.percentage,
            color: "#d78388",
            name: "Seoul",
        },
    ];

    return (
        <View>
            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase' }}>Overall Class Report</Text>
            <ScrollView horizontal={true}>
                <StackedBarChart
                    data={data}
                    width={windowWidth}
                    height={220}
                    chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        decimalPlaces: 2,
                        color: (opacity = 0) => SWATheam.SwaBlack,
                        strokeWidth: 5,
                        decimalPlaces: 0

                    }}
                    withVerticalLabels={true}
                    decimalPlaces={0}
                    fromZero={true}
                />
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 10 }}>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                    <View style={{ width: 20, height: 20, backgroundColor: '#4e9221' }}></View>
                    <Text style={{ marginLeft: 10, color: SWATheam.SwaBlack }}>Correct</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                    <View style={{ width: 20, height: 20, backgroundColor: '#ff7d5e' }}></View>
                    <Text style={{ marginLeft: 10, color: SWATheam.SwaBlack }}>Incorrect</Text>
                </View>
            </View>
            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase', marginVertical: 20 }}>Overall Class Report</Text>

            <View style={{ width: '80%', alignSelf: 'center', backgroundColor: SWATheam.SwaWhite, borderRadius: 10, elevation: 9, padding: 6, marginVertical: 6 }}>
                <View style={{ padding: 4, flexDirection: 'row' }}>
                    <Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>Max Percentage :</Text>
                    <Text style={{ color: SWATheam.SwaBlack, width: 80 }}>{reportData.data.subjectMarks.maxMarks.percentage}%</Text>
                    <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: '#62b2ff' }}></View>
                </View>
                <View style={{ padding: 4, flexDirection: 'row', }}>
                    <Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>Min Percentage : </Text>
                    <Text style={{ color: SWATheam.SwaBlack, width: 80 }}>{reportData.data.subjectMarks.minMarks.percentage}%</Text>
                    <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: '#d78388' }}></View>
                </View>

                <View style={{ padding: 4, flexDirection: 'row', }}>
                    <Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>My Percentage :</Text>
                    <Text style={{ color: SWATheam.SwaBlack, width: 80 }}>{reportData.data.subjectMarks.userMarks.percentage}%</Text>
                    <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: '#ab72ad' }}></View>
                </View>
            </View>

            <PieChart
                data={data1}
                width={windowWidth}
                height={250}
                chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: "#fff",
                    backgroundGradientToOpacity: 1,
                    color: (opacity = 1) => `rgba(91, 24, 7, ${opacity})`,
                    strokeWidth: 2, // optional, default 3
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false // optional
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[75, 0]}
                hasLegend={false}
                absolute
            />

            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase', marginTop: 20 }}>detailed CHAPTER-WISE PROGRESS | subject : english</Text>

            <View style={{ padding: 10, marginTop: 10 }}>
                {reportData.data.chapterDetails.map((item, index) => {

                    let smileName = require('../../../assets/smile.png')
                    if (item.max >= 81 && item.max <= 100) {
                        smileName = require('../../../assets/smile.png');
                    } else if (item.max >= 61 && item.max <= 80) {
                        smileName = require('../../../assets/smile.png');
                    } else if (item.max >= 41 && item.max <= 60) {
                        smileName = require('../../../assets/angry.png');
                    } else if (item.max >= 0 && item.max <= 40) {
                        smileName = require('../../../assets/sad.png');
                    }

                    return (
                        <View style={{ backgroundColor: userData.data.colors.liteTheme, padding: 6, borderRadius: 6, marginBottom: 15 }} key={item.chapterID}>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: userData.data.colors.mainTheme, paddingVertical: 10 }}>
                                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', width: 80 }}>Chapter :</Text>
                                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', flex: 1 }}>{item.chapterName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderColor: userData.data.colors.mainTheme, }}>
                                <Text style={{ color: SWATheam.SwaBlack, width: 130, fontWeight: '700' }}>My Progress :</Text>
                                <Text style={{ color: SWATheam.SwaBlack, flex: 1, textAlign: 'right' }}>{item.myProgress}%</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderColor: userData.data.colors.mainTheme, alignItems: 'center' }}>
                                <Text style={{ color: SWATheam.SwaBlack, width: 130, fontWeight: '700' }}>Class Progress :</Text>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ flex: 1, color: SWATheam.SwaBlack, textAlign: 'center', fontWeight: '700' }}>Min. Marks</Text>
                                        <Text style={{ flex: 1, color: SWATheam.SwaBlack, textAlign: 'center', fontWeight: '700' }}>Max. Marks</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ flex: 1, color: SWATheam.SwaBlack, textAlign: 'center', paddingVertical: 6 }}>{item.min}%</Text>
                                        <Text style={{ flex: 1, color: SWATheam.SwaBlack, textAlign: 'center', paddingVertical: 6 }}>{item.max}%</Text>
                                    </View>

                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingVertical: 6, alignItems: 'center' }}>
                                <Text style={{ color: SWATheam.SwaBlack, flex: 1, fontWeight: '700' }}>Remark :</Text>
                                <Image source={smileName} style={{ height: 30, width: 30, alignSelf: 'flex-end' }} />

                            </View>
                        </View>

                    )
                })}
            </View>
        </View>
    )
}

export default DetailedAnalyticalReportStudentGraph

const styles = StyleSheet.create({})