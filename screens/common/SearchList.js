import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { SWATheam } from '../../constant/ConstentValue'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GlobleData } from '../../Store'
import SoundPlayer from 'react-native-sound-player'

const SearchList = ({ closeModule, searchItem, searchFunction, dictionaryData }) => {

  const { userData } = useContext(GlobleData)
  const [isPlay, setIsPlay] = useState(false)

  function listen(path) {
    try {
      SoundPlayer.playUrl(path)
      SoundPlayer.addEventListener('FinishedPlaying', (success) => {
        if (success) {
          setIsPlay(false)
        }
      })
    } catch (e) {
      console.log('cannot play the audio file', e)
    }
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
            <Text style={{ padding: 4, flex: 1, textAlign: 'center', fontWeight: 'bold', color: SWATheam.SwaBlack, fontSize: 15 }}>{dictionaryData.status ? "Swaadhyanan Dictionary" : "Search Swaadhyayan"}</Text>
            <TouchableOpacity style={{ padding: 4, width: 40 }}
              onPress={() => closeModule()}>
              <Ionicons name="close" size={20} color={SWATheam.SwaGray} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <>
              {dictionaryData.status ?
                <View style={{ padding: 4, }}>
                  <View style={{ borderBottomWidth: .5, borderColor: SWATheam.SwaBlue, paddingVertical: 4, flexDirection: 'row', alignItems: 'flex-end' }}>
                    <Text style={{ color: userData.data.colors.mainTheme, fontSize: 20, fontWeight: '700', fontStyle: 'italic' }}>{dictionaryData.word}</Text>
                    <Text style={{ flex: 1, color: userData.data.colors.mainTheme, fontStyle: 'italic', paddingHorizontal: 20 }}>{dictionaryData.pronounciation != undefined ? dictionaryData.pronounciation : ''}</Text>
                    {dictionaryData.audio != undefined && dictionaryData.audio != "" ?
                      <TouchableOpacity style={{ width: 42, height: 42, justifyContent: 'center' }} onPress={() => { listen(dictionaryData.audio), setIsPlay(true) }}>
                        <FontAwesome name={!isPlay ? "volume-off" : "volume-up"} size={25} color={SWATheam.SwaBlack} />
                      </TouchableOpacity> : null
                    }

                  </View>
                  {dictionaryData?.data.map((item, index) => {
                    return (
                      <View key={index}>
                        <Text style={{ color: SWATheam.SwaBlack, fontSize: 18, fontStyle: 'italic', textDecorationLine: 'underline' }}>{item.partOfSpeech}</Text>
                        {item.definitions.length ?
                          <>
                            {item.definitions.map((def, defInd) => {
                              return (
                                <View style={{ flexDirection: 'row' }} key={defInd}>
                                  <Text style={{ paddingTop: 4, width: 50, textAlign: 'right', paddingRight: 10, color: SWATheam.SwaBlack, fontWeight: '500', fontWeight: '500' }}>{Number(defInd + 1)}.</Text>
                                  <View style={{ flex: 1, }}>
                                    {def.definition != undefined &&
                                      <>
                                        <Text style={[styles.defText, { textDecorationLine: 'underline', color: SWATheam.SwaGray, fontWeight: '500', fontStyle: 'italic' }]}>def.</Text>
                                        <Text style={styles.defText}>{def.definition}</Text>
                                      </>
                                    }
                                    {def.example != undefined &&
                                      <>
                                        <Text style={[styles.defText, { textDecorationLine: 'underline', color: SWATheam.SwaGray, fontWeight: '500', fontStyle: 'italic' }]}>e.g.</Text>
                                        <Text style={styles.defText}>{def.example}</Text>
                                      </>
                                    }
                                  </View>
                                </View>
                              )
                            })}
                          </> : null
                        }
                      </View>
                    )
                  })}
                  <View style={{ borderBottomWidth: .5, borderColor: SWATheam.SwaBlue, paddingVertical: 4 }}>
                    {dictionaryData.synonyms[0] != undefined &&
                      <>
                        <Text style={{ color: SWATheam.SwaBlack, fontSize: 18, fontStyle: 'italic', textDecorationLine: 'underline', marginTop: 4 }}>Synonyms</Text>
                        <Text style={{ color: SWATheam.SwaBlack, paddingVertical: 4 }}>{dictionaryData.synonyms}</Text>
                      </>
                    }
                    {dictionaryData.antonyms[0] != undefined &&
                      <>
                        <Text style={{ color: SWATheam.SwaBlack, fontSize: 18, fontStyle: 'italic', textDecorationLine: 'underline', marginTop: 4 }}>Antonyms</Text>
                        <Text style={{ color: SWATheam.SwaBlack, paddingVertical: 4 }}>{dictionaryData.antonyms}</Text>
                      </>
                    }
                  </View>

                </View> :
                <>
                  {searchItem.list.map((item, index) => {
                    return (
                      <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.7, borderColor: SWATheam.SwaGray, paddingVertical: 4 }} key={index}>
                        <Image source={{ uri: item.mainIconImage }} style={{ width: 40, height: 40, borderRadius: 50 }} />
                        <View key={index} style={styles.selectItemContainer}>
                          {item.mainIconID != undefined &&
                            <TouchableOpacity onPress={() => searchFunction(item, 'search')}>
                              <Text style={styles.searchText}>{item.mainIconName}</Text>
                            </TouchableOpacity>
                          }
                          {item.subIcon != undefined &&
                            <TouchableOpacity onPress={() => searchFunction(item, 'search')}>
                              <Text style={styles.searchText} > / {item.subIcon.subIconName}</Text>
                            </TouchableOpacity>
                          }
                          {item.chapter != undefined &&
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => searchFunction(item, 'chapter')}>
                              <Text style={styles.searchText}> / {item.chapter.chapterName}</Text>
                              <Text style={[styles.searchText, { color: 'red', fontSize: 12 }]}>[{item.chapter.className}-{item.chapter.subjectCode}]</Text>
                            </TouchableOpacity>
                          }
                          {item.subIcon?.childIcon != undefined &&
                            <TouchableOpacity onPress={() => searchFunction(item, 'search')}>
                              <Text style={styles.searchText}> / {item.subIcon.childIcon.childIconName} </Text>
                            </TouchableOpacity>
                          }
                        </View>
                      </View>
                    )
                  })}
                </>
              }
            </>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default SearchList

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
  selectItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 4,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  searchText: {
    color: SWATheam.SwaBlack,
    padding: 2,
  },
  defText: {
    color: SWATheam.SwaBlack,
    marginTop: 4
  }
})