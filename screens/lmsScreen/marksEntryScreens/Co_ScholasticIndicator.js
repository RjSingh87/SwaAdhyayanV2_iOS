import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { GlobleData } from '../../../Store'
import { SWATheam } from '../../../constant/ConstentValue'

const Co_ScholasticIndicator = ({ indicatorsList, actionOnIndicator, subIconID }) => {
    const { userData } = useContext(GlobleData)





    return (
        <View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme }}>
            <View style={{ padding: 10 }}>
                {indicatorsList.data != null ?
                    <>
                        <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>{subIconID == 54 ? "Co-Scholastic Indicator List" : "Discipline Indicator List"}</Text>
                        <FlatList
                            data={indicatorsList.data}
                            keyExtractor={item => item.indicatorID}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ backgroundColor: SWATheam.SwaWhite, padding: 4, borderRadius: 6, borderWidth: 1, borderColor: userData.data.colors.mainTheme, marginVertical: 10 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: 140, padding: 4 }}>
                                                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Class</Text>
                                            </View>
                                            <View style={{ width: 20, padding: 4 }}>
                                                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>:</Text>
                                            </View>
                                            <View style={{ flex: 1, padding: 4 }}>
                                                <Text style={{ color: SWATheam.SwaBlack }}>{item.getClassName.className}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: 140, padding: 4 }}>
                                                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Indicator Name</Text>
                                            </View>
                                            <View style={{ width: 20, padding: 4 }}>
                                                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>:</Text>
                                            </View>
                                            <View style={{ flex: 1, padding: 4 }}>
                                                <Text style={{ color: SWATheam.SwaBlack }}>{item.indicatorName}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: 140, padding: 4 }}>
                                                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Sub Indicator Name</Text>
                                            </View>
                                            <View style={{ width: 20, padding: 4 }}>
                                                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>:</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, padding: 4 }}>
                                            {item.getSubIndicator.map((val, ind) => {
                                                return (
                                                    <View style={{ flexDirection: 'row', marginVertical: 2 }} key={ind}>
                                                        <View style={{ padding: 4, width: 20 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack }}>{ind + 1}.</Text>
                                                        </View>
                                                        <View style={{ padding: 4, flex: 1 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack }}>{val.subIndicatorName}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            })

                                            }
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 }}>
                                            <TouchableOpacity style={{ width: '45%', padding: 8, elevation: 6, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: SWATheam.SwaGreen }} onPress={() => { actionOnIndicator(item, "addIndicator") }}>
                                                <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center', color: SWATheam.SwaWhite }}>Manage Indicator</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ width: '45%', padding: 8, elevation: 6, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: SWATheam.SwaRed }} onPress={() => { actionOnIndicator(item, 'removeIndicator') }}>
                                                <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center', color: SWATheam.SwaWhite }}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                )
                            }}
                        />
                    </> :
                    <View style={{ backgroundColor: SWATheam.SwaWhite, padding: 4, borderWidth: .7, borderRadius: 6, borderColor: userData.data.colors.mainTheme }}>
                        <Text style={{ textAlign: 'center', fontWeight: '500' }}>{indicatorsList.msg}</Text>
                    </View>
                }

            </View>
        </View>
    )
}

export default Co_ScholasticIndicator

const styles = StyleSheet.create({})