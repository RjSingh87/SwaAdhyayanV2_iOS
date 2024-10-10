import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, TextInput, Image, CheckBox, ScrollView, TouchableOpacity, TouchableHighlight, Alert, SafeAreaView } from "react-native"
import RenderHtml from 'react-native-render-html';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { SwaTheam } from "../../../../constant/ConstentValue";
var optionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
var number = [1, 2, 3, 4];
var option = ["Delhi", "Jaipur", "Rajesthan", "Haryana"];
export default function Dd({ ddData, index }) {

  const tagsStyles = {
    body: {
      color: SwaTheam.SwaBlack
    },
    p: {
      color: SwaTheam.SwaBlack
    }
  };


  const { width } = useWindowDimensions();
  function getDropDown1QuesFormate(DdData) {
    let question = "";
    let options = [];
    let questionHeading = DdData['questionHeading'];
    let optionType = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    for (let j = 0; j < 4; j++) {

      let quesPart = DdData[`questionPart${j + 1}`]

      if (quesPart != "" && quesPart != undefined) {
        quesPart = quesPart.replace(/<MTECHO>/g, '`');
        quesPart = quesPart.replace(/<\/MTECHO>/g, '`');
        let imgPart = quesPart.split('.')
        if (imgPart[1] !== undefined && (imgPart[1] == 'png' || imgPart[1] == 'jpeg' || imgPart[1] == 'jpg' || imgPart[1] == 'JPG' || imgPart[1] == 'gif' || imgPart[1] == 'web' || imgPart[1] == 'PNG')) {
          let img = `&nbsp; &nbsp;<img style="height:${DdData.questionImageHight}px;max-width:100%; margin-top:10px; display: table-cell;vertical-align: middle;" src='https://swaadhyayan.com/data/${DdData.imagePath}${quesPart}'/> &nbsp;`
          question += img
        } else {
          let ques = quesPart.replace(/#/g, "______________")
          question += ques;
        }
      }
      else {
        continue;
      }
    }

    for (let i = 0; i < 8; i++) {
      let optText = DdData[`optionText${i + 1}`];
      optText = optText.replace(/<MTECHO>/g, '`');
      optText = optText.replace(/<\/MTECHO>/g, '`');
      optText = optText.replace(/#/g, `____`);
      let optImg = DdData[`optionImage${i + 1}`];
      let TargetId = DdData[`targetID${i + 1}`]
      let finalData = '';
      if (optText != '' || optImg != '') {

        let ext = optImg.split(".")
        if (ext[1] !== undefined && (ext[1] == 'png' || ext[1] == 'PNG' || ext[1] == 'jpeg' || ext[1] == 'jpg' || ext[1] == 'JPG' || ext[1] == 'gif' || ext[1] == 'web')) {
          let img = `_________&nbsp; &nbsp;<img style="height:${DdData.questionImageHight}px; max-width:100%; margin-top:10px; display: table-cell;
                            vertical-align: middle; " src='https://swaadhyayan.com/data/${DdData.imagePath}${optImg}'/> &nbsp;`
          // options.push(img)
          finalData += img;
        } else {
          finalData += optText;
        }
        options.push(finalData);
      } else {
        continue;
      }
    }
    return { question: question, options: options }
  }


  var DdData = getDropDown1QuesFormate(ddData);
  return (
    <>
      <View style={{ backgroundColor: '#fff', marginBottom: 6 }}>
        <View style={{ backgroundColor: '#efefef', borderRadius: 6 }}>

          {/* <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
              <Text>Chapter:{ddData.chapterName}</Text>
            </View>
            <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
              <Text>Type:DD</Text>
            </View>
            <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
              <Text>Marks:{ddData.quesSelectedMark}</Text>
            </View>
          </View> */}

          <View style={{ padding: 3, margin: 1, backgroundColor: '#93ced0', borderRadius: 6 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: '#fff' }}>
                <Text style={{ color: '#000', fontWeight: '700', textAlign: 'center' }}>Chapter: {ddData.chapterName}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: '#000' }}>Type: DD</Text>
              </View>
              <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: '#000', textAlign: 'right' }}>Marks: {ddData.marksPerQuestion}</Text>
              </View>
            </View>
          </View>


          <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
            <View style={{ width: '12%' }}>
              <Text style={{ color: '#000' }}>Q:{index}</Text>
            </View>
            <View style={{ width: '88%' }}>
              {/* <Text style={{ color: '000', fontWeight: 'bold' }}>This is Question Part Can You Know That ?</Text> */}
              <RenderHtml
                contentWidth={width}
                source={{ html: DdData.question }}
                tagsStyles={tagsStyles}
              />
            </View>
          </View>

          {DdData.options.map((item, key) => {
            return (
              <View style={{ flexDirection: 'row', padding: 5, margin: 4 }} key={key}>
                <View style={{ width: '12%' }}>
                </View>
                <View style={{ width: '88%' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '5%', margin: 2 }}>
                      <Text>{optionArray[key]}.</Text>
                    </View>
                    <View style={{ width: '95%' }}>
                      <View style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
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
                <Text style={{ color: '#000' }}>{ddData.answerText}</Text>
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
                <Text style={{ color: '#000' }}>{ddData.userAnsText.replaceAll('null', 'Not Attempt')}</Text>
              </View>
            </View> */}
          </View>

        </View>
      </View>
    </>
  )
}