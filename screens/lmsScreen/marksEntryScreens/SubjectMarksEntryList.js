import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { apiRoot, SwaTheam } from '../../../constant/ConstentValue'
import { GlobleData } from '../../../Store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomInput from '../../common/CustomInput'
import { FlatList } from 'react-native-gesture-handler'
import Services from '../../../Services'

const SubjectMarksEntryList = ({ subjectMarksEntry, selectedField, selectTerm, termBtnID }) => {
  const { userData } = useContext(GlobleData)

  function saveSubjectMarksEntry(item, formatName, index) {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "classID": selectedField.class.classID,
      "sectionID": selectedField.section.sectionID,
      "subjectID": selectedField.subject.subjectID,
      "termID": termBtnID,
      "academicYear": userData.data.academicYear,
      "userRefID": item.userRefID,
      "periodicTestMarks": subjectMarksEntry.list[index].getSubjectMarksEntry.periodicTestMarks!=undefined?subjectMarksEntry.list[index].getSubjectMarksEntry.periodicTestMarks:"",
      "noteBookMarks": subjectMarksEntry.list[index].getSubjectMarksEntry.noteBookMarks!=undefined?subjectMarksEntry.list[index].getSubjectMarksEntry.noteBookMarks:"",
      "seaMarks": subjectMarksEntry.list[index].getSubjectMarksEntry.seaMarks!=undefined?subjectMarksEntry.list[index].getSubjectMarksEntry.seaMarks:"",
      "halfYearlyMarks": subjectMarksEntry.list[index].getSubjectMarksEntry.halfYearlyMarks!=undefined?subjectMarksEntry.list[index].getSubjectMarksEntry.halfYearlyMarks:"",
      "formType": formatName,
      "schMarksID": subjectMarksEntry.list[index].getSubjectMarksEntry.schMarksID!=undefined?subjectMarksEntry.list[index].getSubjectMarksEntry.schMarksID:""
    }
    console.log(payload, '----------------')
    Services.post(apiRoot.saveSubjectMarksEntry, payload)
    .then((res)=>{
      console.log(JSON.stringify(res), 'check save response')
      if(res.status=="success"){
        alert(res.message)
      }else if(res.status=="failed"){
        alert(res.message)
      }
    })
    .catch((err)=>{
      console.log(err)
    })
    .finally(()=>{

    })
  }
  console.log(JSON.stringify(subjectMarksEntry), '-------------???')

  function onChangeText(val, index, type) {
    if (subjectMarksEntry.list[index].getSubjectMarksEntry != null) {
      if (type == "perodic") {
        subjectMarksEntry.list[index].getSubjectMarksEntry.periodicTestMarks = val
      } else if (type == "noteBook") {
        subjectMarksEntry.list[index].getSubjectMarksEntry.noteBookMarks = val
      } else if (type == "sea") {
        subjectMarksEntry.list[index].getSubjectMarksEntry.seaMarks = val
      } else if (type == "halfYearly") {
        subjectMarksEntry.list[index].getSubjectMarksEntry.halfYearlyMarks = val
      }
    } else {
      subjectMarksEntry.list[index].getSubjectMarksEntry = {}
      if (type == "perodic") {
        subjectMarksEntry.list[index].getSubjectMarksEntry["periodicTestMarks"] = val
      } else if (type == "noteBook") {
        subjectMarksEntry.list[index].getSubjectMarksEntry["noteBookMarks"] = val
      } else if (type == "sea") {
        subjectMarksEntry.list[index].getSubjectMarksEntry["seaMarks"] = val
      } else if (type == "halfYearly") {
        subjectMarksEntry.list[index].getSubjectMarksEntry["halfYearlyMarks"] = val
      }
    }

  }


  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ color: SwaTheam.SwaBlack, fontWeight: '700', marginBottom: 8 }}>Subject Marks Entry (Half-Yearly & Annual)</Text>
      <FlatList
        data={subjectMarksEntry.list}
        keyExtractor={item => item.userRefID}
        renderItem={({ item, index }) => {
          let formatName = ""
          if (item?.getSubjectMarksEntry != null) {
            formatName = "update"
          } else {
            formatName = "submit"
          }

          let T1Btn = "radio-button-off"
          let T2Btn = "radio-button-off"
          let marksType = ""
          if (termBtnID == 1) {
            T1Btn = "radio-button-on"
            T2Btn = "radio-button-off"
            marksType = "Half Yearly Marks"
          } else if (termBtnID == 2) {
            T1Btn = "radio-button-off"
            T2Btn = "radio-button-on"
            marksType = "Annual Marks"
          }

          // console.log(item, 'check item')

          return (
            <View style={{ backgroundColor: SwaTheam.SwaWhite, borderRadius: 6, borderWidth: .7, borderColor: userData.data.colors.mainTheme, marginBottom: 10 }}>
              <View style={{ padding: 10, backgroundColor: userData.data.colors.mainTheme, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
                <Text style={{ color: SwaTheam.SwaWhite }}>{subjectMarksEntry.list[index].getStudentName.fullName}</Text>
              </View>
              <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row', width: 200, justifyContent: 'space-between', marginBottom: 10 }}>
                  <TouchableOpacity style={{ flexDirection: 'row', padding: 4, borderRadius: 50, width: 90, backgroundColor: SwaTheam.SwaWhite, elevation: 9, justifyContent: 'space-around' }} onPress={() => { selectTerm(item, 'term1') }}>
                    <Ionicons name={T1Btn} color={SwaTheam.SwaBlue} size={20} />
                    <Text style={{ color: SwaTheam.SwaBlack }}>Term 1</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ flexDirection: 'row', padding: 4, borderRadius: 50, width: 90, backgroundColor: SwaTheam.SwaWhite, elevation: 9, justifyContent: 'space-around' }} onPress={() => { selectTerm(item, 'term2') }}>
                    <Ionicons name={T2Btn} color={SwaTheam.SwaBlue} size={20} />
                    <Text style={{ color: SwaTheam.SwaBlack }}>Term 2</Text>
                  </TouchableOpacity>
                </View>
                <>
                  <View style={{ flexDirection: 'row', paddingVertical: 4, borderTopWidth: 1, borderColor: userData.data.colors.hoverTheme }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={{ color: SwaTheam.SwaBlack }}>Priodic Test</Text>
                    </View>
                    <View style={{ width: 80, height: 40, justifyContent: 'center' }}>
                      <CustomInput styleFrom={"GradeEntry"} keyboardType={"numeric"} defaultValue={item?.getSubjectMarksEntry != null && item?.getSubjectMarksEntry?.periodicTestMarks != undefined ? item.getSubjectMarksEntry.periodicTestMarks.toString() : null} onChangeText={(val) => onChangeText(val, index, "perodic")} />
                    </View>

                  </View>
                  <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={{ color: SwaTheam.SwaBlack }}>Note Book</Text>
                    </View>
                    <View style={{ width: 80, height: 40, justifyContent: 'center' }}>
                      <CustomInput styleFrom={"GradeEntry"} keyboardType={"numeric"} defaultValue={item?.getSubjectMarksEntry != null && item?.getSubjectMarksEntry?.noteBookMarks != undefined ? item.getSubjectMarksEntry.noteBookMarks.toString() : null} onChangeText={(val) => onChangeText(val, index, "noteBook")} />
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={{ color: SwaTheam.SwaBlack }}>SEA</Text>
                    </View>
                    <View style={{ width: 80, height: 40, justifyContent: 'center' }}>
                      <CustomInput styleFrom={"GradeEntry"} keyboardType={"numeric"} defaultValue={item?.getSubjectMarksEntry != null && item?.getSubjectMarksEntry?.seaMarks != undefined ? item.getSubjectMarksEntry.seaMarks.toString() : null} onChangeText={(val) => onChangeText(val, index, "sea")} />
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={{ color: SwaTheam.SwaBlack }}>{marksType}</Text>
                    </View>
                    <View style={{ width: 80, height: 40, justifyContent: 'center' }}>
                      <CustomInput styleFrom={"GradeEntry"} keyboardType={"numeric"} maxLength={2} defaultValue={item?.getSubjectMarksEntry != null && item.getSubjectMarksEntry.halfYearlyMarks != undefined ? item.getSubjectMarksEntry.halfYearlyMarks.toString() : null} onChangeText={(val) => onChangeText(val, index, "halfYearly")} />
                    </View>
                  </View>
                  <TouchableOpacity style={{ width: 80, padding: 10, borderRadius: 6, backgroundColor: item?.getSubjectMarksEntry != null ? SwaTheam.SwaGreen : userData.data.colors.mainTheme, alignSelf: 'flex-end', marginTop: 10 }} onPress={() =>
                    saveSubjectMarksEntry(item, formatName, index)}>
                    <Text style={{ color: SwaTheam.SwaWhite, textAlign: 'center', textTransform: 'uppercase' }}>{formatName}</Text>
                  </TouchableOpacity>
                </>
              </View>



            </View>
          )
        }}
      />
    </View>
  )
}

export default SubjectMarksEntryList

const styles = StyleSheet.create({})