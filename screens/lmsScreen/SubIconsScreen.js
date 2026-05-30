import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import SwaHeader from '../common/SwaHeader';
import IconsContainer from '../common/IconsContainer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { GlobleData } from '../../Store';
import Services from '../../Services';
import { SWATheam, apiRoot } from '../../constant/ConstentValue';
import SelectionBox from '../common/SelectionBox';
import BottomDrawerList from '../common/BottomDrawerList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLearningTool } from '../redux/slices/LearningToolList';
import { fetModuleActivityList } from '../redux/slices/ModuleActivityList';
import Loader from '../common/Loader';
import SubIconActivityList from '../common/SubIconActivityList';
import AcademicProfIntro from '../lmsScreen/SEPT/AcademicProfIntro';
import GameList from '../common/GameList';
import Orientation from 'react-native-orientation-locker';
import MsgModal from '../common/MsgModal';
import AssessmentView from './Assessment/assessmentView';
import AutoAssessmentGenerate from './Assessment/autoAssessmentGenerate';
import AddQuestionManullay from './Assessment/AddQuestionManually';
import AssessmentStatus from './Assessment/AssessmentStatus';
import ManageAssessment from './Assessment/ManageAssessment';
import CustomInput from '../common/CustomInput';
import Co_ScholasticIndicator from './marksEntryScreens/Co_ScholasticIndicator';
import AddEditSubIndicator from './marksEntryScreens/AddEditSubIndicator';
import CreateHomeWork from './homeWork/teacher/CreateHomeWork';
import SaveHomeWork from './homeWork/teacher/SavedHomeWork';
import AssignedHomeWork from './homeWork/teacher/AssignedHomeWork';
import SubmittedHomeWork from './homeWork/teacher/SubmittedHomeWork';
import CheckedHomeWork from './homeWork/teacher/CheckedHomeWork';
import IssuedCertificate from './homeWork/teacher/IssuedCertificate';
import CreateCertificate from './homeWork/teacher/CreateCertificate';
import CertificateIconsView from './homeWork/teacher/CertificateIconsView';
import ViewAndSubmitHomework from './homeWork/student/ViewAndSubmitHomework';
import CheckedStuentHomeWork from './homeWork/student/CheckedHomeWork';
import CertificatedAwarded from './homeWork/student/CertificateAwarded';
import SubmittedStudentHomeWork from './homeWork/student/SubmittedHomeWork';
import SubjectMarksEntryList from './marksEntryScreens/SubjectMarksEntryList';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ReportViwer from '../common/ReportViwer';

const activeSubIconIDs = [
  18, 45, 94, 20, 48, 124, 47, 19, 46, 95, 34, 35, 36, 37, 38, 39, 60, 62, 63,
  64, 65, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 114, 115,
  54, 55, 87, 88, 89, 90, 91, 92, 93, 109, 110, 111, 112, 113,
];
// 19,46,45/   ---NCERT
// 54, 55 marksEntry
const reportSubIconsIDs = [
  34, 35, 36, 37, 38, 39, 60, 62, 63, 64, 65, 97, 98, 99, 100, 101, 102, 103,
  104, 105, 106, 107, 108, 114, 115,
];
const ncertIDs = [19, 46, 95];
const assSubIconIDs = [23, 24, 25, 26, 42, 43, 49, 50, 51, 52, 113];
const reportMainIconIDs = [7, 20, 30, 37];
const marksEntrySubIconID = [
  27, 28, 29, 30, 31, 32, 33, 53, 54, 55, 56, 57, 58, 59,
];
// const homeWorkSubIconID = [87,88,89,90,91,92,93, 109,110,111,112]


import { flowRef } from './flowRef';

