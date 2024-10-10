import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions, StyleSheet, TextInput, Image, CheckBox, ScrollView, TouchableOpacity, TouchableHighlight, Alert, SafeAreaView } from "react-native"
import RenderHtml from 'react-native-render-html';
import { SWATheam } from "../../../../constant/ConstentValue";
var optionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
var number = [1, 2, 3, 4];
var option = ["Delhi", "Jaipur", "Rajesthan", "Haryana"];
export default function Tnf({ tnfData, editMarks, index, selectedQuesIDs, selectedQuesIDsArray }) {
  const [reload, setReload] = useState(false)
  useEffect(() => {
    tnfData = tnfData
  }, [reload])

  const { width } = useWindowDimensions();
  var TnfData = getTnfQuesFormateOne(tnfData);
  function getTnfQuesFormateOne(tnfData) {

    let question = "";
    let options = [];
    let tnfBtn = [];

    for (let j = 0; j < 4; j++) {
      let quesPart = tnfData[`questionPart${j + 1}`]

      if (quesPart != "" && quesPart != null) {
        quesPart = quesPart.replace(/<MTECHO>/g, '`');
        quesPart = quesPart.replace(/<\/MTECHO>/g, '`');
        let ext = quesPart.split(".")
        if (ext[1] !== undefined && (ext[1] == 'png' || ext[1] == 'PNG' || ext[1] == 'jpeg' || ext[1] == 'jpg' || ext[1] == 'JPG' || ext[1] == 'gif' || ext[1] == 'web')) {
          let img = `&nbsp; &nbsp;<img style="height:${tnfData.questionImageHight}px; max-width:250px; margin-top:10px; display: table-cell;
                        vertical-align: middle; " src='https://swaadhyayan.com/data/${tnfData.imagePath}${quesPart}'/> &nbsp;`
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
    for (let i = 0; i < 8; i++) {
      let optionsId = tnfData[`optionID${i + 1}`];
      let allData = '';
      if (optionsId != 0) {
        let imgData = tnfData[`optionImage${i + 1}`]
        let opt = tnfData[`optionText${i + 1}`]
        opt = opt != null ? opt.replace(/<MTECHO>/g, '`') : "";

        if (imgData != null && imgData != '') {
          let ext = imgData.split(".")
          if (ext[1] !== undefined && (ext[1] == 'png' || ext[1] == 'PNG' || ext[1] == 'jpeg' || ext[1] == 'jpg' || ext[1] == 'JPG' || ext[1] == 'gif' || ext[1] == 'web')) {
            let img = `&nbsp; &nbsp;<img style="height:${tnfData.questionImageHight}px; max-width:100%; margin-top:10px; display: table-cell;
                            vertical-align: middle; " src='https://swaadhyayan.com/data/${tnfData.imagePath}${imgData}'/> &nbsp;`
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
      let targetText = tnfData[`targetText${k + 1}`];
      targetText = targetText != null ? targetText.replace(/<MTECHO>/g, '`') : "";

      if (targetText != '') {
        let ext = targetText.split(".")
        if (ext[1] !== undefined && (ext[1] == 'png' || ext[1] == 'jpeg' || ext[1] == 'jpg' || ext[1] == 'JPG' || ext[1] == 'gif' || ext[1] == 'web')) {
          let img = `&nbsp; &nbsp;<img style="height:${tnfData.questionImageHight}px; max-width:230px; margin-top:10px; display: table-cell;
                        vertical-align: middle; " src='https://swaadhyayan.com/data/${tnfData.imagePath}${targetText}'/>`
          tnfBtn.push(img)
        }
        else {
          tnfBtn.push(targetText)
        }

      } else {
        continue
      }
    }

    return { question: question, options: options, tnfBtn: tnfBtn }
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
      <View style={{ backgroundColor: SWATheam.SwaWhite }}>
        <View style={{ backgroundColor: '#efefef', padding: 8, borderRadius: 6, margin: 8 }}>

          {/* <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
              <Text>Chapter:{tnfData.chapterName}</Text>
            </View>
            <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
              <Text>Type:TNF</Text>
            </View>
            <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
              <Text>Marks:{tnfData.marksPerQuestion}</Text>
            </View>
          </View> */}

          <View style={{ padding: 3, margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: SWATheam.SwaWhite }}>
                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', textAlign: 'center' }}>Chapter:{tnfData.chapterName}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: SWATheam.SwaBlack }}>Type:TNF</Text>
              </View>
              <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: SWATheam.SwaBlack, textAlign: 'right' }}>Marks:{tnfData.marksPerQuestion}</Text>
              </View>
            </View>
          </View>


          <View style={{ flexDirection: 'row', padding: 5, }}>
            <View style={{ width: 55, }}>
              <Text style={{ color: SWATheam.SwaBlack }}>Q:{index}</Text>
            </View>
            <View style={{ flex: 1, }}>
              {/* <Text style={{ color: '000', fontWeight: 'bold' }}>{tnfData.question}</Text> */}
              <RenderHtml
                contentWidth={width}
                source={{ html: TnfData.question }}
                tagsStyles={tagsStyles}
              />
              {TnfData.options.map((item, key) => {
                let imgDimensions = null
                if (item.includes("img")) {
                  imgDimensions = item.replace('100%', "180px")
                } else {
                  imgDimensions = item
                }
                return (
                  <View style={{ flexDirection: 'row', marginVertical: 4 }} key={key}>
                    <View style={{ width: 15, margin: 2 }}>
                      <Text style={{ color: SWATheam.SwaBlack }}>{optionArray[key]}.</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <View style={{ flex: 1 }}>
                        <TouchableOpacity style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                          {/* <Text style={{ color: SWATheam.SwaBlack }}>{imgDimensions}</Text> */}
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: imgDimensions }}
                            tagsStyles={tagsStyles}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: TnfData.tnfBtn[0] == 'Correct' && TnfData.tnfBtn[1] == 'Incorrect' ? 125 : 100, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ width: 'auto' }}>
                            <TouchableOpacity style={{ backgroundColor: '#92cbb2', margin: 2, padding: 4, borderRadius: 6 }} >
                              <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{TnfData.tnfBtn[0]}</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={{ width: 'auto' }}>
                            <TouchableOpacity style={{ backgroundColor: '#e4949a', margin: 2, padding: 4, borderRadius: 6 }} >
                              <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{TnfData.tnfBtn[1]}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                      </View>
                    </View>
                    {/* <View style={{ width: '88%' }}>
                  <View style={{ flexDirection: 'row'}}>
                    <View style={{ width: '95%' }}>

                    </View>
                  </View>
                </View> */}
                  </View>
                )
              })}
            </View>
          </View>


          <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'space-between', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            {selectedQuesIDsArray.includes(tnfData.questionID + "|" + tnfData.marksPerQuestion) == true ?
              <>
                <TouchableOpacity style={{ width: '20%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }} disabled>Edit</Text>
                </TouchableOpacity>
                {/* <View style={{ width: '50%', padding: 5, margin: 4 }}>
                </View> */}
                <TouchableOpacity onPress={() => { selectedQuesIDs(tnfData.questionID, tnfData.marksPerQuestion); setReload(false) }} style={{ width: '25%', padding: 5, margin: 4, backgroundColor: '#cd5c5c', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>Deselect</Text>
                </TouchableOpacity>
              </>
              :
              <>
                <TouchableOpacity onPress={() => { editMarks(tnfData.questionID) }} style={{ width: '20%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }} >Edit</Text>
                </TouchableOpacity>
                {/* <View style={{ width: '50%', padding: 5, margin: 4 }}>
                </View> */}
                <TouchableOpacity onPress={() => { selectedQuesIDs(tnfData.questionID, tnfData.marksPerQuestion); setReload(true) }} style={{ width: '25%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
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