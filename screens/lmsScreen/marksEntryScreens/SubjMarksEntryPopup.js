import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Modal from "react-native-modal";
import React, { useContext } from 'react'
import { SwaTheam } from '../../../constant/ConstentValue'
import { GlobleData } from '../../../Store'
import CustomInput from '../../common/CustomInput'


const SubjMarksEntryPopup = ({ closeModule, schoolSubjMarks }) => {
    const { userData } = useContext(GlobleData)
    return (
        <Modal
            isVisible={schoolSubjMarks.status}
            animationInTiming={5000}
            animationOutTiming={5000}
            style={{ width: '100%', margin: 0 }}>
            <View style={styles.garyContainer}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => closeModule()}
                />
                <View style={styles.listBox}>
                    <View style={{ flexDirection: 'row', paddingVertical: 4, borderTopWidth: 1, borderColor: userData.data.colors.hoverTheme }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={{ color: SwaTheam.SwaBlack }}>Priodic Test</Text>
                        </View>
                        <View style={{ width: 80, height: 40, justifyContent: 'center' }}>
                            <CustomInput styleFrom={"GradeEntry"} keyboardType={"numeric"} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={{ color: SwaTheam.SwaBlack }}>Note Book</Text>
                        </View>
                        <View style={{ width: 80, height: 40, justifyContent: 'center' }}>
                            <CustomInput styleFrom={"GradeEntry"} keyboardType={"numeric"} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={{ color: SwaTheam.SwaBlack }}>SEA</Text>
                        </View>
                        <View style={{ width: 80, height: 40, justifyContent: 'center' }}>
                            <CustomInput styleFrom={"GradeEntry"} keyboardType={"numeric"} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={{ color: SwaTheam.SwaBlack }}>Half Yearly Marks</Text>
                        </View>
                        <View style={{ width: 80, height: 40, justifyContent: 'center' }}>
                            <CustomInput styleFrom={"GradeEntry"} keyboardType={"numeric"} maxLength={2} />
                        </View>
                    </View>
                    <View style={{ width: 80, padding: 10, borderRadius: 6, backgroundColor: userData.data.colors.mainTheme, alignSelf: 'flex-end', marginTop: 10 }}>
                        <Text style={{ color: SwaTheam.SwaWhite, textAlign: 'center', textTransform: 'uppercase' }}>Save</Text>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export default SubjMarksEntryPopup

const styles = StyleSheet.create({
    garyContainer: {
        flex: 1,
        // backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundColor:'red'
    },
    listBox: {
        backgroundColor: SwaTheam.SwaWhite,
        maxHeight: '60%',
        minHeight: 50,
        width: "100%",
        alignSelf: 'center',
        paddingTop: 10,
        paddingHorizontal: 10,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
})