import React, { useState, useEffect, useContext } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Octicons from 'react-native-vector-icons/Octicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Button, PermissionsAndroid, StatusBar, Platform } from "react-native"
import DatePicker from 'react-native-date-picker'
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video'
import SoundPlayer from 'react-native-sound-player'
import SwaHeader from '../common/SwaHeader';
import { GlobleData } from '../../Store';
import { SWATheam, apiRoot } from '../../constant/ConstentValue';
import Services from '../../Services';
import Loader from '../common/Loader';
import ImageViewer from '../common/ImageViewer';
// import RNFetchBlob from 'rn-fetch-blob';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import Orientation from 'react-native-orientation-locker';


const greyClr = SWATheam.SwaBlack

const font20 = 20
const font17 = 17
const font15 = 15

// school
// const userID = 2
// const userRefID = 17614

// teacher
// const userID = 4
// const userRefID = 18106

// student
// const userID = 5
// const userRefID = 17636

// parent
// const userID = 6
// const userRefID = 17636

let totalStudentIDsArr = []
let totalTeacherIDsArr = []
let studentCount = 0;
let teacherCount = 0;




const SwaSharing = ({ navigation }) => {
  const { userData } = useContext(GlobleData)

  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  const [postList, setPostList] = useState({ data: null, status: false })
  const [commentList, setCommentList] = useState({ data: null, status: false })
  const [shareGroup, setShareGroup] = useState({ data: null, status: false })
  const [viewMembers, setViewMembers] = useState({ data: null, status: '', isView: false })
  const [classData, setClassData] = useState({ data: null, type: null, status: false })

  const [teacherList, setTeacherList] = useState({ data: null, status: false })
  const [postLikeTotal, setPostLikeTotal] = useState({ data: null, status: false })
  const [studentData, setstudentData] = useState({ data: null, status: false })
  const [addMemberData, setAddMemberData] = useState({ data: null, status: false })

  let [studentUserArr, setStudentUserArr] = useState([])
  let [teacherUserArr, setTeacherUserArr] = useState([])
  const [grpID, setGrpID] = useState('')

  const [showSelectPopUp, SetShowSelectPopUp] = useState(false)
  const [showClassPopUp, SetShowClassPopUp] = useState(false)
  const [showCommentPopUp, SetShowCommentPopUp] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showGroupMembers, setshowGroupMembers] = useState(false)
  const [addMembers, setAddMembers] = useState(false)
  const [editGroupData, setEditGroupData] = useState(false)

  const [selectGroup, setSelectGroup] = useState({ radioID: null })
  const [selectClass, setSelectClass] = useState({ data: null, radioID: null })
  const [selectSection, setSelectSection] = useState({ data: null, radioID: null })
  const [selectOptText, setSelectOptText] = useState('Select Group To Share')
  const [selectClassText, setSelectClassText] = useState('Select Class')
  const [selectSectionText, setSelectSectionText] = useState('Select Section')
  const [selectPost, setSelectPost] = useState({ radioID: null })
  const [selectImgBtn, setSelectImgBtn] = useState(false)
  const [selectVideoBtn, setSelectVideoBtn] = useState(false)
  const [selectAudioBtn, setSelectAudioBtn] = useState(false)
  const [selectDocBtn, setSelectDocBtn] = useState(false)
  const [groupFileImg, setGroupFileImg] = useState('Select Image')
  const [newGroupFileImg, setNewGroupFileImg] = useState('New Group Image')
  const [postImgName, setPostImgName] = useState('Select Image')
  const [postVideoName, setPostVideoName] = useState('Select Video')
  const [postAudioName, setPostAudioName] = useState('Select Audio')
  const [postDocName, setPostDocName] = useState('Select Document')
  const [createGroupImg, setCreateGroupImg] = useState('')
  const [postTitleMsg, setPostTitleMsg] = useState('')
  const [postMessage, setPostMessage] = useState('')

  const [uploadPostImg, setUploadPostImg] = useState('')
  const [ytLink, setYtLink] = useState('')
  const [uploadPostVideo, setUploadPostVideo] = useState('')
  const [uploadPostAudio, setUploadPostAudio] = useState('')
  const [uploadPostDoc, setUploadPostDoc] = useState('')
  const [uploadPostCreatedBy, setUploadPostCreatedBy] = useState('')
  const [createNewGroupImg, setCreateNewGroupImg] = useState('')
  const [groupName, setGroupName] = useState('')
  const [groupId, setGroupId] = useState('')
  const [comment, setComment] = useState('')
  const [nameOfGroup, setNameOfGroup] = useState('')
  const [newNameOfGroup, setNewNameOfGroup] = useState('')
  const [classID, setclassID] = useState(null)
  const [sectionID, setsectionID] = useState(null)
  const [showStudent, setShowStudent] = useState(null)

  const [selectAll, setSelectAll] = useState(false)
  const [btnSelect, setBtnSelect] = useState(1)
  const [IsLoading, setIsLoading] = useState(false)

  const [showPostList, setShowPostList] = useState(true)
  const [iconChange, setIconChange] = useState(false)
  const [calenderSelected, setCalenderSelected] = useState('');

  const [uploadCurrentDateTime, setUploadCurrentDateTime] = useState('');
  const [uploadPostLaterDateTime, setUploadPostLaterDateTime] = useState('');
  const [shareIDSaved, setShareIDSaved] = useState('')

  const [searchPostTxt, setSearchPostTxt] = useState('')
  const [searchPostDate, setSearchPostDate] = useState('')

  const [selectWholeSchool, setSelectWholeSchool] = useState('')

  const [soundPlayID, setSoundPlayID] = useState('')
  const [fileType, setFileType] = useState({ data: null, type: '', fileSrc: null, status: false })
  const [loading, setLoading] = useState(false)

  let userIDs = ""

  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (userData.data.userTypeID == 5 || userData.data.userTypeID == 6) {
      getPostList()
      getPostLikeCount()
    }
  }, [])

  // useEffect(() => {
  //     const goBack = navigation.addListener('focus', () => {
  //         Orientation.lockToPortrait();
  //         StatusBar.setHidden(false);
  //     });
  //     return goBack
  // }, [navigation])

  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }

  function getPostList() {
    setLoading(true)
    if (searchPostTxt == '' && searchPostDate == '') {
      const payload = {
        "schoolCode": userData.data.schoolCode,
        "userRefID": userData.data.userRefID,
        "userTypeID": userData.data.userTypeID
      }
      Services.post(apiRoot.getSharedPostApp, payload)
        .then((res) => {
          if (res.status == "success") {
            setLoading(false)
            const data = res.data
            const domainName = res.data.domain
            const shareIDArr = []
            data.postData.map((item) => {
              shareIDArr.push(item.shareID)
            })
            setPostList((prev) => {
              return { ...prev, data: data, domainName: domainName, status: true }
            })
            savePostVisit(shareIDArr)
          } else if (res.status == "error") {
            alert(res.message)
            setLoading(false)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          setLoading(false)
        })

    } else if (searchPostTxt != '' || searchPostDate != '') {
      const payload = {
        "schoolCode": userData.data.schoolCode,
        "userRefID": userData.data.userRefID,
        "userTypeID": userData.data.userTypeID,
        "searchData": searchPostTxt || searchPostDate
      }
      Services.post(apiRoot.getSharedPostApp, payload)
        .then((res) => {
          if (res.status == "success") {
            const data = res.data
            const domainName = res.data.domain
            const shareIDArr = []
            data.postData.map((item) => {
              shareIDArr.push(item.shareID)
            })
            setPostList((prev) => {
              return { ...prev, data: data, domainName: domainName, status: true }
            })
            savePostVisit(shareIDArr)
          } else if (res.status == "error") {
            alert(res.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {

        })
    }
  }

  function getPostLikeCount() {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "userRefID": userData.data.userRefID,
      "userTypeID": userData.data.userTypeID
    }

    Services.post(apiRoot.getAppPostLikeCount, payload)
      .then((res) => {
        if (res.status == "success") {
          setPostLikeTotal((prev) => {
            return { ...prev, data: res.data, status: true }
          })
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })

  }

  function getPostComments(shareID) {
    setIsLoading(true)
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "shareID": shareID
    }
    Services.post(apiRoot.getPostCommentsApp, payload)
      .then((res) => {
        if (res.status == "success") {
          setIsLoading(false)
          const data = res.data
          setCommentList((prev) => {
            return { ...prev, data: data, status: true }
          })
        } else {
          setIsLoading(false)
          const msg = 'No comments Yet'
          setCommentList((prev) => {
            return { ...prev, data: msg, status: false }
          });

        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })

  }

  function selectGroupOpt(ID, item) {
    setGroupId(ID)
    setUploadPostCreatedBy(item.userRefID)
    setSelectGroup((prev) => {
      return { ...prev, radioID: ID }
    })
    setSelectOptText(item.groupName)
  }

  function selectPostBtn(ID) {
    if (ID == 1) {
      getUploadDate()
      setCalenderSelected('')
      setUploadPostLaterDateTime('')
    }
    setSelectPost((prev) => {
      return { ...prev, radioID: ID }
    })
  }

  function selectDocumentBtn(type) {
    if (type == 'Image') {
      setSelectUploadFile({ file1: true, file2: false, file3: false, file4: false })
    }
    if (type == 'Video') {
      setSelectUploadFile({ file1: false, file2: true, file3: false, file4: false })
    }
    if (type == 'Audio') {
      setSelectUploadFile({ file1: false, file2: false, file3: true, file4: false })
    }
    if (type == 'Document') {
      setSelectUploadFile({ file1: false, file2: false, file3: false, file4: true })
    }

    // setSelectUploadFile({ file1: true })
    // setSelectUploadFile({ file2: true })
    // setSelectUploadFile({ file3: true })
    // setSelectUploadFile({ file4: true })
  }

  function slectLikeDislikeBtn(likeOption, shareID, selectedBtn) {
    setIsLoading(true)
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "userRefID": userData.data.userRefID,
      "shareID": shareID,
      "likeOption": likeOption != selectedBtn ? likeOption : ''
    }
    Services.post(apiRoot.togglePostLikeDislikeApp, payload)
      .then((res) => {
        if (res.status == "success") {
          setIsLoading(false)
          getPostList()
          getPostLikeCount()
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const getBrowseImg = async (name = '') => {
    if (name == 'image') {
      try {
        const file = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.images]
        });

        setCreateGroupImg(file)
        setCreateNewGroupImg(file)
        setUploadPostImg(file)
        setGroupFileImg(file.name)
        setNewGroupFileImg(file.name)
        setPostImgName(file.name)

      } catch (err) {
        console.log(err)
      }
    }
    else if (name == 'video') {
      try {
        const file = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.video]
        });

        setUploadPostVideo(file)
        setPostVideoName(file.name, 'video')

      } catch (err) {
        console.log(err)
      }

    }
    else if (name == 'audio') {
      try {
        const file = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.audio]
        });

        setUploadPostAudio(file)
        setPostAudioName(file.name)

      } catch (err) {
        console.log(err)
      }
    }
    else if (name == 'docx') {
      try {
        const file = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.allFiles]
        });

        setUploadPostDoc(file)
        setPostDocName(file.name, 'file')

      } catch (err) {
        console.log(err)
      }
    }
  }

  function getSharingGroup() {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "userRefID": userData.data.userRefID,
      "userTypeID": userData.data.userTypeID
    }
    Services.post(apiRoot.getAppSharingGroup, payload)
      .then((res) => {
        if (res.status == "success") {
          const data = res.data
          setShareGroup((prev) => {
            return { ...prev, data: data, status: true }
          })
        } else {
          setShareGroup((prev) => {
            return { ...prev, data: [], status: false }
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })

  }

  function createGroup() {
    const formData = new FormData();
    formData.append("schoolCode", userData.data.schoolCode)
    formData.append("newGroupName", groupName)
    formData.append("userRefID", userData.data.userRefID)
    formData.append("userTypeID", userData.data.userTypeID)
    if (createGroupImg != '') {
      formData.append("newGroupImage", { uri: createGroupImg.uri, name: createGroupImg.name, type: createGroupImg.type })
    }
    Services.formMethod(apiRoot.createAppSharingGroup, formData)
      .then((res) => {
        if (res.status == "success") {
          alert(res.message)
          getSharingGroup()
          setGroupFileImg('Select Image')
          setCreateGroupImg('')
          setGroupName('')
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })
  }

  function viewGroupMembers(groupID, name = '') {
    setGroupId(groupID)
    setNameOfGroup(name)
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "groupID": groupID
    }
    Services.post(apiRoot.viewMembersAppSharingGroup, payload)
      .then((res) => {
        if (res.status == 'success') {
          setViewMembers((prev) => {
            return { ...prev, data: res.data, status: res.status, isView: true }
          })
        }
        if (res.status == 'error') {
          setViewMembers((prev) => {
            return { ...prev, msg: res.message, status: res.status, isView: true }
          })
        }
        if (res.type == 'school') {
          setViewMembers((prev) => {
            return { ...prev, msg: res.message, status: res.type, isView: true }
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })
  }

  function removeMemberFrmShareGroup(userRefID, name = "") {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "userRefID": userRefID,
      "groupID": groupId
    }
    Services.post(apiRoot.removeMemberFromSharingGroupApp, payload)
      .then((res) => {
        if (res.status == "success") {
          alert(name + ' ' + res.message)
          viewGroupMembers(groupId)
          getTeacherList()
          getAddedMembers(groupId)
          const index = teacherUserArr.indexOf(userRefID);
          if (index > -1) {
            teacherUserArr.splice(index, 1);
          }
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })
  }

  function deleteSharedPost(groupID, shareID) {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "groupID": groupID,
      "shareID": shareID
    }
    Services.post(apiRoot.deleteSharedPostApp, payload)
      .then((res) => {
        console.log(res, 'deletepost')
        if (res.status == "success") {
          alert(res.message)
          setSearchPostTxt('')
          setSearchPostDate('')
          getPostList()
          setPostList({ data: null, status: false })
        }
        else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })
  }

  function addCommentOnPost(userRefID, shareID) {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "userRefID": userRefID,
      "userTypeID": userData.data.userTypeID,
      "shareID": shareID,
      "comment": comment
    }
    Services.post(apiRoot.addCommentOnPostApp, payload)
      .then((res) => {
        if (res.status == "success") {
          SetShowCommentPopUp(true)
          getPostComments(shareID)
          setComment('')
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })
  }
  function addMembersOnGroup() {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "userIDs": userIDs,
      "groupID": grpID
    }
    Services.post(apiRoot.addMembersToSharingGroupApp, payload)
      .then((res) => {
        if (res.status == "success") {
          alert(res.message)
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })
  }

  function deleteSharGroup(groupID) {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "groupID": groupID
    }
    Services.post(apiRoot.deleteAppSharingGroup, payload)
      .then((res) => {
        if (res.status == "success") {
          alert(res.message);
          getSharingGroup();
        } else if (res.status == "error") {
          // setPostList({})
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })
  }

  function savePostVisit(shareIDArr) {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "userRefID": userData.data.userRefID,
      "userTypeID": userData.data.userTypeID,
      "shareIDs": shareIDArr
    }
    Services.post(apiRoot.savePostVisitApp, payload)
    // fetch(api + "savePostVisitApp", payload)
  }

  function selectBtn(ID) {
    setSelectClass({ data: null, radioID: null })
    setSelectSection({ data: null, radioID: null })
    setBtnSelect(ID)

    if (ID == 2) {
      setShowStudent(0)
      setSelectClassText('Select Class')
      setSelectSectionText('Select Section')

      if (addMemberData.data != null) {
        totalTeacherIDsArr.map((item) => {
          const members = item
          addMemberData.data.map((ID, key) => {
            if (ID == members) {
              if (teacherUserArr.length != addMemberData.data.length) {
                teacherUserArr.push(ID)
              }
            }
          })
        })
      } else {
        setAddMemberData({ data: null, status: false })
        teacherUserArr.length = 0
        teacherCount = 0
      }

      teacherCount = teacherUserArr.length

      if (totalTeacherIDsArr.length == teacherUserArr.length) {
        setSelectAll(true)
      } else {
        setSelectAll(false)
      }

    }
  }

  function addMemberBtn(item) {
    getAddedMembers(item.groupID)
    setAddMembers(true)
    setGrpID(item.groupID)
    getTeacherList()
    setGroupId(item.groupID)
  }

  function classDataValidate(type) {
    if (type == 'class') {
      SetShowClassPopUp(true)
      getClassList()
    }
    else if (type == 'section') {
      if (selectClassText == 'Select Class') {
        SetShowClassPopUp(false)
        alert('Please Select Class')
      } else {
        SetShowClassPopUp(true)
        getSectionList()
      }
    }
  }

  function getClassList() {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "userTypeID": userData.data.userTypeID
    }
    if (userData.data.userTypeID == 4) {
      payload["academicYear"] = userData?.data?.academicYear,
        payload["userRefID"] = userData?.data?.userRefID
    }
    Services.post(apiRoot.getClassList, payload)
      .then((res) => {
        if (res.status == "success") {
          const data = res.data
          setClassData((prev) => {
            return { ...prev, data: data, type: 'class', status: true }
          })
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })
  }

  function getSectionList() {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "academicYear": userData.data.academicYear,
      "classID": classID,
      "userTypeID": userData.data.userTypeID,
      "userRefID": userData.data.userRefID
    }
    Services.post(apiRoot.getSectionList, payload)
      .then((res) => {
        if (res.status == "success") {
          const data = res.data
          setClassData((prev) => {
            return { ...prev, data: data, type: 'section', status: true }
          })
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })
  }

  function addWholeSchool() {
    setSelectWholeSchool(1)
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "groupID": groupId,
      "userRefID": userData.data.userRefID
    }
    Services.post(apiRoot.addAllUsersToGroup, payload)
      .then((res) => {
        if (res.status == "success") {
          alert(res.message)
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })

  }

  function addSubBranch() {
    setSelectWholeSchool(2)
    // const payload = {
    //     method: "POST",
    //     headers: {
    //         "accept": "Application/json",
    //         "Content-Type": "application/json",
    //         "api-token": "=4WY5FWeoRWYhd3c"
    //     },
    //     body: JSON.stringify({
    //         "schoolCode": "SWA1854060081",
    //         "groupID": groupId,
    //         "userRefID": userRefID,
    //     })
    // }

    // fetch(api + "addAllUsersToGroup", payload)
    //     .then((res) => res.json())
    //     .then((res) => {
    //         if (res.status == "success") {
    //             alert(res.message)
    //         } else {
    //             alert(res.message)
    //         }
    //     })
  }

  function getTeacherList() {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "academicYear": userData.data.academicYear,
    }
    Services.post(apiRoot.getTeachersListApp, payload)
      .then((res) => {
        if (res.status == "success") {
          const data = res.data
          totalTeacherIDsArr = []
          data.map((item) => {
            totalTeacherIDsArr.push(item.loginID)
          })
          setTeacherList((prev) => {
            return { ...prev, data: data, status: true }
          })
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })
  }

  function selectClassOpt(ID, item) {
    setclassID(ID)
    setSelectSection((prev) => {
      return { ...prev, data: null, radioID: null }
    })
    setSelectClass((prev) => {
      return { ...prev, data: item, radioID: ID }
    })

    if (userData.data.userTypeID == 4) {
      setSelectClassText(item.getClassDetail.classDesc)
    } else {
      setSelectClassText(item.ClassDesc)
    }

    setSelectSectionText('Select Section')
    setShowStudent(null)
    studentCount = 0
  }

  function selectSectionOpt(ID, item) {
    setsectionID(ID)
    setSelectSection((prev) => {
      return { ...prev, data: item, radioID: ID }
    })
    setSelectSectionText(item.sectionName)
    getstudents()
  }

  function selectUser(ID) {
    if (btnSelect == 1) {
      if (studentUserArr.includes(ID)) {
        setStudentUserArr(studentUserArr.filter(item => item !== ID))
        studentCount--
      } else {
        setStudentUserArr([...studentUserArr, ID])
        studentCount++
      }

      if (studentCount == totalStudentIDsArr.length) {
        setSelectAll(true)
      } else {
        setSelectAll(false)
      }

    }
    else if (btnSelect == 2) {
      if (teacherUserArr.includes(ID)) {
        setTeacherUserArr(teacherUserArr.filter(item => item !== ID))
        teacherCount--
      } else {
        setTeacherUserArr([...teacherUserArr, ID])
        teacherCount++
      }

      if (teacherCount == totalTeacherIDsArr.length) {
        setSelectAll(true)
      } else {
        setSelectAll(false)
      }

    }
  }

  function selectAllBtn() {
    if (btnSelect == 1) {
      setSelectAll(!selectAll)
      if (totalStudentIDsArr.length != studentUserArr.length) {
        studentUserArr.length = 0
        totalStudentIDsArr.map((item, key) => {
          studentUserArr.push(item)
          studentCount = key + 1
        })
      } else {
        setStudentUserArr([])
        studentUserArr.length = 0
        studentCount = 0
      }
    }
    else if (btnSelect == 2) {
      setSelectAll(!selectAll)
      if (totalTeacherIDsArr.length != teacherUserArr.length) {
        teacherUserArr.length = 0
        totalTeacherIDsArr.map((item, key) => {
          teacherUserArr.push(item)
          teacherCount = key + 1
        })
      } else {
        setTeacherUserArr([])
        teacherUserArr.length = 0
        teacherCount = 0
      }
    }
  }

  function getstudents() {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "classID": classID,
      "sectionID": sectionID,
      "academicYear": userData.data.academicYear,
      "transYear": userData.data.transYear
    }
    Services.post(apiRoot.getStudentsData, payload)
      .then((res) => {
        if (res.status == "success") {
          const data = res.data
          totalStudentIDsArr = []
          data.map((item) => {
            totalStudentIDsArr.push(item.userRefID)
          })
          setstudentData((prev) => {
            return { ...prev, data: data, status: true }
          })
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })
  }

  function getAddedMembers(groupID) {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "groupID": groupID
    }
    Services.post(apiRoot.getAddedMembersInGroup, payload)
      .then((res) => {
        if (res.status == "success") {
          setAddMemberData((prev) => {
            return { ...prev, data: res.data, status: true }
          })
        } else if (res.status = "error") {
          setAddMemberData((prev) => {
            return { ...prev, data: [], status: true }
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })
  }

  function removeAllSelectedfrmGroup(groupId, userRefIDs) {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "groupID": groupId,
      "userRefIDs": userRefIDs
    }
    Services.post(apiRoot.removeAllSelectedFromGroup, payload)
      .then((res) => {
        if (res.status == "success") {
          alert(res.message)
          studentCount = 0
          teacherCount = 0
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })
  }

  function searchStudents() {
    if (selectClassText != 'Select Class' && selectSectionText != 'Select Section') {
      getstudents()
      setShowStudent(1)
      studentUserArr.length = 0

      if (addMemberData.data != null) {
        totalStudentIDsArr.map((item, key) => {
          const members = item
          addMemberData.data.map((ID) => {
            if (ID == members) {
              if (studentUserArr.length != addMemberData.data.length) {
                studentUserArr.push(ID)
              }
            }
          })
        })
      } else {
        setAddMemberData({ data: null, status: false })
        studentUserArr.length = 0
        studentCount = 0
      }

      studentCount = studentUserArr.length

      if (totalStudentIDsArr.length == studentUserArr.length) {
        setSelectAll(true)
      } else {
        setSelectAll(false)
      }

    }
    else if (selectClassText == 'Select Class' || selectSectionText == 'Select Section') {
      alert('Please Select Required Field')
      setShowStudent(0)
    }
  }

  function updateGroup() {

    const formData = new FormData();
    formData.append("schoolCode", userData.data.schoolCode)

    if (newNameOfGroup != '') {
      formData.append("editGrpName", newNameOfGroup)
    }

    if (createNewGroupImg != '') {
      formData.append("editGrpImg", { uri: createNewGroupImg.uri, name: createNewGroupImg.name, type: createNewGroupImg.type })
    }

    formData.append("groupID", grpID)

    const payload = {
      method: "POST",
      headers: {
        "accept": "Application/json",
        "api-token": "=4WY5FWeoRWYhd3c"
      },
      body: formData
    }
    Services.formMethod(apiRoot.editAppSharingGroup, formData)
      .then((res) => {
        if (res.status == "success") {
          alert(res.message)
          getSharingGroup()
          setEditGroupData(false)
        } else if (res.status == "error") {
          alert(res.message)
        }
      })

  }

  function editGroupBtn(groupID, groupName) {
    setEditGroupData(true)
    setGrpID(groupID)
    setNameOfGroup(groupName)
  }

  function sharePost() {
    setLoading(true)
    const formData = new FormData();
    formData.append("schoolCode", userData.data.schoolCode)
    formData.append("groupID", groupId)
    formData.append("createdByID", uploadPostCreatedBy)
    formData.append("academicYear", userData.data.academicYear)
    formData.append("postTitle", postTitleMsg)
    formData.append("postMsg", postMessage)

    if (ytLink != '') {
      formData.append("ytLink", ytLink)
    }
    if (uploadPostImg != '') {
      formData.append("imageType", uploadPostImg)
    }
    if (uploadPostVideo != '') {
      formData.append("videoType", uploadPostVideo)
    }
    if (uploadPostAudio != '') {
      formData.append("audioType", uploadPostAudio)
    }
    if (uploadPostDoc != '') {
      formData.append("docType", uploadPostDoc)
    }

    if (uploadPostLaterDateTime != '') {
      const laterDate = new Date(uploadPostLaterDateTime).toLocaleDateString()
      const laterTime = new Date(uploadPostLaterDateTime).toLocaleTimeString()
      let spliteDate = laterDate.split("/")
      let date1 = spliteDate.reverse()
      let date2 = date1.join("-")
      const joinData = date2 + " " + laterTime

      formData.append("postLaterDate", joinData)
    } else {
      formData.append("postNowDate", uploadCurrentDateTime)
    }

    Services.formMethod(apiRoot.sharePostApp, formData)
      .then((res) => {
        if (res.status == "success") {
          setLoading(false)
          setPostTitleMsg('')
          setUploadPostCreatedBy('')
          setPostMessage('')
          setSelectOptText('Select Group To Share')
          setSelectGroup({ radioID: null })
          setUploadCurrentDateTime('')
          setUploadPostLaterDateTime('')
          setSelectPost({ radioID: null })
          setPostImgName('Select Image')
          setPostVideoName('Select Video')
          setPostAudioName('Select Audio')
          setPostDocName('Select Document')
          setGroupFileImg('Select Image')
          setSelectImgBtn(false)
          setSelectVideoBtn(false)
          setSelectAudioBtn(false)
          setSelectDocBtn(false)
          getPostList()
          alert(res.message)
        } else if (res.status == "error") {
          alert(res.message)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function getUploadDate() {
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()
    const replaceSign = date.replaceAll('/', '-')
    const joinDandT = replaceSign + ' ' + time
    setUploadCurrentDateTime(joinDandT)
  }

  function checkField(shareID) {
    setShareIDSaved(shareID)
  }

  function editDateAndTime(type, dateTimeStr) {
    const laterDate = new Date(dateTimeStr).toLocaleDateString()
    const laterTime = new Date(dateTimeStr).toLocaleTimeString()
    let spliteDate = laterDate.split("/")
    let date1 = spliteDate.reverse()
    let date2 = date1.join("-")
    if (type == 'postLaterDate') {
      const joinData = date2 + " " + laterTime
      setCalenderSelected(joinData)
    } else if (type == "searchPost") {
      let arrangeDate = spliteDate[0] + '-' + spliteDate[2] + '-' + spliteDate[1]
      setSearchPostDate(arrangeDate)
    }
  }

  function removeAllMemberFrmShareGroup() {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "groupID": grpID,
      "userRefID": userData.data.userRefID
    }
    Services.post(apiRoot.removeAllUsersFromGroup, payload)
      .then((res) => {
        if (res.status == "success") {
          alert(res.message)
          setAddMemberData({ data: null, status: false })
          studentCount = 0
          teacherCount = 0
          teacherUserArr.length = 0
          studentUserArr.length = 0
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })

  }

  function playAudio(audioUrl) {
    try {
      SoundPlayer.playUrl(audioUrl)
      SoundPlayer.addEventListener('FinishedPlaying', (success) => {
        if (success) {
          setSoundPlayID('')
        }
      })
    } catch (e) {
      alert('Cannot play the file')
      console.log('cannot play the song file', e)
    }
  }

  function stopAudio() {
    SoundPlayer.stop()
  }

  function viewDoc(item, type, baseUrl) {
    if (type == "video") {
      navigation.navigate('videoView', { url: item, type: 'sharing' })
    } else if (type == "img") {
      setFileType((prev) => {
        return { ...prev, fileSrc: item, status: true }
      })
    } else if (type == "doc") {
      const docPath = baseUrl + item.docFileNPath
      if (docPath.endsWith('pdf')) {
        navigation.navigate('pdfView', { url: docPath, title: "Swa-Sharing", type: 'sharing' })
      } else if (docPath.endsWith('doc') || docPath.endsWith('docx')) {
        requestDownloadPermission(docPath)
      }

    }

  }

  function viewDocument(item, type, baseUrl) {
    setLoading(true)
    if (type == "video") {
      // navigation.navigate('videoView', { url: item })
      requestDownloadPermission(item, type)
    } else if (type == "img") {
      requestDownloadPermission(item, type)
      // setFileType((prev) =>{
      //     return {...prev, fileSrc: item, status: true}
      // })
    } else if (type == 'audio') {
      requestDownloadPermission(item, type)
    }
    else if (type == "doc") {
      const docPath = baseUrl + item.docFileNPath
      requestDownloadPermission(docPath, type)
      // if(docPath.endsWith('pdf')){
      //     navigation.navigate('pdfView', { url: docPath, title: "Swa-Sharing"})
      // }else if(docPath.endsWith('doc') || docPath.endsWith('docx')){
      //     requestDownloadPermission(docPath)
      // }

    }
  }


  const requestDownloadPermission = async (docPath, type) => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Swaadhyayan LMS Storage Permission',
            message:
              'Swaadhyayan LMS App needs access to your storage ' +
              'so you can download files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadFile(docPath, type);
        } else {
          console.log('Storage permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      console.log(docPath, "Storage")
      downloadFile(docPath, type);
    }
  };

  const downloadFile = (docPath, type) => {
    const { config, fs } = RNFetchBlob;
    const date = new Date();

    let fileDir = Platform.OS === 'android' ? fs.dirs.DownloadDir : fs.dirs.DocumentDir; // Use DownloadDir for Android and DocumentDir for iOS
    let fileExtension = '';

    // Determine the file extension based on the type and URL
    if (type == 'img') {
      if (docPath.endsWith('png')) fileExtension = '.png';
      else if (docPath.endsWith('jpg')) fileExtension = '.jpg';
      else if (docPath.endsWith('jpeg')) fileExtension = '.jpeg';
      else if (docPath.endsWith('gif')) fileExtension = '.gif';
    } else if (type == "video") {
      if (docPath.endsWith('mp4')) fileExtension = '.mp4';
      else if (docPath.endsWith('ogg')) fileExtension = '.ogg';
    } else if (type == "audio") {
      fileExtension = '.mp3';
    } else if (type == 'doc') {
      if (docPath.endsWith('doc')) fileExtension = '.doc';
      else if (docPath.endsWith('docx')) fileExtension = '.docx';
      else if (docPath.endsWith('pdf')) fileExtension = '.pdf';
      else if (docPath.endsWith('ott')) fileExtension = '.ott';
    }

    const fileName = `/file_${Math.floor(date.getTime() / 1000)}${fileExtension}`;
    const filePath = fileDir + fileName;

    const configOptions = {
      fileCache: true,
      path: filePath, // Save to the appropriate directory based on the platform
    };

    // Additional Android-specific settings for using Download Manager
    if (Platform.OS === 'android') {
      configOptions.addAndroidDownloads = {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        description: "File downloaded using Swaadhyayan LMS",
      };
    }

    config(configOptions)
      .fetch('GET', docPath, {})
      .then((res) => {
        console.log('The file is saved to:', res.path());

        if (Platform.OS === 'android') {
          alert("File downloaded successfully.");
        }
        setLoading(false);

        // On iOS, you might want to preview or share the file after download
        if (Platform.OS === 'ios') {
          RNFetchBlob.ios.previewDocument(res.path()); // This opens the file preview on iOS
        }
      })
      .catch((err) => {
        console.log('Download error:', err);
        alert("File download failed.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'right', 'top']} style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme, }}>
        {loading ?
          <Loader /> :
          <View style={{ flex: 1, marginTop: Platform.OS == "ios" ? 0 : 24, backgroundColor: userData?.data?.colors?.liteTheme, paddingBottom: insets.bottom }}>
            <SwaHeader title={'Swa Sharing'} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
            <View style={{ flex: 1, padding: 10, }}>
              {userData.data.userTypeID != 5 && userData.data.userTypeID != 6 &&
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginBottom: 10 }}>
                  <TouchableOpacity style={{ backgroundColor: '#198754', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => { getSharingGroup(), setShowCreateGroup(true), setSelectOptText('Select Group To Share'), setGroupFileImg('Select Image'), setSelectGroup({ data: null, radioID: null }), setCreateGroupImg('') }}>
                    <View style={{ marginRight: 5 }}>
                      <MaterialIcons name={"group-add"} size={15} color={SWATheam.SwaWhite} />
                    </View>
                    <View>
                      <Text style={{ color: SWATheam.SwaWhite }}>Create New Group</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ backgroundColor: '#666', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10, width: 150 }} onPress={() => { setShowPostList(!showPostList), getPostList(), getPostLikeCount(), setSelectGroup({ data: null, radioID: null }), setSelectOptText('Select Group To Share'), setSelectImgBtn(false), setSelectVideoBtn(false), setSelectAudioBtn(false), setSelectDocBtn(false), setPostImgName('Select Image'), setPostVideoName('Select Video'), setPostAudioName('Select Audio'), setPostDocName('Select Document'), setCalenderSelected(''), setSelectPost({ radioID: null }), setPostTitleMsg(''), setPostMessage(''), setGroupId(''), setYtLink(''), setUploadPostImg(''), setUploadPostVideo(''), setUploadPostAudio(''), setUploadPostDoc(''), setUploadCurrentDateTime(''), setUploadPostLaterDateTime(''), setCalenderSelected(''), setSearchPostDate(''), setSearchPostTxt(''), setGroupFileImg('Select Image'), setCreateGroupImg('') }}>
                    <View style={{ marginRight: 5 }}>
                      <FontAwesome5 name={"clipboard-list"} size={15} color={SWATheam.SwaWhite} />
                    </View>
                    <View>
                      <Text style={{ color: SWATheam.SwaWhite }}>{!showPostList ? "Create Post" : "Post List"}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }
              {showPostList && userData.data.userTypeID != 5 && userData.data.userTypeID != 6 ?
                <View>
                  <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50, paddingVertical: 2 }} onPress={() => { SetShowSelectPopUp(true), getSharingGroup() }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: SWATheam.SwaBlack }}>{selectOptText}</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                      <Entypo name={"chevron-thin-down"} size={20} color={SWATheam.SwaGray} />
                    </View>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => setSelectImgBtn(true)}>
                        <FontAwesome6 name={"image"} size={25} color={selectImgBtn ? SWATheam.SwaBlack : '#0d6efd'} />
                        <Text style={{ color: selectImgBtn ? SWATheam.SwaBlack : '#0d6efd' }}>
                          Image
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => setSelectVideoBtn(true)}>
                        <FontAwesome6 name={"video"} size={25} color={selectVideoBtn ? SWATheam.SwaBlack : '#dc3545'} />
                        <Text style={{ color: selectVideoBtn ? SWATheam.SwaBlack : '#dc3545' }}>
                          Video
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => setSelectAudioBtn(true)}>
                        <MaterialIcons name={"multitrack-audio"} size={25} color={selectAudioBtn ? SWATheam.SwaBlack : '#198754'} />
                        <Text style={{ color: selectAudioBtn ? SWATheam.SwaBlack : '#198754' }}>
                          Audio
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => setSelectDocBtn(true)}>
                        <MaterialCommunityIcons name={"file-document-multiple-outline"} size={25} color={selectDocBtn ? SWATheam.SwaBlack : '#0d6efd'} />
                        <Text style={{ color: selectDocBtn ? SWATheam.SwaBlack : '#0d6efd' }}>
                          Document
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {selectImgBtn &&
                    <View style={{ marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                          <Text style={[styles.BtextClr, { fontSize: 13 }]}>Upload image ( max-size-1MB )</Text>
                        </View>
                        <TouchableOpacity onPress={() => { setSelectImgBtn(false), setPostImgName('Select Image') }}>
                          <AntDesign name={"close"} size={20} color={SWATheam.SwaGray} />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50 }}>
                        <View style={{ flex: 1, padding: 6, paddingLeft: 10 }}>
                          <Text style={{ color: SWATheam.SwaBlack }}>{postImgName}</Text>
                        </View>
                        <TouchableOpacity style={{ padding: 6, backgroundColor: SWATheam.SwaGray, borderTopRightRadius: 50, borderBottomRightRadius: 50 }} onPress={() => getBrowseImg('image')}>
                          <Text style={{ color: SWATheam.SwaWhite }}>Browse</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  }

                  {selectVideoBtn &&
                    <View style={{ marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                          <Text style={[styles.BtextClr, { fontSize: 13 }]}>Upload video ( max-size-5MB )</Text>
                        </View>
                        <TouchableOpacity onPress={() => { setSelectVideoBtn(false), setSelectVideoBtn(false), setPostVideoName('Select Video') }}>
                          <AntDesign name={"close"} size={20} color={SWATheam.SwaGray} />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50 }}>
                        <View style={{ flex: 1, padding: 6, paddingLeft: 10 }}>
                          <Text style={{ color: SWATheam.SwaBlack }}>{postVideoName}</Text>
                        </View>
                        <TouchableOpacity style={{ padding: 6, backgroundColor: SWATheam.SwaGray, borderTopRightRadius: 50, borderBottomRightRadius: 50 }} onPress={() => getBrowseImg('video')}>
                          <Text style={{ color: SWATheam.SwaWhite }}>Browse</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  }

                  {selectAudioBtn &&
                    <View style={{ marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                          <Text style={[styles.BtextClr, { fontSize: 13 }]}>Upload audio ( max-size-2MB )</Text>
                        </View>
                        <TouchableOpacity onPress={() => { setSelectAudioBtn(false), setSelectAudioBtn(false), setPostAudioName('Select Audio') }}>
                          <AntDesign name={"close"} size={20} color={SWATheam.SwaGray} />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50 }}>
                        <View style={{ flex: 1, padding: 6, paddingLeft: 10 }}>
                          <Text style={{ color: SWATheam.SwaBlack }}>{postAudioName}</Text>
                        </View>
                        <TouchableOpacity style={{ padding: 6, backgroundColor: SWATheam.SwaGray, borderTopRightRadius: 50, borderBottomRightRadius: 50 }} onPress={() => getBrowseImg('audio')}>
                          <Text style={{ color: SWATheam.SwaWhite }}>Browse</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  }

                  {selectDocBtn &&
                    <View style={{ marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                          <Text style={[styles.BtextClr, { fontSize: 13 }]}>Upload document ( max-size-1MB )</Text>
                        </View>
                        <TouchableOpacity onPress={() => { setSelectDocBtn(false), setSelectDocBtn(false), setPostDocName('Select Document') }}>
                          <AntDesign name={"close"} size={20} color={SWATheam.SwaGray} />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50 }}>
                        <View style={{ flex: 1, padding: 6, paddingLeft: 10 }}>
                          <Text style={{ color: SWATheam.SwaBlack }}>{postDocName}</Text>
                        </View>
                        <TouchableOpacity style={{ padding: 6, backgroundColor: SWATheam.SwaGray, borderTopRightRadius: 50, borderBottomRightRadius: 50 }} onPress={() => getBrowseImg('docx')}>
                          <Text style={{ color: SWATheam.SwaWhite }}>Browse</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  }

                  <View>
                    <TextInput style={[styles.input, { color: SWATheam.SwaGray }]} onChangeText={setPostTitleMsg} value={postTitleMsg} placeholder='Enter Post Title' placeholderTextColor={SWATheam.SwaGray} />
                  </View>
                  <View>
                    <TextInput style={[styles.input, { color: SWATheam.SwaGray }]} onChangeText={setYtLink} value={ytLink} placeholder='Enter Youtube Link' placeholderTextColor={SWATheam.SwaGray} />
                  </View>
                  <View>
                    <TextInput onChangeText={setPostMessage} value={postMessage} style={[styles.input, { color: SWATheam.SwaGray, borderRadius: 5, height: 90, borderWidth: 1, textAlignVertical: 'top' }]}
                      multiline={true}
                      numberOfLines={4}
                      maxLength={250}
                      placeholder='Enter Message'
                      placeholderTextColor={SWATheam.SwaGray}
                    />

                  </View>

                  <View style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => selectPostBtn(1)}>
                      <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                          <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: SWATheam.SwaGray, justifyContent: 'center', alignItems: 'center' }} value="first">
                            {
                              selectPost.radioID === 1 ? <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 / 2 }}></View> : null
                            }
                          </View>
                        </View>
                        <Text style={[styles.BtextClr, { paddingLeft: 10, fontSize: font15 }]}>
                          Post Now
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => selectPostBtn(2)}>
                      <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                          <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: SWATheam.SwaGray, justifyContent: 'center', alignItems: 'center' }} value="first">
                            {
                              selectPost.radioID === 2 ? <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 / 2 }}></View> : null
                            }
                          </View>
                        </View>
                        <Text style={[styles.BtextClr, { paddingLeft: 10, fontSize: font15 }]}>
                          Post Later
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {selectPost.radioID === 2 ?
                    <View>
                      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50, marginBottom: 10 }}>
                        <View style={{ flex: 1 }}>
                          <TextInput style={[styles.input, { marginBottom: 0, borderWidth: 0 }]} placeholder='Select Post Later Date' onChangeText={setCalenderSelected} value={calenderSelected} placeholderTextColor={SWATheam.SwaGray} />
                        </View>
                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 10 }} onPress={() => setOpen(true)}>
                          <FontAwesome6 name={"calendar"} size={20} color={SWATheam.SwaGray} />
                        </TouchableOpacity>
                      </View>
                      {
                        open &&
                        <DatePicker
                          modal
                          open={open}
                          date={date}
                          onConfirm={(date) => {
                            setOpen(false)
                            editDateAndTime('postLaterDate', date)
                          }}
                          onCancel={() => {
                            setOpen(false)
                          }}
                        />
                      }
                    </View> : null
                  }

                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                    <TouchableOpacity style={{ paddingHorizontal: 30, paddingVertical: 5, backgroundColor: userData.data.colors.mainTheme, borderRadius: 50 }} onPress={() => sharePost()}>
                      <Text style={[styles.WtextClr]}>
                        Post
                      </Text>
                    </TouchableOpacity>
                  </View>

                </View>
                :
                <View style={{ flex: 1, background: 'red' }}>
                  <View >
                    <TextInput style={[styles.input]} onFocus={() => setSearchPostDate()} onChangeText={setSearchPostTxt} value={searchPostTxt} placeholder='Search By Title' placeholderTextColor={SWATheam.SwaGray} />
                  </View>
                  <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50, backgroundColor: SWATheam.SwaWhite }}>
                    <View style={{ flex: 1 }}>
                      <TextInput style={[styles.input, { marginBottom: 0, borderWidth: 0 }]} onChangeText={setSearchPostDate} value={searchPostDate} onFocus={() => setSearchPostTxt('')}
                        placeholder='Search By Date'
                        placeholderTextColor={SWATheam.SwaGray}
                      />
                    </View>
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 10, }} onPress={() => setOpen(true)}>
                      <FontAwesome6 name={"calendar"} size={20} color={SWATheam.SwaGray} />
                    </TouchableOpacity>
                  </View>
                  {
                    open &&
                    <DatePicker
                      modal
                      open={open}
                      date={date}
                      mode='date'
                      onConfirm={(date) => {
                        setOpen(false)
                        editDateAndTime("searchPost", date)
                      }}
                      onCancel={() => {
                        setOpen(false)
                      }}
                    />
                  }
                  <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                    <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 50 }} onPress={() => getPostList()}>
                      <Text style={{ textTransform: 'uppercase', color: SWATheam.SwaWhite }}>Search</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, borderRadius: 7, padding: 5, backgroundColor: userData.data.colors.liteTheme, marginVertical: 10, }}>

                    <ScrollView>
                      {
                        postList.status ?
                          postList.data?.postData.length != 0 ?
                            postList.data?.postData?.map((item, index) => {
                              if (item.shareID != null) {
                                const docPath = item.docFileNPath
                                const audioPath = item.audioFileNPath
                                const imgPath = item.imageFileNPath
                                const videoPath = item.videoFileNPath
                                let audioName = ''
                                let docName = ''
                                let imgName = ''
                                let videoName = ''

                                if (docPath != null) {
                                  const splitPath = docPath.split('/')
                                  docName = splitPath[splitPath.length - 1]
                                }

                                if (audioPath != null) {
                                  const splitPath = audioPath.split('/')
                                  audioName = splitPath[splitPath.length - 1]
                                }

                                if (imgPath != null) {
                                  const splitPath = imgPath.split('/')
                                  imgName = splitPath[splitPath.length - 1]
                                }

                                if (videoPath != null) {
                                  const splitPath = videoPath.split('/')
                                  videoName = splitPath[splitPath.length - 1]
                                }

                                return (
                                  <View style={{ borderWidth: 0.5, borderRadius: 7, borderColor: SWATheam.SwaGray, marginBottom: 5, paddingHorizontal: 5, backgroundColor: SWATheam.SwaWhite }} key={index}>
                                    <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderColor: SWATheam.SwaGray, alignItems: 'center', paddingVertical: 5 }}>
                                      <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Image source={require('../assets/profileImg.png')} style={{ height: 30, width: 30 }} />
                                        <View>
                                          <View style={{ flexDirection: 'row' }}>
                                            <View>
                                              <Text style={[styles.BtextClr, { fontWeight: '500', fontSize: font15 }]}>{item.createdBy}</Text>
                                            </View>
                                            <View style={{ justifyContent: 'center', paddingLeft: 5 }}>
                                              <Text style={[styles.BtextClr, { fontSize: 12 }]}>({item.groupName})</Text>
                                            </View>
                                          </View>
                                          <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles.BtextClr, { fontSize: 12 }]}>{item.startDate}</Text>
                                          </View>
                                        </View>
                                      </View>
                                      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        {
                                          userData.data.userRefID == item.createdByID ?
                                            <TouchableOpacity onPress={() => { deleteSharedPost(item.groupID, item.shareID), getPostList() }}>
                                              <MaterialIcons name={"delete"} size={22} color={'#dc3545'} />
                                            </TouchableOpacity> : null
                                        }
                                      </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingVertical: 5 }}>
                                      <Text style={{ fontWeight: '500', marginRight: 5, color: SWATheam.SwaGray }}>#</Text>
                                      <Text style={{ borderBottomWidth: 1, borderColor: SWATheam.SwaBlack, fontWeight: '500', color: SWATheam.SwaBlack }}>
                                        {item.shareDataTitle}
                                      </Text>
                                    </View>

                                    {
                                      item.imageFileNPath ?
                                        <View style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: SWATheam.SwaGray, borderRadius: 5, marginVertical: 5, marginHorizontal: 10 }}>
                                          <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5 }} onPress={() => viewDoc(postList.data.domain + item.imageFileNPath, 'img',)}>
                                            <Image source={{ uri: postList.data.domain + item.imageFileNPath }} style={{ height: 100, width: '80%', resizeMode: 'contain' }} />
                                          </TouchableOpacity>
                                          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => viewDocument(postList.data.domain + item.imageFileNPath, 'img')} style={{ padding: 5 }}>
                                              <Octicons name={"download"} size={20} color={SWATheam.SwaBlack} />
                                            </TouchableOpacity>
                                          </View>
                                        </View> : ''
                                    }

                                    {
                                      item.videoFileNPath ?
                                        <View style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: SWATheam.SwaGray, borderRadius: 5, marginVertical: 5, marginHorizontal: 10 }}>
                                          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                                            <Video
                                              source={{ uri: postList.domainName + item.videoFileNPath }}
                                              style={{
                                                height: 100,
                                                width: '80%'
                                              }}
                                              paused={true}
                                              controls={false}
                                              repeat={false}
                                            />
                                          </View>
                                          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => viewDocument(postList.domainName + item.videoFileNPath, 'video')} style={{ padding: 5 }}>
                                              <Octicons name={"download"} size={20} color={SWATheam.SwaBlack} />
                                            </TouchableOpacity>
                                          </View>
                                        </View> : ''
                                    }

                                    {
                                      item.audioFileNPath ?
                                        <View style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: SWATheam.SwaGray, borderRadius: 5, marginVertical: 5, marginHorizontal: 10 }}>
                                          <View style={{ flex: 1, alignItems: 'center', padding: 5, flexDirection: 'row' }}>
                                            {
                                              (soundPlayID == item.shareID) ?
                                                <TouchableOpacity onPress={() => { stopAudio(item.shareID), setSoundPlayID('') }}>
                                                  <AntDesign name={"sound"} size={20} color={userData.data.colors.mainTheme} />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { playAudio(postList.data.domain + item.audioFileNPath), setSoundPlayID(item.shareID) }}>
                                                  <AntDesign name={"play"} size={25} color={userData.data.colors.mainTheme} />
                                                </TouchableOpacity>
                                            }
                                            <View style={{ flex: 1 }}>
                                              <Text style={{ color: SWATheam.SwaBlack }}>{audioName}</Text>
                                            </View>
                                          </View>
                                          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                            <TouchableOpacity style={{ padding: 5 }} onPress={() => viewDocument(postList.data.domain + item.audioFileNPath, 'audio')}>
                                              <Octicons name={"download"} size={20} color={SWATheam.SwaBlack} />
                                            </TouchableOpacity>
                                          </View>
                                        </View> : ''
                                    }

                                    {
                                      item.docFileNPath ?
                                        <View style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: SWATheam.SwaGray, borderRadius: 5, marginVertical: 5, marginHorizontal: 10 }}>
                                          <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5 }} onPress={() => viewDoc(item, 'doc', postList.data.domain)}>
                                            <Text style={{ color: SWATheam.SwaBlack }}>{docName}</Text>
                                          </TouchableOpacity>
                                          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => viewDocument(item, 'doc', postList.data.domain)} style={{ padding: 5 }}>
                                              <Octicons name={"download"} size={20} color={SWATheam.SwaBlack} />
                                            </TouchableOpacity>
                                          </View>
                                        </View> : ''
                                    }

                                    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingVertical: 5, marginBottom: 5 }}>
                                      <Text style={{ flex: 1, color: SWATheam.SwaBlack, fontWeight: '500', paddingLeft: 8 }}>
                                        {item.sharingContent}
                                      </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 5, paddingVertical: 8, borderTopWidth: 0.5, borderColor: SWATheam.SwaGray, justifyContent: 'space-between' }}>
                                      <View>
                                        {
                                          postLikeTotal?.data?.map((likeData, index) => {
                                            if (item.shareID == likeData.shareID) {
                                              return (
                                                <Text style={{ flex: 1, color: '#198754', fontWeight: '500' }} key={index}>
                                                  Likes : {likeData.likeCount == null ? 0 : likeData.likeCount}
                                                </Text>
                                              )
                                            }
                                          })

                                        }
                                      </View>
                                      <View>
                                        <TouchableOpacity onPress={() => { getPostComments(item.shareID), SetShowCommentPopUp(true) }}>
                                          <FontAwesome name={"commenting-o"} size={20} color={'#198754'} />
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 5, paddingVertical: 8, borderTopWidth: 0.5, borderColor: SWATheam.SwaGray, alignItems: 'center' }}>
                                      <View style={{ flexDirection: 'row' }}>
                                        {
                                          postList.data.likeAction.map((likeID, index) => {
                                            const postID = item.shareID
                                            const ID = likeID.shareID
                                            if (postID == ID) {
                                              return (
                                                <TouchableOpacity key={index} style={{ marginRight: 5 }} onPress={() => { slectLikeDislikeBtn(1, item.shareID, likeID.likeOption) }}>
                                                  {
                                                    likeID.likeOption == 1 ?
                                                      <FontAwesome name={"thumbs-up"} size={20} color={userData.data.colors.mainTheme} /> :
                                                      <FontAwesome name={"thumbs-o-up"} size={20} color={userData.data.colors.mainTheme} />
                                                  }
                                                </TouchableOpacity>
                                              )
                                            }
                                          })
                                        }

                                        {
                                          postList.data.likeAction.map((likeID, index) => {
                                            const postID = item.shareID
                                            const ID = likeID.shareID
                                            if (postID == ID) {
                                              return (
                                                <TouchableOpacity key={index} onPress={() => slectLikeDislikeBtn(0, item.shareID, likeID.likeOption)}>
                                                  {
                                                    likeID.likeOption == 0 ?
                                                      <FontAwesome name={"thumbs-down"} size={20} color={'#dc3545'} /> :
                                                      <FontAwesome name={"thumbs-o-down"} size={20} color={'#dc3545'} />
                                                  }
                                                </TouchableOpacity>
                                              )
                                            }
                                          })
                                        }
                                      </View>
                                      <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <View style={{ flex: 1, marginHorizontal: 8 }}>
                                          <TextInput
                                            value={shareIDSaved == item.shareID ? comment : null}
                                            style={[styles.input, { color: SWATheam.SwaGray, height: 30, padding: 5, marginBottom: 0, paddingStart: 8 }]} onChangeText={setComment} onFocus={() => checkField(item.shareID)} placeholder='Add a comment...'
                                            placeholderTextColor={SWATheam.SwaGray}

                                          />
                                        </View>
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                          <TouchableOpacity onPress={() => addCommentOnPost(item.userRefID, item.shareID)}>
                                            <Ionicons name={"send"} size={20} color={'#198754'} />
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                )
                              }
                              // else {
                              //   return (
                              //     <View style={{ backgroundColor: SWATheam.SwaWhite, padding: 5, borderRadius: 5, elevation: 9 }} key={index}>
                              //       <Text style={{ color: 'red', textAlign: 'center', padding: 1, fontSize: font15 }}>No posts</Text>
                              //     </View>
                              //   )
                              // }
                            }) : null
                          :

                          <View style={{ backgroundColor: SWATheam.SwaWhite, padding: 5, borderRadius: 5, elevation: 9 }}>
                            <Text style={{ color: 'red', textAlign: 'center', padding: 1, fontSize: font15 }}>No posts</Text>
                          </View>
                      }
                    </ScrollView>

                  </View>

                </View>
              }
            </View>

            {showSelectPopUp &&
              <View style={styles.selectFieldPopUp}>
                <View style={{ backgroundColor: SWATheam.SwaWhite, marginHorizontal: 30, padding: 8, height: 300, borderRadius: 5 }}>
                  <View style={{ borderRadius: 5 }}>
                    <TouchableOpacity style={{ position: 'absolute', top: -15, right: -15 }} onPress={() => SetShowSelectPopUp(false)}>
                      <Entypo name={"circle-with-cross"} size={30} color={'#343a40'} />
                    </TouchableOpacity>
                    <ScrollView>
                      {shareGroup.status ?
                        shareGroup.data?.map((item, index) => {
                          const ID = item.groupID
                          return (
                            <TouchableOpacity onPress={() => { selectGroupOpt(ID, item), SetShowSelectPopUp(false) }} key={index}>
                              <View style={{ padding: 10, borderBottomWidth: .7, borderColor: SWATheam.SwaGray, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                  <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: SWATheam.SwaGray, justifyContent: 'center', alignItems: 'center' }} value="first">
                                    {
                                      selectGroup.radioID === ID ? <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 / 2 }}></View> : null
                                    }
                                  </View>
                                </View>
                                <Text style={{ paddingLeft: 10, fontSize: font15, color: SWATheam.SwaBlack }}>
                                  {item.groupName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )
                        }) : null
                      }
                    </ScrollView>
                  </View>
                </View>
              </View>
            }

            {showCommentPopUp &&
              <View style={styles.selectFieldPopUp}>
                <View style={{ backgroundColor: SWATheam.SwaWhite, marginHorizontal: 30, padding: 4, borderRadius: 5 }}>
                  <View style={{ borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 5, padding: 2, height: 300 }}>
                    <TouchableOpacity style={{ position: 'absolute', top: -20, right: -20 }} onPress={() => SetShowCommentPopUp(false)}>
                      <Entypo name={"circle-with-cross"} size={30} color={SWATheam.SwaBlack} />
                    </TouchableOpacity>
                    <ScrollView>
                      {
                        commentList.status ?
                          <View>
                            {
                              commentList?.data?.map((item, index) => {
                                const uFName = item.userFirstName == null ? ' ' : item.userFirstName
                                const uMName = item.userMiddleName == null ? ' ' : item.userMiddleName
                                const uLName = item.userLastName == null ? ' ' : item.userLastName
                                const sFName = item.stuFirstName == null ? ' ' : item.stuFirstName
                                const sMName = item.stuMiddleName == null ? ' ' : item.stuMiddleName
                                const sLName = item.stuLastName == null ? ' ' : item.stuLastName
                                const uName = uFName + uMName + uLName
                                const sName = sFName + sMName + sLName
                                const comment = item.visitorComment.split('#@')
                                const arr = []
                                const obj = {
                                  date: '',
                                  time: '',
                                  msg: ''
                                }
                                return (
                                  <View style={{ padding: 5, borderRadius: 5, backgroundColor: userData.data.colors.mainTheme, marginBottom: 5 }} key={index}>
                                    <View style={{ flexDirection: 'row', alingItems: 'center', padding: 5 }}>
                                      <Text style={[styles.WtextClr, { fontWeight: '600', fontSize: font15 }]}>{uName == '   ' ? sName : uName}</Text>
                                      <View style={{ alingItems: 'center', justifyContent: 'center', marginLeft: 5 }}>
                                        <Text style={[styles.WtextClr, { fontWeight: '600', fontSize: 11 }]}>({item.userTypeDesc})</Text>
                                      </View>
                                    </View>
                                    <View style={{ borderRadius: 5, backgroundColor: SWATheam.SwaWhite, padding: 5 }}>
                                      {
                                        comment?.map((item, index) => {
                                          const msg2 = item.split('~')
                                          const date = msg2[0].split(' ')
                                          return (
                                            <View key={index}>
                                              {
                                                IsLoading == true ?
                                                  <Loader />
                                                  :
                                                  <View>
                                                    {
                                                      msg2[1] == '' || date[0] == '' || date[1] == '' || date[2] == '' ?
                                                        null :
                                                        <View style={{ borderBottomWidth: item.length > 1 ? 0 : 1, borderColor: SWATheam.SwaGray }}>
                                                          <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
                                                            <View style={{ paddingTop: 8, marginRight: 5 }}>
                                                              <View style={{ height: 7, width: 7, borderRadius: 50, backgroundColor: SWATheam.SwaBlack }}>
                                                              </View>
                                                            </View>
                                                            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                                              <Text style={{ color: SWATheam.SwaBlack, fontSize: font15, fontWeight: '500' }}>
                                                                {msg2[1]}
                                                              </Text>
                                                              <Text style={{ color: SWATheam.SwaBlack, fontSize: 11, textAlign: 'right', fontWeight: '500' }}> {date[0]} {date[1]} {date[2]}</Text>
                                                            </View>
                                                          </View>
                                                        </View>
                                                    }
                                                  </View>
                                              }
                                            </View>
                                          )
                                        })
                                      }
                                    </View>
                                  </View>
                                )
                              })
                            }
                          </View> :
                          <View style={{ height: 200, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#198754', fontSize: font15, fontWeight: '500' }}>{commentList.data}</Text>
                          </View>

                      }
                    </ScrollView>
                  </View>
                </View>
              </View>
            }

            {showCreateGroup &&
              <View style={{ position: 'absolute', top: 0, left: 0, backgroundColor: SWATheam.SwaWhite, flex: 1, width: '100%', height: '100%' }}>
                <View style={{ backgroundColor: userData.data.colors.mainTheme, paddingVertical: 10, }}>
                  <Text style={{ color: SWATheam.SwaWhite, fontSize: font17, fontWeight: '500', textAlign: 'center' }}>
                    Create Group
                  </Text>
                </View>
                <View style={{ paddingHorizontal: 10, marginTop: 20, flex: 1, paddingBottom: 40 }}>
                  <View style={{ borderBottomWidth: 1, borderColor: greyClr, paddingBottom: 10 }}>
                    <TextInput style={[styles.input]} onChangeText={setGroupName} value={groupName} placeholder='Group Name' placeholderTextColor={SWATheam.SwaGray} />
                    <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50 }}>
                      <View style={{ flex: 1, padding: 6, paddingLeft: 10 }}>
                        <Text style={{ color: SWATheam.SwaBlack }}>{groupFileImg}</Text>
                      </View>
                      <TouchableOpacity style={{ padding: 6, backgroundColor: userData.data.colors.mainTheme, borderTopRightRadius: 50, borderBottomRightRadius: 50 }} onPress={() => getBrowseImg('image')}>
                        <Text style={{ color: SWATheam.SwaWhite }}>Browse</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                      <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 50, paddingHorizontal: 20, paddingVertical: 5 }} onPress={() => createGroup()}>
                        <Text style={{ color: SWATheam.SwaWhite }}>Create</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 10 }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontSize: font15, fontWeight: '700', borderBottomWidth: 2, borderColor: SWATheam.SwaGray }}>
                      MANAGE GROUPS
                    </Text>
                  </View>
                  <View style={{ marginTop: 10, borderRadius: 5, flex: 1, backgroundColor: userData.data.colors.liteTheme, paddingTop: 5 }}>
                    <ScrollView>
                      {
                        shareGroup.status ?
                          shareGroup?.data?.map((item, index) => {
                            return (
                              <View style={{ paddingHorizontal: 10, paddingTop: 5, marginBottom: 10, marginHorizontal: 5, backgroundColor: SWATheam.SwaWhite, borderRadius: 5, elevation: 7 }} key={index}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <View style={{ alingItems: 'center', justifyContent: 'center' }}>
                                    {item.imagePath == undefined ?
                                      <Image source={require('../assets/profileImg.png')} style={{ height: 40, width: 40, resizeMode: 'contain' }} /> :
                                      <Image source={{ uri: item.imagePath }} style={{ height: 40, width: 40, resizeMode: 'contain' }} />
                                    }
                                  </View>
                                  <Text style={{ color: SWATheam.SwaBlack, fontSize: font15, fontWeight: '500' }}> {item.groupName}</Text>
                                </View>
                                <View style={{ paddingLeft: 40 }}>
                                  <Text style={{ color: SWATheam.SwaBlack, fontSize: font15, fontWeight: '500' }}> {item.createdBy}</Text>
                                </View>
                                <View style={{ justifyContent: 'flex-end', flexDirection: 'row', borderTopWidth: 0.5, marginTop: 5, paddingVertical: 10 }}>
                                  <TouchableOpacity style={{ borderWidth: 1, marginRight: 10, borderRadius: 5, padding: 5 }} onPress={() => { viewGroupMembers(item.groupID, item.groupName), setshowGroupMembers(true) }}>
                                    <Entypo name={"eye"} size={20} color={'#198754'} />
                                  </TouchableOpacity>
                                  <TouchableOpacity style={{ borderWidth: 1, marginRight: 10, borderRadius: 5, padding: 5 }} onPress={() => editGroupBtn(item.groupID, item.groupName)}>
                                    <Entypo name={"edit"} size={20} color={'#0d6efd'} />
                                  </TouchableOpacity>
                                  <TouchableOpacity style={{ borderWidth: 1, marginRight: 10, borderRadius: 5, padding: 5 }} onPress={() => { addMemberBtn(item) }}>
                                    <Ionicons name={"person-add"} size={20} color={'#198754'} />
                                  </TouchableOpacity>
                                  <TouchableOpacity style={{ borderWidth: 1, marginRight: 10, borderRadius: 5, padding: 5 }} onPress={() => deleteSharGroup(item.groupID)}>
                                    <MaterialIcons name={"delete"} size={20} color={'#dc3545'} />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )
                          })
                          :
                          <View style={{ backgroundColor: SWATheam.SwaWhite, padding: 5, borderRadius: 5, marginHorizontal: 5 }}>
                            <Text style={{ color: 'red', textAlign: 'center', padding: 1, fontSize: font15 }}>No group available</Text>
                          </View>
                      }
                    </ScrollView>
                  </View>
                </View>
                <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: SWATheam.SwaWhite, borderTopWidth: 0.5, paddingVertical: 5 }}>
                  <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => { setShowCreateGroup(false), setGroupFileImg('Select Image') }}>
                    <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Back</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }

            {showGroupMembers &&
              <View style={{ position: 'absolute', top: 0, left: 0, backgroundColor: SWATheam.SwaWhite, flex: 1, width: '100%', height: '100%', paddingBottom: 40 }}>
                <Text style={{ marginTop: 6, color: SWATheam.SwaBlack, fontSize: font17, fontWeight: '500', paddingLeft: 5, paddingTop: 10, borderBottomWidth: 0.5, marginHorizontal: 5, borderColor: SWATheam.SwaBlack }}>Group Members in {nameOfGroup}</Text>
                <ScrollView>
                  {
                    viewMembers.isView ?
                      <View style={{ paddingVertical: 10 }}>
                        {
                          viewMembers?.status == "success" ?
                            <View>
                              {
                                viewMembers?.data?.map((item, index) => {
                                  return (
                                    <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, paddingVertical: 5, marginHorizontal: 10 }} key={index}>
                                      <View style={{ flex: 1 }}>
                                        <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', fontSize: font15 }}>{item.fullName}</Text>
                                        {
                                          item.userTypeName == "student" ?
                                            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', fontSize: font15 }}>{item.userTypeName} : class {item.className} - {item.sectionName} </Text> :
                                            item.userTypeName == "teacher" ?
                                              <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', fontSize: font15 }}>{item.userTypeName}</Text> : null
                                        }
                                      </View>
                                      <View style={{ alingItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() => removeMemberFrmShareGroup(item.userRefID, item.fullName)}>
                                          <MaterialIcons name={"delete"} size={25} color={'#dc3545'} />
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  )
                                })
                              }
                            </View>
                            :
                            viewMembers?.status == "school" ?
                              <View style={{ justifyContent: 'center', alingItems: 'center', borderWidth: 0.5, borderRadius: 5, borderColor: SWATheam.SwaGray, marginHorizontal: 10, paddingVertical: 10 }}>
                                {
                                  <Text style={{ color: '#198754', fontWeight: '500', fontSize: font15, textAlign: 'center' }}>{viewMembers?.msg}</Text>
                                }
                              </View>
                              :
                              viewMembers?.status == "error" ?
                                <View style={{ justifyContent: 'center', alingItems: 'center', borderWidth: 0.5, borderRadius: 5, borderColor: SWATheam.SwaGray, marginHorizontal: 10, paddingVertical: 10 }}>
                                  {
                                    <Text style={{ color: '#198754', fontWeight: '500', fontSize: font15, textAlign: 'center' }}>{viewMembers?.msg}</Text>
                                  }
                                </View> : null

                        }
                      </View> :
                      <Loader />
                  }
                </ScrollView>
                <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: SWATheam.SwaWhite, borderTopWidth: 0.5, paddingVertical: 5 }}>
                  <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => setshowGroupMembers(false)}>
                    <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Back</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }

            {addMembers &&
              <View style={{ position: 'absolute', top: 0, left: 0, backgroundColor: SWATheam.SwaWhite, flex: 1, width: '100%', height: '100%' }}>
                <View style={{ paddingVertical: 10, paddingTop: 10, paddingBottom: 40, flex: 1, paddingHorizontal: 10 }}>
                  <Text style={{ marginTop: 6, color: SWATheam.SwaBlack, fontSize: font17, fontWeight: '500', borderBottomWidth: 0.5, borderColor: SWATheam.SwaBlack, paddingLeft: 4, paddingBottom: 5 }}>Add/Update group members</Text>
                  <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', borderBottomWidth: 0.5, paddingBottom: 10, borderColor: SWATheam.SwaBlack, marginBottom: 10 }}>
                    <TouchableOpacity style={{ backgroundColor: btnSelect == 1 ? userData.data.colors.mainTheme : userData.data.colors.liteTheme, width: 150, height: 40, flex: 1, marginHorizontal: 5, borderRadius: 50, justifyContent: 'center' }} onPress={() => selectBtn(1)}>
                      <Text style={{ color: btnSelect == 1 ? SWATheam.SwaWhite : SWATheam.SwaBlack, textAlign: 'center' }}>
                        Add Students
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ borderWidth: 1, borderColor: userData.data.colors.liteTheme, backgroundColor: btnSelect == 2 ? userData.data.colors.mainTheme : userData.data.colors.liteTheme, width: 150, height: 40, flex: 1, marginHorizontal: 5, paddingVertical: 5, borderRadius: 50, justifyContent: 'center' }} onPress={() => selectBtn(2)}>
                      <Text style={{ color: btnSelect == 2 ? SWATheam.SwaWhite : SWATheam.SwaBlack, textAlign: 'center' }}>
                        Add Teachers
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ borderWidth: 1, borderColor: userData.data.colors.liteTheme, backgroundColor: btnSelect == 3 ? userData.data.colors.mainTheme : userData.data.colors.liteTheme, width: 150, height: 40, flex: 1, marginHorizontal: 5, paddingVertical: 5, borderRadius: 50, justifyContent: 'center' }} onPress={() => selectBtn(3)}>
                      <Text style={{ color: btnSelect == 3 ? SWATheam.SwaWhite : SWATheam.SwaBlack, textAlign: 'center' }}>
                        Add School
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {btnSelect == 1 ?
                    <View>
                      <View style={{ marginVertical: 10 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50, paddingVertical: 2 }} onPress={() => classDataValidate('class')}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: SWATheam.SwaBlack }}>{selectClassText}</Text>
                          </View>
                          <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                            <Entypo name={"chevron-thin-down"} size={20} color={SWATheam.SwaGray} />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={{ marginBottom: 10 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50, paddingVertical: 2 }} onPress={() => classDataValidate('section')}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: SWATheam.SwaBlack }}>{selectSectionText}</Text>
                          </View>
                          <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                            <Entypo name={"chevron-thin-down"} size={20} color={SWATheam.SwaGray} />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={{ justifyContent: 'center', alingItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 50 }} onPress={() => searchStudents()}>
                          <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Search</Text>
                        </TouchableOpacity>
                      </View>
                      {showStudent == 1 ?
                        <View style={{ borderWidth: 1, borderRadius: 5, borderColor: SWATheam.SwaGray, height: 400, marginTop: 10 }}>
                          <View style={{ borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 7 }}>
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => selectAllBtn()}>
                              {selectAll ?
                                < AntDesign name={"checksquare"} size={17} color={userData.data.colors.mainTheme} /> :
                                studentUserArr.length > 0 ?
                                  < AntDesign name={"minussquare"} size={17} color={userData.data.colors.mainTheme} /> :
                                  <View style={{ borderWidth: 1, height: 14, width: 14, marginTop: 3, marginRight: 3 }}></View>
                              }
                              <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', fontSize: font15 }}>
                                Select All
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <ScrollView>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 10, paddingHorizontal: 5 }}>
                              {
                                studentData?.data?.map((item, index) => {
                                  const ID = item.userRefID
                                  userIDs = studentUserArr.toString()
                                  return (
                                    <TouchableOpacity style={{ borderWidth: 1, borderColor: SWATheam.SwaGray, paddingHorizontal: 7, paddingVertical: 5, marginBottom: 10, marginHorizontal: 5, borderRadius: 50, flexDirection: 'row', alingItems: 'center', justifyContent: 'center' }} key={index} onPress={() => selectUser(ID)
                                    }>
                                      {studentUserArr.includes(ID) ?
                                        <AntDesign name={"checksquare"} size={17} color={userData.data.colors.mainTheme} /> :
                                        <View style={{ borderWidth: 1, height: 14, width: 14, marginTop: 3, marginRight: 3 }}></View>
                                      }
                                      <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', textAlign: 'center' }}>{item.fullName}</Text>
                                    </TouchableOpacity>
                                  )
                                })
                              }
                            </View>
                          </ScrollView>
                          <View style={{ borderTopWidth: 1, paddingVertical: 5, paddingHorizontal: 5, borderColor: SWATheam.SwaGray, marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => { removeAllSelectedfrmGroup(groupId, studentUserArr), setStudentUserArr([]), setAddMemberData({ data: null }), setSelectAll(false) }}>
                              <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Remove Students</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => addMembersOnGroup()}>
                              <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Add Students</Text>
                            </TouchableOpacity>
                          </View>
                        </View> : null
                      }
                    </View> :
                    btnSelect == 2 ?
                      <View style={{ borderWidth: 1, borderRadius: 5, borderColor: SWATheam.SwaGray, height: 400 }}>
                        <View style={{ borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 7 }}>
                          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => selectAllBtn()}>
                            {selectAll ?
                              < AntDesign name={"checksquare"} size={17} color={userData.data.colors.mainTheme} /> :
                              teacherUserArr.length > 0 ?
                                < AntDesign name={"minussquare"} size={17} color={userData.data.colors.mainTheme} /> :
                                <View style={{ borderWidth: 1, height: 14, width: 14, marginTop: 3, marginRight: 3 }}></View>
                            }
                            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', fontSize: font15 }}>
                              Select All
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <ScrollView>
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 10, paddingHorizontal: 5 }}>
                            {
                              teacherList?.data?.map((item, index) => {
                                const fName = item.userData.firstName == null ? ' ' : item.userData.firstName
                                const mName = item.userData.middleName == null ? ' ' : item.userData.middleName
                                const lName = item.userData.lastName == null ? ' ' : item.userData.lastName
                                const fullName = fName + mName + lName
                                const ID = item.loginID
                                userIDs = teacherUserArr.toString()
                                return (
                                  <TouchableOpacity style={{ borderWidth: 1, borderColor: SWATheam.SwaGray, paddingHorizontal: 7, paddingVertical: 5, marginBottom: 10, marginHorizontal: 5, borderRadius: 50, flexDirection: 'row', alingItems: 'center', justifyContent: 'center' }} key={index} onPress={() => selectUser(ID)
                                  }>
                                    {teacherUserArr.includes(ID) ?
                                      <AntDesign name={"checksquare"} size={17} color={userData.data.colors.mainTheme} /> :
                                      <View style={{ borderWidth: 1, height: 14, width: 14, marginTop: 3, marginRight: 3 }}></View>
                                    }
                                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', textAlign: 'center' }}>{fullName}</Text>
                                  </TouchableOpacity>
                                )
                              })
                            }
                          </View>
                        </ScrollView>
                        <View style={{ borderTopWidth: 1, paddingVertical: 5, paddingHorizontal: 5, borderColor: SWATheam.SwaGray, marginTop: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
                          <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => { removeAllSelectedfrmGroup(groupId, teacherUserArr), setTeacherUserArr([]), setAddMemberData({ data: null }), setSelectAll(false) }}>
                            <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Remove Teachers</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => addMembersOnGroup()}>
                            <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Add Teachers</Text>
                          </TouchableOpacity>
                        </View>
                      </View> :
                      btnSelect == 3 ?
                        <View>
                          <View style={{ borderWidth: 1, borderRadius: 5, borderColor: SWATheam.SwaGray, paddingHorizontal: 10, paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                              <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{ color: SWATheam.SwaBlack }}>Add whole school to group.</Text>
                              </View>
                              <View style={{ flex: 0.8, }}>
                                <TouchableOpacity style={{ borderWidth: 1, borderColor: userData.data.colors.mainTheme, borderRadius: 50, width: 140, paddingHorizontal: 5, paddingVertical: 5, backgroundColor: selectWholeSchool == 1 ? userData.data.colors.mainTheme : null }} onPress={() => addWholeSchool()}>
                                  <Text style={{ color: selectWholeSchool == 1 ? SWATheam.SwaWhite : userData.data.colors.mainTheme, textAlign: 'center' }}>Add Whole School</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: SWATheam.SwaBlack }}>Remove All Users From School.</Text>
                              </View>
                              <View style={{ flex: 0.8, alignItems: 'flex-end' }}>
                                <TouchableOpacity style={{ borderWidth: 1, borderColor: userData.data.colors.mainTheme, borderRadius: 50, width: 170, paddingHorizontal: 5, paddingVertical: 5 }} onPress={() => removeAllMemberFrmShareGroup()}>
                                  <Text style={{ color: userData.data.colors.mainTheme, textAlign: 'center' }}>Remove Whole School</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>

                        </View> : null
                  }
                </View>
                <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: SWATheam.SwaWhite, borderTopWidth: 0.5, paddingVertical: 5 }}>
                  <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => { setAddMembers(false), setSelectSection({ data: null, radioID: null }), setSelectClassText('Select Class'), setSelectSectionText('Select Section'), setSelectClass({ data: null, radioID: null }), setclassID(null), setsectionID(null), selectBtn(1), setShowStudent(0) }}>
                    <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }

            {editGroupData &&
              <View style={{ position: 'absolute', top: 0, left: 0, backgroundColor: SWATheam.SwaWhite, flex: 1, width: '100%', height: '100%' }}>
                <View style={{ paddingVertical: 10, paddingTop: 10, paddingBottom: 40, flex: 1, paddingHorizontal: 10 }}>
                  <Text style={{ marginTop: 6, color: SWATheam.SwaBlack, fontSize: font17, fontWeight: '500', borderBottomWidth: 0.5, borderColor: SWATheam.SwaBlack, paddingLeft: 4, paddingBottom: 5 }}>Edit {nameOfGroup}</Text>
                  <View style={{ borderBottomWidth: 1, borderColor: greyClr, paddingBottom: 10, marginTop: 10 }}>
                    <TextInput style={[styles.input]} onChangeText={setNewNameOfGroup} placeholder='New Group Name' placeholderTextColor={SWATheam.SwaGray} />
                    <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 50 }}>
                      <View style={{ flex: 1, padding: 6, paddingLeft: 10 }}>
                        <Text style={{ color: SWATheam.SwaBlack }}>{newGroupFileImg}</Text>
                      </View>
                      <TouchableOpacity style={{ padding: 6, backgroundColor: SWATheam.SwaGray, borderTopRightRadius: 50, borderBottomRightRadius: 50 }} onPress={() => getBrowseImg('image')}>
                        <Text style={{ color: SWATheam.SwaWhite }}>Browse</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                      <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 50, paddingHorizontal: 20, paddingVertical: 5 }} onPress={() => updateGroup()}>
                        <Text style={{ color: SWATheam.SwaWhite }}>Update Group</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: SWATheam.SwaWhite, borderTopWidth: 0.5, paddingVertical: 5 }}>
                  <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => { setEditGroupData(false), getSharingGroup() }}>
                    <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }

            {showClassPopUp &&
              <View style={styles.selectFieldPopUp}>
                <View style={{ backgroundColor: SWATheam.SwaWhite, marginHorizontal: 30, padding: 8, height: 300, borderRadius: 5 }}>
                  <View>
                    <TouchableOpacity style={{ position: 'absolute', top: -15, right: -15 }} onPress={() => SetShowClassPopUp(!showClassPopUp)}>
                      <Entypo name={"circle-with-cross"} size={30} color={SWATheam.SwaBlack} />
                    </TouchableOpacity>
                    <ScrollView>
                      {
                        classData.status && classData.type == 'class' ?
                          classData.data.map((item, index) => {
                            const ID = item.classID
                            return (
                              <View key={index}>
                                <TouchableOpacity onPress={() => { selectClassOpt(ID, item), SetShowClassPopUp(!showClassPopUp) }}>
                                  <View style={{ padding: 10, borderBottomWidth: 1, borderColor: greyClr, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                      <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: SWATheam.SwaGray, justifyContent: 'center', alignItems: 'center' }} value="first">
                                        {
                                          selectClass.radioID === ID ? <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 / 2 }}></View> : null
                                        }
                                      </View>
                                    </View>
                                    <Text style={{ paddingLeft: 10, fontSize: font15, color: SWATheam.SwaBlack }}>
                                      {userData.data.userTypeID == 4 ? item.getClassDetail.classDesc : item.ClassDesc}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            )
                          }) :
                          classData.type == 'section' ?
                            classData?.data.map((item, index) => {
                              const ID = item.sectionID
                              return (
                                <View key={index}>
                                  <TouchableOpacity onPress={() => { selectSectionOpt(ID, item), SetShowClassPopUp(!showClassPopUp) }}>
                                    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: greyClr, flexDirection: 'row', alignItems: 'center' }}>
                                      <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                        <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: SWATheam.SwaGray, justifyContent: 'center', alignItems: 'center' }} value="first">
                                          {
                                            selectSection.radioID === ID ? <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 / 2 }}></View> : null
                                          }
                                        </View>
                                      </View>
                                      <Text style={{ paddingLeft: 10, fontSize: font15, color: SWATheam.SwaBlack }}>
                                        {item.sectionName}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              )
                            })
                            : null
                      }
                    </ScrollView>
                  </View>
                </View>
              </View>
            }

            {fileType.status &&
              <View style={{ flex: 1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: SWATheam.SwaWhite }}>
                <ImageViewer fileType={fileType} setFileType={setFileType} type={'sharing'} />
              </View>
            }
          </View>
        }
      </SafeAreaView>
    </SafeAreaProvider>

  )
}

const styles = StyleSheet.create({

  BtextClr: {
    color: SWATheam.SwaBlack
  },

  WtextClr: {
    color: SWATheam.SwaWhite
  },

  // swaColor: {
  //     backgroundColor: userData.data.colors.mainTheme,
  // },

  input: {
    height: 35,
    borderWidth: 1,
    borderWidth: 1,
    borderColor: SWATheam.SwaGray,
    backgroundColor: SWATheam.SwaWhite,
    borderRadius: 50,
    padding: 8,
    marginBottom: 10,
    color: SWATheam.SwaBlack
  },

  selectFieldPopUp: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  }

});

export default SwaSharing
