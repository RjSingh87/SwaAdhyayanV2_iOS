import { useContext, useState } from "react"
import React, { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, } from "react-native"
import { SWATheam } from "../../../constant/ConstentValue";
import { GlobleData } from "../../../Store";

const AcademicProfIntro = ({ intro, getAttemptedScreen }) => {
    const { userData } = useContext(GlobleData)

    let testHead = ''
    let totalQue = null
    let min = ''
    let hor = ''
    let testTime = null

    if (intro.selectedSubIcon.testID == 1) {
        testHead = intro.selectedSubIcon.testType + ' Test'
        // totalQue = intro.selectedSubIcon.totalQuestion
        if (userData.data.classID <= 2 || userData.data.classID == 15) {
            totalQue = 10
        } else {
            totalQue = 20
        }
        let time = intro.selectedSubIcon.testDuration.split(':')
        min = time[1]
        hor = time[0]
        if (hor == "00") {
            testTime = min + " minutes"
        } else {
            testTime = hor + " hrs " + min + " minutes"
        }

    } else if (intro.selectedSubIcon.testID == 2) {
        testHead = intro.selectedSubIcon.testType + ' Test'
        totalQue = 12
        let time = intro.selectedSubIcon.testDuration.split(':')
        min = time[1]
        hor = time[0]
        if (hor == "00") {
            testTime = min + " minutes"
        } else {
            testTime = hor + " hrs " + min + " minutes"
        }

    } else if (intro.selectedSubIcon.testID == 3) {
        testHead = intro.selectedSubIcon.testType + ' Test'
        totalQue = 24
        let time = intro.selectedSubIcon.testDuration.split(':')
        min = time[1]
        hor = time[0]
        if (hor == "00") {
            testTime = min + " minutes"
        } else {
            testTime = hor + " hrs " + min + " minutes"
        }

    } else if (intro.selectedSubIcon.testID == 4) {
        testHead = intro.selectedSubIcon.testType + ' Test'
        totalQue = 25
        let time = intro.selectedSubIcon.testDuration.split(':')
        min = time[1]
        hor = time[0]
        if (hor == "00") {
            testTime = min + " minutes"
        } else {
            testTime = hor + " hrs " + min + " minutes"
        }

    } else if (intro.selectedSubIcon.testID == 5) {
        testHead = intro.selectedSubIcon.testType + ' Test'
        totalQue = 10
        let time = intro.selectedSubIcon.testDuration.split(':')
        min = time[1]
        hor = time[0]
        if (hor == "00") {
            testTime = min + " minutes"
        } else {
            testTime = hor + " hrs " + min + " minutes"
        }

    }




    return (
        <View style={{ flex: 1, padding: 8, backgroundColor: userData.data.colors.liteTheme }}>
            <View style={{ backgroundColor: userData.data.colors.mainTheme, justifyContent: 'center', padding: 10, marginTop: 10 }}>
                <Text style={styles.headerText}>{testHead}</Text>
            </View>

            <ScrollView style={{ flex: 1, backgroundColor: SWATheam.SwaWhite, padding: 8 }}>
                {intro.selectedSubIcon.testID == 1 ?
                    <View style={{ padding: 5 }}>
                        <View style={styles.flexContainer}>
                            <View style={{ flex: 1 }}><Text style={styles.textClr}>This test is designed to test the learner's academic proficiency - </Text></View>
                        </View>
                        <View style={{ paddingLeft: 15 }}>
                            <View style={styles.flexContainer}>
                                <View style={{ width: 25 }}><Text style={styles.textClr}>1.</Text></View>
                                <View style={{ flex: 1 }}><Text style={styles.textClr}>The Proficiency Profiling test has <Text style={[styles.textClr, { fontWeight: 'bold' }]}>{totalQue} questions.</Text> The maximum time allotted for the entire test is <Text style={[styles.textClr, { fontWeight: 'bold' }]}>{testTime}.</Text> The learner is required to attempt and submit all the questions within the given time frame.</Text></View>
                            </View>
                            <View style={styles.flexContainer}>
                                <View style={{ width: 25 }}><Text style={styles.textClr}>2.</Text></View>
                                <View style={{ flex: 1 }}><Text style={styles.textClr}>After the test is completed, a report is generated which displays the learner's test scores, using which he/she can judge his/her academic abilities.They would also be shown the answers to the wrong questions attempted, if any.</Text></View>
                            </View>
                            <View style={styles.flexContainer}>
                                <View style={{ width: 25 }}><Text style={styles.textClr}>3.</Text></View>
                                <View style={{ flex: 1 }}><Text style={styles.textClr}>The learner can view, print and save this report.</Text></View>
                            </View>
                            <View style={styles.flexContainer}>
                                <View style={{ width: 25 }}><Text style={styles.textClr}>4.</Text></View>
                                <View style={{ flex: 1 }}><Text style={styles.textClr}>It is important that these questions are attempted by the learner himself/herself, without any sort of influence from teachers/parents with respect to the answers, so that the academic proficiency of the learner can be tested accurately. The learner can however, be assisted if he/she has problem in understanding the meaning of words/questions.</Text></View>
                            </View>
                        </View>
                        <View style={styles.flexContainer}>
                            <View style={{ flex: 1 }}><Text style={styles.textClr}>The data and results represented by the report generated for this test are purely conditional. It may change according to the skills and/or intelligence acquired by the learner in his/her lifetime.</Text></View>
                        </View>
                    </View> : intro.selectedSubIcon.testID == 2 ?
                        <View style={{ padding: 5 }}>
                            <View style={styles.flexContainer}>
                                <View style={{ width: 25 }}><Text style={styles.textClr}>1.</Text></View>
                                <View style={{ flex: 1 }}><Text style={styles.textClr}>The Learning Style test is designed to know the learner's preferred and most effective learning style.</Text></View>
                            </View>
                            <View style={styles.flexContainer}>
                                <View style={{ width: 25 }}><Text style={styles.textClr}>2.</Text></View>
                                <View style={{ flex: 1 }}><Text style={styles.textClr}>This test has<Text style={[styles.textClr, { fontWeight: 'bold' }]}>{totalQue} questions.</Text><Text style={styles.textClr}>The maximum time allotted for the entire test is</Text> <Text style={[styles.textClr, { fontWeight: 'bold' }]}>{testTime}.</Text><Text style={styles.textClr}>The learner is required to attempt and submit all the questions within the given time frame.</Text></Text></View>
                            </View>
                            <View style={styles.flexContainer}>
                                <View style={{ width: 25 }}><Text style={styles.textClr}>3.</Text></View>
                                <View style={{ flex: 1 }}><Text style={styles.textClr}>After the completion of the test, a report is generated which displays the learner's preferred learning style <Text style={{ color: userData.data.colors.mainTheme }}> i.e Visual, Auditory or Kinesthetic</Text>, using which he/she can perform better academically.</Text></View>
                            </View>
                            <View style={styles.flexContainer}>
                                <View style={{ width: 25 }}><Text style={styles.textClr}>4.</Text></View>
                                <View style={{ flex: 1 }}><Text style={styles.textClr}>The learner can view, print and save this report.</Text></View>
                            </View>
                            <View style={styles.flexContainer}>
                                <View style={{ width: 25 }}><Text style={styles.textClr}>5.</Text></View>
                                <View style={{ flex: 1 }}><Text style={styles.textClr}>It is important that these questions are attempted by the learner himself/herself, without any sort of influence from teachers/parents with respect to the answers, so that the Learning Style can be examined accurately. The learner can however, be assisted if he/she has any problem in understanding the meaning of words/questions.</Text></View>
                            </View>
                            <View style={[styles.textClr, { paddingHorizontal: 5, marginBottom: 10 }]}>
                                <Text style={styles.textClr}>The data and results represented by the report generated for this test are purely conditional. It may change according to the skills and/or intelligence acquired by the learner in his/her lifetime.</Text>
                            </View>
                        </View> : intro.selectedSubIcon.testID == 3 ?
                            <View style={{ padding: 5 }}>
                                <View style={styles.flexContainer}>
                                    <View style={{ flex: 1 }}><Text style={styles.textClr}>The theory of multiple intelligences was developed in 1983 by Dr. Howard Gardner, professor of education at Harvard University.</Text></View>
                                </View>
                                <View style={{ borderWidth: 1, borderColor: '#0c8781', marginBottom: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: 100 }}><Text style={[styles.thClr, { fontWeight: '500', textAlign: 'center', borderRightWidth: 1, borderColor: '#0c8781', paddingHorizontal: 5, paddingVertical: 5 }]}>Type of Skill</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.thClr, { fontWeight: '500', textAlign: 'center', paddingHorizontal: 5, paddingVertical: 5 }]}>
                                                Nature
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#0c8781' }}>
                                        <View style={{ width: 100, borderRightWidth: 1, borderColor: '#0c8781' }}><Text style={[styles.textClr, { textAlign: 'center', paddingHorizontal: 5, paddingVertical: 5 }]}>Interpersonal</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.textClr, { paddingHorizontal: 5, paddingVertical: 5 }]}>
                                                Capacity to detect and respond appropriately to the moods, motivations and desires of others
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#0c8781' }}>
                                        <View style={{ width: 100, borderRightWidth: 1, borderColor: '#0c8781' }}><Text style={[styles.textClr, { textAlign: 'center', paddingHorizontal: 5, paddingVertical: 5 }]}>Intrapersonal</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.textClr, { paddingHorizontal: 5, paddingVertical: 5 }]}>
                                                Capacity to be self-aware and in tune with inner feelings, values, beliefs and thinking processes
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#0c8781' }}>
                                        <View style={{ width: 100, borderRightWidth: 1, borderColor: '#0c8781' }}><Text style={[styles.textClr, { textAlign: 'center', paddingHorizontal: 5, paddingVertical: 5 }]}>Logical</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.textClr, { paddingHorizontal: 5, paddingVertical: 5 }]}>
                                                Ability to think conceptually and abstractly, and capacity to discern logical and numerical patterns
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#0c8781' }}>
                                        <View style={{ width: 100, borderRightWidth: 1, borderColor: '#0c8781' }}><Text style={[styles.textClr, { textAlign: 'center', paddingHorizontal: 5, paddingVertical: 5 }]}>Visual</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.textClr, { paddingHorizontal: 5, paddingVertical: 5 }]}>
                                                Capacity to think in images and pictures, to visualise accurately and abstractly
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#0c8781' }}>
                                        <View style={{ width: 100, borderRightWidth: 1, borderColor: '#0c8781' }}><Text style={[styles.textClr, { textAlign: 'center', paddingHorizontal: 5, paddingVertical: 5 }]}>Musical</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.textClr, { paddingHorizontal: 5, paddingVertical: 5 }]}>
                                                Ability to produce and appreciate rhythm, pitch and timber
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#0c8781' }}>
                                        <View style={{ width: 100, borderRightWidth: 1, borderColor: '#0c8781' }}><Text style={[styles.textClr, { textAlign: 'center', paddingHorizontal: 5, paddingVertical: 5 }]}>Linguistic</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.textClr, { paddingHorizontal: 5, paddingVertical: 5 }]}>
                                                Well-developed verbal skills and sensitivity to the sounds, meanings and rhythms of words
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#0c8781' }}>
                                        <View style={{ width: 100, borderRightWidth: 1, borderColor: '#0c8781' }}><Text style={[styles.textClr, { textAlign: 'center', paddingHorizontal: 5, paddingVertical: 5 }]}>Naturalist</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.textClr, { paddingHorizontal: 5, paddingVertical: 5 }]}>
                                                Ability to recognise and categorise plants, animals and other objects in nature
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#0c8781' }}>
                                        <View style={{ width: 100, borderRightWidth: 1, borderColor: '#0c8781' }}><Text style={[styles.textClr, { textAlign: 'center', paddingHorizontal: 5, paddingVertical: 5 }]}>Kinesthetic</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.textClr, { paddingHorizontal: 5, paddingVertical: 5 }]}>
                                                Ability to control one's body movements and to handle objects skillfully
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.flexContainer}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.textClr}>
                                            This test is designed to test the learner's primary or dominant intelligences out of the eight kinds, namely:
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ paddingLeft: 15 }}>
                                    <View style={styles.flexContainer}>
                                        <View style={{ width: 25 }}><Text style={styles.textClr}>1.</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.textClr}>
                                                The Multiple Intelligences test has <Text style={[styles.textClr, { fontWeight: 'bold' }]}>{totalQue} questions.</Text> The maximum time allotted for the entire test is  <Text style={[styles.textClr, { fontWeight: 'bold' }]}>{testTime}.</Text> The student is required to attempt and submit all the questions within the given time frame.
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.flexContainer}>
                                        <View style={{ width: 25 }}><Text style={styles.textClr}>2.</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.textClr}>
                                                After the test is completed, a report is generated which displays the various intelligences and the aptitude that the student shows in each of them.
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.flexContainer}>
                                        <View style={{ width: 25 }}><Text style={styles.textClr}>3.</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.textClr}>
                                                The student can view, print and save this report
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.flexContainer}>
                                        <View style={{ width: 25 }}><Text style={styles.textClr}>4.</Text></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.textClr}>
                                                It is important that these questions are attempted by the student himself/herself, without any sort of influence from teachers/parents with respect to the answers, so that the Multiple Intelligences can be tested accurately. The student can however, be assisted if he/she has problem in understanding the meaning of words/questions.
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.flexContainer}>
                                        <View style={{ width: 25 }}><Text style={styles.textClr}>5.</Text></View>
                                        <View style={{ flex: 1 }}><Text style={styles.textClr}>It is important that these questions are attempted by the learner himself/herself, without any sort of influence from teachers/parents with respect to the answers, so that the academic proficiency of the learner can be tested accurately. The learner can however, be assisted if he/she has problem in understanding the meaning of words/questions.</Text></View>
                                    </View>
                                </View>
                                <View style={styles.flexContainer}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.textClr}>
                                            The data and results represented by the report generated for this test are purely conditional. It may change according to the skills and/or intelligence acquired by the student in his/her lifetime.
                                        </Text>
                                    </View>
                                </View>
                            </View> : intro.selectedSubIcon.testID == 4 ?
                                <View style={{ padding: 5 }}>
                                    <View style={styles.flexContainer}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.textClr}> This test is designed to test the learner's overall personality type and the dominant personality traits he/she possesses, out of the following-
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={[styles.BtextClr, { fontWeight: '500' }]}>Experimental, Inquisitive and Imaginative; Orderly and Disciplined; Friendly, Energetic and Extroverted; Compassionate, Kind and Sympathetic; Even-tempered and Composed.</Text>
                                    </View>
                                    <View style={{ paddingLeft: 15 }}>
                                        <View style={styles.flexContainer}>
                                            <View style={{ width: 25 }}><Text style={styles.BtextClr}>1.</Text></View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.BtextClr}>
                                                    The Knowing Me test has <Text style={[styles.BtextClr, { fontWeight: 'bold' }]}>{totalQue} questions.</Text> The maximum time allotted for the entire test is <Text style={[styles.BtextClr, { fontWeight: 'bold' }]}>{testTime}.</Text> The student is required to attempt and submit all the questions within the given time frame.
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.flexContainer}>
                                            <View style={{ width: 25 }}><Text style={styles.BtextClr}>2.</Text></View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.BtextClr}>
                                                    After the test is completed, a report is generated which displays the various personality traits and the degree that the learner shows in each of them.
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.flexContainer}>
                                            <View style={{ width: 25 }}><Text style={styles.BtextClr}>3.</Text></View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.BtextClr}>
                                                    The student can view, print and save this report.
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.flexContainer}>
                                            <View style={{ width: 25 }}><Text style={styles.BtextClr}>4.</Text></View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.BtextClr}>
                                                    It is important that these questions are attempted by the student himself/herself, without any sort of influence from teachers/parents with respect to the answers, so that the learner's personality can be tested accurately. The student can however, be assisted if he/she has problem in understanding the meaning of words/questions.
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.flexContainer}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.BtextClr}>
                                                The data and results represented by the report generated for this test are purely conditional. It may change according to the skills and/or intelligence acquired by the learner in his/her lifetime.
                                            </Text>
                                        </View>
                                    </View>
                                </View> : intro.selectedSubIcon.testID == 5 ?
                                    <View style={{ padding: 5 }}>
                                        <View style={styles.flexContainer}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.BtextClr}> This test is designed to test the learner's dominant half of the brain- the left or the right.
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ paddingLeft: 15 }}>
                                            <View style={styles.flexContainer}>
                                                <View style={{ width: 25 }}><Text style={styles.BtextClr}>1.</Text></View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.BtextClr}>
                                                        The Brain Dominance test has <Text style={[styles.BtextClr, { fontWeight: 'bold' }]}>{totalQue} questions.</Text> The maximum time allotted for the entire test is <Text style={[styles.BtextClr, { fontWeight: 'bold' }]}>{testTime}.</Text> The student is required to attempt and submit all the questions within the given time frame.
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.flexContainer}>
                                                <View style={{ width: 25 }}><Text style={styles.BtextClr}>2.</Text></View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.BtextClr}>
                                                        After the test is completed, a report is generated which displays the percentage of left-brain
                                                        <Text style={{ color: 'red' }}> (the left-side of the brain is considered to be adept at tasks that involves logic, language, and analytical thinking)</Text> and right-brain <Text style={{ color: 'red' }}>(the right side of the brain is best at expressive and creative tasks) </Text>
                                                        dominance in the learner.
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.flexContainer}>
                                                <View style={{ width: 25 }}><Text style={styles.BtextClr}>3.</Text></View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.BtextClr}>
                                                        The student can view, print and save this report
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.flexContainer}>
                                                <View style={{ width: 25 }}><Text style={styles.BtextClr}>3.</Text></View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.BtextClr}>
                                                        It is important that these questions are attempted by the student himself/herself, without any sort of influence from teachers/parents with respect to the answers, so that brain dominance can be tested accurately. The student can however, be assisted if he/she has problem in understanding the meaning of words/questions.
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.flexContainer}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.BtextClr}>
                                                    The data and results represented by the report generated for this test are purely conditional. It may change according to the skills and/or intelligence acquired by the learner in his/her lifetime.
                                                </Text>
                                            </View>
                                        </View>
                                    </View> : null
                }
            </ScrollView>
            <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ borderRadius: 4, marginTop: 10, padding: 10, backgroundColor: userData.data.colors.mainTheme, justifyContent: 'center', width: 170 }} onPress={() => { getAttemptedScreen(intro.selectedSubIcon.testID, intro.selectedSubIcon.testType) }}>
                    <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>START TEST</Text>
                </TouchableOpacity>
            </View>
        </View>


    )
}
export default AcademicProfIntro

const styles = StyleSheet.create({
    headerText: {
        fontSize: 16,
        fontWeight: '500',
        color: SWATheam.SwaWhite,
        textTransform: 'uppercase',
        textAlign: 'center'
    },

    flexContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },

    textClr: {
        color: SWATheam.SwaBlack
    },

    BtextClr: {
        color: SWATheam.SwaBlack
    },

});



