import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking, Modal, Platform } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import SwaHeader from '../../common/SwaHeader';
import Services from '../../../Services';
import Loader from '../../common/Loader';
import { GlobleData } from '../../../Store';
import { apiRoot, SWATheam } from '../../../constant/ConstentValue';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';



const LiveClassList = ({ navigation }) => {
    const { userData } = useContext(GlobleData)
    const date1 = new Date();
    const todayDate = `${date1.getFullYear()}-${String(
        date1.getMonth() + 1
    ).padStart(2, "0")}-${String(date1.getDate()).padStart(2, "0")}`;
    const [meetIds, setMeetIds] = useState()
    const [isDlt, setIsDlt] = useState(false)
    const [isLoad, setIsload] = useState(false);
    const [liveClslist, setLiveClassList] = useState([]);

    useEffect(() => {
        getLiveClassListFun()
    }, [])

    function getLiveClassListFun() {
        const payLoad = {
            "schoolCode": userData.data.schoolCode,
            "userRefID": userData.data.userRefID,
            "userTypeID": userData.data.userTypeID,
        }
        Services.post(apiRoot.liveClassesList, payLoad)
            .then((result) => {
                if (result.status === "success") {
                    setLiveClassList(result.data)
                    setIsload(false);
                } else {
                    console.log(result.message);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsload(false);
            });
    }

    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        // setIsInstruction(true)
    }

    function showModelConf(items) {
        setMeetIds(items.meetingID)
        setIsDlt(true)
    }
    function noDelete() {
        setIsDlt(false)
    }

    function deleteLiveCls() {
        setIsload(true);
        const payLoad = {
            "schoolCode": userData.data.schoolCode,
            "meetingID": meetIds,
        }
        Services.post(apiRoot.deleteLiveClass, payLoad)
            .then((result) => {
                if (result.status === "success") {
                    alert(result.message);
                    setLiveClassList([])
                    getLiveClassListFun()
                    setIsload(false);
                    setIsDlt(false)
                } else {
                    alert(result.message);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsload(false);
            })
    }

    const insets = useSafeAreaInsets()

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['left', 'right', 'top']} style={[styles.holderListLive, { backgroundColor: userData?.data?.colors?.mainTheme }]}>
                <View style={{ flex: 1, paddingBottom: insets.bottom, backgroundColor: userData?.data?.colors?.liteTheme }}>
                    <SwaHeader title={"Live Classes List"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
                    {isLoad ?
                        <Loader /> :
                        <View style={styles.whiteBox}>
                            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                                {liveClslist?.length > 0 ? (
                                    liveClslist.map((items, index) => (
                                        <View style={[styles.boxHolder, { margin: 10 }]} key={index}>
                                            <View style={styles.rowView}>
                                                <Text style={styles.number}>Sr.No.</Text>
                                                <Text style={styles.numberRight}>{liveClslist.indexOf(items) + 1}.</Text>
                                            </View>
                                            <View style={styles.rowView}>
                                                <Text style={styles.number}>Class / Section</Text>
                                                <Text style={styles.numberRight}>
                                                    {items.getClassName.className} - {items.getSectionName.sectionName}
                                                </Text>
                                            </View>
                                            <View style={styles.rowView}>
                                                <Text style={styles.number}>Subject</Text>
                                                <Text style={styles.numberRight}>{items.getSubjectName.subjectName}</Text>
                                            </View>
                                            <View style={styles.rowView}>
                                                <View>
                                                    <Text style={styles.number}>Topic</Text>
                                                    <Text>{items.subjectTopic}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.rowView}>
                                                <View>
                                                    <Text style={styles.number}>Instruction</Text>
                                                    <Text>{items.meetingInstruction}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.rowView}>
                                                <Text style={styles.number}>Start Date</Text>
                                                <Text style={styles.numberRight}>{items.startDateTime}</Text>
                                            </View>
                                            <View style={styles.rowView}>
                                                <Text style={styles.number}>End Date</Text>
                                                <Text style={styles.numberRight}>{items.endDateTime}</Text>
                                            </View>
                                            <View style={styles.rowView}>
                                                <Text style={styles.number}>Type</Text>
                                                <View style={styles.numberRight}>
                                                    {new Date(items.endDateTime) > new Date(todayDate) ? (
                                                        <TouchableOpacity
                                                            style={styles.joinBtn}
                                                            onPress={() => Linking.openURL(items.meetingURL)}
                                                        >
                                                            <Text style={{ color: "#fff", fontSize: 14 }}>Join</Text>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity style={styles.held}>
                                                            <Text style={{ color: "#fff", fontSize: 14 }}>Held</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                            <View style={[styles.rowView, { borderBottomWidth: 0 }]}>
                                                <Text style={styles.number}>Action</Text>
                                                <View style={styles.numberRight}>
                                                    <TouchableOpacity style={styles.deleteCls} onPress={() => showModelConf(items)}>
                                                        <AntDesign name="delete" size={20} color="red" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{ textAlign: "center", margin: 20, fontSize: 14 }}>No live classes available</Text>
                                )}
                            </ScrollView>
                        </View>
                    }

                    {isDlt &&
                        <Modal animationType="slide" transparent={true}>
                            <View style={styles.bgModal2}>
                                <View style={styles.holderModel2}>
                                    <EvilIcons style={styles.iconsq} name="question" size={100} />
                                    <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                                        Are you sure you want to delete this record?
                                    </Text>
                                    <Text style={{ textAlign: "center" }}>If you delete this, it will be gone forever.</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 25 }}>
                                        <TouchableOpacity style={styles.buttonTouch} onPress={deleteLiveCls}>
                                            <Text style={{ textAlign: "center", color: '#fff' }}>Confirm</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={noDelete} style={[styles.buttonTouch, { backgroundColor: "red" }]}>
                                            <Text style={{ textAlign: "center", color: '#fff' }}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    }
                </View>
            </SafeAreaView>


        </SafeAreaProvider>
    )
}

