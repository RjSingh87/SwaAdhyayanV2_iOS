import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { SwaTheam } from '../../../constant/ConstentValue'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomInput from '../../common/CustomInput'
import { GlobleData } from '../../../Store'

const AddEditSubIndicator = ({ editIndicator, closeModule, addSubIndicator, subIndicatorName, addSubIndicatorText, removesubIndicator, updateIndicator}) => {
  const {userData} = useContext(GlobleData)
  const [subIndicatorInput, setSubIndicatorInput] = useState(false)
  const [editItem, setEditItem] = useState({indicatorName:null, subIndicator:[]})
  const indicatorId = editIndicator.editItem.indicatorID
  const indName = editIndicator.editItem.indicatorName
  const indClass = editIndicator.editItem.classID
  console.log(editIndicator)

  function onChangeText(val, type, item){
    if(type=="indName"){
      setEditItem((prev)=>{
        return{...prev, indicatorName:val}
      })
    }
    else if(type=="subInd1"){
      editItem.subIndicator.push({val:val, id:item.subIndicatorID})
    }else if(type=="subInd2"){
      editItem.subIndicator.push({val:val, id:item.subIndicatorID})
     
    }else if(type=="subInd3"){
      editItem.subIndicator.push({val:val, id:item.subIndicatorID})
     
    }else if(type=="subInd4"){
      editItem.subIndicator.push({val:val, id:item.subIndicatorID})
     
    }else if(type=="subInd5"){
      editItem.subIndicator.push({val:val, id:item.subIndicatorID})
    }
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
          <View style={{ backgroundColor: SwaTheam.SwaLightGray, width: 30, height: 6, borderRadius: 4, alignSelf: 'center' }}></View>
          <View style={{ flexDirection: 'row', marginVertical: 10, borderBottomWidth: 1.5, borderColor: SwaTheam.SwaLightGray, paddingVertical: 10 }}>
            <Text style={{ padding: 4, width: 40, }}></Text>
            <Text style={{ padding: 4, flex: 1, textAlign: 'center', fontWeight: 'bold', color: SwaTheam.SwaBlack, fontSize: 15 }}>{editIndicator.action}</Text>

            <TouchableOpacity style={{ padding: 4, width: 40}}
              onPress={() => closeModule()}>
              <Ionicons name="close" size={20} color={SwaTheam.SwaGray} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', marginVertical: 4}}>
            <Text style={{ color: SwaTheam.SwaBlack, width: "45%", fontWeight:'500' }}>Class</Text>
            <Text style={{ color: SwaTheam.SwaBlack, width: 15 }}>:</Text>
            <Text style={{ color: SwaTheam.SwaBlack, width: '45%',}}>{editIndicator.editItem.getClassName.className}</Text>
          </View>
          <View style={{ marginVertical: 4 }}>
            <Text style={{ color: SwaTheam.SwaBlack, paddingVertical: 4, fontWeight:'500' }}>Indicator Name</Text>
            <CustomInput defaultValue={editIndicator.editItem.indicatorName} onChangeText={(val)=>onChangeText(val, 'indName', editIndicator.editItem.indicatorName)} editable="true" selectTextOnFocus="false" />
          </View>
          <View style={{ marginTop: 6, flexDirection:'row', padding:4}}>
            <Text style={{flex:1, color: SwaTheam.SwaBlack, paddingVertical: 4, fontWeight: '500' }}>{editIndicator?.editItem?.getSubIndicator.length>0?"Sub Indicator List":""}</Text>
            <TouchableOpacity style={{width: editIndicator?.editItem?.getSubIndicator.length>0 ? 100:150, flexDirection:'row', justifyContent:'center', pading:4}} onPress={()=> setSubIndicatorInput(true)}>
            <Text style={{flex:1, color: SwaTheam.SwaBlue, paddingVertical: 4, fontWeight: '500' }}>{editIndicator?.editItem?.getSubIndicator.length>0? "Add More": "Add Sub Indicator"}</Text>
            <Ionicons name="add-circle" size={30} color={userData.data.colors.mainTheme} />
            </TouchableOpacity>
          </View>
      {subIndicatorInput &&
          <View style={{ flexDirection: 'row', marginBottom:10}}>
              <View style={{ flex: 1 }}>
                <CustomInput indicator={"true"} placeHolder="Add Sub Indicator" value={subIndicatorName} onChangeText={(val) => addSubIndicatorText(val)} />
              </View>
              <TouchableOpacity style={{ width: 40, justifyContent: 'center', alignItems: 'center',}} onPress={() =>{
                if (editIndicator?.editItem?.getSubIndicator.length <= 4){
                  if(subIndicatorName!=""){
                    addSubIndicator(subIndicatorName, editIndicator.editItem.indicatorID)
                    setSubIndicatorInput(!subIndicatorInput)
                  }else{
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
            {editIndicator?.editItem?.getSubIndicator.map((item, index) => {
              return (
                <View style={{ marginVertical: 6, flexDirection: 'row' }} key={index}>
                  <View style={{ flex: 1 }}>
                    <CustomInput defaultValue={item.subIndicatorName} onChangeText={(val) => onChangeText(val, "subInd"+(index+1), item)} />
                  </View>
                  <TouchableOpacity style={{ width: 40, justifyContent: 'center', alignItems: 'center'}} onPress={() => removesubIndicator(item, editIndicator.editItem.indicatorID)}>
                    <MaterialCommunityIcons name="delete" size={28} color={SwaTheam.SwaRed} />
                  </TouchableOpacity>
                </View>
              )
            })}
          </ScrollView>
        </View>
        {!subIndicatorInput?
        <View style={{backgroundColor:SwaTheam.SwaWhite, padding:10, justifyContent:'center', alignItems:'center', backgroundColor:SwaTheam.SwaLightGray}}>
          <TouchableOpacity style={{padding:10, backgroundColor:SwaTheam.SwaBlue, width:'50%', justifyContent:'center', alignItems:'center', borderRadius:6}} onPress={()=>updateIndicator(editItem, indicatorId, indName, indClass)}>
            <Text style={{textAlign:"center", fontWeight:'500', color:SwaTheam.SwaWhite}}>Update</Text>
          </TouchableOpacity>
        </View>:null
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
    backgroundColor: SwaTheam.SwaWhite,
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