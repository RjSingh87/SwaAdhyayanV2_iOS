import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Loader from '../../common/Loader';
import SwaHeader from '../../common/SwaHeader';
import { GlobleData } from '../../../Store';
import { SWATheam, apiRoot } from '../../../constant/ConstentValue';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Services from '../../../Services';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CbseSafal({ navigation, route }) {
  const { userData } = useContext(GlobleData)
  const toolName = route.params.getSubIconsData.subIconName

  useEffect(() => {
    getList();
  }, [])

  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }

  const [getListData, setgetList] = useState([]);
  const [siteUrl, setsiteUrl] = useState();
  const [listExdata, setExamList] = useState([]);
  const [checkBox, setCheckbox] = useState([]);
  const [qheadIds, setQHeadIds] = useState({
    headIds: ''
  })
  const [combo, setCombo] = useState({
    showLoader: false,
    examList: false,
    attemptHolder: false
  })
  function getList() {
    setCombo((x) => {
      return { ...x, showLoader: true }
    })

    Services.post(apiRoot.studentCbseSafalList)
      .then((res) => {
        if (res.status == "success") {
          setgetList(res.data.safalData);
          setsiteUrl(res.data.siteUrl);
          setCombo((x) => {
            return { ...x, showLoader: false }
          })
        } else {
          alert("Data not found")
        }
      })
      .catch((err) => {
        alert(err)
      })
      .finally(() => {
        setCombo((x) => {
          return { ...x, showLoader: false }
        })
      })
  }
  function mainIcon(item) {
    setCombo((x) => {
      return { ...x, showLoader: true }
    })
    let iconids = item.quesHeadID;
    const postData = {
      "classID": userData.data.classID,
      "safalIconID": iconids
    }
    setQHeadIds((ids) => {
      return { ...ids, headIds: iconids }
    })
    Services.post(apiRoot.getConpitativeExamList, postData)
      .then((examListData) => {
        console.log(examListData)
        if (examListData.status == "success") {
          setExamList(examListData?.data)
          setCombo((x) => {
            return {
              ...x,
              showLoader: false,
              examList: true,
            }
          })
        } else if (examListData.status == "error") {
          alert(examListData.message)
          // setChapterHolder(false)
        }
      })
      .catch((err) => {
        alert(err)
      })
      .finally(() => {
        setCombo((x) => {
          return { ...x, showLoader: false }
        })
      })
  }
  function hideModels() {
    setCheckbox([])
    setCombo((x) => {
      return {
        ...x,
        examList: false,
      }
    })
  }
  function practList(item) {
    let seliDs = item.quesGroupID;
    if (checkBox.includes(seliDs)) {
      setCheckbox(checkBox.filter(item => item !== seliDs));
    } else {
      setCheckbox([...checkBox, seliDs]);
    }
  }
  function startPractices() {
    setCombo((x) => {
      return { ...x, showLoader: true }
    })
    let safalIds = checkBox.join(',')
    const payload = {
      "safalExamID": safalIds,
      "quesHeadID": qheadIds.headIds,
      "userRefID": userData.data.userRefID,
      "classID": userData.data.classID
    }
    Services.post(apiRoot.getSafalExamQuestion, payload)
      .then((res) => {
        if (res.status == "success") {
          setCheckbox([])
          setCombo((x) => {
            return {
              ...x,
              examList: false,
            }
          })
          const queData = {
            question: res?.data?.questionData[0]?.questionData,
            totaQuest: res?.data?.questionData[0]?.questionData.length,
            imgUrl: res.data.imgUrl,
            qSetIds: res.data?.questionData[0]?.qSetID
          }
          // question Screen //
          navigation.navigate('mcqScreen', { data: queData })
          setCombo((x) => {
            return { ...x, attemptHolder: true, showLoader: false }
          })
          // question Screen //
        } else {
          setCombo((x) => {
            return {
              ...x,
              examList: false,
            }
          })
          alert(qData.message);

        }
      })
      .catch((err) => {
        alert(err)
      })
      .finally(() => {
        setCombo((x) => {
          return { ...x, showLoader: false }
        })
      })
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'right', "top"]} style={{ flex: 1, backgroundColor: userData.data.colors.mainTheme }}>
        {combo.showLoader ?
          <Loader /> :
          <View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme, marginTop: Platform.OS === "ios" ? 0 : 24 }}>
            <SwaHeader title={toolName} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
            <ScrollView>
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {getListData.map((item, index) => {
                  return (
                    <TouchableOpacity style={styles.imgsBox} key={index} onPress={() => { mainIcon(item) }}>
                      <Image style={styles.imgHolder} source={{ uri: siteUrl + item?.iconPath + item?.iconLogo }} />
                      <Text style={styles.textFonts}>{item.quesHeadNameLang1}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </ScrollView>

            {combo.examList ?
              <Modal
                animationType="slide"
                transparent={true}
              >
                <View style={styles.garyContainer}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => hideModels()}
                  />

                  <View style={styles.listBox}>
                    <View style={{ backgroundColor: SWATheam.SwaLightGray, width: 30, height: 6, borderRadius: 4, alignSelf: 'center' }}></View>
                    <View style={{ flexDirection: 'row', marginVertical: 10, borderBottomWidth: 1.5, borderColor: SWATheam.SwaLightGray, paddingVertical: 10 }}>
                      <Text style={{ padding: 4, width: 40, }}></Text>
                      <Text style={{ padding: 4, flex: 1, textAlign: 'center', fontWeight: 'bold', color: SWATheam.SwaBlack, fontSize: 15 }}>Competitive Exam Practice</Text>

                      <TouchableOpacity style={{ padding: 4, width: 40 }}
                        onPress={() => hideModels()}>
                        <Ionicons name="close" size={20} color={SWATheam.SwaGray} />
                      </TouchableOpacity>
                    </View>
                    <ScrollView>
                      <View style={styles.listHolder}>
                        {listExdata.map((item, index) => {
                          return (
                            <TouchableOpacity key={index} style={[styles.rowList, ({ backgroundColor: checkBox.includes(item.quesGroupID) ? userData.data.colors.liteTheme : '#fff', borderWidth: 1, borderColor: SWATheam.SwaWhite })]} onPress={() => { practList(item) }}>
                              <View>
                                <Checkbox.Item color={userData.data.colors.mainTheme} status={checkBox.includes(item.quesGroupID) ? "checked" : 'unchecked'} />
                              </View>
                              <View>
                                <Text>{item.quesGroupNameLang1}</Text>
                              </View>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                    </ScrollView>
                    <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, padding: 12, marginBottom: 10, borderRadius: 6 }}
                      onPress={() => startPractices()}>
                      <Text style={{ textAlign: 'center', textTransform: 'uppercase', color: SWATheam.SwaWhite, fontWeight: '500' }}>Start Practice</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal> : null
            }
          </View>
        }
      </SafeAreaView>
    </SafeAreaProvider>


  );
}

const styles = StyleSheet.create({
  startPText: {
    color: '#fff',
    textAlign: "center",
    fontSize: 15
  },
  startPractice: {
    padding: 10,
    backgroundColor: "#01A140",
    width: 200,
    borderRadius: 50,
    elevation: 9,
    marginBottom: 10,
    margin: 'auto'
  },
  rowList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5
  },
  comppeti: {
    fontSize: 13,
    color: "#fff",
  },
  model: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
  },
  imgHolder: {
    width: 80,
    height: 80,
    resizeMode: "contain"
  },
  textFonts: {
    textAlign: "center",
    fontSize: 13,
    color: SWATheam.SwaBlack
  },
  imgsBox: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 15,
    padding: 10,
    display: 'flex',
    alignItems: "center",
    borderColor: "#E1E1E1",
    elevation: 9,

  },
  manBack: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#D7D7D7"
  },
  headers: {
    width: "100%",
    backgroundColor: "#121734",
    padding: 10,
  },
  headerSecond: {
    backgroundColor: "#121734",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  textCbse: {
    color: "#fff",
    width: "100%",
    textAlign: "center"
  },
  rowBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-around"
  },
  garyContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  listBox: {
    backgroundColor: SWATheam.SwaWhite,
    maxHeight: '60%',
    minHeight: 50,
    width: "100%",
    alignSelf: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },


});