export default LiveClassList

const styles = StyleSheet.create({
    buttonTouch: {
        width: 80,
        padding: 8,
        borderRadius: 5,
        elevation: 1,
        backgroundColor: "green"
    },
    iconsq: {
        alignSelf: 'center',
        color: '#fa8805',
        margin: 20
    },
    deleteCls: {
        paddingHorizontal: 15,
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'red',
    },
    joinBtn: {
        paddingHorizontal: 15,
        padding: 5,
        borderRadius: 5,
        backgroundColor: 'green'
    },
    held: {
        paddingHorizontal: 15,
        padding: 5,
        borderRadius: 5,
        backgroundColor: 'red'
    },
    holderListLive: {
        flex: 1,
        marginTop: Platform.OS == "ios" ? 0 : 24,

    },
    whiteBox: {
        flex: 1,
    },
    rowFlex: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        padding: 5
    },
    doneBtn: {
        borderWidth: 1,
        padding: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderColor: "#07a26f"
    },
    rowCheckWith: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
    },
    rowView: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#dddddd",
        padding: 10
    },
    number: {
        fontSize: 16,
        fontWeight: "bold",
        color: SWATheam.SwaBlack

    },
    numberRight: {
        fontSize: 16,
        color: SWATheam.SwaBlack
    },
    optionsCheck: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10
    },
    boxHolder: {
        backgroundColor: "#fff",
        padding: 10,
        elevation: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#a0f1a0",
        marginTop: 18
    },

    button: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 50,
        borderColor: "#e4e4e4",
        elevation: 3,
        backgroundColor: "#fff",
        width: 150,
    },
    ViewBox: {
        backgroundColor: "#00000036",
        width: '100%',
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    boxContainer: {
        backgroundColor: "#fff",
        width: '95%',
        borderRadius: 10,
        flex: 1,
        marginTop: 10,
        marginBottom: 10
    },
    errorText: {
        textAlign: 'center',
        margin: 15,
        color: 'red'
    },


    holderModel: {
        backgroundColor: "#fff",
        padding: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'relative'
    },
    holderModel2: {
        backgroundColor: "#fff",
        padding: 15,
        position: 'relative',
        margin: 10,
        borderRadius: 10
    },
    assignMeeting: {
        backgroundColor: "#46a26a",
        padding: 10,
        borderRadius: 15,
        elevation: 2,
        margin: 10
    },
    rowInput: {
        margin: 3,
        borderWidth: 1,
        borderColor: "#e3e0e0",
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        marginBottom: 10,
        height: 53,
    },
    inputBox: {
        margin: 3,
        borderWidth: 1,
        borderColor: "#e3e0e0",
        padding: 2,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginBottom: 15,
        height: 50,
        flex: 1
    },
    formBgs: {
        borderWidth: 1,
        margin: 5,
        padding: 5,
        borderColor: "#f3f3f3",
        backgroundColor: "#f8f8f8",
        borderRadius: 10
    },
    iconsImgss: {
        width: 30,
        height: 30,
        resizeMode: "contain",
        margin: 'auto'
    },
    buttonClick: {
        borderWidth: 1,
        borderColor: "#e5e9e9",
        width: 115,
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        margin: 2,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff",
    },
    textInBtn: {
        fontSize: 14,
        color: SWATheam.SwaWhite
    },
    row2: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-around",
        margin: 15
    },
    row: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 15
    },
    headerAss: {
        backgroundColor: SWATheam.SwaWhite,
        elevation: 5,
        padding: 10
    },
    asslistText: {
        color: SWATheam.SwaBlack,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold",
    },
    buttonLive: {
        padding: 10,
        paddingHorizontal: 10,
        borderRadius: 50,
        borderColor: '#5cbbb4',
        backgroundColor: "#0ea0f3",
        elevation: 3
    },
    bgModal: {
        backgroundColor: "#00000047",
        width: "100%",
        height: "100%",
        flex: 1,
        display: 'flex',
        justifyContent: "flex-end"
    },
    bgModal2: {
        backgroundColor: "#00000047",
        width: "100%",
        height: "100%",
        flex: 1,
        display: 'flex',
        justifyContent: "center"
    }
})