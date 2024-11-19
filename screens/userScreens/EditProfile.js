import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { GlobleData } from '../../Store'
import SwaHeader from '../common/SwaHeader'
import CustomInput from '../common/CustomInput'
import { SWATheam, apiRoot } from '../../constant/ConstentValue'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Services from '../../Services'
import MsgModal from '../common/MsgModal'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'



const EditProfile = ({ navigation, route }) => {
  const { userData } = useContext(GlobleData)
  const [genderBtn, setGenderBtn] = useState({ male: 'radio-button-off', female: 'radio-button-off' })
  const [msgModalVisible, setMsgModalVisible] = useState({ msg: '', status: false, type: '' })
  const loginUserData = route.params.data
  const [userDetail, setUserDetail] = useState({
    fullName: loginUserData.fullName,
    emailID: loginUserData.emailID,
    dateOfBirth: loginUserData.dateOfBirth,
    contactNo: loginUserData.userTypeID == 5 || loginUserData.userTypeID == 6 ? loginUserData.fatherContact : loginUserData.contactNo,
    parentName: loginUserData.fatherName,
    address: loginUserData.address,
    gender: loginUserData.gender.toLowerCase() == 'female' || loginUserData.gender == '2' ? "female" : loginUserData.gender.toLowerCase() == 'male' || loginUserData.gender == '1' ? "male" : loginUserData.gender
  });

  function onClickLeftIcon() {
    navigation.goBack()
  }
  useEffect(() => {
    if (loginUserData.gender.toLowerCase() == 'female' || loginUserData.gender == '2') {
      setGenderBtn((prev) => {
        return { ...prev, female: 'radio-button-on' }
      })
    } else if (loginUserData.gender.toLowerCase() == 'male' || loginUserData.gender == '1') {
      setGenderBtn((prev) => {
        return { ...prev, male: 'radio-button-on' }
      })
    }


  }, [])

  function changeGender(val) {
    if (val == 'm') {
      setGenderBtn((prev) => {
        return { ...prev, male: 'radio-button-on', female: 'radio-button-off' }
      })
      setUserDetail((prev) => {
        return { ...prev, gender: "Male" }
      })
    } else if (val == 'f') {
      setGenderBtn((prev) => {
        return { ...prev, male: 'radio-button-off', female: 'radio-button-on' }
      })
      setUserDetail((prev) => {
        return { ...prev, gender: "Female" }
      })
    }
  }

  function handleInputChange(val, type) {

    if (type == "fullName") {
      setUserDetail((prev) => {
        return { ...prev, fullName: val }
      })
    } else if (type == "patentName") {
      setUserDetail((prev) => {
        return { ...prev, parentName: val }
      })

    } else if (type == "email") {
      setUserDetail((prev) => {
        return { ...prev, emailID: val }
      })

    } else if (type == "dob") {
      setUserDetail((prev) => {
        return { ...prev, dateOfBirth: val }
      })

    } else if (type == "contact") {
      setUserDetail((prev) => {
        return { ...prev, parentName: val }
      })

    } else if (type == "address") {
      setUserDetail((prev) => {
        return { ...prev, address: val }
      })
    }
  }
  function updateProfileData() {
    const payload = {
      userRefID: loginUserData.userRefID,
      userTypeID: loginUserData.userTypeID,
      schoolCode: loginUserData.schoolCode,
      fullName: userDetail.fullName,
      emailID: userDetail.emailID,
      dateOfBirth: userDetail.dateOfBirth,
      contactNo: Number(userDetail.contactNo),
      address: userDetail.address,
      gender: userDetail.gender
    }
    if (loginUserData?.userTypeID == 5) {
      payload["parentName"] = userDetail.parentName
    }

    Services.post(apiRoot.updateProfileData, payload)
      .then((res) => {
        if (res.status == "success") {
          setMsgModalVisible((prev) => {
            return { ...prev, msg: res.message, status: true, type: 'success' }
          })
          setTimeout(() => {
            setMsgModalVisible((prev) => {
              return { ...prev, status: false }
            })
            navigation.goBack()
          }, 1500)
        } else if (res.status == "error") {
          setMsgModalVisible((prev) => {
            return { ...prev, msg: res.message, status: true, type: 'error' }
          })
          setTimeout(() => {
            setMsgModalVisible((prev) => {
              return { ...prev, status: false }
            })
          }, 1500)

        }

      })
  }

  const insets = useSafeAreaInsets()

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'right', "top"]} style={{ flex: 1, backgroundColor: userData.data.colors.mainTheme, }}>
        <View style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : 24, backgroundColor: userData.data.colors.liteTheme }}>
          <SwaHeader title={'Edit Profile'} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} />
          <View style={{ flex: 1, padding: 10, backgroundColor: userData.data.colors.hoverTheme, padding: 10 }}>
            <View style={{ flex: 1, backgroundColor: SWATheam.SwaWhite, borderRadius: 6, padding: 10, paddingBottom: insets.bottom }}>
              <View style={{ flex: 1 }}>
                <ScrollView>
                  <View style={{ marginBottom: 25 }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', paddingBottom: 6, paddingHorizontal: 4 }}>Full Name:</Text>
                    <CustomInput defaultValue={userDetail.fullName} onChangeText={(val) => handleInputChange(val, 'fullName')} />
                  </View>

                  <View style={{ marginBottom: 25 }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', paddingBottom: 6, paddingHorizontal: 4 }}>Gender:</Text>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 6 }}>

                      <View style={{ width: '50%', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => changeGender('m')}>
                          <Ionicons name={genderBtn?.male} size={20} color={SWATheam.SwaBlue} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <Text style={{ color: SWATheam.SwaBlack }}>Male</Text>
                      </View>

                      <View style={{ width: '50%', flexDirection: 'row', }}>
                        <TouchableOpacity onPress={() => changeGender('f')}>
                          <Ionicons name={genderBtn?.female} size={20} color={SWATheam.SwaBlue} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <Text style={{ color: SWATheam.SwaBlack }}>Female</Text>
                      </View>

                    </View>
                  </View>

                  {loginUserData?.userTypeID == 5 || loginUserData?.userTypeID == 6 ?
                    <View style={{ marginBottom: 25 }}>
                      <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', paddingBottom: 6, paddingHorizontal: 4 }}>Parent Name:</Text>
                      <CustomInput defaultValue={userDetail.parentName} onChangeText={(val) => handleInputChange(val, 'patentName')} />
                    </View> : null
                  }
                  <View style={{ marginBottom: 25 }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', paddingBottom: 6, paddingHorizontal: 4 }}>E-mail:</Text>
                    <CustomInput defaultValue={userDetail.emailID} onChangeText={(val) => handleInputChange(val, 'email')} />
                  </View>
                  <View style={{ marginBottom: 25 }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', paddingBottom: 6, paddingHorizontal: 4 }}>Date of Birth:</Text>
                    <CustomInput defaultValue={userDetail.dateOfBirth} keyboardType={'number-pad'} onChangeText={(val) => handleInputChange(val, 'dob')} />
                  </View>
                  <View style={{ marginBottom: 25 }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', paddingBottom: 6, paddingHorizontal: 4 }}>Contact:</Text>
                    <CustomInput defaultValue={userDetail.contactNo} keyboardType={'number-pad'} maxLength={10} onChangeText={(val) => handleInputChange(val, 'contact')} />
                  </View>

                  <View style={{ marginBottom: 25 }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', paddingBottom: 6, paddingHorizontal: 4 }}>Address:</Text>
                    <CustomInput defaultValue={userDetail.address} onChangeText={(val) => handleInputChange(val, 'address')} />
                  </View>

                </ScrollView>
              </View>

              <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, padding: 10, borderRadius: 6 }}
                onPress={() => updateProfileData()}
              >
                <Text style={{ color: SWATheam.SwaWhite, fontWeight: '700', textAlign: 'center' }}>Submit</Text>
              </TouchableOpacity>
            </View>

            <MsgModal msgModalVisible={msgModalVisible} />

          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default EditProfile

const styles = StyleSheet.create({})