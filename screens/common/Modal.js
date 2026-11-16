import React, { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
const Modal = ({ ModalData, closeModal, selectModalOption, selectOption, colorSwa }) => {
    // console.log(selectOption, 'selectOption')
    // console.log(JSON.stringify(ModalData), 'ModalData')

    return (
        <View style={styles.selectFieldPopUp}>
            <View style={{ backgroundColor: '#fff', marginHorizontal: 30, padding: 8, maxHeight: 300, borderRadius: 5 }}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', borderBottomWidth: .7, paddingBottom: 5, borderColor: 'grey' }} onPress={() => closeModal()}>
                    <AntDesign name={"close"} size={20} color={'#000'} />
                </TouchableOpacity>
                <ScrollView>
                    {
                        ModalData.status ?
                            ModalData.data.map((item, index) => {
                                let radioID1 = null
                                let radioID2 = null
                                let printTxt = ""
                                if (ModalData.type == 'class') {
                                    printTxt = item.getClassDetail.classDesc
                                    radioID1 = selectOption?.class?.classID
                                    radioID2 = item.classID
                                }
                                else if (ModalData.type == 'section') {
                                    printTxt = item.sectionName
                                    radioID1 = selectOption?.section?.sectionID
                                    radioID2 = item.sectionID
                                }
                                else if (ModalData.type == 'subject') {
                                    printTxt = item.subjectName
                                    radioID1 = selectOption?.subject?.subjectID
                                    radioID2 = item.subjectID
                                }
                                else if (ModalData.type == 'student') {
                                    printTxt = item.fullName
                                    radioID1 = selectOption?.student?.userRefID
                                    radioID2 = item.userRefID
                                }
                                else if (ModalData.type == 'awardType') {
                                    printTxt = item.awardName
                                    radioID1 = selectOption?.awardType?.awardValue
                                    radioID2 = item.awardValue
                                }
                                else if (ModalData.type == 'month') {
                                    printTxt = item
                                    radioID1 = selectOption?.month
                                    radioID2 = item
                                }
                                else if (ModalData.type == 'book') {
                                    printTxt = item.bookNameLang
                                    radioID1 = selectOption?.book?.bookID
                                    radioID2 = item.bookID
                                }
                                else if (ModalData.type == 'chapter') {
                                    if (selectOption.subject?.subjectName == 'Hindi') {
                                        printTxt = item.chapterNameLang2
                                    } else {
                                        printTxt = item.chapterName
                                    }
                                    radioID1 = selectOption?.chapter?.chapterID
                                    radioID2 = item.chapterID
                                }
                                else if (ModalData.type == 'diffLevel') {
                                    printTxt = item.eadCategory
                                    radioID1 = selectOption?.diffLevel?.eadID
                                    radioID2 = item.eadID
                                }
                                else if (ModalData.type == 'activityType') {
                                    printTxt = item.activityNameLang1
                                    radioID1 = selectOption?.activityType?.activityID
                                    radioID2 = item.activityID
                                }
                                else if (ModalData.type == 'typeOfTandF') {
                                    printTxt = item.desc
                                    radioID1 = selectOption?.typeOfTandF?.value
                                    radioID2 = item.value
                                }
                                else if (ModalData.type == 'queFor') {
                                    printTxt = item.desc
                                    radioID1 = selectOption?.queFor?.value
                                    radioID2 = item.value
                                }
                                else if (ModalData.type == 'marks') {
                                    printTxt = item
                                    radioID1 = selectOption?.marks
                                    radioID2 = item
                                }
                                else if (ModalData.type == 'assesName') {
                                    printTxt = item.assessmentName
                                    radioID1 = selectOption?.assessName?.assessmentID
                                    radioID2 = item.assessmentID
                                }
                                return (
                                    <View key={index}>
                                        <TouchableOpacity onPress={() => { selectModalOption(item, ModalData.type), closeModal() }}>
                                            <View style={{ padding: 10, borderBottomWidth: ModalData.data.length > 1 ? 1 : null, borderColor: 'grey', flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{ borderWidth: 2, borderColor: 'grey', width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                                    <View style={{ borderWidth: 2, borderColor: 'grey', width: 11, height: 11, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                                                        {
                                                            radioID1 == radioID2 ? <View style={{ backgroundColor: colorSwa, height: 11, width: 11, borderRadius: 50 }}></View> : null
                                                        }
                                                    </View>
                                                </View>
                                                <Text style={{ paddingLeft: 10, fontSize: 15, color: '#000' }}>
                                                    {printTxt}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }) :
                            null
                    }
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 20,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#000',
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    flexContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },

    BtextClr: {
        color: '#000'
    },

    thClr: {
        color: '#654b25'
    },

    colorSwa: {
        color: '#0c8781'
    },

    WtextClr: {
        color: '#fff'
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

export default Modal

