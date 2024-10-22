import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native'
import React, { useContext, useState } from 'react'
import SwaHeader from '../../../common/SwaHeader'
import CheckedHomeWork from './CheckedHomeWork'
import { GlobleData } from '../../../../Store'
import { SWATheam } from '../../../../constant/ConstentValue'
import ImageViewer from '../../../common/ImageViewer'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'



const HomeWorkReports = ({ navigation, route }) => {
    const { userData } = useContext(GlobleData)
    const [fileType, setFileType] = useState({ data: null, type: '', fileSrc: null, status: false })

    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }

    const viewFile = (item) => {
        const fType = item.checkedFile.split('.')
        const itemLowerCase = fType[fType.length - 1].toLowerCase()
        setFileType((prev) => {
            return { ...prev, data: item, type: itemLowerCase, fileSrc: item.checkedFile, status: true }
        })
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['left', 'right', 'top',]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: userData?.data?.colors?.mainTheme }}>
                <View style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : 24, backgroundColor: userData.data.colors.liteTheme }}>
                    <SwaHeader title={"Reports"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
                    <View style={{ flex: 1, padding: 10 }}>
                        <ScrollView>
                            {route.params.map((item, index) => {
                                const studentName = item.studentDetails.firstName + ' ' + (item.studentDetails.middleName == null ? "" : item.studentDetails.middleName) + ' ' + item.studentDetails.lastName
                                const fatherName = item.studentDetails.fatherName

                                const checkedDate = item.checkedDate
                                const subMissionDate = item.submissionDate
                                const checkedBy = item.teacherData.firstName + ' ' + (item.teacherData.middleName == null ? "" : item.teacherData.middleName) + " " + (item.teacherData.lastName == null ? "" : item.teacherData.lastName)


                                return (
                                    <View style={{ borderWidth: .7, borderColor: userData.data.colors.mainTheme, marginBottom: 10, borderRadius: 5, padding: 8, backgroundColor: SWATheam.SwaWhite }} key={item.hwSubmitID}>
                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                            <View style={{ width: 100, }}>
                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Name </Text>
                                            </View>
                                            <View style={{ paddingRight: 10 }}>
                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                            </View>
                                            <View style={{ flex: 1, }}>
                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{studentName}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                            <View style={{ width: 100, }}>
                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Father's Name </Text>
                                            </View>
                                            <View style={{ paddingRight: 10 }}>
                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                            </View>
                                            <View style={{ flex: 1, }}>
                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{fatherName}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                            <View style={{ width: 100, }}>
                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Checked Date</Text>
                                            </View>
                                            <View style={{ paddingRight: 10 }}>
                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                            </View>
                                            <View style={{ flex: 1, }}>
                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{checkedDate}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                            <View style={{ width: 100, }}>
                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Submission Date</Text>
                                            </View>
                                            <View style={{ paddingRight: 10 }}>
                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{subMissionDate}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                            <View style={{ width: 100, }}>
                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Checked by</Text>
                                            </View>
                                            <View style={{ paddingRight: 10 }}>
                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{checkedBy}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 5, marginRight: 5 }} onPress={() => viewFile(item)}>
                                                <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>Checked File</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>
                    {fileType.status &&
                        <ImageViewer fileType={fileType} setFileType={setFileType} />
                    }
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default HomeWorkReports

const styles = StyleSheet.create({})