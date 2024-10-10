import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
import { StackedBarChart, ProgressChart } from "react-native-chart-kit";
import { SwaTheam } from "../../../constant/ConstentValue";
const windowWidth = Dimensions.get('window').width;

const AssessmentReport = ({ reportData, closeModal, colorSwa }) => {

    const fullName = reportData.data?.reportData[0]?.firstName + ' ' + reportData.data?.reportData[0]?.lastName

    console.log(fullName, 'fullName')

    const barWidth = 150

    var levelWiseReport = reportData.data?.reportData[0]?.eadID;
    levelWiseReport = levelWiseReport.split(",");

    let lOneR = 0;
    let lTwoR = 0;
    let lThreeR = 0;

    let totalMarks1 = 0;
    let totalMarks2 = 0;
    let totalMarks3 = 0;

    levelWiseReport.map((item, index) => {
        let levelData = item.split("|");
        let levelID = levelData[2];
        let marksData = levelData[1];
        let percentgeData = levelData[3];

        if (levelID == 1) {
            lOneR += marksData * percentgeData / 100;
            totalMarks1 += parseInt(marksData);
        } else if (levelID == 2) {
            lTwoR += marksData * percentgeData / 100;
            totalMarks2 += parseInt(marksData);
        } else if (levelID == 3) {
            lThreeR += marksData * percentgeData / 100;
            totalMarks3 += parseInt(marksData);
        }
    })

    let rPercentage1 = lOneR / totalMarks1;
    let rPercentage2 = lTwoR / totalMarks2;
    let rPercentage3 = lThreeR / totalMarks3;


    let percent1 = 0
    let percent2 = 0
    let percent3 = 0
    if (lOneR == 0 && totalMarks1 == 0) {
        percent1 = 0
    } else {
        percent1 = rPercentage1
    }

    if (lTwoR == 0 && totalMarks2 == 0) {
        percent2 = 0
    } else {
        percent2 = rPercentage2
    }

    if (lThreeR == 0 && totalMarks3 == 0) {
        percent3 = 0
    } else {
        percent3 = rPercentage3
    }

    const data = {
        labels: ["Engage", "Explore", "Extend"],

        // legend: ["Engage", "L2"],
        data: [
            // [20, 25],
            // [15,45],
            // [25,58]
            [1, percent1],
            [percent2, percent2],
            [percent3, percent3]
        ],
        barColors: ["#39cb4a", "#ffa23a"]
    };

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#fff",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `#000`,
        barPercentage: 1
    };

    return (
        <View style={styles.selectFieldPopUp}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => closeModal()}>
                    <AntDesign name={'close'} size={25} color={'#000'} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={{ paddingHorizontal: 5, flex: 1 }}>
                    <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 10 }}>
                        <Image source={require('../../assets/swaLogoFull.png')} style={{ width: 150, resizeMode: 'contain' }} />
                    </View>
                    <Text style={{ color: '#000', textAlign: 'center', marginTop: 10 }}>Detailed analytical Report of a student</Text>
                    <Text style={{ color: '#000', textAlign: 'center', fontWeight: 500, marginVertical: 30 }}>MY PROGRESS REPORT</Text>
                    <Text style={{ color: '#000', textAlign: 'center' }}>Student: {fullName}</Text>
                    <Text style={{ color: '#000', textAlign: 'center', marginVertical: 30 }}>Class: {reportData.data?.reportData[0]?.classDesc} {reportData.data?.reportData[0]?.sectionName}</Text>
                    <Text style={{ color: '#000', textAlign: 'center' }}>Subject: {reportData.data?.reportData[0]?.subjectName}</Text>
                    <Text style={{ color: '#000', textAlign: 'center', marginVertical: 30 }}>Assessment: {reportData.data?.reportData[0]?.assessmentName}</Text>
                    <View style={{ borderTopWidth: .7, paddingVertical: 30, borderColor: 'grey' }}>
                        <Text style={{ color: '#000', textAlign: 'center', fontWeight: 700, textDecorationLine: 'underline', marginBottom: 20 }}>
                            DIFFICULTY LEVEL ANALYSIS
                        </Text>
                        {percent1 != 0 && percent2 != 0 && percent3 != 0 ?
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
                                        color: (opacity = 0) => SwaTheam.SwaBlack,
                                        strokeWidth: 5,
                                        decimalPlaces: 0

                                    }}
                                    withVerticalLabels={true}
                                    decimalPlaces={0}
                                    fromZero={true}
                                />
                            </ScrollView> : null
                        }
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#39cb4a', marginRight: 5 }}></View>
                                <Text style={{ color: '#000' }}>Correct</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', }}>
                                <View style={{ height: 20, width: 20, backgroundColor: '#ffa23a', marginRight: 5 }}></View>
                                <Text style={{ color: '#000' }}>InCorrect</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ borderWidth: .7, borderLeftWidth: 0, borderRightWidth: 0, paddingTop: 30, borderColor: 'grey' }}>
                        <Text style={{ color: '#000', textAlign: 'center', fontWeight: 700, textDecorationLine: 'underline', marginBottom: 20 }}>
                            SUBJECT WISE PROGRESS
                        </Text>
                        <ScrollView horizontal={true}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{}}>
                                    <ProgressChart
                                        data={{
                                            labels: ["Beginner"],
                                            data: [reportData.data?.reportData[0]?.percentage / 100]
                                        }}
                                        width={200}
                                        height={200}
                                        strokeWidth={30}
                                        radius={60}
                                        chartConfig={{
                                            backgroundColor: "#fff",
                                            backgroundGradientFrom: "#fff",
                                            backgroundGradientTo: "#fff",
                                            decimalPlaces: 2,
                                            color: (opacity = 0) => `rgba(99, 4, 96, ${opacity * 2})`
                                        }}
                                        hideLegend={true}
                                    />
                                    <Text style={{ color: '#000', textAlign: 'center' }}>My Percentage: {reportData.data?.reportData[0]?.percentage} %</Text>
                                </View>
                                <View>
                                    <ProgressChart
                                        data={{
                                            labels: ["Beginner"],
                                            data: [reportData.data?.reportData[0]?.maxParcentage / 100]
                                        }}
                                        width={200}
                                        height={200}
                                        strokeWidth={30}
                                        radius={60}
                                        chartConfig={{
                                            backgroundColor: "#fff",
                                            backgroundGradientFrom: "#fff",
                                            backgroundGradientTo: "#fff",
                                            decimalPlaces: 2,
                                            color: (opacity = 0) => `rgba(57, 203, 74, ${opacity * 2})`
                                        }}
                                        hideLegend={true}
                                    />
                                    <Text style={{ color: '#000', textAlign: 'center' }}>Highest Percentage: {reportData.data?.reportData[0]?.maxParcentage} %</Text>
                                </View>
                                <View style={{}}>
                                    <ProgressChart
                                        data={{
                                            labels: ["Beginner"],
                                            data: [50]
                                        }}
                                        width={200}
                                        height={200}
                                        strokeWidth={30}
                                        radius={60}
                                        chartConfig={{
                                            backgroundColor: "#fff",
                                            backgroundGradientFrom: "#fff",
                                            backgroundGradientTo: "#fff",
                                            decimalPlaces: 2,
                                            color: (opacity = 0) => `rgba(255, 76, 0, ${opacity * 2})`
                                        }}
                                        hideLegend={true}
                                    />
                                    <Text style={{ color: '#000', textAlign: 'center' }}>Lowest Percentage: {reportData.data?.reportData[0]?.minParcentage} %</Text>
                                </View>
                            </View>
                        </ScrollView>
                        <View style={{ borderWidth: .7, marginTop: 20, padding: 10, borderColor: 'grey', borderRadius: 3 }}>
                            <Text style={{ textAlign: 'center', color: '#000' }}>Marks Obtained: {reportData.data?.reportData[0]?.obtainedMarks} / {reportData.data?.reportData[0]?.totalMarks}</Text>
                        </View>
                        <View style={{ marginTop: 5 }}>
                            <Image style={{ height: 20, width: 20, alignSelf: 'flex-end' }} source={require('../../assets/swa_Logo.png')} />
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <ScrollView horizontal={true}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <View style={{ padding: 5, width: 170 }}>
                                        <Image style={{ height: 80, width: 80, alignSelf: 'center' }} source={require('../../assets/smile.png')} />
                                        <Text style={{ textAlign: 'center', color: '#000', marginTop: 5 }}>SUPERLATIVE</Text>
                                    </View>
                                    <View style={{ padding: 5, width: 170 }}>
                                        <Image style={{ height: 80, width: 80, alignSelf: 'center' }} source={require('../../assets/angry.png')} />
                                        <Text style={{ textAlign: 'center', color: '#000', marginTop: 5 }}>SATISFACTORY</Text>
                                    </View>
                                    <View style={{ padding: 5, width: 170 }}>
                                        <Image style={{ height: 80, width: 80, alignSelf: 'center' }} source={require('../../assets/sad.png')} />
                                        <Text style={{ textAlign: 'center', color: '#000', marginTop: 5 }}>IMMEDIATE ATTENTION</Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                        <Text style={{ textAlign: 'center', color: '#000', fontWeight: 700, marginBottom: 10, textDecorationLine: 'underline' }}>DETAILED SUBJECT-WISE PROJECT: {reportData.data?.reportData[0]?.subjectName}</Text>
                        <View style={{ padding: 5, borderWidth: .7, borderColor: 'grey', borderRadius: 3 }}>
                            {
                                reportData.data?.reportDataChapterWise?.map((item, index) => {
                                    const progressWidth = item.obtainedMarks / item.marks * barWidth
                                    let subWisePsercentage = Math.round(item.obtainedMarks / item.marks * 100);
                                    let minVal = 0;
                                    let maxVal = 0;

                                    let percentage = reportData.data.subjectWiseReportOfClass[index] != undefined ? reportData.data.subjectWiseReportOfClass[index].percentage : "";

                                    if (typeof percentage != "number") {
                                        percentage = percentage.split(",");
                                        if (percentage[1] != undefined) {

                                            minVal = Math.min(...percentage)
                                            maxVal = Math.max(...percentage)

                                        }
                                    } else {
                                        minVal = percentage;
                                        maxVal = percentage;
                                    }

                                    minVal = minVal.toFixed(2)
                                    maxVal = maxVal.toFixed(2)

                                    let progressColor = "";
                                    let imgSrc = ""
                                    let printMsg = ""
                                    if (subWisePsercentage >= 81 && subWisePsercentage <= 100 && progressWidth != 0) {
                                        progressColor = "#00ac70";
                                        imgSrc = <Image style={{ height: 30, width: 30, alignSelf: 'center' }} source={require('../../assets/smile.png')} />
                                        printMsg = <Text style={{ color: '#000', fontWeight: 700 }}>Excellent</Text>
                                    } else if (subWisePsercentage >= 61 && subWisePsercentage <= 80 && progressWidth != 0) {
                                        progressColor = "#630460";
                                        imgSrc = <Image style={{ height: 30, width: 30, alignSelf: 'center' }} source={require('../../assets/angry.png')} />
                                        printMsg = <Text style={{ color: '#000', fontWeight: 700 }}>Progressive</Text>
                                    } else if (subWisePsercentage >= 41 && subWisePsercentage <= 60 && progressWidth != 0) {
                                        progressColor = "#ff4c00";
                                        imgSrc = <Image style={{ height: 30, width: 30, alignSelf: 'center' }} source={require('../../assets/sad.png')} />
                                        printMsg = <Text style={{ color: '#000', fontWeight: 700 }}>Progressive</Text>
                                    }
                                    else {
                                        if (progressWidth == 0) {
                                            progressColor = "#e9ecef";
                                        } else {
                                            progressColor = "#f8941d";
                                        }
                                        printMsg = <TouchableOpacity style={{ backgroundColor: '#ff4c00', paddingHorizontal: 10, borderRadius: 3, paddingVertical: 3 }}>
                                            <Text style={{ color: '#fff' }}>Go to Learning Module</Text>
                                        </TouchableOpacity>
                                        imgSrc = <Image style={{ height: 30, width: 30, alignSelf: 'center' }} source={require('../../assets/sad.png')} />
                                    }

                                    return (
                                        <View style={{ borderWidth: .7, borderColor: 'grey', borderRadius: 3, padding: 5, marginBottom: 5 }} key={index}>
                                            <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                                                <View style={{}}>
                                                    <Text style={{ color: '#000' }}>CHAPTER NAME: </Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: '#000' }}>{item.chapterName}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{}}>
                                                    <Text style={{ color: '#000' }}>MY PROGRESS: </Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={{ width: 50 }}>
                                                        <Text style={{ color: '#000', textAlign: 'center' }}>{subWisePsercentage} %</Text>
                                                    </View>
                                                    <View style={{ backgroundColor: '#e9ecef', width: barWidth }}>
                                                        <View style={{ backgroundColor: progressColor, padding: 5, width: progressWidth }}>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ marginVertical: 7 }}>
                                                <Text style={{ color: '#000', textDecorationLine: 'underline', textAlign: 'center' }}>CLASSROOM PROGRESS</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 5 }}>
                                                    <Text style={{ color: '#000' }}>MAXIMUM</Text>
                                                    <Text style={{ color: '#000' }}>MINIMUM</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                                    <Text style={{ color: '#000' }}>{maxVal} %</Text>
                                                    <Text style={{ color: '#000' }}>{minVal} %</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginBottom: 7, alignItems: 'center' }}>
                                                <View style={{}}>
                                                    <Text style={{ color: '#000' }}>REMARKS: </Text>
                                                </View>
                                                <View stye={{}}>
                                                    {imgSrc}
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{}}>
                                                    <Text style={{ color: '#000' }}>TUTORIAL: </Text>
                                                </View>
                                                <View stye={{}}>
                                                    {printMsg}
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        <View style={{ marginTop: 5 }}>
                            <Image style={{ height: 20, width: 20, alignSelf: 'flex-end' }} source={require('../../assets/swaLogoMini.png')} />
                        </View>
                        <View style={{ borderTopWidth: .7, borderColor: 'grey', padding: 5 }}>
                            <Text style={{ color: '#000', textDecorationLine: 'underline', textAlign: 'center', fontWeight: 700 }}>
                                BASED ON TEST SCORES, STUDENTS ARE DIVIDED IN FOUR CATEGORIES
                            </Text>
                            <ScrollView horizontal={true}>
                                <View style={{ flex: 1, marginTop: 20 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                        <View style={{ padding: 5, width: 140 }}>
                                            <Image style={{ height: 80, width: 80, alignSelf: 'center' }} source={require('../../assets/graduate1.png')} />
                                            <Text style={{ textAlign: 'center', color: '#000', marginTop: 5 }}>
                                                Beginner : 0-40%
                                            </Text>
                                        </View>
                                        <View style={{ padding: 5, width: 140 }}>
                                            <Image style={{ height: 80, width: 80, alignSelf: 'center' }} source={require('../../assets/graduate2.png')} />
                                            <Text style={{ textAlign: 'center', color: '#000', marginTop: 5 }}>
                                                Average : 41-60%
                                            </Text>
                                        </View>
                                        <View style={{ padding: 5, width: 140 }}>
                                            <Image style={{ height: 80, width: 80, alignSelf: 'center' }} source={require('../../assets/graduate3.png')} />
                                            <Text style={{ textAlign: 'center', color: '#000', marginTop: 5 }}>
                                                Advance : 61-80%
                                            </Text>
                                        </View>
                                        <View style={{ padding: 5, width: 140 }}>
                                            <Image style={{ height: 80, width: 80, alignSelf: 'center' }} source={require('../../assets/graduate4.png')} />
                                            <Text style={{ textAlign: 'center', color: '#000', marginTop: 5 }}>
                                                Proficient : 81-100%
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </ScrollView >
        </View >

    )
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 20,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#000',
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    flexContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },

    BtextClr: {
        color: '#000'
    },

    thClr: {
        color: '#654b25'
    },

    colorSwa: {
        color: '#0c8781'
    },

    WtextClr: {
        color: '#fff'
    },

    selectFieldPopUp: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        // backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
    },

    TxtInput: {
        borderWidth: .7,
        borderColor: 'grey',
        marginBottom: 7,
        borderRadius: 5,
        paddingHorizontal: 7
    }

});

export default AssessmentReport