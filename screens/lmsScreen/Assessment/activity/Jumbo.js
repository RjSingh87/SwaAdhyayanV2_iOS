import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, TextInput, Image, CheckBox, ScrollView, TouchableOpacity, TouchableHighlight, Alert, SafeAreaView } from "react-native"
import RenderHtml from 'react-native-render-html';
import { SWATheam } from "../../../../constant/ConstentValue";
var optionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
var number = [1, 2, 3, 4];
var option = ["Delhi", "Jaipur", "Rajesthan", "Haryana"];
export default function Jumbo({ jumboData, editMarks, index, selectedQuesIDs, selectedQuesIDsArray }) {
  const [reload, setReload] = useState(false)

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

  useEffect(() => {
    jumboData = jumboData
  }, [reload])
  const { width } = useWindowDimensions();

  //Word Jumble in a sentence Formating of Type
  function getJumbleFormateOne(JumbleData) {
    let question = "";
    let options = [];
    let target = [];
    let allData = '';
    for (let j = 0; j < 4; j++) {
      let quesPart = JumbleData[`questionPart${j + 1}`]
      if (quesPart != undefined) {
        quesPart = quesPart.replace(/<MTECHO>/g, '`');
        quesPart = quesPart.replace(/<\/MTECHO>/g, '`');

        if (quesPart != "") {
          question = quesPart
        }
        else {
          break;
        }
      }
    }
    let allJumbo = '';
    let allTarget = ''
    for (let i = 0; i < 8; i++) {
      let targetBlank = JumbleData[`optionText${i + 1}`]
      let imgData = JumbleData[`optionImage${i + 1}`];
      let ext = imgData.split(".");
      targetBlank = targetBlank.replace(/<MTECHO>/g, '`');
      targetBlank = targetBlank.replace(/<\/MTECHO>/g, '`');

      let questOptionData = "";
      if (targetBlank == "" && ext[1] != undefined) {
        if (ext[1] == "png" || ext[1] == "jpg") {
          questOptionData = `&nbsp; &nbsp;<img style="height:${JumbleData.questionImageHight}px; max-width:100%; margin-top:10px; display: table-cell;vertical-align: middle;" src='https://swaadhyayan.com/data/${JumbleData.imagePath}${imgData}'/> &nbsp;`;

          options.push(questOptionData)
          let jumbleText = JumbleData[`targetText${i + 1}`]
          jumbleText = jumbleText.replace(/<MTECHO>/g, '`');
          jumbleText = jumbleText.replace(/<\/MTECHO>/g, '`');

          if (jumbleText != '') {
            let jumbo1 = jumbleText.replace(/,/g, " ")
            let JumboPart1 = jumbo1.split(" ")
            let Jpart1 = "";
            for (let k = 0; k < JumboPart1.length; k++) {
              if (JumboPart1[k] != '') {
                Jpart1 += `<span  class=" col-auto bg-primary rounded px-2 py-1 text-center mx-1 mb-1">${JumboPart1[k]}</span>`
              }

            }
            allTarget = Jpart1
            target.push(allTarget)
          }
        }
      } else {
        questOptionData += targetBlank;
      }

      let opt = targetBlank.split(",")
      let Jpart = '';
      let Jpart1 = '';

      if ((opt[1] == undefined && opt[0].length > 1) || (opt[0] != '' && targetBlank != '#' && opt[0].length > 1)) {

        let jumbleText = JumbleData[`targetText${i + 1}`]
        jumbleText = jumbleText.replace(/<MTECHO>/g, '`');
        jumbleText = jumbleText.replace(/<\/MTECHO>/g, '`');

        if (jumbleText != '') {
          let jumbo1 = jumbleText.replace(/,/g, " ")
          let JumboPart1 = jumbo1.split(" ")
          for (let k = 0; k < JumboPart1.length; k++) {
            if (JumboPart1[k] != '') {
              Jpart1 += `<span class=" col-auto rounded px-2 py-1 text-center mx-1 mb-1">${JumboPart1[k]}    </span>`
            }

          }
          allTarget = Jpart1
          target.push(allTarget)
        }
        options.push(questOptionData)

      }
      else if (targetBlank != '' && targetBlank != '#' && opt[1] != undefined) {
        // let jumbo= targetBlank.replace(/,/g," ")
        let JumboPart = targetBlank.split(",")
        for (let k = 0; k < JumboPart.length; k++) {
          if (JumboPart[k] != '') {
            Jpart += `<span class=" col-auto bg-primary rounded px-2 py-1 p-2 text-center mx-1 mb-1">${JumboPart[k]}    </span>`
          }
        }
        allJumbo = Jpart
        options.push(allJumbo)
      }
      else if (targetBlank == "#" && opt[1] == undefined) {

        let targetText = targetBlank.replace(/#/g, "_____________________ =")
        let targetTxt = JumbleData[`targetText${i + 1}`]
        targetTxt = targetTxt.replace(/<MTECHO>/g, '`');
        targetTxt = targetTxt.replace(/<\/MTECHO>/g, '`');

        let Jpart2 = '';
        let allTgt = '';
        if (targetTxt != '') {

          let jumbo2 = targetTxt.replace(/,/g, " ")
          console.log(jumbo2)
          //let JumboPart2=jumbo2.split(" ")
          let JumboPart2 = jumbo2.split(" ")
          for (let k = 0; k < JumboPart2.length; k++) {
            if (JumboPart2[k] != '') {
              Jpart2 += `<span class=" col-auto greyDragBG200 rounded px-2 py-1 text-center m-1">${JumboPart2[k]}    </span>`
            }
          }
          allTgt = Jpart2
          target.push(allTgt)
        }
        options.push(allTgt)
        //options.push(targetText)
      }
      else {
        continue;
      }

    }
    return { question: question, options: options, target: target }

  }

  var jumbleData = getJumbleFormateOne(jumboData)

  return (
    <>
      <View style={{ backgroundColor: SWATheam.SwaWhite }}>
        <View style={{ backgroundColor: '#efefef', padding: 8, borderRadius: 6, margin: 8 }}>

          <View style={{ padding: 3, margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: SWATheam.SwaWhite }}>
                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', textAlign: 'center' }}>Chapter:{jumboData.chapterName}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: SWATheam.SwaBlack }}>Type:JUMBO</Text>
              </View>
              <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: SWATheam.SwaBlack, textAlign: 'right' }}>Marks:{jumboData.marksPerQuestion}</Text>
              </View>
            </View>
          </View>


          <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
            <View style={{ width: '12%' }}>
              <Text style={{ color: SWATheam.SwaBlack }}>Q:{index}</Text>
            </View>
            <View style={{ width: '88%' }}>
              {/* <Text style={{ color: '000', fontWeight: 'bold' }}>This is Question Part Can You Know That ?</Text> */}
              <RenderHtml
                contentWidth={width}
                source={{ html: jumbleData.question }}
                tagsStyles={tagsStyles}
              />
            </View>
          </View>

          {jumbleData.options.map((item, key) => {

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
                        <View style={{ width: '60%', padding: 5 }}>
                          {/* <Text>helo</Text> */}
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: item }}
                            tagsStyles={tagsStyles}
                          />
                        </View>
                        <View style={{ width: '40%', padding: 5 }}>
                          {/* <Text>helo</Text> */}
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: jumbleData.target[key] }}
                            tagsStyles={tagsStyles}
                          />
                        </View>
                      </View>
                      {/* <TouchableOpacity style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                        <Text style={{ color: SWATheam.SwaBlack }}>{option[key]}</Text>
                      </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
              </View>
            )
          })}

          <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'space-between', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            {selectedQuesIDsArray.includes(jumboData.questionID + "|" + jumboData.marksPerQuestion) == true ?
              <>
                <TouchableOpacity style={{ width: '20%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }} disabled>Edit</Text>
                </TouchableOpacity>
                {/* <View style={{ width: '50%', padding: 5, margin: 4 }}>
                </View> */}
                <TouchableOpacity onPress={() => { selectedQuesIDs(jumboData.questionID, jumboData.marksPerQuestion); setReload(false) }} style={{ width: '25%', padding: 5, margin: 4, backgroundColor: '#cd5c5c', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>Deselect</Text>
                </TouchableOpacity>
              </>
              :
              <>
                <TouchableOpacity onPress={() => { editMarks(jumboData.questionID) }} style={{ width: '20%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }} >Edit</Text>
                </TouchableOpacity>
                {/* <View style={{ width: '50%', padding: 5, margin: 4 }}>
                </View> */}
                <TouchableOpacity onPress={() => { selectedQuesIDs(jumboData.questionID, jumboData.marksPerQuestion); setReload(true) }} style={{ width: '25%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
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