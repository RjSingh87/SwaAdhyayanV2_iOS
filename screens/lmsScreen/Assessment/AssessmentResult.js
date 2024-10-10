import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
import Mcq from "./viewActivity/mcq"
import Tnf from "./viewActivity/tnf";
import Fillup from "./viewActivity/fillup";
import Match from "./viewActivity/match";
import Dnd from "./viewActivity/Dnd";
import Jumbo from "./viewActivity/Jumbo";
import Dd from "./viewActivity/dd";
import Desc from "./viewActivity/desc";

const AssessmentResult = ({ resultData, closeModal, colorSwa }) => {
    let assessmentName = ""
    let subjectName = ""
    if (resultData.data[0].assName.length >= 20) {
        assessmentName = resultData.data[0].assName.slice(0, 20) + '...'
    } else {
        assessmentName = resultData.data[0].assName
    }

    if (resultData.data[0].subjectName == 'Environmental Studies') {
        subjectName = 'EVS'
    } else {
        subjectName = resultData.data[0].subjectName
    }

    return (
        <View style={styles.selectFieldPopUp}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => closeModal()}>
                    <AntDesign name={'close'} size={25} color={'#000'} />
                </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 5, flex: 1 }}>
                <View style={{ flexDirection: 'row', marginBottom: 5, padding: 5, backgroundColor: colorSwa, justifyContent: 'center' }}>
                    <View style={{}}>
                        <Text style={{ color: '#fff', textAlign: 'center' }}>
                            Assessment Name:
                        </Text>
                    </View>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text style={{ color: '#fff', textAlign: 'center' }}>
                            {assessmentName}
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: .7, borderColor: 'grey', paddingBottom: 5, marginBottom: 7 }}>
                    <View style={{ width: 190 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 40 }}>
                                <Text style={{ color: '#000' }}>Class</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#000' }}>:</Text>
                            </View>
                            <View style={{ flex: 1, paddingLeft: 5 }}>
                                <Text style={{ color: '#000' }}>{resultData.data[0].className}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 40 }}>
                                <Text style={{ color: '#000' }}>Name</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#000' }}>:</Text>
                            </View>
                            <View style={{ flex: 1, paddingLeft: 5 }}>
                                <Text style={{ color: '#000' }}>{resultData.data[0].firstName}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 40 }}>
                                <Text style={{ color: '#000' }}>Date</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#000' }}>:</Text>
                            </View>
                            <View style={{ flex: 1, paddingLeft: 5 }}>
                                <Text style={{ color: '#000' }}>{resultData.data[0].attemptDate}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: 150 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 105 }}>
                                <Text style={{ color: '#000' }}>Subject</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#000' }}>:</Text>
                            </View>
                            <View style={{ flex: 1, paddingLeft: 5 }}>
                                <Text style={{ color: '#000' }}>{resultData.data[0].className}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 105 }}>
                                <Text style={{ color: '#000' }}>Total Marks</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#000' }}>:</Text>
                            </View>
                            <View style={{ flex: 1, paddingLeft: 5 }}>
                                <Text style={{ color: '#000' }}>{resultData.data[0].totalMarks}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 105 }}>
                                <Text style={{ color: '#000' }}>Marks Obtained</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#000' }}>:</Text>
                            </View>
                            <View style={{ flex: 1, paddingLeft: 5 }}>
                                <Text style={{ color: '#000' }}>{resultData.data[0].getMarks}</Text>
                            </View>
                        </View>

                    </View>
                </View>
                <ScrollView>
                    <View>
                        {
                            resultData.data?.map((item, index) => {
                                if (item.questionPart1 != null && item.questionPart1 != "") {
                                    const splitData = item.questionPart1.split('.')
                                    if (splitData.includes('jpg') || splitData.includes('png') || splitData.includes('jpeg')) {
                                        printTxt1 = <Image source={{ uri: item.questionPart2 }} style={{ height: 200, width: 200 }} />
                                    }
                                    else {
                                        printTxt1 = <Text style={{ color: '#000' }}>{item.questionPart1}</Text>
                                    }
                                }
                                if (item.questionPart2 != null && item.questionPart2 != "") {
                                    const splitData = item.questionPart2.split('.')
                                    if (splitData.includes('jpg') || splitData.includes('png') || splitData.includes('jpeg')) {
                                        printTxt2 = <Image source={{ uri: item.questionPart2 }} style={{ height: 200, width: 200 }} />
                                    }
                                    else {
                                        printTxt2 = <Text style={{ color: '#000' }}>{item.questionPart2}</Text>
                                    }
                                }
                                return (
                                    <View key={index}>
                                        {
                                            item.activityID == 1 ?
                                                <Mcq mcqData={item} index={index + 1} /> :
                                                item.activityID == 2 ?
                                                    <Tnf tnfData={item} index={index + 1} /> :
                                                    item.activityID == 3 ?
                                                        <Fillup fillupData={item} index={index + 1} /> :
                                                        item.activityID == 4 ?
                                                            < Match matchData={item} index={index + 1} /> :
                                                            item.activityID == 9 ?
                                                                <Dnd dndData={item} index={index + 1} /> :
                                                                item.activityID == 10 ?
                                                                    <Jumbo jumboData={item} index={index + 1} /> :
                                                                    item.activityID == 12 ?
                                                                        <Dd ddData={item} index={index + 1} /> :
                                                                        item.activityID == 15 ?
                                                                            <Desc descData={item} index={index + 1} /> :
                                                                            null

                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View >
        </View >

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
        bottom: 0,
        right: 0,
        // backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
    },

    TxtInput: {
        borderWidth: .7,
        borderColor: 'grey',
        marginBottom: 7,
        borderRadius: 5,
        paddingHorizontal: 7
    }

});

export default AssessmentResult