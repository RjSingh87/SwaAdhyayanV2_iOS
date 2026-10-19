import React, { useEffect, useRef, useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Alert } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
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

var questionNo = "";
var qID = "";
var finalQData = "";
var selectQuesMarksEdit = [];
var assessID = "";
var studentIDs = [];
var assignArguments = [];

export default function AutoAssessmentGenerate() {
  const { userData } = useContext(GlobleData)
  const [classList, setClassList] = useState([])
  const [showSelectField1, SetShowSelectField1] = useState(false)
  const [selectedIds, setSelectedIds] = useState({ classID: "", sectionID: "", subjectID: "", examID: "", examTypeID: "", totalQuesNo: "", questionSet: "" })
  const [sectionListData, setSectionListData] = useState([])
  const [subjectList, setSubjectList] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [bookChapterList, setBookChapterList] = useState([]);
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
  const [date, setDate] = useState()
  const [open, setOpen] = useState(false)
  const [isQuestType, setIsQuestType] = useState(false)
  const [quesMarksWise, setQuesMarksWise] = useState([]);
  const [quesTypeWise, setQuesTypeWise] = useState([]);
  const [isMarksWise, setIsMarksWise] = useState(false)
  const [isTypeWise, setIsTypeWise] = useState(false)
  const [inputData, setInputData] = useState({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null })
  const [qWiseID, setQWiseID] = useState({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null })
  const [actTypeData, setActTypeData] = useState({ t1: null, t2: null, t3: null, t4: null, t5: null, t6: null, t7: null, t8: null })
  const [actTypeID, setActTypeID] = useState({ t1: null, t2: null, t3: null, t4: null, t5: null, t6: null, t7: null, t8: null })
  const [isAssign, setIsAssign] = useState(false);
  const [autoStuList, setAutoStuList] = useState(assignArguments);
  const [isAutoChapChecked, setIsAutoChapChecked] = useState(false);
  const [examTypeName, setExamTypeName] = useState("")
  const [existingAssessments, setExistingAssessments] = useState([]);


  const [date2, setDate2] = useState()
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

    questionNo = "";
    qID = "";
    finalQData = "";
    selectQuesMarksEdit = [];
    assessID = "";
    studentIDs = [];
    setExamTypeName("")
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



  useEffect(() => {
    getAssessClassList();
    getExistingAssessments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getExistingAssessments = () => {
    if (!userData?.data?.schoolID) return;
    const payload = {
      "schoolID": userData.data.schoolID,
      "userTypeID": userData.data.userTypeID,
      "userRefID": userData.data.userRefID,
    };
    Services.post(apiRoot.getAssessmentList, payload)
      .then((res) => {
        if (res.status == "success" && Array.isArray(res.data)) {
          setExistingAssessments(res.data);
        }
      })
      .catch((err) => {
        console.log("Error fetching assessment list", err);
      });
  };

  const resetAllFields = () => {
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

    questionNo = "";
    qID = "";
    finalQData = "";
    selectQuesMarksEdit = [];
    assessID = "";
    studentIDs = [];
    assignArguments = [];

    setSelectedIds({
      classID: "",
      sectionID: "",
      subjectID: "",
      examID: "",
      examTypeID: "",
      totalQuesNo: "",
      questionSet: "",
    });
    setSectionListData([]);
    setSubjectList([]);
    setBookList([]);
    setBookChapterList([]);
    setAssessQuesTypeList([]);
    setAssessQuesLavelList([]);
    setData([]);
    setChapData([]);
    setQuesTypeData([]);
    setQuesLavelData([]);
    setOtherAsessment({ assessName: '', status: false });
    setAssessInputName('');
    setAssessmentQuestion([]);
    setIsEditMarks(false);
    setStudentList([]);
    setAutoStuList([]);
    setAssignAsessment(false);
    setIsAssessQuesModel(false);
    setDate(undefined);
    setDate2(undefined);
    setDate3(new Date());
    setHourData(0);
    setMinutData(0);
    setExamTypeName("");
    setIsQuestType(false);
    setIsMarksWise(false);
    setIsTypeWise(false);
    setIsAssign(false);
    setQuesMarksWise([]);
    setQuesTypeWise([]);
    setInputData({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null });
    setQWiseID({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null });
    setActTypeData({ t1: null, t2: null, t3: null, t4: null, t5: null, t6: null, t7: null, t8: null });
    setActTypeID({ t1: null, t2: null, t3: null, t4: null, t5: null, t6: null, t7: null, t8: null });
    setViewStatus({
      section: false,
      subject: false,
      book: false,
      chapter: false,
      examName: false,
      quesTypeList: false,
      quesLavel: false,
      examType: false,
      dateToDate: false,
      fixTime: false,
      totalTime: false,
      totalQuestion: false,
      questSet: false,
    });
  };

  const otherAssessmentShow = () => {
    setAssessInputName(examName || "");
    setOtherAsessment((prev) => {
      return { ...prev, status: true, assessName: examName || "" }
    });
  }

  const generateAutoAssSubmit = (type) => {
    let quesWiseID = [];
    let totalQues = 0;
    let apiUrl = "";

    if (type == "marksWise") {
      apiUrl = apiRoot.submitAutoAssessMarksWise;
      for (var key in inputData) {
        if (inputData.hasOwnProperty(key)) {
          let count = parseInt(inputData[key], 10);
          if (!isNaN(count) && count > 0) {
            totalQues += count;
            let mark = qWiseID[key];
            if (mark !== null && mark !== undefined) {
              quesWiseID.push(mark + "_" + count);
            }
          }
        }
      }
    } else {
      apiUrl = apiRoot.submitAutoAssessTypeWise;
      for (var key in actTypeData) {
        if (actTypeData.hasOwnProperty(key)) {
          let count = parseInt(actTypeData[key], 10);
          if (!isNaN(count) && count > 0) {
            totalQues += count;
            let typeID = actTypeID[key];
            if (typeID !== null && typeID !== undefined) {
              quesWiseID.push(typeID + "_" + count);
            }
          }
        }
      }
    }

    if (totalQues <= 0 || quesWiseID.length === 0) {
      Alert.alert("Alert", "Please enter number of questions to generate assessment.");
      return;
    }

    let classID = selectedIds.classID;
    let sectionID = selectedIds.sectionID?.sectionID;
    let subjectID = selectedIds.subjectID;
    let questSetID = selectedIds.questionSet;
    let examTypeID = selectedIds.examTypeID;
    let chapterIDs = chapterIDsArray.toString();
    let bookIDs = bookIdsArry.toString();
    let quesLavelIDs = quesLavelIdsArray.toString();
    let startDate = date;
    let endDate = date2;

    if (!classID || !sectionID || !subjectID || !examTypeID || !questSetID ||
      !chapterIDs || !bookIDs || !quesLavelIDs || !startDate ||
      (examTypeID == 1 && !endDate) ||
      !examName || examName.trim() === ""
    ) {
      Alert.alert("Alert", "Please Fill All Required Field");
      return;
    }

    const isDuplicate = existingAssessments.some(
      (item) => item?.assessmentName?.trim().toLowerCase() === examName.trim().toLowerCase()
    );
    if (isDuplicate) {
      Alert.alert("Alert", "An assessment with this name has already been generated. Please enter a different Assessment Name.");
      return;
    }

    let sDate = "";
    let eDate = "";

    if (startDate) {
      var year = startDate.getFullYear();
      var mes = startDate.getMonth() + 1;
      var dia = startDate.getDate();
      sDate = year + "-" + mes + "-" + dia;
    }
    if (endDate) {
      var year = endDate.getFullYear();
      var mes = endDate.getMonth() + 1;
      var dia = endDate.getDate();
      eDate = year + "-" + mes + "-" + dia;
    }

    setIsLoader(true)
    const payload = {
      "schoolID": userData.data.schoolID,
      "classID": classID,
      "bookIDs": bookIDs,
      "subjectID": subjectID,
      "quesSet": questSetID,
      "assessmentName": examName.trim(),
      "sectionID": sectionID,
      "timeModule": hourData + "h" + ":" + minutData + "m",
      "noOfQuestion": totalQues,
      "examDate": "",
      "asmtTime": hourData + ":" + minutData + ":" + 0,
      "questionData": quesWiseID.toString(),
      "chapterIDs": chapterIDs,
      "startDate": sDate,
      "endDate": examTypeID == 2 ? sDate : eDate,
      "startTime": "",
      "levelIDs": quesLavelIDs,
      "academicYear": userData.data.academicYear,
      "userRefID": userData.data.userRefID
    }
    Services.post(apiUrl, payload)
      .then((res) => {
        setIsLoader(false)
        if (res.status == "success") {
          console.log({ apiUrl, payload, res }, "Jab successfully")
          const data = res.data;
          assessID = data?.asmtID;
          setIsTypeWise(false);
          setIsMarksWise(false);
          getExistingAssessments();
          Alert.alert("Success", res.message);
          if (data?.studentData && data.studentData.length > 0) {
            assignArguments = [];
            data.studentData.forEach(() => {
              assignArguments.push({ checked: false });
            });
            setAutoStuList(assignArguments);
            setStudentList(data.studentData);
            setTimeout(() => {
              setIsAssign(true);
            }, 300);
          } else {
            resetAllFields();
          }
        } else {
          Alert.alert("Error", res.message || "Failed to generate assessment");
        }
      })
      .catch((err) => {
        console.log(err)
        setIsLoader(false)
        Alert.alert("Error", "Something went wrong while generating assessment.");
      })
      .finally(() => {
        setIsLoader(false)
      })
  }
  const setInputValue = (index, value, totalQues, marks) => {
    let cleanVal = value ? value.replace(/[^0-9]/g, '') : '';
    if (cleanVal !== '' && parseInt(cleanVal, 10) > parseInt(totalQues, 10)) {
      Alert.alert("Alert", "Entered questions cannot be greater than: " + totalQues);
      return;
    }
    const valToSet = cleanVal === '' ? null : cleanVal;
    setInputData((prev) => ({ ...prev, [`q${index}`]: valToSet }));
    setQWiseID((prev) => ({ ...prev, [`q${index}`]: marks }));
  }

  const setQuesTypeValue = (index, value, totalQues, activityID) => {
    let cleanVal = value ? value.replace(/[^0-9]/g, '') : '';
    if (cleanVal !== '' && parseInt(cleanVal, 10) > parseInt(totalQues, 10)) {
      Alert.alert("Alert", "Entered questions cannot be greater than: " + totalQues);
      return;
    }
    const valToSet = cleanVal === '' ? null : cleanVal;
    setActTypeData((prev) => ({ ...prev, [`t${index}`]: valToSet }));
    setActTypeID((prev) => ({ ...prev, [`t${index}`]: activityID }));
  }

  // Calculate live total questions for Type Wise modal
  const getTotalTypeWiseQues = () => {
    let total = 0;
    for (let key in actTypeData) {
      if (actTypeData[key]) {
        let val = parseInt(actTypeData[key], 10);
        if (!isNaN(val) && val > 0) {
          total += val;
        }
      }
    }
    return total;
  };

  // Calculate live total questions for Marks Wise modal
  const getTotalMarksWiseQues = () => {
    let total = 0;
    for (let key in inputData) {
      if (inputData[key]) {
        let val = parseInt(inputData[key], 10);
        if (!isNaN(val) && val > 0) {
          total += val;
        }
      }
    }
    return total;
  };

  // Calculate live total marks for Marks Wise modal (questions * marks per question)
  const getTotalMarksWiseMarks = () => {
    let totalMarks = 0;
    for (let key in inputData) {
      if (inputData[key] && qWiseID[key] !== null && qWiseID[key] !== undefined) {
        let count = parseInt(inputData[key], 10);
        let marks = parseFloat(qWiseID[key]);
        if (!isNaN(count) && count > 0 && !isNaN(marks)) {
          totalMarks += count * marks;
        }
      }
    }
    return totalMarks;
  };


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
    const trimmedName = assessInputName.trim();
    if (trimmedName == "") {
      Alert.alert("Alert", "Please enter Assessment Name");
      return;
    }
    const isDuplicate = existingAssessments.some(
      (item) => item?.assessmentName?.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      Alert.alert("Alert", "An assessment with this name has already been generated. Please enter a different name.");
      return;
    }
    examName = trimmedName;
    setOtherAsessment((prev) => {
      return { ...prev, status: false, assessName: trimmedName }
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
    let h = parseInt(hourData) || 0;
    let m = parseInt(minutData) || 0;
    if (h == 0 && m == 0) {
      Alert.alert("Alert", "Please Enter Exam Time");
      return;
    }
    if (m >= 60) {
      Alert.alert("Alert", "Minutes should be less than 60");
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
      "schoolID": userData.data.schoolID,
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
      if (classList?.length) {
        SetShowSelectField1(true)
      } else {
        alert('Class not Assign.')
      }
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
    subjName = "", examName = "", setExamTypeName(""),
      bookIdsArry = [], chapterIDsArray = [], quesLavelIdsArray = []
    setHourData(0), setMinutData(0)
    setDate(); setDate2()
  }

  function getUserSectionList(classID) {
    setIsLoader(true)
    const payload = {
      "schoolID": userData.data.schoolID,
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
      "schoolID": userData.data.schoolID,
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
      "schoolID": userData.data.schoolID,
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
      "schoolID": userData.data.schoolID,
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
  // function getExamName() {
  //   setIsLoader(true)
  //   Services.post(apiRoot.getAssessmentNameList)
  //     .then((res) => {
  //       if (res.status == "success") {
  //         setIsLoader(false)
  //         const data = res.data
  //         setAssesExamNameList(data)
  //       } else {
  //         alert(res.message)
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  //     .finally(() => {
  //       setIsLoader(false)
  //     })
  // }
  function setDataAndStatus(type, selectedID) {
    if (type == "section") {
      setViewStatus((prev) => {
        return { ...prev, section: false }
      })
      setSelectedIds((prev) => {
        return { ...prev, sectionID: selectedID, subjectID: "", examID: "", examTypeID: "", totalQuesNo: "", questionSet: "" }
      })
      subjName = "", examName = "", setExamTypeName(""),
        bookIdsArry = [], chapterIDsArray = [], quesLavelIdsArray = [],
        setHourData(0), setMinutData(0)
      setDate(); setDate2()


    } else if (type == "subject") {
      setViewStatus((prev) => {
        return { ...prev, subject: false }
      })
      setSelectedIds((prev) => {
        return { ...prev, subjectID: selectedID, examID: "", examTypeID: "", totalQuesNo: "", questionSet: "" }
      })
      examName = "", setExamTypeName(""),
        bookIdsArry = [], chapterIDsArray = [], quesLavelIdsArray = [],
        setHourData(0), setMinutData(0)
      setDate(); setDate2()
    } else if (type == "examName") {
      setViewStatus((prev) => {
        return { ...prev, examName: false }
      })
      setSelectedIds((prev) => {
        return { ...prev, examID: selectedID, examTypeID: "", totalQuesNo: "", questionSet: "" }
      })
      getAssessQuestType(); setDate(); setDate2()
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
      });
      examName = "", setExamTypeName(""),
        quesLavelIdsArray = [],
        setDate(); setDate2()
      setHourData(0), setMinutData(0)
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
    } else if (type == "examType") {
      setExamTypeName(selectedName);
    } else if (type == "questionNo") {
      questionNo = selectedName;
    }
  }
  const getGeneratedAssessQuestion = () => {
    let classID = selectedIds.classID;
    let sectionID = selectedIds.sectionID?.sectionID;
    let subjectID = selectedIds.subjectID;
    let questSetID = selectedIds.questionSet;
    let examTypeID = selectedIds.examTypeID;
    let chapterIDs = chapterIDsArray.toString();
    let bookIDs = bookIdsArry.toString();
    let quesTypeIDs = selectedIds.questionSet == 2 ? quesTypeIdsArray.toString() : "";
    let quesLavelIDs = quesLavelIdsArray.toString();
    let startDate = date;
    let endDate = date2;
    let fixTime = date3;

    if (!classID) {
      Alert.alert("Alert", "Please select Class.");
      return;
    }
    if (!sectionID) {
      Alert.alert("Alert", "Please select Section.");
      return;
    }
    if (!subjectID) {
      Alert.alert("Alert", "Please select Subject.");
      return;
    }
    if (!bookIDs || bookIdsArry.length === 0) {
      Alert.alert("Alert", "Please select at least one Book.");
      return;
    }
    if (!chapterIDs || chapterIDsArray.length === 0) {
      Alert.alert("Alert", "Please select at least one Chapter.");
      return;
    }
    if (!questSetID) {
      Alert.alert("Alert", "Please select Question Set.");
      return;
    }
    if (!examName || examName.trim() === "") {
      Alert.alert("Alert", "Please enter Assessment Name.");
      return;
    }
    // Duplicate Assessment Name check
    const isDuplicate = existingAssessments.some(
      (item) => item?.assessmentName?.trim().toLowerCase() === examName.trim().toLowerCase()
    );
    if (isDuplicate) {
      Alert.alert("Alert", "An assessment with this name has already been generated. Please enter a different Assessment Name.");
      return;
    }
    if (questSetID == 2 && (!quesTypeIDs || quesTypeIdsArray.length === 0)) {
      Alert.alert("Alert", "Please select Question Type.");
      return;
    }
    if (!examTypeID) {
      Alert.alert("Alert", "Please select Exam Type.");
      return;
    }
    if (!quesLavelIDs || quesLavelIdsArray.length === 0) {
      Alert.alert("Alert", "Please select at least one Level.");
      return;
    }
    if (!startDate) {
      Alert.alert("Alert", examTypeID == 2 ? "Please select Exam Date." : "Please select Start Date.");
      return;
    }
    if (examTypeID == 1 && !endDate) {
      Alert.alert("Alert", "Please select End Date.");
      return;
    }
    if (examTypeID == 1 && endDate && startDate && endDate < startDate) {
      Alert.alert("Alert", "End date should be greater than or equal to start date.");
      return;
    }
    if (examTypeID == 2 && !fixTime) {
      Alert.alert("Alert", "Please select Start Time.");
      return;
    }
    let h = parseInt(hourData) || 0;
    let m = parseInt(minutData) || 0;
    if (h === 0 && m === 0) {
      Alert.alert("Alert", "Please enter Exam Time.");
      return;
    }

    setIsLoader(true);
    const payload = {
      "schoolID": userData.data.schoolID,
      "classID": classID,
      "bookIDs": bookIDs,
      "subjectID": subjectID,
      "quesSet": questSetID,
      "asmtName": examName.trim(),
      "sectionID": sectionID,
      "quesType": quesTypeIDs,
      "questionLevelIds": quesLavelIDs,
      "chapterIDs": chapterIDs,
      "examType": examTypeID,
      "endDate": endDate,
      "startTime": examTypeID == 2 ? fixTime : "",
      "examHrs": hourData == 0 ? "" : hourData,
      "examMin": minutData == 0 ? "" : minutData,
      "levelIDs": quesLavelIDs,
      "academicYear": userData.data.academicYear
    };
    if (examTypeID == 1) {
      payload["startDate"] = startDate;
    } else if (examTypeID == 2) {
      payload["examDate"] = startDate;
    }
    Services.post(apiRoot.autoAssessmentGenerateQuest, payload)
      .then((res) => {
        setIsLoader(false);
        if (res.status == "success") {
          const data = res.data;
          if (!data || data.length === 0) {
            Alert.alert("Alert", "No questions available for the selected criteria.");
            return;
          }
          setQuesMarksWise([]);
          setQuesTypeWise([]);
          setInputData({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null });
          setQWiseID({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null });
          setActTypeData({ t1: null, t2: null, t3: null, t4: null, t5: null, t6: null, t7: null, t8: null });
          setActTypeID({ t1: null, t2: null, t3: null, t4: null, t5: null, t6: null, t7: null, t8: null });

          if (questSetID == 1) {
            setQuesMarksWise(data);
            setIsMarksWise(true);
          } else {
            setQuesTypeWise(data);
            setIsTypeWise(true);
          }
        } else {
          Alert.alert("Error", res.message || "Failed to load questions");
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoader(false);
        Alert.alert("Error", "Failed to fetch question configuration.");
      });
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
        <TouchableOpacity onPress={() => { setIsEditMarks(false); selectMarks(item); }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: SWATheam.SwaBlack }}>{item}</Text>
        </TouchableOpacity>
      </View>
    )
  })

  const assignAssessmentToStudent = () => {
    let selectStuIDs = "";
    if (studentIDs.length == studentList.length) {
      selectStuIDs = "all";
    } else if (studentIDs.length == 0) {
      Alert.alert("Alert", "Please Select Atleast One Student");
      return;
    } else {
      selectStuIDs = studentIDs.toString();
    }
    const payload = {
      "schoolID": userData.data.schoolID,
      "classID": selectedIds.classID,
      "sectionID": selectedIds.sectionID?.sectionID,
      "userRefID": userData.data.userRefID,
      "assessmentID": assessID,
      "studentRefIDs": selectStuIDs,
      "academicYear": userData.data.academicYear
    };
    setIsLoader(true);
    Services.post(apiRoot.assignAssessmentToStudents, payload)
      .then((res) => {
        setIsLoader(false);
        if (res.status == "success") {
          Alert.alert("Success", res.message || "Assessment Assigned Successfully");
          setIsAssign(false);
          setAssignAsessment(false);
          setAssessmentQuestion([]);
          resetAllFields();
          getExistingAssessments();
        } else {
          Alert.alert("Error", res.message || "Failed to assign assessment");
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoader(false);
        Alert.alert("Error", "Something went wrong while assigning assessment.");
      })
      .finally(() => {
        setIsLoader(false);
      });
  }


  console.log(viewStatus.fixTime)


  return (

    <>
      {isLoader &&
        <Loader />
      }

      <Text style={{ borderBottomWidth: 1, padding: 8, color: SWATheam.SwaBlack, textAlign: "center", backgroundColor: userData.data.colors.liteTheme }}>
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

            {/* QuestionType div start  */}
            {isQuestType &&
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
            {viewStatus.dateToDate || viewStatus.fixTime ?
              <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, marginTop: 2 }}
                onPress={() => { showList(''); setOpen(true) }}
              >
                <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                  {date ?
                    <Text style={{ color: SWATheam.SwaBlack }}>{date.toDateString()}</Text>
                    :
                    <Text style={{ color: SWATheam.SwaGray }}>{viewStatus.fixTime ? "Exam Date" : "Start Date"}</Text>
                  }

                </View>

                <AntDesign name={"clockcircleo"} color={SWATheam.SwaGray} size={12} style={{ width: 30, padding: 8, backgroundColor: '#efefef', borderBottomRightRadius: 5, borderTopRightRadius: 5 }} />
              </TouchableOpacity> : null
            }
            {/* Start Date Div end */}



            {viewStatus.dateToDate &&
              <TouchableOpacity style={{ width: '48%', flexDirection: 'row', padding: 10, height: 50, borderRadius: 6, margin: 2 }}
                onPress={() => { showList(''); setOpen2(true) }}
              >
                <View style={{ flex: 1, padding: 5, backgroundColor: "#efefef", borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                  {date2 ?
                    <Text style={{ color: SWATheam.SwaBlack }}>{date2.toDateString()}</Text>
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
                  <Text style={{ color: SWATheam.SwaBlack }}>{hourData == "" ? 0 : hourData} {minutData == "" ? ": " + 0 : ": " + minutData} </Text>
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
          date={date || new Date()}
          mode="date"
          onConfirm={(selectedDate) => {
            setOpen(false);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const chosen = new Date(selectedDate);
            chosen.setHours(0, 0, 0, 0);

            if (chosen >= today) {
              setDate(selectedDate);
            } else {
              Alert.alert("Alert", "Please select valid date.");
            }
            setDate2(undefined);
            setHourData(0);
            setMinutData(0);
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
          date={date2 || new Date()}
          mode="date"
          onConfirm={(selectedEndDate) => {
            setOpen2(false);
            if (!date) {
              Alert.alert("Alert", "Please select Start Date first.");
              return;
            }
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(selectedEndDate);
            endDate.setHours(0, 0, 0, 0);

            if (endDate >= startDate) {
              setDate2(selectedEndDate);
            } else {
              Alert.alert(
                "Alert",
                "End date should be greater than or equal to start date."
              );
            }
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

                <TouchableOpacity style={styles.checkboxContainer} onPress={() => {
                  checkChapAll();
                  // getExamName();
                }}>
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
                      <TouchableOpacity onPress={() => {
                        checkChapOne(!item.checked, index);
                        // getExamName();
                      }} style={{ flexDirection: 'row', padding: 10, backgroundColor: SWATheam.SwaWhite, margin: 2, borderRadius: 6 }} >
                        {item.checked ?
                          <AntDesign name={"checksquareo"} color={SWATheam.SwaGray} size={16} style={{ width: 25, padding: 3 }} />
                          :
                          <Feather name={"square"} color={SWATheam.SwaGray} size={20} style={{ width: 25, padding: 1 }} />
                        }
                        <Text style={{ color: SWATheam.SwaBlack }}>{bookChapterList[index]?.chapterName}</Text>
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
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
        }}>
          <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            activeOpacity={1}
            onPress={() => {
              setOtherAsessment((prev) => ({ ...prev, status: false }));
            }}
          />
          <View style={{ backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, paddingBottom: 6, marginBottom: 8 }}>
              <Text style={{ textAlign: 'center', flex: 1, color: SWATheam.SwaBlack, fontWeight: 'bold', fontSize: 16 }}>Assessment Name</Text>
              <TouchableOpacity onPress={() => { setOtherAsessment((prev) => ({ ...prev, status: false })); }}>
                <AntDesign name={"close"} color={SWATheam.SwaBlack} size={22} />
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
                <TouchableOpacity onPress={() => { saveOtherAssessData(); }} style={{ alignSelf: "center", backgroundColor: userData.data.colors.mainTheme, borderRadius: 4, padding: 8, margin: 4, width: 120 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
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
              <TouchableOpacity onPress={() => { setDataAndStatus("questSet", 1); getQuestionLavel(); getSelectedName('questSet', 'Mark Wise'); setIsQuestType(false) }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: SWATheam.SwaBlack }}>Marks Wise</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setDataAndStatus("questSet", 2); getQuestionLavel(); getSelectedName('questSet', 'Q.Type Wise'); setIsQuestType(true) }} style={{ padding: 10, backgroundColor: '#efefef', margin: 2, borderRadius: 6, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
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
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
        }}>


          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            activeOpacity={1}
            onPress={() => {
              setIsTypeWise(false);
              setActTypeData({ t1: null, t2: null, t3: null, t4: null, t5: null, t6: null, t7: null, t8: null });
              setActTypeID({ t1: null, t2: null, t3: null, t4: null, t5: null, t6: null, t7: null, t8: null });
            }}
          />
          <View style={{ height: "auto", maxHeight: 400, backgroundColor: '#efefef', width: '100%', borderRadius: 8 }}>
            <Text style={{ textAlign: 'center', padding: 5, color: SWATheam.SwaBlack, borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, margin: 4, fontWeight: 'bold' }}>Configure Question</Text>

            <ScrollView>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 4 }}>
                {quesTypeWise?.map((item, index) => {
                  let ind = index + 1;
                  let totalQues = item.totalQues;
                  let activityID = item.activityID;
                  return (
                    <View style={{ width: "50%", borderRadius: 6 }} key={index}>
                      <View style={{ flexDirection: 'row', paddingHorizontal: 6 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: 'green' }}>{item.activityCode}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: 'green', textAlign: 'right' }}>Ques.:{item.totalQues}</Text>
                        </View>
                      </View>

                      <TextInput
                        style={{ height: 32, margin: 5, borderWidth: 1, padding: 6, borderRadius: 6, color: SWATheam.SwaBlack, backgroundColor: SWATheam.SwaWhite }}
                        onChangeText={(val) => { setQuesTypeValue(ind, val, totalQues, activityID); }}
                        value={actTypeData[`t${ind}`] !== null && actTypeData[`t${ind}`] !== undefined ? String(actTypeData[`t${ind}`]) : ''}
                        placeholder="No of Questions"
                        placeholderTextColor={SWATheam.SwaGray}
                        keyboardType="number-pad"
                      />
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fff',
              paddingVertical: 8,
              paddingHorizontal: 12,
              marginHorizontal: 4,
              marginVertical: 4,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#ddd'
            }}>
              <Text style={{ color: SWATheam.SwaBlack, fontWeight: '600', fontSize: 14 }}>
                Total Questions:
              </Text>
              <Text style={{ color: userData?.data?.colors?.mainTheme || '#0d6efd', fontWeight: 'bold', fontSize: 16 }}>
                {getTotalTypeWiseQues()}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 4 }}>
              <TouchableOpacity
                onPress={() => {
                  setIsTypeWise(false);
                  setActTypeData({ t1: null, t2: null, t3: null, t4: null, t5: null, t6: null, t7: null, t8: null });
                  setActTypeID({ t1: null, t2: null, t3: null, t4: null, t5: null, t6: null, t7: null, t8: null });
                }}
                style={{ flex: 1, marginHorizontal: 4, padding: 8, borderRadius: 5, backgroundColor: '#6c757d', justifyContent: "center", alignItems: "center" }}
              >
                <Text style={{ color: SWATheam.SwaWhite, textTransform: 'uppercase', fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { generateAutoAssSubmit('typeWise'); }}
                style={{ flex: 1, marginHorizontal: 4, padding: 8, borderRadius: 5, backgroundColor: userData.data.colors.mainTheme, justifyContent: "center", alignItems: "center" }}
              >
                <Text style={{ color: SWATheam.SwaWhite, textTransform: 'uppercase', fontWeight: 'bold' }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
      {isMarksWise &&
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            activeOpacity={1}
            onPress={() => {
              setIsMarksWise(false);
              setInputData({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null });
              setQWiseID({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null });
            }}
          />
          <View style={{ height: "auto", maxHeight: 420, backgroundColor: '#efefef', width: '100%', borderRadius: 8, padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: SWATheam.SwaBlack, paddingBottom: 6, margin: 4 }}>
              <Text style={{ textAlign: 'center', flex: 1, color: SWATheam.SwaBlack, fontWeight: 'bold', fontSize: 16 }}>Configure Question</Text>
              <TouchableOpacity onPress={() => {
                setIsMarksWise(false);
                setInputData({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null });
                setQWiseID({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null });
              }} style={{ padding: 4 }}>
                <AntDesign name={"close"} color={SWATheam.SwaBlack} size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 4 }}>
                {quesMarksWise?.map((item, index) => {
                  let ind = index + 1;
                  let totalQues = item.totalQues;
                  let marks = item.marksPerQuestion;
                  return (
                    <View style={{ width: "50%", borderRadius: 6 }} key={index}>
                      <View style={{ flexDirection: 'row', paddingHorizontal: 6 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: 'green' }}>Questions: {item.totalQues}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: 'green', textAlign: 'right' }}>Marks: {item.marksPerQuestion}</Text>
                        </View>
                      </View>
                      <TextInput
                        style={{ height: 32, margin: 5, borderWidth: 1, padding: 6, borderRadius: 6, color: SWATheam.SwaBlack, backgroundColor: SWATheam.SwaWhite }}
                        onChangeText={(val) => { setInputValue(ind, val, totalQues, marks); }}
                        value={inputData[`q${ind}`] !== null && inputData[`q${ind}`] !== undefined ? String(inputData[`q${ind}`]) : ''}
                        placeholder="No of Questions"
                        placeholderTextColor={SWATheam.SwaGray}
                        keyboardType="number-pad"
                      />
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: '#fff',
              paddingVertical: 8,
              paddingHorizontal: 10,
              marginHorizontal: 4,
              marginVertical: 4,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#ddd'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '600', fontSize: 13 }}>Total Questions: </Text>
                <Text style={{ color: userData?.data?.colors?.mainTheme || '#0d6efd', fontWeight: 'bold', fontSize: 15 }}>
                  {getTotalMarksWiseQues()}
                </Text>
              </View>
              <View style={{ width: 1, height: 18, backgroundColor: '#ccc' }} />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '600', fontSize: 13 }}>Total Marks: </Text>
                <Text style={{ color: '#198754', fontWeight: 'bold', fontSize: 15 }}>
                  {getTotalMarksWiseMarks()}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 }}>
              <TouchableOpacity
                onPress={() => {
                  setIsMarksWise(false);
                  setInputData({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null });
                  setQWiseID({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null });
                }}
                style={{ flex: 1, marginHorizontal: 4, padding: 8, borderRadius: 5, backgroundColor: '#6c757d', justifyContent: "center", alignItems: "center" }}
              >
                <Text style={{ color: SWATheam.SwaWhite, textTransform: 'uppercase', fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { generateAutoAssSubmit('marksWise'); }}
                style={{ flex: 1, marginHorizontal: 4, padding: 8, borderRadius: 5, backgroundColor: userData.data.colors.mainTheme, justifyContent: "center", alignItems: "center" }}
              >
                <Text style={{ color: SWATheam.SwaWhite, textTransform: 'uppercase', fontWeight: 'bold' }}>Submit</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      }

      {isAssign &&

        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 5,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            activeOpacity={1}
            onPress={() => {
              setIsAssign(false);
              resetAllFields();
              getExistingAssessments();
            }}
          />
          <View style={{ maxHeight: '75%', backgroundColor: SWATheam.SwaWhite, width: '100%', padding: 14, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => { setIsAssign(false); resetAllFields(); getExistingAssessments(); }} style={{ alignSelf: "flex-end", position: "absolute", top: 6, right: 0 }}>
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
                    <View key={`${item.userRefID}-${index}`}>
                      <TouchableOpacity onPress={() => { checkStuListOne(!item.checked, index); }} style={{ flexDirection: 'row', padding: 10, backgroundColor: SWATheam.SwaWhite, margin: 2, borderRadius: 6 }} >
                        {item.checked ?
                          <AntDesign name={"checksquareo"} color={SWATheam.SwaBlack} size={16} style={{ width: 25, padding: 3 }} />
                          :
                          <Feather name={"square"} color={SWATheam.SwaBlack} size={20} style={{ width: 25, padding: 1 }} />
                        }
                        <Text style={{ color: SWATheam.SwaBlack }}>{studentList[index]?.firstName != undefined ? studentList[index]?.firstName : ""} {studentList[index]?.lastName != "" ? studentList[index]?.lastName : ""}</Text>

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