const SubIconsScreen = ({ navigation, route }) => {

  console.log("SubIconsScreen.js")


  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { userData } = useContext(GlobleData);
  const [subIconsData, setSubIconsData] = useState({
    icons: null,
    iconUrl: '',
    status: true,
    iconName: '',
  });
  // const [selectedIcon, setSelectedIcon] = useState({name: subIconsData.iconName, subIconID: subIconsData?.icons?.icons[0]})
  const [selectedIcon, setSelectedIcon] = useState({
    name:
      route?.params?.getMainIconsData != undefined
        ? subIconsData?.iconName
        : route?.params?.subIcon?.subIconName,
    subIconID:
      route?.params?.getMainIconsData != undefined
        ? subIconsData?.icons?.icons[0]
        : route?.params?.subIcon?.subIconID,
  });
  const [selectField, setSelectField] = useState(true);
  const [selectedField, setSelectedField] = useState({
    class: null,
    section: null,
    subject: null,
    book: null,
    level: null,
    trkSub: null,
    trmType: null,
    markAss: null,
    markFormet: null,
    term: null,
    marksType: null,
    student: null,
  });
  const [listItem, setListItem] = useState({
    list: null,
    status: false,
    type: '',
  });
  const [toolItems, setToolItems] = useState();
  const [loading, setLoading] = useState(true);
  const [intro, setIntor] = useState({
    selectedSubIcon: null,
    instruction: false,
  });
  const [viewSeptReport, setViewSeptReport] = useState({
    data: null,
    status: false,
  });
  const [trkSubject, setTrkSubject] = useState(false);
  const [gameList, setGameList] = useState({ data: null, status: false });
  const [msgModalVisible, setMsgModalVisible] = useState({
    msg: '',
    status: false,
    type: '',
  });
  const [childIconsList, setChildIconsList] = useState({
    listItem: null,
    status: false,
  });
  const [consolidatedReportData, setConsolidatedReportData] = useState({
    APP: null,
    LS: null,
    MI: null,
    KM: null,
    BD: null,
    msg: '',
    status: false,
  });
  const [combineReport, SetCombineReport] = useState(false);
  const [inputField, setInputField] = useState({ assName: null });
  const [indicatorsList, setIndicatorsList] = useState({
    data: null,
    status: false,
  });
  const [editIndicator, seteditIndicator] = useState({
    actionName: '',
    editItem: null,
    type: '',
    status: false,
  });
  const [subIndicatorName, setsubIndicatorName] = useState('');
  const [subjectMarksEntry, setSubjectMarksEntry] = useState({
    list: null,
    status: false,
  });
  const [certificateAct, setCertificateAct] = useState({
    create: false,
    issued: false,
    iconView: true,
  });
  const [termBtnID, setTermBtnId] = useState(1);
  const [selectedTerm, setSelectedTerm] = useState();
  const [editAss, setEditAss] = useState({
    type: '',
    data: null,
    status: false,
  });
  const [reportData, setReportData] = useState({ data: null, status: false });
  const [stuReportName, setStuReportName] = useState('');
  const toolName =
    route?.params?.from == 'assign'
      ? 'Swa-Assessment'
      : route.params?.getMainIconsData == undefined
        ? route.params?.mainIconName
        : route.params?.getMainIconsData?.iconName;
  const mainIconID =
    route?.params?.from == 'assign' ? 18 : route.params.mainIconID;
  const searchDataList = useSelector(state => state.Search);
  const trkLevelItems = [
    { level: 'Level A,B,C', levelID: 1 },
    { level: 'Level 1-8', levelID: 2 },
  ];
  const trmTypeList = [
    { trmType: 'Complete Solutions/Answers', trmID: 6 },
    { trmType: 'Lesson Plans', trmID: 5 },
  ];
  const trkSubjectList = [
    { subjectName: 'Hindi', subjectID: 1 },
    { subjectName: 'English', subjectID: 2 },
    { subjectName: 'Mathematics', subjectID: 3 },
    { subjectName: 'Science', subjectID: 4 },
    { subjectName: 'Social Science', subjectID: 5 },
    { subjectName: 'EVS', subjectID: 6 },
  ];
  const marksEntryFormat = [
    { format: 'Question Wise Marks', formatID: 1 },
    { format: 'Full Marks', formatID: 2 },
  ];

  useEffect(() => {
    setStuReportName('CBSE');
    const goBack = navigation.addListener('focus', () => {
      setStuReportName('CBSE');
      setSelectedIcon(prev => {
        return {
          ...prev,
          subIconID:
            route.params.getMainIconsData != undefined
              ? subIconsData?.icons?.icons[0]
              : route?.params?.subIcon?.subIconID,
        };
      });

      if (flowRef.fromChild2) {
        flowRef.fromChild2 = false; // 🔁 reset
        return; // ❌ skip getSubIcons
      }

      setLoading(false);
      getSubIcons();
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
    });
    return goBack;
  }, [navigation]);

  useEffect(() => {
    if (
      selectedIcon.name == 'NCERT' ||
      selectedIcon.name == 'TRK' ||
      selectedIcon.name == 'TRM' ||
      selectedIcon.name == 'Gamification'
    ) {
      setSelectedField({});
    } else {
      return;
    }
  }, [selectedIcon]);

  function selectTerm(item, type) {
    setSelectedTerm(item.userRefID);
    let termID = 1;
    if (type == 'term1') {
      setTermBtnId(1);
      termID = 1;
      getStudentListWithSubjectMarks(termID, type);
    } else if (type == 'term2') {
      setTermBtnId(2);
      termID = 2;
      getStudentListWithSubjectMarks(termID, type);
    }
  }
  useEffect(() => {
    getSubIcons();
  }, []);

  useEffect(() => {
    if (selectedIcon.subIconID == 60) {
      const payload = {
        schoolID: userData.data.schoolID,
        subIconID: selectedIcon.subIconID,
      };
      Services.post(apiRoot.getChildIcons, payload)
        .then(res => {
          if (res.status == 'success') {
            setChildIconsList(prev => {
              return { ...prev, listItem: res.data, status: true };
            });
          } else if (res.status == 'error') {
            alert(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(err => { });
    }
  }, [selectedIcon]);

  function getSubIcons() {
    if (mainIconID == 27) {
      setLoading(true);
      const payload = {
        userRefID: userData?.data?.userRefID,
        schoolID: userData?.data?.schoolID,
        academicYear: userData?.data?.academicYear,
        userTypeID: userData?.data?.userTypeID,
        classID:
          userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2
            ? selectedField.class.classID
            : userData.data.classID,
        sectionID:
          userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2
            ? selectedField.section.sectionID
            : userData.data.sectionID,
      };
      Services.post(apiRoot.septModules, payload)
        .then(res => {
          if (res.status == 'success') {
            setLoading(false);
            setSubIconsData(prev => {
              return {
                ...prev,
                icons: res.data,
                iconUrl: res.data.path,
                status: false,
                iconName: 'sept',
              };
            });
          } else if (res.status == 'error') {
            alert(res.message);
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('home');
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const subIconPayload = {
        userRefID: userData?.data?.userRefID,
        schoolID: userData?.data?.schoolID,
        academicYear: userData?.data?.academicYear,
        userTypeID: userData?.data?.userTypeID,
        mainIconID: mainIconID,
      };
      Services.post(apiRoot.appSubIcons, subIconPayload)
        .then(res => {
          if (res.status == 'success') {
            setLoading(false);
            setSubIconsData(prev => {
              return {
                ...prev,
                icons: res.data,
                iconUrl: res.data.domain,
                status: false,
                iconName: res.data.icons[0].getSubIconsData.subIconName,
              };
            });

            setSelectedIcon(prev => {
              return {
                ...prev,
                name:
                  route?.params?.getMainIconsData != undefined
                    ? res.data.icons[0]
                    : route?.params?.subIcon?.subIconName,
                subIconID:
                  route?.params?.getMainIconsData != undefined
                    ? res.data.icons[0].getSubIconsData.subIconID
                    : route?.params?.subIcon?.subIconID,
              };
            });

            if (
              !searchDataList?.loading &&
              route?.params?.getMainIconsData == undefined
            ) {
              getIconDetail(route.params);
              setSelectedIcon(prev => {
                return {
                  ...prev,
                  name:
                    route?.params?.getMainIconsData != undefined
                      ? res.data.icons[0]
                      : route?.params?.subIcon?.subIconName,
                  subIconID:
                    route?.params?.getMainIconsData != undefined
                      ? res.data.icons[0].getSubIconsData.subIconID
                      : route?.params?.subIcon?.subIconID,
                };
              });
            }

            if (route?.params?.chapter != undefined) {
              getLearningToolsList(route.params, 'search');
            }
          } else if (res.status == 'error') {
            alert(res.message);
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('home');
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }
  function onClickLeftIcon() {
    flowRef.fromChild2 = true;
    navigation.goBack();
  }
  // function onClickRightIcon() {
  //     // setIsInstruction(true)
  // }

  function closeModule() {
    setListItem(prev => {
      return { ...prev, status: false };
    });
    SetCombineReport(false);
    seteditIndicator(prev => {
      return { ...prev, status: false };
    });
    setReportData(prev => {
      return { ...prev, status: false };
    });
  }
  async function getIconDetail(val) {
    if (val?.subIcon?.childIcon != undefined) {
      getModuleActivityData(val, '', '', '', navigation);
    }
    let subIconID =
      val.getSubIconsData != undefined
        ? val.getSubIconsData.subIconID
        : val?.subIcon?.subIconID;
    let subIconName =
      val.getSubIconsData != undefined
        ? val.getSubIconsData?.subIconName
        : val?.subIcon?.subIconName;

    setStuReportName(subIconName);
    SetCombineReport(false);
    setEditAss(prev => {
      return { ...prev, type: '', status: false };
    });
    setSelectedField({});
    setToolItems();
    setTrkSubject(false);
    setGameList(prev => {
      return { ...prev, status: false };
    });
    setIndicatorsList(prev => {
      return { ...prev, status: false };
    });


    if (val.testID != undefined) {
      if (val.isSeptAttempt) {
        setViewSeptReport(prev => {
          return { ...prev, data: val, status: true };
        });
        setIntor(prev => {
          return { ...prev, selectedSubIcon: val, instruction: false };
        });
      } else {
        setIntor(prev => {
          return { ...prev, selectedSubIcon: val, instruction: true };
        });
        setViewSeptReport(prev => {
          return { ...prev, status: false };
        });
      }
    } else if (
      activeSubIconIDs.includes(subIconID) &&
      !reportSubIconsIDs.includes(subIconID)
    ) {
      setCertificateAct(prev => {
        return { ...prev, create: false, issued: false, iconView: true };
      });
      if (subIconID == 96) {
        navigation.navigate('cbseSafal', val);
      } else if (subIconID == 54 || subIconID == 55) {
        setSelectedIcon(prev => {
          return { ...prev, name: subIconName, subIconID: subIconID };
        });
        getIndicatorList('', subIconID);
      } else {
        setSelectedField({});
        setToolItems();
        setSelectField(true);
        setSelectedIcon(prev => {
          return { ...prev, name: subIconName, subIconID: subIconID };
        });
      }
    } else if (
      activeSubIconIDs.includes(subIconID) &&
      reportSubIconsIDs.includes(subIconID)
    ) {
      setSelectedIcon(prev => {
        return { ...prev, name: subIconName, subIconID: subIconID };
      });
      if (userData.data.userTypeID == 5 || userData.data.userTypeID == 6) {
        if (val.mainIconID == 30 && subIconID == 97) {
          setLoading(true);
          const payload = {
            schoolID: userData.data.schoolID,
            academicYear: userData.data.academicYear,
            userRefID: userData.data.userRefID,
            classID: userData.data.classID,
            sectionID: userData.data.sectionID,
          };
          Services.post(apiRoot.consolidatedSeptReport, payload)
            .then(res => {
              if (res.status == 'success') {
                SetCombineReport(true);
                if (res?.data?.APP?.status == 'success') {
                  setLoading(false);
                  setConsolidatedReportData(prev => {
                    return { ...prev, APP: res.data.APP.data, status: true };
                  });
                } else if (res?.data?.APP?.status == 'error') {
                  setLoading(false);
                  setConsolidatedReportData(prev => {
                    return { ...prev, msg: res.data.APP.message, status: true };
                  });
                }
                if (res?.data?.LS?.status == 'success') {
                  setConsolidatedReportData(prev => {
                    return { ...prev, LS: res.data.LS.data, status: true };
                  });
                } else if (res?.data?.LS?.status == 'error') {
                  setLoading(false);
                  setConsolidatedReportData(prev => {
                    return { ...prev, msg: res.data.LS.message, status: true };
                  });
                }
                if (res?.data?.MI?.status == 'success') {
                  setConsolidatedReportData(prev => {
                    return { ...prev, MI: res.data.MI.data, status: true };
                  });
                } else if (res?.data?.MI?.status == 'error') {
                  setLoading(false);
                  setConsolidatedReportData(prev => {
                    return { ...prev, msg: res.data.MI.message, status: true };
                  });
                }
                if (res?.data?.KM?.status == 'success') {
                  const nameArray = [];
                  if (res.data.KM.data.pdCategoryNameList != undefined) {
                    for (
                      i = 0;
                      i < res.data.KM.data.pdCategoryNameList.length;
                      i++
                    ) {
                      nameArray.push(
                        res.data.KM.data.pdCategoryNameList[i]
                          .toString()
                          .replaceAll(',', ''),
                      );
                    }
                  }
                  setConsolidatedReportData(prev => {
                    return {
                      ...prev,
                      KM: res.data.KM.data,
                      legendList: nameArray,
                      status: true,
                    };
                  });
                } else if (res?.data?.KM?.status == 'error') {
                  setLoading(false);
                  setConsolidatedReportData(prev => {
                    return { ...prev, msg: res.data.KM.message, status: true };
                  });
                }
                if (res?.data?.BD?.status == 'success') {
                  setConsolidatedReportData(prev => {
                    return { ...prev, BD: res.data.BD.data, status: true };
                  });
                } else if (res?.data?.BD?.status == 'error') {
                  setLoading(false);
                  setConsolidatedReportData(prev => {
                    return { ...prev, msg: res.data.BD.message, status: true };
                  });
                }
              } else if (res.status == 'error') {
                setLoading(false);
                const message =
                  res.message == undefined
                    ? 'Student has not attempted any of the SEPT test.'
                    : res.message;
                alert(message);
              }
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              setLoading(false);
            });
        } else if (val.mainIconID == 30 && subIconID == 105) {
          setLoading(true);
          const payload = {
            schoolID: userData.data.schoolID,
            academicYear: userData.data.academicYear,
            userRefID: userData.data.userRefID,
            classID: userData.data.classID,
            sectionID: userData.data.sectionID,
          };
          Services.post(apiRoot.getHalfYearlyReports, payload)
            .then(res => {
              if (res.status == 'success') {
                setLoading(false);
                setReportData(prev => {
                  return { ...prev, data: res.data, status: true };
                });
              } else if (res.status == 'error') {
                setLoading(false);
                const message =
                  res.message == undefined
                    ? 'Student has not attempted this test.'
                    : res.message;
                alert(message);
              }
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              setLoading(false);
            });
        } else if (val.mainIconID == 30 && subIconID == 103) {
          setLoading(true);
          const payload = {
            schoolID: userData.data.schoolID,
            academicYear: userData.data.academicYear,
            classID: userData.data.classID,
            sectionID: userData.data.sectionID,
            userRefID: userData.data.userRefID,
          };
          Services.post(apiRoot.allSubjectStudentComparisonReport, payload)
            .then(res => {
              if (res.status == 'success') {
                setLoading(false);
                setReportData(prev => {
                  return { ...prev, data: res.data, status: true };
                });
              } else if (res.status == 'error') {
                setMsgModalVisible(prev => {
                  return {
                    ...prev,
                    msg: res.message,
                    status: true,
                    type: 'error',
                  };
                });
                setTimeout(() => {
                  setMsgModalVisible(prev => {
                    return { ...prev, status: false };
                  });
                }, 2000);
              }
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              setLoading(false);
            });
        } else if (val.mainIconID == 30 && subIconID == 101) {
          setLoading(true);
          const payload = {
            schoolID: userData.data.schoolID,
            academicYear: userData.data.academicYear,
            classID: userData.data.classID,
            sectionID: userData.data.sectionID,
            userRefID: userData.data.userRefID,
          };
          Services.post(apiRoot.getSubjectWiseDifficultyAnalysis, payload)
            .then(res => {
              if (res.status == 'success') {
                setLoading(false);
                setReportData(prev => {
                  return { ...prev, data: res.data, status: true };
                });
              } else if (res.status == 'error') {
                setMsgModalVisible(prev => {
                  return {
                    ...prev,
                    msg: res.message,
                    status: true,
                    type: 'error',
                  };
                });
                setTimeout(() => {
                  setMsgModalVisible(prev => {
                    return { ...prev, status: false };
                  });
                }, 2000);
              }
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              setLoading(false);
            });
        } else if (val.mainIconID == 30 && subIconID == 106) {
          setLoading(true);
          const payload = {
            schoolID: userData.data.schoolID,
            academicYear: userData.data.academicYear,
            classID: userData.data.classID,
            sectionID: userData.data.sectionID,
            userRefID: userData.data.userRefID,
          };
          Services.post(apiRoot.getAnnualReport, payload)
            .then(res => {
              if (res.status == 'success') {
                setLoading(false);
                setReportData(prev => {
                  return { ...prev, data: res.data, status: true };
                });
              } else if (res.status == 'error') {
                setMsgModalVisible(prev => {
                  return {
                    ...prev,
                    msg: res.message,
                    status: true,
                    type: 'error',
                  };
                });
                setTimeout(() => {
                  setMsgModalVisible(prev => {
                    return { ...prev, status: false };
                  });
                }, 2000);
              }
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      } else {
        const payload = {
          schoolID: userData.data.schoolID,
          subIconID: subIconID,
        };
        Services.post(apiRoot.getChildIcons, payload)
          .then(res => {
            if (res.status == 'success') {
              setChildIconsList(prev => {
                return { ...prev, listItem: res.data, status: true };
              });
            } else if (res.status == 'error') {
              alert(res.message);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(err => { });
      }
    } else if (assSubIconIDs.includes(subIconID)) {
      setSelectedIcon(prev => {
        return { ...prev, name: subIconName, subIconID: subIconID };
      });
    } else if (marksEntrySubIconID.includes(subIconID)) {
      setSelectedIcon(prev => {
        return { ...prev, name: subIconName, subIconID: subIconID };
      });
      if (subIconID == 59) {
        setSubjectMarksEntry(prev => {
          return { ...prev, list: null, status: false };
        });
      }
    } else {
      // alert('coming soon!')
    }
  }

  function getSeptReport(item) {
    if (item.data.testID == 1) {
      navigation.navigate('septAcademicReport', item.data);
    } else if (item.data.testID == 2) {
      navigation.navigate('septLearningReport', item.data);
    } else if (item.data.testID == 3) {
      navigation.navigate('septMultipleIntellReport', item.data);
    } else if (item.data.testID == 4) {
      navigation.navigate('septKnowingMeReport', item.data);
    } else if (item.data.testID == 5) {
      navigation.navigate('septBrainDominReport', item.data);
    }
  }

  function getListItem(type) {
    setLoading(true);
    setGameList(prev => {
      return { ...prev, status: false };
    });

    if (type == 'class' || type == 'trmClass') {
      setLoading(true);
      if (type == 'trmClass' && selectedField.trmType == null) {
        alert('Please select type.');
        setLoading(false);
      } else {
        const classPayload = {
          schoolID: userData?.data?.schoolID,
          userTypeID: userData?.data?.userTypeID,
        };
        if (userData.data.userTypeID == 4) {
          (classPayload['academicYear'] = userData?.data?.academicYear),
            (classPayload['userRefID'] = userData?.data?.userRefID);
        }
        Services.post(apiRoot.getClassList, classPayload)
          .then(res => {
            if (res.status == 'success') {
              setListItem(prev => {
                return { ...prev, list: res.data, status: true, type: type };
              });
              setLoading(false);
            } else if (res.status == 'error') {
              alert(res.message);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else if (type == 'section') {
      if (
        (userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2) &&
        selectedField.class == null
      ) {
        alert('Please select class.');
        setLoading(false);
      } else {
        const sectionPayload = {
          classID:
            userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2
              ? selectedField.class.classID
              : userData.data.classID,
          schoolID: userData?.data?.schoolID,
          userTypeID: userData?.data?.userTypeID,
          userRefID: userData?.data?.userRefID,
          academicYear: userData?.data?.academicYear,
        };
        Services.post(apiRoot.getSectionList, sectionPayload)
          .then(res => {
            if (res.status == 'success') {
              setListItem(prev => {
                return { ...prev, list: res.data, status: true, type: type };
              });
              setLoading(false);
            } else if (res.statue == 'error') {
              alert(res.message);
              setLoading(false);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else if (
      type == 'subject' ||
      type == 'trmSubject' ||
      type == 'gameSubject' ||
      type == 'subjAddBySchool'
    ) {
      if (type == 'subjAddBySchool') {
        if (selectedField.class == null || selectedField.section == null) {
          setLoading(false);
          alert('Please select required field.');
        } else {
          const payload = {
            schoolID: userData.data.schoolID,
            classID: selectedField.class.classID,
            sectionID: selectedField.section.sectionID,
            // academicYear: userData.data.academicYear,
          };
          Services.post(apiRoot.getSubjectAddedBySchool, payload)
            .then(res => {
              if (res.status == 'success') {
                setLoading(false);
                setListItem(prev => {
                  return { ...prev, list: res.data, status: true, type: type };
                });
              } else if (res.status == 'failed') {
                setLoading(false);
                alert(res.message);
              }
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      } else {
        if (ncertIDs.includes(selectedIcon.subIconID)) {
          if (
            type == 'trmSubject' &&
            (selectedField.trmType == null ||
              selectedField.class == null ||
              selectedField.section == null)
          ) {
            alert('Please select required field.');
            setLoading(false);
          } else {
            Services.post(apiRoot.getNcertSubjectOfClass, {
              classID:
                userData?.data?.userTypeID == 4 ||
                  userData?.data?.userTypeID == 2
                  ? selectedField?.class?.classID
                  : userData?.data?.classID,
            })
              .then(res => {
                if (res.status == 'success') {
                  setListItem(prev => {
                    return {
                      ...prev,
                      list: res.data,
                      status: true,
                      type: type,
                    };
                  });
                  setLoading(false);
                } else if (res.status == 'error') {
                  setLoading(false);
                  alert(res.message);
                }
              })
              .catch(err => {
                console.log(err);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        } else {
          setLoading(true);
          if (
            (userData?.data?.userTypeID == 4 ||
              userData?.data?.userTypeID == 2) &&
            (selectedField.class == null || selectedField.section == null)
          ) {
            alert('Please select section.');
            setLoading(false);
          } else {
            const subjectPayload = {
              schoolID: userData?.data?.schoolID,
              userTypeID: userData?.data?.userTypeID,
              academicYear: userData?.data?.academicYear,
              userRefID: userData?.data?.userRefID,
              classID:
                userData?.data?.userTypeID == 4 ||
                  userData?.data?.userTypeID == 2
                  ? selectedField.class.classID
                  : userData.data.classID,
              sectionID:
                userData?.data?.userTypeID == 4 ||
                  userData?.data?.userTypeID == 2
                  ? selectedField.section.sectionID
                  : userData.data.sectionID,
            };
            Services.post(apiRoot.getSubjectList, subjectPayload)
              .then(res => {
                if (res.status == 'success') {
                  setListItem(prev => {
                    return {
                      ...prev,
                      list: res.data,
                      status: true,
                      type: type,
                    };
                  });
                  setLoading(false);
                } else if (res.status == 'failed') {
                  alert(res.message);
                }
              })
              .catch(err => {
                console.log(err);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        }
      }
    } else if (type == 'book') {
      setLoading(true);
      if (ncertIDs.includes(selectedIcon.subIconID)) {
        if (
          (userData?.data?.userTypeID == 4 ||
            userData?.data?.userTypeID == 2) &&
          (selectedField.class == null ||
            selectedField.section == null ||
            selectedField.subject == null)
        ) {
          alert('Please select required fields.');
          setLoading(false);
        } else {
          const payload = {
            classID:
              userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2
                ? selectedField.class.classID
                : userData.data.classID,
            subjectID: selectedField?.subject?.subjectID,
            schoolID: userData.data.schoolID,
          };
          Services.post(apiRoot.ncertBookAccToSubject, payload)
            .then(res => {
              if (res.status == 'success') {
                setListItem(prev => {
                  return {
                    ...prev,
                    list: res.bookData,
                    status: true,
                    type: type,
                  };
                });
                setLoading(false);
              } else if (res.status == 'failed') {
                setLoading(false);
                alert(res.msg);
              }
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      } else {
        if (
          (userData?.data?.userTypeID == 4 ||
            userData?.data?.userTypeID == 2) &&
          (selectedField.class == null ||
            selectedField.section == null ||
            selectedField.subject == null)
        ) {
          alert('Please select subject.');
          setLoading(false);
        } else {
          if (selectedField.subject == null) {
            alert('Please select subject.');
            setLoading(false);
          } else {
            const bookPayload = {
              schoolID: userData?.data?.schoolID,
              classID:
                userData?.data?.userTypeID == 4 ||
                  userData?.data?.userTypeID == 2
                  ? selectedField.class.classID
                  : userData.data.classID,
              subjectID: selectedField?.subject?.subjectID,
              isAssess: '',
            };
            Services.post(apiRoot.getBooksList, bookPayload)
              .then(res => {
                if (res.status == 'success') {
                  setListItem(prev => {
                    return {
                      ...prev,
                      list: res.data,
                      status: true,
                      type: type,
                    };
                  });
                  setLoading(false);
                } else {
                  setLoading(false);
                  alert(res.message);
                }
              })
              .catch(err => {
                console.log(err);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        }
      }
    } else if (type == 'trk') {
      setListItem(prev => {
        return { ...prev, list: trkLevelItems, status: true, type: type };
      });
      setLoading(false);
    } else if (type == 'trksub') {
      setListItem(prev => {
        return { ...prev, list: trkSubjectList, status: true, type: type };
      });
      setLoading(false);
    } else if (type == 'gameSubject') {
      if (
        userData?.data?.userTypeID == 4 ||
        (userData?.data?.userTypeID == 2 && selectedField.class == null)
      ) {
        alert('Please select class.');
        setLoading(false);
      } else {
        const payload = {
          classID:
            userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2
              ? selectedField.class.classID
              : userData.data.classID,
          schoolID: userData?.data?.schoolID,
          academicYear: userData?.data?.academicYear,
          sectionID: '',
          isAssess: 0,
        };
        Services.post(apiRoot.swaGamesSubjectForSchool, payload)
          .then(res => {
            if (res.status == 'success') {
              setListItem(prev => {
                return {
                  ...prev,
                  list: res.subjectList,
                  status: true,
                  type: type,
                };
              });
              setLoading(false);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else if (type == 'trmType') {
      setListItem(prev => {
        return { ...prev, list: trmTypeList, status: true, type: type };
      });
      setLoading(false);
    } else if (type == 'assessment') {
      if (selectedField.subject == null) {
        alert('Please select subject.');
        setLoading(false);
      } else {
        let payload = {
          schoolID: userData.data.schoolID,
          classID:
            (mainIconID == 30 && selectedIcon.subIconID == 104) ||
              selectedIcon.subIconID == 98
              ? userData?.data?.classID
              : selectedField?.class?.classID,
          sectionID:
            (mainIconID == 30 && selectedIcon.subIconID == 104) ||
              selectedIcon.subIconID == 98
              ? userData?.data?.sectionID
              : selectedField?.section?.sectionID,
          subjectID: selectedField?.subject?.subjectID,
          academicYear: userData.data?.academicYear,
        };
        Services.post(apiRoot.getAssessmentData, payload)
          .then(res => {
            if (res.status == 'success') {
              setLoading(false);
              setListItem(prev => {
                return { ...prev, list: res.data, status: true, type: type };
              });
            } else if (res.status == 'failed') {
              setLoading(false);
              alert(res.message);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else if (type == 'meFormet') {
      if (selectedField.markAss == null) {
        setLoading(false);
        alert('Please select assessment name.');
      } else {
        setListItem(prev => {
          return { ...prev, list: marksEntryFormat, status: true, type: type };
        });
        setLoading(false);
      }
    } else if (type == 'term') {
      if (selectedField.class == null || selectedField.section == null) {
        alert('Please select required field.');
        setLoading(false);
      } else {
        const termArray = [
          { term: 'First', id: 1 },
          { term: 'Second', id: 2 },
        ];
        setListItem(prev => {
          return { ...prev, list: termArray, status: true, type: type };
        });
        setLoading(false);
      }
    } else if (type == 'marksType') {
      if (
        selectedField.class == null ||
        selectedField.section == null ||
        selectedField.term == null
      ) {
        setLoading(false);
        alert('Please select required field.');
      } else {
        const marksType = [
          { marksType: 'Numerical Grade', id: 1 },
          { marksType: 'Letter Grade', id: 2 },
        ];
        setListItem(prev => {
          return { ...prev, list: marksType, status: true, type: type };
        });
        setLoading(false);
      }
    } else if (type == 'student') {
      if (
        selectedField.class != null &&
        selectedField.section != null &&
        selectedField.subject != null
      ) {
        const payload = {
          schoolID: userData.data.schoolID,
          classID: selectedField.class.classID,
          sectionID: selectedField.section.sectionID,
          subjectID: selectedField.subject.subjectID,
        };
        Services.post(apiRoot.getStudentsForCertificate, payload)
          .then(res => {
            if (res.status == 'success') {
              setLoading(false);
              setListItem(prev => {
                return {
                  ...prev,
                  list: res.data,
                  status: true,
                  type: 'student',
                };
              });
            } else {
              setLoading(false);
              alert(res.message);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        alert('Please select required fields.');
        setLoading(false);
      }
    }
  }

  function getSelectedItem(item, type) {
    if (type == 'class' || type == 'trmClass') {
      setSelectedField(prev => {
        return {
          ...prev,
          class: item,
          section: null,
          subject: null,
          book: null,
          level: null,
          trkSub: null,
        };
      });
      setListItem(prev => {
        return { ...prev, status: false };
      });
      setToolItems();
    } else if (type == 'section') {
      setSelectedField(prev => {
        return {
          ...prev,
          section: item,
          subject: null,
          book: null,
          level: null,
          trkSub: null,
        };
      });
      setListItem(prev => {
        return { ...prev, status: false };
      });
      setToolItems();
    } else if (
      type == 'subject' ||
      type == 'gameSubject' ||
      type == 'trmSubject' ||
      type == 'subjAddBySchool'
    ) {
      setSelectedField(prev => {
        return {
          ...prev,
          subject: item,
          book: null,
          level: null,
          trkSub: null,
          student: null,
          markAss: null,
        };
      });
      setListItem(prev => {
        return { ...prev, status: false };
      });
      setToolItems();
      if (type == 'gameSubject') {
        setLoading(true);
        const payload = {
          classID:
            userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2
              ? selectedField.class.classID
              : userData.data.classID,
          subjectID: item.subjectID,
        };
        Services.post(apiRoot.getAppSwaGamesLink, payload)
          .then(res => {
            if (res.status == 'success') {
              setLoading(false);
              setGameList(prev => {
                return { ...prev, data: res.data, status: true };
              });
            } else {
              setMsgModalVisible(prev => {
                return {
                  ...prev,
                  msg: res.message,
                  status: true,
                  type: 'error',
                };
              });
              setTimeout(() => {
                setMsgModalVisible(prev => {
                  return { ...prev, status: false };
                });
              }, 2000);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (type == 'trmSubject') {
        setLoading(true);
        const payload = {
          classID: selectedField.class.classID,
          subjectID: item.subjectID,
          schoolID: userData?.data?.schoolID,
          lessonType: selectedField.trmType.trmID,
        };
        Services.post(apiRoot.trmLessonPlanOfClass, payload)
          .then(res => {
            if (res.status == 'success') {
              navigation.navigate('pdfView', {
                url: res.data.siteUrl + res.data.mainData[0].pdfPath,
                title: 'TRM',
              });
              setLoading(false);
            }
          })
          .then(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (type == 'subjAddBySchool') {
        getStudentListWithSubjectMarks(item, (type = 'subject'));
      } else if (selectedIcon.subIconID == 102) {
        setLoading(true);
        const payload = {
          schoolID: userData.data.schoolID,
          academicYear: userData.data.academicYear,
          classID: userData.data.classID,
          sectionID: userData.data.sectionID,
          userRefID: userData.data.userRefID,
          subjectID: item.subjectID,
        };
        Services.post(apiRoot.subjectWiseStudentComparisonReport, payload)
          .then(res => {
            if (res.status == 'success') {
              setLoading(false);
              setReportData(prev => {
                return { ...prev, data: res.data, status: true };
              });
            } else if (res.status == 'error') {
              setMsgModalVisible(prev => {
                return {
                  ...prev,
                  msg: res.message,
                  status: true,
                  type: 'error',
                };
              });
              setTimeout(() => {
                setMsgModalVisible(prev => {
                  return { ...prev, status: false };
                });
              }, 2000);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (selectedIcon.subIconID == 100) {
        setLoading(true);
        const payload = {
          schoolID: userData.data.schoolID,
          academicYear: userData.data.academicYear,
          classID: userData.data.classID,
          sectionID: userData.data.sectionID,
          userRefID: userData.data.userRefID,
          userTypeID: userData.data.userTypeID,
          subjectID: item.subjectID,
        };
        Services.post(apiRoot.getSubjectWiseComprehensiveReport, payload)
          .then(res => {
            if (res.status == 'success') {
              setLoading(false);
              setReportData(prev => {
                return { ...prev, data: res.data, status: true };
              });
            } else if (res.status == 'error') {
              setMsgModalVisible(prev => {
                return {
                  ...prev,
                  msg: res.message,
                  status: true,
                  type: 'error',
                };
              });
              setTimeout(() => {
                setMsgModalVisible(prev => {
                  return { ...prev, status: false };
                });
              }, 2000);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (selectedIcon.subIconID == 99) {
        setLoading(true);
        const payload = {
          schoolID: userData.data.schoolID,
          academicYear: userData.data.academicYear,
          classID: userData.data.classID,
          sectionID: userData.data.sectionID,
          userRefID: userData.data.userRefID,
          userTypeID: userData.data.userTypeID,
          subjectID: item.subjectID,
        };
        Services.post(apiRoot.getAssessmentWiseSubjectReport, payload)
          .then(res => {
            if (res.status == 'success') {
              setLoading(false);
              setReportData(prev => {
                return { ...prev, data: res.data, status: true };
              });
            } else if (res.status == 'error') {
              setMsgModalVisible(prev => {
                return {
                  ...prev,
                  msg: res.message,
                  status: true,
                  type: 'error',
                };
              });
              setTimeout(() => {
                setMsgModalVisible(prev => {
                  return { ...prev, status: false };
                });
              }, 2000);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else if (type == 'book') {
      if (ncertIDs.includes(selectedIcon.subIconID)) {
        setSelectedField(prev => {
          return { ...prev, book: item };
        });
        setListItem(prev => {
          return { ...prev, status: false };
        });
        const payload = {
          classID:
            userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2
              ? selectedField.class.classID
              : userData.data.classID,
          subjectID: selectedField.subject.subjectID,
          // schoolID: userData.data.schoolID,
          bookID: item.bookID,
        };
        console.log(payload, 'pay')
        Services.post(apiRoot.getChapterOfNcertBook, payload).then(res => {
          if (res.status == 'success') {
            navigation.navigate('ncert', {
              data: res.chapData,
              selectedField: selectedField,
            });
          }
        });
      } else {
        setSelectedField(prev => {
          return { ...prev, book: item };
        });
        setListItem(prev => {
          return { ...prev, status: false };
        });
        getLearningToolsList(item);
      }
    } else if (type == 'trk') {
      if (item.levelID == 2) {
        setTrkSubject(true);
      } else {
        setTrkSubject(false);
        navigation.navigate('pdfView', {
          url: 'https://swaadhyayan.com/data/TRM_PDF/Kindergarten.pdf',
          title: 'TRK',
        });
      }
      setSelectedField(prev => {
        return { ...prev, level: item };
      });
      setListItem(prev => {
        return { ...prev, status: false };
      });
    } else if (type == 'trksub') {
      let pdfPath = '';
      if (item.subjectID == 1) {
        navigation.navigate('pdfView', {
          url: 'https://swaadhyayan.com/data/TRM_PDF/Hindi.pdf',
          title: 'TRK_Hindi',
        });
      } else if (item.subjectID == 2) {
        navigation.navigate('pdfView', {
          url: 'https://swaadhyayan.com/data/TRM_PDF/English.pdf',
          title: 'TRK_English',
        });
      } else if (item.subjectID == 3) {
        navigation.navigate('pdfView', {
          url: 'https://swaadhyayan.com/data/TRM_PDF/Math.pdf',
          title: 'TRK_Math',
        });
      } else if (item.subjectID == 4) {
        navigation.navigate('pdfView', {
          url: 'https://swaadhyayan.com/data/TRM_PDF/Science.pdf',
          title: 'TRK_Science',
        });
      } else if (item.subjectID == 5) {
        navigation.navigate('pdfView', {
          url: 'https://swaadhyayan.com/data/TRM_PDF/Social_Science.pdf',
          title: 'TRK_Social Science',
        });
      } else if (item.subjectID == 6) {
        navigation.navigate('pdfView', {
          url: 'https://swaadhyayan.com/data/TRM_PDF/EVS.pdf',
          title: 'TRK_EVS',
        });
      }
      setSelectedField(prev => {
        return { ...prev, trkSub: item };
      });
      setListItem(prev => {
        return { ...prev, status: false };
      });
    } else if (type == 'trmType') {
      setSelectedField(prev => {
        return {
          ...prev,
          trmType: item,
          class: null,
          section: null,
          book: null,
          level: null,
          trkSub: null,
        };
      });
      setListItem(prev => {
        return { ...prev, status: false };
      });
    } else if (type == 'assessment') {
      if (mainIconID == 30 && selectedIcon.subIconID == 104) {
        setLoading(true);
        const payload = {
          classID: userData.data.classID,
          sectionID: userData.data.sectionID,
          studentID: userData.data.userRefID,
          subjectID: selectedField.subject.subjectID,
          assessmentID: item.assessmentID,
          academicYear: userData.data.academicYear,
          schoolID: userData.data.schoolID,
        };
        Services.post(apiRoot.assessmentWiseStudentComparisonReport, payload)
          .then(res => {
            if (res.status == 'success') {
              setLoading(false);
              setReportData(prev => {
                return { ...prev, data: res.data, status: true };
              });
            } else if (res.status == 'info') {
              setLoading(false);
              setMsgModalVisible(prev => {
                return {
                  ...prev,
                  msg: res.message,
                  status: true,
                  type: 'error',
                };
              });
              setTimeout(() => {
                setMsgModalVisible(prev => {
                  return { ...prev, status: false };
                });
              }, 2000);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (mainIconID == 30 && selectedIcon.subIconID == 98) {
        setLoading(true);
        const payload = {
          schoolID: userData.data.schoolID,
          academicYear: userData.data.academicYear,
          userRefID: userData.data.userRefID,
          classID: userData.data.classID,
          sectionID: userData.data.sectionID,
          subjectID: selectedField.subject.subjectID,
          assessmentID: item.assessmentID,
        };
        Services.post(apiRoot.chapterWiseStudentAssessmentReport, payload)
          .then(res => {
            if (res.status == 'success') {
              setLoading(false);
              setReportData(prev => {
                return { ...prev, data: res.data, status: true };
              });
            } else if (res.status == 'error') {
              setMsgModalVisible(prev => {
                return {
                  ...prev,
                  msg: res.message,
                  status: true,
                  type: 'error',
                };
              });
              setTimeout(() => {
                setMsgModalVisible(prev => {
                  return { ...prev, status: false };
                });
              }, 2000);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
      setSelectedField(prev => {
        return { ...prev, markAss: item, markFormet: null };
      });
      setListItem(prev => {
        return { ...prev, status: false };
      });
    } else if (type == 'meFormet') {
      setSelectedField(prev => {
        return { ...prev, markFormet: item };
      });
      setListItem(prev => {
        return { ...prev, status: false };
      });
      navigation.navigate('assMarkEntry', {
        data: selectedField,
        isfullMark: item,
      });
    } else if (type == 'term') {
      setSelectedField(prev => {
        return { ...prev, term: item, marksType: null };
      });
      setListItem(prev => {
        return { ...prev, status: false };
      });
      if (selectedIcon.subIconID == 58) {
        const sendData = {
          classID: selectedField.class.classID,
          sectionID: selectedField.section.sectionID,
          subjectID: selectedField.subject.subjectID,
          termID: item.id,
        };
        navigation.navigate('nootbookMarksEntry', sendData);
      }
    } else if (type == 'marksType') {
      let marksType = '';
      if (item.id == 1) {
        marksType = 'numerical';
      } else if (item.id == 2) {
        marksType = 'letter';
      }
      setSelectedField(prev => {
        return { ...prev, marksType: item };
      });
      setListItem(prev => {
        return { ...prev, status: false };
      });

      const sendData = {
        groupID: selectedIcon.subIconID == 56 ? 1 : 2,
        selectedField: selectedField,
        marksType: marksType,
      };
      navigation.navigate('indicatorGradeEntry', sendData);
    } else if (type == 'student') {
      setSelectedField(prev => {
        return { ...prev, student: item };
      });
      setListItem(prev => {
        return { ...prev, status: false };
      });
      getStudentReportData(item);
    }
  }
  function getStudentListWithSubjectMarks(item, type) {
    let subjectID = item.subjectID;
    let termID = 1;
    if (type == 'subject') {
      termID = item.subjectID;
      termID = 1;
    } else if (type == 'term1') {
      subjectID = selectedField.subject.subjectID;
      termID = item;
    } else if (type == 'term2') {
      subjectID = selectedField.subject.subjectID;
      termID = item;
    }
    const payload = {
      schoolID: userData.data.schoolID,
      academicYear: userData.data.academicYear,
      transYear: userData.data.transYear,
      classID: selectedField.class.classID,
      sectionID: selectedField.section.sectionID,
      subjectID: subjectID,
      termID: termID,
    };
    Services.post(apiRoot.getStudentListWithSubjectMarks, payload)
      .then(res => {
        if (res.status == 'success') {
          setSubjectMarksEntry(prev => {
            return { ...prev, list: res.data, termID: termID, status: true };
          });
        } else if (res.status == 'failed') {
          alert(res.message);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => { });
  }
  function getStudentReportData(item) {
    setLoading(true);
    const payload = {
      studentID: item.userRefID,
    };
    Services.post(apiRoot.getStudentReportData, payload)
      .then(res => {
        if (res.status == 'success') {
          setLoading(false);
          navigation.navigate('homeWorkReport', res.data);
        } else {
          alert(res.message);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function getLearningToolsList(item, type) {
    if (type == 'search') {
      setSelectedField(prev => {
        return {
          ...prev,
          class: item.chapter.classID,
          section: item.chapter.sectionID,
          book: item.chapter.bookID,
          subject: item.chapter.subjectID,
        };
      });
    }
    let classID =
      type == 'search'
        ? item.chapter.classID
        : userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2
          ? selectedField.class.classID
          : userData.data.classID;
    let subjectID = type == 'search' ? item.chapter.sectionID : item.subjectID;
    let bookID = type == 'search' ? item.chapter.bookID : item.bookID;
    setGameList(prev => {
      return { ...prev, status: false };
    });
    setLoading(true);
    const toolsPayload = {
      classID: classID,
      subjectID: subjectID,
      bookID: bookID,
      userTypeID: userData?.data?.userTypeID,
      schoolID: userData.data.schoolID
    };
    dispatch(fetchLearningTool(toolsPayload));
    Services.post(apiRoot.getLearningTools, toolsPayload)
      .then(res => {
        if (res.status == 'success') {
          setToolItems(res)
          if (item.mainIconID == 17 || item.mainIconID == 28) {
            getModuleActivityData(item, type, '', '', navigation);
          }
          setSelectField(false);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  function getModuleActivityData(item, val1, val2, val3, navigation) {
    setSelectField(false);
    let classID =
      userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2
        ? val1 != 'search'
          ? selectedField?.class?.classID
          : item.chapter.classID
        : userData?.data?.classID;
    let subjectID =
      val1 != 'search'
        ? item.bookID == 27
          ? item.subjectID
          : selectedField.subject?.subjectID || item.bookID == 30
            ? item.subjectID
            : selectedField.subject?.subjectID || item.bookID == 33
              ? item.subjectID
              : selectedField.subject?.subjectID
        : item?.chapter?.subjectID;
    let childIconID =
      item?.subIcon?.childIcon != undefined
        ? item?.subIcon?.childIcon?.childIconID
        : item.childIconID;
    let subTypeID =
      item.chapter != undefined ? item.chapter?.subTypeID : item?.subTypeID;
    let bookID = val1 != 'search' ? item.bookID : item?.chapter?.bookID;
    // let bookID = val1!="search" ?selectedField?.book?.bookID:item?.chapter?.bookID
    let urlLink = val1 != 'search' ? item.urlLink : item?.chapter?.urlLink;

    if (childIconID != undefined) {
      navigation.navigate('viewReport', { data: item });
    } else {
      let actArr = ['134', '135', '136', '137', '73', '68', '77'];
      if (classID == 13) {
        actArr = ['134', '135', '136', '137', '77', '171'];
      }
      let pdfact = ['169', '73', '74', '186', '191', '170', '69', '187', '192', '76', '78', '188', '193'];
      const sendData = {
        screenName:
          subjectID == 1
            ? item.chapter != undefined
              ? item.chapter.subjectSubCategory
              : item.subjectSubCatLang2
            : item.chapter != undefined
              ? item.chapter.subjectSubCategory
              : item.subjectSubCatLang1?.replace('<br>', ''),
        subTypeID: subTypeID,
        classID: classID,
        subjectID: subjectID,
        bookID: bookID,
      };
      if (
        ((item.isSubMenu == 1 || item?.chapter?.isSubMenu == 1) &&
          (item.isElearning != 1 || item?.chapter?.isElearning != 1)) ||
        pdfact.includes(subTypeID)
      ) {
        setLoading(true);

        if (
          (item.subTypeID == 73 && classID != 13) ||
          item.subTypeID == 171 ||
          item.subTypeID == 77 ||
          item.subTypeID == 68
        ) {
          const payload = {
            classID: classID,
            subjectID: item.subjectID,
            subTypeID: item.subTypeID,
            chapterID: '',
          };
          Services.post(apiRoot.getLearningRightToolsList, payload)
            .then(res => {
              if (res.status == 'success') {
                setLoading(false);
                navigation.navigate('ViewFunBag', {
                  data: res.data,
                  selectItem: item,
                  classID: selectedField,
                });
              } else {
                alert(res.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          const activityPayload = {
            classID:
              userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2
                ? val1 != 'search'
                  ? selectedField.class.classID
                  : classID
                : userData.data.classID,
            subjectID:
              val1 != 'search' ? item.subjectID : item.chapter.subjectID,
            subTypeID:
              val1 != 'search' ? item.subTypeID : item.chapter.subTypeID,
            bookID:
              item.bookID != '' ||
                (item.chapter.bookID != '' && item.bookID != null) ||
                item.chapter.bookID != null
                ? val1 != 'search'
                  ? item.bookID
                  : item.chapter.bookID
                : '',
            schoolID: userData?.data?.schoolID,
            academicYear: userData?.data?.academicYear,
            urlLink:
              item.urlLink != '' && item.urlLink != null
                ? val1 != 'search'
                  ? item.urlLink
                  : item.chapter.urlLink
                : '',
          };
          dispatch(fetModuleActivityList(activityPayload));
          navigation.navigate('activityListScreen', {
            item: item,
            sendData: sendData,
            urlLink: 'swaWithTextbook',
          });
        }
      } else if (item.urlLink == 'bookPDF') {
        const activityPayload = {
          classID: classID,
          subjectID: subjectID,
          subTypeID: subTypeID,
          bookID: bookID != '' && bookID != null ? bookID : '',
          // "bookID": item.bookID,
          schoolID: userData?.data?.schoolID,
          academicYear: userData?.data?.academicYear,
          urlLink: urlLink != '' && urlLink != null ? urlLink : '',
        };

        Services.post(apiRoot.getModuleActivityData, activityPayload)
          .then(res => {
            if (res.status == 'success') {
              setLoading(false);
              navigation.navigate('pdfView', {
                url:
                  res.data.mainData[0].filePath +
                  res.data.mainData[0].uploadFileName,
                title: res.data.mainData[0].chapterName,
                urlLink: 'bookPDF',
              });
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        const activityPayload = {
          classID: classID,
          subjectID: subjectID,
          subTypeID: subTypeID,
          bookID: bookID != '' && bookID != null ? bookID : '',
          // "bookID": item.bookID,
          schoolID: userData?.data?.schoolID,
          academicYear: userData?.data?.academicYear,
          urlLink: urlLink != '' && urlLink != null ? urlLink : '',
        };
        dispatch(fetModuleActivityList(activityPayload));
        navigation.navigate('activityListScreen', {
          item: item,
          sendData: sendData,
          urlLink: 'swaWithTextbook',
        });
      }
    }
  }

  function getAttemptedScreen(testID, testName) {
    if (viewSeptReport.status == 'false') {
      alert('This test is already attempted.');
    } else {
      const classID =
        userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2
          ? selectedField.class.classID
          : userData.data.classID;
      navigation.navigate('septAttempt', {
        classID: classID,
        testID: testID,
        testData: intro,
        schoolID: userData?.data?.schoolID,
      });
    }
  }

  function getGameView(url) {
    navigation.navigate('gameView', { url: url });
  }

  function handleInputChange(val, type) {
    setInputField(prev => {
      return { ...prev, assName: val };
    });
  }

  function coScholasticIndicator(subIconID) {
    let groupID = null;
    if (subIconID == 54) {
      groupID = 1;
    } else if (subIconID == 55) {
      groupID = 2;
    }

    if (selectedField.class == null || inputField == '') {
      alert('Please select required fields.');
    } else {
      const payload = {
        schoolID: userData.data.schoolID,
        classID: selectedField.class.classID,
        groupID: groupID,
        indicatorName: inputField.assName,
      };
      Services.post(apiRoot.coScholasticIndicatorSave, payload)
        .then(res => {
          if (res.status == 'success') {
            alert(res.message);
            getIndicatorList('', subIconID);
          } else if (res.status == 'error') {
            alert(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => { });
    }
  }

  function getIndicatorList(indicatorID, subIconID) {
    let groupID = null;
    if (subIconID == 54) {
      groupID = 1;
    } else if (subIconID == 55) {
      groupID = 2;
    }
    setLoading(true);
    const payload = {
      schoolID: userData.data.schoolID,
      groupID: groupID,
      academicYear: userData.data.academicYear,
      userTypeID: userData.data.userTypeID,
      userRefID: userData.data.userRefID,
    };
    Services.post(apiRoot.getIndicatorList, payload).then(res => {
      if (res.status == 'success') {
        setIndicatorsList(prev => {
          return { ...prev, data: res.indicatorList, status: true };
        });
        res.indicatorList.map((item, index) => {
          if (item.indicatorID == indicatorID) {
            seteditIndicator(prev => {
              return { ...prev, editItem: item, status: true };
            });
          }
        });
        setLoading(false);
      } else if (res.status == 'failed') {
        setIndicatorsList(prev => {
          return { ...prev, data: null, msg: res.message, status: true };
        });
        setLoading(false);
      }
    });
  }

  function actionOnIndicator(item, type) {
    let actionName = '';
    if (type == 'addIndicator') {
      actionName = 'Manage Indicator';
      seteditIndicator(prev => {
        return {
          ...prev,
          action: actionName,
          editItem: item,
          type: type,
          status: true,
        };
      });
    } else if (type == 'editIndicator') {
      actionName = 'Edit Indicator and Sub Indicator';
    } else if (type == 'removeIndicator') {
      const payload = {
        schoolID: userData.data.schoolID,
        indicatorID: item.indicatorID,
      };
      Services.post(apiRoot.deleteAppIndicator, payload).then(res => {
        if (res.status == 'success') {
          alert(res.message);
          getIndicatorList('', selectedIcon.subIconID);
        }
      });
    }
  }

  function addSubIndicatorText(val) {
    setsubIndicatorName(val);
  }

  function addSubIndicator(val, indicatorID) {
    const payload = {
      schoolID: userData.data.schoolID,
      indicatorID: indicatorID,
      subIndicatorName: val,
    };
    Services.post(apiRoot.saveAppSubIndicator, payload).then(res => {
      if (res.status == 'success') {
        setsubIndicatorName('');
        getIndicatorList(indicatorID, selectedIcon.subIconID);
      } else {
        alert(res.message);
      }
    });
  }
  function removesubIndicator(item, indicatorID) {
    const payload = {
      schoolID: userData.data.schoolID,
      subIndicatorID: item.subIndicatorID,
    };
    Services.post(apiRoot.deleteSubIndicator, payload)
      .then(res => {
        if (res.status == 'success') {
          getIndicatorList(indicatorID, selectedIcon.subIconID);
        } else {
          alert(res.message);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => { });
  }
  //   const subIndicatorIDs=[]

  function updateIndicator(item, id, indName, indCls) {
    let subIndcatorIDs = [];
    let subIndcatorVals = [];
    item.subIndicator.map((val, ind) => {
      subIndcatorIDs.push(val.id);
      subIndcatorVals.push(val.val);
    });
    const payload = {
      schoolID: userData.data.schoolID,
      classID: indCls,
      indicatorID: id,
      groupID: 1,
      subIndicatorIDs: subIndcatorIDs.toString(),
      indicatorName: item.indicatorName == null ? indName : item.indicatorName,
      subIndicatorName: subIndcatorVals.toString(),
    };
    Services.post(apiRoot.editIndicatorNSubIndicator, payload)
      .then(res => {
        if (res.status == 'success') {
          alert(res.message);
          seteditIndicator(prev => {
            return { ...prev, status: false };
          });
          getIndicatorList('', selectedIcon.subIconID);
        } else if (res.status == 'error') {
          alert(res.message);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => { });
  }
  function certificateAction(type) {
    if (type == 'create') {
      setCertificateAct(prev => {
        return { ...prev, create: true, issued: false, iconView: false };
      });
    } else {
      setCertificateAct(prev => {
        return { ...prev, create: false, issued: true, iconView: false };
      });
    }
  }
  function editAssessment(item) {
    setEditAss(prev => {
      return { ...prev, type: 'editAss', data: item, status: true };
    });
  }

  function iconLoader() {
    setLoading(false);
  }

  return (
    <SafeAreaProvider
      style={{
        paddingTop: insets.top,
        backgroundColor: userData.data.colors.mainTheme,
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <View
          style={{
            marginBottom: insets.bottom,
            flex: 1,
            backgroundColor: userData.data.colors.liteTheme,
          }}
        >
          <>
            <SwaHeader
              title={toolName}
              leftIcon={'arrowleft'}
              onClickLeftIcon={onClickLeftIcon}
            />
            <IconsContainer
              deshboardData={subIconsData}
              getIconDetail={getIconDetail}
              type={'subIcon'}
              selectSubIcon={intro}
              selectedIcon={selectedIcon}
              iconLoader={iconLoader}
            />

            {viewSeptReport.status ? (
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: SWATheam.SwaWhite,
                  margin: 10,
                  padding: 10,
                  borderRadius: 10,
                  elevation: 7,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: SWATheam.SwaBlack }}>
                    {viewSeptReport.data.testType}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: userData.data.colors.mainTheme,
                    alignSelf: 'center',
                    padding: 6,
                    borderRadius: 6,
                    marginLeft: 20,
                  }}
                  onPress={() => getSeptReport(viewSeptReport)}
                >
                  <Text style={{ color: SWATheam.SwaWhite }}>View Report</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {/* || selectedIcon.subIconID == 124 */}
                {((mainIconID == 17 || mainIconID == 28) &&
                  stuReportName == 'CBSE') ||
                  selectedIcon.name == 'CBSE' ||
                  selectedIcon.name == 'ICSE' ||
                  selectedIcon.name == 'NCERT' ? (
                  <>
                    {selectField && mainIconID != 27 ? (
                      <View style={{ padding: 10 }}>
                        {userData.data.userTypeID == 4 ||
                          userData.data.userTypeID == 2 ? (
                          <>
                            <SelectionBox
                              getListItem={getListItem}
                              selectedField={
                                selectedField?.class?.getClassDetail?.classDesc
                              }
                              type="class"
                              placeholder={'Select class'}
                            />
                            <SelectionBox
                              getListItem={getListItem}
                              selectedField={
                                selectedField?.section?.sectionName
                              }
                              type="section"
                              placeholder="Select section"
                            />
                          </>
                        ) : null}
                        <SelectionBox
                          getListItem={getListItem}
                          selectedField={selectedField?.subject?.subjectName}
                          type="subject"
                          placeholder="Select subject"
                        />
                        <SelectionBox
                          getListItem={getListItem}
                          selectedField={
                            selectedField?.subject?.subjectID == 1
                              ? selectedField?.book?.bookNameLang2
                              : selectedField?.book?.bookName
                          }
                          type="book"
                          placeholder="Select book"
                        />
                      </View>
                    ) : null}
                  </>
                ) : null}
                {selectField &&
                  selectedIcon.subIconID == 48 &&
                  stuReportName != 'CBSE' ? (
                  <View style={{ padding: 10 }}>
                    <SelectionBox
                      getListItem={getListItem}
                      selectedField={selectedField?.level?.level}
                      type="trk"
                      placeholder="Select levels"
                    />
                    {trkSubject && (
                      <SelectionBox
                        getListItem={getListItem}
                        selectedField={selectedField?.trkSub?.subjectName}
                        type="trksub"
                        placeholder="Select subject"
                      />
                    )}
                  </View>
                ) : null}
                {selectField &&
                  selectedIcon.subIconID == 47 &&
                  stuReportName != 'CBSE' ? (
                  <View style={{ padding: 10 }}>
                    <SelectionBox
                      getListItem={getListItem}
                      selectedField={selectedField?.trmType?.trmType}
                      type="trmType"
                      placeholder="Select type"
                    />
                    <SelectionBox
                      getListItem={getListItem}
                      selectedField={
                        selectedField?.class?.getClassDetail?.classDesc
                      }
                      type="trmClass"
                      placeholder="Select class"
                    />
                    <SelectionBox
                      getListItem={getListItem}
                      selectedField={selectedField?.section?.sectionName}
                      type="section"
                      placeholder="Select section"
                    />
                    <SelectionBox
                      getListItem={getListItem}
                      selectedField={selectedField?.subject?.subjectName}
                      type="trmSubject"
                      placeholder="Select subject"
                    />
                  </View>
                ) : null}
                {selectField && selectedIcon.subIconID == 124 ? (
                  <View style={{ padding: 10 }}>
                    {userData.data.userTypeID == 4 ||
                      userData.data.userTypeID == 2 ? (
                      <>
                        <SelectionBox
                          getListItem={getListItem}
                          selectedField={
                            selectedField?.class?.getClassDetail?.classDesc
                          }
                          type="class"
                          placeholder="Select class"
                        />
                        <SelectionBox
                          getListItem={getListItem}
                          selectedField={selectedField?.section?.sectionName}
                          type="section"
                          placeholder="Select section"
                        />
                      </>
                    ) : null}
                    <SelectionBox
                      getListItem={getListItem}
                      selectedField={selectedField?.subject?.subjectName}
                      type="gameSubject"
                      placeholder="Select subject"
                    />
                  </View>
                ) : null}
                {mainIconID == 6 || mainIconID == 19 ? (
                  <View style={{ padding: 10 }}>
                    <SelectionBox
                      getListItem={getListItem}
                      selectedField={
                        selectedField?.class?.getClassDetail?.classDesc
                      }
                      type="class"
                      placeholder="Select class"
                    />
                    {selectedIcon.subIconID == 54 ||
                      selectedIcon.subIconID == 55 ? (
                      <>
                        <CustomInput
                          placeHolder={'Enter indicator name'}
                          onChangeText={val =>
                            handleInputChange(val, 'assessment')
                          }
                          maxLength={30}
                        />
                        <TouchableOpacity
                          style={{
                            backgroundColor: userData.data.colors.mainTheme,
                            padding: 10,
                            width: '45%',
                            alignSelf: 'center',
                            borderRadius: 6,
                            marginVertical: 10,
                          }}
                          onPress={() => {
                            if (
                              selectedIcon.subIconID == 54 ||
                              selectedIcon.subIconID == 55
                            ) {
                              coScholasticIndicator(selectedIcon.subIconID);
                            }
                          }}
                        >
                          <Text
                            style={{
                              color: SWATheam.SwaWhite,
                              textAlign: 'center',
                              textTransform: 'uppercase',
                            }}
                          >
                            {selectedIcon.subIconID == 54
                              ? 'Add Indicator'
                              : 'Submit'}
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <SelectionBox
                          getListItem={getListItem}
                          selectedField={selectedField?.section?.sectionName}
                          type="section"
                          placeholder="Select section"
                        />
                        {selectedIcon.subIconID >= 56 &&
                          selectedIcon.subIconID <= 59 ? (
                          <>
                            {selectedIcon.subIconID >= 58 && (
                              <SelectionBox
                                getListItem={getListItem}
                                selectedField={
                                  selectedField?.subject?.subjectName
                                }
                                type={
                                  selectedIcon.subIconID == 59
                                    ? 'subjAddBySchool'
                                    : 'subject'
                                }
                                placeholder="Select subject"
                              />
                            )}
                            {selectedIcon.subIconID != 59 && (
                              <SelectionBox
                                getListItem={getListItem}
                                selectedField={selectedField?.term?.term}
                                type="term"
                                placeholder="Select term"
                              />
                            )}
                            {selectedIcon.subIconID <= 57 && (
                              <SelectionBox
                                getListItem={getListItem}
                                selectedField={
                                  selectedField?.marksType?.marksType
                                }
                                type="marksType"
                                placeholder="Select marks type"
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <SelectionBox
                              getListItem={getListItem}
                              selectedField={
                                selectedField?.subject?.subjectName
                              }
                              type="subject"
                              placeholder="Select subject"
                            />
                            <SelectionBox
                              getListItem={getListItem}
                              selectedField={
                                selectedField?.markAss?.assessmentName
                              }
                              type="assessment"
                              placeholder="Select assessment name"
                            />
                            <SelectionBox
                              getListItem={getListItem}
                              selectedField={selectedField?.markFormet?.format}
                              type="meFormet"
                              placeholder="Select marks entry format"
                            />
                          </>
                        )}
                      </>
                    )}
                  </View>
                ) : mainIconID == 22 && selectedIcon.subIconID == 92 ? (
                  <View style={{ padding: 12 }}>
                    <SelectionBox
                      getListItem={getListItem}
                      selectedField={
                        selectedField?.class?.getClassDetail?.classDesc
                      }
                      type="class"
                      placeholder="Select class"
                    />
                    <SelectionBox
                      getListItem={getListItem}
                      selectedField={selectedField?.section?.sectionName}
                      type="section"
                      placeholder="Select section"
                    />
                    <SelectionBox
                      getListItem={getListItem}
                      selectedField={selectedField?.subject?.subjectName}
                      type="subject"
                      placeholder="Select subject"
                    />
                    <SelectionBox
                      getListItem={getListItem}
                      selectedField={selectedField?.student?.fullName}
                      type="student"
                      placeholder="Select student"
                    />
                  </View>
                ) : (mainIconID == 30 && selectedIcon.subIconID == 104) ||
                  selectedIcon.subIconID == 102 ||
                  selectedIcon.subIconID == 100 ||
                  selectedIcon.subIconID == 99 ||
                  selectedIcon.subIconID == 98 ? (
                  <View style={{ padding: 12 }}>
                    <SelectionBox
                      getListItem={getListItem}
                      selectedField={selectedField?.subject?.subjectName}
                      type="subject"
                      placeholder="Select subject"
                    />

                    {selectedIcon.subIconID == 102 ||
                      selectedIcon.subIconID == 100 ||
                      selectedIcon.subIconID == 99 ? null : (
                      <SelectionBox
                        getListItem={getListItem}
                        selectedField={selectedField?.markAss?.assessmentName}
                        type="assessment"
                        placeholder="Select assessment name"
                      />
                    )}
                  </View>
                ) : null}
                {mainIconID != 27 && toolName == 'Report' && (
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => setSelectField(!selectField)}
                    >
                      <AntDesign
                        name={selectField ? 'upcircle' : 'downcircle'}
                        size={32}
                        color={userData.data.colors.mainTheme}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            {listItem.status ? (
              <BottomDrawerList
                closeModule={closeModule}
                listItem={listItem}
                getSelectedItem={getSelectedItem}
                selectedField={selectedField}
              />
            ) : null}
          </>
          {gameList.status ? (
            <GameList gameList={gameList} getGameView={getGameView} />
          ) : null}
          <MsgModal msgModalVisible={msgModalVisible} />

          {childIconsList.status ? (
            <SubIconActivityList
              selectedModuleItem={toolName}
              toolItems={childIconsList.listItem}
              getModuleActivityData={getModuleActivityData}
              navigation={navigation}
            />
          ) : null}

          {intro.instruction ? (
            <AcademicProfIntro
              getAttemptedScreen={getAttemptedScreen}
              intro={intro}
            />
          ) : null}
          {toolItems?.data.length ? (
            <>
              {!toolItems?.categoryView ?
                <View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme }}>
                  <ScrollView>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginVertical: 10, paddingHorizontal: 10 }}>
                      {toolItems?.data.map((item, index) => {
                        let toolName = ''
                        let subjectID = selectedField?.subject?.subjectID != undefined ? selectedField.subject.subjectID : selectedField.subject
                        if (subjectID == 1) {
                          toolName = item.subjectSubCatLang2?.replace('<br>', '')
                        } else {
                          toolName = item.subjectSubCategory?.replace('<br>', '')
                        }
                        return (
                          <TouchableOpacity style={{ height: 180, marginVertical: 10, width: "45%", justifyContent: 'center', alignItems: 'center', backgroundColor: SWATheam.SwaWhite, elevation: 9, borderRadius: 6, justifyContent: 'space-around', padding: 8 }} key={item.subTypeID}
                            onPress={() => getModuleActivityData(item, 'manual', '', '', navigation)}>
                            <View style={{ height: item.subTypeID != undefined ? 80 : 144, width: item.subTypeID != undefined ? 80 : 90, justifyContent: 'center', alignItems: 'center', }}>
                              <Image source={{ uri: toolItems?.imgUrl + item?.iconName }} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                            </View>
                            {item.subTypeID != undefined &&
                              <View style={{ height: 40, alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', color: SWATheam.SwaGray }}>{toolName}</Text>
                              </View>
                            }
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                  </ScrollView>
                </View> :
                <View
                  style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme, }}
                >
                  <ScrollView>
                    {toolItems?.data?.map((group, gIndex) => {
                      return (
                        <View key={group.lcID} style={{ marginVertical: 10 }}>
                          {/* 🔷 Group Title */}
                          {group?.subjectSubType?.length ?
                            <Text
                              style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 0, marginBottom: 5, color: SWATheam.SwaBlack, textAlign: 'center', backgroundColor: userData.data.colors.mainTheme, paddingVertical: 4, color: SWATheam.SwaWhite, }}
                            >
                              {group.learningCategory}
                            </Text> : null
                          }

                          {/* 🔷 Icons Grid */}
                          <View
                            style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: 10, }}
                          >
                            {group.subjectSubType.map((item, index) => {
                              let subjectID = selectedField?.subject?.subjectID != undefined ? selectedField.subject.subjectID : selectedField.subject;

                              let toolName = subjectID == 1 ? item.subjectSubCatLang2?.replace(/<br>/g, '') : item.subjectSubCatLang1?.replace(/<br>/g, '');

                              return (
                                <TouchableOpacity key={item.subTypeID || index}
                                  style={{ height: 160, width: '45%', marginVertical: 10, backgroundColor: SWATheam.SwaWhite, elevation: 5, borderRadius: 0, justifyContent: 'space-around', alignItems: 'center', padding: 8, borderRadius: 6, }}
                                  onPress={() => getModuleActivityData(item, 'manual', '', '', navigation,)}>
                                  {/* 🔷 Icon */}
                                  <View
                                    style={{ height: 70, width: 70, justifyContent: 'center', alignItems: 'center', }}
                                  >
                                    <Image
                                      source={{ uri: toolItems?.imgUrl + item?.iconName, }}
                                      style={{ height: '100%', width: '100%', resizeMode: 'contain', }} />
                                  </View>

                                  {/* 🔷 Name */}
                                  <Text style={{ textAlign: 'center', color: SWATheam.SwaGray, fontSize: 13, }}>
                                    {toolName}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>

              }
            </>

          )
            : null}

          {combineReport || reportData.status ? (
            <ReportViwer
              closeModule={closeModule}
              reportData={combineReport ? consolidatedReportData : reportData}
              selectedField={selectedField}
              reportName={stuReportName}
              type="student"
              userType={userData.data.userTypeID}
              selectedIcon={selectedIcon}
            />
          ) : null}
          {selectedIcon.subIconID == 49 || editAss.status ? (
            <AssessmentView navigation={navigation} editAss={editAss} />
          ) : selectedIcon.subIconID == 50 ? (
            <AutoAssessmentGenerate />
          ) : selectedIcon.subIconID == 51 ? (
            <AddQuestionManullay />
          ) : selectedIcon.subIconID == 52 ? (
            <AssessmentStatus />
          ) : selectedIcon.subIconID == 113 ? (
            <ManageAssessment
              navigation={navigation}
              editAssessment={editAssessment}
            />
          ) : null}
          {indicatorsList.status ? (
            <Co_ScholasticIndicator
              indicatorsList={indicatorsList}
              actionOnIndicator={actionOnIndicator}
              subIconID={selectedIcon.subIconID}
            />
          ) : null}
          {editIndicator.status &&
            (selectedIcon.subIconID == 54 || selectedIcon.subIconID == 55) ? (
            <AddEditSubIndicator
              editIndicator={editIndicator}
              closeModule={closeModule}
              addSubIndicator={addSubIndicator}
              subIndicatorName={subIndicatorName}
              addSubIndicatorText={addSubIndicatorText}
              removesubIndicator={removesubIndicator}
              updateIndicator={updateIndicator}
            />
          ) : null}
          {selectedIcon.subIconID == 87 ? (
            <CreateHomeWork />
          ) : selectedIcon.subIconID == 88 ? (
            <SaveHomeWork />
          ) : selectedIcon.subIconID == 89 ? (
            <AssignedHomeWork />
          ) : selectedIcon.subIconID == 90 ? (
            <SubmittedHomeWork />
          ) : selectedIcon.subIconID == 91 ? (
            <CheckedHomeWork />
          ) : selectedIcon.subIconID == 93 && certificateAct.iconView ? (
            <CertificateIconsView certificateAction={certificateAction} />
          ) : selectedIcon.subIconID == 109 ? (
            <ViewAndSubmitHomework />
          ) : selectedIcon.subIconID == 110 ? (
            <SubmittedStudentHomeWork />
          ) : selectedIcon.subIconID == 111 ? (
            <CheckedStuentHomeWork />
          ) : selectedIcon.subIconID == 112 ? (
            <CertificatedAwarded />
          ) : null}
          {certificateAct.issued ? (
            <IssuedCertificate />
          ) : certificateAct.create ? (
            <CreateCertificate />
          ) : null}
          {subjectMarksEntry.status && selectedIcon.subIconID == 59 ? (
            <SubjectMarksEntryList
              subjectMarksEntry={subjectMarksEntry}
              selectedField={selectedField}
              selectTerm={selectTerm}
              termBtnID={termBtnID}
            />
          ) : null}
        </View>
      )}
    </SafeAreaProvider>
  );
};

export default SubIconsScreen;

const styles = StyleSheet.create({});