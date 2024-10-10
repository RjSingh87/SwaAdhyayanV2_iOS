import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, TextInput, Image, CheckBox, ScrollView, TouchableOpacity, TouchableHighlight, Alert, SafeAreaView } from "react-native"
import RenderHtml from 'react-native-render-html';
import { SWATheam } from "../../../../constant/ConstentValue";
var optionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
var number = [1, 2, 3, 4];
var option = ["Delhi", "Jaipur", "Rajesthan", "Haryana"];
export default function Match({ matchData, editMarks, index, selectedQuesIDs, selectedQuesIDsArray }) {
  const [reload, setReload] = useState(false)
  useEffect(() => {
    matchData = matchData
  }, [reload])

  const { width } = useWindowDimensions();
  function getMatchQuesFormate(item) {
    let question = "";
    let options = [];
    let targerTXT = [];

    for (let j = 0; j < 4; j++) {
      let quesPart = item[`questionPart${j + 1}`]
      if (quesPart != undefined) {
        quesPart = quesPart.replace(/<MTECHO>/g, '`');
        quesPart = quesPart.replace(/<\/MTECHO>/g, '`');
        if (quesPart != "") {
          let ext = quesPart.split(".")
          if (ext[1] !== undefined && (ext[1] == 'png' || ext[1] == 'PNG' || ext[1] == 'jpeg' || ext[1] == 'jpg' || ext[1] == 'JPG' || ext[1] == 'gif' || ext[1] == 'web')) {
            let img = `&nbsp; &nbsp;<img style="height:${item['questionImageHight']}px; max-width:250px; margin-top:10px; display: table-cell;
                  vertical-align: middle; " src='https://swaadhyayan.com/data/${item['imagePath']}${quesPart}'/> &nbsp;`
            question += img
          }
          else {
            question += quesPart;
          }

        }
        else {
          break;
        }

      }
    }
    for (let i = 0; i < 8; i++) {
      let optionsId = item[`optionID${i + 1}`];
      let allData = '';
      if (optionsId != 0) {
        let imgData = item[`optionImage${i + 1}`]
        let opt = item[`optionText${i + 1}`]
        opt = opt.replace(/<MTECHO>/g, '`');
        opt = opt.replace(/<\/MTECHO>/g, '`');

        if (imgData != null && imgData != '') {
          let ext = imgData.split(".")
          if (ext[1] !== undefined && (ext[1] == 'png' || ext[1] == 'PNG' || ext[1] == 'jpeg' || ext[1] == 'jpg' || ext[1] == 'JPG' || ext[1] == 'gif' || ext[1] == 'web')) {
            let img = `&nbsp; &nbsp;<img style="height:${item['questionImageHight']}px; max-width:200; margin-top:10px; display: table-cell;
                  vertical-align: middle; " src='https://swaadhyayan.com/data/${item['imagePath']}${imgData}'/> &nbsp;`
            allData += img
          }
          else {
            continue;
          }
        }
        else {
          if (opt != '') {
            allData += opt
          }
        }
        options.push(allData)

      } else {
        continue;
      }
    }
    for (let k = 0; k < 8; k++) {
      let targetText = item[`targetText${k + 1}`];
      if (targetText != undefined) {
        targetText = (targetText != "null" || targetText != "") ? targetText.replace(/<MTECHO>/g, '`') : "";

        if (targetText != '') {
          let ext = targetText.split(".")
          if (ext[1] !== undefined && (ext[1] == 'png' || ext[1] == 'PNG' || ext[1] == 'jpeg' || ext[1] == 'jpg' || ext[1] == 'JPG' || ext[1] == 'gif' || ext[1] == 'web')) {
            let img = `&nbsp; &nbsp;<img style="height:${item.questionImageHight}px; max-width:100%; margin-top:10px; display: table-cell;vertical-align: middle;" src='https://swaadhyayan.com/data/${item['imagePath']}${targetText}'/> &nbsp;`
            targerTXT.push(img)
          }
          else {
            targerTXT.push(targetText)
          }

        } else {
          continue;
        }
      }
    }
    return { question: question, options: options, targerTXT: targerTXT }
  }

  const tagsStyles = {
    body: {
      fontSize: 17,
      color: SWATheam.SwaBlack
    },
    p: {
      fontSize: 17,
      color: SWATheam.SwaBlack
    }
  };

  let MatchData = getMatchQuesFormate(matchData)
  return (
    <>
      <View style={{ backgroundColor: SWATheam.SwaWhite }}>
        <View style={{ backgroundColor: '#efefef', padding: 8, borderRadius: 6, margin: 8 }}>
          <View style={{ padding: 3, margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: SWATheam.SwaBlack }}>
                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', textAlign: 'center' }}>Chapter:{matchData.chapterName}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: SWATheam.SwaBlack }}>Type:MATCH</Text>
              </View>
              <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: SWATheam.SwaBlack, textAlign: 'right' }}>Marks:{matchData.marksPerQuestion}</Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
            <View style={{ width: '12%' }}>
              <Text style={{ color: SWATheam.SwaBlack }}>Q:{index}</Text>
            </View>
            <View style={{ width: '88%' }}>
              <RenderHtml
                contentWidth={width}
                source={{ html: matchData.questionHeading }}
                tagsStyles={tagsStyles}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
            <View style={{ width: '12%' }}>
            </View>
            <View style={{ width: '88%' }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '40%', padding: 8, backgroundColor: SWATheam.SwaLightGray, borderWidth: .7, margin: 4, justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 6 }}>
                  <Text style={{ color: SWATheam.SwaBlack }}>Column A</Text>
                </View>
                <View style={{ width: '40%', padding: 8, backgroundColor: SWATheam.SwaLightGray, borderWidth: .7, margin: 4, justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 6 }}>
                  <Text style={{ color: SWATheam.SwaBlack }}>Column B</Text>
                </View>
              </View>
            </View>
          </View>

          {MatchData.options?.map((item, key) => {
            return (
              <View style={{ flexDirection: 'row', padding: 5, margin: 4 }} key={key}>
                <View style={{ width: '12%' }}>
                </View>
                <View style={{ width: '88%' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '5%', margin: 2 }}>
                      <Text style={{ color: SWATheam.SwaBlack }}>{optionArray[key]}.</Text>
                    </View>
                    <View style={{ width: '95%' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '55%' }}>
                          <TouchableOpacity style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                            <RenderHtml
                              contentWidth={width}
                              source={{ html: item }}
                              tagsStyles={tagsStyles}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={{ width: '30%' }}>
                          <TouchableOpacity style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                            {/* <Text style={{ color: SWATheam.SwaBlack }}>{option[key]}</Text> */}
                            <RenderHtml
                              contentWidth={width}
                              source={{ html: MatchData.targerTXT[key] }}
                              tagsStyles={tagsStyles}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                    </View>
                  </View>
                </View>
              </View>
            )
          })}

          <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'space-between', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            {selectedQuesIDsArray.includes(matchData.questionID + "|" + matchData.marksPerQuestion) == true ?
              <>
                <TouchableOpacity style={{ width: '20%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }} disabled>Edit</Text>
                </TouchableOpacity>
                {/* <View style={{ width: '50%', padding: 5, margin: 4 }}>
                </View> */}
                <TouchableOpacity onPress={() => { selectedQuesIDs(matchData.questionID, matchData.marksPerQuestion); setReload(false) }} style={{ width: '25%', padding: 5, margin: 4, backgroundColor: '#cd5c5c', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>Deselect</Text>
                </TouchableOpacity>
              </>
              :
              <>
                <TouchableOpacity onPress={() => { editMarks(matchData.questionID) }} style={{ width: '20%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }} >Edit</Text>
                </TouchableOpacity>
                {/* <View style={{ width: '50%', padding: 5, margin: 4 }}>
                </View> */}
                <TouchableOpacity onPress={() => { selectedQuesIDs(matchData.questionID, matchData.marksPerQuestion); setReload(true) }} style={{ width: '25%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>Select</Text>
                </TouchableOpacity>
              </>

            }
          </View>

        </View>
      </View>
    </>
  )
}