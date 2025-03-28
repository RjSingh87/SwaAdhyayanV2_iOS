import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useContext } from 'react'
import { GlobleData } from '../../Store'
import { SWATheam, apiRoot } from '../../constant/ConstentValue'
import SwaHeader from '../common/SwaHeader'
import { useDispatch } from 'react-redux'
import { fetchFunBagActivityList } from '../redux/slices/FunBagActivityList'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
const ViewFunBagScreen = ({ navigation, route }) => {
  const { userData } = useContext(GlobleData)
  const dispatch = useDispatch()

  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }

  function getFunBagActivity(item) {
    const sendData = {
      screenName: route.params.selectItem.subjectID == 1 ? route.params.selectItem.subjectSubCatLang2 : route.params.selectItem.subjectSubCategory.replace('<br>', ''),
      subTypeID: route.params.selectItem.subTypeID,
      classID: (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? route.params.classID.class.classID : userData.data.classID,
      subjectID: route.params.selectItem.subjectID
    }

    const payload = {
      "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? route.params.classID.class.classID : userData.data.classID,
      "subjectID": route.params.selectItem.subjectID,
      "subTypeID": route.params.selectItem.subTypeID,
      "subPartID": item.subPartID,
      "chapterID": ""
    }

    dispatch(fetchFunBagActivityList(payload))
    navigation.navigate('activityListScreen', { sendData: sendData, isFun: 1 })

    // Services.post(apiRoot.getFilePathAccToLearningType, payload)
    // .then((res)=>{
    //     if(res.status=="success"){
    //         navigation.navigate('activityListScreen', {sendData:sendData})

    //     }
    // })
  }


  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'top', 'right']} style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme }}>
        <View style={{ flex: 1, marginTop: Platform.OS == "ios" ? 0 : 24, backgroundColor: userData?.data?.colors?.liteTheme }}>
          <SwaHeader title={route.params.selectItem.subjectSubCategory} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
          <ScrollView>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginVertical: 10, paddingHorizontal: 10 }}>
              {route.params.data.mainData.map((item, index) => {
                return (
                  <TouchableOpacity style={{ height: 140, marginVertical: 10, width: "40%", justifyContent: 'center', alignItems: 'center', backgroundColor: userData.data.colors.liteTheme, borderRadius: 6, justifyContent: 'space-around', padding: 8 }} key={item.subPartID}
                    onPress={() => {
                      getFunBagActivity(item)
                    }}>
                    <View style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', }}>
                      <Image source={{ uri: route.params.data?.imgUrl + item.uploadIcon }} style={{ height: "100%", width: "100%", borderWidth: 1, resizeMode: "contain" }} />
                    </View>
                    <View style={{ height: 40, alignItems: 'center', }}>
                      <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{item.subPartNameLang2}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}

            </View>

          </ScrollView>

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default ViewFunBagScreen
const styles = StyleSheet.create({})