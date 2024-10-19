import React, { useState, useEffect, useContext } from 'react';
// import { useWindowDimensions } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import { PieChart, ProgressChart } from "react-native-chart-kit";
import SwaHeader from '../../../common/SwaHeader';
import Loader from '../../../common/Loader';
import { GlobleData } from '../../../../Store';
import { SWATheam, apiRoot } from '../../../../constant/ConstentValue';
import Services from '../../../../Services';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
const colorSwa = '#0c8781';
const rightClr = '#198754';
const wrongClr = '#dc3545';
const font20 = 20;
const font15 = 15;
const font17 = 17;


const AcademicReport = ({ navigation, route }) => {
    const { userData } = useContext(GlobleData)
    const [queData, setQueData] = useState({ data: null, status: true })
    const [showAnswer, setShowAnswer] = useState(false)

    useEffect(() => {
        getReport()
    }, [])


    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }



    function getReport() {
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "userRefID": userData.data.userRefID,
            "testID": route.params.testID,
            "classID": userData.data.classID,
            "sectionID": userData.data.sectionID
        }

        Services.post(apiRoot.reportSEPT, payload)
            .then((res) => {
                if (res.status == "success") {
                    const section = res.data.section
                    const percentage = res.data.totalPercentage
                    setQueData((prev) => {
                        return { ...prev, data: res.data.quesData, percentage: percentage, section: section, status: false }
                    })
                } else {

                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {

            })

    }

    const insets = useSafeAreaInsets()

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['left', 'right', "top"]} style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme, }}>
                {queData.status ?
                    <Loader />
                    :
                    <View style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : 24, backgroundColor: userData?.data?.colors.liteTheme, paddingBottom: insets.bottom }}>
                        <SwaHeader title={route.params.testType} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
                        <View style={{ backgroundColor: userData.data.colors.hoverTheme, padding: 8 }}>
                            <View>
                                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700' }}>Name: {userData.data.fullname} ({userData.data.className}-{userData.data.sectionName})</Text>
                            </View>

                        </View>
                        {queData.status ?
                            <View>
                                <Text style={{ fontSize: font17 }}>Data Not Found</Text>
                            </View> :
                            <View style={{ padding: 8 }}>
                                <View style={{ marginVertical: 10 }}>
                                    <View style={{ paddingLeft: 10 }}>
                                        <Text style={[styles.BtextClr, { fontWeight: '500', fontSize: font15 }]}>You are improving every day - Average</Text>
                                        <Text style={[styles.BtextClr, { fontSize: font15 }]}>This is not a bad score, but you still need to work hard so you can get even better</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <View style={{ borderBottomWidth: 1, borderColor: colorSwa, padding: 2 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15, width: 120, padding: 5 }]}>Beginner</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: colorSwa, width: 120 }}>
                                        <View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, padding: 5, paddingLeft: 10 }]}>1-40%</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <View style={{ width: 40, height: 25, backgroundColor: '#e93c12' }}></View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <View style={{ borderBottomWidth: 1, borderColor: colorSwa, padding: 2 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15, padding: 5, width: 120 }]}>Average</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: colorSwa, width: 120 }}>
                                        <View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, padding: 5, paddingLeft: 10 }]}>41-60%</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <View style={{ width: 40, height: 25, backgroundColor: '#009aff' }}></View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <View style={{ borderBottomWidth: 1, borderColor: colorSwa, padding: 2 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15, padding: 5, width: 120 }]}>Advance</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: colorSwa, width: 120 }}>
                                        <View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, padding: 5, paddingLeft: 10 }]}>61-80%</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <View style={{ width: 40, height: 25, backgroundColor: '#911a5c' }}></View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <View style={{ borderBottomWidth: 1, borderColor: colorSwa, padding: 2 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15, padding: 5, width: 120 }]}>Proficient</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: colorSwa, width: 120 }}>
                                        <View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, padding: 5, paddingLeft: 10 }]}>81-100%</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <View style={{ width: 40, height: 25, backgroundColor: '#2e630b' }}></View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                    <ProgressChart
                                        data={{
                                            labels: ["Beginner"],
                                            data: [queData.percentage / 100]
                                        }}
                                        width={350}
                                        height={200}
                                        strokeWidth={30}
                                        radius={70}
                                        chartConfig={{
                                            backgroundColor: "#fff",
                                            backgroundGradientFrom: "#fff",
                                            backgroundGradientTo: "#fff",
                                            decimalPlaces: 2,
                                            color: (opacity = 0) => queData.percentage < 41 ? `rgba(233, 60, 18, ${opacity * 2})` : queData.percentage >= 41 && queData.percentage <= 60 ? `rgba(0, 154, 255, ${opacity * 2})` : queData.percentage >= 61 && queData.percentage <= 80 ? `rgba(145, 26, 92, ${opacity * 2})` : `rgba(46, 99, 11, ${opacity * 2})`,
                                        }}
                                        hideLegend={true}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    {
                                        queData.percentage <= 40 ?
                                            <Text style={{ color: '#e93c12', fontSize: font17, fontWeight: '500', marginTop: 20, borderColor: '#e93c12', padding: 1 }}>Beginner {queData.percentage}%</Text> :
                                            queData.percentage >= 41 && queData.percentage <= 60 ?
                                                <Text style={{ color: '#009aff', fontSize: font17, fontWeight: '500', marginTop: 20, borderColor: '#009aff', padding: 1 }}>Average {queData.percentage}%</Text> :
                                                queData.percentage >= 61 && queData.percentage <= 80 ?
                                                    <Text style={{ color: '#911a5c', fontSize: font17, fontWeight: '500', marginTop: 20, borderColor: '#911a5c', padding: 1 }}>Advance {queData.percentage}%</Text> :
                                                    <Text style={{ color: '#2e630b', fontSize: font17, fontWeight: '500', marginTop: 20, borderColor: '#2e630b', padding: 1 }}>Proficient {queData.percentage}%</Text>
                                    }
                                </View>
                            </View>
                        }
                        <View style={{ backgroundColor: userData.data.colors.hoverTheme, padding: 10, width: '100%', position: 'absolute', bottom: 0 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center' }}>
                                    <TouchableOpacity style={[styles.colorSwa, { borderRadius: 4, padding: 5, justifyContent: 'center' }]} onPress={() => setShowAnswer(!showAnswer)}>
                                        <Text style={[styles.WtextClr, { textAlign: 'center', fontWeight: 'bold' }]}>View Answer</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', }}>
                                    <View>
                                        <TouchableOpacity style={[styles.colorSwa, { borderRadius: 4, flexDirection: 'row', padding: 5, justifyContent: 'center' }]}
                                            onPress={() => navigation.goBack()}
                                        >
                                            <Text style={[styles.WtextClr, { textAlign: 'center', fontWeight: 'bold' }]}>Go Back</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {showAnswer &&
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: userData.data.colors.mainTheme,
                                paddingVertical: 20,
                                paddingHorizontal: 10,
                                paddingBottom: 50
                            }}>
                                <ScrollView>
                                    {
                                        queData.data.map((item, index) => {
                                            return (
                                                <View style={{ backgroundColor: SWATheam.SwaWhite, marginBottom: 10, padding: 10, borderRadius: 5 }} key={index}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 55 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700' }}>Q.{index + 1}.</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700' }}>{item.questionText}</Text>
                                                            <View style={{ marginTop: 6 }}>

                                                                <View style={{ flexDirection: 'row', marginBottom: 5, borderBottomWidth: .5, paddingVertical: 4 }}>
                                                                    <View style={{ width: 100 }}>
                                                                        <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700' }}>Right Answer</Text>
                                                                    </View>
                                                                    <View style={{ marginHorizontal: 6 }}>
                                                                        <Text>:</Text>
                                                                    </View>
                                                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                                                        <Text style={[styles.BtextClr, { fontSize: font15 }]}>{item.rightAnswerText}</Text>
                                                                    </View>
                                                                </View>


                                                                <View style={{ flexDirection: 'row', marginBottom: 5, marginBottom: 5, borderBottomWidth: .5, paddingVertical: 4 }}>
                                                                    <View style={{ width: 100 }}>
                                                                        <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700' }}>Your Answer</Text>
                                                                    </View>
                                                                    <View style={{ marginHorizontal: 6 }}>
                                                                        <Text>:</Text>
                                                                    </View>
                                                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                                                        <Text style={[styles.BtextClr, { fontSize: font15 }]}>{item.selectedOptionText}</Text>
                                                                    </View>
                                                                </View>


                                                                <View style={{ flexDirection: 'row', }}>
                                                                    <View style={{ width: 100 }}>
                                                                        <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700' }}>Result</Text>
                                                                    </View>
                                                                    <View style={{ marginHorizontal: 6 }}>
                                                                        <Text>:</Text>
                                                                    </View>
                                                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                                                        {item.rightAnswer == item.selectedOptionID ?
                                                                            <Text style={[styles.BtextClr, { fontSize: font15, color: rightClr }]}>&#10004;</Text> :
                                                                            <Text style={[styles.BtextClr, { fontSize: font15, color: wrongClr }]}>&#10008;</Text>
                                                                        }
                                                                    </View>
                                                                </View>


                                                            </View>
                                                        </View>
                                                    </View>

                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>

                                <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'center', backgroundColor: userData.data.colors.hoverTheme, height: 50, padding: 4, alignItems: 'center' }}>
                                    <TouchableOpacity style={[styles.colorSwa, { borderRadius: 4, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'center' }]} onPress={() => setShowAnswer(!showAnswer)}>
                                        <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                }
            </SafeAreaView>
        </SafeAreaProvider>
    )
}


const styles = StyleSheet.create({

    BtextClr: {
        color: '#000'
    },

    WtextClr: {
        color: '#fff'
    },

    colorSwa: {
        backgroundColor: colorSwa,
    },

    answerPopup: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 5,
        paddingBottom: 50
    }



});

export default AcademicReport

