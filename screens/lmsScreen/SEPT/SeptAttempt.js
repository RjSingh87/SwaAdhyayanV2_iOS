import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, useWindowDimensions, StatusBar, Alert } from "react-native";
import RenderHtml from 'react-native-render-html';
import SwaHeader from '../../common/SwaHeader';
import Services from '../../../Services';
import { SWATheam, apiRoot } from '../../../constant/ConstentValue';
import { GlobleData } from '../../../Store';
import Loader from '../../common/Loader';
import MessagePopup from '../../common/MessagePopup';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const colorSwa = '#0c8781';
const font17 = 17;

const getCurrTime = () => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const SeptAttempt = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const { userData } = useContext(GlobleData);

    const [queData, setQueData] = useState({ data: null, status: true, queLen: 0, url: '' });
    const [count, setCount] = useState(0);
    const [selectedRadio, setSelectedRadio] = useState({ qID: null, radioID: null });
    const [showPopup, setShowPopup] = useState(false);
    const [time, setTime] = useState("00:00");
    const [submitMsg, setSubmitKsg] = useState(false);

    // Component-level persistent state across questions
    const [savedAnswers, setSavedAnswers] = useState({});
    const attemptDataRef = useRef({});
    const optClickCountRef = useRef({});
    const startTimeArrRef = useRef({ 0: getCurrTime() });
    const timerRef = useRef(null);

    const schoolID = route?.params?.schoolID || userData?.data?.schoolID;
    const classID = route?.params?.classID || userData?.data?.classID;
    const testID = route?.params?.testID;

    // Calculate initial duration safely
    let durationSeconds = 1800;
    try {
        const rawDur = route?.params?.testData?.selectedSubIcon?.testDuration;
        if (rawDur) {
            const parts = rawDur.split(':').map(Number);
            if (parts.length === 3) {
                durationSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            } else if (parts.length === 2) {
                durationSeconds = parts[0] * 60 + parts[1];
            } else if (parts.length === 1 && !isNaN(parts[0])) {
                durationSeconds = parts[0] * 60;
            }
        }
    } catch (e) {
        durationSeconds = 1800;
    }

    function onClickLeftIcon() {
        navigation.goBack();
    }

    function onClickRightIcon() {
        // Reserved for instructions if needed
    }

    const jumpToQue = (newIndex) => {
        if (!queData?.data || newIndex < 0 || newIndex >= queData.data.length) return;
        const nowTime = getCurrTime();
        if (!startTimeArrRef.current[newIndex]) {
            startTimeArrRef.current[newIndex] = nowTime;
        }
        setCount(newIndex);
        setSelectedRadio({
            qID: queData.data[newIndex]?.cgQID,
            radioID: savedAnswers[newIndex] ?? null
        });
    };

    const nextQue = () => {
        jumpToQue(count + 1);
    };

    const PrevQue = () => {
        jumpToQue(count - 1);
    };

    const optionSelect = (value, ID, selectedOptionText) => {
        const nowTime = getCurrTime();
        const safeID = ID ?? 1;

        // Track click sequence
        const prevClicks = optClickCountRef.current[count] || "";
        const newClicks = prevClicks.length === 0 ? String(safeID) : prevClicks + ',' + safeID;
        optClickCountRef.current[count] = newClicks;

        // Save selected answer for reactive UI
        setSavedAnswers((prev) => ({
            ...prev,
            [count]: safeID
        }));

        setSelectedRadio({
            qID: value?.cgQID,
            radioID: safeID
        });

        const qStartTime = startTimeArrRef.current[count] || startTimeArrRef.current[0] || nowTime;

        // Create independent object per question
        attemptDataRef.current[count] = {
            questionSequence: value?.questionSequence || (count + 1),
            startTime: qStartTime,
            endTime: nowTime,
            optionClickCount: newClicks,
            spendTime: "",
            cgQID: value?.cgQID,
            rightAnswer: value?.rightAnswer,
            selectedOptionText: selectedOptionText || "",
            selectedOption: safeID,
            isPending: 1
        };
    };

    const submitData = () => {
        const totalQue = queData?.data?.length || 0;
        const finalSchoolID = schoolID || userData?.data?.schoolID;
        const finalClassID = classID || queData?.data?.[0]?.classID || userData?.data?.classID;
        const finalTestID = testID || queData?.data?.[0]?.getTestTypeDetail?.testID;

        const formattedAttemptData = [];
        for (let i = 0; i < totalQue; i++) {
            const q = queData?.data?.[i];
            if (attemptDataRef.current[i]) {
                formattedAttemptData.push(attemptDataRef.current[i]);
            } else {
                formattedAttemptData.push({
                    questionSequence: q?.questionSequence || (i + 1),
                    startTime: startTimeArrRef.current[i] || startTimeArrRef.current[0] || getCurrTime(),
                    endTime: getCurrTime(),
                    optionClickCount: String(savedAnswers[i] ?? 1),
                    spendTime: "",
                    cgQID: q?.cgQID,
                    rightAnswer: q?.rightAnswer,
                    selectedOptionText: "",
                    selectedOption: savedAnswers[i] ?? 1,
                    isPending: 1
                });
            }
        }

        const payload = {
            schoolID: finalSchoolID,
            userData: {
                userRefID: userData.data.userRefID,
                classID: finalClassID,
                sectionID: userData.data.sectionID,
                academicYear: userData.data.academicYear,
                testID: finalTestID,
                totalQuestion: totalQue
            },
            attemptData: formattedAttemptData
        };

        Services.post(apiRoot.septAttempt, payload)
            .then((res) => {
                console.log(res, 'check response sept');
                if (res.status == "success") {
                    setSubmitKsg(true);
                } else if (res.status == "error") {
                    Alert.alert("Info", res.message || "Failed to submit assessment.");
                }
            })
            .catch((err) => {
                console.log(err);
                Alert.alert("Error", "Network error. Please try again.");
            });
    };

    const handleSubmitPress = () => {
        const totalQue = queData?.data?.length || 0;
        if (totalQue === 0) return;

        const unattempted = [];
        for (let i = 0; i < totalQue; i++) {
            if (savedAnswers[i] === undefined || savedAnswers[i] === null) {
                unattempted.push(i + 1);
            }
        }

        if (unattempted.length > 0) {
            const attemptedNum = totalQue - unattempted.length;
            const firstMissing = unattempted[0];
            Alert.alert(
                "Incomplete Questions",
                `You have attempted ${attemptedNum} of ${totalQue} questions.\n\nPending question(s): ${unattempted.join(', ')}`,
                [
                    {
                        text: `Go to Q.${firstMissing}`,
                        onPress: () => jumpToQue(firstMissing - 1)
                    },
                    {
                        text: "Review",
                        style: "cancel"
                    }
                ]
            );
        } else {
            Alert.alert(
                "Submit Assessment",
                `You have attempted all ${totalQue} questions. Are you sure you want to submit?`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Submit",
                        onPress: () => submitData()
                    }
                ]
            );
        }
    };

    function goBack() {
        setSubmitKsg(false);
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('subIconScreen');
        }
    }

    function closeModule() {
        goBack();
    }

    const timer = (duration) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        let timerCount = duration;
        timerRef.current = setInterval(() => {
            const minutes = parseInt(timerCount / 60, 10);
            const seconds = parseInt(timerCount % 60, 10);

            const mStr = minutes < 10 ? "0" + minutes : minutes;
            const sStr = seconds < 10 ? "0" + seconds : seconds;
            setTime(mStr + ":" + sStr);
            --timerCount;

            if (timerCount < 0) {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                setShowPopup(true);
            }
        }, 1000);
    };

    function getQuestions() {
        const payload = {
            "schoolID": schoolID,
            "testID": testID,
            "classID": classID
        };
        Services.post(apiRoot.septQuestions, payload)
            .then((res) => {
                if (res.status == "success" && res.data?.icons) {
                    const len = res.data.icons.length;
                    const testDuration = res.data.icons[0]?.getTestTypeDetail?.testDuration;
                    const headerText = res.data.icons[0]?.getTestTypeDetail?.testType;
                    setQueData({
                        data: res.data.icons,
                        url: res.data.url,
                        queLen: len,
                        testDuration: testDuration,
                        headerText: headerText,
                        status: false
                    });
                } else {
                    setQueData((prev) => ({ ...prev, status: false }));
                }
            })
            .catch(() => {
                setQueData((prev) => ({ ...prev, status: false }));
            });
    }

    useEffect(() => {
        getQuestions();
        timer(durationSeconds);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const tagsStyles = {
        body: {
            fontSize: 17,
            color: SWATheam.SwaBlack
        },
        p: {
            fontSize: 17,
            color: SWATheam.SwaBlack
        },
        img: {
            maxWidth: 130,
            height: 'auto',
            resizeMode: 'contain',
        },
    };

    const currentQue = queData?.data?.[count];
    const totalQuestions = queData?.data?.length || 0;
    const attemptedCount = queData?.data
        ? queData.data.reduce((acc, _, idx) => (savedAnswers[idx] !== undefined && savedAnswers[idx] !== null ? acc + 1 : acc), 0)
        : 0;

    const opt1ID = currentQue?.optionID1 ?? 1;
    const opt2ID = currentQue?.optionID2 ?? 2;
    const opt3ID = currentQue?.optionID3 ?? 3;
    const opt4ID = currentQue?.optionID4 ?? 4;
    const opt5ID = currentQue?.optionID5 ?? 5;

    const isSelected1 = selectedRadio?.radioID == opt1ID || selectedRadio?.radioID == 1;
    const isSelected2 = selectedRadio?.radioID == opt2ID || selectedRadio?.radioID == 2;
    const isSelected3 = selectedRadio?.radioID == opt3ID || selectedRadio?.radioID == 3;
    const isSelected4 = selectedRadio?.radioID == opt4ID || selectedRadio?.radioID == 4;
    const isSelected5 = selectedRadio?.radioID == opt5ID || selectedRadio?.radioID == 5;

    const mainColor = userData?.data?.colors?.mainTheme || colorSwa;

    return (
        <SafeAreaProvider style={{ backgroundColor: mainColor, paddingTop: insets.top, marginBottom: insets.bottom }}>
            {queData.status ? (
                <Loader />
            ) : (
                <View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme }}>
                    <SwaHeader
                        title={route?.params?.testData?.selectedSubIcon?.testType || "SEPT Assessment"}
                        leftIcon={"arrowleft"}
                        onClickLeftIcon={onClickLeftIcon}
                        onClickRightIcon={onClickRightIcon}
                        headerImage={route.params?.septIconUrl}
                    />

                    {/* Header Summary */}
                    <View style={{ backgroundColor: mainColor, padding: 8 }}>
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
                                    <Text style={[styles.BtextClr, { borderRadius: 3, backgroundColor: '#fff', textAlign: 'center', padding: 2, fontSize: font17 }]}>{totalQuestions}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ fontWeight: '500', fontSize: 17, color: SWATheam.SwaWhite }}>Attempted</Text>
                                    <Text style={{ fontWeight: '500', fontSize: 17, color: SWATheam.SwaWhite }}>Questions</Text>
                                </View>
                                <View style={{ width: 50, marginLeft: 10 }}>
                                    <Text style={[styles.BtextClr, { borderRadius: 3, backgroundColor: '#fff', textAlign: 'center', padding: 2, fontSize: font17 }]}>{attemptedCount}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Question Palette / Number Strip */}
                    {totalQuestions > 0 && (
                        <View style={{ backgroundColor: userData?.data?.colors?.hoverTheme || '#e8f4f8', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderColor: '#d0dfe5' }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                                {queData?.data?.map((_, idx) => {
                                    const isAttempted = savedAnswers[idx] !== undefined && savedAnswers[idx] !== null;
                                    const isCurrent = idx === count;
                                    return (
                                        <TouchableOpacity
                                            key={idx}
                                            activeOpacity={0.7}
                                            onPress={() => jumpToQue(idx)}
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 18,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: 8,
                                                backgroundColor: isCurrent
                                                    ? mainColor
                                                    : isAttempted
                                                        ? '#28a745'
                                                        : '#fff',
                                                borderWidth: isCurrent ? 2 : 1,
                                                borderColor: isCurrent
                                                    ? SWATheam.SwaBlack
                                                    : isAttempted
                                                        ? '#28a745'
                                                        : '#ccc',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: (isCurrent || isAttempted) ? '#fff' : SWATheam.SwaBlack,
                                                    fontWeight: isCurrent ? 'bold' : '600',
                                                    fontSize: 14,
                                                }}
                                            >
                                                {idx + 1}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    )}

                    {!currentQue ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: SWATheam.SwaWhite }}>
                            <Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>Data Not Found</Text>
                        </View>
                    ) : (
                        <View style={{ flex: 1, backgroundColor: SWATheam.SwaWhite }}>
                            <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
                                <View style={{ flex: 1, backgroundColor: SWATheam.SwaWhite, padding: 10, paddingVertical: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: 25 }}>
                                            <Text style={{ fontSize: 17, color: SWATheam.SwaBlack }}>{count + 1}.</Text>
                                        </View>
                                        <View style={{ flex: 1, marginBottom: 5 }}>
                                            <RenderHtml
                                                contentWidth={width}
                                                source={{ html: currentQue?.questionText || '' }}
                                                tagsStyles={tagsStyles}
                                            />
                                        </View>
                                    </View>

                                    {currentQue?.commonImage != null && (
                                        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, marginVertical: 20 }}>
                                            <Image
                                                source={{ uri: queData?.url + currentQue?.commonImagePath + currentQue?.commonImage }}
                                                style={{ height: 180, width: '100%' }}
                                                resizeMode="contain"
                                            />
                                        </View>
                                    )}

                                    {/* Options */}
                                    <View style={{ marginLeft: 30, marginTop: 10 }}>
                                        {currentQue?.optionText1 != null && currentQue?.optionText1 !== '' && (
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}
                                                onPress={() => optionSelect(currentQue, opt1ID, currentQue?.optionText1)}
                                            >
                                                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: isSelected1 ? mainColor : 'grey', alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                                                    {isSelected1 && (
                                                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: mainColor }} />
                                                    )}
                                                </View>
                                                <View style={{ marginHorizontal: 8 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack, fontWeight: '500' }}>(a)</Text></View>
                                                <View style={{ flex: 1 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>{currentQue?.optionText1}</Text></View>
                                            </TouchableOpacity>
                                        )}

                                        {currentQue?.optionText2 != null && currentQue?.optionText2 !== '' && (
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}
                                                onPress={() => optionSelect(currentQue, opt2ID, currentQue?.optionText2)}
                                            >
                                                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: isSelected2 ? mainColor : 'grey', alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                                                    {isSelected2 && (
                                                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: mainColor }} />
                                                    )}
                                                </View>
                                                <View style={{ marginHorizontal: 8 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack, fontWeight: '500' }}>(b)</Text></View>
                                                <View style={{ flex: 1 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>{currentQue?.optionText2}</Text></View>
                                            </TouchableOpacity>
                                        )}

                                        {currentQue?.optionText3 != null && currentQue?.optionText3 !== '' && (
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}
                                                onPress={() => optionSelect(currentQue, opt3ID, currentQue?.optionText3)}
                                            >
                                                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: isSelected3 ? mainColor : 'grey', alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                                                    {isSelected3 && (
                                                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: mainColor }} />
                                                    )}
                                                </View>
                                                <View style={{ marginHorizontal: 8 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack, fontWeight: '500' }}>(c)</Text></View>
                                                <View style={{ flex: 1 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>{currentQue?.optionText3}</Text></View>
                                            </TouchableOpacity>
                                        )}

                                        {currentQue?.optionText4 != null && currentQue?.optionText4 !== '' && (
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}
                                                onPress={() => optionSelect(currentQue, opt4ID, currentQue?.optionText4)}
                                            >
                                                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: isSelected4 ? mainColor : 'grey', alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                                                    {isSelected4 && (
                                                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: mainColor }} />
                                                    )}
                                                </View>
                                                <View style={{ marginHorizontal: 8 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack, fontWeight: '500' }}>(d)</Text></View>
                                                <View style={{ flex: 1 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>{currentQue?.optionText4}</Text></View>
                                            </TouchableOpacity>
                                        )}

                                        {currentQue?.optionText5 != null && currentQue?.optionText5 !== '' && (
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}
                                                onPress={() => optionSelect(currentQue, opt5ID, currentQue?.optionText5)}
                                            >
                                                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: isSelected5 ? mainColor : 'grey', alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                                                    {isSelected5 && (
                                                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: mainColor }} />
                                                    )}
                                                </View>
                                                <View style={{ marginHorizontal: 8 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack, fontWeight: '500' }}>(e)</Text></View>
                                                <View style={{ flex: 1 }}><Text style={{ fontSize: font17, color: SWATheam.SwaBlack }}>{currentQue?.optionText5}</Text></View>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* Bottom Navigation & Submit Bar */}
                    <View style={[styles.colorSwa, { borderBottomStartRadius: 5, borderBottomEndRadius: 5, padding: 10, position: 'absolute', bottom: -45, width: '100%', paddingBottom: 65 }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ marginEnd: 10 }}>
                                        <TouchableOpacity
                                            style={{
                                                borderRadius: 4,
                                                paddingVertical: 8,
                                                backgroundColor: count === 0 ? '#94ccca' : '#fff',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 80
                                            }}
                                            disabled={count === 0}
                                            onPress={PrevQue}
                                        >
                                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: count === 0 ? '#666' : '#000' }}>Previous</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            style={{
                                                borderRadius: 4,
                                                paddingVertical: 8,
                                                backgroundColor: count === totalQuestions - 1 ? '#94ccca' : '#fff',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 80
                                            }}
                                            disabled={count === totalQuestions - 1}
                                            onPress={nextQue}
                                        >
                                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: count === totalQuestions - 1 ? '#666' : '#000' }}>Next</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        borderRadius: 4,
                                        paddingVertical: 8,
                                        backgroundColor: attemptedCount === totalQuestions && totalQuestions > 0 ? '#fff' : '#94ccca',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 80
                                    }}
                                    onPress={handleSubmitPress}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Timeout Popup */}
                    {showPopup && (
                        <View style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', alignItems: 'center'
                        }}>
                            <View style={{ backgroundColor: '#eee', height: 200, width: 300, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                <Text style={[styles.BtextClr, { fontSize: font17, textAlign: 'center' }]}>Time Out! Try Again</Text>
                                <TouchableOpacity
                                    style={{ borderWidth: 1, borderColor: 'green', width: 60, marginTop: 40, borderRadius: 5, backgroundColor: colorSwa }}
                                    onPress={() => {
                                        setShowPopup(false);
                                        timer(durationSeconds);
                                    }}
                                >
                                    <Text style={[styles.WtextClr, { textAlign: 'center', paddingHorizontal: 10, paddingVertical: 5 }]}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Submit Success Message */}
                    {submitMsg && (
                        <MessagePopup goBack={goBack} closeModule={closeModule} navigation={navigation} />
                    )}
                </View>
            )}
        </SafeAreaProvider>
    );
};

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

export default SeptAttempt;
