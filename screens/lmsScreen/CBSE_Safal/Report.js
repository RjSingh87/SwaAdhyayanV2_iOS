import { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, ScrollView, Button, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { DataTable, overlay } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RadioButton } from 'react-native-paper';
import { GlobleData } from '../../../Store';
import { apiRoot, SWATheam } from '../../../constant/ConstentValue';
import Services from '../../../Services';
import Loader from '../../common/Loader';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Report({ question, totaQuest, imgUrl, qSetIds }) {

    const { width } = useWindowDimensions();
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
    useEffect(() => {
        showReport(1);
    }, [])

    const [getReport, setreport] = useState([])
    const [allReportData, setallReportData] = useState([])
    const [manage, setManage] = useState({
        showloader: false,
        mesgHolder: true,
        msg: '',
        reportComponet: false,
        totalPresent: '',
        AllReportList: false
    })
    function showReport(act, ids) {
        let secondSetIds = ids
        setManage((x) => {
            return { ...x, showloader: true }
        })
        var xData = '';
        if (act == 1) {
            xData = {
                "qSetID": qSetIds,
            }
        }
        else {
            setreport([])
            hideReportSection()
            xData = {
                "qSetID": secondSetIds,
            }
        }

        Services.post(apiRoot.safalViewAttemptExamReport, xData)
            .then((res) => {

                if (res.status == "success") {
                    console.log(res)
                    setreport(res.data)
                    let totalP = res.data.percentage;
                    let totlPresent = parseFloat(totalP.toFixed(2));
                    setManage((x) => {
                        return { ...x, showloader: false, totalPresent: totlPresent }
                    })
                } else {
                    alert(res.message);
                }
            })
            .catch((err) => {
                alert(err)
            })
            .finally(() => {
                setManage((x) => {
                    return { ...x, showloader: false }
                })
            })
    }
    function viewAction(item) {
        let allItem = item
        setGetQuest(allItem)
        setActData((old) => {
            return {
                ...old,
                modelHolder: true,
                showQuestActId: item.activityID
            }
        })
    }
    // action views 
    const [getquest, setGetQuest] = useState()
    const [actData, setActData] = useState({
        modelHolder: false,
        showQuestActId: ""
    })
    function hideExamQuest() {
        setActData((old) => {
            return { ...old, modelHolder: false }
        })
    }
    function viewAction(item) {
        let allItem = item

        setGetQuest(allItem)
        setActData((old) => {
            return {
                ...old,
                modelHolder: true,
            }
        })

    }
    function allAttemReport() {
        setManage((x) => {
            return { ...x, showloader: true }
        })
        const aData = {
            "userRefID": userData.data.userRefID
        }
        Services.post(apiRoot.safalViewAllAttemptExamReport, aData)
            .then((res) => {
                if (res.status == "success") {
                    setallReportData(res.data);
                    setManage((x) => {
                        return {
                            ...x,
                            AllReportList: true
                        }
                    })

                } else {
                    alert(res.message);
                }
            })
            .catch((err) => {
                alert(err)
            })
            .finally(() => {
                setManage((x) => {
                    return { ...x, showloader: false }
                })
            })
    }

    function hideReportSection() {
        setManage((x) => {
            return {
                ...x,
                AllReportList: false
            }
        })
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['left', "right", "bottom"]} style={{ flex: 1, }}>
                <View style={styles.table}>
                    <View style={styles.headesHead}>
                        <Text>Exam Report</Text>
                        <View style={styles.attptRepBtn}>
                            <Button onPress={allAttemReport} style={{ fontSize: 11, padding: 5, width: 80 }} title="Attempt Report" color="#0c8781" />
                        </View>
                    </View>
                    <View style={styles.rowHed}>
                        <Text style={[styles.cell]}>Total Marks:{getReport.totalMarks}</Text>
                        <Text style={styles.cell}>Optained Marks: {getReport.optainedMarks}</Text>
                        <Text style={styles.cell}>Percentage: {manage.totalPresent}</Text>
                    </View>

                    <ScrollView>
                        <View style={styles.InnerBoxTbls}>
                            <DataTable style={styles.container}>
                                <DataTable.Header style={{ backgroundColor: userData.data.colors.liteTheme }}>
                                    <DataTable.Title style={{ width: '50' }}>No.</DataTable.Title>
                                    <DataTable.Title>Correct Ans</DataTable.Title>
                                    <DataTable.Title>Your Ans</DataTable.Title>
                                    <DataTable.Title>Status</DataTable.Title>
                                    <DataTable.Title>Action</DataTable.Title>
                                </DataTable.Header>

                                {getReport.reportData?.map((item, index, rData) => {
                                    return (
                                        <DataTable.Row key={index}>
                                            <DataTable.Cell style={{ width: '50' }}>{index + 1}</DataTable.Cell>
                                            <DataTable.Cell>
                                                <Text style={{ color: SWATheam.SwaBlack }}>{item?.correctAnswerID == 1 && item.activityID == 1 ? "(a)" : ''}</Text>
                                                <Text style={{ color: SWATheam.SwaBlack }}>{item?.correctAnswerID == 2 && item.activityID == 1 ? "(b)" : ''}</Text>
                                                <Text style={{ color: SWATheam.SwaBlack }}>{item?.correctAnswerID == 3 && item.activityID == 1 ? "(c)" : ''}</Text>
                                                <Text style={{ color: SWATheam.SwaBlack }}>{item?.correctAnswerID == 4 && item.activityID == 1 ? "(d)" : ''}</Text>
                                            </DataTable.Cell>
                                            <DataTable.Cell>
                                                <Text style={{ color: SWATheam.SwaBlack }} >{item?.correctAnswerID == 1 && item.activityID == 1 ? "(a)" : ''}</Text>
                                                <Text style={{ color: SWATheam.SwaBlack }} >{item?.correctAnswerID == 2 && item.activityID == 1 ? "(b)" : ''}</Text>
                                                <Text style={{ color: SWATheam.SwaBlack }} >{item?.correctAnswerID == 3 && item.activityID == 1 ? "(c)" : ''}</Text>
                                                <Text style={{ color: SWATheam.SwaBlack }} >{item?.correctAnswerID == 4 && item.activityID == 1 ? "(d)" : ''}</Text>
                                            </DataTable.Cell>
                                            <DataTable.Cell>
                                                {item.selectedAnswerID == item.correctAnswerID ?
                                                    <Text><Icon name="check" size={20} color="#38761d" /></Text> :
                                                    <Text><Icon name="close" size={20} color="#cd0027" /></Text>
                                                }
                                            </DataTable.Cell>
                                            <DataTable.Cell>
                                                <TouchableOpacity>
                                                    <Text style={{ backgroundColor: userData.data.colors.mainTheme, padding: 6, borderRadius: 6, color: SWATheam.SwaWhite }} onPress={() => { viewAction(item) }}>View Q</Text>
                                                </TouchableOpacity>
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    )
                                })}

                            </DataTable>
                        </View>
                    </ScrollView>

                    {actData.modelHolder &&
                        <View style={styles.actionQuestion}>
                            <Modal animationType="slide">
                                <View style={{ backgroundColor: userData.data.colors.hoverTheme, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Exam Question</Text>
                                    <View><Icon onPress={hideExamQuest} name="close" size={20} color="#231e1a" /></View>
                                </View>
                                <View style={styles.holderActQuest}>

                                    <ScrollView>
                                        <View>
                                            <RenderHtml
                                                contentWidth={width}
                                                source={{ html: getquest.questionPart1 }}
                                                tagsStyles={tagsStyles}
                                            />
                                            <View style={styles.optionsView}>
                                                {getquest?.optionText1 ?
                                                    <View style={styles.optionsView}>
                                                        <TouchableOpacity style={[styles.textWithInput, { backgroundColor: getquest.optionID1 == getquest.selectedAnswerID ? userData.data.colors.liteTheme : "#e3e8ea" }]}>
                                                            <View style={styles.AWithContent}>
                                                                <View>
                                                                    <RadioButton.Item color={userData.data.colors.mainTheme} value="first" status={getquest.optionID1 == getquest.selectedAnswerID ? 'checked' : 'unchecked'} /></View>
                                                                <Text style={styles.indty}>(a)</Text>
                                                                {getquest.optionText1.endsWith('.png') || getquest?.optionText1.endsWith('.jpg') ?
                                                                    <Image source={{ uri: imgUrl + getquest?.imagePath + getquest?.optionText1 }} style={styles.optImgs} /> :
                                                                    <RenderHtml
                                                                        contentWidth={width}
                                                                        source={{ html: getquest.optionText1 }}
                                                                        tagsStyles={optionStyle}
                                                                    />
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                    : null}
                                                {getquest?.optionText2 ?
                                                    <View style={styles.optionsView}>
                                                        <TouchableOpacity style={[styles.textWithInput, { backgroundColor: getquest.optionID2 == getquest.selectedAnswerID ? userData.data.colors.liteTheme : "#e3e8ea" }]}>
                                                            <View style={styles.AWithContent}>
                                                                <View>
                                                                    <RadioButton.Item color={userData.data.colors.mainTheme} value="first" status={getquest.optionID2 == getquest.selectedAnswerID ? 'checked' : 'unchecked'} />
                                                                </View>
                                                                <Text style={styles.indty}>(b)</Text>
                                                                {getquest.optionText2.endsWith('.png') || getquest?.optionText2.endsWith('.jpg') ?
                                                                    <Image source={{ uri: imgUrl + getquest?.imagePath + getquest?.optionText2 }} style={styles.optImgs} />
                                                                    :
                                                                    <RenderHtml
                                                                        contentWidth={width}
                                                                        source={{ html: getquest.optionText2 }}
                                                                        tagsStyles={optionStyle}
                                                                    />
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                    : null}

                                                {getquest?.optionText3 ?
                                                    <View style={styles.optionsView}>
                                                        <TouchableOpacity style={[styles.textWithInput, { backgroundColor: getquest.optionID3 == getquest.selectedAnswerID ? userData.data.colors.liteTheme : "#e3e8ea" }]}>
                                                            <View style={styles.AWithContent}>
                                                                <View>
                                                                    <RadioButton.Item color={userData.data.colors.mainTheme} value="first" status={getquest.optionID3 == getquest.selectedAnswerID ? 'checked' : 'unchecked'} />
                                                                </View>
                                                                <Text style={styles.indty}>(c)</Text>
                                                                {getquest.optionText3.endsWith('.png') || getquest?.optionText3.endsWith('.jpg') ?
                                                                    <Image source={{ uri: imgUrl + getquest?.imagePath + getquest?.optionText3 }} style={styles.optImgs} />
                                                                    :
                                                                    <RenderHtml
                                                                        contentWidth={width}
                                                                        source={{ html: getquest.optionText3 }}
                                                                        tagsStyles={optionStyle}
                                                                    />
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                    : null}

                                                {getquest?.optionText4 ?
                                                    <View style={styles.optionsView}>
                                                        <TouchableOpacity style={[styles.textWithInput, { backgroundColor: getquest.optionID4 == getquest.selectedAnswerID ? userData.data.colors.liteTheme : "#e3e8ea" }]}>
                                                            <View style={styles.AWithContent}>
                                                                <View>
                                                                    <RadioButton.Item value="first" status={getquest.optionID4 == getquest.selectedAnswerID ? 'checked' : 'unchecked'} />
                                                                </View>
                                                                <Text style={styles.indty}>(d)</Text>
                                                                {getquest.optionText4.endsWith('.png') || getquest?.optionText4.endsWith('.jpg') ?
                                                                    <Image source={{ uri: imgUrl + getquest?.imagePath + getquest?.optionText4 }} style={styles.optImgs} />
                                                                    :
                                                                    <RenderHtml
                                                                        contentWidth={width}
                                                                        source={{ html: getquest.optionText4 }}
                                                                        tagsStyles={optionStyle}
                                                                    />
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                    : null}

                                                {getquest?.optionText5 ?
                                                    <View style={styles.optionsView}>
                                                        <TouchableOpacity style={[styles.textWithInput, { backgroundColor: getquest.optionID5 == getquest.selectedAnswerID ? userData.data.colors.liteTheme : "#e3e8ea" }]}>
                                                            <View style={styles.AWithContent}>
                                                                <View>
                                                                    <RadioButton.Item value="first" status={getquest.optionID5 == getquest.selectedAnswerID ? 'checked' : 'unchecked'} />
                                                                </View>
                                                                <Text style={styles.indty}>(e)</Text>
                                                                {getquest.optionText5.endsWith('.png') || getquest?.optionText5.endsWith('.jpg') ?
                                                                    <Image source={{ uri: imgUrl + getquest?.imagePath + getquest?.optionText5 }} style={styles.optImgs} />
                                                                    :
                                                                    <RenderHtml
                                                                        contentWidth={width}
                                                                        source={{ html: getquest.optionText5 }}
                                                                        tagsStyles={optionStyle}
                                                                    />
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                    : null}

                                                {getquest?.optionText6 ?
                                                    <View style={styles.optionsView}>
                                                        <TouchableOpacity style={[styles.textWithInput, { backgroundColor: getquest.optionID6 == getquest.selectedAnswerID ? userData.data.colors.liteTheme : "#e3e8ea" }]}>
                                                            <View style={styles.AWithContent}>
                                                                <View>
                                                                    <RadioButton.Item value="first" status={getquest.optionID6 == getquest.selectedAnswerID ? 'checked' : 'unchecked'} />
                                                                </View>
                                                                <Text style={styles.indty}>(f)</Text>
                                                                {getquest.optionText6.endsWith('.png') || getquest?.optionText6.endsWith('.jpg') ?
                                                                    <Image source={{ uri: imgUrl + getquest?.imagePath + getquest?.optionText6 }} style={styles.optImgs} />
                                                                    :
                                                                    <RenderHtml
                                                                        contentWidth={width}
                                                                        source={{ html: getquest.optionText6 }}
                                                                        tagsStyles={optionStyle}
                                                                    />
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                    : null}


                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                            </Modal>
                        </View>
                    }

                    {manage.AllReportList &&
                        <View style={{ flex: 1 }}>
                            <Modal animationType="slide">
                                <View style={{ backgroundColor: userData.data.colors.hoverTheme, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Student All Exam Report</Text>
                                    <View><Icon onPress={hideReportSection} name="close" size={20} color="#231e1a" /></View>
                                </View>
                                <View style={{ padding: 10, flex: 1, backgroundColor: userData.data.colors.liteTheme, }}>
                                    <ScrollView >
                                        {allReportData.map((item, index, alD) => {
                                            return (
                                                <View style={{ backgroundColor: SWATheam.SwaWhite, padding: 10, margin: 6, borderRadius: 6, elevation: 9 }} key={index}>
                                                    <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                                                        <View style={{ width: 130 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Set Code</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={{ color: SWATheam.SwaBlack }}>{item.qSetCode}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                                                        <View style={{ width: 130 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Attempted Date</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={{ color: SWATheam.SwaBlack }}>{item.dateOfAttempt}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                                                        <View style={{ width: 130 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Status</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={{ color: SWATheam.SwaBlack }}>Attempted</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                                                        <View style={{ width: 130 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Action</Text>
                                                        </View>
                                                        <View>
                                                            <TouchableOpacity style={{ backgroundColor: SWATheam.SwaBlue, padding: 6, borderRadius: 4 }}>
                                                                <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }} onPress={() => { showReport(2, item.qSetID) }}>View Report</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>

                                                </View>)
                                        })}
                                    </ScrollView>

                                </View>
                            </Modal>


                        </View>
                    }

                    {manage.showloader &&
                        <Loader />
                    }
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
        height: '80vh',
        overflow: 'scroll'
    },
    mainHolder: {
        backgroundColor: "#fff"
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
        margin: 150,
        margin: 'auto',
        marginTop: 10
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
        borderBlockColor: "#a7e237",
        borderRadius: 10,
        margin: 20
    },
    ReportHolder: {
        backgroundColor: '#fff',
        padding: 5,
        position: "absolute",
        width: "100%",
        flex: 1,
        height: "100%",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    },
    buttonSame: {
        width: 150,
    },
    runningTest: {
        textAlign: "center",
        fontSize: 14,
    },
    textAlinCenetr: {
        textAlign: "center",
        fontSize: 19,
        fontWeight: "bold"
    },
    innerBox: {
        backgroundColor: "#fff",
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
        display: "none",
        overflow: "scroll"
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
        borderColor: "#fff5ee",
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
    }
});
