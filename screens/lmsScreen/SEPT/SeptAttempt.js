import React, { useState, useEffect, useContext, } from 'react';
import { LogBox, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, useWindowDimensions, Platform } from "react-native"
import RenderHtml from 'react-native-render-html';
import SwaHeader from '../../common/SwaHeader';
import Services from '../../../Services';
import { SWATheam, apiRoot } from '../../../constant/ConstentValue';
import { GlobleData } from '../../../Store';
import Loader from '../../common/Loader';
import MessagePopup from '../../common/MessagePopup';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
const colorSwa = '#0c8781'
const font20 = 20
const font17 = 17
const attemptData = [];
let radioSelectSaved = [];
let optClickCount = []
const date = new Date();
const hour = date.getHours();
const min = date.getMinutes();
const sec = date.getSeconds();
const time = hour + ':' + min + ':' + sec;
const startTimeArr = [time]

const html = '<div>Hello world!</div>';


const SeptAttempt = ({ navigation, route }) => {


    const { width } = useWindowDimensions();
    const { userData } = useContext(GlobleData)
    const [queData, setQueData] = useState({ data: null, status: true })
    const [count, setCount] = useState(0)
    const [selectedRadio, setSelectedRadio] = useState({ qID: null, radioID: null })
    const [attemptLen, setattemptLen] = useState(0)
    const [showPopup, setShowPopup] = useState(false)
    const [time, setTime] = useState(0)
    const [submitMsg, setSubmitKsg] = useState(false)

    const testTime = route?.params?.testData?.selectedSubIcon.testDuration.split(':')

    let min = 60 * testTime[1]
    const schoolCode = route.params.schoolCode
    const classID = route.params.classID
    const testID = route.params.testID

    let attemptQue = {
        questionSequence: "",
        startTime: "",
        endTime: "",
        optionClickCount: "",
        spendTime: "",
        cgQID: "",
        rightAnswer: "",
        selectedOptionText: "",
        selectedOption: "",
        isPending: ""
    }

    useEffect(() => {
        radioSelectSaved = []
    }, [navigation])

    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }


    const nextQue = () => {
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        const time = hour + ':' + min + ':' + sec;
        if (count < queData.data.length - 1) {
            setCount(count + 1);
            setSelectedRadio((prev) => { return { ...prev, radioID: radioSelectSaved[count + 1] } });
            startTimeArr.push(time)
        }
    }

    const PrevQue = () => {
        if (count > 0) {
            setCount(count - 1);
            setSelectedRadio((prev) => { return { ...prev, radioID: radioSelectSaved[count - 1] } });
        }
    }

    const submitData = (classID, queLen, testID) => {

        if (attemptLen == queLen) {
            const schoolCode = route.params.schoolCode
            const UserData = {
                userRefID: userData.data.userRefID,
                classID: classID,
                sectionID: userData.data.sectionID,
                academicYear: userData.data.academicYear,
                testID: testID,
                totalQuestion: queLen
            }

            const finalData = {
                "schoolCode": schoolCode,
                "userData": UserData,
                "attemptData": attemptData,
            }
            const payload = {
                schoolCode: finalData.schoolCode,
                userData: finalData.userData,
                attemptData: finalData.attemptData
            }
            Services.post(apiRoot.septAttempt, payload)
                .then((res) => {
                    console.log(res, 'check response sept')
                    if (res.status == "success") {
                        setSubmitKsg(true)
                        radioSelectSaved = []
                    } else if (res.status == "error") {
                        alert(res.message)
                    }
                })
                .then((err) => {
                    console.log(err)
                })
                .finally(() => {

                })
        }
    }

    function goBack() {
        setSubmitKsg(false)
        navigation.goBack()
    }

    useEffect(() => {
        getQuestions()
        timer(min);
        // LogBox.ignoreLogs(['Warning: ...']);
        LogBox.ignoreAllLogs();
    }, [])

    const timer = (duration) => {
        let timer = duration, minutes, seconds;
        const x = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            setTime(minutes + ":" + seconds)
            --timer

            if (timer == -1) {
                clearInterval(x)
                setShowPopup(true)
            }
        }, 1000);
    }

    function getQuestions() {
        const payload = {
            "schoolCode": schoolCode,
            "testID": testID,
            "classID": classID
        }
        Services.post(apiRoot.septQuestions, payload)
            .then((res) => {
                if (res.status == "success") {
                    const len = res.data.icons.length
                    const testDuration = res.data.icons[0].getTestTypeDetail.testDuration
                    const headerText = res.data.icons[0].getTestTypeDetail.testType
                    for (let i = 0; i < res.data.icons.length; i++) {
                        optClickCount.push([])
                    }
                    setQueData((prev) => {
                        return { ...prev, data: res.data.icons, url: res.data.url, queLen: len, testDuration: testDuration, headerText: headerText, status: false }
                    })
                }

            })
            .catch((e) => {
                console.log(e, "error")
            })
            .finally(() => { })


    }

    function optionSelect(value, ID, selectedOptionText) {
        let countText = ""
        const radioLen = [];
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        const time = hour + ':' + min + ':' + sec;
        setSelectedRadio((prev) => { return { ...prev, qID: value.cgQID, radioID: ID } })
        if (optClickCount[count].length < 1) {
            optClickCount[count] += ID
        } else {
            optClickCount[count] += ',' + ID
        }
        countText += optClickCount[count]
        radioSelectSaved[count] = ID
        attemptQue.optionClickCount = countText
        attemptQue.cgQID = value.cgQID
        attemptQue.questionSequence = value.questionSequence
        attemptQue.rightAnswer = value.rightAnswer
        attemptQue.selectedOptionText = selectedOptionText
        attemptQue.selectedOption = ID
        attemptQue.isPending = 1
        if (count == 0) {
            attemptQue.startTime = startTimeArr[0]
        } else {
            attemptQue.startTime = startTimeArr[count]
        }
        attemptQue.endTime = time
        attemptData[count] = attemptQue
        radioSelectSaved.map((item) => {
            radioLen.push(item)
            setattemptLen(radioLen.length)
        })
    }
    function closeModule() {
        setSubmitKsg(false)
    }

    const tagsStyles = {
        body: {
            fontSize: 17,
            color: SWATheam.SwaBlack
        },
        p: {
            fontSize: 17,
            color: SWATheam.SwaBlack
        }
    };

    const insets = useSafeAreaInsets()

    const WebDisplay = ({ html }) => {
        const { width: contentWidth } = useWindowDimensions();
        const tagsStyles = {
            a: {
                textDecorationLine: 'none',
            },
            body: {
                fontSize: 17,
                color: SWATheam.SwaBlack,
                fontWeight: "bold",
            },
            p: {
                fontSize: 17,
                color: SWATheam.SwaBlack
            }
        };
        return (
            <RenderHtml
                contentWidth={contentWidth}
                source={{ html }}
                tagsStyles={tagsStyles}
            />
        );
    }


    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['left', 'right', 'top']} style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme }}>
                {queData.status ?
                    <Loader />
                    :
                    <View style={{ flex: 1, backgroundColor: '#fff', marginBottom: insets.bottom, marginTop: Platform.OS === "ios" ? 0 : 24 }}>
                        <SwaHeader title={route?.params?.testData?.selectedSubIcon.testType} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
                        <View style={{ backgroundColor: userData.data.colors.mainTheme, padding: 8 }}>
                            {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#fff' }}>
                            <Text style={[styles.WtextClr, { fontWeight: 'bold', fontSize: font20 }]}>{queData.headerText}</Text>
                        </View> */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: SWATheam.SwaWhite, borderBottomWidth: 1, paddingVertical: 10 }}>
                                <Text style={{ fontWeight: '500', fontSize: 17, color: SWATheam.SwaWhite }}>Remaining Time</Text>
                                <Text style={[styles.BtextClr, { borderRadius: 3, backgroundColor: '#fff', textAlign: 'center', padding: 2, fontSize: font17, width: 100 }]}>{time}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View>
                                        <Text style={[styles.WtextClr, { fontWeight: '500', fontSize: 17, color: SWATheam.SwaWhite }]}>Total</Text>
                                        <Text style={{ fontWeight: '500', fontSize: 17, color: SWATheam.SwaWhite }}>Questions</Text>
                                    </View>
                                    <View style={{ width: 50, marginLeft: 10 }}>
                                        <Text style={[styles.BtextClr, { borderRadius: 3, backgroundColor: '#fff', textAlign: 'center', padding: 2, fontSize: font17 }]}>{queData.queLen}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View>
                                        <Text style={{ fontWeight: '500', fontSize: 17, color: SWATheam.SwaWhite }}>Attempted</Text>
                                        <Text style={{ fontWeight: '500', fontSize: 17, color: SWATheam.SwaWhite }}>Questions</Text>
                                    </View>
                                    <View style={{ width: 50, marginLeft: 10 }}>
                                        <Text style={[styles.BtextClr, { borderRadius: 3, backgroundColor: '#fff', textAlign: 'center', padding: 2, fontSize: font17 }]}>{attemptLen}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {queData.status ?
                            <View>
                                <Text style={{ fontSize: font17 }}>Data Not Found</Text>
                            </View> :
                            <View>
                                <ScrollView>
                                    <View style={{ flex: 1, backgroundColor: '#fff', padding: 10, paddingVertical: 20 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: 25 }}>
                                                <Text style={{ fontSize: 17, color: SWATheam.SwaBlack }}>{count + 1}.</Text>
                                            </View>
                                            <View style={{ flex: 1, marginBottom: 5 }}>
                                                {/* <RenderHtml
                                                    contentWidth={width}
                                                    source={{ html: queData?.data[count]?.questionText }}
                                                    tagsStyles={tagsStyles}
                                                /> */}
                                                <WebDisplay html={queData?.data[count]?.questionText} />
                                            </View>
                                        </View>
                                        {queData?.data[count]?.commonImage != null &&
                                            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                                                <Image source={{ uri: queData?.url + queData?.data[count]?.commonImagePath + queData?.data[count]?.commonImage }} style={{ height: 200, width: 200 }} />
                                            </View>
                                        }
                                        <View style={{ marginLeft: 30 }}>
                                            {queData?.data[count]?.optionText1 != null && queData?.data[count]?.optionText1 !== '' &&
                                                <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => optionSelect(queData?.data[count], queData?.data[count].optionID1, queData?.data[count]?.optionText1)}>
                                                    <View style={{ width: 20, height: 20, borderRadius: 20 / 2, borderWidth: 2, borderColor: 'grey', alignItems: "center", justifyContent: "center", marginTop: 3 }}>
                                                        <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: 'grey', justifyContent: 'center', alignItems: 'center' }} value="first">
                                                            {
                                                                selectedRadio?.radioID === 1 ? <View style={{ borderWidth: 2, borderColor: 'grey', backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 / 2 }}></View> : null
                                                            }
                                                        </View>
                                                    </View>
                                                    <View style={{ marginHorizontal: 5 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>(a)</Text></View>
                                                    <View style={{ flex: 1 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>{queData?.data[count]?.optionText1}</Text></View>
                                                </TouchableOpacity>
                                            }
                                            {queData?.data[count]?.optionText2 != null && queData?.data[count]?.optionText2 != '' &&
                                                <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => optionSelect(queData?.data[count], queData?.data[count].optionID2, queData?.data[count]?.optionText2)}>
                                                    <View style={{ width: 20, height: 20, borderRadius: 20 / 2, borderWidth: 2, borderColor: 'grey', alignItems: "center", justifyContent: "center", marginTop: 3 }} >
                                                        <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: 'grey', justifyContent: 'center', alignItems: 'center' }} value="first">
                                                            {
                                                                selectedRadio?.radioID === 2 ? <View style={{ borderWidth: 2, borderColor: 'grey', backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 }}></View> : null
                                                            }
                                                        </View>
                                                    </View>
                                                    <View style={{ marginHorizontal: 5, }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>(b)</Text></View>
                                                    <View style={{ flex: 1 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>{queData?.data[count]?.optionText2}</Text></View>
                                                </TouchableOpacity>
                                            }
                                            {queData?.data[count]?.optionText3 != null && queData?.data[count]?.optionText3 != '' &&
                                                <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => optionSelect(queData?.data[count], queData?.data[count].optionID3, queData?.data[count]?.optionText3)}>
                                                    <View style={{ width: 20, height: 20, borderRadius: 20 / 2, borderWidth: 2, alignItems: "center", justifyContent: "center", marginTop: 3, borderColor: 'grey' }} >
                                                        <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: 'grey', justifyContent: 'center', alignItems: 'center' }} value="first">
                                                            {
                                                                selectedRadio?.radioID === 3 ? <View style={{ borderWidth: 2, borderColor: 'grey', backgroundColor: userData.data.colors.mainTheme, height: 10, width: 10, borderRadius: 10 }}></View> : null
                                                            }
                                                        </View>
                                                    </View>
                                                    <View style={{ marginHorizontal: 5 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>(c)</Text></View>
                                                    <View style={{ flex: 1 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>{queData?.data[count]?.optionText3}</Text></View>
                                                </TouchableOpacity>
                                            }
                                            {queData?.data[count]?.optionText4 != null && queData?.data[count]?.optionText4 != '' &&
                                                <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => optionSelect(queData?.data[count], queData?.data[count].optionID4, queData?.data[count]?.optionText4)}>
                                                    <View style={{ width: 20, height: 20, borderRadius: 20 / 2, borderWidth: 2, borderColor: 'grey', alignItems: "center", justifyContent: "center", marginTop: 3 }} >
                                                        <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: 'grey', justifyContent: 'center', alignItems: 'center' }} value="first">
                                                            {
                                                                selectedRadio?.radioID === 4 ? <View style={{ borderWidth: 2, borderColor: 'grey', backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 }}></View> : null
                                                            }
                                                        </View>
                                                    </View>
                                                    <View style={{ marginHorizontal: 5 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>(d)</Text></View>
                                                    <View style={{ flex: 1 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>{queData?.data[count]?.optionText4}</Text></View>
                                                </TouchableOpacity>
                                            }
                                            {queData?.data[count]?.optionText5 != null && queData?.data[count]?.optionText5 != '' &&
                                                <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => optionSelect(queData?.data[count], queData?.data[count].optionID5, queData?.data[count]?.optionText5)}>
                                                    <View style={{ width: 20, height: 20, borderRadius: 20 / 2, borderWidth: 2, borderColor: 'grey', alignItems: "center", justifyContent: "center", marginTop: 3 }} >
                                                        <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: 'grey', justifyContent: 'center', alignItems: 'center' }} value="first">
                                                            {
                                                                selectedRadio?.radioID === 5 ? <View style={{ borderWidth: 2, borderColor: 'grey', backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 }}></View> : null
                                                            }
                                                        </View>
                                                    </View>
                                                    <View style={{ marginHorizontal: 5 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>(e)</Text></View>
                                                    <View style={{ flex: 1 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>{queData?.data[count]?.optionText5}</Text></View>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        }

                        <View style={[styles.colorSwa, { borderBottomStartRadius: 5, borderBottomEndRadius: 5, padding: 10, position: 'absolute', bottom: 0, width: '100%' }]}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ marginEnd: 10, flexDirection: 'row' }}>
                                            <TouchableOpacity style={{ borderRadius: 4, flexDirection: 'row', paddingVertical: 8, backgroundColor: count == 0 ? '#94ccca' : '#fff', justifyContent: 'center', alignItems: 'center', width: 80 }} onPress={() => PrevQue()}>
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Previous</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <TouchableOpacity style={{ borderRadius: 4, flexDirection: 'row', paddingVertical: 8, backgroundColor: count == queData.queLen - 1 ? '#94ccca' : '#fff', justifyContent: 'center', alignItems: 'center', width: 80 }} onPress={() => nextQue()}>
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Next</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={{ borderRadius: 4, paddingVertical: 8, backgroundColor: attemptLen == queData.queLen ? '#fff' : '#94ccca', justifyContent: 'center', alignItems: 'center', width: 80 }} onPress={() => {
                                        submitData(queData?.data[count].classID, queData?.data.length, queData?.data[count].getTestTypeDetail.testID)
                                    }
                                    }
                                    >
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {showPopup &&
                            <View style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', alignItems
                                    : 'center'
                            }}>
                                <View style={{ backgroundColor: '#eee', height: 200, width: 300, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                    <Text style={[styles.BtextClr, { fontSize: font17, textAlign: 'center' }]}>Try Again</Text>
                                    <TouchableOpacity style={{ borderWidth: 1, borderColor: 'green', width: 50, marginTop: 40, borderRadius: 5, backgroundColor: colorSwa }} onPress={() => {
                                        setShowPopup(false);
                                        timer(min)
                                    }}>
                                        <Text style={[styles.WtextClr, { textAlign: 'center', paddingHorizontal: 10, paddingVertical: 5 }]}>OK</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        {submitMsg &&
                            <MessagePopup goBack={goBack} closeModule={closeModule} navigation={navigation} />
                        }
                    </View>
                }
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    BtextClr: {
        color: '#000',
    },

    WtextClr: {
        color: '#fff'
    },

    colorSwa: {
        backgroundColor: colorSwa,
    }



});

export default SeptAttempt

