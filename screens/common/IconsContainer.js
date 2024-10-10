import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'
import Entypo from 'react-native-vector-icons/Entypo'
const { height, width } = Dimensions.get('window');
const IconsContainer = ({ deshboardData, getIconDetail, type, selectedIcon, selectSubIcon, activeMainIconIds }) => {
  const { userData } = useContext(GlobleData)

  return (
    <View style={{ height: 120, backgroundColor: userData?.data?.colors?.mainTheme, flexDirection: 'row' }}>
      <View style={{ padding: 4, justifyContent: 'center', alignItems: 'center' }}>
        <Entypo name="chevron-left" color={userData.data.colors.hoverTheme} size={20} />
      </View>
      <View style={{ flex: 1, }}>
        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          {deshboardData?.icons?.icons.map((item, index) => {
            let activeIconBg = null
            let arrayKey = null
            let subIconUrl = ""
            let subIconName = ""

            if (type == "mainIcon") {
              subIconUrl = deshboardData?.iconUrl + item?.iconData?.iconPath + item?.iconData?.iconImage
              subIconName = item?.iconData?.iconName?.length > 10 ? item?.iconData?.iconName.substring(0, 8) + '...' : item?.iconData?.iconName
              arrayKey = item.mainIconID
            } else if (item.septIcon != undefined) {
              subIconUrl = deshboardData.icons.path + item.septIcon
              subIconName = item.testType.length > 10 ? item.testType.substring(0, 8) + '...' : item.testType
              arrayKey = item.testID
              activeIconBg = (selectSubIcon?.selectedSubIcon?.testType === item.testType) ? userData.data.colors.hoverTheme : null
            } else {
              subIconUrl = deshboardData?.iconUrl + item?.iconData?.iconPath + item?.iconData?.iconImage
              subIconName = item?.iconData?.iconName?.length > 10 ? item?.iconData?.iconName.substring(0, 8) + '...' : item?.iconData?.iconName
              arrayKey = item.subIconID
              {/* activeIconBg = (item?.getSubIconsData?.subIconName===deshboardData?.iconName && item?.getSubIconsData?.subIconName!=undefined) || (item?.getSubIconsData?.subIconID===selectedIcon?.subIconID && item?.getSubIconsData?.subIconID!=undefined) && (type=='subIcon')?userData.data.colors.hoverTheme:null */ }
              activeIconBg = (selectedIcon?.subIconID == item.getSubIconsData.subIconID) && (type == 'subIcon') ? userData.data.colors.hoverTheme : null
            }

            return (
              <View key={arrayKey}>
                <TouchableOpacity style={{ height: '100%', width: (width - 56) / 3 }}
                  onPress={() => {
                    if (type == 'subIcon') {
                      getIconDetail(item)
                    } else {
                      getIconDetail(item)
                    }
                  }

                  }>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: 75, width: 75, borderRadius: 50, justifyContent: 'center', alignItems: 'center', padding: 8, borderWidth: 0, borderColor: userData?.data?.colors.hoverTheme, backgroundColor: activeIconBg }}>
                      <Image source={{ uri: subIconUrl }} style={{ height: '100%', width: "100%", resizeMode: 'contain' }} />
                    </View>
                  </View>
                  <View style={{ paddingHorizontal: 2, height: 30 }}>
                    <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>{subIconName}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )
          })}
        </ScrollView>
      </View>

      <View style={{ padding: 4, justifyContent: 'center', alignItems: 'center' }}>
        <Entypo name="chevron-right" color={userData.data.colors.hoverTheme} size={20} />
      </View>

    </View>
  )
}

export default IconsContainer

const styles = StyleSheet.create({})