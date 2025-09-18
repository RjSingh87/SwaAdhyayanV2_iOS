import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'



const BottomDrawerList = ({ closeModule, listItem, type, getSelectedItem, selectedField, navigation, languageID, suTypeID }) => {
  const { userData } = useContext(GlobleData)
  let ListName = ''
  if (listItem.type == "class" || listItem.type == "trmClass" || listItem.type == "reportClass") {
    ListName = "Class List"
  } else if (listItem.type == "section" || listItem.type == "reportSection") {
    ListName = "Section List"
  } else if (listItem.type == "subject" || listItem.type == 'trksub' || listItem.type == 'reportSubject' || listItem.type == "gameSubject" || listItem.type == "trmSubject" || listItem.type == "subjAddBySchool") {
    ListName = "Subject List"
  } else if (listItem.type == "book") {
    ListName = "Book List"
  } else if (listItem.type == "act") {
    ListName = listItem.listName.length > 30 ? listItem.listName.substring(0, 30) + '...' : listItem.listName
  } else if (listItem.type == 'trk') {
    ListName = "Level List"
  } else if (listItem.type == 'trmType') {
    ListName = "TRM Type List"
  } else if (listItem.type == "reportStudent" || listItem.type == "student") {
    ListName = "Student List"
  } else if (listItem.type == "reportAss" || listItem.type == "clsWiseReportAss") {
    ListName = "Assessment List"
  } else if (listItem.type == "assessment") {
    ListName = "Assessment List"
  } else if (listItem.type == "meFormet") {
    ListName = "Marks Entry Format"
  } else if (listItem.type == "term") {
    ListName = "Term"
  } else if (listItem.type == "marksType") {
    ListName = "Marks Type"
  } else if (listItem.type == "gradeEntry") {
    ListName = "Select Grade"
  } else if (listItem.type == 'notbook' || listItem.type == 'sea') {
    ListName = "Marks"
  } else if (listItem.type == 'set') {
    ListName = "Select Set"
  } else if (listItem.type == 'QAns') {
    ListName = "Select Type"
  }

  return (
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
          <View style={{ backgroundColor: SWATheam.SwaLightGray, width: 30, height: 6, borderRadius: 4, alignSelf: 'center' }}></View>
          <View style={{ flexDirection: 'row', marginVertical: 10, borderBottomWidth: 1.5, borderColor: SWATheam.SwaLightGray, paddingVertical: 10 }}>
            <Text style={{ padding: 4, width: 40, }}></Text>
            <Text style={{ padding: 4, flex: 1, textAlign: 'center', fontWeight: 'bold', color: SWATheam.SwaBlack, fontSize: 15 }}>{ListName}</Text>

            <TouchableOpacity style={{ padding: 4, width: 40 }}
              onPress={() => closeModule()}>
              <Ionicons name="close" size={20} color={SWATheam.SwaGray} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {listItem.type == 'act' ?
              (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginVertical: 10, paddingHorizontal: 10, }}>
                  {listItem.list.map((item, index) => {

                    let iconName = ''
                    if (languageID == 1) {
                      iconName = item.subPartNameLang2
                    } else {
                      iconName = item.subPartName
                    }
                    return (
                      <TouchableOpacity style={{ height: 140, marginVertical: 10, width: "40%", justifyContent: 'center', alignItems: 'center', backgroundColor: userData.data.colors.liteTheme, borderRadius: 6, justifyContent: 'space-around', padding: 8 }} key={item.subPartID}
                        onPress={() => {
                          getSelectedItem(item, navigation)

                        }
                        }>
                        <View style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', }}>
                          <Image source={{ uri: listItem?.imgUrl + item.uploadIcon }} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                        </View>
                        <View style={{ height: 40, alignItems: 'center', }}>
                          <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{iconName}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })
                  }
                </View>
              ) :
              (<>
                {listItem.list.map((item, index) => {
                  let printValue = "";
                  let listKeys = ''
                  let listItemId = ''
                  if (listItem.type == "class" || listItem.type == "trmClass" || listItem.type == "reportClass") {
                    if (listItem.type == "reportClass") {
                      printValue = item?.classDesc
                      listKeys = item.classID
                      listItemId = selectedField?.class?.classID

                    } else {
                      printValue = item?.getClassDetail?.classDesc
                      listKeys = item.classID
                      listItemId = selectedField?.class?.classID
                    }

                  } else if (listItem.type == "section" || listItem.type == "reportSection") {
                    if (listItem.type == "reportSection") {
                      printValue = item.sectionName
                      listKeys = item.sectionID
                      listItemId = selectedField?.section?.sectionID

                    } else {
                      printValue = item.sectionName
                      listKeys = item.sectionID
                      listItemId = selectedField?.section?.sectionID
                    }
                  } else if (listItem.type == "subject" || listItem.type == "gameSubject" || listItem.type == "trmSubject" || listItem.type == "reportSubject" || listItem.type == "subjAddBySchool") {
                    printValue = item.subjectName
                    listKeys = item.subjectID
                    listItemId = selectedField?.subject?.subjectID
                  } else if (listItem.type == "book") {
                    printValue = selectedField.subject.subjectID == 1 ? item.bookNameLang : item.bookName
                    listKeys = item.bookID
                    listItemId = selectedField?.book?.bookID
                  } else if (listItem.type == "trk") {
                    printValue = item.level
                    listKeys = item.levelID
                    listItemId = selectedField?.level?.levelID
                  } else if (listItem.type == "trksub") {
                    printValue = item.subjectName
                    listKeys = item.subjectID
                    listItemId = selectedField?.trkSub?.subjectID
                  } else if (listItem.type == "trmType") {
                    printValue = item.trmType
                    listKeys = item.trmID
                    listItemId = selectedField?.trmType?.trmID
                  } else if (listItem.type == "reportStudent") {
                    printValue = item.fullName
                    listKeys = item.userRefID
                    listItemId = selectedField?.student?.userRefID

                  } else if (listItem.type == "reportAss") {
                    printValue = item.assessmentName
                    listKeys = item.assessmentID
                    listItemId = selectedField?.asssessment?.assessmentID
                  } else if (listItem.type == "clsWiseReportAss") {
                    printValue = item.examName
                    listKeys = item.examID
                    listItemId = selectedField?.asssessment?.examID

                  } else if (listItem.type == "assessment") {
                    printValue = item.assessmentName
                    listKeys = item.assessmentID
                    listItemId = selectedField?.markAss?.assessmentID
                  } else if (listItem.type == "meFormet") {
                    printValue = item.format
                    listKeys = item.formatID
                    listItemId = selectedField?.markFormet?.formatID
                  } else if (listItem.type == "term") {
                    printValue = item.term
                    listKeys = item.id
                    listItemId = selectedField?.term?.id
                  } else if (listItem.type == "marksType") {
                    printValue = item.marksType
                    listKeys = item.id
                    listItemId = selectedField?.marksType?.id
                  } else if (listItem.type == "gradeEntry") {
                    printValue = item.grade
                    listKeys = item.gradeID
                    listItemId = item?.selectedGrade?.gradeID
                  } else if (listItem.type == 'notbook' || listItem.type == 'sea') {
                    printValue = item.number
                    listKeys = item.id
                    if (listItem.type == 'notbook') {
                      listItemId = listItem.selectedStudent.bookMarks.notebookMarks
                    } else {
                      listItemId = listItem.selectedStudent.bookMarks.seaMarks
                    }
                  } else if (listItem.type == "student") {
                    printValue = item.fullName
                    listKeys = item.userRefID
                    listItemId = item?.selectedField?.student.userRefID
                  } else if (listItem.type == "set") {
                    printValue = item.setName
                    listKeys = item.setID
                    listItemId = selectedField?.set?.setID
                  } else if (listItem.type == "QAns") {
                    printValue = item.type
                    listKeys = item.typeID
                    listItemId = selectedField?.type?.typeID
                  }
                  let clsName = 'radio-button-off'
                  if (listItemId == listKeys) {
                    clsName = 'radio-button-on'
                  }

                  return (
                    <TouchableOpacity
                      key={listKeys}
                      onPress={() => { getSelectedItem(item, listItem.type, index, listItem.index) }}
                      style={styles.selectItemContainer}>
                      <View style={styles.radioBox}>
                        <Ionicons name={clsName} color={SWATheam.SwaBlue} size={20} />
                      </View>
                      <Text style={{ color: SWATheam.SwaGray }}>{printValue}</Text>
                    </TouchableOpacity>
                  )
                })}
              </>
              )
            }

          </ScrollView>
        </View>
        {/* <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => closePopup()}
        /> */}
      </View>
    </Modal>
  )
}

export default BottomDrawerList

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
    paddingBottom: 50,
    alignSelf: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  selectItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    borderBottomWidth: .7,
    borderColor: SWATheam.SwaGray,
    paddingVertical: 6,
    paddingHorizontal: 6,

  },
  radioBox: {
    paddingHorizontal: 10,

  },
})