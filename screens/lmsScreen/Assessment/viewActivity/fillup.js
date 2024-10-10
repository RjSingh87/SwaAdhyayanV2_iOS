import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, TextInput, Image, CheckBox, ScrollView, TouchableOpacity, TouchableHighlight, Alert, SafeAreaView } from "react-native"
import RenderHtml from 'react-native-render-html';
import { SwaTheam } from "../../../../constant/ConstentValue";
var optionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
var number = [1, 2, 3, 4];
var option = ["Delhi", "Jaipur", "Rajesthan", "Haryana"];
export default function Fillup({ fillupData, index }) {

  const tagsStyles = {
    body: {
      color: SwaTheam.SwaBlack
    },
    p: {
      color: SwaTheam.SwaBlack
    }
  };

  const { width } = useWindowDimensions();
  function getFillupQuesFormateOne(FillupData) {
    let question = "";
    let options = [];
    for (let j = 0; j < 4; j++) {
      let quesPart = FillupData[`questionPart${j + 1}`]
      if (quesPart != "" && quesPart != null) {
        quesPart = quesPart.replace(/<MTECHO>/g, '`');
        let imgPart = quesPart.split('.')
        if (imgPart[1] !== undefined && (imgPart[1] == 'png' || imgPart[1] == 'PNG' || imgPart[1] == 'jpeg' || imgPart[1] == 'jpg' || imgPart[1] == 'gif' || imgPart[1] == 'web')) {
          let img = `&nbsp; &nbsp;<img style=" height:${FillupData.questionImageHight}px; max-width:100%; margin-top:10px; display: table-cell;
                    vertical-align: middle; " src='https://swaadhyayan.com/data/${FillupData.imagePath}${quesPart}'/> &nbsp;`
          question += img
        } else {
          question += quesPart;
        }
      }
      else {
        continue;
      }
    }

    for (let i = 0; i < 8; i++) {
      let optionsId = FillupData[`optionID${i + 1}`];
      if (optionsId != 0) {
        let targetBlank = FillupData[`optionText${i + 1}`]
        targetBlank = targetBlank.replace(/<MTECHO>/g, '`');

        let optionImage = FillupData[`optionImage${i + 1}`]
        let finalFillup = "";
        if (targetBlank != "") {
          finalFillup += targetBlank.replaceAll('#', `______________`)
        }
        if (optionImage != "") {
          let img = `&nbsp; &nbsp;<img style="height:${FillupData.optionImageHight}px; max-width:100%; margin-top:10px; display: table-cell;
                    vertical-align: middle; " src='http://swaadhyayan.com/data/${FillupData.imagePath}${optionImage}'/> &nbsp;`
          finalFillup += img
        }
        options.push(finalFillup)
      } else {
        continue;
      }

    }
    return { question: question, options: options }
  }

  var FillupData = getFillupQuesFormateOne(fillupData);

  return (
    <View >
      <SafeAreaView>
        <ScrollView>
          {/* Fillup Type-1 */}
          <View style={{ backgroundColor: '#fff', marginBottom: 6 }}>
            <View style={{ backgroundColor: '#efefef', padding: 8, borderRadius: 6, margin: 8 }}>

              {/* <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
                <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                  <Text>Chapter:{fillupData.chapterName}</Text>
                </View>
                <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                  <Text>Type:FILLUP</Text>
                </View>
                <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                  <Text>Marks:{fillupData.quesSelectedMark}</Text>
                </View>
              </View> */}

              <View style={{ padding: 3, margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: '#fff' }}>
                    <Text style={{ color: '#000', fontWeight: '700', textAlign: 'center' }}>Chapter: {fillupData.chapterName}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                    <Text style={{ color: '#000' }}>Type: FILLUP</Text>
                  </View>
                  <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                    <Text style={{ color: '#000', textAlign: 'right' }}>Marks: {fillupData.marksPerQuestion}</Text>
                  </View>
                </View>
              </View>


              <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
                <View style={{ }}>
                  <Text style={{ color: '#000' }}>Q: {index}</Text>
                </View>
                <View style={{flex: 1, paddingLeft: 10 }}>
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: FillupData.question }}
                    tagsStyles={tagsStyles}
                  />
                </View>
              </View>

              {FillupData.options.map((item, index) => {
                return (
                  <View style={{ flexDirection: 'row', padding: 5, margin: 4, paddingLeft: 45 }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                          <View style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                            {/* <Text style={{ color: '#000' }}>{item}</Text> */}
                            <RenderHtml
                              contentWidth={width}
                              source={{ html: item }}
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
                    <Text style={{ color: '#000' }}>{fillupData.answerText!=undefined ? fillupData.answerText.replaceAll("???", ",") : ""}</Text>
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
                    <Text style={{ color: '#000' }}>{fillupData.userAnsText!=undefined ? fillupData.userAnsText.replaceAll("???", ",").replaceAll("null", "Not Attempt") : ""}</Text>
                  </View>
                </View> */}
              </View>

            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  )
}