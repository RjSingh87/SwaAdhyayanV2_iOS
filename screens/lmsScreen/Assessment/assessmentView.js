import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, CheckBox, ScrollView, TouchableOpacity, TouchableHighlight, Alert, SafeAreaView } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import DatePicker from "react-native-date-picker";
import Loader from "../../common/Loader";
import { GlobleData } from "../../../Store";
import Services from "../../../Services";
import { SWATheam, apiRoot } from "../../../constant/ConstentValue";





var bookArguments = [];
var chapArguments = [];
var quesTypeArguments = [];
var quesLavelArguments = [];
var bookIdsArry = [];
var chapterIDsArray = [];
var quesTypeIdsArray = [];
var quesLavelIdsArray = [];
var subjName = "";
var examName = "";
var examTypeName = "";
var questionNo = "";
var qID = "";
var finalQData = "";
var selectQuesMarksEdit = [];
export default function AssessmentView({ navigation, editAss }) {

  const { userData } = useContext(GlobleData)
  const [classList, setClassList] = useState([])
  const [showSelectField1, SetShowSelectField1] = useState(false)
  const [selectedIds, setSelectedIds] = useState({ classID: "", sectionID: "", subjectID: "", examID: "", examTypeID: "", totalQuesNo: "" })
  const [sectionListData, setSectionListData] = useState([])
  const [subjectList, setSubjectList] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [bookChapterList, setBookChapterList] = useState([]);
  const [assesExamNameList, setAssesExamNameList] = useState([]);
  const [assessQuesTypeList, setAssessQuesTypeList] = useState([]);
  const [assessQuesLavelList, setAssessQuesLavelList] = useState([]);
  const [viewStatus, setViewStatus] = useState({ section: false, subject: false, book: false, chapter: false, examName: false, quesTypeList: false, quesLavel: false, examType: false, dateToDate: false, fixTime: false, totalTime: false, totalQuestion: false });
  const [otherAsessment, setOtherAsessment] = useState({ assessName: '', status: false })
  const [assessInputName, setAssessInputName] = useState('')
  const [isEditMarks, setIsEditMarks] = useState(false)
  const [isLoader, setIsLoader] = useState(false);
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [date2, setDate2] = useState(new Date())
  const [open2, setOpen2] = useState(false)
  const [date3, setDate3] = useState(new Date())
  const [open3, setOpen3] = useState(false)
  const [hourData, setHourData] = useState(0)
  const [minutData, setMinutData] = useState(0)
  const [data, setData] = useState(bookArguments);
  const [isChecked, setIsChecked] = useState(false);
  const [selectAll, setSelectAll] = useState(
    data.filter((item) => item.checked).length === data.length
  );

  const [chapData, setChapData] = useState(chapArguments);
  const [isChapChecked, setIsChapChecked] = useState(false);
  const [selectChapAll, setSelectChapAll] = useState(
    chapData.filter((item) => item.checked).length === chapData.length
  );

  const [QuesTypeData, setQuesTypeData] = useState(quesTypeArguments);
  const [isQuesTypeChecked, setIsQuesTypeChecked] = useState(false);

  const [QuesLavelData, setQuesLavelData] = useState(quesLavelArguments);
  const [isQuesLavelChecked, setIsQuesLavelChecked] = useState(false);

  useEffect(() => {
    const goBack = navigation.addListener('focus', () => {
      setSelectedIds({ classID: "", sectionID: "", subjectID: "", examID: "", examTypeID: "", totalQuesNo: "" });
      setHourData(0);
      setMinutData(0);
      bookArguments = [];
      chapArguments = [];
      quesTypeArguments = [];
      quesLavelArguments = [];
      bookIdsArry = [];
      chapterIDsArray = [];
      quesTypeIdsArray = [];
      quesLavelIdsArray = [];
      subjName = "";
      examName = "";
      examTypeName = "";
      questionNo = "";
      qID = "";
      finalQData = "";
      selectQuesMarksEdit = [];
      AssesssmentName = "";
      subjectName = "";
      totalTime = "";
      totalAssMarks = "";
      totalAssQuestion = "";
    });
    return goBack
  }, [navigation])

  const otherAssessmentShow = () => {
    setOtherAsessment((prev) => {
      return { ...prev, status: true }
    })
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

  const saveOtherAssessData = () => {
    if (assessInputName == "") {
      alert("Please enter Assessment Name");
      return;
    }
    setOtherAsessment((prev) => {
      return { ...prev, status: false, assessName: assessInputName }
    })
    setSelectedIds((prev) => {
      return { ...prev, examID: 15 }
    })
    setViewStatus((prev) => {
      return { ...prev, examName: false }
    })

    getAssessQuestType();
  }

  const saveTotalTimeData = () => {
    if (hourData == 0 && minutData == 0) {
      alert("Please Enter Exam Time");
      return;
    }
    setViewStatus((prev) => {
      return { ...prev, totalTime: false }
    })
  }

  const checkAll = () => {
    let newValue = data.filter((item) => item.checked).length === data.length;
    if (!newValue == false) {
      bookIdsArry = [];
    }
    let temp = data.map((item, key) => {
      if (!newValue == true) {
        let index1 = bookIdsArry.indexOf(bookList[key].bookID)
        if (index1 == -1) {
          bookIdsArry.push(bookList[key].bookID)
        } else {
          bookIdsArry.splice(index1, 1)
        }
      }
      return { ...item, checked: !newValue };
    });
    setData(temp);
  };
  const checkOne = (newValue, index) => {
    let index1 = bookIdsArry.indexOf(bookList[index].bookID)
    if (newValue) {
      if (index1 == -1) {
        bookIdsArry.push(bookList[index].bookID)
      } else {
        bookIdsArry.splice(index1, 1)
      }
    } else {
      bookIdsArry.splice(index1, 1)
    }
    let temp = data.map((item, i) => {
      return index === i ? { ...item, checked: newValue } : item;
    });
    setData(temp);
    setIsChecked(!isChecked);
  };

  const checkChapAll = () => {
    let newValue = chapData.filter((item) => item.checked).length === chapData.length;
    if (!newValue == false) {
      chapterIDsArray = [];
    }
    let temp = chapData.map((item, key) => {
      if (!newValue == true) {
        let index1 = chapterIDsArray.indexOf(bookChapterList[key].chapterID)
        if (index1 == -1) {
          chapterIDsArray.push(bookChapterList[key].chapterID)
        } else {
          chapterIDsArray.splice(index1, 1)
        }
      }
      return { ...item, checked: !newValue };
    });
    setChapData(temp);
    console.log(chapterIDsArray)
  };
  const checkChapOne = (newValue, index) => {
    let index1 = chapterIDsArray.indexOf(bookChapterList[index].chapterID)
    if (newValue) {
      if (index1 == -1) {
        chapterIDsArray.push(bookChapterList[index].chapterID)
      } else {
        chapterIDsArray.splice(index1, 1)
      }
    } else {
      chapterIDsArray.splice(index1, 1)
    }
    let temp = chapData.map((item, i) => {
      return index === i ? { ...item, checked: newValue } : item;
    });
    setChapData(temp);
    setIsChapChecked(!isChapChecked);
    console.log(chapterIDsArray)
  };


  const checkQuesTypeAll = () => {
    let newValue = QuesTypeData.filter((item) => item.checked).length === QuesTypeData.length;
    if (!newValue == false) {
      quesTypeIdsArray = [];
    }
    let temp = QuesTypeData.map((item, key) => {
      if (!newValue == true) {
        let index1 = quesTypeIdsArray.indexOf(assessQuesTypeList[key].activityID)
        if (index1 == -1) {
          quesTypeIdsArray.push(assessQuesTypeList[key].activityID)
        } else {
          quesTypeIdsArray.splice(index1, 1)
        }
      }
      return { ...item, checked: !newValue };
    });
    setQuesTypeData(temp);
    console.log(chapterIDsArray)
  };
  const checkQuesTypeOne = (newValue, index) => {
    let index1 = quesTypeIdsArray.indexOf(assessQuesTypeList[index].activityID)
    if (newValue) {
      if (index1 == -1) {
        quesTypeIdsArray.push(assessQuesTypeList[index].activityID)
      } else {
        quesTypeIdsArray.splice(index1, 1)
      }
    } else {
      quesTypeIdsArray.splice(index1, 1)
    }
    let temp = QuesTypeData.map((item, i) => {
      return index === i ? { ...item, checked: newValue } : item;
    });
    setQuesTypeData(temp);
    setIsQuesTypeChecked(!isChapChecked);
    console.log(chapterIDsArray)
  };

  const checkQuesLavelAll = () => {
    let newValue = QuesLavelData.filter((item) => item.checked).length === QuesLavelData.length;
    if (!newValue == false) {
      quesLavelIdsArray = [];
    }
    let temp = QuesLavelData.map((item, key) => {
      if (!newValue == true) {
        let index1 = quesLavelIdsArray.indexOf(assessQuesLavelList[key].eadID)
        if (index1 == -1) {
          quesLavelIdsArray.push(assessQuesLavelList[key].eadID)
        } else {
          quesLavelIdsArray.splice(index1, 1)
        }
      }
      return { ...item, checked: !newValue };
    });
    setQuesLavelData(temp);
    console.log(quesLavelIdsArray)
  };
  const checkQuesLavelOne = (newValue, index) => {
    let index1 = quesLavelIdsArray.indexOf(assessQuesLavelList[index].eadID)
    if (newValue) {
      if (index1 == -1) {
        quesLavelIdsArray.push(assessQuesLavelList[index].eadID)
      } else {
        quesLavelIdsArray.splice(index1, 1)
      }
    } else {
      quesLavelIdsArray.splice(index1, 1)
    }
    let temp = QuesLavelData.map((item, i) => {
      return index === i ? { ...item, checked: newValue } : item;
    });
    setQuesLavelData(temp);
    setIsQuesLavelChecked(!isChapChecked);
    console.log(quesLavelIdsArray)
  };


  useEffect(() => {
    // getAssessClassList();
  }, [])
  function getAssessClassList() {
    setIsLoader(true)
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "userTypeID": userData.data.userTypeID,
      "userRefID": userData.data.userRefID,
      "academicYear": userData.data.academicYear
    }
    Services.post(apiRoot.getAssessClassList, payload)
      .then((res) => {
        if (res.status == "success") {
          if (res.data[0] == undefined) {
            Alert.alert("Info!", "Assessment available only for class 1 to 8.")
            return
          }
          setIsLoader(false)
          SetShowSelectField1(true)
          const data = res.data
          setClassList(data)
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

  function showList(name) {
    if (name == "class") {
      // SetShowSelectField1(true)
      getAssessClassList();
    } else if (name == "section") {
      if (selectedIds.classID == "") {
        alert('Please select class.')
      } else {
        setViewStatus((prev) => {
          return { ...prev, "section": true }
        })
      }
    } else if (name == "subject") {
      if (selectedIds.classID == "" || selectedIds.sectionID == "") {
        alert('Please select section.')
      } else {
        setViewStatus((prev) => {
          return { ...prev, "subject": true }
        })
      }
    } else if (name == "book") {
      if (selectedIds.classID == "" || selectedIds.sectionID == "" || selectedIds.subjectID == "") {
        alert('Please select subject.')
      } else {
        setViewStatus((prev) => {
          return { ...prev, "book": true }
        })
      }
    } else if (name == "chapter") {

      if (bookIdsArry[0] == undefined) {
        alert("Please select book.")
      } else {
        setViewStatus((prev) => {
          return { ...prev, "chapter": true }
        })
      }
    } else if (name == "examName") {
      if (chapterIDsArray[0] == undefined) {
        alert("Please select chapter.")
      } else {
        setViewStatus((prev) => {
          return { ...prev, "examName": true }
        })
      }

    } else if (name == "quesTypeList") {
      if (examName == "") {
        alert("Please Enter Exam Name.")
      } else {
        setViewStatus((prev) => {
          return { ...prev, "quesTypeList": true }
        })
      }

    } else if (name == "quesLavel") {
      if (quesTypeIdsArray[0] == undefined) {
        alert("Please Select Question Type.")
      } else {
        setViewStatus((prev) => {
          return { ...prev, "quesLavel": true }
        })
      }

    } else if (name == "examType") {
      if (quesLavelIdsArray[0] == undefined) {
        alert("Please select Exam Level.")
      } else {
        setViewStatus((prev) => {
          return { ...prev, "examType": true }
        })
      }

    } else if (name == "totalTime") {
      if (examTypeName == "") {
        alert("Please select Exam Type.")
      } else {
        setViewStatus((prev) => {
          return { ...prev, "totalTime": true }
        })
      }

    } else if (name == "totalQuestion") {
      if (examTypeName == "") {
        alert("Please select Exam Type.")
      } else {
        setViewStatus((prev) => {
          return { ...prev, "totalQuestion": true }
        })
      }

    }

  }
  function classOptionSelect(classID, item) {
    // setSelectClassID((prev) => {
    //   return { ...prev, data: item, classID: classID }
    // })
    setSelectedIds((prev) => {
      return { ...prev, classID: classID, sectionID: "", subjectID: "", examID: "", examTypeID: "", totalQuesNo: "" }
    })
    bookIdsArry = [];
    chapterIDsArray = []
    quesTypeIdsArray = [];;
    quesLavelIdsArray = [];
    examName = ""
    examTypeName = ""
    questionNo = ""
    setHourData(0)
    setMinutData(0)
  }

  function getUserSectionList(classID) {
    setIsLoader(true)
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "classID": classID,
      "userTypeID": userData.data.userTypeID,
      "userRefID": userData.data.userRefID,
      "academicYear": userData.data.academicYear
    }

    Services.post(apiRoot.getSectionList, payload)
      .then((res) => {
        if (res.status == "success") {
          setIsLoader(false)
          const data = res.data
          setSectionListData(data)
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

  function getAssesSubjectList(sectionID) {
    setIsLoader(true)
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "classID": selectedIds.classID,
      "userTypeID": userData.data.userTypeID,
      "userRefID": userData.data.userRefID,
      "sectionID": sectionID,
      "academicYear": userData.data.academicYear
    }
    Services.post(apiRoot.getSubjectList, payload)
      .then((res) => {
        if (res.status == "success") {
          setIsLoader(false)
          const data = res.data
          setSubjectList(data)
        } else {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })
  }

  function getAssessBookList(subjectID) {
    setIsLoader(true)
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "classID": selectedIds.classID,
      "subjectID": subjectID,
      "isAssess": "1"
    }

    Services.post(apiRoot.getBooksList, payload)
      .then((res) => {
        if (res.status == "success") {
          setIsLoader(false)
          bookArguments = [];
          const data = res.data
          data.map((item, index) => {
            let dd = {
              'checked': false
            }
            bookArguments.push(dd)
          })
          setData(bookArguments)
          setBookList(data)
        } else {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })
  }

  function getBookChapterList() {
    setIsLoader(true)
    if (bookIdsArry[0] == undefined) {
      return
    }
    if (bookIdsArry.toString() == "") {
      alert("Please select Atleast one book")
      setIsLoader(false)
    }
    let subjectID = "";
    let bookIDs = bookIdsArry.toString();
    if (selectedIds.classID > 5 && bookIDs.indexOf(27) != -1) {
      subjectID = 7;
    } else if (selectedIds.classID > 5 && bookIDs.indexOf(30) != -1) {
      subjectID = 8;
    } else if (selectedIds.classID > 5 && bookIDs.indexOf(33) != -1) {
      subjectID = 9;
    } else {
      subjectID = selectedIds.subjectID
    }
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "classID": selectedIds.classID,
      "bookID": bookIdsArry.toString(),
      "subjectID": subjectID,
      "academicYear": userData.data.academicYear
    }
    Services.post(apiRoot.getBookChapterList, payload)
      .then((res) => {
        if (res.status == "success") {
          setIsLoader(false)
          chapArguments = [];
          const data = res.data
          data.map((item, index) => {
            let dd = {
              'checked': false
            }
            chapArguments.push(dd)
          })
          setChapData(chapArguments)
          setBookChapterList(data)
        } else {
          alert(res.message)
          setIsLoader(false)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })
  }

  function getAssessQuestType() {
    Services.post(apiRoot.getQuestionTypeList)
      .then((res) => {
        if (res.status == "success") {
          setIsLoader(false)
          quesTypeArguments = [];
          const data = res.data
          data.map((item, index) => {
            let dd = {
              'checked': false
            }
            quesTypeArguments.push(dd)
          })
          setQuesTypeData(quesTypeArguments)
          setAssessQuesTypeList(data)
        } else {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })
  }

  function getQuestionLavel() {
    setIsLoader(true)
    Services.post(apiRoot.getQuestionLavelList)
      .then((res) => {
        if (res.status == "success") {
          setIsLoader(false)
          quesLavelArguments = [];
          const data = res.data;
          data.map((item, index) => {
            let dd = {
              'checked': false
            }
            quesLavelArguments.push(dd)
          })
          setQuesLavelData(quesLavelArguments)
          setAssessQuesLavelList(data)
        } else {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })
  }
  function getExamName() {
    setIsLoader(true)
    Services.post(apiRoot.getAssessmentNameList)
      .then((res) => {
        if (res.status == "success") {
          setIsLoader(false)
          const data = res.data
          setAssesExamNameList(data)
        } else {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })

  }
  function setDataAndStatus(type, selectedID) {
    if (type == "section") {
      setViewStatus((prev) => {
        return { ...prev, section: false }
      })
      setSelectedIds((prev) => {
        return { ...prev, sectionID: selectedID, subjectID: "", examID: "", examTypeID: "", totalQuesNo: "" }
      })
      bookIdsArry = [];
      chapterIDsArray = []
      quesTypeIdsArray = [];;
      quesLavelIdsArray = [];
      examName = ""
      examTypeName = ""
      questionNo = ""
      setHourData(0)
      setMinutData(0)
    } else if (type == "subject") {
      setViewStatus((prev) => {
        return { ...prev, subject: false }
      })
      setSelectedIds((prev) => {
        return { ...prev, subjectID: selectedID, examID: "", examTypeID: "", totalQuesNo: "" }
      })
      bookIdsArry = [];
      chapterIDsArray = []
      quesTypeIdsArray = [];;
      quesLavelIdsArray = [];
      examName = ""
      examTypeName = ""
      questionNo = ""
      setHourData(0)
      setMinutData(0)

    } else if (type == "examName") {
      setViewStatus((prev) => {
        return { ...prev, examName: false }
      })

      setSelectedIds((prev) => {
        return { ...prev, examID: selectedID, examTypeID: "", totalQuesNo: "" }
      })
      quesTypeIdsArray = [];;
      quesLavelIdsArray = [];
      examTypeName = ""
      questionNo = ""
      setHourData(0)
      setMinutData(0)

      getAssessQuestType();
    } else if (type == "examType") {
      if (selectedID == 1) {
        setViewStatus((prev) => {
          return { ...prev, examType: false, dateToDate: true, fixTime: false }
        })
        questionNo = ""
        setHourData(0)
        setMinutData(0)
      } else {
        setViewStatus((prev) => {
          return { ...prev, examType: false, fixTime: true, dateToDate: false }
        })
      }

      setSelectedIds((prev) => {
        return { ...prev, examTypeID: selectedID, totalQuesNo: "" }
      })
      getAssessQuestType();
    } else if (type == "questNo") {
      setViewStatus((prev) => {
        return { ...prev, totalQuestion: false }
      })
      setSelectedIds((prev) => {
        return { ...prev, totalQuesNo: selectedID }
      })
    }
  }

  const getSelectedName = (type, selectedName) => {
    if (type == "subject") {
      subjName = selectedName;
    } else if (type == "examName") {
      examName = selectedName;
    } else if (type == "examType") {
      examTypeName = selectedName;
    } else if (type == "questionNo") {
      questionNo = selectedName;
    }
  }

  const getGeneratedAssessQuestion = () => {
    setIsLoader(true)
    let classID = selectedIds.classID;
    let sectionID = selectedIds.sectionID.sectionID;
    let subjectID = selectedIds.subjectID;
    let examID = selectedIds.examID;
    let examTypeID = selectedIds.examTypeID;
    let totalQuesNo = selectedIds.totalQuesNo;
    let chapterIDs = chapterIDsArray.toString();
    let bookIDs = bookIdsArry.toString();
    let quesTypeIDs = quesTypeIdsArray.toString();
    let quesLavelIDs = quesLavelIdsArray.toString();
    let startDate = date;
    let endDate = date2;
    let fixTime = date3;


    // let checkStartDate = startDate.getDay()+'/'+startDate.getMonth()+"/"+startDate.getFullYear()
    // let checkCurrentDate = currentData.now
    // let totalTime = hourData ? hourData : '00' + ":" + minutData ? minutData : '00';

    if (classID == "" || sectionID == "" || subjectID == "" || examID == "" || examTypeID == "" || totalQuesNo == ""
      || chapterIDs == "" || bookIDs == "" || quesTypeIDs == "" || quesLavelIDs == "" || startDate == "" || endDate == ""
      || fixTime == ""
    ) {
      alert("Please Fill All Required Field")
      setIsLoader(false)
    } else {
      const payload = {
        "schoolCode": userData.data.schoolCode,
        "classID": classID,
        "bookID": bookIDs,
        "subjectID": subjectID,
        "examID": examID,
        "AssName1": selectedIds.examID != 15 ? examName : "",
        "assmentName2": selectedIds.examID == 15 ? examName : "",
        "sectionID": sectionID,
        "questionTypeIds": quesTypeIDs,
        "questionLevelIds": quesLavelIDs,
        "chapterIds": chapterIDs,
        "academicYear": userData.data.academicYear
      }
      Services.post(apiRoot.getGeneratedAssessQuestion, payload)
        .then((res) => {
          if (res.status == "success") {
            setIsLoader(false)
            let sendData = {
              questionNo: questionNo,
              examName: examName,
              selectedIds: selectedIds,
              chapterIDs: chapterIDsArray.toString(),
              bookIDs: bookIdsArry.toString(),
              quesTypeIDs: quesTypeIdsArray.toString(),
              quesLavelIDs: quesLavelIdsArray.toString(),
              hourData: hourData,
              minutData: minutData
            }
            if (startDate != "") {
              let year = date.getFullYear();
              let mes = date.getMonth() + 1;
              let dia = date.getDate();
              sendData["startDate"] = year + "-" + mes + "-" + dia
            }
            if (endDate != "") {
              var year = date2.getFullYear();
              var mes = date2.getMonth() + 1;
              var dia = date2.getDate();
              sendData["endDate"] = year + "-" + mes + "-" + dia

            }
            if (fixTime != "") {
              var year = date3.getFullYear();
              var mes = date3.getMonth() + 1;
              var dia = date3.getDate();
              sendData["fixTime"] = year + "-" + mes + "-" + dia

            }
            console.log(sendData, 'sendData')
            navigation.navigate("assGenerateQueList", { data: res.questionData, sendData: sendData })
            const data = res.questionData
            // setAssessmentQuestion(data)
            // setViewGenerateQuestionList(true)
          } else {
            alert(res.message)
            setIsLoader(false)
          }

        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          setIsLoader(false)
        })

    }
  }

  // total Question loop start
  var totalQuestion = [];
  for (let i = 1; i <= 40; i++) {
    totalQuestion.push(
      <View key={i}>
        <TouchableOpacity onPress={() => { setDataAndStatus("questNo", i); getSelectedName('questionNo', i) }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
          <Text style={{ color: SWATheam.SwaBlack }}>{i}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  // total Question loop end

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

    <>
      {isLoader &&
        <Loader />
      }
      <Text style={{ borderBottomWidth: 1, padding: 8, color: SWATheam.SwaBlack, textAlign: "center" }}>
        {editAss.type == 'editAss' ? "Edit Assessment" : "Assessment Generator"}
      </Text>

      <View style={{ flex: 1, backgroundColor: '#efefef' }}>
        <View style={{ backgroundColor: SWATheam.SwaWhite, padding: 4, margin: 4, borderRadius: 6 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            {/* class div start  */}

            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('class')}
            >

              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {selectedIds.classID != undefined && selectedIds.classID != "" ?
                  <Text style={{ color: SWATheam.SwaBlack }}>Class: {selectedIds.classID}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Select Class</Text>
                }
              </View>
              <AntDesign name={"down"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* class Div end */}

            {/* Section div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('section')}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {selectedIds.sectionID != undefined && selectedIds.sectionID != "" ?
                  <Text style={{ color: SWATheam.SwaBlack }}>Section: {selectedIds.sectionID.sectionName}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Select Section</Text>
                }
              </View>

              <AntDesign name={"down"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* Section Div end */}
            {/* </View> */}

            {/* <View style={{ flexDirection: "row", backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}> */}
            {/* Subject div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('subject')}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {selectedIds.subjectID != "" ?
                  <Text style={{ color: SWATheam.SwaBlack }}>{subjName}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Select Subject</Text>
                }

              </View>

              <AntDesign name={"down"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* Subject Div end */}

            {/* Books div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('book')}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {bookIdsArry.length > 0 ?
                  <Text style={{ color: SWATheam.SwaBlack }}>Books Selected</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Select Books</Text>
                }
              </View>

              <AntDesign name={"down"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* Books Div end */}
            {/* </View> */}

            {/* <View style={{ flexDirection: "row", backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}> */}
            {/* Chapter div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('chapter')}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {chapterIDsArray.length > 0 ?
                  <Text style={{ color: SWATheam.SwaBlack }}>Chapter Selected</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Select Chapter</Text>
                }
              </View>

              <AntDesign name={"down"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* Chapter Div end */}

            {/* Exam Name div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('examName')}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {examName != "" ?
                  <Text style={{ color: SWATheam.SwaBlack }}>{examName}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Exam Name</Text>
                }

              </View>

              <AntDesign name={"down"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* Exam Name Div end */}
            {/* </View> */}

            {/* <View style={{ flexDirection: "row", backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}> */}
            {/* QuestionType div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('quesTypeList')}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {quesTypeIdsArray.length > 0 ?
                  <Text style={{ color: SWATheam.SwaBlack }}>Q.Type Selected</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Select Q.Type</Text>
                }
              </View>

              <AntDesign name={"down"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* QuestionType Div end */}

            {/* Lavel div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('quesLavel')}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {quesLavelIdsArray.length > 0 ?
                  <Text style={{ color: SWATheam.SwaBlack }}>Level Selected</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Level</Text>
                }

              </View>

              <AntDesign name={"down"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* Lavel Div end */}
            {/* </View> */}

            {/* <View style={{ flexDirection: "row", backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}>*/}
            {/* Exam Type div start*/}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('examType')}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {examTypeName != "" ?
                  <Text style={{ color: SWATheam.SwaBlack }}>{examTypeName}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Select Exam Type</Text>
                }

              </View>

              <AntDesign name={"down"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* ExamType Div end */}

            {/* Total Question div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('totalQuestion')}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {questionNo != "" ?
                  <Text style={{ color: SWATheam.SwaBlack }}>{questionNo}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Total Question</Text>
                }
              </View>

              <AntDesign name={"down"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* total Question Div end */}

            {/* </View> */}


            {/* <View style={{ flexDirection: "row", backgroundColor: "#fff" }}> */}
            {/* Start Date div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => { showList(''); setOpen(true) }}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {date ?
                  <Text style={{ color: SWATheam.SwaGray }}>{date.toDateString()}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Start Date</Text>
                }

              </View>

              <AntDesign name={"clockcircleo"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* Start Date Div end */}

            {viewStatus.dateToDate &&
              <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
                onPress={() => { showList(''); setOpen2(true) }}
              >
                <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                  {date2 ?
                    <Text style={{ color: SWATheam.SwaGray }}>{date2.toDateString()}</Text>
                    :
                    <Text style={{ color: SWATheam.SwaGray }}>End Date</Text>
                  }
                </View>
                <AntDesign name={"clockcircleo"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
              </TouchableOpacity>
            }

            {viewStatus.fixTime &&
              <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
                onPress={() => { showList(''); setOpen3(true) }}
              >
                <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                  {date3 ?
                    <Text style={{ color: SWATheam.SwaGray }}>{date3.toLocaleTimeString("en-US", { hour12: true })}</Text>
                    :
                    <Text>Start Time</Text>
                  }
                </View>

                <AntDesign name={"clockcircleo"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
              </TouchableOpacity>
            }
            {/* </View> */}

            {/* total question and time************* */}
            {/* <View style={{ flexDirection: "row", backgroundColor: "#fff" }}> */}

            {/* Lavel div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => { showList('totalTime'); }}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {(hourData == 0 && minutData == 0) ?
                  <Text style={{ color: SWATheam.SwaGray }}>Total Time</Text>
                  :
                  <Text style={{ color: SWATheam.SwaBlack }}>{hourData == 0 ? 0 : hourData} {minutData == 0 ? ": " + 0 : ": " + minutData} </Text>
                }
              </View>

              <AntDesign name={"clockcircleo"} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* Lavel Div end */}
          </View>

          <View style={{ borderBottomColor: SWATheam.SwaBlack, borderBottomWidth: 1, padding: 10, marginBottom: 5 }}></View>

          <TouchableOpacity onPress={() => { getGeneratedAssessQuestion() }} style={{ alignSelf: "flex-end", backgroundColor: userData.data.colors.mainTheme, borderRadius: 4, padding: 8, margin: 4, width: 120 }}>
            <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>SEARCH</Text>
          </TouchableOpacity>
        </View>
      </View>



      {open &&
        <DatePicker
          modal
          open={open}
          date={date}
          mode="date"
          onConfirm={(date) => {
            setOpen(false)
            setDate(date)
          }}
          onCancel={() => {
            setOpen(false)
          }}
        />
      }
      {open2 &&
        <DatePicker
          modal
          open={open2}
          date={date2}
          mode="date"
          onConfirm={(date) => {
            setOpen2(false)
            setDate2(date)
          }}
          onCancel={() => {
            setOpen2(false)
          }}
        />
      }

      {open3 &&
        <DatePicker
          modal
          open={open3}
          date={date3}
          mode="time"
          onConfirm={(date) => {
            setOpen3(false)
            setDate3(date)
          }}
          onCancel={() => {
            setOpen3(false)
          }}
        />
      }


      {showSelectField1 &&
        //<ShowList classList={classList} SetShowSelectField1={SetShowSelectField1} classOptionSelect={classOptionSelect} />
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => SetShowSelectField1(false)}
          />
          <View style={{ maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
              <View style={{ width: 45 }}></View>
              <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 6 }}>
                <Text style={{ textAlign: 'center', fontWeight: '500', color: SWATheam.SwaBlack, padding: 4 }}>Select Class</Text>

              </View>
              <TouchableOpacity style={{ width: 45, justifyContent: 'center', alignItems: 'center' }} onPress={() => SetShowSelectField1(false)}>
                <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} />
              </TouchableOpacity>

            </View>

            <ScrollView>
              {classList.map((item, index) => {
                return (

                  <View key={item.classID}>
                    <TouchableOpacity onPress={() => { SetShowSelectField1(false); classOptionSelect(item.classID, item); getUserSectionList(item.classID); }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                      <Text style={{ color: SWATheam.SwaBlack }}>Class: {userData.data.userTypeID == 2 ? item.ClassDesc : item.getClassDetail.classDesc}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </ScrollView>

          </View>
          <TouchableOpacity style={{ flex: 1 }}
            onPress={() => SetShowSelectField1(false)}
          />
        </View>
      }

      {viewStatus.section &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, section: false } })
            }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>

            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
              <View style={{ width: 45 }}></View>
              <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 6 }}>
                <Text style={{ textAlign: 'center', fontWeight: '500', color: SWATheam.SwaBlack, padding: 4 }}>Select Section</Text>

              </View>
              <TouchableOpacity style={{ width: 45, justifyContent: 'center', alignItems: 'center' }} onPress={() => { setViewStatus((prev) => { return { ...prev, section: false } }) }}>
                <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {sectionListData.map((item, index) => {

                return (
                  <View key={item.sectionID}>
                    <TouchableOpacity onPress={() => { setDataAndStatus("section", item); getAssesSubjectList(item.sectionID) }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                      <Text style={{ color: SWATheam.SwaBlack }}>Section: {item.sectionName}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </ScrollView>

          </View>
          <TouchableOpacity style={{ flex: 1 }}
            onPress={() => SetShowSelectField1(false)}
          />
        </View>
      }

      {viewStatus.subject &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, subject: false } })
            }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>

            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
              <View style={{ width: 45 }}></View>
              <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 6 }}>
                <Text style={{ textAlign: 'center', fontWeight: '500', color: SWATheam.SwaBlack, padding: 4 }}>Select Subject</Text>

              </View>
              <TouchableOpacity style={{ width: 45, justifyContent: 'center', alignItems: 'center' }} onPress={() => { setViewStatus((prev) => { return { ...prev, subject: false } }) }}>
                <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {subjectList.map((item, index) => {
                return (
                  <View key={item.subjectID}>
                    <TouchableOpacity onPress={() => { setDataAndStatus("subject", item.subjectID); getAssessBookList(item.subjectID); getSelectedName('subject', item.subjectName); }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                      <Text style={{ color: SWATheam.SwaBlack }}>Subject: {item.subjectName}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </ScrollView>

          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, subject: false } })
            }}
          />
        </View>
      }

      {viewStatus.book &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, book: false } })
            }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>

            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
              <View style={{ width: 45 }}></View>
              <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 6 }}>
                <Text style={{ textAlign: 'center', fontWeight: '500', color: SWATheam.SwaBlack, padding: 4 }}>Select Books</Text>

              </View>
              <TouchableOpacity style={{ width: 45, justifyContent: 'center', alignItems: 'center' }} onPress={() => { setViewStatus((prev) => { return { ...prev, book: false } }) }}>
                <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={{ backgroundColor: "#efefef", padding: 8, margin: 4, borderRadius: 5 }}>

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => { checkAll(); getBookChapterList(); }}>
                  {data.filter((item) => item.checked).length === data.length ?
                    <AntDesign name={"checksquareo"} color={SWATheam.SwaBlack} size={16} style={{ width: 25, padding: 3 }} />
                    :
                    <Feather name={"square"} size={20} color={SWATheam.SwaBlack} style={{ width: 25, padding: 1 }} />
                  }
                  <Text style={{ color: SWATheam.SwaBlack }}>Select All</Text>
                </TouchableOpacity>

                {data.map((item, index) => {
                  return (
                    <View key={bookList[index].bookID}>
                      <TouchableOpacity onPress={() => { setDataAndStatus("book", bookList[index].bookID); checkOne(!item.checked, index); getBookChapterList(); }} style={{ flexDirection: 'row', padding: 10, backgroundColor: SWATheam.SwaWhite, margin: 2, borderRadius: 6 }} >
                        {item.checked ?
                          <AntDesign name={"checksquareo"} size={16} color={SWATheam.SwaBlack} style={{ width: 25, padding: 3 }} />
                          :
                          <Feather name={"square"} size={20} color={SWATheam.SwaBlack} style={{ width: 25, padding: 1 }} />
                        }
                        <Text style={{ color: SWATheam.SwaBlack }}>Book: {bookList[index].bookName}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </View>
            </ScrollView>

          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, book: false } })
            }}
          />
        </View>
      }

      {viewStatus.chapter &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, chapter: false } })
            }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>

            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
              <View style={{ width: 45 }}></View>
              <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 6 }}>
                <Text style={{ textAlign: 'center', fontWeight: '500', color: SWATheam.SwaBlack, padding: 4 }}>Select Chapter</Text>

              </View>
              <TouchableOpacity style={{ width: 45, justifyContent: 'center', alignItems: 'center' }} onPress={() => { setViewStatus((prev) => { return { ...prev, chapter: false } }) }}>
                <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={{ backgroundColor: "#efefef", padding: 8, margin: 4, borderRadius: 5 }}>

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => { checkChapAll(); getExamName(); }}>
                  {chapData.filter((item) => item.checked).length === chapData.length ?
                    <AntDesign name={"checksquareo"} size={20} color={SWATheam.SwaBlack} style={{ width: 25, padding: 3 }} />
                    :
                    <Feather name={"square"} size={20} color={SWATheam.SwaBlack} style={{ width: 25, padding: 3 }} />
                  }
                  <Text style={{ color: SWATheam.SwaBlack }}>Select All</Text>
                </TouchableOpacity>

                {chapData.map((item, index) => {

                  return (
                    <View key={bookChapterList[index].chapterID}>
                      <TouchableOpacity onPress={() => { checkChapOne(!item.checked, index); getExamName(); }} style={{ flexDirection: 'row', padding: 10, backgroundColor: SWATheam.SwaWhite, margin: 2, borderRadius: 6 }} >
                        {item.checked ?
                          <AntDesign name={"checksquareo"} color={SWATheam.SwaBlack} size={20} style={{ width: 25, padding: 3 }} />
                          :
                          <Feather name={"square"} color={SWATheam.SwaBlack} size={20} style={{ width: 25, padding: 1 }} />
                        }
                        <Text style={{ color: SWATheam.SwaBlack }}>{bookChapterList[index].chapterName}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </View>
            </ScrollView>

          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, chapter: false } })
            }}
          />
        </View>
      }

      {viewStatus.examName &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, examName: false } })
            }}
          />
          <View style={{ height: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>

            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
              <View style={{ width: 45 }}></View>
              <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 6 }}>
                <Text style={{ textAlign: 'center', fontWeight: '500', color: SWATheam.SwaBlack, padding: 4 }}>Exam Name</Text>

              </View>
              <TouchableOpacity style={{ width: 45, justifyContent: 'center', alignItems: 'center' }} onPress={() => { setViewStatus((prev) => { return { ...prev, examName: false } }) }}>
                <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {assesExamNameList.map((item, index) => {
                return (
                  <View key={item.examID}>
                    <TouchableOpacity onPress={() => { setDataAndStatus("examName", item.examID); getSelectedName('examName', item.examName); }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                      <Text style={{ color: SWATheam.SwaBlack }}>{item.examName}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
              <View>
                <TouchableOpacity onPress={() => { otherAssessmentShow(); }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                  <Text style={{ color: SWATheam.SwaBlack }}>Other</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, examName: false } })
            }}
          />
        </View>
      }

      {otherAsessment.status &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setOtherAsessment((prev) => { return { ...prev, status: false } })
            }}
          />
          <View style={{ height: 170, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 10, borderRadius: 8 }}>

            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
              <View style={{ width: 45 }}></View>
              <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 6 }}>
                <Text style={{ textAlign: 'center', fontWeight: '500', color: SWATheam.SwaBlack, padding: 4 }}>Assessment Name</Text>
              </View>
              <TouchableOpacity style={{ width: 45, justifyContent: 'center', alignItems: 'center' }} onPress={() => { setOtherAsessment((prev) => { return { ...prev, status: false } }) }}>
                <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View>
                <TextInput
                  style={styles.input}
                  value={assessInputName}
                  onChangeText={setAssessInputName}
                  placeholder="Enter Assessment Name"
                  placeholderTextColor={SWATheam.SwaGray}
                />
                <TouchableOpacity onPress={() => { saveOtherAssessData(); getSelectedName(type = "examName", assessInputName) }} style={{ alignSelf: "center", backgroundColor: userData.data.colors.mainTheme, borderRadius: 4, padding: 8, margin: 4, width: 120 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setOtherAsessment((prev) => { return { ...prev, status: false } })
            }}
          />
        </View>
      }

      {viewStatus.quesTypeList &&
        // assessQuesTypeList
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, quesTypeList: false } })
            }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>


            <TouchableOpacity onPress={() => { setViewStatus((prev) => { return { ...prev, quesTypeList: false } }) }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Select Question Type</Text>
            <ScrollView>
              <View style={{ backgroundColor: "#efefef", padding: 8, margin: 4, borderRadius: 5 }}>

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => { checkQuesTypeAll(); getQuestionLavel(); }}>
                  {QuesTypeData.filter((item) => item.checked).length === QuesTypeData.length ?
                    <AntDesign name={"checksquareo"} color={SWATheam.SwaBlack} size={16} style={{ width: 25, padding: 3 }} />
                    :
                    <Feather name={"square"} color={SWATheam.SwaBlack} size={20} style={{ width: 25, padding: 1 }} />
                  }
                  <Text style={{ color: SWATheam.SwaBlack }}>Select All</Text>
                </TouchableOpacity>

                {QuesTypeData.map((item, index) => {
                  return (
                    <View key={assessQuesTypeList[index].activityID}>
                      <TouchableOpacity onPress={() => { checkQuesTypeOne(!item.checked, index); getQuestionLavel(); }} style={{ flexDirection: 'row', padding: 10, backgroundColor: SWATheam.SwaWhite, margin: 2, borderRadius: 6 }} >
                        {item.checked ?
                          <AntDesign name={"checksquareo"} color={SWATheam.SwaBlack} size={16} style={{ width: 25, padding: 3 }} />
                          :
                          <Feather name={"square"} color={SWATheam.SwaBlack} size={20} style={{ width: 25, padding: 1 }} />
                        }
                        <Text style={{ color: SWATheam.SwaBlack }}>{assessQuesTypeList[index].activityName}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </View>
            </ScrollView>

          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, quesTypeList: false } })
            }}
          />
        </View>
      }

      {viewStatus.quesLavel &&
        // assessQuesTypeList
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, quesLavel: false } })
            }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>

            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
              <View style={{ width: 45 }}></View>
              <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 6 }}>
                <Text style={{ textAlign: 'center', fontWeight: '500', color: SWATheam.SwaBlack, padding: 4 }}>Select Question Level</Text>
              </View>
              <TouchableOpacity style={{ width: 45, justifyContent: 'center', alignItems: 'center' }} onPress={() => { setViewStatus((prev) => { return { ...prev, quesLavel: false } }) }}>
                <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={{ backgroundColor: "#efefef", padding: 8, margin: 4, borderRadius: 5 }}>

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => { checkQuesLavelAll(); }}>
                  {QuesLavelData.filter((item) => item.checked).length === QuesLavelData.length ?
                    <AntDesign name={"checksquareo"} color={SWATheam.SwaBlack} size={16} style={{ width: 25, padding: 3 }} />
                    :
                    <Feather name={"square"} color={SWATheam.SwaBlack} size={20} style={{ width: 25, padding: 1 }} />
                  }
                  <Text style={{ color: SWATheam.SwaBlack }}>Select All</Text>
                </TouchableOpacity>

                {QuesLavelData.map((item, index) => {
                  return (
                    <View key={assessQuesLavelList[index].eadID}>
                      <TouchableOpacity onPress={() => { checkQuesLavelOne(!item.checked, index); }} style={{ flexDirection: 'row', padding: 10, backgroundColor: SWATheam.SwaWhite, margin: 2, borderRadius: 6 }} >
                        {item.checked ?
                          <AntDesign name={"checksquareo"} color={SWATheam.SwaBlack} size={16} style={{ width: 25, padding: 3 }} />
                          :
                          <Feather name={"square"} color={SWATheam.SwaBlack} size={20} style={{ width: 25, padding: 1 }} />
                        }
                        <Text style={{ color: SWATheam.SwaBlack }}>{assessQuesLavelList[index].eadCategory}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </View>
            </ScrollView>

          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, quesLavel: false } })
            }}
          />
        </View>
      }


      {viewStatus.examType &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, examType: false } })
            }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>

            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
              <View style={{ width: 45 }}></View>
              <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 6 }}>
                <Text style={{ textAlign: 'center', fontWeight: '500', color: SWATheam.SwaBlack, padding: 4 }}>Exam Type</Text>
              </View>
              <TouchableOpacity style={{ width: 45, justifyContent: 'center', alignItems: 'center' }} onPress={() => { setViewStatus((prev) => { return { ...prev, examType: false } }) }}>
                <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View>
                <TouchableOpacity onPress={() => { setDataAndStatus("examType", 1); getSelectedName('examType', 'Date To Date'); }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                  <Text style={{ color: SWATheam.SwaBlack }}>Date to Date</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setDataAndStatus("examType", 2); getSelectedName('examType', 'Fix Time'); }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                  <Text style={{ color: SWATheam.SwaBlack }}>Fix Time</Text>
                </TouchableOpacity>

              </View>
            </ScrollView>

          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, examType: false } })
            }}
          />
        </View>
      }

      {viewStatus.totalTime &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, totalTime: false } })
            }}
          />
          <View style={{ backgroundColor: SWATheam.SwaWhite, padding: 5, borderRadius: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: "auto", maxHeight: 300, width: '100%', padding: 14, borderRadius: 8 }}>
              <View style={{ width: '50%', padding: 8, backgroundColor: '#efefef', margin: 4, borderRadius: 5 }}>
                <Text style={{ padding: 1, color: SWATheam.SwaBlack, fontWeight: 'bold', marginLeft: 10 }}>Hours:</Text>
                <TextInput
                  style={styles.inputNew}
                  onChangeText={setHourData}
                  value={hourData}
                  placeholder="Enter Exam Hour"
                  placeholderTextColor={SWATheam.SwaGray}
                  keyboardType="number-pad"
                />
              </View>
              <View style={{ width: '50%', padding: 8, backgroundColor: '#efefef', margin: 4, borderRadius: 5 }}>
                <Text style={{ padding: 1, color: SWATheam.SwaBlack, margin: 1, fontWeight: 'bold', marginLeft: 10 }}>Minutes:</Text>
                <TextInput
                  style={styles.inputNew}
                  onChangeText={setMinutData}
                  value={minutData}
                  placeholder="Enter Exam Minutes"
                  placeholderTextColor={SWATheam.SwaGray}
                  keyboardType="number-pad"
                // type="number"
                />
              </View>
            </View>

            <TouchableOpacity onPress={() => { saveTotalTimeData() }} style={{ alignSelf: "center", backgroundColor: userData.data.colors.mainTheme, borderRadius: 4, padding: 8, margin: 4, width: 120 }}>
              <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>Submit</Text>
            </TouchableOpacity>

          </View>

          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, totalTime: false } })
            }}
          />
        </View>
      }

      {viewStatus.totalQuestion &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, totalQuestion: false } })
            }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>

            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
              <View style={{ width: 45 }}></View>
              <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 6 }}>
                <Text style={{ textAlign: 'center', fontWeight: '500', color: SWATheam.SwaBlack, padding: 4 }}>Total Question</Text>
              </View>
              <TouchableOpacity style={{ width: 45, justifyContent: 'center', alignItems: 'center' }} onPress={() => { setViewStatus((prev) => { return { ...prev, totalQuestion: false } }) }}>
                <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View>
                {totalQuestion}
              </View>
            </ScrollView>

          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, totalQuestion: false } })
            }}
          />
        </View>
      }
    </>
  )
}



const styles = StyleSheet.create({
  BtextClr: {
    color: SWATheam.SwaBlack
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    color: SWATheam.SwaBlack
  },
  inputNew: {
    height: 35,
    margin: 2,
    marginLeft: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    color: SWATheam.SwaBlack
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

