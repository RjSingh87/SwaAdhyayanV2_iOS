import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, FlatList, Platform } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Mcq from "./activity/mcq";
import Tnf from "./activity/tnf";
import Fillup from "./activity/fillup";
import Match from "./activity/match";
import Dnd from "./activity/Dnd";
import Jumbo from "./activity/Jumbo";
import Dd from "./activity/dd";
import Desc from "./activity/desc";
import { apiRoot, SWATheam } from "../../../constant/ConstentValue";
import { GlobleData } from "../../../Store";
import SwaHeader from "../../common/SwaHeader";
import Services from "../../../Services";
import Loader from "../../common/Loader";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";




var selectQuesMarksEdit = [];
var qID = "";
var selectedQuesIDsArray = []
export default function AssessGenerateQuesView({ navigation, route }) {
  const insets = useSafeAreaInsets()
  const { userData } = useContext(GlobleData)
  const [isEditMarks, setIsEditMarks] = useState(false)
  const [count, setCount] = useState(0)
  const [isLoader, setIsLoader] = useState(false);

  const assessmentQuestion = route.params.data
  const assQuestions = route.params.sendData.questionNo
  const assName = route.params.sendData.examName
  const selectedData = route.params.sendData

  const selectedQuesIDs = (questionID, marks) => {
    let qData = questionID + "|" + marks;
    let index = selectedQuesIDsArray.indexOf(qData);
    if (index == -1) {
      if (assQuestions <= selectedQuesIDsArray.length) {
        alert("You Can`t Add Question More Then " + JSON.stringify(assQuestions))
        return
      } else {
        selectedQuesIDsArray.push(qData);
      }
    } else {
      selectedQuesIDsArray.splice(index, 1);
    }
  }


  const assessmentGenerate = () => {
    setIsLoader(true)
    if (assQuestions != selectedQuesIDsArray.length) {
      alert("You Have to Add Minimum Question " + JSON.stringify(assQuestions))
      setIsLoader(false)
      return
    }
    if (selectQuesMarksEdit[0] != undefined) {
      selectedQuesIDsArray.map((item, index) => {
        let dd = item.split("|");
        selectQuesMarksEdit.map((item2, index2) => {
          let dd2 = item2.split("|")
          if (dd[0] == dd2[0]) {
            let mm = dd[0] + "|" + dd2[1];
            selectedQuesIDsArray[index] = mm;
          }
        })
      })
    }
    let classID = selectedData.selectedIds.classID;
    let sectionID = selectedData.selectedIds.sectionID.sectionID;
    let subjectID = selectedData.selectedIds.subjectID;
    let examID = selectedData.selectedIds.examID;
    let examName = selectedData.examName
    let examTypeID = selectedData.selectedIds.examTypeID;
    let totalQuesNo = selectedData.selectedIds.totalQuesNo;
    let chapterIDs = selectedData.chapterIDs;
    let bookIDs = selectedData.bookIDs;
    let quesTypeIDs = selectedData.quesTypeIDs;
    let quesLavelIDs = selectedData.quesLavelIDs;
    let startDate = selectedData.startDate;
    let endDate = selectedData.endDate;
    let fixTime = selectedData.fixTime;



    const payload = {
      "schoolCode": userData.data.schoolCode,
      "classID": classID,
      "bookID": bookIDs,
      "subjectID": subjectID,
      "noOfQuestion": totalQuesNo,
      "examID": examID == 15 ? "other" : examID,
      "AssName1": examID != 15 ? examName : "other",
      "assmentName2": examID == 15 ? examName : "",
      "sectionID": sectionID,
      "userRefID": userData.data.userRefID,
      "questionTypeIds": quesTypeIDs,
      "questionLevelIds": quesLavelIDs,
      "chapterIds": chapterIDs,
      "academicYear": userData.data.academicYear,
      "startDate": startDate,
      "endDate": endDate,
      "startTime": examTypeID == 2 ? fixTime : "",
      "hours": selectedData.hourData == 0 ? null : selectedData.hourData,
      "minutes": selectedData.minutData == 0 ? null : selectedData.minutData,
      "timeModuleType": examTypeID,
      "selectedQuestion": selectedQuesIDsArray
    }
    Services.post(apiRoot.generateAndViewAssessment, payload)
      .then((res) => {
        if (res.status == "success") {
          setIsLoader(false)
          // const data = res.data;
          // AssesssmentName = data.assName;
          // subjectName = data.subjectData[0].subjectNameLang1;
          // totalTime = data.totalTime;
          // totalAssMarks = data.totalMarks;
          // totalAssQuestion = data.noOfQuestion;
          // setGeneratedAssQuesList(data.questionData);
          // setStudentList(data.studentData);
          // assessID = data.assessmentID;

          alert("Assessment Generated successfully")
          // setViewGenerateQuestionList(false)

          navigation.navigate('queListAssGenerator', { data: res.data, selectedData: selectedData })



          // setAssignAsessment(true);
        } else {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIsLoader(false)
      })


  }

  function closePopup() {
    setIsEditMarks(false)
  }

  function editMarks(questionID) {
    qID = questionID
    setIsEditMarks(true)
  }

  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }

  function selectMarks(marks) {
    finalQData = qID + "|" + marks;
    if (selectQuesMarksEdit[0] != undefined && selectQuesMarksEdit.includes(finalQData) == true) {

      selectQuesMarksEdit.map((item, index) => {
        let dd = item.split("|");
        if (dd[1] != marks && dd[0] == qID) {
          selectQuesMarksEdit[index] = qID + "|" + marks;
        }
      })
    } else {
      selectQuesMarksEdit.map((item, index) => {
        let dd = item.split("|");
        if (dd[0] == qID) {
          selectQuesMarksEdit.splice(index, 1)
        }
      })
      selectQuesMarksEdit.push(finalQData)
    }
  }

  var totalMarks = [];
  let mData = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];

  mData.map((item, index) => {
    totalMarks.push(
      <View key={index}>
        <TouchableOpacity onPress={() => { setIsEditMarks(false); selectMarks(item); }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
          <Text style={{ color: SWATheam.SwaBlack }}>{item}</Text>
        </TouchableOpacity>
      </View>
    )
  })









  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'right', 'top',]} style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme }}>
        {isLoader ?
          <Loader /> :
          <View style={{ flex: 1, marginTop: Platform.OS == "ios" ? 0 : 24, paddingBottom: insets.bottom }}>
            <SwaHeader title={"Assessment Generator"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
            <View style={{ flex: 1, backgroundColor: SWATheam.SwaWhite }}>
              <View style={{ backgroundColor: userData.data.colors.mainTheme, padding: 8 }}>
                <View style={{ flexDirection: 'row', paddingBottom: 4, borderBottomWidth: .5, borderColor: userData.data.colors.liteTheme }}>
                  <View style={{ width: 120 }}>
                    <Text style={{ color: SWATheam.SwaWhite }}>
                      Selected Ques.
                    </Text>
                  </View>
                  <View style={{ width: 20 }}>
                    <Text style={{ color: SWATheam.SwaWhite }}>:
                    </Text>
                  </View>
                  <View style={{ flex: 1, }}>
                    <Text style={{ color: SWATheam.SwaWhite, }}>
                      {count}{"/" + assQuestions}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                  <View style={{ width: 120 }}>
                    <Text style={{ color: SWATheam.SwaWhite }}>
                      Ass. Name
                    </Text>
                  </View>
                  <View style={{ width: 20 }}>
                    <Text style={{ color: SWATheam.SwaWhite }}>:
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: SWATheam.SwaWhite }}>
                      {assName}
                    </Text>
                  </View>
                </View>
              </View>
              <FlatList
                data={assessmentQuestion}
                renderItem={({ item, index }) => {
                  return (
                    <View key={item.questionID}>
                      {item.activityID == 1 &&
                        <Mcq mcqData={item} editMarks={editMarks} selectedQuesIDs={selectedQuesIDs} selectedQuesIDsArray={selectedQuesIDsArray} index={index + 1} />
                      }
                      {item.activityID == 2 &&
                        <Tnf tnfData={item} editMarks={editMarks} selectedQuesIDs={selectedQuesIDs} selectedQuesIDsArray={selectedQuesIDsArray} index={index + 1} />
                      }
                      {item.activityID == 3 &&
                        <Fillup fillupData={item} editMarks={editMarks} selectedQuesIDs={selectedQuesIDs} selectedQuesIDsArray={selectedQuesIDsArray} index={index + 1} />
                      }
                      {item.activityID == 4 &&
                        < Match matchData={item} editMarks={editMarks} selectedQuesIDs={selectedQuesIDs} selectedQuesIDsArray={selectedQuesIDsArray} index={index + 1} />
                      }
                      {item.activityID == 9 &&
                        <Dnd dndData={item} editMarks={editMarks} selectedQuesIDs={selectedQuesIDs} selectedQuesIDsArray={selectedQuesIDsArray} index={index + 1} />
                      }
                      {item.activityID == 10 &&
                        <Jumbo jumboData={item} editMarks={editMarks} selectedQuesIDs={selectedQuesIDs} selectedQuesIDsArray={selectedQuesIDsArray} index={index + 1} />
                      }
                      {item.activityID == 12 &&
                        <Dd ddData={item} editMarks={editMarks} selectedQuesIDs={selectedQuesIDs} selectedQuesIDsArray={selectedQuesIDsArray} index={index + 1} />
                      }
                      {item.activityID == 15 &&
                        <Desc descData={item} editMarks={editMarks} selectedQuesIDs={selectedQuesIDs} selectedQuesIDsArray={selectedQuesIDsArray} index={index + 1} />
                      }
                    </View>
                  )
                }
                }
                keyExtractor={item => item.questionID}
              />
              <View style={{ flexDirection: 'row', bottom: 0, left: 0, right: 0, backgroundColor: userData.data.colors.hoverTheme }}>
                <TouchableOpacity onPress={() => { assessmentGenerate() }} style={{ flex: 1, padding: 10, margin: 4, borderRadius: 6, backgroundColor: userData.data.colors.mainTheme }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Generate Assessment</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ padding: 10, margin: 4, borderRadius: 6, backgroundColor: SWATheam.SwaRed }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
            {isEditMarks &&
              <View style={{
                position: 'absolute',
                top: 0, bottom: 0, right: 0, left: 0,
                paddingHorizontal: 30,
                zIndex: 999,
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }}>
                <TouchableOpacity style={{ flex: 1 }}
                  onPress={() => { closePopup() }}
                />
                <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
                  <TouchableOpacity onPress={() => { closePopup() }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
                    <AntDesign name={"close"} size={25} style={{ width: 45 }} />
                  </TouchableOpacity>
                  <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Marks Update</Text>
                  <ScrollView>
                    <View>
                      {totalMarks}
                    </View>
                  </ScrollView>

                </View>
                <TouchableOpacity style={{ flex: 1, }}
                  onPress={() => { closePopup() }}
                />
              </View>
            }
          </View>
        }
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
const styles = StyleSheet.create({
  garyContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
})