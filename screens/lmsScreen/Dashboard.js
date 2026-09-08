import { StyleSheet, Text, View, ScrollView, StatusBar, SafeAreaView, } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react'
import SwaHeader from '../common/SwaHeader'
import Services from '../../Services'
import { SWATheam, apiRoot } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'
import IconsContainer from '../common/IconsContainer'
import Loader from '../common/Loader'
import CheckInternet from '../common/CheckInternet'
import Orientation from 'react-native-orientation-locker';
import { useDispatch, useSelector } from 'react-redux'
import { fetchSearchDataList, resetSearchDataList } from '../redux/slices/SearchDataList'
import SearchList from '../common/SearchList'
import MsgModal from '../common/MsgModal'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { flowRef } from './flowRef';
import { useActivityTracker } from '../../ActivityTracker';
import SwaAI from '../SwaAI';


const Dashboard = ({ navigation, route }) => {

  const trackActivity = useActivityTracker();

  const dispatch = useDispatch();
  const hasMounted = useRef(false);
  const insets = useSafeAreaInsets();
  const { userData } = useContext(GlobleData)
  const [deshboardData, setDeshboardData] = useState({ icons: null, timeTable: null, iconUrl: '', status: true })
  const [timeTableStructure, setTimeTableStructure] = useState();
  const [isConnected, setIsConnected] = useState(false)
  const searchDataList = useSelector(state => state.Search);
  const [searchItem, setSearchItem] = useState({ list: null, status: false })
  const [msgModalVisible, setMsgModalVisible] = useState({ msg: '', status: false, type: '' })

  const [dictionaryData, setDictionaryData] = useState({ word: "", data: null, synonyms: null, antonyms: null, status: false })

  const activeMainIconIds = [4, 17, 28, 36, 7, 20, 30, 37, 27, 5, 18, 29, 45, 6, 19, 22, 33, 40]
  const timeTable = [16, 32, 36]
  const swaShare = [8, 21, 31, 38]
  // const liveClass = [11,25,34]
  // const CBSESafal = [10,26]

  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  let currentDay = new Date()
  const dayname = weekDays[currentDay.getDay()]

  useEffect(() => {
    appDashboard()
    //  setSearchItem((prev)=>{
    //     return{...prev, list:null, status:false}
    //   })
  }, [])


  useEffect(() => {
    const goBack = navigation.addListener('focus', () => {
      setSearchItem((prev) => {
        return { ...prev, list: null, status: false }
      })
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
    });
    return goBack
  }, [navigation])

  useFocusEffect(
    useCallback(() => {
      if (!hasMounted.current) {
        hasMounted.current = true;
        dispatch(resetSearchDataList());
        return;
      }
      if (!searchDataList.loading) {

        if (flowRef.fromChild2) {
          console.log('1212')
          flowRef.fromChild2 = false; // 🔁 reset
          return; // ❌ skip getSubIcons
        }

        if (searchDataList.data.length > 0) {
          setSearchItem(prev => ({ ...prev, list: searchDataList.data, status: true }));
        } else {
          dispatch(resetSearchDataList());
          setMsgModalVisible(prev => ({
            ...prev,
            msg: 'Data not found.',
            status: true,
            type: 'error',
          }));
          setTimeout(() => {
            setMsgModalVisible(prev => ({ ...prev, status: false }));
          }, 1500);
        }
      }
    }, [searchDataList])
  );

  function closeModule() {
    setSearchItem((prev) => {
      return { ...prev, list: null, status: false }
    });
    setDictionaryData((prev) => {
      return { ...prev, status: false }
    })
  }

  function appDashboard() {
    const dashboardPayload = {
      "userRefID": userData?.data?.userRefID,
      "schoolID": userData?.data?.schoolID,
      "academicYear": userData?.data?.academicYear,
      "transYear": userData?.data?.transYear,
      "userTypeID": userData?.data?.userTypeID
    }
    if (userData.data.userType == "student") {
      dashboardPayload["classID"] = userData.data.classID,
        dashboardPayload["sectionID"] = userData.data.sectionID
    }
    Services.post(apiRoot.appDashboard, dashboardPayload)
      .then((res) => {
        if (res.status == "success") {
          renderTimeTable(res.data.timeTable)
          setDeshboardData((prev) => {
            return { ...prev, icons: res.data.dashIcons, timeTable: res.data.timeTable, iconUrl: res.data.dashIcons.domain, attendance: res.data.attendanceData, status: false }
          })
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
      })
  }
  let count = 1
  function renderTimeTable(data) {

    const structure = data.structure.structure.split(',');
    const tableSturcture = [];

    structure.map((item, key) => {

      const cellSturcture = item.split('_');
      let cellHeading = '';
      if (cellSturcture[1] == 'BR') {
        cellHeading = 'Break';
      } else if (cellSturcture[1] == 'PR') {
        cellHeading = 'Prayer';
      } else if (cellSturcture[1] == 'PD') {
        cellHeading = 'Period ' + count;
        count++
      } else if (cellSturcture[1] == 'EP') {
        cellHeading = 'Extra Period';
      } else if (cellSturcture[1] == 'ZP') {
        cellHeading = 'Zero Period';
      } else if (cellSturcture[1] == 'RC') {
        cellHeading = 'Recess';
      }
      tableSturcture[key] = { 'periodSeq': (key + 1), 'heading': cellHeading, };
    });

    const structureData = data.assignedData;
    const cellData = [];
    let dataIndex = 0;
    structureData.map((item, key) => {
      const currentDay = new Date().getDay();
      const data = item.cellData.split('|');
      const dayData = data[0].split('_');
      const periodData = data[1].split('_');
      if (currentDay == dayData[1]) {
        const teacherName = item.firstName + (item.middleName != null ? ' ' + item.middleName + ' ' : ' ') + (item.lastName != null ? item.lastName : '');
        const subjectName = item.subjectName;
        cellData[dataIndex] = {
          'teacherName': teacherName,
          'subjectName': subjectName,
          'periodSeq': periodData[1],
          'dayName': weekDays[currentDay]
        };

        if (item.className != undefined) {
          cellData[dataIndex] = {
            'teacherName': teacherName,
            'subjectName': subjectName,
            'periodSeq': periodData[1],
            'dayName': weekDays[currentDay],
            'className': item.className,
            'sectionName': item.sectionName
          }
        } else {
          cellData[dataIndex] = {
            'teacherName': teacherName,
            'subjectName': subjectName,
            'periodSeq': periodData[1],
            'dayName': weekDays[currentDay]
          }
        }
        dataIndex++;
      }
    });
    const tableData = [];
    for (let i = 0; i < tableSturcture.length; i++) {
      const tempObj = {};
      const tableHeading = tableSturcture[i]['heading'];
      tempObj['head'] = tableHeading;
      for (let j = 0; j < cellData.length; j++) {
        if (tableSturcture[i].periodSeq == cellData[j].periodSeq) {
          tempObj['body'] = cellData[j];
        }
      }
      if (tableHeading == 'Prayer' || tableHeading == 'Recess' || tableHeading == 'Break') {
        tempObj['veritcalBody'] = tableHeading.split('');
      }
      tableData[i] = tempObj;
    }
    setTimeTableStructure(tableData);
  }

  function onClickLeftIcon() {
    navigation.openDrawer()
  }
  function onClickRightIcon() {
    // setIsInstruction(true)
  }
  function getIconDetail(item, type) {
    const mainIconID = item?.getMainIconsData != undefined ? item.getMainIconsData.mainIconID : item.mainIconID;
    if (activeMainIconIds.includes(mainIconID)) {
      if (mainIconID == 29) {
        navigation.navigate('Assessment')
        trackActivity({
          mainIconID: mainIconID, // for user Activity tracker - Swa-Learning ID
        });
      } else {
        navigation.navigate("subIconScreen", item, type, { fromSearch: type == 'search' ? true : false })
      }
    } else if (timeTable.includes(mainIconID)) {
      navigation.navigate('timeTable', item)
      trackActivity({
        mainIconID: mainIconID, // for user Activity tracker - Swa-Learning ID
      });
    } else if (swaShare.includes(mainIconID)) {
      navigation.navigate('swaShare', item)
      trackActivity({
        mainIconID: mainIconID, // for user Activity tracker - Swa-Learning ID
      });
    } else if (mainIconID == 14) {
      navigation.navigate('studentList', item)
      trackActivity({
        mainIconID: mainIconID, // for user Activity tracker - Swa-Learning ID
      });
    } else if (mainIconID == 15) {
      navigation.navigate('attendance', item)
      trackActivity({
        mainIconID: mainIconID, // for user Activity tracker - Swa-Learning ID
      });
    } else if (mainIconID == 25) {
      navigation.navigate('liveClass', item)
      trackActivity({
        mainIconID: mainIconID, // for user Activity tracker - Swa-Learning ID
      });
    } else if (mainIconID == 11 || mainIconID == 34) {
      navigation.navigate('liveClassList', item)
      trackActivity({
        mainIconID: mainIconID, // for user Activity tracker - Swa-Learning ID
      });
    } else if (mainIconID == 10 || mainIconID == 26) {
      navigation.navigate('safalPP', item)
      trackActivity({
        mainIconID: mainIconID, // for user Activity tracker - Swa-Learning ID
      });
    }
    else {
      alert('coming soon!')
    }
  }
  let counter = 0
  timeTableStructure?.map((item, index) => {
    if (item.head == "Prayer" || item.head == "Recess" || item.head == "Break") {
    } else {
      counter++
    }
  })

  function iconLoader() {
    setDeshboardData((prev) => {
      return { ...prev, status: false }
    })
  }

  function searchFunction(item, type) {
    // flowRef.fromChild2 = true;
    getIconDetail(item, type)
    setSearchItem((prev) => {
      return { ...prev, list: null, status: false }
    })
  }

  const AttendanceCell = ({ title, value }) => (
    <View style={{ width: 200, alignSelf: 'stretch' }}>
      <View
        style={{
          minHeight: 60,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: userData?.data?.colors?.mainTheme,
          borderWidth: 1,
          borderColor: userData?.data?.colors.hoverTheme,
          paddingHorizontal: 8,
        }}>
        <Text
          style={{
            color: '#fff',
            fontWeight: '500',
            textAlign: 'center',
          }}>
          {title}
        </Text>
      </View>

      <View
        style={{
          minHeight: 45,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: userData?.data?.colors.hoverTheme,
        }}>
        <Text style={{ color: SWATheam.SwaGray }}>
          {value}
        </Text>
      </View>
    </View>
  );


  return (
    <>
      {isConnected ?
        <>
          {deshboardData.status ?
            <Loader /> :
            <>
              <View style={{ paddingTop: insets.top, backgroundColor: userData?.data?.colors.mainTheme }}>
                <SwaHeader title={'Swa-Adhyayan LMS'} leftIcon={"bars"} rightIcon={"search1"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} dictionaryIcon={"book"} isDashboard={"dashboard"} setDictionaryData={setDictionaryData} setMsgModalVisible={setMsgModalVisible} />
                <IconsContainer deshboardData={deshboardData} getIconDetail={getIconDetail} type={"mainIcon"} activeMainIconIds={activeMainIconIds} iconLoader={iconLoader} />
              </View>
              <View style={{ marginTop: 20, paddingHorizontal: 10, flex: 1, }}>
                <View style={{ width: '100%', marginBottom: 10 }}>
                  <View style={{ backgroundColor: userData?.data?.colors?.mainTheme, padding: 8, borderRightWidth: 1, borderLeftWidth: 1, borderColor: userData?.data?.colors.hoverTheme }}>
                    <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: 'bold', textTransform: 'uppercase' }}> ATTENDANCE STATUS</Text>
                  </View>
                  <ScrollView horizontal style={{ backgroundColor: SWATheam.SwaWhite }}>
                    <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
                      <AttendanceCell
                        title="Today's Status"
                        value={deshboardData?.attendance[0]?.attendance_status}
                      />

                      <AttendanceCell
                        title="Total Present"
                        value={deshboardData?.attendance[0]?.total_present}
                      />

                      <AttendanceCell
                        title="Total Absent"
                        value={deshboardData?.attendance[0]?.total_absent}
                      />

                      <AttendanceCell
                        title="Present Percentage"
                        value={`${deshboardData?.attendance[0]?.percentage}%`}
                      />
                    </View>
                  </ScrollView>
                </View>

                <View style={{ width: '100%' }}>
                  <View style={{ backgroundColor: userData?.data?.colors?.mainTheme, padding: 8, borderRightWidth: 1, borderLeftWidth: 1, borderColor: userData?.data?.colors.hoverTheme }}>
                    <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: 'bold', textTransform: 'uppercase' }}> {dayname} Time Table</Text>
                  </View>
                  <ScrollView horizontal style={{ backgroundColor: SWATheam.SwaWhite }}>
                    <View style={{ flexDirection: 'row', }}>
                      {timeTableStructure?.map((item, index) => {

                        let isPeriod = 0
                        let headText = ''
                        if (item.head == "Prayer" || item.head == "Recess" || item.head == "Break") {
                          headText = ""
                        } else {
                          headText = item.head
                        }

                        if (item.head == "Period" || item.head == "Extra Period" || item.head == "Zero Period") {
                          isPeriod = 1
                        }
                        return (
                          <View key={index}>
                            {item.head == "Prayer" || item.head == "Recess" || item.head == "Break" ?
                              <>
                                <View style={{ width: counter > 0 ? 40 : 200, paddingVertical: 5, backgroundColor: userData?.data?.colors?.mainTheme, borderWidth: 1, borderColor: userData?.data?.colors.hoverTheme }}>
                                  <Text style={{ padding: 4, textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: "500" }}>{headText}</Text>
                                </View>
                              </> :
                              <>
                                {
                                  timeTableStructure.length <= 3 ?
                                    <>
                                      <View style={{ width: 350, paddingVertical: 5, backgroundColor: userData?.data?.colors?.mainTheme, borderWidth: 1, borderColor: userData?.data?.colors.hoverTheme }}>
                                        <Text style={{ padding: 4, textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: "500" }}>{headText}</Text>
                                      </View>
                                    </> :
                                    <>
                                      <View style={{ width: 180, paddingVertical: 5, backgroundColor: userData?.data?.colors?.mainTheme, borderWidth: 1, borderColor: userData?.data?.colors.hoverTheme }}>
                                        <Text style={{ padding: 4, textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: "500" }}>{headText}</Text>
                                      </View>
                                    </>
                                }
                              </>
                            }
                            <View style={{ backgroundColor: SWATheam.SwaWhite, borderWidth: 1, borderColor: userData?.data?.colors.hoverTheme, height: 145, justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                              {
                                item?.veritcalBody?.map((verticalData, index) => {
                                  return (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} key={index}>
                                      <Text style={{ textTransform: 'uppercase', color: userData?.data?.colors.mainTheme }}>{verticalData}</Text>
                                    </View>
                                  )
                                })
                              }
                              {
                                item?.body &&
                                <View style={{}}>
                                  <Text style={{ textAlign: 'center', color: SWATheam.SwaGray, }}>{item.body.subjectName}</Text>
                                  {userData.data.userTypeID == 4 ?
                                    <Text style={{ textAlign: 'center', color: SWATheam.SwaGray }}>{item.body.className} - {item.body.sectionName}</Text> :
                                    <Text style={{ textAlign: 'center', color: SWATheam.SwaGray }}>{item.body.teacherName}</Text>
                                  }
                                </View>
                              }
                            </View>
                          </View>
                        )
                      })}
                    </View>
                  </ScrollView>
                </View>
              </View>
              {((searchItem.status && searchDataList.data.length > 0) || dictionaryData.status) &&
                <SearchList searchItem={searchItem} closeModule={closeModule} searchFunction={searchFunction} dictionaryData={dictionaryData} />
              }
              <MsgModal msgModalVisible={msgModalVisible} />

              <SwaAI />



            </>
          }
        </> : null
      }
      <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
    </>
  )
}
export default Dashboard
const styles = StyleSheet.create({
  tableCellHead1: {
    width: 60,
    paddingVertical: 5,
    borderWidth: 1,
  },
  tableCellHead2: {
    flex: 1,
    paddingVertical: 5,
    borderWidth: 1,
  }
})