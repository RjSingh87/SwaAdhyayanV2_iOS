import React, { useEffect, useRef, useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import DatePicker from "react-native-date-picker";
import Loader from "../../common/Loader";
import { SWATheam, apiRoot } from "../../../constant/ConstentValue";
import { GlobleData } from "../../../Store";
import Services from "../../../Services";

var selectedQuesIDsArray = [];
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
var assessID = "";
var studentIDs = [];
assignArguments = [];

export default function AutoAssessmentGenerate() {
  const { userData } = useContext(GlobleData)
  const [classList, setClassList] = useState([])
  const [showSelectField1, SetShowSelectField1] = useState(false)
  const [selectedIds, setSelectedIds] = useState({ classID: "", sectionID: "", subjectID: "", examID: "", examTypeID: "", totalQuesNo: "", questionSet: "" })
  const [sectionListData, setSectionListData] = useState([])
  const [subjectList, setSubjectList] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [bookChapterList, setBookChapterList] = useState([]);
  const [assesExamNameList, setAssesExamNameList] = useState([]);
  const [assessQuesTypeList, setAssessQuesTypeList] = useState([]);
  const [assessQuesLavelList, setAssessQuesLavelList] = useState([]);
  const [viewStatus, setViewStatus] = useState({ section: false, subject: false, book: false, chapter: false, examName: false, quesTypeList: false, quesLavel: false, examType: false, dateToDate: false, fixTime: false, totalTime: false, totalQuestion: false, questSet: false });
  const [otherAsessment, setOtherAsessment] = useState({ assessName: '', status: false })
  const [assessInputName, setAssessInputName] = useState('')
  const [assessmentQuestion, setAssessmentQuestion] = useState([])
  const [isEditMarks, setIsEditMarks] = useState(false)
  const [studentList, setStudentList] = useState([]);
  const [assignAsessment, setAssignAsessment] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [isAssessQuesModel, setIsAssessQuesModel] = useState(false)
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [isQuestType, setIsQuestType] = useState(false)
  const [quesMarksWise, setQuesMarksWise] = useState([]);
  const [quesTypeWise, setQuesTypeWise] = useState([]);
  const [isMarksWise, setIsMarksWise] = useState(false)
  const [isTypeWise, setIsTypeWise] = useState(false)
  const [inputData, setInputData] = useState({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null })
  const [qWiseID, setQWiseID] = useState({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null })
  const [actTypeData, setActTypeData] = useState({ t1: null, t2: null, t3: null, t4: null, t5: null, t6: null, t7: null, q8: null })
  const [actTypeID, setActTypeID] = useState({ t1: null, t2: null, t3: null, t4: null, t5: null, t6: null, t7: null, q8: null })
  const [isAssign, setIsAssign] = useState(false);
  const [autoStuList, setAutoStuList] = useState(assignArguments);
  const [isAutoChapChecked, setIsAutoChapChecked] = useState(false);

  useEffect(() => {
    selectedQuesIDsArray = [];
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
    assessID = "";
    studentIDs = [];
  }, [])
  const checkStuListAll = () => {
    studentIDs = [];
    let newValue = autoStuList.filter((item) => item.checked).length === autoStuList.length;
    if (!newValue == false) {
      studentIDs = [];
    }
    let temp = autoStuList.map((item, index) => {
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
    setAutoStuList(temp);
  };
  const checkStuListOne = (newValue, index) => {
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
    let temp = autoStuList.map((item, i) => {
      return index === i ? { ...item, checked: newValue } : item;
    });
    setAutoStuList(temp);
    setIsAutoChapChecked(!isAutoChapChecked);
  };

  const [date2, setDate2] = useState(new Date())
  const [open2, setOpen2] = useState(false)
  const [date3, setDate3] = useState(new Date())
  const [open3, setOpen3] = useState(false)
  const [hourData, setHourData] = useState(0)
  const [minutData, setMinutData] = useState(0)
  const [data, setData] = useState(bookArguments);
  const [isChecked, setIsChecked] = useState(false);

  const [chapData, setChapData] = useState(chapArguments);
  const [isChapChecked, setIsChapChecked] = useState(false);
  const [QuesTypeData, setQuesTypeData] = useState(quesTypeArguments);
  const [isQuesTypeChecked, setIsQuesTypeChecked] = useState(false);
  const [QuesLavelData, setQuesLavelData] = useState(quesLavelArguments);
  const [isQuesLavelChecked, setIsQuesLavelChecked] = useState(false);

  useEffect(() => {
    getAssessClassList();
  }, [])
  const otherAssessmentShow = () => {
    setOtherAsessment((prev) => {
      return { ...prev, status: true }
    })
  }
  var quesWiseID = [];
  let totalQues = 0;
  let apiUrl = "";
  const generateAutoAssSubmit = (type) => {

    if (type == "marksWise") {

      apiUrl = apiRoot.submitAutoAssessMarksWise;
      for (var key in inputData) {
        if (inputData.hasOwnProperty(key)) {
          let dd = inputData[key] == null ? 0 : inputData[key];
          totalQues = totalQues + parseInt(dd);
          let mark = qWiseID[key];
          if (dd != null && dd != "") {
            let ddMake = mark + "_" + dd;
            quesWiseID.push(ddMake);
          }
        }
      }
    } else {
      apiUrl = apiRoot.submitAutoAssessTypeWise;
      for (var key in actTypeData) {
        if (actTypeData.hasOwnProperty(key)) {
          let dd = actTypeData[key];
          totalQues = totalQues + dd;
          let typeID = actTypeID[key];
          if (dd != null && dd != "") {
            let ddMake = typeID + "_" + dd;
            quesWiseID.push(ddMake);
          }
        }
      }
    }

    let classID = selectedIds.classID;
    let sectionID = selectedIds.sectionID.sectionID;
    let subjectID = selectedIds.subjectID;
    let examID = selectedIds.examID;
    let questSetID = selectedIds.questionSet;
    let examTypeID = selectedIds.examTypeID;
    let chapterIDs = chapterIDsArray.toString();
    let bookIDs = bookIdsArry.toString();
    let quesTypeIDs = selectedIds.questionSet == 2 ? quesTypeIdsArray.toString() : "";
    let quesLavelIDs = quesLavelIdsArray.toString();
    let startDate = date;
    let endDate = date2;
    let fixTime = date3;

    if (classID == "" || sectionID == "" || subjectID == "" || examTypeID == "" || questSetID == "" ||
      chapterIDs == "" || bookIDs == "" || quesLavelIDs == "" || startDate == "" || endDate == ""
    ) {
      alert("Please Fill All Required Field")
    } else {
      let sDate = "";
      let eDate = "";

      if (startDate != "") {
        var year = startDate.getFullYear();
        var mes = startDate.getMonth() + 1;
        var dia = startDate.getDate();
        sDate = year + "-" + mes + "-" + dia;
      }
      if (endDate != "") {
        var year = endDate.getFullYear();
        var mes = endDate.getMonth() + 1;
        var dia = endDate.getDate();
        eDate = year + "-" + mes + "-" + dia;
      }

      setIsLoader(true)
      const payload = {
        "schoolCode": userData.data.schoolCode,
        "classID": classID,
        "bookIDs": bookIDs,
        "subjectID": subjectID,
        "quesSet": questSetID,
        "assessmentName": examName,
        "sectionID": sectionID,
        "timeModule": hourData + "h" + ":" + minutData + "m",
        "noOfQuestion": totalQues,
        "examDate": "",
        "asmtTime": hourData + ":" + minutData + ":" + 0,
        "questionData": quesWiseID.toString(),
        "chapterIDs": chapterIDs,
        "startDate": sDate,
        "endDate": eDate,
        "startTime": "",
        "levelIDs": quesLavelIDs,
        "academicYear": userData.data.academicYear,
        "userRefID": userData.data.userRefID
      }

      Services.post(apiRoot.submitAutoAssessMarksWise, payload)
        .then((res) => {
          if (res.status == "success") {
            setIsLoader(false)
            const data = res.data;
            data.studentData.map((item, index) => {
              let dd = {
                'checked': false
              }
              assignArguments.push(dd)

            })
            AssesssmentName = data.assName;
            setStudentList(data.studentData);
            assessID = data.asmtID;
            setIsTypeWise(false)
            setIsMarksWise(false)
            setIsAssign(true);
            alert("Assessment Generated successfully")

          } else {
            setIsLoader(false)
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
  }
  const setInputValue = (index, value, totalQues, marks) => {
    if (value > totalQues) {
      alert("Entered Question's Not Greater than:  " + totalQues)
      return
    }
    if (index == 1) {
      setInputData((prev) => {
        return { ...prev, q1: value }
      })
      setQWiseID((prev) => {
        return { ...prev, q1: marks }
      })
    } else if (index == 2) {
      setInputData((prev) => {
        return { ...prev, q2: value }
      })
      setQWiseID((prev) => {
        return { ...prev, q2: marks }
      })
    } else if (index == 3) {
      setInputData((prev) => {
        return { ...prev, q3: value }
      })
      setQWiseID((prev) => {
        return { ...prev, q3: marks }
      })
    } else if (index == 4) {
      setInputData((prev) => {
        return { ...prev, q4: value }
      })
      setQWiseID((prev) => {
        return { ...prev, q4: marks }
      })
    } else if (index == 5) {
      setInputData((prev) => {
        return { ...prev, q5: value }
      })
      setQWiseID((prev) => {
        return { ...prev, q5: marks }
      })
    } else if (index == 6) {
      setInputData((prev) => {
        return { ...prev, q6: value }
      })
      setQWiseID((prev) => {
        return { ...prev, q6: marks }
      })
    } else if (index == 7) {
      setInputData((prev) => {
        return { ...prev, q7: value }
      })
      setQWiseID((prev) => {
        return { ...prev, q7: marks }
      })
    } else if (index == 8) {
      setInputData((prev) => {
        return { ...prev, q8: value }
      })
      setQWiseID((prev) => {
        return { ...prev, q8: marks }
      })
    }
  }

  const setQuesTypeValue = (index, value, totalQues, activityID) => {

    if (value > totalQues) {
      alert("Entered Question's Not Greater than:  " + totalQues)
      return
    }
    if (index == 1) {
      setActTypeData((prev) => {
        return { ...prev, t1: value }
      })
      setActTypeID((prev) => {
        return { ...prev, t1: activityID }
      })
    } else if (index == 2) {
      setActTypeData((prev) => {
        return { ...prev, t2: value }
      })
      setActTypeID((prev) => {
        return { ...prev, t2: activityID }
      })
    } else if (index == 3) {
      setActTypeData((prev) => {
        return { ...prev, t3: value }
      })
      setActTypeID((prev) => {
        return { ...prev, t3: activityID }
      })
    } else if (index == 4) {
      setActTypeData((prev) => {
        return { ...prev, t4: value }
      })
      setActTypeID((prev) => {
        return { ...prev, t4: activityID }
      })
    } else if (index == 5) {
      setActTypeData((prev) => {
        return { ...prev, t5: value }
      })
      setActTypeID((prev) => {
        return { ...prev, t5: activityID }
      })
    } else if (index == 6) {
      setActTypeData((prev) => {
        return { ...prev, t6: value }
      })
      setActTypeID((prev) => {
        return { ...prev, t6: activityID }
      })
    } else if (index == 7) {
      setActTypeData((prev) => {
        return { ...prev, t7: value }
      })
      setActTypeID((prev) => {
        return { ...prev, t7: activityID }
      })
    } else if (index == 8) {
      setActTypeData((prev) => {
        return { ...prev, t8: value }
      })
      setActTypeID((prev) => {
        return { ...prev, t8: activityID }
      })
    }
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
    console.log(selectQuesMarksEdit)
  }

  function editMarks(questionID) {
    qID = questionID
    setIsEditMarks(true)
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
    chapterIDsArray = [], quesLavelIdsArray = []
    setHourData(0), setMinutData(0)
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


  function getAssessClassList() {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "userTypeID": userData.data.userTypeID,
      "userRefID": userData.data.userRefID,
      "academicYear": userData.data.academicYear
    }

    Services.post(apiRoot.getAssessClassList, payload)
      .then((res) => {
        if (res.status == "success") {
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

      })
  }

  function showList(name) {

    if (name == "class") {
      SetShowSelectField1(true)
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
    } else if (name == "questionSet") {
      setViewStatus((prev) => {
        return { ...prev, "questSet": true }
      })
    } else if (name == "quesTypeList") {
      setViewStatus((prev) => {
        return { ...prev, "quesTypeList": true }
      })
    } else if (name == "quesLavel") {
      setViewStatus((prev) => {
        return { ...prev, "quesLavel": true }
      })
    } else if (name == "examType") {
      setViewStatus((prev) => {
        return { ...prev, "examType": true }
      })
    } else if (name == "totalTime") {
      setViewStatus((prev) => {
        return { ...prev, "totalTime": true }
      })
    } else if (name == "totalQuestion") {
      setViewStatus((prev) => {
        return { ...prev, "totalQuestion": true }
      })
    }

  }
  function classOptionSelect(classID, item) {
    // setSelectClassID((prev) => {
    //   return { ...prev, data: item, classID: classID }
    // })
    setSelectedIds((prev) => {
      return { ...prev, classID: classID, sectionID: "", subjectID: "", examID: "", examTypeID: "", totalQuesNo: "", questionSet: "" }
    })
    subjName = "", examName = "", examTypeName = "",
      bookIdsArry = [], chapterIDsArray = [], quesLavelIdsArray = []
    setHourData(0), setMinutData(0)
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
        setIsLoader(false)
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
        setIsLoader(false)
      })
  }

  function getBookChapterList() {
    if (bookIdsArry[0] == undefined) {
      return
    }
    if (bookIdsArry.toString() == "") {
      alert("Please select Atleast one book")
      setIsLoader(false)
    }
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "classID": selectedIds.classID,
      "bookID": bookIdsArry.toString(),
      "subjectID": selectedIds.subjectID,
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
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIsLoader(false)
      })
  }

  function getAssessQuestType() {
    setIsLoader(true)
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
        setIsLoader(false)
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
        setIsLoader(false)
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
        setIsLoader(false)
      })
  }
  function setDataAndStatus(type, selectedID) {
    if (type == "section") {
      setViewStatus((prev) => {
        return { ...prev, section: false }
      })
      setSelectedIds((prev) => {
        return { ...prev, sectionID: selectedID, subjectID: "", examID: "", examTypeID: "", totalQuesNo: "", questionSet: "" }
      })
      subjName = "", examName = "", examTypeName = "",
        bookIdsArry = [], chapterIDsArray = [], quesLavelIdsArray = [],
        setHourData(0), setMinutData(0)


    } else if (type == "subject") {
      setViewStatus((prev) => {
        return { ...prev, subject: false }
      })
      setSelectedIds((prev) => {
        return { ...prev, subjectID: selectedID, examID: "", examTypeID: "", totalQuesNo: "", questionSet: "" }
      })
      examName = "", examTypeName = "",
        bookIdsArry = [], chapterIDsArray = [], quesLavelIdsArray = [],
        setHourData(0), setMinutData(0)
    } else if (type == "examName") {
      setViewStatus((prev) => {
        return { ...prev, examName: false }
      })
      setSelectedIds((prev) => {
        return { ...prev, examID: selectedID, examTypeID: "", totalQuesNo: "", questionSet: "" }
      })
      getAssessQuestType();
    } else if (type == "questNo") {
      setViewStatus((prev) => {
        return { ...prev, totalQuestion: false }
      })
      setSelectedIds((prev) => {
        return { ...prev, totalQuesNo: selectedID, questionSet: "" }
      })
    } else if (type == "questSet") {
      setViewStatus((prev) => {
        return { ...prev, questSet: false }
      })
      setSelectedIds((prev) => {
        return { ...prev, questionSet: selectedID }
      })
    }
    else if (type == "examType") {
      if (selectedID == 1) {
        setViewStatus((prev) => {
          return { ...prev, examType: false, dateToDate: true, fixTime: false }
        })
      } else {
        setViewStatus((prev) => {
          return { ...prev, examType: false, fixTime: true, dateToDate: false }
        })
      }

      setSelectedIds((prev) => {
        return { ...prev, examTypeID: selectedID, totalQuesNo: "", }
      })
      getAssessQuestType();
    }
  }

  const getSelectedName = (type, selectedName) => {
    if (type == "subject") {
      subjName = selectedName;
    } else if (type == "examName") {
      examName = selectedName;
      setSelectedIds((prev) => {
        return { ...prev, examID: "", examTypeID: "", totalQuesNo: "", questionSet: "" }
      })
      examTypeName = "",
        quesLavelIdsArray = [],
        setHourData(0), setMinutData(0)
    } else if (type == "examType") {
      examTypeName = selectedName;
    } else if (type == "questionNo") {
      questionNo = selectedName;
    }
  }

  const getGeneratedAssessQuestion = () => {

    // setIsAssessQuesModel(true);
    // return

    let classID = selectedIds.classID;
    let sectionID = selectedIds.sectionID.sectionID;
    let subjectID = selectedIds.subjectID;
    let examID = selectedIds.examID;
    let questSetID = selectedIds.questionSet;
    let examTypeID = selectedIds.examTypeID;
    let chapterIDs = chapterIDsArray.toString();
    let bookIDs = bookIdsArry.toString();
    let quesTypeIDs = selectedIds.questionSet == 2 ? quesTypeIdsArray.toString() : "";
    let quesLavelIDs = quesLavelIdsArray.toString();
    let startDate = date;
    let endDate = date2;
    let fixTime = date3;
    let currentDate = new Date()
    // let totalTime = hourData ? hourData : '00' + ":" + minutData ? minutData : '00';

    if (classID == "" || sectionID == "" || subjectID == "" || examTypeID == "" || questSetID == "" ||
      chapterIDs == "" || bookIDs == "" || quesLavelIDs == "" || startDate == "" || endDate == ""
    ) {
      alert("Please Fill All Required Field")
    } else if (questSetID == 2 && quesTypeIDs == "") {
      alert("Please Fill All Required Field")
      setIsLoader(false)
    } else {
      setIsLoader(true)
      const payload = {
        "schoolCode": userData.data.schoolCode,
        "classID": classID,
        "bookIDs": bookIDs,
        "subjectID": subjectID,
        "quesSet": questSetID,
        "asmtName": examName,
        "sectionID": sectionID,
        "quesType": quesTypeIDs,
        "questionLevelIds": quesLavelIDs,
        "chapterIDs": chapterIDs,
        "examType": examTypeID,
        "startDate": startDate,
        "endDate": endDate,
        "startTime": examTypeID == 2 ? fixTime : "",
        "examHrs": hourData == 0 ? "" : hourData,
        "examMin": minutData == 0 ? "" : minutData,
        "levelIDs": quesLavelIDs,
        "academicYear": userData.data.academicYear
      }
      Services.post(apiRoot.autoAssessmentGenerateQuest, payload)
        .then((res) => {
          if (res.status == "success") {
            setQuesMarksWise([]);
            setQuesTypeWise([]);
            setIsLoader(false)
            setIsAssessQuesModel(true);
            const data = res.data;
            if (questSetID == 1) {
              setQuesMarksWise(data);
              setIsMarksWise(true)
            } else {
              setQuesTypeWise(data);
              setIsTypeWise(true)
            }
          } else {
            alert(res.message)
            setIsLoader(false)
          }
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

  // const assessmentGenerate = () => {

  //   if (questionNo != selectedQuesIDsArray.length) {
  //     alert("You Have to Add Minimum Question " + JSON.stringify(questionNo))
  //     return
  //   }
  //   if (selectQuesMarksEdit[0] != undefined) {
  //     selectedQuesIDsArray.map((item, index) => {
  //       let dd = item.split("|");
  //       selectQuesMarksEdit.map((item2, index2) => {
  //         let dd2 = item2.split("|")
  //         if (dd[0] == dd2[0]) {
  //           let mm = dd[0] + "|" + dd2[1];
  //           selectedQuesIDsArray[index] = mm;
  //         }
  //       })
  //     })
  //   }
  //   let classID = selectedIds.classID;
  //   let sectionID = selectedIds.sectionID;
  //   let subjectID = selectedIds.subjectID;
  //   let examID = selectedIds.examID;
  //   let examTypeID = selectedIds.examTypeID;
  //   let totalQuesNo = selectedIds.totalQuesNo;
  //   let chapterIDs = chapterIDsArray.toString();
  //   let bookIDs = bookIdsArry.toString();
  //   let quesTypeIDs = quesTypeIdsArray.toString();
  //   let quesLavelIDs = quesLavelIdsArray.toString();
  //   let startDate = date;
  //   let endDate = date2;
  //   let fixTime = date3;
  //   let sDate = "";
  //   let eDate = "";
  //   if (startDate != "") {
  //     var year = startDate.getFullYear();
  //     var mes = startDate.getMonth() + 1;
  //     var dia = startDate.getDate();
  //     sDate = year + "-" + mes + "-" + dia;
  //   }
  //   if (endDate != "") {
  //     var year = endDate.getFullYear();
  //     var mes = endDate.getMonth() + 1;
  //     var dia = endDate.getDate();
  //     eDate = year + "-" + mes + "-" + dia;
  //   }

  //   const payload = {
  //    "schoolCode": "SWA168760583",
  //       "classID": classID,
  //       "bookID": bookIDs,
  //       "subjectID": subjectID,
  //       "noOfQuestion": totalQuesNo,
  //       "examID": examID == 15 ? "other" : examID,
  //       "AssName1": selectedIds.examID != 15 ? examName : "other",
  //       "assmentName2": selectedIds.examID == 15 ? examName : "",
  //       "sectionID": sectionID,
  //       "userRefID": userData.data.userRefID,
  //       "questionTypeIds": quesTypeIDs,
  //       "questionLevelIds": quesLavelIDs,
  //       "chapterIds": chapterIDs,
  //       "academicYear": userData.data.academicYear,
  //       "startDate": sDate,
  //       "endDate": eDate,
  //       "startTime": examTypeID == 2 ? fixTime : "",
  //       "hours": hourData == 0 ? "" : hourData,
  //       "minutes": minutData == 0 ? "" : minutData,
  //       "timeModuleType": examTypeID,
  //       "selectedQuestion": selectedQuesIDsArray
  //   }
  //   Services.post(apiRoot.generateAndViewAssessment, payload)
  //   .then((res)=>{
  //     if (res.status == "success") {
  //       const data = res.data;
  //       AssesssmentName = data.assName;
  //       subjectName = data.subjectData[0].subjectNameLang1;
  //       totalTime = data.totalTime;
  //       totalAssMarks = data.totalMarks;
  //       totalAssQuestion = data.noOfQuestion;
  //       setGeneratedAssQuesList(data.questionData);
  //       setStudentList(data.studentData);
  //       assessID = data.assessmentID;
  //       setAssignAsessment(true);
  //       alert("Assessment Generated successfully")
  //     } else {
  //       alert(res.message)
  //     }
  //   })
  // }

  const assignAssessmentToStudent = () => {
    console.log(assessID)
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
          setAssignAsessment(false)
          setAssessmentQuestion([])
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

  return (

    <>
      {isLoader &&
        <Loader />
      }

      <Text style={{ borderBottomWidth: 1, padding: 8, color: SWATheam.SwaBlack, textAlign: "center" }}>
        Auto Assessment Generator
      </Text>


      <View style={{ flex: 1, backgroundColor: '#efefef' }}>
        <View style={{ backgroundColor: SWATheam.SwaWhite, padding: 2, borderRadius: 6 }}>

          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            {/* class div start  */}

            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('class')}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {selectedIds.classID != '' ?
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
                {selectedIds.sectionID != '' ?
                  <Text style={{ color: SWATheam.SwaBlack }}>Section: {selectedIds.sectionID.sectionName}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Select Section</Text>
                }
              </View>

              <AntDesign name={"down"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* Section Div end */}
            {/* </View> */}

            {/* <View style={{ flexDirection: "row", backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}> */}
            {/* Subject div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('subject')}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {subjName != "" ?
                  <Text style={{ color: SWATheam.SwaBlack }}>{subjName}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Select Subject</Text>
                }

              </View>

              <AntDesign name={"down"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
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

              <AntDesign name={"down"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
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

              <AntDesign name={"down"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* Chapter Div end */}

            {/* Exam Name div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => { otherAssessmentShow(); }}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {examName != "" ?
                  <Text style={{ color: SWATheam.SwaBlack }}>{examName}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Assessment Name</Text>
                }

              </View>

              <AntDesign name={"down"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* Exam Name Div end */}
            {/* </View> */}

            {/* <View style={{ flexDirection: "row", backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}> */}
            {/* question set div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => { showList('questionSet') }}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {selectedIds.questionSet != "" ?
                  <Text style={{ color: SWATheam.SwaBlack }}>{selectedIds.questionSet == 1 ? "Marks Wise" : "Question Type Wise"}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Question Set</Text>
                }

              </View>

              <AntDesign name={"down"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* question set Div end */}

            {/* QuestionType div start  */}
            {isQuestType &&
              <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
                onPress={() => showList('quesTypeList')}
              >
                <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                  {quesTypeIdsArray.length > 0 ?
                    <Text style={{ color: SWATheam.SwaBlack }}>QuestionType Selected</Text>
                    :
                    <Text style={{ color: SWATheam.SwaGray }}>Select QuestionType</Text>
                  }
                </View>

                <AntDesign name={"down"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
              </TouchableOpacity>
            }

            {/* QuestionType Div end */}

            {/* </View> */}

            {/* <View style={{ flexDirection: "row", backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}> */}
            {/* Exam Type div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
              onPress={() => showList('examType')}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {examTypeName != "" ?
                  <Text style={{ color: SWATheam.SwaBlack }}>{examTypeName}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Select ExamType</Text>
                }

              </View>

              <AntDesign name={"down"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* ExamType Div end */}

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

              <AntDesign name={"down"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
            </TouchableOpacity>
            {/* Lavel Div end */}

            {/* </View> */}


            {/* <View style={{ flexDirection: "row", backgroundColor: "#fff" }}> */}
            {/* Start Date div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, marginTop: 2 }}
              onPress={() => { showList(''); setOpen(true) }}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {date ?
                  <Text style={{ color: SWATheam.SwaGray }}>{date.toDateString()}</Text>
                  :
                  <Text style={{ color: SWATheam.SwaGray }}>Start Date</Text>
                }

              </View>

              <AntDesign name={"clockcircleo"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
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
                <AntDesign name={"clockcircleo"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
              </TouchableOpacity>
            }

            {viewStatus.fixTime &&
              <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
                onPress={() => { showList(''); setOpen3(true) }}
              >
                <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                  {date3 ?
                    <Text style={{ color: SWATheam.SwaBlack }}>{date3.toLocaleTimeString("en-US", { hour12: true })}</Text>
                    :
                    <Text style={{ color: SWATheam.SwaGray }}>Start Time</Text>
                  }
                </View>

                <AntDesign name={"clockcircleo"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
              </TouchableOpacity>
            }
            {/* </View> */}


            {/* total question and time************* */}
            {/* <View style={{ flexDirection: "row", backgroundColor: "#fff" }}> */}

            {/* Lavel div start  */}
            <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6 }}
              onPress={() => { showList('totalTime'); }}
            >
              <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                {(hourData == "" && minutData == "") ?
                  <Text style={{ color: SWATheam.SwaGray }}>Total Time</Text>
                  :
                  <Text style={{ color: SWATheam.SwaBlack }}>{hourData == "" ? "" : hourData} {minutData == "" ? "" : ": " + minutData} </Text>
                }

              </View>

              <AntDesign name={"clockcircleo"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
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
        // <ShowList classList={classList} SetShowSelectField1={SetShowSelectField1} classOptionSelect={classOptionSelect} />
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
            <TouchableOpacity onPress={() => SetShowSelectField1(false)} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} color={SWATheam.SwaGray} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Select Class</Text>
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, section: false } })
            }}
          />
          <View style={{ maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => { setViewStatus((prev) => { return { ...prev, section: false } }) }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} color={SWATheam.SwaGray} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Select Section</Text>
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, subject: false } })
            }}
          />
          <View style={{ maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => { setViewStatus((prev) => { return { ...prev, subject: false } }) }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Select Subject</Text>
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, book: false } })
            }}
          />
          <View style={{ maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => { setViewStatus((prev) => { return { ...prev, book: false } }) }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} color={SWATheam.SwaGray} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Select Books</Text>
            <ScrollView>
              <View style={{ backgroundColor: "#efefef", padding: 8, margin: 4, borderRadius: 5 }}>

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => { checkAll(); getBookChapterList(); }}>
                  {data.filter((item) => item.checked).length === data.length ?
                    <AntDesign name={"checksquareo"} color={SWATheam.SwaGray} size={16} style={{ width: 25, padding: 3 }} />
                    :
                    <Feather name={"square"} color={SWATheam.SwaGray} size={20} style={{ width: 25, padding: 1 }} />
                  }
                  <Text style={{ color: SWATheam.SwaBlack }}>Select All</Text>
                </TouchableOpacity>

                {data.map((item, index) => {

                  return (
                    <View key={bookList[index].bookID}>
                      <TouchableOpacity onPress={() => { setDataAndStatus("book", bookList[index].bookID); checkOne(!item.checked, index); getBookChapterList(); }} style={{ flexDirection: 'row', padding: 10, backgroundColor: SWATheam.SwaWhite, margin: 2, borderRadius: 6 }} >
                        {item.checked ?
                          <AntDesign name={"checksquareo"} color={SWATheam.SwaGray} size={16} style={{ width: 25, padding: 3 }} />
                          :
                          <Feather name={"square"} color={SWATheam.SwaGray} size={20} style={{ width: 25, padding: 1 }} />
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, chapter: false } })
            }}
          />
          <View style={{ maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => { setViewStatus((prev) => { return { ...prev, chapter: false } }) }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} color={SWATheam.SwaGray} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Select Chapter</Text>
            <ScrollView>
              <View style={{ backgroundColor: "#efefef", padding: 8, margin: 4, borderRadius: 5 }}>

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => { checkChapAll(); getExamName(); }}>
                  {chapData.filter((item) => item.checked).length === chapData.length ?
                    <AntDesign name={"checksquareo"} color={SWATheam.SwaGray} size={16} style={{ width: 25, padding: 3 }} />
                    :
                    <Feather name={"square"} color={SWATheam.SwaGray} size={20} style={{ width: 25, padding: 1 }} />
                  }
                  <Text style={{ color: SWATheam.SwaBlack }}>Select All</Text>
                </TouchableOpacity>

                {chapData.map((item, index) => {

                  return (
                    <View key={bookChapterList[index].chapterID}>
                      <TouchableOpacity onPress={() => { checkChapOne(!item.checked, index); getExamName(); }} style={{ flexDirection: 'row', padding: 10, backgroundColor: SWATheam.SwaWhite, margin: 2, borderRadius: 6 }} >
                        {item.checked ?
                          <AntDesign name={"checksquareo"} color={SWATheam.SwaGray} size={16} style={{ width: 25, padding: 3 }} />
                          :
                          <Feather name={"square"} color={SWATheam.SwaGray} size={20} style={{ width: 25, padding: 1 }} />
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

      {otherAsessment.status &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setOtherAsessment((prev) => { return { ...prev, status: false } })
            }}
          />
          <View style={{ height: 170, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 10, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => { setOtherAsessment((prev) => { return { ...prev, status: false } }) }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Assessment Name</Text>
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
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

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => { checkQuesTypeAll() }}>
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
                      <TouchableOpacity onPress={() => { checkQuesTypeOne(!item.checked, index); }} style={{ flexDirection: 'row', padding: 10, backgroundColor: SWATheam.SwaWhite, margin: 2, borderRadius: 6 }} >
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, quesLavel: false } })
            }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => { setViewStatus((prev) => { return { ...prev, quesLavel: false } }) }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Select Question Lavel</Text>
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, examType: false } })
            }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => { setViewStatus((prev) => { return { ...prev, examType: false } }) }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Exam Type</Text>
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
                />
              </View>
            </View>

            <TouchableOpacity onPress={() => { saveTotalTimeData() }} style={{ alignSelf: "center", backgroundColor: userData.data.colors.mainTheme, borderRadius: 4, padding: 8, margin: 4, width: 120 }}>
              <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Submit</Text>
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, totalQuestion: false } })
            }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => { setViewStatus((prev) => { return { ...prev, totalQuestion: false } }) }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Total Question</Text>
            <ScrollView>
              <View>
                <Text style={{ color: SWATheam.SwaBlack }}>
                  {totalQuestion}
                </Text>
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

      {isEditMarks &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => { setIsEditMarks(false) }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => { setIsEditMarks(false) }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Marks Update</Text>
            <ScrollView>
              <View>
                {totalMarks}
              </View>
            </ScrollView>

          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => { setIsEditMarks(false) }}
          />
        </View>
      }

      {viewStatus.questSet &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, questSet: false } })
            }}
          />
          <View style={{ height: "auto", maxHeight: 300, backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => {
              setViewStatus((prev) => { return { ...prev, questSet: false } })
            }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Question Set</Text>
            <ScrollView>
              <TouchableOpacity onPress={() => { setDataAndStatus("questSet", 1); getQuestionLavel(); getSelectedName('examType', 'Date To Date'); setIsQuestType(false) }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: SWATheam.SwaBlack }}>Marks Wise</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setDataAndStatus("questSet", 2); getQuestionLavel(); getSelectedName('examType', 'Fix Time'); setIsQuestType(true) }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: SWATheam.SwaBlack }}>Question Type Wise</Text>
              </TouchableOpacity>
            </ScrollView>

          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => {
              setViewStatus((prev) => { return { ...prev, questSet: false } })
            }}
          />
        </View>
      }
      {isTypeWise &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => { setIsTypeWise(false) }}
          />
          <View style={{ height: "auto", maxHeight: 400, backgroundColor: '#efefef', width: '100%', borderRadius: 8 }}>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Configure Question:</Text>

            <ScrollView>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 4 }}>
                {quesTypeWise?.map((item, index) => {
                  console.log(item)
                  let ind = index + 1;
                  let totalQues = item.totalQues;
                  let activityID = item.activityID;
                  return (
                    <View style={{ width: "50%", borderRadius: 6 }} key={index}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '3%' }}></View>
                        <View style={{ width: "65%" }}>
                          <Text style={{ color: 'green' }}>{item.activityCode}</Text>
                        </View>
                        <View style={{ width: "30%" }}>
                          <Text style={{ color: 'green' }}>Ques.:{item.totalQues}</Text>
                        </View>
                      </View>

                      <TextInput
                        style={{ "height": 30, "margin": 5, "borderWidth": 1, "padding": 6, borderRadius: 6, color: SWATheam.SwaBlack }}
                        onChangeText={(val) => { setQuesTypeValue(ind, val, totalQues, activityID) }}
                        value={ind == 1 ? actTypeData.t1 : ind == 2 ? actTypeData.t2 : ind == 3 ?
                          actTypeData.t3 : ind == 4 ? actTypeData.t4 : ind == 5 ?
                            actTypeData.t5 : ind == 6 ? actTypeData.t6 : ind == 7 ?
                              actTypeData.t7 : ind == 8 ? actTypeData.t8 : null}
                        placeholder="No fo Question"
                        placeholderTextColor={SWATheam.SwaGray}
                        keyboardType="number-pad"
                      />
                    </View>
                  )
                })}
              </View>
            </ScrollView>

            <TouchableOpacity onPress={() => { generateAutoAssSubmit('typeWise') }} style={{ flexDirection: 'row', justifyContent: "center", alignContent: "center", alignItems: "center", padding: 5, backgroundColor: '#dcdcdc' }}>
              <View style={{ width: "50%", padding: 6, margin: 3, borderRadius: 5, backgroundColor: userData.data.colors.mainTheme, justifyContent: "center", alignContent: "center", alignItems: "center" }}><Text style={{ color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Submit</Text></View>
            </TouchableOpacity>

          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => { setIsTypeWise(false) }}
          />
        </View>
      }
      {isMarksWise &&
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => { setIsMarksWise(false) }}
          />
          <View style={{ height: "auto", maxHeight: 400, backgroundColor: '#efefef', width: '100%', borderRadius: 8 }}>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Configure Question:</Text>

            <ScrollView>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 4 }}>
                {quesMarksWise?.map((item, index) => {

                  let ind = index + 1;
                  let totalQues = item.totalQues;
                  let marks = item.marksPerQuestion;
                  return (
                    <View style={{ width: "50%", borderRadius: 6 }} key={index}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '3%' }}></View>
                        <View style={{ width: "65%" }}>
                          <Text style={{ color: 'green' }}>Question:{item.totalQues}</Text>
                        </View>
                        <View style={{ width: "30%" }}>
                          <Text style={{ color: 'green' }}>marks:{item.marksPerQuestion}</Text>
                        </View>
                      </View>
                      <TextInput
                        style={{ "height": 30, "margin": 5, "borderWidth": 1, "padding": 6, borderRadius: 6, color: SWATheam.SwaBlack }}
                        onChangeText={(val) => { setInputValue(ind, val, totalQues, marks) }}
                        value={ind == 1 ? inputData.q1 : ind == 2 ? inputData.q2 : ind == 3 ?
                          inputData.q3 : ind == 4 ? inputData.q4 : ind == 5 ?
                            inputData.q5 : ind == 6 ? inputData.q6 : ind == 7 ?
                              inputData.q7 : ind == 8 ?
                                inputData.q8 : null}
                        placeholder="No fo Question"
                        placeholderTextColor={SWATheam.SwaGray}
                        keyboardType="number-pad"
                      />
                    </View>
                  )
                })}
              </View>
            </ScrollView>

            <TouchableOpacity onPress={() => { generateAutoAssSubmit('marksWise') }} style={{ flexDirection: 'row', justifyContent: "center", alignContent: "center", alignItems: "center", padding: 5, backgroundColor: '#dcdcdc' }}>
              <View style={{ width: "50%", padding: 6, margin: 3, borderRadius: 5, backgroundColor: userData.data.colors.mainTheme, justifyContent: "center", alignContent: "center", alignItems: "center" }}><Text style={{ color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Submit</Text></View>
            </TouchableOpacity>

          </View>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => { setIsMarksWise(false) }}
          />
        </View>
      }

      {isAssign &&

        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 5
        }}>
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => { setIsAssign(false) }}
          />
          <View style={{ maxHeight: '60%', backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => { setIsAssign(false) }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
              <AntDesign name={"close"} color={SWATheam.SwaBlack} size={25} style={{ width: 45 }} />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Select Student</Text>
            <ScrollView>
              <View style={{ backgroundColor: "#efefef", padding: 8, margin: 4, borderRadius: 5 }}>

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => { checkStuListAll(); }}>
                  {autoStuList.filter((item) => item.checked).length === autoStuList.length ?
                    <AntDesign name={"checksquareo"} color={SWATheam.SwaBlack} size={16} style={{ width: 25, padding: 3 }} />
                    :
                    <Feather name={"square"} color={SWATheam.SwaBlack} size={20} style={{ width: 25, padding: 1 }} />
                  }
                  <Text style={{ color: SWATheam.SwaBlack }}>Select All</Text>
                </TouchableOpacity>

                {autoStuList.map((item, index) => {
                  return (
                    <View key={item.userRefID}>
                      <TouchableOpacity onPress={() => { checkStuListOne(!item.checked, index); }} style={{ flexDirection: 'row', padding: 10, backgroundColor: SWATheam.SwaWhite, margin: 2, borderRadius: 6 }} >
                        {item.checked ?
                          <AntDesign name={"checksquareo"} color={SWATheam.SwaBlack} size={16} style={{ width: 25, padding: 3 }} />
                          :
                          <Feather name={"square"} color={SWATheam.SwaBlack} size={20} style={{ width: 25, padding: 1 }} />
                        }
                        <Text style={{ color: SWATheam.SwaBlack }}>{studentList[index]?.firstName != undefined ? studentList[index]?.firstName : ""} {studentList[index].lastName != "" ? studentList[index].lastName : ""}</Text>

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
          <TouchableOpacity style={{ flex: 1, }}
            onPress={() => { setIsAssign(false) }}
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

