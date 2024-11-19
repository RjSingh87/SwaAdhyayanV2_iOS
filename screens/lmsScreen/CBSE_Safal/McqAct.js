import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Button, useWindowDimensions, Modal, Platform } from 'react-native';
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RadioButton } from 'react-native-paper';
import Loader from './Loader';
import Report from './Report';
import { GlobleData } from '../../../Store';
import { SWATheam, apiRoot } from '../../../constant/ConstentValue';
import Services from '../../../Services';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function McqActy({ navigation, route }) {
    const tagsStyles = {
        body: {
            fontSize: 17,
            color: SWATheam.SwaBlack,
            fontWeight: '700'
        },
        p: {
            fontSize: 17,
            color: SWATheam.SwaBlack,
            fontWeight: '700'
        }
    };
    const optionStyle = {
        body: {
            fontSize: 17,
            color: SWATheam.SwaBlack,
        },
        p: {
            fontSize: 17,
            color: SWATheam.SwaBlack,
        }
    };



    const { userData } = useContext(GlobleData)
    const { width } = useWindowDimensions();

    const question = route.params.data.question
    const totaQuest = route.params.data.totaQuest
    const imgUrl = route.params.data.imgUrl
    const qSetIds = route.params.data.qSetIds

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [startPoint, setStartPoint] = useState(1)
    const [finalPost, setFinalPost] = useState([]);
    const [storeOptId, setstoreOptId] = useState();
    const [crtUQids, setcrtUQids] = useState();
    const [areYouSure, setAreYouSure] = useState(false);
    const [manage, setManage] = useState({
        reportHolder: false,
        mesgHolder: true,
        msg: '',
        reportComponet: false
    })


    const attemptData = (questionData) => {
        const thisData = [];
        const prevData = finalPost;
        // prevData.map((item) => {
        //     thisData.push(item);
        // });
        for (i = 0; i < prevData.length; i++) {
            thisData.push(prevData[i])
        }

        let reAttempt = 0;
        thisData.map((item, index) => {
            if (questionData.questionID == item.questionID) {
                reAttempt = 1;
                thisData[index] = questionData;
            }
        });

        if (!reAttempt) {
            thisData.push(questionData);
        }
        setFinalPost(thisData);
    }

    function mcqClicked(optIds, questIds) {
        let selctOpt = optIds
        let qIds = questIds
        let marks = question[currentQuestionIndex].marks;
        let correctAns = question[currentQuestionIndex].answerID;
        setstoreOptId(optIds)
        setcrtUQids(questIds)
        const mcqDataHolder = {
            "questionID": qIds,
            "chouseOptID": selctOpt,
            "questionMarks": marks,
            "getMarks": correctAns == selctOpt ? 1 : 0,
            "correctAnswerID": correctAns,
            "selectedAnswerID": selctOpt,
            "attemptStatus": 1,
            "userRefID": userData.data.userRefID,
            "testTypeID": 7,
            "qSetID": qSetIds
        }
        attemptData(mcqDataHolder)
    }
    function next() {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setStartPoint(startPoint + 1);
    }
    const prev = () => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setStartPoint(startPoint - 1)
    };
    let currentAns = finalPost.filter(item => item.questionID == question[currentQuestionIndex].questionID)[0];

    function submitAssessment(act) {
        if (act == 1) {
            Services.post(apiRoot.submitSafalExamAttempt, { finalAttemptData: finalPost })
                .then((res) => {
                    if (res.status == "success") {
                        setAreYouSure(false)
                        setManage((x) => {
                            return {
                                ...x,
                                reportHolder: true,
                                msg: res.message
                            }
                        })
                        // navigation.goBack()
                    } else {
                        alert(res.message)
                    }

                })
                .catch(error => console.error(error))
                .finally(() => {

                })
        } else {
            setAreYouSure(false)
        }
    }
    function hideReportHolder() {
        setManage((x) => {
            return {
                ...x,
                reportHolder: false,
            }
        })
    }
    function submitAss() {
        setAreYouSure(true)
    }
    function viewReport() {
        setManage((x) => {
            return {
                ...x,
                mesgHolder: false,
                reportComponet: true,
            }
        })
    }


    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: userData.data.colors.mainTheme }}>
                <View style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : 20, backgroundColor: userData.data.colors.liteTheme }}>
                    <View style={{ backgroundColor: userData.data.colors.mainTheme, padding: 10 }}>
                        <Text style={styles.booknameHeading}>Safal Exam Test</Text>
                        <View style={styles.rowView}>
                            <View style={styles.rowForTExt}>
                                <Text style={styles.textSmall}>Total Ques. :{totaQuest} </Text>
                                <Text style={styles.textSmall}>Attempted Ques. : {startPoint}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, padding: 10 }}>
                        <ScrollView>
                            {question[currentQuestionIndex]?.questionPart1 ?
                                <View>
                                    {question[currentQuestionIndex]?.questionPart1.endsWith('.png') || question[currentQuestionIndex]?.questionPart1.endsWith('.jpg') ?
                                        <Image source={{ uri: imgUrl + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart1 }} style={styles.questImgs} /> :

                                        <RenderHtml
                                            contentWidth={width}
                                            source={{ html: question[currentQuestionIndex]?.questionPart1 }}
                                            tagsStyles={tagsStyles}
                                        />
                                    }
                                </View>
                                : null}
                            {question[currentQuestionIndex]?.questionPart2 ?
                                <View>
                                    {question[currentQuestionIndex]?.questionPart2.endsWith('.png') || question[currentQuestionIndex]?.questionPart2.endsWith('.jpg') ?
                                        <Image source={{ uri: imgUrl + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart2 }} style={styles.questImgs} />
                                        :
                                        <RenderHtml
                                            contentWidth={width}
                                            source={{ html: question[currentQuestionIndex].questionPart2 }}
                                            tagsStyles={tagsStyles}
                                        />
                                    }
                                </View>
                                : null}
                            {question[currentQuestionIndex]?.questionPart3 ?
                                <View>
                                    {question[currentQuestionIndex]?.questionPart3.endsWith('.png') || question[currentQuestionIndex]?.questionPart3.endsWith('.jpg') ?
                                        <Image source={{ uri: imgUrl + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart3 }} style={styles.questImgs} />
                                        :
                                        <RenderHtml
                                            contentWidth={width}
                                            source={{ html: question[currentQuestionIndex]?.questionPart3 }}
                                            tagsStyles={tagsStyles}
                                        />
                                    }
                                </View>
                                : null}
                            {question[currentQuestionIndex]?.questionPart4 ?
                                <View>
                                    {question[currentQuestionIndex]?.questionPart4.endsWith('.png') || question[currentQuestionIndex]?.questionPart4.endsWith('.jpg') ?
                                        <Image source={{ uri: imgUrl + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart4 }} style={styles.questImgs} />
                                        :
                                        <RenderHtml
                                            contentWidth={width}
                                            source={{ html: question[currentQuestionIndex]?.questionPart4 }}
                                            tagsStyles={tagsStyles}
                                        />
                                    }
                                </View>
                                : null}
                            {question[currentQuestionIndex]?.questionPart5 ?
                                <View>
                                    {question[currentQuestionIndex]?.questionPart5.endsWith('.png') || question[currentQuestionIndex]?.questionPart5.endsWith('.jpg') ?
                                        <Image source={{ uri: imgUrl + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart5 }} style={styles.questImgs} />
                                        :
                                        <RenderHtml
                                            contentWidth={width}
                                            source={{ html: question[currentQuestionIndex]?.questionPart5 }}
                                            tagsStyles={tagsStyles}
                                        />
                                    }
                                </View>
                                : null}

                            {question[currentQuestionIndex]?.optionText1 ?
                                <View style={styles.optionsView}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            mcqClicked(
                                                question[currentQuestionIndex]?.optionID1,
                                                question[currentQuestionIndex]?.questionID,
                                            )
                                        }}
                                        style={[styles.textWithInput, { backgroundColor: currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID1 ? '#F4F4F4' : 'white' }]}>
                                        <View style={styles.AWithContent}>
                                            <View>
                                                <RadioButton.Item
                                                    onPress={() => {
                                                        mcqClicked(
                                                            question[currentQuestionIndex]?.optionID1,
                                                            question[currentQuestionIndex]?.questionID,
                                                        )
                                                    }}
                                                    status={currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID1 ? 'checked' : 'unchecked'} />
                                            </View>
                                            <Text style={styles.indty}>(a)</Text>
                                            {question[currentQuestionIndex]?.optionText1.endsWith('.png') || question[currentQuestionIndex]?.optionText1.endsWith('.jpg') ?
                                                <Image source={{ uri: imgUrl + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText1 }} style={styles.optImgs} />
                                                :
                                                <RenderHtml
                                                    contentWidth={width}
                                                    source={{ html: question[currentQuestionIndex]?.optionText1 }}
                                                    tagsStyles={optionStyle}
                                                />
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                : null}
                            {question[currentQuestionIndex]?.optionText2 ?
                                <View style={styles.optionsView}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            mcqClicked(
                                                question[currentQuestionIndex]?.optionID2,
                                                question[currentQuestionIndex]?.questionID
                                            )
                                        }}
                                        style={[styles.textWithInput, ({ backgroundColor: currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID2 ? '#F4F4F4' : 'white' })]}>
                                        <View style={styles.AWithContent}>
                                            <View>
                                                <RadioButton.Item
                                                    onPress={() => {
                                                        mcqClicked(
                                                            question[currentQuestionIndex]?.optionID2,
                                                            question[currentQuestionIndex]?.questionID
                                                        )
                                                    }}
                                                    status={currentAns?.questionID == question[currentQuestionIndex]?.questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex]?.optionID2 ? 'checked' : 'unchecked'} />
                                            </View>
                                            <Text style={styles.indty}>(b)</Text>
                                            {question[currentQuestionIndex]?.optionText2.endsWith('.png') || question[currentQuestionIndex]?.optionText2.endsWith('.jpg') ?
                                                <Image source={{ uri: imgUrl + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText2 }} style={styles.optImgs} /> :
                                                <RenderHtml
                                                    contentWidth={width}
                                                    source={{ html: question[currentQuestionIndex]?.optionText2 }}
                                                    tagsStyles={optionStyle}
                                                />
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                : null}
                            {question[currentQuestionIndex]?.optionText3 ?
                                <View style={styles.optionsView}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            mcqClicked(
                                                question[currentQuestionIndex]?.optionID3,
                                                question[currentQuestionIndex]?.questionID
                                            )
                                        }}
                                        style={[styles.textWithInput, ({ backgroundColor: currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID3 ? '#F4F4F4' : 'white' })]}>
                                        <View style={styles.AWithContent}>
                                            <View>
                                                <RadioButton.Item
                                                    onPress={() => {
                                                        mcqClicked(
                                                            question[currentQuestionIndex]?.optionID3,
                                                            question[currentQuestionIndex]?.questionID
                                                        )
                                                    }}
                                                    status={currentAns?.questionID == question[currentQuestionIndex]?.questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex]?.optionID3 ? 'checked' : 'unchecked'} />
                                            </View>
                                            <Text style={styles.indty}>(c)</Text>
                                            {question[currentQuestionIndex]?.optionText3.endsWith('.png') || question[currentQuestionIndex]?.optionText3.endsWith('.jpg') ?
                                                <Image source={{ uri: imgUrl + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText3 }} style={styles.optImgs} /> :
                                                <RenderHtml
                                                    contentWidth={width}
                                                    source={{ html: question[currentQuestionIndex]?.optionText3 }}
                                                    tagsStyles={optionStyle}
                                                />
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                : null}
                            {question[currentQuestionIndex]?.optionText4 ?
                                <View style={styles.optionsView}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            mcqClicked(
                                                question[currentQuestionIndex]?.optionID4,
                                                question[currentQuestionIndex]?.questionID
                                            )
                                        }}
                                        style={[styles.textWithInput, ({ backgroundColor: currentAns?.questionID == question[currentQuestionIndex]?.questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex]?.optionID4 ? '#F4F4F4' : 'white' })]}>
                                        <View style={styles.AWithContent}>
                                            <View>
                                                <RadioButton.Item
                                                    onPress={() => {
                                                        mcqClicked(
                                                            question[currentQuestionIndex]?.optionID4,
                                                            question[currentQuestionIndex]?.questionID
                                                        )
                                                    }}
                                                    status={currentAns?.questionID == question[currentQuestionIndex]?.questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex]?.optionID4 ? 'checked' : 'unchecked'} />
                                            </View>
                                            <Text style={styles.indty}>(d)</Text>
                                            {question[currentQuestionIndex]?.optionText4.endsWith('.png') || question[currentQuestionIndex]?.optionText4.endsWith('.jpg') ?
                                                <Image source={{ uri: imgUrl + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText4 }} style={styles.optImgs} /> :
                                                <RenderHtml
                                                    contentWidth={width}
                                                    source={{ html: question[currentQuestionIndex]?.optionText4 }}
                                                    tagsStyles={optionStyle}
                                                />
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                : null}
                            {question[currentQuestionIndex]?.optionText5 ?
                                <View style={styles.optionsView}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            mcqClicked(
                                                question[currentQuestionIndex]?.optionID5,
                                                question[currentQuestionIndex]?.questionID
                                            )
                                        }}
                                        style={[styles.textWithInput, ({ backgroundColor: currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID5 ? '#F4F4F4' : 'white' })]}>
                                        <View style={styles.AWithContent}>
                                            <View>
                                                <RadioButton.Item
                                                    onPress={() => {
                                                        mcqClicked(
                                                            question[currentQuestionIndex]?.optionID5,
                                                            question[currentQuestionIndex]?.questionID
                                                        )
                                                    }}
                                                    status={currentAns?.questionID == question[currentQuestionIndex]?.questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex]?.optionID5 ? 'checked' : 'unchecked'} />
                                            </View>
                                            <Text style={styles.indty}>(e)</Text>
                                            {question[currentQuestionIndex]?.optionText5.endsWith('.png') || question[currentQuestionIndex]?.optionText5.endsWith('.jpg') ?
                                                <Image source={{ uri: imgUrl + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText5 }} style={styles.optImgs} /> :
                                                <RenderHtml
                                                    contentWidth={width}
                                                    source={{ html: question[currentQuestionIndex]?.optionText5 }}
                                                    tagsStyles={optionStyle}
                                                />
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                : null}
                            {question[currentQuestionIndex]?.optionText6 ?
                                <View style={styles.optionsView}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            mcqClicked(
                                                question[currentQuestionIndex]?.optionID6,
                                                question[currentQuestionIndex]?.questionID
                                            )
                                        }}
                                        style={[styles.textWithInput, ({ backgroundColor: currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID6 ? '#F4F4F4' : 'white' })]}>
                                        <View style={styles.AWithContent}>
                                            <View>
                                                <RadioButton.Item
                                                    onPress={() => {
                                                        mcqClicked(
                                                            question[currentQuestionIndex]?.optionID6,
                                                            question[currentQuestionIndex]?.questionID
                                                        )
                                                    }}
                                                    status={currentAns?.questionID == question[currentQuestionIndex]?.questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex]?.optionID6 ? 'checked' : 'unchecked'} />
                                            </View>
                                            <Text style={styles.indty}>(f)</Text>
                                            {question[currentQuestionIndex]?.optionText6.endsWith('.png') || question[currentQuestionIndex]?.optionText6.endsWith('.jpg') ?
                                                <Image source={{ uri: imgUrl + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText6 }} style={styles.optImgs} /> :
                                                <RenderHtml
                                                    contentWidth={width}
                                                    source={{ html: question[currentQuestionIndex]?.optionText6 }}
                                                    tagsStyles={optionStyle}
                                                />
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                : null}

                        </ScrollView>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        alignItems: "center",
                        bottom: 0,
                        left: 0,
                        backgroundColor: userData.data.colors.hoverTheme,
                        padding: 5,
                        width: '100%'
                    }}>
                        <View>
                            <View style={styles.rowFristCol}>
                                <Button title="Previous" color={userData.data.colors.mainTheme} onPress={prev} disabled={currentQuestionIndex === 0} />
                                <View style={styles.buttonBox}>
                                    <Button title="Next" color={userData.data.colors.mainTheme} onPress={next} disabled={currentQuestionIndex === question.length - 1} />
                                </View>
                            </View>
                        </View>
                        <View>
                            <Button title="Submit" color={SWATheam.SwaBlue} onPress={() => submitAss()} />
                        </View>
                    </View>


                    {areYouSure ?
                        <Modal
                            animationType="slide"
                            transparent={true}
                        >
                            <View style={styles.garyContainer}>
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => setAreYouSure(!areYouSure)}
                                />
                                <View style={styles.listBox}>
                                    <Image style={{ resizeMode: 'contain', width: 80, height: 80, alignSelf: "center", margin: 20 }} source={require('../../assets/mark.png')} />
                                    <Text style={styles.textAlinCenetr}>Are you sure ??</Text>
                                    <Text style={styles.runningTest}>Do you want to submit your exam</Text>
                                    <View style={styles.rowAreYousure}>
                                        <View style={{ width: 80 }}>
                                            <Button onPress={() => { submitAssessment(0) }}
                                                title="Cacel"
                                                color="#dc143c"
                                            />
                                        </View>
                                        <View style={{ width: 80 }}>
                                            <Button onPress={() => { submitAssessment(1) }}
                                                title="OK"
                                                color="#228b22"
                                            />
                                        </View>
                                    </View>

                                </View>

                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => setAreYouSure(!areYouSure)}
                                />
                            </View>
                        </Modal> : null
                    }



                    {/* attempt report Model */}
                    {manage.reportHolder &&
                        <View style={styles.ReportHolder}>
                            <View style={styles.mainHolder}>
                                <Modal animationType="slide" transparent={true}>
                                    <View style={{ backgroundColor: userData.data.colors.hoverTheme, flexDirection: 'row', justifyContent: 'space-between', padding: 10, marginTop: 63, }}>
                                        <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Student Exam Report</Text>
                                        <View><Icon onPress={hideReportHolder} name="close" size={20} color="#231e1a" /></View>
                                    </View>


                                    {manage.mesgHolder &&
                                        <View style={styles.showSms}>
                                            <Text style={styles.youHaveSucc}>{manage.msg}</Text>
                                            <View style={styles.viewReortBtns}>
                                                <Button onPress={viewReport} title="View Report" color={SWATheam.SwaBlue} />
                                            </View>
                                        </View>
                                    }
                                    {manage.reportComponet &&
                                        <Report qSetIds={qSetIds} imgUrl={imgUrl} />
                                    }
                                </Modal>
                            </View>
                        </View>
                    }

                    {/* attempt report Model */}

                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    questImgs: {
        width: 100,
        height: 100,
        resizeMode: "contain"
    },
    optImgs: {
        width: 70,
        height: 70,
        resizeMode: "contain"
    },
    questHolder: {
        margin: 10,
    },
    viewReportBtn: {
        fontSize: 13,
        backgroundColor: "#02aca4",
        borderRadius: 5,
        padding: 4,
        whiteSpace: 'nowrap',
        color: "#fff"
    },
    Tblcontainer: {
        overflow: "scroll"
    },
    allExamHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#c7f0fe"
    },
    headerHolder: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#e3e8ea"
    },
    headerCloseIcons: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#e3e8ea"
    },
    holderActQuest: {
        borderWidth: 1,
        borderColor: "#e3e8ea",
        padding: 10,
        margin: 10
    },
    actionQuestion: {
        backgroundColor: '#fff',
        padding: 5,
        position: "absolute",
        zIndex: 2,
        width: "100%",
        height: "100%",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        left: 0,
    },
    viewQuestionBtns: {
        fontSize: 12,
        padding: 5,
        backgroundColor: "#ffcb00",
        borderRadius: 5
    },
    container: {
        padding: 10,
        width: "100%",
        overflow: "scroll",
        whiteSpace: "nowrap",
        overflow: "visible"
    },
    tableHeader: {
        backgroundColor: '#DCDCDC',
    },
    rowData: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: 'row',
        overflow: "scroll"
    },
    InnerBoxTbls: {
        backgroundColor: "#fff",
    },
    mainHolder: {
        backgroundColor: "#fff",
    },
    headesHead: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f0fff0",
        padding: 2,
        marginBottom: 8,
    },
    viewReortBtns: {
        width: 150,
        marginVertical: 20,
        alignSelf: 'center',
        borderRadius: 6
    },
    youHaveSucc: {
        textAlign: 'center',
        color: "green",
        fontSize: 15
    },
    showSms: {
        backgroundColor: '#fff',
        padding: 10,
        borderWidth: 1,
        borderBlockColor: SWATheam.SwaBlue,
        borderRadius: 10,
        margin: 20
    },
    ReportHolder: {
        backgroundColor: '#fff',
        padding: 5,
        position: "absolute",
        width: "100%",
        height: "100%",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSame: {
        width: 150,
    },
    runningTest: {
        textAlign: "center",
        fontSize: 14,
        color: SWATheam.SwaBlack
    },
    textAlinCenetr: {
        textAlign: "center",
        fontSize: 19,
        fontWeight: "bold",
        color: SWATheam.SwaBlack
    },
    innerBox: {
        backgroundColor: SWATheam.SwaWhite,
        padding: 40,
        borderRadius: 10,
    },
    modelsAre: {
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        padding: 5,
        position: "absolute",
        zIndex: 10,
        width: "100%",
        flex: 1,
        height: "100%",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    },
    table: {
        borderWidth: 0,
        borderColor: "black",
        padding: 10,
        backgroundColor: "#fff",
        width: "100%"
    },
    rowAreYousure: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
    },
    rowHed: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff5ee",
    },
    row: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        width: "100%",
        whiteSpace: 'nowrap'
    },
    cell: {
        flex: 1,
        padding: 3,
        borderWidth: 1,
        textAlign: "center",
        fontSize: 12,
        color: "black",
        borderColor: "#a9a9a9",
    },
    ReportModel: {
        backgroundColor: "rgba(177, 177, 177, 0.28)",
        width: "100%",
        height: "100%",
        position: "fixed",
        left: "0",
        top: "0",
        display: "flex",
        alignItems: "center",
        display: "none"
    },
    btnTNF: {
        backgroundColor: '#b0c4de',
        borderColor: '#778899',
        borderWidth: 0,
        borderRadius: 5,
        width: 100,
        margin: 5,
        padding: 4,
        textAlign: "center",
        fontSize: 14,
        borderWidth: 1
    },
    buttonRows: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft: 12
    },
    indty: {
        width: 25,
        minHeight: "10%",
        fontWeight: "bold"
    },
    AWithContent: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    inputs: {
        width: "90%",
        margin: 2,
        height: 25,
        padding: 3,
        borderColor: "#dcdcdc",
        borderWidth: 1,
        backgroundColor: "#fff",
        borderRadius: 3,
        marginLeft: 25
    },
    textWithInput: {
        width: "100%",
        padding: 7,
        marginTop: 5,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#F2F2F2"
    },
    optionsText: {
        fontSize: 15,
        color: SWATheam.SwaWhite,
        borderRadius: 5,
    },
    questionHeading: {
        fontSize: 17,
        color: SWATheam.SwaWhite,
        fontWeight: "bold",
        backgroundColor: "#F0F0F0",
        padding: 5,
        borderRadius: 5,
    },
    questHolders: {
        margin: 10,
        borderWidth: 1,
        padding: 5,
        borderColor: "red",
        height: "80vh",
        width: "95%",
        overflow: "auto"
    },
    buttonBox: {
        marginLeft: 10,
    },
    rowFristCol: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerSections: {
        position: "absolute",
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        bottom: 0,
        left: 0,
        backgroundColor: '#708090',
        padding: 5,
        width: '100%'
    },
    textSmall: {
        color: "#fff",
        fontSize: 13
    },
    rowForTExt: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5
    },
    booknameHeading: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
        color: "#fff",
        borderBottomWidth: 1,
        padding: 2,
        borderColor: "#008080"
    },
    headerAsse: {
        backgroundColor: "#0c8781",
        padding: 10,
    },
    attemptHolder: {

        backgroundColor: "#fff",
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        borderColor: "#0c8781",
        borderWidth: 1,
    },
    generateTest: {
        margin: 10,
    },
    chapterName: {
        backgroundColor: "#fff",
        padding: 9,
        margin: 8,
        fontSize: 12,
        borderRadius: 5,
        borderColor: "#ffe4e1",
        borderWidth: 1,
    },
    chapterListHolder: {
        padding: 5,
        borderColor: "#708090",
        borderRadius: 3,
        margin: 10,
        borderWidth: 1,
        backgroundColor: "#708090",
        height: "80%",
        overflow: "auto"
    },
    selectBar: {
        backgroundColor: '#1e90ff',
        padding: 10,
        width: "100%",
    },
    sltSubJect: {
        backgroundColor: "#fff",
        padding: 9,
        fontSize: 13,
        position: "relative",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#dcdcdc",
        alignItems: "center",
        display: "flex"
    },
    Datamodels: {
        backgroundColor: "rgba(177, 177, 177, 0.28)",
        width: "100%",
        height: "100%",
        position: "fixed",
        left: "0",
        top: "0",
        display: "flex",
        alignItems: "center",
    },
    innerModel: {
        backgroundColor: "#fff",
        padding: 10,
        position: "absolute",
        top: '20%',
        width: "99%",
        left: "1%",
        borderRadius: 10,
        fontSize: 12,
        borderColor: "#5f9ea0",
        borderWidth: 1,
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#dcdcdc"
    },
    statusView: {
        backgroundColor: "#fffacd",
        textAlign: "center",
        padding: 7,
        margin: 7,
        top: "11%"
    },
    contain: {
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "rgb(235 235 235)",
        margin: 8,
        padding: 10,
        alignContent: "center",
        borderColor: "#b0e0e6"
    },
    textBook: {
        textAlign: "center"
    },
    garyContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10
    },
    listBox: {
        backgroundColor: SWATheam.SwaWhite,
        width: "100%",
        alignSelf: 'center',
        padding: 10,
        borderRadius: 10
    },
});
