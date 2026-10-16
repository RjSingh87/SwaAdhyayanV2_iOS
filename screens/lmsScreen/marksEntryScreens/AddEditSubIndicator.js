import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { SWATheam } from '../../../constant/ConstentValue'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomInput from '../../common/CustomInput'
import { GlobleData } from '../../../Store'

const AddEditSubIndicator = ({ editIndicator, closeModule, addSubIndicator, subIndicatorName, addSubIndicatorText, removesubIndicator, updateIndicator }) => {
  const { userData } = useContext(GlobleData)
  const [subIndicatorInput, setSubIndicatorInput] = useState(false)
  const [indicatorNameState, setIndicatorNameState] = useState(editIndicator?.editItem?.indicatorName || '')
  const [subIndicatorsState, setSubIndicatorsState] = useState([])

  const indicatorId = editIndicator?.editItem?.indicatorID
  const indName = editIndicator?.editItem?.indicatorName
  const indClass = editIndicator?.editItem?.classID

  useEffect(() => {
    setIndicatorNameState(editIndicator?.editItem?.indicatorName || '')
    const list = (editIndicator?.editItem?.getSubIndicator || []).map(item => ({
      id: item.subIndicatorID,
      val: item.subIndicatorName
    }))
    setSubIndicatorsState(list)
  }, [editIndicator])

  function handleIndicatorNameChange(val) {
    setIndicatorNameState(val)
  }

  function handleSubIndicatorChange(val, subIndicatorID) {
    setSubIndicatorsState(prev =>
      prev.map(item =>
        item.id === subIndicatorID ? { ...item, val: val } : item
      )
    )
  }

  function handleUpdate() {
    const originalIndName = (editIndicator?.editItem?.indicatorName || '').trim()
    const currentIndName = (indicatorNameState || '').trim()
    const isIndNameChanged = currentIndName !== originalIndName

    const originalSubIndicators = editIndicator?.editItem?.getSubIndicator || []
    let isSubIndChanged = false

    if (subIndicatorsState.length !== originalSubIndicators.length) {
      isSubIndChanged = true
    } else {
      for (let i = 0; i < subIndicatorsState.length; i++) {
        const currentVal = (subIndicatorsState[i]?.val || '').trim()
        const origVal = (originalSubIndicators[i]?.subIndicatorName || '').trim()
        if (currentVal !== origVal) {
          isSubIndChanged = true
          break
        }
      }
    }

    if (!isIndNameChanged && !isSubIndChanged) {
      alert('No changes to update.')
      return
    }

    const payloadItem = {
      indicatorName: currentIndName,
      subIndicator: subIndicatorsState
    }

    updateIndicator(payloadItem, indicatorId, indName, indClass)
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}>
      <View style={styles.garyContainer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => closeModule()}
        />
        <View style={styles.listBox}>
          <View style={{ backgroundColor: SWATheam.SwaLightGray, width: 30, height: 6, borderRadius: 4, alignSelf: 'center' }}></View>
          <View style={{ flexDirection: 'row', marginVertical: 10, borderBottomWidth: 1.5, borderColor: SWATheam.SwaLightGray, paddingVertical: 10 }}>
            <Text style={{ padding: 4, width: 40, }}></Text>
            <Text style={{ padding: 4, flex: 1, textAlign: 'center', fontWeight: 'bold', color: SWATheam.SwaBlack, fontSize: 15 }}>{editIndicator.action}</Text>

            <TouchableOpacity style={{ padding: 4, width: 40 }}
              onPress={() => closeModule()}>
              <Ionicons name="close" size={20} color={SWATheam.SwaGray} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', marginVertical: 4 }}>
            <Text style={{ color: SWATheam.SwaBlack, width: "45%", fontWeight: '500' }}>Class</Text>
            <Text style={{ color: SWATheam.SwaBlack, width: 15 }}>:</Text>
            <Text style={{ color: SWATheam.SwaBlack, width: '45%', }}>{editIndicator.editItem.getClassName.className}</Text>
          </View>
          <View style={{ marginVertical: 4 }}>
            <Text style={{ color: SWATheam.SwaBlack, paddingVertical: 4, fontWeight: '500' }}>Indicator Name</Text>
            <CustomInput value={indicatorNameState} onChangeText={(val) => handleIndicatorNameChange(val)} editable="true" selectTextOnFocus="false" />
          </View>
          <View style={{ marginTop: 6, flexDirection: 'row', padding: 4 }}>
            <Text style={{ flex: 1, color: SWATheam.SwaBlack, paddingVertical: 4, fontWeight: '500' }}>{editIndicator?.editItem?.getSubIndicator.length > 0 ? "Sub Indicator List" : ""}</Text>
            <TouchableOpacity style={{ width: editIndicator?.editItem?.getSubIndicator.length > 0 ? 100 : 150, flexDirection: 'row', justifyContent: 'center', pading: 4 }} onPress={() => setSubIndicatorInput(true)}>
              <Text style={{ flex: 1, color: SWATheam.SwaBlue, paddingVertical: 4, fontWeight: '500' }}>{editIndicator?.editItem?.getSubIndicator.length > 0 ? "Add More" : "Add Sub Indicator"}</Text>
              <Ionicons name="add-circle" size={30} color={userData.data.colors.mainTheme} />
            </TouchableOpacity>
          </View>
          {subIndicatorInput &&
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <View style={{ flex: 1 }}>
                <CustomInput indicator={"true"} placeHolder="Add Sub Indicator" value={subIndicatorName} onChangeText={(val) => addSubIndicatorText(val)} />
              </View>
              <TouchableOpacity style={{ width: 40, justifyContent: 'center', alignItems: 'center', }} onPress={() => {
                if (editIndicator?.editItem?.getSubIndicator.length <= 4) {
                  if (subIndicatorName != "") {
                    addSubIndicator(subIndicatorName, editIndicator.editItem.indicatorID)
                    setSubIndicatorInput(!subIndicatorInput)
                  } else {
                    alert('Enter Sub Indicator.')
                  }
                } else {
                  alert("Sub Indicator limit reached.")
                  setSubIndicatorInput(!subIndicatorInput)
                }
              }
              }>
                <Ionicons name="send" size={26} color={userData.data.colors.mainTheme} />
              </TouchableOpacity>
            </View>
          }


          <ScrollView>
            {subIndicatorsState.map((item, index) => {
              const originalItem = editIndicator?.editItem?.getSubIndicator?.[index]
              return (
                <View style={{ marginVertical: 6, flexDirection: 'row' }} key={item.id || index}>
                  <View style={{ flex: 1 }}>
                    <CustomInput value={item.val} onChangeText={(val) => handleSubIndicatorChange(val, item.id)} />
                  </View>
                  <TouchableOpacity style={{ width: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => removesubIndicator(originalItem || { subIndicatorID: item.id }, editIndicator.editItem.indicatorID)}>
                    <MaterialIcons name="delete" size={28} color={SWATheam.SwaRed} />
                  </TouchableOpacity>
                </View>
              )
            })}
          </ScrollView>
        </View>
        {!subIndicatorInput ?
          <View style={{ backgroundColor: SWATheam.SwaWhite, padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: SWATheam.SwaLightGray }}>
            <TouchableOpacity style={{ padding: 10, backgroundColor: SWATheam.SwaBlue, width: '50%', justifyContent: 'center', alignItems: 'center', borderRadius: 6 }} onPress={handleUpdate}>
              <Text style={{ textAlign: "center", fontWeight: '500', color: SWATheam.SwaWhite }}>Update</Text>
            </TouchableOpacity>
          </View> : null
        }

      </View>
    </Modal>
  )
}

export default AddEditSubIndicator

const styles = StyleSheet.create({
  garyContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  listBox: {
    backgroundColor: SWATheam.SwaWhite,
    maxHeight: '90%',
    minHeight: 50,
    width: "100%",
    alignSelf: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
})