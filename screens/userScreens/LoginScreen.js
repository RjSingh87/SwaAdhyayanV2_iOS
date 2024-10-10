import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, ScrollView, Keyboard, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SWATheam, studentId, teacherId, schoolId } from '../../constant/ConstentValue';
import CustomInput from '../common/CustomInput';

import { GlobleData } from '../../Store';


const LoginScreen = ({ navigation }) => {
  const { login, userData } = useContext(GlobleData);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [userType, setUserType] = useState(studentId);
  const [studentUser, setStudentUser] = useState({ userId: '' });
  const [teacherUser, setTeacherUser] = useState({ userId: '', password: '' });
  const [errorMsg, setErrorMsg] = useState(userData?.message ? userData?.message : null)
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  function selectUserType(val) {
    setUserType(val)
    setStudentUser({})
    setTeacherUser({})
    setErrorMsg('')
  }
  function handleInputChange(val, type) {
    if (type == 'code') {
      setStudentUser((prev) => {
        return { ...prev, userId: val }
      })
    } else if (type == "email") {
      if (val.trim().length >= 4 && val.includes('@')) {
        setTeacherUser((prev) => {
          return { ...prev, userId: val, checkMail: true }
        })
      } else {
        setTeacherUser((prev) => {
          return { ...prev, checkMail: false }
        })
      }

    } else if (type == "password") {
      setTeacherUser((prev) => {
        return { ...prev, password: val }
      })
    }
  }
  return (
    <View style={{ flex: 1, backgroundColor: SWATheam.SwaBlue }}>
      <View style={{ height: '18%' }}>
      </View>
      <View style={{ height: 50, backgroundColor: SWATheam.SwaWhite, borderTopEndRadius: 35, borderTopStartRadius: 35 }}>
        <View style={{ height: 90, width: 90, borderRadius: 50, borderColor: SWATheam.SwaBlue, borderWidth: 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', transform: [{ translateY: -50 }] }}>
          <Image source={require('../../assets/SW_Logo.png')} style={{ width: '100%', height: '100%' }} />
        </View>
      </View>
      <View style={{ backgroundColor: SWATheam.SwaWhite, flex: 1, paddingHorizontal: 30 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: SWATheam.SwaBlack, marginVertical: 5 }}>Login</Text>
        <KeyboardAvoidingView>
          <View>
            <ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 8 }}>
                <TouchableOpacity style={{ backgroundColor: userType == 2 ? SWATheam.SwaBlue : SWATheam.SwaLightBlue, padding: 12, borderTopLeftRadius: 6, borderBottomLeftRadius: 6, width: '50%' }}
                  onPress={() => selectUserType(studentId)}>
                  <Text style={{ textAlign: 'center', fontWeight: '500', color: userType == 2 ? SWATheam.SwaWhite : SWATheam.SwaBlack }}>Student</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: userType == 1 ? SWATheam.SwaBlue : SWATheam.SwaLightBlue, padding: 12, borderTopRightRadius: 6, borderBottomRightRadius: 6, width: '50%' }}
                  onPress={() => selectUserType(teacherId)}>
                  <Text style={{ textAlign: 'center', fontWeight: '500', color: userType == 1 ? SWATheam.SwaWhite : SWATheam.SwaBlack }}>Teacher</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 135, paddingVertical: 10, justifyContent: 'space-around' }}>
                <CustomInput placeHolder={userType == 1 ? "Enter your e-mail address" : "Enter your Access code"} maxLength={userType == 1 ? null : 32} onChangeText={(val) => handleInputChange(val, userType == 1 ? 'email' : 'code')} inputName={userType == 1 ? "email" : 'code'} checkMail={teacherUser.checkMail} />
                {userType == 1 &&
                  <CustomInput placeHolder={"Enter your password"} secureTextEntry={true} icon={"eye-off-outline"} onChangeText={(val) => handleInputChange(val, 'password')} inputName={"password"} />
                }
              </View>
              <TouchableOpacity style={{ backgroundColor: SWATheam.SwaBlue, borderRadius: 6, padding: 12, marginVertical: 10 }}
                onPress={() => {
                  // setErrorMsg('');
                  login(userType == 1 ? teacherUser : studentUser, userType, navigation)
                }}
              >
                <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500', textAlign: 'center' }}>Sign in</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        {!isKeyboardVisible &&
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../../assets/loginImg.png')} style={{ width: 230, height: 230 }} />
          </View>
        }
      </View>
    </View>

  )
}

export default LoginScreen

const styles = StyleSheet.create({})