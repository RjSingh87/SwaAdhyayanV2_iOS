import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, NativeModules, Platform, PermissionsAndroid, Linking } from "react-native"
import { useState, useContext, useEffect } from "react"
// import { generatePDF } from 'react-native-html-to-pdf';
import SwaHeader from "../common/SwaHeader";
import { GlobleData } from "../../Store";
import Services from "../../Services";
import { SWATheam, apiRoot } from "../../constant/ConstentValue";
import Loader from "../common/Loader";
import SelectionBox from "../common/SelectionBox";
import BottomDrawerList from "../common/BottomDrawerList";
import MsgModal from "../common/MsgModal";
import FileViewer from "react-native-file-viewer";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
const { FileOpener } = NativeModules;

import RNPrint from 'react-native-print';

const font15 = 15

const StudentList = ({ navigation, route }) => {
    const { FileOpener } = NativeModules;
    const insets = useSafeAreaInsets();
    const statusBarHeight = StatusBar.currentHeight
    const { userData } = useContext(GlobleData)
    const [selectedField, setSelectedField] = useState({ class: null, section: null })
    const [listItem, setListItem] = useState({ list: null, status: false, type: '' })
    const [studentData, setStudentData] = useState({ data: null, status: false })
    const [stuList, setStuList] = useState(false)
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false)
    const [msgModalVisible, setMsgModalVisible] = useState({ msg: '', status: false, type: '' })

    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }

    function getListItem(type) {
        setLoading(true)
        if (type == "class") {
            const payload = {
                "schoolID": userData.data.schoolID,
                "userTypeID": userData.data.userTypeID,
                "userRefID": userData.data.userRefID,
                "academicYear": userData.data.academicYear
            }
            Services.post(apiRoot.getClassList, payload)
                .then((res) => {
                    if (res.status == "success") {
                        setListItem((prev) => {
                            return { ...prev, list: res.data, status: true, type: type }
                        });
                        setLoading(false)
                    } else if (res.status == "error") {
                        setLoading(false)
                        setMsgModalVisible((prev) => {
                            return { ...prev, msg: res.message, status: true, type: 'error' }
                        })
                        setTimeout(() => {
                            setMsgModalVisible((prev) => {
                                return { ...prev, status: false }
                            })
                        }, 2000)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    setLoading(false)
                })


        } else if (type == "section") {
            if (selectedField.class != null) {
                const payload = {
                    "schoolID": userData.data.schoolID,
                    "academicYear": userData.data.academicYear,
                    "classID": selectedField.class.classID,
                    "userTypeID": userData.data.userTypeID,
                    "userRefID": userData.data.userRefID
                }
                Services.post(apiRoot.getSectionList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setLoading(false)
                            setListItem((prev) => {
                                return { ...prev, list: res.data, status: true, type: type }
                            });
                        } else if (res.status == "error") {
                            setLoading(false)
                            setMsgModalVisible((prev) => {
                                return { ...prev, msg: res.message, status: true, type: 'error' }
                            })
                            setTimeout(() => {
                                setMsgModalVisible((prev) => {
                                    return { ...prev, status: false }
                                })
                            }, 2000)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            } else {
                alert("Please select class.")
                setLoading(false)
            }

        }

    }
    function getSelectedItem(item, type) {
        if (type == "class") {
            setSelectedField((prev) => {
                return { ...prev, class: item, section: null }
            })
            setListItem((prev) => {
                return { ...prev, status: false }
            })
            setStuList(false)
        } else if (type == "section") {
            setSelectedField((prev) => {
                return { ...prev, section: item }
            })
            setListItem((prev) => {
                return { ...prev, status: false }
            })
            getStudentDataList(item)
        }

    }


    function closeModule() {
        setListItem((prev) => {
            return { ...prev, status: false }
        });
    }
    function getStudentDataList(item) {
        setLoading(true)
        const payload = {
            "schoolID": userData.data.schoolID,
            "classID": Number(selectedField.class.classID),
            "sectionID": Number(item.sectionID),
            // "academicYear": userData.data.academicYear,
            "transYear": userData.data.transYear
        }
        Services.post(apiRoot.getStudentsData, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    const data = res.data
                    setStudentData((prev) => {
                        return { ...prev, data: data, status: true }
                    })
                    setStuList(true)
                } else if (res.status == "error") {
                    setLoading(false)
                    setMsgModalVisible((prev) => {
                        return { ...prev, msg: res.message, status: true, type: 'error' }
                    })
                    setTimeout(() => {
                        setMsgModalVisible((prev) => {
                            return { ...prev, status: false }
                        })
                    }, 2000)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    // async function requestStoragePermission() {
    //     if (Platform.OS === 'android' && Platform.Version >= 33) {
    //         try {
    //             const granted = await PermissionsAndroid.requestMultiple([
    //                 PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    //                 PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    //                 PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
    //                 PermissionsAndroid.PERMISSIONS.READ_MEDIA_DOCUMENTS, // 🔑 for PDFs
    //             ]);

    //             const allGranted = Object.values(granted).every(
    //                 status => status === PermissionsAndroid.RESULTS.GRANTED
    //             );

    //             if (!allGranted) {
    //                 alert(
    //                     "Storage permission is required to open PDF. Please enable it in Settings."
    //                 );
    //                 Linking.openSettings(); // user ko settings me le jao
    //                 return false;
    //             }
    //             return true;
    //         } catch (err) {
    //             console.log("Permission error:", err);
    //             return false;
    //         }
    //     } else if (Platform.OS === 'android' && Platform.Version < 33) {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    //         );
    //         return granted === PermissionsAndroid.RESULTS.GRANTED;
    //     } else {
    //         return true;
    //     }
    // }


    const printAndSharePDF = async (htmlContent) => {
        try {
            await RNPrint.print({
                html: htmlContent
            });
        } catch (err) {
            console.log("Print/Share error:", err);
        }
    };


    const openPDf = async () => {

        try {
            setLoading(true);

            const html = `
        <html>
        <head>
            <style>
                body { font-family: Helvetica; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #000; padding: 5px; }
                th { background-color: #ccc; }
                h1 { text-align: center; }
            </style>
        </head>

        <body>
            <h1>Student List</h1>

            <table>
                <tr>
                    <th>S.No</th>
                    <th>Enrollment No.</th>
                    <th>Student Name</th>
                    <th>Date of Birth</th>
                    <th>Contact No.</th>
                    <th>Access Code</th>
                </tr>

                ${studentData.data.map((item, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.registrationNo}</td>
                        <td>${item.fullName}</td>
                        <td>${item.dateOfBirth}</td>
                        <td>${item.fatherContact}</td>
                        <td>${item.accessCode}</td>
                    </tr>
                `).join('')}

            </table>
        </body>
        </html>
        `;

            await RNPrint.print({
                html: html,
            });

        } catch (err) {
            console.log("Print Error:", err);
        } finally {
            setLoading(false);
        }
    };



    return (
        <SafeAreaProvider>
            <View style={{ backgroundColor: userData.data.colors.mainTheme, flex: 1, paddingTop: insets.top, marginBottom: insets.bottom }}>
                <SwaHeader title={'Student List'} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
                <View style={{ padding: 10, flex: 1, backgroundColor: SWATheam.SwaWhite }}>
                    <SelectionBox getListItem={getListItem} selectedField={selectedField?.class?.getClassDetail?.classDesc} type="class" placeholder="Select class" />
                    <SelectionBox getListItem={getListItem} selectedField={selectedField?.section?.sectionName} type="section" placeholder="Select section" />
                    {stuList &&
                        <View style={{ borderTopWidth: 1, marginTop: 8, borderRadius: 5, borderColor: SWATheam.SwaGray, padding: 5, flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity style={{ padding: 6, backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, marginRight: 5 }} onPress={openPDf}>
                                    <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Print and Share</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, marginVertical: 5, borderRadius: 5, paddingTop: 0, }}>
                                <ScrollView>
                                    {
                                        studentData.status ?
                                            studentData?.data.map((item, index) => {
                                                return (
                                                    <View style={{ backgroundColor: SWATheam.SwaWhite, borderRadius: 5, marginTop: 5, paddingVertical: 5, borderWidth: .7, borderColor: userData.data.colors.hoverTheme }} key={index}>
                                                        <View style={{ flexDirection: 'row', padding: 5, marginHorizontal: 5, alignItems: 'center' }}>
                                                            <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: item.profilePath }} />

                                                            <Text style={{ marginLeft: 20, color: SWATheam.SwaBlack, padding: 2, fontSize: 15, fontWeight: '700' }}>
                                                                {item.fullName}
                                                            </Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                                                            <View style={{ width: 120 }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, padding: 2, fontSize: 14, fontWeight: '500' }}>
                                                                    Enrollment No.
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: 20, justifyContent: 'center' }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, padding: 2, fontSize: 14, fontWeight: '500' }}>
                                                                    :
                                                                </Text>
                                                            </View>
                                                            <View style={{ flex: 1 }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, padding: 2, fontSize: 13, backgroundColor: userData.data.colors.liteTheme }}>
                                                                    {item.registrationNo}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                                                            <View style={{ width: 120 }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, padding: 2, fontSize: 14, fontWeight: '500' }}>
                                                                    Date of Birth
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: 20, justifyContent: 'center' }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, padding: 2, fontSize: 14, fontWeight: '500' }}>
                                                                    :
                                                                </Text>
                                                            </View>
                                                            <View style={{ flex: 1 }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, padding: 2, fontSize: 13, backgroundColor: userData.data.colors.liteTheme }}>
                                                                    {item.dateOfBirth}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                                                            <View style={{ width: 120 }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, padding: 2, fontSize: 14, fontWeight: '500' }}>
                                                                    Contact No.
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: 20, justifyContent: 'center' }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, padding: 2, fontSize: 14, fontWeight: '500' }}>
                                                                    :
                                                                </Text>
                                                            </View>
                                                            <View style={{ flex: 1 }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, padding: 2, fontSize: 13, backgroundColor: userData.data.colors.liteTheme }}>
                                                                    {item.fatherContact}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                                                            <View style={{ width: 120 }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, padding: 2, fontSize: 14, fontWeight: '500' }}>
                                                                    Access Code
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: 20, justifyContent: 'center' }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, padding: 2, fontSize: 14, fontWeight: '500' }}>
                                                                    :
                                                                </Text>
                                                            </View>
                                                            <View style={{ flex: 1 }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, padding: 2, fontSize: 13, backgroundColor: userData.data.colors.liteTheme }}>
                                                                    {item.accessCode}
                                                                </Text>
                                                            </View>
                                                        </View>

                                                    </View>
                                                )
                                            }) : null

                                    }
                                </ScrollView>
                            </View>
                        </View>
                    }
                </View>
                {loading &&
                    <Loader />
                }
                {listItem.status ?
                    <BottomDrawerList closeModule={closeModule} listItem={listItem} getSelectedItem={getSelectedItem} selectedField={selectedField} /> : null
                }

                <MsgModal msgModalVisible={msgModalVisible} />
            </View>
        </SafeAreaProvider>

    )
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 20,
        marginBottom: 5,
        fontWeight: 'bold',
        color: SWATheam.SwaBlack,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    flexContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },

    BtextClr: {
        color: SWATheam.SwaBlack
    },

    thClr: {
        color: '#654b25'
    },



    WtextClr: {
        color: SWATheam.SwaWhite
    },

    selectFieldPopUp: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    }

});

export default StudentList

