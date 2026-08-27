import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSearchDataList } from '../redux/slices/SearchDataList'

const SwaHeader = ({ title, leftIcon, rightIcon, onClickLeftIcon, onClickRightIcon, dictionaryIcon, setDictionaryData, setMsgModalVisible, isDashboard, yTubeStatus }) => {

  const dispatch = useDispatch()
  const { userData } = useContext(GlobleData)
  const [searchString, setSearchString] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [action, setAction] = useState('')
  const searchDataList = useSelector(state => state.Search);

  useEffect(() => {
    if (!searchDataList.loading) {
      setSearchString("")
      setShowInput(false)
    }
  }, [searchDataList])

  useEffect(() => {
    setSearchString("")

  }, [])

  function onClickRightIcon(type) {
    if (type == "search") {
      const payload =
      {
        "schoolID": userData.data.schoolID,
        "userTypeID": userData.data.userTypeID,
        "userRefID": userData.data.userRefID,
        "academicYear": userData.data.academicYear,
        "searchString": searchString,
      }
      if (userData.data.userTypeID == 5 || userData.data.userTypeID == 6) {
        payload["classID"] = userData.data.classID
        payload["transYear"] = userData.data.transYear
      }
      dispatch(fetchSearchDataList(payload));
    } else {
      fetchDefinition()
    }
  }
  const fetchDefinition = async () => {
    if (!searchString) return;
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchString}`);
      const resp = await response
      const data = await response.json();
      if (resp.status == 404) {
        setSearchString("")
        setShowInput(false)
        if (data.title === "No Definitions Found") {
          setMsgModalVisible((prev) => {
            return { ...prev, msg: "Word not found", status: true, type: 'error' }
          })
          setTimeout(() => {
            setMsgModalVisible((prev) => {
              return { ...prev, status: false }
            })
          }, 2000);
        }
      } else if (resp.status == 200) {
        setSearchString("")
        setShowInput(false)
        if (data?.length) {
          renderDictView(data[0]);
        }
      }

    } catch (error) {
      console.log(error)
    }
  };
  function renderDictView(data) {
    let audio = '';
    let pronounciation = '';

    if (data?.phonetics?.length) {
      for (let i = 0; i < data.phonetics.length; i++) {
        if (data.phonetics[i].audio != '' && data.phonetics[i].audio != undefined) {
          if (data.phonetics[i].text != '' && data.phonetics[i].text != undefined) {
            audio = data.phonetics[i].audio;
            pronounciation = data.phonetics[i].text;
            break;
          }
        }
      }

      if (audio == '' && pronounciation == '') {
        pronounciation = data.phonetic;
      }
    }
    const synonyms = [];
    const antonyms = [];
    let dif = []
    if (data.meanings.length) {
      data.meanings.map((item, key) => {
        dif.push(item)
        setDictionaryData((prev) => {
          return { ...prev, data: dif }
        })
        if (item.synonyms.length) {
          synonyms.push(item.synonyms);
        }
        if (item.antonyms.length) {
          antonyms.push(item.antonyms);
        }
        if (item.definitions.length) {
          item.definitions.map((defs, defsIndex) => {
            if (defs.example != undefined && defs.example != '') {
              console.log(defs.example)
            }
          });
        }
      });

      if (synonyms.length) {
        synonyms.join('')
      }
      if (antonyms.length) {
        antonyms.join('')
      }
      setDictionaryData((prev) => {
        return { ...prev, word: data.word, synonyms: synonyms.toString(), antonyms: antonyms.toString(), audio: audio, pronounciation: pronounciation, status: true }
      })
    }

  }

  function searchAction(type) {
    if (type == "search") {
      if (searchString != "") {
        onClickRightIcon(type)
      } else {
        setShowInput(!showInput)
      }
    } else {
      if (searchString != "") {
        onClickRightIcon(type)
      } else {
        setShowInput(!showInput)
      }
    }
  }



  return (
    <View style={[styles.header, { backgroundColor: yTubeStatus == true ? null : userData?.data?.colors?.mainTheme, borderBottomWidth: 0, borderColor: 'rgba(0, 0, 0, 0.8)' }]}>
      <TouchableOpacity style={styles.btn}
        onPress={() => onClickLeftIcon()}
      >
        <AntDesign name={leftIcon} size={30} color={SWATheam.SwaWhite} />
      </TouchableOpacity>
      {!showInput ?
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
          <Text style={{ fontWeight: '700', color: SWATheam.SwaWhite, textAlign: 'center', fontSize: 16 }}>{title?.length > 35 ? title.substring(0, 31) + '...' : title}</Text>
        </View> :
        <TextInput type={"text"} placeholder='Search here' placeholderTextColor={SWATheam.SwaGray} value={searchString} style={{ flex: 1, color: SWATheam.SwaBlack, paddingHorizontal: 6, borderRadius: 6, backgroundColor: SWATheam.SwaWhite, height: 40, width: '30%' }}
          onChangeText={val => {
            setSearchString(val)
          }}
          onBlur={() => searchAction(action)}
        />
      }
      {rightIcon != undefined ?
        <>
          <TouchableOpacity style={styles.btn}
            onPress={() => {
              setAction("search")
              // if(searchString!=""){
              //   onClickRightIcon('search')
              // }else{
              // setShowInput(!showInput)
              // }
            }
            }
          >
            {/* <AntDesign name={rightIcon} size={25} color={SWATheam.SwaWhite}/> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}
            onPress={() => {
              setAction("dic")
              if (searchString != "") {
                onClickRightIcon('dic')
              } else {
                setShowInput(!showInput)
              }
            }
            }
          >
            <AntDesign name={dictionaryIcon} size={25} color={SWATheam.SwaWhite} />
          </TouchableOpacity>
        </> :
        <View style={styles.btn}>
        </View>
      }
    </View>
  )
}

export default SwaHeader

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    elevation: 9,
  },
  shadowProp: {
    borderBottomWidth: 1
  },
  btn: {
    width: 40,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  }
})