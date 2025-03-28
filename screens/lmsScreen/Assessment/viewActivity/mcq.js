import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions, StyleSheet, TextInput, Image, CheckBox, ScrollView, TouchableOpacity, TouchableHighlight, Alert, SafeAreaView } from "react-native"
import RenderHtml from 'react-native-render-html';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { SWATheam } from "../../../../constant/ConstentValue";


var optionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];


export default function Mcq({ mcqData, index }) {
  console.log(mcqData, 'mcqData')
  // const [reload, setReload] = useState(false)
  // useEffect(() => {
  //   mcqData = mcqData
  // }, [reload])

  const tagsStyles = {
    body: {
      color: SWATheam.SwaBlack
    },
    p: {
      color: SWATheam.SwaBlack
    }
  };

  const { width } = useWindowDimensions();
  var McqData = getMcqQuesFormateOne(mcqData)
  function getMcqQuesFormateOne(mcqData) {
    let question = "";
    let options = [];
    let level = "";
    let questionID = mcqData['questionID'];

    if (mcqData['eadID'] == 1) {
      level = "Engage";
    } else if (mcqData['eadID'] == 2) {
      level = "Explore";
    } else {
      level = "Extend";
    }
    let chapter = mcqData['chapterName'];

    for (let j = 0; j < 4; j++) {
      let quesPart = mcqData[`questionPart${j + 1}`];
      if (quesPart != undefined) {
        quesPart = quesPart.replace(/<MTECHO>/g, '`');
        quesPart = quesPart.replace(/<\/MTECHO>/g, '`');

        if (quesPart != "") {
          let imgPart = quesPart.split('.')
          if (imgPart[1] !== undefined && (imgPart[1] == 'png' || imgPart[1] == 'PNG' || imgPart[1] == 'jpeg' || imgPart[1] == 'jpg' || imgPart[1] == 'gif' || imgPart[1] == 'web')) {

            let imgPath = 'https://swaadhyayan.com/data/' + mcqData['imagePath'] + quesPart
            question += `<div style='text-align:center'><img style='height:${mcqData['questionImageHight']}px; ' src=${imgPath} /></div>`
          } else {
            let ques = quesPart.replace(/#/g, "______________")
            question += ques;
          }
        }
        else {
          break;
        }
      }
    }

    for (let i = 0; i < 8; i++) {
      // this is for option part
      let optText = mcqData[`optionText${i + 1}`];
      let optionsId = mcqData[`optionID${i + 1}`];
      let optImg = mcqData[`optionImage${i + 1}`];

      if (optionsId != 0) {
        if (optImg != '' && optImg != null) {
          let img = `&nbsp; &nbsp;<img style="height:${mcqData['optionImageHight']}px; max-width:100%; margin-top:10px; display: table-cell;
                  vertical-align: middle; " src='https://swaadhyayan.com/data/${mcqData['imagePath']}${optImg}'/> &nbsp;`
          options.push(img)
        }
        else {
          let finalMcq = optText.replace(/#/g, '___________')
          finalMcq = finalMcq.replace(/<MTECHO>/g, '`');
          finalMcq = finalMcq.replace(/<\/MTECHO>/g, '`');
          options.push(finalMcq)
        }

      } else {
        break;
      }
    }
    return { question: question, options: options, level: level, chapter: chapter, questionID: questionID }
  }

  return (
    <>
      <SafeAreaView>

        <View style={{ backgroundColor: SWATheam.SwaWhite, marginBottom: 6 }}>
          <View style={{ backgroundColor: '#efefef', borderRadius: 6, margin: 1 }}>

            {/* <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Chapter:{mcqData.chapterName}</Text>
              </View>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Type:MCQ</Text>
              </View>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Marks:{mcqData.quesSelectedMark}</Text>
              </View>
            </View> */}

            <View style={{ padding: 3, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: '#fff' }}>
                  <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', textAlign: 'center' }}>Chapter: {mcqData.chapterName}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: SWATheam.SwaBlack }}>Type: MCQ</Text>
                </View>
                <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: SWATheam.SwaBlack, textAlign: 'right' }}>Marks: {mcqData.marksPerQuestion}</Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
              <View style={{ width: '12%' }}>
                <Text style={{ color: '#000' }}>Q: {index}</Text>
              </View>
              <View style={{ width: '88%' }}>
                {/* <Text style={{ color: '000', fontWeight: 'bold' }}>{McqData.question}</Text> */}
                <RenderHtml
                  contentWidth={width}
                  source={{ html: McqData.question }}
                  tagsStyles={tagsStyles}
                />
              </View>
            </View>

            {McqData.options.map((item, key) => {
              return (
                <View style={{ flexDirection: 'row', padding: 5, margin: 4 }} key={key}>
                  <View style={{ width: '12%' }}>
                  </View>
                  <View style={{ width: '88%' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: '5%', margin: 2 }}>
                        <Text style={{ color: '#000' }}>{optionArray[key]}.</Text>
                      </View>
                      <View style={{ width: '95%' }}>
                        <View style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                          <Text style={{ color: SWATheam.SwaBlack }}>
                            <RenderHtml
                              contentWidth={width}
                              source={{ html: item }}
                              tagsStyles={tagsStyles}
                            />
                          </Text>
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
                  <Text style={{ color: '#000' }}>{mcqData.answerText}</Text>
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
                  <Text style={{ color: '#000' }}>{mcqData.userAnsText!=undefined  ? mcqData.userAnsText.replaceAll('null', 'Not Attempt') : ""}</Text>
                </View>
              </View> */}
            </View>

          </View>
        </View>
      </SafeAreaView >
    </>
  )
}