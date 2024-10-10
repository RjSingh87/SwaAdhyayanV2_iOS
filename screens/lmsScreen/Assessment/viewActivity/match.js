import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, TextInput, Image, CheckBox, ScrollView, TouchableOpacity, TouchableHighlight, Alert, SafeAreaView } from "react-native"
import RenderHtml from 'react-native-render-html';
import { SwaTheam } from "../../../../constant/ConstentValue";
var optionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
var number = [1, 2, 3, 4];
var option = ["Delhi", "Jaipur", "Rajesthan", "Haryana"];
export default function Match({ matchData, index }) {

  const tagsStyles = {
    body: {
      color: SwaTheam.SwaBlack
    },
    p: {
      color: SwaTheam.SwaBlack
    }
  };


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
            let img = `&nbsp; &nbsp;<img style="height:${item['questionImageHight']}px; max-width:100%; margin-top:10px; display: table-cell;
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
            let img = `&nbsp; &nbsp;<img style="height:${item['questionImageHight']}px; max-width:100%; margin-top:10px; display: table-cell;
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

  let MatchData = getMatchQuesFormate(matchData)

  return (
    <>
      <View style={{ backgroundColor: '#fff', marginBottom: 6 }}>
        <View style={{ backgroundColor: '#efefef', borderRadius: 6 }}>

          {/* <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
              <Text>Chapter:{matchData.chapterName}</Text>
            </View>
            <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
              <Text>Type:MATCH</Text>
            </View>
            <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
              <Text>Marks:{matchData.quesSelectedMark}</Text>
            </View>
          </View> */}

          <View style={{ padding: 3, margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: '#fff' }}>
                <Text style={{ color: '#000', fontWeight: '700', textAlign: 'center' }}>Chapter: {matchData.chapterName}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: '#000' }}>Type: MATCH</Text>
              </View>
              <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: '#000', textAlign: 'right' }}>Marks: {matchData.marksPerQuestion}</Text>
              </View>
            </View>
          </View>


          <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
            <View style={{ width: '12%' }}>
              <Text style={{ color: '#000' }}>Q: {index}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <RenderHtml
                contentWidth={width}
                source={{ html: matchData.questionHeading }}
                tagsStyles={tagsStyles}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', padding: 5, margin: 4, justifyContent: 'space-evenly' }}>
            <View style={{ padding: 8, paddingHorizontal: 20, backgroundColor: '#fff', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 6 }}>
              <Text style={{ color: '#000' }}>Column A</Text>
            </View>
            <View style={{ padding: 8, paddingHorizontal: 20, backgroundColor: '#fff', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 6, marginRight: 20 }}>
              <Text style={{ color: '#000' }}>Column B</Text>
            </View>
          </View>

          {MatchData.options?.map((item, key) => {
            return (
              <View style={{ flexDirection: 'row', padding: 5, margin: 4, paddingLeft: 30 }} key={key}>
                <View style={{}}>
                  <Text style={{ color: '#000' }}>{optionArray[key]}.</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 10 }}>
                  <View style={{ flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <View style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                        <RenderHtml
                          contentWidth={width}
                          source={{ html: item }}
                          tagsStyles={tagsStyles}
                        />
                      </View>
                    </View>
                    <View style={{ flex: 1}}>
                      <View style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                        {/* <Text style={{ color: '#000' }}>{option[key]}</Text> */}
                        <RenderHtml
                          contentWidth={width}
                          source={{ html: MatchData.targerTXT[key] }}
                          tagsStyles={tagsStyles}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}

          <View style={{ marginHorizontal: 10, paddingVertical: 5, borderTopWidth: .7 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 110 }}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>Correct Answers</Text>
              </View>
              <View>
                <Text style={{ color: '#000' }}>:</Text>
              </View>
              <View style={{ paddingHorizontal: 5, flex: 1 }}>
                <Text style={{ color: '#000' }}>{matchData.answerText.replaceAll("???", ",")}</Text>
              </View>
            </View>
            {/* <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 110 }}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>Your Answers</Text>
              </View>
              <View>
                <Text style={{ color: '#000' }}>:</Text>
              </View>
              <View style={{ paddingHorizontal: 5, flex: 1 }}>
                <Text style={{ color: '#000' }}>{matchData.userAnsText.replaceAll("???", ",").replaceAll("null", "Not Attempt")}</Text>
              </View>
            </View> */}
          </View>

        </View>
      </View>
    </>
  )
}