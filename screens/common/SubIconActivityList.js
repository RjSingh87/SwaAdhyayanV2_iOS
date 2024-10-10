import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'

const SubIconActivityList = ({ navigation, toolItems, getModuleActivityData, selectedModuleItem }) => {
    let listData = []
    if (toolItems.mainData != undefined) {
        listData = toolItems.mainData
    } else {
        listData = toolItems
    }

    const { userData } = useContext(GlobleData)
    return (
        <View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme }}>
            <ScrollView>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginVertical: 10, paddingHorizontal: 10 }}>
                    {listData.map((item, index) => {
                        let listKey = ''
                        let iconName = ""
                        let chapActUrl = ""
                        let imgUrl = ''
                        if (selectedModuleItem?.urlLink != null && selectedModuleItem?.urlLink != "") {
                            if (item.chapterName != null || item.chapterName != undefined) {
                                listKey = item.chapterID
                                {/* iconUrl = item.chapterName.chapterIcon
                        baseUrl = toolItems.chapterImg */}
                                imgUrl = toolItems.chapterImg + item.chapterName.chapterIcon
                                iconName = ''

                            } else {
                                {/* alert(index) */ }
                                listKey = item.subTypeID
                                {/* iconUrl = index+1+'.png'
                        baseUrl = toolItems.activityImg */}
                                imgUrl = toolItems.activityImg + (index + 1) + '.png'
                                {/* imgUrl = toolItems.activityImg+(index+1)+'.png' */ }
                                iconName = item.activityName.replace('<br>', '')
                            }
                        } else if (item.childIconID != undefined) {
                            listKey = item.childIconID
                            imgUrl = item.iconImage
                            iconName = item.childIconName.replace('<br>', '')
                        } else {
                            if (item.htmlUrl == "swaLearning") {
                                listKey = item.activityID
                                {/* iconUrl = item.activityUrl
                        baseUrl = '' */}
                                imgUrl = item.imgPath
                                iconName = item.activityName.replace('<br>', '')

                            } else {
                                listKey = item.chapterID
                                {/* iconUrl = item?.chapterIcon
                        baseUrl = toolItems.chapterImg */}
                                imgUrl = toolItems.chapterImg + item?.chapterIcon
                                iconName = ''
                            }
                        }
                        if (selectedModuleItem?.urlLink != null && item.chapterName != null) {
                            chapActUrl = `https://swaadhyayan.com/data/e-Learning/activities/${item.activityUrl}/Unit-${item.chapterNo}.pdf`;
                        }
                        return (
                            <TouchableOpacity style={{ height: 180, marginVertical: 10, width: "45%", justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', elevation: 9, borderRadius: 6, justifyContent: 'space-around', padding: 8 }} key={index}
                                onPress={() => {
                                    let actUrl = ''
                                    if ((toolItems.activityUrl != null || toolItems.activityUrl != undefined) && item.htmlUrl == "VirtualTour") {
                                        actUrl = item.activityPath
                                    } else if (toolItems.activityUrl != null || toolItems.activityUrl != undefined) {
                                        // actUrl = toolItems.activityUrl // for other
                                        actUrl = item.activityPath
                                    } else if (item.htmlUrl == "swaLearning") {
                                        actUrl = item.activityUrl
                                    }
                                    // if(item.htmlUrl=="VirtualTour"){
                                    //     actUrl=item.activityPath
                                    // }
                                    getModuleActivityData(item, actUrl, chapActUrl, selectedModuleItem.subTypeID, navigation,)
                                }}>
                                {item.subTypeID != undefined ?
                                    <View style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={{ uri: imgUrl }} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                                    </View> :

                                    <View style={{ flex: 1, width: 90, justifyContent: 'center', alignItems: 'center', }}>
                                        <Image source={{ uri: imgUrl }} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                                    </View>
                                }
                                {iconName != '' &&
                                    <View style={{ alignItems: 'center', height: 60, justifyContent: 'center' }}>
                                        <Text style={{ textAlign: 'center', color: SWATheam.SwaGray }}>{iconName}</Text>
                                    </View>
                                }
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

export default SubIconActivityList
const styles = StyleSheet.create({})