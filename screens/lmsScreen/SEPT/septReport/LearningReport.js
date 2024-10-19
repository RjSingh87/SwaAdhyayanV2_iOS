import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Platform } from "react-native";
import { BarChart } from "react-native-chart-kit";
import Loader from '../../../common/Loader';
import { GlobleData } from '../../../../Store';
import Services from '../../../../Services';
import { SWATheam, apiRoot } from '../../../../constant/ConstentValue';
import SwaHeader from '../../../common/SwaHeader';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
const colorSwa = '#0c8781';
const rightClr = '#198754';
const wrongClr = '#dc3545';
const font20 = 20;
const font15 = 15;
const font17 = 17;


const LearningReport = ({ navigation, route }) => {

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
                    const percentage = res.data.totalPercentage
                    setQueData((prev) => {
                        return { ...prev, data: res.data.imData, percentage: percentage, section: section, status: false }
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
                                <View style={{ padding: 8 }}>
                                    <View style={{ marginVertical: 10 }}>
                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font17, fontWeight: '500', borderBottomWidth: 1, padding: 1 }]}>Learning Style</Text>
                                        </View>
                                        <View style={{ paddingLeft: 10, marginVertical: 5 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{ backgroundColor: '#000', height: 8, width: 8, borderRadius: 10, marginRight: 5 }}></View>
                                                <Text style={[styles.BtextClr, { fontWeight: '500', fontSize: font15 }]}>Preferred</Text>
                                            </View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, paddingLeft: 15 }]}>Visual Learning Style</Text>
                                        </View>
                                        <View style={{ paddingLeft: 10, marginVertical: 5 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{ backgroundColor: '#000', height: 8, width: 8, borderRadius: 10, marginRight: 5 }}></View>
                                                <Text style={[styles.BtextClr, { fontWeight: '500', fontSize: font15 }]}>Favoured</Text>
                                            </View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, paddingLeft: 15 }]}>Auditory Learning Style</Text>
                                        </View>
                                        <View style={{ paddingLeft: 10, marginVertical: 5 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{ backgroundColor: '#000', height: 8, width: 8, borderRadius: 10, marginRight: 5 }}></View>
                                                <Text style={[styles.BtextClr, { fontWeight: '500', fontSize: font15 }]}>Situational</Text>
                                            </View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, paddingLeft: 15 }]}>Kinesthetic Learning Style</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5 }}>
                                        <View style={{ borderBottomWidth: 1, borderColor: colorSwa, paddingVertical: 3, borderBottomWidth: 1, flexDirection: 'row', width: 250, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 1 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>Visual</Text>
                                            <View style={{ width: 40, height: 25, backgroundColor: '#a20813' }}></View>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5 }}>
                                        <View style={{ borderBottomWidth: 1, borderColor: colorSwa, paddingVertical: 3, borderBottomWidth: 1, flexDirection: 'row', width: 250, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 1 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>Auditory</Text>
                                            <View style={{ width: 40, height: 25, backgroundColor: '#39cb4a' }}></View>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5 }}>
                                        <View style={{ borderBottomWidth: 1, borderColor: colorSwa, paddingVertical: 3, borderBottomWidth: 1, flexDirection: 'row', width: 250, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 1 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>Kinesthetic</Text>
                                            <View style={{ width: 40, height: 25, backgroundColor: '#220884' }}></View>
                                        </View>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                        <BarChart
                                            data={{
                                                labels: ["Visual", "Auditory", "Kinesthetic"],
                                                datasets: [
                                                    {
                                                        data: [queData.data.avkPercent[0], queData.data.avkPercent[1], queData.data.avkPercent[2]],
                                                        colors: [
                                                            (opacity = 10) => `#a20813`,
                                                            (opacity = 10) => `#39cb4a`,
                                                            (opacity = 10) => `#220884`,
                                                        ]
                                                    }
                                                ]
                                            }}
                                            width={350}
                                            height={200}
                                            chartConfig={{
                                                backgroundColor: "#fff",
                                                backgroundGradientFrom: "#fff",
                                                backgroundGradientTo: "#fff",
                                                decimalPlaces: 2,
                                                color: (opacity = 0) => `#000`,
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
                                    <Text style={{ fontSize: 16, color: SWATheam.SwaWhite, paddingVertical: 10 }}>Learning Style Keynotes</Text>
                                </View>
                                <ScrollView style={{ position: 'relative', backgroundColor: '#fff' }}>
                                    <View style={{ borderBottomWidth: 1, borderColor: colorSwa, padding: 1 }}>
                                        <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 10 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500' }]}>Preferred — </Text>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>Auditory Learning Style</Text>
                                        </View>
                                        <View style={{ paddingLeft: 8, flexDirection: 'row' }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>This learning style should be adopted as the first choice.</Text>
                                        </View>
                                        <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 10 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>These learners learn best by hearing information. They can remember quite accurately the details of any conversation or classes they attend. They have strong language skills, a well-developed vocabulary. They may find learning a foreign language relatively easy. They cannot  keep quiet for long time.</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
                                            <Image style={{ width: 200, height: 150 }} source={require('../../../assets/Auditory.jpg')} />
                                        </View>
                                        <View style={{ paddingLeft: 8 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500' }]}>Learning Suggestions- </Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Watch educational videos and use audiotapes for language practice. </Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Record and listen to notes after writing them. </Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Use recorded books and audiobooks whenever possible. </Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Participate in oral discussions and group study as often as possible. </Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Repeat facts and notes to yourself aloud while learning. </Text>
                                        </View>
                                    </View>
                                    <View style={{ borderBottomWidth: 1, borderColor: colorSwa }}>
                                        <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 10 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500' }]}>Favoured —  </Text>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>Kinesthetic Learning Style.</Text>
                                        </View>
                                        <View style={{ paddingLeft: 8, flexDirection: 'row' }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>This learning style should be adopted as the second choice.</Text>
                                        </View>
                                        <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 10 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>Kinesthetic learners learn best through doing activities, manipulating items, simulations, role playing and other activities that physically involve them in the learning process. Moreover, they learn better if classroom teaching styles keep on varying. Being on the move helps their brain and memory to function better. They can often be considered ‘hyperactive’.</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
                                            <Image style={{ width: 200, height: 150 }} source={require('../../../assets/Kinesthetic2.jpg')} />
                                        </View>
                                        <View style={{ paddingLeft: 8 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500' }]}>Learning Suggestions- </Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>While studying, memorizing or answering questions, bounce a tennis ball on the floor or against the wall while at home. </Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Keep your hands or feet busy while you read. Take notes, underline, to help your memory stay focused. </Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>If you start feeling restless and unfocused during a lecture, start bouncing your leg up and down. </Text>
                                        </View>
                                    </View>
                                    <View style={{ borderBottomWidth: 1, borderColor: colorSwa }}>
                                        <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 10 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500' }]}>Situational — </Text>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>Visual Learning Style</Text>
                                        </View>
                                        <View style={{ paddingLeft: 8, flexDirection: 'row' }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>This learning style should be adopted as the third choice.</Text>
                                        </View>
                                        <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 10 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15 }]}>Visual learners learn things best by seeing or looking at them. These learners prefer to sit at the front of the class and follow things on the blackboard closely. They easily remember information presented to them in the form of charts, pictures and diagrams. They can remember faces but forget names. They are good at reading and learning spellings.</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
                                            <Image style={{ width: 200, height: 150 }} source={require('../../../assets/Visual2.jpg')} />
                                        </View>
                                        <View style={{ paddingLeft: 8 }}>
                                            <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500' }]}>Learning Suggestions- </Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Draw maps, charts and diagrams to supplement your written notes.</Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Make flowcharts and outlines of chapter concepts.</Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Make sure you note down everything written on the board, and make extensive notes.</Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Use highlighters and colour code your notes.</Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                            <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                            <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Use flash cards, watch videos and use other visual aids to supplement classroom learning.</Text>
                                        </View>
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

export default LearningReport

