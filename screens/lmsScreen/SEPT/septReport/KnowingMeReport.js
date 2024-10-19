import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { GlobleData } from '../../../../Store';
import Loader from '../../../common/Loader';
import { SWATheam, apiRoot } from '../../../../constant/ConstentValue';
import Services from '../../../../Services';
import SwaHeader from '../../../common/SwaHeader';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
const colorSwa = '#0c8781';
const font20 = 20;
const font15 = 15;
const font17 = 17;


const KnowingMeReport = ({ navigation, route }) => {
    const { userData } = useContext(GlobleData)
    const [queData, setQueData] = useState({ data: null, status: true })
    const [showKeyNotes, setShowKeyNotes] = useState(false)

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
                    const percentage = res.data.pdCategPercent
                    setQueData((prev) => {
                        return { ...prev, data: res.data.pdCategoryNameList, percentage: percentage, section: 'A', status: false }
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
                                <View style={{ marginTop: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5 }}>
                                        <View style={{ borderBottomWidth: 1, borderColor: colorSwa, paddingVertical: 3, borderBottomWidth: 1, flexDirection: 'row', paddingHorizontal: 1, alignItems: 'center' }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15, width: 250 }]}>{queData.data[0]}</Text>
                                            <View style={{ width: 40, height: 25, backgroundColor: '#a20813' }}></View>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5 }}>
                                        <View style={{ borderBottomWidth: 1, borderColor: colorSwa, paddingVertical: 3, borderBottomWidth: 1, flexDirection: 'row', paddingHorizontal: 1, alignItems: 'center' }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15, width: 250 }]}>{queData.data[1]}</Text>
                                            <View style={{ width: 40, height: 25, backgroundColor: '#39cb4a' }}></View>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5 }}>
                                        <View style={{ borderBottomWidth: 1, borderColor: colorSwa, paddingVertical: 3, borderBottomWidth: 1, flexDirection: 'row', paddingHorizontal: 1, alignItems: 'center' }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15, width: 250 }]}>{queData.data[2]}</Text>
                                            <View style={{ width: 40, height: 25, backgroundColor: '#220884' }}></View>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5 }}>
                                        <View style={{ borderBottomWidth: 1, borderColor: colorSwa, paddingVertical: 3, borderBottomWidth: 1, flexDirection: 'row', paddingHorizontal: 1, alignItems: 'center' }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15, width: 250 }]}>{queData.data[3]}</Text>
                                            <View style={{ width: 40, height: 25, backgroundColor: '#f777ac' }}></View>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5 }}>
                                        <View style={{ borderBottomWidth: 1, borderColor: colorSwa, paddingVertical: 3, borderBottomWidth: 1, flexDirection: 'row', paddingHorizontal: 1, alignItems: 'center' }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15, width: 250 }]}>{queData.data[4]}</Text>
                                            <View style={{ width: 40, height: 25, backgroundColor: '#c4d800' }}></View>
                                        </View>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                        <BarChart
                                            data={{
                                                labels: [queData.data[0], queData.data[1], queData.data[2], queData.data[3], queData.data[4]],
                                                datasets: [
                                                    {
                                                        data: [queData.percentage[0], queData.percentage[1], queData.percentage[2], queData.percentage[3], queData.percentage[4]],
                                                        colors: [
                                                            (opacity = 2) => `#a20813`,
                                                            (opacity = 2) => `#39cb4a`,
                                                            (opacity = 2) => `#220884`,
                                                            (opacity = 2) => `#f777ac`,
                                                            (opacity = 2) => `#c4d800`,
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
                                                barPercentage: 0.50
                                            }}
                                            hideLegend={true}
                                            withCustomBarColorFromData={true}
                                            flatColor={true}
                                            showValuesOnTopOfBars={true}
                                            fromZero={true}
                                            withInnerLines={false}
                                            showBarTops={false}
                                            withVerticalLabels={false}
                                        />
                                    </View>
                                </View>
                            }
                        </ScrollView>
                        <View style={{ backgroundColor: userData.data.colors.hoverTheme, padding: 10, width: '100%', position: 'absolute', bottom: 0 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center' }}>
                                    <TouchableOpacity style={[styles.colorSwa, { borderRadius: 4, padding: 5, justifyContent: 'center' }]} onPress={() => setShowKeyNotes(!showKeyNotes)}>
                                        <Text style={[styles.WtextClr, { textAlign: 'center', fontWeight: 'bold' }]}>View KeyNotes</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                        {showKeyNotes &&
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
                                <View style={{ borderBottomWidth: 1, borderColor: 'grey' }}>
                                    <Text style={{ fontSize: 16, color: SWATheam.SwaWhite, paddingVertical: 10 }}>Knowing Me Key Notes</Text>
                                </View>
                                <ScrollView style={{ position: 'relative', backgroundColor: '#fff' }}>
                                    <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderColor: colorSwa, paddingBottom: 5 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font17, fontWeight: '500' }]}>What you can easily do well. </Text>
                                    </View>
                                    <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 5, paddingBottom: 5 }}>
                                        <Text style={[styles.BlutextClr, { fontSize: font15 }]}>(Results above 60% are taken into consideration) </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font17, marginLeft: 5, fontWeight: '500' }]}>Friendly, Energetic, Extrovert</Text>
                                    </View>
                                    <View style={{ paddingLeft: 25, flexDirection: 'row' }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15 }]}>
                                            These learners learn best by hearing information. They can remember quite accurately the details of any conversation or classes they attend. They have strong language skills, a well-developed vocabulary. They may find learning a foreign language relatively easy. They cannot  keep quiet for long time.
                                            You like talking to and befriending new people. You love spending time, talking and playing with your friends. You often cannot sit at the same place for a long time and like to keep moving about.
                                        </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font17, marginLeft: 5, fontWeight: '500' }]}>Even-tempered, Composed</Text>
                                    </View>
                                    <View style={{ paddingLeft: 25, flexDirection: 'row' }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15 }]}>
                                            You have a calm attitude and you do not get angry easily. You remain composed in the time of trouble and logically think how to solve it instead of panicking. Others often come to you for guidance.
                                        </Text>
                                    </View>
                                    <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderColor: colorSwa, paddingBottom: 5 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font17, fontWeight: '500' }]}>What you should watch out for</Text>
                                    </View>
                                    <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 5, paddingBottom: 5 }}>
                                        <Text style={[styles.BlutextClr, { fontSize: font15 }]}>(Results below 60% need to be improved.) </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 7 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font17, fontWeight: '500', marginLeft: 5 }]}>Experimental, Inquisitive and Imaginative</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            You have shown us time and again how you enjoy experiencing the many novelties all around you. We would like you to tell us more of what you see, enjoy and experience all around you.
                                        </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 7 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font17, fontWeight: '500', marginLeft: 5 }]}>Orderly, Disciplined</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            We really like to tell you that all the occasions when you showed orderliness and discipline that you are capable of, have not been overlooked. We look forward to seeing you repeat these occasions many times more.
                                        </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 7 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font17, fontWeight: '500', marginLeft: 5 }]}>Compassionate, Kind, Sympathetic</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            Your family and friends find you kind, sympathetic and even energetic. So it is time to see you showing these talents of friendship and compassion to others as your sympathetic and energetic ways can win you many laurels.
                                        </Text>
                                    </View>
                                    <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderColor: colorSwa, paddingBottom: 5 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font17, fontWeight: '500' }]}>
                                            Ways to achieve your goal.
                                        </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 7 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font17, fontWeight: '500', marginLeft: 5 }]}>Experimental, Inquisitive and Imaginative</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 10, marginTop: 7, borderWidth: 1 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            Ask questions when in doubt.
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 10, marginTop: 7, borderWidth: 1 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            Try to find answers of your own.
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 10, marginTop: 7, borderWidth: 1 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            If you don't succeed, turn to parents or teachers.
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 10, marginTop: 7, borderWidth: 1 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            Be cautious while trying new activities and old experiences.
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 10, marginTop: 7, borderWidth: 1 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            Remember to have an elder overseeing your activities.
                                        </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 7 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font17, fontWeight: '500', marginLeft: 5 }]}>Orderly, Disciplined</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 10, marginTop: 7, borderWidth: 1 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            Set clear goals and keep aside time to fulfil them.
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 10, marginTop: 7, borderWidth: 1 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            Work at achieving one goal at a time.
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 10, marginTop: 7, borderWidth: 1 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            Develop new habits of neatness, punctuality, and respect for elders, teachers and friends.
                                        </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 7 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font17, fontWeight: '500', marginLeft: 5 }]}>Compassionate, Kind, Sympathetic</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 10, marginTop: 7, borderWidth: 1 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            Communicate your kindness through thought, word and deed.
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 10, marginTop: 7, borderWidth: 1 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            Be an enthusiastic volunteer.
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 10, marginTop: 7, borderWidth: 1 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            Enjoy being a follower also.
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 10, marginTop: 7, borderWidth: 1 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>
                                            Listen to other's needs and help them with encouragement and action, as much as you can.
                                        </Text>
                                    </View>
                                </ScrollView>

                                <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'center', backgroundColor: userData.data.colors.hoverTheme, height: 50, padding: 4, alignItems: 'center' }}>
                                    <TouchableOpacity style={[styles.colorSwa, { borderRadius: 4, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 5, justifyContent: 'center' }]} onPress={() => setShowKeyNotes(!showKeyNotes)}>
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

export default KnowingMeReport

