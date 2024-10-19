import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from "react-native";
import { BarChart } from "react-native-chart-kit";
import Loader from '../../../common/Loader';
import { GlobleData } from '../../../../Store';
import Services from '../../../../Services';
import { SWATheam, apiRoot } from '../../../../constant/ConstentValue';
import SwaHeader from '../../../common/SwaHeader';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
const colorSwa = '#0c8781';
const font20 = 20;
const font15 = 15;
const font17 = 17;


const BrainDominReport = ({ navigation, route }) => {
    const { userData } = useContext(GlobleData)
    const [queData, setQueData] = useState({ data: null, status: true })

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
                    const leftPer = res.data.leftPercentage
                    const rightPer = res.data.rightPercentage
                    setQueData((prev) => {
                        return { ...prev, leftPer: leftPer, rightPer: rightPer, section: 'A', status: false }
                    })
                } else {

                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {

            })

    }


    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['left', 'right', 'top']} style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme }}>
                {queData.status ?
                    <Loader />
                    :
                    <View style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : 24, backgroundColor: userData.data.colors.liteTheme }}>
                        <SwaHeader title={route.params.testType} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
                        <View style={{ backgroundColor: userData.data.colors.hoverTheme, padding: 8 }}>
                            <View>
                                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700' }}>Name: {userData.data.fullname} ({userData.data.className}-{userData.data.sectionName})</Text>
                            </View>
                        </View>
                        <ScrollView>
                            {queData.status ?
                                <View>
                                    <Text style={{ fontSize: font17 }}>Data Not Found</Text>
                                </View> :
                                <View style={{ marginTop: 5, paddingBottom: 40 }}>
                                    <View>
                                        <View style={{ paddingHorizontal: 9, flexDirection: 'row', marginVertical: 5 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500', borderBottomWidth: 1 }]}>
                                                Brain Dominance
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1, paddingHorizontal: 10, marginBottom: 5 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>
                                                You display nearly equal dominance in both sides of your brain. This means that you like to study almost all your subjects. The subjects you  like most and are good at, will become clearer as you are promoted to higher classes
                                            </Text>
                                        </View>
                                        <View style={{ marginVertical: 3, flexDirection: 'row', paddingLeft: 15 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>You like to keep your feelings to yourself, and are still able to share and talk about your life with your friends</Text>
                                        </View>
                                        <View style={{ marginVertical: 3, flexDirection: 'row', paddingLeft: 15 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>You like to maintain a balance in everything</Text>
                                        </View>
                                        <View style={{ marginVertical: 3, flexDirection: 'row', paddingLeft: 15 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>You are an all-rounder. You are good at certain subjects, some sport(s), and some extra curricular activities like music or dances as well.</Text>
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                            <BarChart
                                                data={{
                                                    labels: ["Left Brain", "Right Brain"],
                                                    datasets: [
                                                        {
                                                            data: [queData.leftPer, queData.rightPer],
                                                            colors: [
                                                                (opacity = 2) => `#268f9e`,
                                                                (opacity = 2) => `#a5050f`,
                                                            ]
                                                        }
                                                    ]
                                                }}
                                                width={350}
                                                height={250}
                                                chartConfig={{
                                                    backgroundColor: "#fff",
                                                    backgroundGradientFrom: "#dfd9d9",
                                                    backgroundGradientTo: "#dfd9d9",
                                                    decimalPlaces: 2,
                                                    color: (opacity = 0) => `#000`,
                                                    barPercentage: 1
                                                }}
                                                hideLegend={true}
                                                withCustomBarColorFromData={true}
                                                flatColor={true}
                                                showValuesOnTopOfBars={true}
                                                fromZero={true}
                                                withInnerLines={false}
                                                showBarTops={false}
                                            />
                                        </View>
                                    </View>
                                </View>
                            }
                        </ScrollView>
                        <View style={{ backgroundColor: userData.data.colors.hoverTheme, padding: 10, width: '100%', position: 'absolute', bottom: 0 }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ marginEnd: 10 }}>
                                    <TouchableOpacity style={[styles.colorSwa, { borderRadius: 4, flexDirection: 'row', padding: 5, justifyContent: 'center' }]}
                                        onPress={() => navigation.goBack()}
                                    >
                                        <Text style={[styles.WtextClr, { textAlign: 'center', fontWeight: 'bold' }]}>Go Back</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
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

    GtextClr: {
        color: '#198754'
    },

    BlutextClr: {
        color: '#0d6efd'
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

export default BrainDominReport

