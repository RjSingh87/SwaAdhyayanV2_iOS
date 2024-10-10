import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { GlobleData } from '../../../../Store';
import Services from '../../../../Services';
import { SwaTheam, apiRoot } from '../../../../constant/ConstentValue';
import SwaHeader from '../../../common/SwaHeader';
import Loader from '../../../common/Loader';
const colorSwa = '#0c8781';
const font20 = 20;
const font15 = 15;
const font17 = 17;

const MultipleIntellReport = ({navigation, route}) => {
    const {userData} = useContext(GlobleData)
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
                    setQueData((prev) => {
                        return { ...prev, data: res.data.imTypeName, percentage: res.data.miPerCent, section: section, status: false }
                    })
                } else {

                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {

            })

    }
        // const percentage = res.data.miPerCent
        // return { ...prev, data: res.data.imTypeName, percentage: percentage, section: 'A', status: false }
    return (
        <>
            {queData.status ?
                <Loader/>:
                <View style={{ flex: 1, marginTop: 24, backgroundColor: userData.data.colors.lightTheme}}>
                <SwaHeader title={route.params.testType} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
                <View style={{ backgroundColor: userData.data.colors.hoverTheme, padding: 8}}>
                        <View>
                            <Text style={{ color: SwaTheam.SwaBlack, fontWeight: '700' }}>Name: {userData.data.fullname} ({userData.data.className}-{userData.data.sectionName})</Text>
                        </View>
                    </View>
                    <ScrollView>
                        {queData.status ?
                            <View>
                                <Text style={{ fontSize: font17 }}>Data Not Found</Text>
                            </View> :
                            <View style={{marginTop: 10}}>
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, padding: 5 }}>
                                    <ScrollView horizontal={true}>
                                        <BarChart
                                            data={{
                                                labels: [queData?.data[0], queData?.data[1], queData?.data[2], queData?.data[3], queData?.data[4], queData?.data[5], queData?.data[6], queData?.data[7]],
                                                datasets: [
                                                    {
                                                        data: [queData?.percentage[0], queData?.percentage[1], queData?.percentage[2], queData?.percentage[3], queData?.percentage[4], queData?.percentage[5], queData?.percentage[6], queData?.percentage[7]],
                                                        colors: [
                                                            (opacity = 2) => `#a20813`,
                                                            (opacity = 2) => `#39cb4a`,
                                                            (opacity = 2) => `#220884`,
                                                            (opacity = 2) => `#f777ac`,
                                                            (opacity = 2) => `#c4d800`,
                                                            (opacity = 2) => `#696767`,
                                                            (opacity = 2) => `#76d9ff`,
                                                            (opacity = 2) => `#046f10`,
                                                        ]
                                                    }
                                                ]
                                            }}
                                            width={800}
                                            height={200}
                                            chartConfig={{
                                                backgroundColor: "#fff",
                                                backgroundGradientFrom: "#ececec",
                                                backgroundGradientTo: "#ececec",
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
                                        />
                                    </ScrollView>
                                </View>
                            </View>
                        }
                    </ScrollView>
                    <View style={{backgroundColor: userData.data.colors.hoverTheme, padding: 10, width: '100%', position: 'absolute', bottom: 0 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <TouchableOpacity style={[styles.colorSwa, { borderRadius: 4, padding: 5, justifyContent: 'center' }]} onPress={() => setShowKeyNotes(!showKeyNotes)}>
                                    <Text style={[styles.WtextClr, { textAlign: 'center', fontWeight: 'bold' }]}>View KeyNotes</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <View>
                                    <TouchableOpacity style={[styles.colorSwa, { borderRadius: 4, flexDirection: 'row', padding: 5, justifyContent: 'center' }]}
                                    onPress={()=>navigation.goBack()}>
                                        <Text style={[styles.WtextClr, {textAlign: 'center', fontWeight: 'bold'}]}>Go Back</Text>
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
                                        paddingVertical:20,
                                        paddingHorizontal:10,
                                        paddingBottom: 50
                                    }}>

                            <View style={{ borderBottomWidth: 1, borderColor: 'grey'}}>
                                <Text style={{fontSize:16, color:SwaTheam.SwaWhite, paddingVertical:10}}>Multiple Intelligence Keynotes</Text>
                            </View>
                            <ScrollView style={{ position: 'relative', backgroundColor:'#fff' }}>
                                <View style={{ borderBottomWidth: 1, borderColor: colorSwa, padding: 1 }}>
                                    <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderColor: colorSwa, paddingBottom: 5 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500' }]}>You are good at the following skills (Results above 60% are taken into consideration).
                                            In order  to enhance them more ways of improving them are given. </Text>
                                    </View>
                                    <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 10 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500' }]}>Visual — </Text>
                                        <Text style={[styles.BtextClr, { fontSize: font15 }]}>(It is the ability to understand by seeing.)</Text>
                                    </View>
                                    <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 5 }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15 }]}>These learners learn best by hearing information. They can remember quite accurately the details of any conversation or classes they attend. They have strong language skills, a well-developed vocabulary. They may find learning a foreign language relatively easy. They cannot  keep quiet for long time.</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
                                        <Image style={{ width: 200, height: 150 }} source={require('../../../assets/MI-visual.jpg')} />
                                    </View>
                                    <View style={{ paddingLeft: 8 }}>
                                        <Text style={[styles.GtextClr, { fontSize: font15, fontWeight: '500', }]}>Ways to Improve Visual Skills </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Complete puzzles or join dot to dots.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Complete partially drawn pictures.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Play Memory games. </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Identify objects by touch. </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Use diagrams and flowcharts instead of words. </Text>
                                    </View>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: colorSwa }}>
                                    <View style={{ paddingLeft: 8, flex: 1, marginTop: 10 }}>
                                        <Text style={styles.BtextClr}><Text style={{ fontSize: font17, fontWeight: '500' }}>Naturalistic — </Text><Text style={[styles.BtextClr, { fontSize: font15 }]}>(It is the ability to understand nature and its beauty.)</Text></Text>
                                    </View>
                                    <View style={{ paddingLeft: 8, flexDirection: 'row' }}>
                                        <Text style={[styles.BtextClr, { fontSize: font15 }]}>You like to stay outdoors rather than indoors. You understand the natural world of plants and animals. You have good observation skills and love greenery and nature.</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
                                        <Image style={{ width: 200, height: 150 }} source={require('../../../assets/MI-naturalist.jpg')} />
                                    </View>
                                    <View style={{ paddingLeft: 8 }}>
                                        <Text style={[styles.GtextClr, { fontSize: font15, fontWeight: '500' }]}>Ways to Improve Naturalistic Skills </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Draw natural objects. </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Take care of plants and animals. </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Plant trees. </Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Trek, hike and bike your way through forests and mountains.  </Text>
                                    </View>
                                </View>
                                <View style={{ paddingLeft: 8, flexDirection: 'row', marginTop: 5, borderBottomWidth: 1, borderColor: colorSwa, paddingBottom: 5 }}>
                                    <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500' }]}>You are good at the following skills (Results above 60% are taken into consideration).
                                        In order  to enhance them more ways of improving them are given.</Text>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: colorSwa }}>
                                    <View style={{ paddingLeft: 8, flex: 1, marginTop: 10 }}>
                                        <Text style={styles.BtextClr}><Text style={{ fontSize: font17, fontWeight: '500' }}>Interpersonal —  </Text><Text style={[styles.BtextClr, { fontSize: font15 }]}>(It is the ability to understand/know others.)</Text></Text>
                                    </View>
                                    <View style={{ paddingLeft: 8 }}>
                                        <Text style={[styles.GtextClr, { fontSize: font15, fontWeight: '500' }]}>Ways to Improve Interpersonal Skills </Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
                                        <Image style={{ width: 200, height: 150 }} source={require('../../../assets/MI-Interpersonal-.jpg')} />
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Practice active listening.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Interact with others regularly.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Participate in competitions and debates.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Work together with various people to achieve a single goal.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Make friends from different cultures.</Text>
                                    </View>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: colorSwa }}>
                                    <View style={{ paddingLeft: 8, flex: 1, marginTop: 10 }}>
                                        <Text style={styles.BtextClr}><Text style={{ fontSize: font17, fontWeight: '500' }}>Intrapersonal — </Text><Text style={[styles.BtextClr, { fontSize: font15 }]}>(It is the ability to understand/know yourself.)</Text></Text>
                                    </View>
                                    <View style={{ paddingLeft: 8 }}>
                                        <Text style={[styles.GtextClr, { fontSize: font15, fontWeight: '500' }]}>Ways to Improve Intrapersonal Skills </Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
                                        <Image style={{ width: 200, height: 150 }} source={require('../../../assets/MI-intrapersonal_.jpg')} />
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Learn to meditate or just sit aside for a quiet time alone to think.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Write a diary regarding events, your emotions attached to it.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Read self help books.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Try to be in company of the people who are self motivated and self driven</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Be aware of your dreams and chase them.</Text>
                                    </View>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: colorSwa }}>
                                    <View style={{ paddingLeft: 8, flex: 1, marginTop: 10 }}>
                                        <Text style={styles.BtextClr}><Text style={{ fontSize: font17, fontWeight: '500' }}>Logical — </Text><Text style={[styles.BtextClr, { fontSize: font15 }]}>(It is the ability to understand numbers and data.)</Text></Text>
                                    </View>
                                    <View style={{ paddingLeft: 8 }}>
                                        <Text style={[styles.GtextClr, { fontSize: font15, fontWeight: '500' }]}>Ways to Improve Logical Skills </Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
                                        <Image style={{ width: 200, height: 150 }} source={require('../../../assets/MI-Logical.jpg')} />
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Play crossword puzzles.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Use thought process to evaluate each possible solution to a problem.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Participate in yoga.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Read mysteries.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Practice mental calculation.</Text>
                                    </View>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: colorSwa }}>
                                    <View style={{ paddingLeft: 8, flex: 1, marginTop: 10 }}>
                                        <Text style={styles.BtextClr}><Text style={{ fontSize: font17, fontWeight: '500' }}>Musical — </Text><Text style={[styles.BtextClr, { fontSize: font15 }]}>(It is the ability to understand/identify sounds.)</Text></Text>
                                    </View>
                                    <View style={{ paddingLeft: 8 }}>
                                        <Text style={[styles.GtextClr, { fontSize: font15, fontWeight: '500' }]}>Ways to Improve Musical Skills </Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
                                        <Image style={{ width: 200, height: 150 }} source={require('../../../assets/MI-musical-.jpg')} />
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Try to play any musical instrument.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Learn to meditate.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Listen to music and try to sing along.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Learn to identify different sounds of birds and animals.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Go to musical concerts.</Text>
                                    </View>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: colorSwa }}>
                                    <View style={{ paddingLeft: 8, flex: 1, marginTop: 10 }}>
                                        <Text style={styles.BtextClr}><Text style={{ fontSize: font17, fontWeight: '500' }}>Linguistic — </Text><Text style={[styles.BtextClr, { fontSize: font15 }]}>(It is the ability to understand words.)</Text></Text>
                                    </View>
                                    <View style={{ paddingLeft: 8 }}>
                                        <Text style={[styles.GtextClr, { fontSize: font15, fontWeight: '500' }]}>Ways to Improve Linguistic Skills </Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
                                        <Image style={{ width: 200, height: 150 }} source={require('../../../assets/MI-linguistic.jpg')} />
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Read newspapers and journals regularly.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Create your own dictionary.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Make a habit of writing every day whatever is in your mind.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Learn proper punctuation.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Indulge yourself in healthy conversations.</Text>
                                    </View>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: colorSwa }}>
                                    <View style={{ paddingLeft: 8, flex: 1, marginTop: 10 }}>
                                        <Text style={styles.BtextClr}><Text style={{ fontSize: font17, fontWeight: '500' }}>Bodily-Kinesthetic — </Text><Text style={[styles.BtextClr, { fontSize: font15 }]}>(It is the ability to use your body more for playing.)
                                        </Text></Text>
                                    </View>
                                    <View style={{ paddingLeft: 8 }}>
                                        <Text style={[styles.GtextClr, { fontSize: font15, fontWeight: '500' }]}>Ways to Improve Bodily-Kinesthetic Skills </Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
                                        <Image style={{ width: 200, height: 150 }} source={require('../../../assets/MI-kinesthetic.jpg')} />
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Do sensory integration activities.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Create a plan as to stay healthy and active.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Take up any physical performing arts, like dancing, acting, or gymnastics.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Play physical games like hopscotch and play sports.</Text>
                                    </View>
                                    <View style={{ marginVertical: 5, flexDirection: 'row', paddingLeft: 12 }}>
                                        <View style={{ width: 8, height: 8, backgroundColor: '#000', borderRadius: 10, marginTop: 6 }}></View>
                                        <Text style={[styles.BtextClr, { fontSize: font15, marginLeft: 5 }]}>Learn sign language or braille.</Text>
                                    </View>
                                </View>
                            </ScrollView>

                            <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'center',backgroundColor: userData.data.colors.hoverTheme, height:50, padding:4, alignItems:'center' }}>
                                <TouchableOpacity style={[styles.colorSwa, { borderRadius: 4, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 5, justifyContent: 'center' }]} onPress={() => setShowKeyNotes(!showKeyNotes)}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View>
            }
        </>
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

export default MultipleIntellReport

