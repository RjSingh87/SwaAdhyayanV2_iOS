import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Platform } from "react-native";
import Mcq from "./viewActivity/mcq";
import Dd from "./viewActivity/dd";
import Desc from "./viewActivity/desc";
import Dnd from "./viewActivity/Dnd";
import Fillup from "./viewActivity/fillup";
import Jumbo from "./viewActivity/Jumbo";
import Match from "./viewActivity/match";
import Tnf from "./viewActivity/tnf";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import { SWATheam, apiRoot } from "../../../constant/ConstentValue";
import { GlobleData } from "../../../Store";
import Services from "../../../Services";
import SwaHeader from "../../common/SwaHeader";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import ViewPdf from "./viewPdf";

var studentIDs = [];
var pdfPath = "";
var questionIDs = [];
export default function AssessmentQuesView({ navigation, route }) {
  let assesssmentName = route.params.data.assName;
  let subjectName = route.params.data.subjectData[0].subjectNameLang1;
  let totalTime = route.params.data.totalTime;
  let totalAssMarks = route.params.data.totalMarks;
  let totalAssQuestion = route.params.data.noOfQuestion;
  let generatedAssQuesList = route.params.data.questionData;
  let studentList = route.params.data.studentData;
  let assessID = route.params.data.assessmentID;

  const { userData } = useContext(GlobleData)
  const [isAssign, setIsAssign] = useState(false);
  let selectedClass = null
  if (route.params.selectedData.selectedIds.classID == 13) {
    selectedClass = "Level A"
  } else if (route.params.selectedData.selectedIds.classID == 14) {
    selectedClass = "Level B"
  } else if (route.params.selectedData.selectedIds.classID == 15) {
    selectedClass = "Level C"
  } else {
    selectedClass = route.params.selectedData.selectedIds.classID
  }

  assignArguments = [];
  studentList.map((item, index) => {
    let dd = {
      'checked': false
    }
    assignArguments.push(dd)
  })
  const [chapData, setChapData] = useState(assignArguments);
  const [isChapChecked, setIsChapChecked] = useState(false);
  const checkChapAll = () => {
    studentIDs = [];
    let newValue = chapData.filter((item) => item.checked).length === chapData.length;
    if (!newValue == false) {
      studentIDs = [];
    }
    let temp = chapData.map((item, index) => {
      if (!newValue == true) {
        let index1 = studentIDs.indexOf(studentList[index].userRefID)
        if (index1 == -1) {
          studentIDs.push(studentList[index].userRefID)
        } else {
          studentIDs.splice(index1, 1)
        }
      }
      return { ...item, checked: !newValue };
    });
    setChapData(temp);
  };
  const checkChapOne = (newValue, index) => {
    let index1 = studentIDs.indexOf(studentList[index].userRefID)
    if (newValue) {
      if (index1 == -1) {
        studentIDs.push(studentList[index].userRefID)
      } else {
        studentIDs.splice(index1, 1)
      }
    } else {
      studentIDs.splice(index1, 1)
    }
    let temp = chapData.map((item, i) => {
      return index === i ? { ...item, checked: newValue } : item;
    });
    setChapData(temp);
    setIsChapChecked(!isChapChecked);
  };

  const assignAssessmentToStudent = () => {
    let selectStuIDs = "";
    if (studentIDs.length == studentList.length) {
      selectStuIDs = "all";
    } else if (studentIDs.length == 0) {
      alert("Please Select Atleast One Student");
      return
    } else {
      selectStuIDs = studentIDs.toString();
    }
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "userRefID": userData.data.userRefID,
      "assessmentID": assessID,
      "studentRefIDs": selectStuIDs,
      "academicYear": userData.data.academicYear
    }
    Services.post(apiRoot.assignAssessmentToStudents, payload)
      .then((res) => {
        if (res.status == "success") {
          alert(res.message);
          setIsAssign(false)
          // setAssignAsessment(false)
          // setAssessmentQuestion([])
          navigation.navigate('subIconScreen', { from: "assign" })
        } else {
          alert(res.message)
        }
      })
  }

  function downloadAssPdf() {
    const payload = {
      "questionIDs": questionIDs,
      "assessmentID": assessID
    }
    Services.post(apiRoot.downloadPdf, payload)
      .then((res) => {
        pdfPath = res
        navigation.navigate('asspdfView', { data: pdfPath })
      })
  }

  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }

  const insets = useSafeAreaInsets()


  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'right', 'top']} style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme }}>
        <View style={{ flex: 1, marginTop: Platform.OS == "ios" ? 0 : 24, backgroundColor: userData.data.colors.liteTheme, paddingBottom: insets.bottom }}>
          <SwaHeader title={"Assessment Generator"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
          <View style={{ flex: 1 }}>
            {/* header start */}
            <View style={{ backgroundColor: userData.data.colors.liteTheme, padding: 5, borderRadius: 6, margin: 10 }}>
              {/* <View style={{ flexDirection: 'row' }}>
                </View> */}
              <View style={{ width: '70%', padding: 2, flexDirection: 'row' }}>
                <Text style={{ color: SWATheam.SwaBlack, width: 120 }}>Subject</Text>
                <Text style={{ color: SWATheam.SwaBlack, width: 20 }}>:</Text>
                <Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>{subjectName}</Text>
              </View>
              <View style={{ width: '30%', padding: 2, flexDirection: 'row' }}>
                <Text style={{ color: SWATheam.SwaBlack, width: 120 }}>Class</Text>
                <Text style={{ color: SWATheam.SwaBlack, width: 20 }}>:</Text>
                <Text style={{ color: SWATheam.SwaBlack, }}>{selectedClass}</Text>
              </View>

              <View style={{ width: '70%', padding: 2, flexDirection: 'row' }}>
                <Text style={{ color: SWATheam.SwaBlack, width: 120 }}>Total Question</Text>
                <Text style={{ color: SWATheam.SwaBlack, width: 20 }}>:</Text>
                <Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>{totalAssQuestion}</Text>
              </View>
              <View style={{ width: '30%', padding: 2, flexDirection: 'row' }}>
                <Text style={{ color: SWATheam.SwaBlack, width: 120 }}>Total Marks</Text>
                <Text style={{ color: SWATheam.SwaBlack, width: 20 }}>:</Text>
                <Text style={{ color: SWATheam.SwaBlack, }}>{totalAssMarks}</Text>
              </View>
              {/* <View style={{ flexDirection: 'row' }}>
                </View> */}
              <View style={{ width: '90%', padding: 2, flexDirection: 'row' }}>
                <Text style={{ color: SWATheam.SwaBlack, width: 120 }}>Ass. Name</Text>
                <Text style={{ color: SWATheam.SwaBlack, width: 20 }}>:</Text>
                <Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>{assesssmentName}</Text>
              </View>
              <View style={{ padding: 2 }}>
                <TouchableOpacity onPress={() => { downloadAssPdf() }} style={{ alignSelf: "center", backgroundColor: '#cd5c5c', borderRadius: 4, padding: 8, marginTop: 6, width: '50%' }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>PDF</Text>
                </TouchableOpacity>
              </View>
              {/* <View style={{ flexDirection: 'row' }}>
                </View> */}
            </View>
            {/* header end */}
            <View style={{ flex: 1, borderRadius: 6, margin: 10, }}>
              <ScrollView>
                {generatedAssQuesList.map((item, index) => {
                  questionIDs.push(item.questionID)
                  return (
                    <View key={index}>
                      {item.activityID == 1 &&
                        <Mcq mcqData={item} index={index + 1} />
                      }
                      {item.activityID == 2 &&
                        <Tnf tnfData={item} index={index + 1} />
                      }
                      {item.activityID == 3 &&
                        <Fillup fillupData={item} index={index + 1} />
                      }
                      {item.activityID == 4 &&
                        < Match matchData={item} index={index + 1} />
                      }
                      {item.activityID == 9 &&
                        <Dnd dndData={item} index={index + 1} />
                      }
                      {item.activityID == 10 &&
                        <Jumbo jumboData={item} index={index + 1} />
                      }
                      {item.activityID == 12 &&
                        <Dd ddData={item} index={index + 1} />
                      }
                      {item.activityID == 15 &&
                        <Desc descData={item} index={index + 1} />
                      }
                    </View>

                  )
                })}
              </ScrollView>
            </View>

            <View style={{ flexDirection: 'row', bottom: 0, left: 0, right: 0, backgroundColor: userData.data.colors.hoverTheme }}>
              <TouchableOpacity onPress={() => { setIsAssign(true) }} style={{ flex: 1, padding: 10, margin: 4, borderRadius: 6, backgroundColor: userData.data.colors.mainTheme }}>
                <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Assign</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => {closePopup()}} style={{padding: 10, margin: 4, borderRadius: 6, backgroundColor: SWATheam.SwaRed}}>
          <Text style={{textAlign: 'center', color: SWATheam.SwaWhite, textTransform:'uppercase'}}>Close</Text>
        </TouchableOpacity> */}
            </View>
          </View>
          {isAssign &&
            <Modal
              animationType="slide"
              transparent={true}
            >
              <View style={styles.garyContainer}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { setIsAssign(false) }} />
                <View style={{ maxHeight: '60%', backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
                  <TouchableOpacity onPress={() => { setIsAssign(false) }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
                    <AntDesign name={"close"} size={25} style={{ width: 45 }} />
                  </TouchableOpacity>
                  <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Select Student</Text>
                  <ScrollView>
                    <View style={{ backgroundColor: "#efefef", padding: 8, margin: 4, borderRadius: 5 }}>

                      <TouchableOpacity style={styles.checkboxContainer} onPress={() => { checkChapAll(); }}>
                        {chapData.filter((item) => item.checked).length === chapData.length ?
                          <AntDesign name={"checksquareo"} size={16} style={{ width: 25, padding: 3 }} />
                          :
                          <Feather name={"square"} size={20} style={{ width: 25, padding: 1 }} />
                        }
                        <Text style={{ color: SWATheam.SwaBlack }}>Select All</Text>
                      </TouchableOpacity>

                      {chapData.map((item, index) => {
                        return (
                          <View key={index}>
                            <TouchableOpacity onPress={() => { checkChapOne(!item.checked, index); }} style={{ flexDirection: 'row', padding: 10, backgroundColor: SWATheam.SwaWhite, margin: 2, borderRadius: 6 }} >
                              {item.checked ?
                                <AntDesign name={"checksquareo"} size={16} style={{ width: 25, padding: 3 }} color={SWATheam.SwaBlack} />
                                :
                                <Feather name={"square"} size={20} style={{ width: 25, padding: 1 }} color={SWATheam.SwaBlack} />
                              }
                              <Text style={{ color: SWATheam.SwaBlack }}>{studentList[index].firstName} {studentList[index].lastName != "" ? studentList[index].lastName : ""}</Text>
                            </TouchableOpacity>
                          </View>
                        )
                      })}
                    </View>

                  </ScrollView>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { assignAssessmentToStudent() }} style={{ width: '50%', padding: 10, margin: 4, borderRadius: 6, backgroundColor: userData.data.colors.mainTheme }}>
                      <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { setIsAssign(false) }} />
              </View>

            </Modal>
          }
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  garyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  BtextClr: {
    color: SWATheam.SwaBlack
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6
  },
  inputNew: {
    height: 35,
    margin: 2,
    marginLeft: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },

  WtextClr: {
    color: SWATheam.SwaWhite
  },


  fwBold: {
    fontWeight: 500
  },

  AssignTeacherModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  selectFieldPopUp: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }

});