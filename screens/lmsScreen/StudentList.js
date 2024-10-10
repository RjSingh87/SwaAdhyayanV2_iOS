import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from "react-native"
import Entypo from 'react-native-vector-icons/Entypo'
import { useState, useContext } from "react"
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
import SwaHeader from "../common/SwaHeader";
import { GlobleData } from "../../Store";
import Services from "../../Services";
import { SWATheam, apiRoot } from "../../constant/ConstentValue";
import Loader from "../common/Loader";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const font15 = 15

const StudentList = ({ navigation, route }) => {
    const { userData } = useContext(GlobleData)
    const [selectClassText, setSelectClassText] = useState('Select Class')
    const [selectSectionText, setSelectSectionText] = useState('Select Section')
    const [selectClass, setSelectClass] = useState({ data: null, radioID: null })
    const [selectSection, setSelectSection] = useState({ data: null, radioID: null })
    const [classData, setClassData] = useState({ data: null, type: null, status: false })
    const [studentData, setStudentData] = useState({ data: null, status: false })
    const [showPopUp, setShowPopUp] = useState(false)
    const [stuList, setStuList] = useState(false)
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false)


    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }


    function getClassList() {
        setLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "userTypeID": userData.data.userTypeID,
            "userRefID": userData.data.userRefID,
            "academicYear": userData.data.academicYear
        }
        Services.post(apiRoot.getClassList, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    setShowPopUp(true)
                    const data = res.data
                    setClassData((prev) => {
                        return { ...prev, data: data, type: 'class', status: true }
                    })
                } else if (res.status == "error") {
                    alert(res.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function getSectionList() {
        if (selectClassText != 'Select Class') {
            setLoading(true)
            const payload = {
                "schoolCode": userData.data.schoolCode,
                "academicYear": userData.data.academicYear,
                "classID": selectClass.data?.classID,
                "userTypeID": userData.data.userTypeID,
                "userRefID": userData.data.userRefID
            }
            Services.post(apiRoot.getSectionList, payload)
                .then((res) => {
                    if (res.status == "success") {
                        setLoading(false)
                        setShowPopUp(true)
                        const data = res.data
                        setClassData((prev) => {
                            return { ...prev, data: data, type: 'section', status: true }
                        })
                    } else if (res.status == "error") {
                        alert(res.message)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            alert("Please Select Class First")
        }
    }

    function selectClassOpt(ID, item) {
        setSelectSection((prev) => {
            return { ...prev, data: null, radioID: null }
        })
        setSelectClass((prev) => {
            return { ...prev, data: item, radioID: ID }
        })
        setSelectClassText(item.getClassDetail.classDesc)
        setSelectSectionText('Select Section')
    }

    function selectSectionOpt(ID, item) {
        setSelectSection((prev) => {
            return { ...prev, data: item, radioID: ID }
        })
        setSelectSectionText(item.sectionName)
    }

    function getStudentDataList() {
        if (selectClassText != 'Select Class' && selectSectionText != 'Select Section') {
            setLoading(true)
            const payload = {
                "schoolCode": userData.data.schoolCode,
                "classID": selectClass.data?.classID,
                "sectionID": selectSection.data?.sectionID,
                "academicYear": userData.data.academicYear,
                "transYear": userData.data.transYear
            }
            Services.post(apiRoot.getStudentsData, payload)
                .then((res) => {
                    if (res.status == "success") {
                        setLoading(true)
                        const data = res.data
                        setStudentData((prev) => {
                            return { ...prev, data: data, status: true }
                        })
                        setStuList(true)
                    } else if (res.status == "error") {
                        alert(res.message)
                    }

                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            alert('Please Select Field')
        }
    }

    const generatePDF = async () => {
        setLoading(true)
        try {
            const html = `<html>
                        <head>
                        <style>
                            body {
                                font-family: 'Helvetica';
                                font-size: 12px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            th, td {
                                border: 1px solid #000;
                                padding: 5px;
                            }
                            th {
                                background-color: #ccc;
                            }
                            h1{
                                text-align: center;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Student List</h1>
                        <table>
                            <tr>
                                <th>S.No</th>
                                <th>Photo</th>
                                <th>Enrollment No.</th>
                                <th>Student Name</th>
                                <th>Date of Birth</th>
                                <th>Contact No.</th>
                                <th>Access Code</th>
                            </tr>
                            ${studentData.data
                    .map(
                        (item, index) => `
                        <tr>
                        <td>${index + 1}</td>
                        <td>photo</td>
                        <td>${item.registrationNo}</td>
                        <td>${item.fullName}</td>
                        <td>${item.dateOfBirth}</td>
                        <td>${item.fatherContact}</td>
                        <td>${item.accessCode}</td>
                        </tr>
                    `,
                    )
                    .join('')}                                                          
                                </table>
                            </body>
                        </html>`;

            const options = {
                html,
                fileName: `student_List_${count}`,
                directory: 'pdf',
            };
            const file = await RNHTMLtoPDF.convert(options);
            setLoading(false)
            alert(`Downloaded PDF saved to ${file.filePath}`);
            setCount(count + 1);
        } catch (err) {
            console.log(err);
        }
    };

    const insets = useSafeAreaInsets()

    return (
        <SafeAreaView edges={['left', 'top', 'right']} style={{ backgroundColor: userData?.data?.colors?.mainTheme, flex: 1, marginTop: Platform.OS == "ios" ? 0 : 20 }}>
            <SwaHeader title={'Student List'} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
            <View style={{ padding: 10, flex: 1, backgroundColor: SWATheam.SwaWhite, paddingBottom: insets.bottom, }}>
                <View>
                    <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50, paddingVertical: 2 }} onPress={() => getClassList()}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: SWATheam.SwaBlack }}>{selectClassText}</Text>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                            <Entypo name={"chevron-thin-down"} color={SWATheam.SwaGray} size={20} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 8 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50, paddingVertical: 2 }} onPress={() => getSectionList()}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: SWATheam.SwaBlack }}>{selectSectionText}</Text>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                            <Entypo name={"chevron-thin-down"} size={20} color={SWATheam.SwaGray} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, width: 90, height: 35, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }} onPress={() => { getStudentDataList() }}>
                        <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Search</Text>
                    </TouchableOpacity>
                </View>

                {stuList &&
                    <View style={{ borderTopWidth: 1, marginTop: 8, borderRadius: 5, borderColor: SWATheam.SwaGray, padding: 5, flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ padding: 6, backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, marginRight: 5 }} onPress={() => generatePDF()}>
                                <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Download PDF</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={{ width: 70, paddingVertical: 4, backgroundColor: colorSwa, borderRadius: 5 }} onPress={() => generateExcel}>
                                <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Excel</Text>
                            </TouchableOpacity> */}
                        </View>
                        <View style={{ borderWidth: 1, borderColor: SWATheam.SwaGray, flex: 1, marginVertical: 5, borderRadius: 5, padding: 5, paddingTop: 0, backgroundColor: userData.data.colors.mainTheme }}>
                            <ScrollView>
                                {
                                    studentData.status ?
                                        studentData?.data.map((item, index) => {
                                            return (
                                                <View style={{ backgroundColor: SWATheam.SwaWhite, borderRadius: 5, marginTop: 5, paddingVertical: 5 }} key={index}>
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

            {showPopUp &&
                <View style={styles.selectFieldPopUp}>
                    <View style={{ backgroundColor: SWATheam.SwaWhite, marginHorizontal: 30, padding: 8, height: 300, borderRadius: 5 }}>
                        <TouchableOpacity style={{ position: 'absolute', top: -12, right: -12 }} onPress={() => setShowPopUp(!showPopUp)}>
                            <Entypo name={"circle-with-cross"} size={30} color={'#343a40'} />
                        </TouchableOpacity>
                        <ScrollView>
                            {
                                classData.status && classData.type == 'class' ?
                                    classData.data.map((item, index) => {
                                        const ID = item.classID
                                        return (
                                            <View key={index}>
                                                <TouchableOpacity onPress={() => { selectClassOpt(ID, item), setShowPopUp(!showPopUp) }}>
                                                    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: SWATheam.SwaGray, flexDirection: 'row', alignItems: 'center' }}>
                                                        <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                                            <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: SWATheam.SwaGray, justifyContent: 'center', alignItems: 'center' }} value="first">
                                                                {
                                                                    selectClass.radioID === ID ? <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 / 2 }}></View> : null
                                                                }
                                                            </View>
                                                        </View>
                                                        <Text style={{ paddingLeft: 10, fontSize: font15, color: SWATheam.SwaBlack }}>
                                                            {userData.data.userTypeID == 4 ? item.getClassDetail.classDesc : item.ClassDesc}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }) :
                                    classData.type == 'section' ?
                                        classData?.data.map((item, index) => {
                                            const ID = item.sectionID
                                            return (
                                                <View key={index}>
                                                    <TouchableOpacity onPress={() => { selectSectionOpt(ID, item), setShowPopUp(!showPopUp) }}>
                                                        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: SWATheam.SwaGray, flexDirection: 'row', alignItems: 'center' }}>
                                                            <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                                                <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: SWATheam.SwaGray, justifyContent: 'center', alignItems: 'center' }} value="first">
                                                                    {
                                                                        selectSection.radioID === ID ? <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 / 2 }}></View> : null
                                                                    }
                                                                </View>
                                                            </View>
                                                            <Text style={{ paddingLeft: 10, fontSize: font15, color: SWATheam.SwaBlack }}>
                                                                {item.sectionName}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                        : null
                            }
                        </ScrollView>
                    </View>
                </View>
            }
        </SafeAreaView>

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

