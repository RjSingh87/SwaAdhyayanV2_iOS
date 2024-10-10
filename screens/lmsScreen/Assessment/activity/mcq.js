import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions, StyleSheet, TextInput, Image, CheckBox, ScrollView, TouchableOpacity, TouchableHighlight, Alert, SafeAreaView, FlatList } from "react-native"
import RenderHtml from 'react-native-render-html';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { SWATheam } from "../../../../constant/ConstentValue";
var optionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];


export default function Mcq({ mcqData, index, selectedQuesIDs, selectedQuesIDsArray, editMarks }) {
  const [reload, setReload] = useState(false)
  useEffect(() => {
    mcqData = mcqData
  }, [reload])
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
            question += `<div style='text-align:center'><img style='height:${mcqData['questionImageHight']}px; max-width:250px; ' src=${imgPath} /></div>`
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
          let img = `&nbsp; &nbsp;<img style="height:${mcqData['optionImageHight']}px; max-width:230px; margin-top:10px; display: table-cell;
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


  return (
    <>
      <SafeAreaView>

        <View style={{ backgroundColor: SWATheam.SwaWhite }}>
          <View style={{ backgroundColor: '#efefef', padding: 8, borderRadius: 6, margin: 8 }}>
            <View style={{ padding: 3, margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: SWATheam.SwaWhite }}>
                  <Text style={{ color: '#000', fontWeight: '700', textAlign: 'center' }}>Chapter:{mcqData.chapterName}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#000' }}>Type:MCQ</Text>
                </View>
                <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#000', textAlign: 'right' }}>Marks:{mcqData.marksPerQuestion}</Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', padding: 5, }}>
              <View style={{ width: 55 }}>
                <Text style={{ color: SWATheam.SwaBlack }}>Q:{index}</Text>
              </View>
              <View style={{ flex: 1 }}>
                {/* <Text style={{ color: '000', fontWeight: 'bold' }}>{McqData.question}</Text> */}
                <RenderHtml
                  contentWidth={width}
                  source={{ html: McqData.question }}
                  tagsStyles={tagsStyles}
                />
                {McqData.options.map((item, key) => {
                  return (
                    <View style={{ flexDirection: 'row', marginVertical: 4 }} key={key}>
                      <View style={{ width: 15, margin: 2 }}>
                        <Text style={{ color: SWATheam.SwaBlack }}>{optionArray[key]}.</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <TouchableOpacity style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: item }}
                            tagsStyles={tagsStyles}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>


            <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'space-between', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>

              {selectedQuesIDsArray.includes(mcqData.questionID + "|" + mcqData.marksPerQuestion) == true ?
                <>
                  <TouchableOpacity style={{ width: '20%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                    <Text style={{ textAlign: 'center' }} disabled>Edit</Text>
                  </TouchableOpacity>
                  {/* <View style={{ width: '50%', padding: 5, margin: 4 }}>
                  </View> */}
                  <TouchableOpacity onPress={() => { selectedQuesIDs(mcqData.questionID, mcqData.marksPerQuestion); setReload(false) }} style={{ width: '25%', padding: 5, margin: 4, backgroundColor: '#cd5c5c', borderRadius: 6 }}>
                    <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>Deselect</Text>
                  </TouchableOpacity>
                </>
                :
                <>
                  <TouchableOpacity onPress={() => { editMarks(mcqData.questionID) }} style={{ width: '20%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                    <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }} >Edit</Text>
                  </TouchableOpacity>
                  {/* <View style={{ width: '50%', padding: 5, margin: 4 }}>
                  </View> */}
                  <TouchableOpacity onPress={() => { selectedQuesIDs(mcqData.questionID, mcqData.marksPerQuestion); setReload(true) }} style={{ width: '25%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                    <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>Select</Text>
                  </TouchableOpacity>
                </>

              }
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}