import { StyleSheet, Text, View, Image, StatusBar, FlatList, TouchableOpacity, Modal, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { GlobleData } from '../Store'
import { apiRoot, SWATheam } from '../constant/ConstentValue'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotificationList } from './redux/slices/NotificationList'
import Services from '../Services'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const Notification = ({ navigation }) => {
  const [showPopup, setShowPopup] = useState(false)
  const [popupData, setPopupData] = useState()
  const [scrollLoader, setScrollLoader] = useState(false)
  const insets = useSafeAreaInsets();
  const { userData } = useContext(GlobleData)
  const dispatch = useDispatch()
  const notificationList = useSelector(state => state.NotisList)
  useEffect(() => {
    getNotificationList()
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getNotificationList()
    });
    return unsubscribe;
  }, []);

  function getNotificationList() {

    const payload = {
      "classID": userData.data.classID,
      "sectionID": userData.data.sectionID,
      "userRefID": userData.data.userRefID,
      "schoolID": userData.data.schoolID,
      "userTypeID": userData.data.userTypeID
    }
    dispatch(fetchNotificationList(payload));
    setScrollLoader(false)

  }

  function closeModule() {
    setShowPopup(false)
  }
  function readMore(data) {
    setShowPopup(true)
    setPopupData(data)
  }

  function viewNotification(val) {
    const payload = {
      "noticeID": val.notificationID,
      "userRefID": userData.data.userRefID
    }
    Services.post(apiRoot.notificationView, payload)
      .then((res) => {
        if (res.status == "success") {
          setShowPopup(false)
          getNotificationList()
        } else {
          setShowPopup(false)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setShowPopup(false))
  }

  return (
    <View style={{ flex: 1, backgroundColor: userData.data.colors.mainTheme, paddingTop: insets.top, }}>
      {!notificationList?.data?.length ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require("./assets/Notification.png")} style={{ width: 100, height: 100 }} tintColor={userData.data.colors.hoverTheme} />
          <Text style={{ marginTop: 20, fontSize: 18, fontWeight: '500', textAlign: 'center', color: SWATheam.SwaWhite }}>No notification here.</Text>
          <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, paddingHorizontal: 20, marginTop: 10 }}>There are not notification to display at this time. Please check back later.</Text>
        </View> :
        <View style={{ flex: 1, padding: 10, }}>
          <FlatList
            data={notificationList?.data}
            keyExtractor={item => item.notificationID}
            refreshControl={
              <RefreshControl
                refreshing={scrollLoader}
                onRefresh={() => {
                  setScrollLoader(true);
                  getNotificationList();
                }}
                tintColor={SWATheam.SwaBlue}
                title='Refresh'
              />}
            renderItem={({ item, index }) => {
              return (
                <View style={{ backgroundColor: SWATheam.SwaWhite, borderRadius: 6, padding: 8, marginVertical: 6, elevation: 7 }}>
                  <Text style={{ fontWeight: '500', color: SWATheam.SwaBlack, borderBottomWidth: .5, borderColor: userData.data.colors.mainTheme, paddingVertical: 2 }}>{item.subjectTitle}</Text>
                  <View style={{ flexDirection: 'row', marginVertical: 8 }}>
                    <Text style={{ width: 50, color: SWATheam.SwaBlack, fontWeight: "500" }}>Msg.</Text>
                    <Text style={{ color: SWATheam.SwaGray }}>{item.messageText.length > 30 ? item.messageText.substring(0, 27) + '...' : item.messageText}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginVertical: 8 }}>
                    <Text style={{ width: "50%", color: SWATheam.SwaBlack, fontWeight: "500" }}>Start Date: {item.publishStartDate}</Text>
                    <Text style={{ width: "50%", color: SWATheam.SwaBlack, fontWeight: "500" }}>End Date: {item.publishEndDate}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}></View>
                    <TouchableOpacity style={{ width: 100, padding: 6, borderRadius: 4, borderWidth: 1, borderColor: SWATheam.SwaBlue, color: SWATheam.SwaBlue, marginHorizontal: 4 }} onPress={() => readMore(item)}>
                      <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>Read More...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: 100, padding: 6, borderRadius: 4, borderWidth: 1, borderColor: SWATheam.SwaRed, color: SWATheam.SwaBlue, marginHorizontal: 4 }} onPress={() => viewNotification(item)}>
                      <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }}
          />
        </View>
      }
      {showPopup &&
        <Modal
          animationType="slide"
          transparent={true}
        >
          <View style={styles.garyContainer}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => closeModule()}
            />

            <View style={styles.listBox}>
              <View style={{ flexDirection: 'row', marginVertical: 10, borderBottomWidth: 1.5, borderColor: SWATheam.SwaLightGray, paddingVertical: 6 }}>
                <Text style={{ padding: 4, width: 40, }}></Text>
                <Text style={{ padding: 4, flex: 1, textAlign: 'center', fontWeight: 'bold', color: SWATheam.SwaBlack, fontSize: 15 }}>Notification</Text>
                <Text style={{ padding: 4, width: 40, }}></Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 90, fontWeight: '500', color: SWATheam.SwaBlack }}>Name:</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack, }}>{popupData.subjectTitle}</Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Text style={{ width: 90, fontWeight: '500', color: SWATheam.SwaBlack }}>Msg:</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack, }}>{popupData.messageText}</Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Text style={{ width: 90, fontWeight: '500', color: SWATheam.SwaBlack }}>Start Date:</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack, }}>{popupData.publishStartDate}</Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Text style={{ width: 90, fontWeight: '500', color: SWATheam.SwaBlack }}>End Date:</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack, }}>{popupData.publishEndDate}</Text>
              </View>

              {popupData.postByUserName != "" ?
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Text style={{ width: 90, fontWeight: '500', color: SWATheam.SwaBlack }}>Post by:</Text>
                  <Text style={{ flex: 1, color: SWATheam.SwaBlack, }}>{popupData.postByUserName}</Text>
                </View> : null
              }


              <View style={{ paddingVertical: 6, marginVertical: 20, borderTopWidth: 1, borderColor: SWATheam.SwaLightGray }}>
                <Text style={{ textAlign: "center", color: SWATheam.SwaBlack, fontSize: 16, fontWeight: "500" }}>You want to remove this notification?</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                  <TouchableOpacity style={{ width: 150, padding: 8, borderRadius: 4, backgroundColor: SWATheam.SwaRed }} onPress={() => closeModule()}>
                    <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>CLOSE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: 150, padding: 8, borderRadius: 4, backgroundColor: SWATheam.SwaBlue }} onPress={() => viewNotification(popupData)}>
                    <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>REMOVE</Text>
                  </TouchableOpacity>

                </View>
              </View>

            </View>
            {/* <TouchableOpacity
               style={{ flex: 1 }}
               onPress={() => closeModule()}
             /> */}
          </View>
        </Modal>

      }
    </View>

  )
}

export default Notification

const styles = StyleSheet.create({

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
})