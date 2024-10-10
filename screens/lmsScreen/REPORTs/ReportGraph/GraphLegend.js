import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SWATheam } from '../../../../constant/ConstentValue'
import { GlobleData } from '../../../../Store'

const GraphLegend = ({ testType, reportData, type, reportSubIconID, reportChildIconSequence }) => {


    const { userData } = useContext(GlobleData)
    let knowingMeColor = ['#2685cb', '#4ad95a', '#fec81b', '#fd8d14', '#ce00e6',]

    return (
        <View style={{ width: '100%' }}>
            <>
                {((reportSubIconID == 60 && testType == 1) || (reportSubIconID == 60 && type == "consolidateAPP")) || (reportSubIconID == 62 && (testType == 1 || testType == 2 || testType == 3)) || type == "studentConslAcmid" || reportSubIconID == 64 && (testType == 1 || testType == 2) ?
                    <View style={{ width: '90%', alignSelf: 'center', borderRadius: 6, backgroundColor: SWATheam.SwaWhite, marginVertical: 20, elevation: 9, }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                            <View style={{ padding: 2, flex: 1, }}>
                                <Text style={{ color: SWATheam.SwaBlack }}>Beginner</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                <View style={{}}>
                                    <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>1-40%</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#e93c12' }}></View>
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                            <View style={{ padding: 2, flex: 1, }}>
                                <Text style={{ color: SWATheam.SwaBlack }}>Average</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                <View style={{}}>
                                    <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>41-60%</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#009aff' }}></View>
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                            <View style={{ padding: 2, flex: 1, }}>
                                <Text style={{ color: SWATheam.SwaBlack }}>Advance</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                <View style={{}}>
                                    <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>61-80%</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#911a5c' }}></View>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, }}>
                            <View style={{ padding: 2, flex: 1, }}>
                                <Text style={{ color: SWATheam.SwaBlack }}>Proficient</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                <View style={{}}>
                                    <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>81-100%</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#2e630b' }}></View>
                                </View>
                            </View>
                        </View>
                    </View> : reportSubIconID == 60 && (testType == 4 || type == "consolidateKM") || type == "studentConslknowingMe" ?
                        <>
                            <View style={{ width: '90%', alignSelf: 'center', borderRadius: 6, backgroundColor: SWATheam.SwaWhite, marginVertical: 10, elevation: 9, }}>
                                {reportData.legendList.map((item, index) => {
                                    return (
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 6, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }} key={index}>
                                            <View style={{ padding: 2, flex: 1, }}>
                                                <Text style={{ color: SWATheam.SwaBlack }}>{item}</Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: knowingMeColor[index] }}></View>
                                            </View>
                                        </View>

                                    )
                                })}
                            </View>

                        </> : reportSubIconID == 62 && (testType == 5 || testType == 7) ?
                            <View style={{ width: '90%', alignSelf: 'center', borderRadius: 6, backgroundColor: SWATheam.SwaWhite, marginVertical: 20, elevation: 9, }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                    <View style={{ padding: 2, flex: 1, }}>
                                        <Text style={{ color: SWATheam.SwaBlack }}>Max Percentage:</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                        <View style={{}}>
                                            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{reportData.data.maxMarks.percentage}%</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#7fccff' }}></View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                    <View style={{ padding: 2, flex: 1, }}>
                                        <Text style={{ color: SWATheam.SwaBlack }}>Min Percentage:</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                        <View style={{}}>
                                            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{reportData.data.minMarks.percentage}%</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#f49d88' }}></View>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                    <View style={{ padding: 2, flex: 1, }}>
                                        <Text style={{ color: SWATheam.SwaBlack }}>My Percentage:</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                        <View style={{}}>
                                            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{reportSubIconID == 62 && testType == 7 ? reportData.data.userMarks : reportData.data.userMarks.percentage}%</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#c88cad' }}></View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            : reportSubIconID == 62 && testType == 6 ?
                                <View style={{ width: '90%', alignSelf: 'center', borderRadius: 6, backgroundColor: SWATheam.SwaWhite, marginVertical: 20, elevation: 9, }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                        <View style={{ padding: 2, flex: 1, }}>
                                            <Text style={{ color: SWATheam.SwaBlack }}>Section Max:</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                            <View style={{}}>
                                                <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{reportData.data.thisSection.maxMarks}%</Text>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#c88cad' }}></View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                        <View style={{ padding: 2, flex: 1, }}>
                                            <Text style={{ color: SWATheam.SwaBlack }}>Section Min:</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                            <View style={{}}>
                                                <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{reportData.data.thisSection.minMarks}%</Text>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#7fccff' }}></View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                        <View style={{ padding: 2, flex: 1, }}>
                                            <Text style={{ color: SWATheam.SwaBlack }}>My Percentage:</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                            <View style={{}}>
                                                <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{reportData.data.userMarks.percentage}%</Text>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#f49d88' }}></View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                        <View style={{ padding: 2, flex: 1, }}>
                                            <Text style={{ color: SWATheam.SwaBlack }}>Class Max:</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                            <View style={{}}>
                                                <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{reportData.data.allSection.maxMarks}%</Text>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#94b180' }}></View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                        <View style={{ padding: 2, flex: 1, }}>
                                            <Text style={{ color: SWATheam.SwaBlack }}>Class Min:</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, }}>
                                            <View style={{}}>
                                                <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{reportData.data.allSection.minMarks}%</Text>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#f1cd87' }}></View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                : reportSubIconID == 63 && testType == 1 ?
                                    <View style={{ width: '90%', alignSelf: 'center', borderRadius: 6, backgroundColor: SWATheam.SwaWhite, marginVertical: 20, elevation: 9, }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                            <View style={{ padding: 2, flex: 1, }}>
                                                <Text style={{ color: SWATheam.SwaBlack }}>Engage:</Text>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#009aff' }}></View>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                            <View style={{ padding: 2, flex: 1, }}>
                                                <Text style={{ color: SWATheam.SwaBlack }}>Explore:</Text>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#911a5c' }}></View>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme }}>
                                            <View style={{ padding: 2, flex: 1, }}>
                                                <Text style={{ color: SWATheam.SwaBlack }}>Extend:</Text>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <View style={{ width: 25, height: 25, borderRadius: 50, backgroundColor: '#2e630b' }}></View>
                                            </View>
                                        </View>
                                    </View> : null
                }
            </>
        </View>
    )
}

export default GraphLegend

const styles = StyleSheet.create({})