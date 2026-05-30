import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { SWATheam } from '../../constant/ConstentValue';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GlobleData } from '../../Store';

const CustomInput = ({ placeHolder, value, defaultValue, onChangeText, maxLength, icon, secureTextEntry, inputName, editable, keyboardType, onBlur, indicator, styleFrom, gradeType },) => {
  const [secure, setSecure] = useState(secureTextEntry)
  const { userData } = useContext(GlobleData)
  let borderColor = null
  if (userData.data == null) {
    borderColor = SWATheam.SwaGray
  } else if (indicator) {
    borderColor = SWATheam.SwaRed
  } else {
    borderColor = userData?.data?.colors?.hoverTheme
  }

  return (
    <View style={{ borderWidth: 1, borderColor: borderColor, backgroundColor: SWATheam.SwaWhite, borderRadius: 4, flexDirection: 'row' }}>
      <TextInput
        value={value}
        textAlign={styleFrom == "GradeEntry" ? "center" : null}
        defaultValue={defaultValue}
        placeholder={placeHolder}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secure}
        editable={editable == 'false' ? false : true}
        placeholderTextColor={SWATheam.SwaGray}
        style={{ height: 40, width: '100%', paddingLeft: 5, flex: 1, color: SWATheam.SwaBlack, }} />
      {inputName == "password" &&
        <TouchableOpacity style={{ width: 45, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => { setSecure(!secure) }}>
          <Ionicons name={secure ? icon : "eye-outline"} color={SWATheam.SwaGray} size={20} />
        </TouchableOpacity>
      }
      {/* {inputName == "email" && checkMail? 
                <TouchableOpacity style={{width: 45, justifyContent: 'center', alignItems: 'center'}}>
                    <Feather name={"check-circle"} size={20} color={SWATheam.SwaBlue}/>
                </TouchableOpacity>:
                null
            } */}
    </View>
  )
}

export default CustomInput
const styles = StyleSheet.create({})