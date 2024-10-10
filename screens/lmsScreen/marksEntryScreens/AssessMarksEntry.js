import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, TextInput } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { GlobleData } from '../../../Store'
import SwaHeader from '../../common/SwaHeader'
import { apiRoot, SwaTheam } from '../../../constant/ConstentValue'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Modal from "react-native-modal";
import Ionicons from 'react-native-vector-icons/Ionicons'
import Services from '../../../Services'
import Loader from '../../common/Loader'
import { Picker } from '@react-native-picker/picker';
const AssessMarksEntry = ({ navigation, route})=>{
  //console.log(JSON.stringify(route), 'check route')
  const { userData } = useContext(GlobleData)
  const [studentList, setStudentList] = useState({ data: null, loading: false })
  const [attendance, setAttendance] = useState({ data: [] });
  const [questionList, setQuestionList] = useState({studentData:null, list: [], status: false})
  const [questionMarkList, setQuestionMarkList] = useState({ list: null, status: false})
  const [newIdsArray, setNewIdsArray] = useState({stuData:[]})
  const [fullMarks, setFullMarks] = useState()
  let questionAssignMarkList = [0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]
  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }
  useEffect(() => {
    studentListForAssessMarksEntry()
  }, [])
  function studentListForAssessMarksEntry() {
    setStudentList((prev) => {
      return { ...prev, loading: true }
    })
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "classID": route.params.data.class.classID,
      "sectionID": route.params.data.section.sectionID,
      "subjectID": route.params.data.subject.subjectID,
      "isFullMarks": route.params.isfullMark.formatID == 2 ? 1 : 0,
      "assessmentID": route.params.data.markAss.assessmentID,
      "academicYear": userData.data.academicYear,
    }
    Services.post(apiRoot.studentListForAssessMarksEntry, payload)
      .then((res) => {
        if (res.status == "success") {
          setStudentList((prev) => {
            return { ...prev, data: res.data, loading: false }
          })
        } else if (res.status == "failed") {
          alert(res.message)
          navigation.goBack()
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setStudentList((prev) => {
          return { ...prev, loading: false }
        })
      })

  }
  function assignMarks(item, index){
    let allMarks = 0
    let assignTotalMark=0
    item.PreviousQues.map((val, ind)=>{
      allMarks+=val.P_obtainedMarks
    })
    newIdsArray.stuData=[];
    setQuestionList((prev) =>{
      return { ...prev, studentData:item, list: item.PreviousQues, totalMarks:route.params.isfullMark.formatID == 2?item.PreviousQues[0].P_obtainedMarks:allMarks, status: true }
    });
  }
  function closeModule() {
    setQuestionList((prev)=>{
      return {...prev, status: false}
    })
  }
  function openPopup(Item, index=''){
    let marks = []
    questionAssignMarkList.map((val, ind)=>{
      if (val <= Item.marks) {
        marks.push({val:val, ind:index, qID:Item.questionID})
      }
    })
    setQuestionMarkList((prev) => {
      return { ...prev, list: marks, status: true}
    })
  }
  function closePopup() {
    setQuestionMarkList((prev) => {
      return { ...prev, status: false }
    })
  }


  function changeAttendance(val, index) {
    let newData = attendance.data;
    newData[index] = val;
    setAttendance(() => {
      return { data: [] }
    })
    setAttendance(() => {
      return { data: newData }
    });
  }

  function getSelectedMarks(item, qList){

    let indx = newIdsArray.stuData.findIndex((res)=>res.questionID==item.qID)
    if(indx!=-1){
      newIdsArray.stuData[indx].marks=item.val
    }
    let newData = questionList.list
    newData[item.ind]['P_obtainedMarks'] = item.val
    setQuestionList((prev)=>{
      return{...prev, list:newData}
    })
    setQuestionMarkList((prev) => {
      return { ...prev, status: false}
    })

    assignMarks(qList)
  }
  let stuDataArray = [];
  function saveSingleAssessMarks(entryType){

    console.log(JSON.stringify(questionList.studentData), 'check student---')
    let ass_1_QueNo=[]
    let menualEnt_1_Marks = []
    let Query_1_UpNew=[]
    for(i=0; i<newIdsArray.stuData.length;i++){
      
      if(route.params.isfullMark.formatID == 2){
        menualEnt_1_Marks.push(0)
        ass_1_QueNo.push(newIdsArray.stuData[i].questionID+"|"+newIdsArray.stuData[i].qMarks+"|"+newIdsArray.stuData[i].eadID+"|"+newIdsArray.stuData[i].miID+"-NA")
      }else{
        menualEnt_1_Marks.push(newIdsArray.stuData[i].marks)
        if(questionList.studentData.isPresent==0){
          Query_1_UpNew.push("NewQuery-0")
        }else{
          Query_1_UpNew.push("UpdateQuery-"+newIdsArray.stuData[i].P_attemptID)
        }
        let d = "";
        
        if(newIdsArray.stuData[i].marks=="NA"){
          d = newIdsArray.stuData[i].questionID+"|"+newIdsArray.stuData[i].qMarks+"|"+newIdsArray.stuData[i].eadID+"|"+newIdsArray.stuData[i].miID+"-"+newIdsArray.stuData[i].marks;
        }else{  
          d = newIdsArray.stuData[i].questionID+"|"+newIdsArray.stuData[i].qMarks+"|"+newIdsArray.stuData[i].eadID+"|"+newIdsArray.stuData[i].miID+"-4-"+newIdsArray.stuData[i].marks;
        }
        ass_1_QueNo.push(d)
      }


    }
    let stuData = questionList.studentData.registration_no+"~"+questionList.studentData.user_reference_id+"~";
    stuDataArray.push(stuData)
    const payload = {
      "schoolCode" : userData.data.schoolCode,
      "classID": route.params.data.class.classID,
      "sectionID" : route.params.data.section.sectionID,
      "subjectID" : route.params.data.subject.subjectID,
      "assessmentID" : route.params.data.markAss.assessmentID,
      "isFullMarks" : route.params.isfullMark.formatID == 2 ? 1 : 0,
      "entryType": entryType,
      "studentData" : stuDataArray,
      "attandance_1" : "p1",
      "ass_1_QueNo" : ass_1_QueNo,
      "academicYear" : userData.data.academicYear,
      "menualEnt_1_Marks" : menualEnt_1_Marks,
    }

    if(route.params.isfullMark.formatID==2){
      payload["totalObtainedMarks"]=questionList.totalMarks
      payload["totalAssessMarks"]=5
    }else{
      payload["Query_1_UpNew"] = Query_1_UpNew
    }
    Services.post(apiRoot.saveSingleAssessMarks, payload)
    .then((res)=>{
      if(res.status=="success"){
        alert(res.message)
        setQuestionList((prev) => {
          return {...prev, status: false}
        })
      }else{
        alert(res.message)
      }
    })
    .catch((err)=>{
      console.log(err)
    })
    .finally(()=>{
    })
  }
  function handleInputChange(val){
    setQuestionList((prev) =>{
      return { ...prev, totalMarks:val }
    });
  }
  
  return (
    <View style={{ flex: 1, marginTop: 24, backgroundColor: userData.data.colors.liteTheme }}>
      <SwaHeader title={"Assessment Marks Entry"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
      {studentList.loading ?
        <Loader/>:
        <>
          <View style={{flex: 1, padding: 10}}>
          <FlatList
            data = {studentList?.data}
            keyExtractor={item=>item.user_reference_id}
            renderItem={({item, index})=>{
              return(
                <View style={{ backgroundColor: SwaTheam.SwaWhite, borderWidth: .5, borderColor: userData.data.colors.hoverTheme, borderRadius: 6, marginVertical: 10, }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: 95, padding: 10 }}>
                        <Text style={{ color: SwaTheam.SwaBlack, fontSize: 15, fontWeight: '700' }}>Enroll. No.</Text>
                      </View>
                      <View style={{ width: 20, paddingVertical: 10 }}>
                        <Text>:</Text>
                      </View>
                      <View style={{ flex: 1, paddingVertical: 10 }}>
                        <Text style={{ color: SwaTheam.SwaBlack, fontSize: 15, fontWeight: '700' }}>{item.registration_no}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: 95, padding: 10 }}>
                        <Text style={{ color: SwaTheam.SwaBlack, fontSize: 15, fontWeight: '700' }}>Name</Text>
                      </View>
                      <View style={{width: 20, paddingVertical: 10}}>
                        <Text>:</Text>
                      </View>
                      <View style={{ flex: 1, paddingVertical: 10 }}>
                        <Text style={{ color: SwaTheam.SwaBlack, fontSize: 15, fontWeight: '700' }}>{item.name}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: 115, padding: 10, justifyContent: 'center' }}>
                        <Text style={{ color: SwaTheam.SwaBlack, fontSize: 15, fontWeight: '700' }}>Attendance</Text>
                      </View>
                      <View style={{flex: 1, justifyContent: 'center'}}>
                        {item.isPresent==1 ?
                          <Picker
                            key={index}
                            style={{ width: 150, padding: 0, marginVertical: 0, color: SwaTheam.SwaBlack, backgroundColor: userData.data.colors.liteTheme }}
                            selectedValue={attendance.data[index]}
                            onValueChange={(itemValue, itemIndex) => changeAttendance(itemValue, index)
                            }>
                            <Picker.Item style={{ marginVertical: 2 }} label="Present" value="Present"/>
                          </Picker>
                         : 
                        <Picker
                          key={index}
                          style={{ width: 150, padding: 0, marginVertical: 0, color: SwaTheam.SwaBlack, backgroundColor: userData.data.colors.liteTheme }}
                          selectedValue={attendance.data[index]}
                          onValueChange={(itemValue, itemIndex) => changeAttendance(itemValue, index)
                          }>
                          <Picker.Item style={{ marginVertical: 2 }} label="Select" value="Select" />
                          <Picker.Item style={{ marginVertical: 2 }} label="Present" value="Present"/>
                          <Picker.Item style={{ marginVertical: 2 }} label="Absent" value="Absent" />
                        </Picker>
                        }
                      </View>
                    </View>
                    <TouchableOpacity disabled={attendance.data[index] == "Present" || item.isPresent==1 ? false : true} style={{ backgroundColor: attendance.data[index] == "Present"||item.isPresent==1 ? userData.data.colors.mainTheme : userData.data.colors.hoverTheme, marginTop: 6, width: '100%', alignSelf: 'center', borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }} onPress={() => assignMarks(item, index)}>
                      <Text style={{ color: SwaTheam.SwaWhite, fontWeight: '500', marginVertical: 10, textAlign: 'center', }}>Assign Mark</Text>
                    </TouchableOpacity>
                  </View>

              )}}
          />
          </View>

          {/* <View style={{ backgroundColor: userData.data.colors.mainTheme, padding: 12 }}>
            <Text style={{ color: SwaTheam.SwaWhite, textAlign: 'center', textTransform: 'uppercase', fontWeight: '700' }}>Submit</Text>
          </View> */}
        </>
      }
      {/* marks entry popup start */}
      <Modal
        isVisible={questionList.status}
        animationInTiming={300}
        animationOutTiming={300}
        style={{ width: '100%', margin: 0 }}
      >
        <View style={styles.garyContainer}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => closeModule()}
          />
          <View style={styles.listBox}>
            <View style={{ backgroundColor: SwaTheam.SwaLightGray, width: 30, height: 6, borderRadius: 4, alignSelf: 'center' }}></View>
            <View style={{ flexDirection: 'row', marginVertical: 10, borderBottomWidth: 1.5, borderColor: SwaTheam.SwaLightGray, paddingVertical: 10 }}>
            <View style={{width:100, flexDirection:'row', padding:4, alignItems:'center'}}>
              <Text style={{ fontWeight: 'bold', color: SwaTheam.SwaBlack, width:'50%'}}>Marks:</Text>
              {route.params.isfullMark.formatID != 2?
              <Text style={{ fontWeight: 'bold', color: SwaTheam.SwaBlack, textAlign:'center', width:'50%'}}>{questionList.totalMarks}</Text>:
              <TextInput defaultValue={String(questionList.totalMarks)} value={questionList.totalMarks} keyboardType={'number-pad'} onChangeText={(val)=>handleInputChange(val)} style={{height:35, borderWidth:1,  textAlign:'center', padding:3, width:'50%', borderRadius:4,}}/>
              }
            </View>
              <Text style={{ padding: 4, flex: 1, textAlign: 'center', fontWeight: 'bold', color: SwaTheam.SwaBlack, fontSize: 15 }}>Assign Mark</Text>

              <TouchableOpacity style={{ padding: 4, width: 100, justifyContent: 'center', alignItems: 'flex-end' }}
                onPress={() => closeModule()}>
                <Ionicons name="close" size={20} color={SwaTheam.SwaGray}/>
              </TouchableOpacity>
            </View>
            <FlatList
              data={questionList.list}
              keyExtractor={item=>item.questionID}
              renderItem={({ item, index }) => {

                let asignMark = "--"
                let data = {
                  "questionID": item.questionID,
                  "marks":parseInt(item.P_obtainedMarks)>=0?item.P_obtainedMarks:"NA",
                  "qMarks":item.marks,
                  "eadID":item.eadID,
                  "miID":item.miID,
                  "P_attemptID":item.P_attemptID=="" ? 0 : item.P_attemptID,
                }
                let ind = newIdsArray.stuData.findIndex((res)=>res.questionID==item.questionID)
                if(ind==-1){
                  newIdsArray.stuData.push(data)
                }
               if(item.P_obtained_marks!="" && route.params.isfullMark.formatID!=2)
                    {
                      asignMark=item.P_obtainedMarks
                    }
                return (
                  <View style={{flexDirection: 'row', marginVertical: 10, alignItems: 'center'}} key={item.P_attemptID}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: SwaTheam.SwaBlack }}>Question: {index + 1}</Text>
                    </View>

                    <TouchableOpacity style={{ width: 100, borderWidth: 1, borderColor: userData.data.colors.mainTheme, flexDirection: 'row', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }} onPress={() => openPopup(item, index)}>
                      <View style={{ flex: 1, padding: 6}}>
                        <Text style={{ color: SwaTheam.SwaBlack}}>{asignMark!==""?asignMark:"--"}</Text>
                      </View>
                      <View style={{width: 40, padding: 3, justifyContent: 'center', alignItems: 'center'}}>
                        <AntDesign name="down" size={15} color={SwaTheam.SwaGray}/>
                      </View>
                    </TouchableOpacity>
                  </View>

                )}}
              />
          </View>
              <TouchableOpacity style={{backgroundColor:SwaTheam.SwaWhite}} onPress={()=>saveSingleAssessMarks("singleMenualEntry")}>
              <View style={{backgroundColor:userData.data.colors.mainTheme, padding:10, borderTopRightRadius:10, borderTopLeftRadius:10, justifyContent:'center'}}>
                <Text style={{textAlign:'center', color:SwaTheam.SwaWhite, textTransform:'uppercase', fontWeight:'500'}}>Save</Text>
              </View>
          </TouchableOpacity>

          

          <Modal
            isVisible={questionMarkList.status}
            animationInTiming={300}
            animationOutTiming={300}
            style={{ width: '100%', margin: 0 }}
          >
            <View style={styles.garyContainer}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => closePopup()}>
              </TouchableOpacity>
              <View style={styles.listBox}>

                <View style={{ backgroundColor: SwaTheam.SwaLightGray, width: 30, height: 6, borderRadius: 4, alignSelf: 'center' }}></View>
                <View style={{ flexDirection: 'row', marginVertical: 10, borderBottomWidth: 1.5, borderColor: SwaTheam.SwaLightGray, paddingVertical: 10 }}>
                  <View style={{ width: 85 }}></View>
                  <Text style={{ padding: 4, flex: 1, textAlign: 'center', fontWeight: 'bold', color: SwaTheam.SwaBlack, fontSize: 15 }}>Mark List</Text>

                  <TouchableOpacity style={{ padding: 4, width: 85, justifyContent: 'center', alignItems: 'flex-end' }}
                    onPress={() => closePopup()}>
                    <Ionicons name="close" size={20} color={SwaTheam.SwaGray} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={questionMarkList.list}
                  renderItem={({item, index})=>{
                    let updateMarks = questionList.studentData
                    
                    return(
                    <TouchableOpacity style={{padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.hoverTheme}} onPress={()=>getSelectedMarks(item, updateMarks)}>
                        <Text style={{padding: 2, textAlign: 'center', color: SwaTheam.SwaBlack }}>{item.val}</Text>
                    </TouchableOpacity>
                    )
                  }}
                />

              </View>

            </View>


          </Modal>


        </View>

      </Modal>
      {/* marks entry popup end */}

    </View>
  )
}

export default AssessMarksEntry

const styles = StyleSheet.create({
  garyContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  listBox: {
    backgroundColor: SwaTheam.SwaWhite,
    maxHeight: '60%',
    minHeight: 50,
    width: "100%",
    alignSelf: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
})