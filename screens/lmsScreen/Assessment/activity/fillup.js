import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import RenderHtml from 'react-native-render-html';
import { SWATheam } from "../../../../constant/ConstentValue";
var optionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
var number = [1, 2, 3, 4];
var option = ["Delhi", "Jaipur", "Rajesthan", "Haryana"];
export default function Fillup({ fillupData, editMarks, index, selectedQuesIDs, selectedQuesIDsArray }) {
  const [reload, setReload] = useState(false)
  useEffect(() => {
    fillupData = fillupData
  }, [reload])

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
          let img = `&nbsp; &nbsp;<img style=" height:${FillupData.questionImageHight}px; max-width:250px; margin-top:10px; display: table-cell;
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
      let targetBlank = FillupData[`optionText${i + 1}`]
      if (optionsId != 0 && targetBlank != null) {

        targetBlank = targetBlank.replace(/<MTECHO>/g, '`');

        let optionImage = FillupData[`optionImage${i + 1}`]
        let finalFillup = "";
        if (targetBlank != "") {
          finalFillup += targetBlank.replaceAll('#', `______________`)
        }
        if (optionImage != "") {
          let img = `&nbsp; &nbsp;<img style="height:${FillupData.optionImageHight}px; max-width:230px; margin-top:10px; display: table-cell;
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
    <View >
      <SafeAreaView>
        <ScrollView>
          {/* Fillup Type-1 */}
          <View style={{ backgroundColor: SWATheam.SwaWhite }}>
            <View style={{ backgroundColor: '#efefef', padding: 8, borderRadius: 6, margin: 8 }}>

              <View style={{ padding: 3, margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: SWATheam.SwaBlack }}>
                    <Text style={{ color: '#000', fontWeight: '700', textAlign: 'center' }}>Chapter:{fillupData.chapterName}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                    <Text style={{ color: '#000' }}>Type:FILLUP</Text>
                  </View>
                  <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                    <Text style={{ color: '#000', textAlign: 'right' }}>Marks:{fillupData.marksPerQuestion}</Text>
                  </View>
                </View>
              </View>


              <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
                <View style={{ width: 55 }}>
                  <Text style={{ color: SWATheam.SwaBlack }}>Q:{index}</Text>
                </View>
                <View style={{ width: '88%' }}>
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: FillupData.question }}
                    tagsStyles={tagsStyles}
                  />
                  {FillupData.options.map((item, index) => {
                    return (
                      <View key={index}>
                        <View style={{ flex: 1, marginVertical: 4 }}>
                          <TouchableOpacity style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                            {/* <Text style={{ color: '#000' }}>{item}</Text> */}
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
                {selectedQuesIDsArray.includes(fillupData.questionID + "|" + fillupData.marksPerQuestion) == true ?
                  <>
                    <TouchableOpacity style={{ width: '20%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                      <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }} disabled>Edit</Text>
                    </TouchableOpacity>
                    {/* <View style={{ width: '50%', padding: 5, margin: 4 }}>
                    </View> */}
                    <TouchableOpacity onPress={() => { selectedQuesIDs(fillupData.questionID, fillupData.marksPerQuestion); setReload(false) }} style={{ width: '25%', padding: 5, margin: 4, backgroundColor: '#cd5c5c', borderRadius: 6 }}>
                      <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>Deselect</Text>
                    </TouchableOpacity>
                  </>
                  :
                  <>
                    <TouchableOpacity onPress={() => { editMarks(fillupData.questionID) }} style={{ width: '20%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                      <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }} >Edit</Text>
                    </TouchableOpacity>
                    {/* <View style={{ width: '50%', padding: 5, margin: 4 }}>
                    </View> */}
                    <TouchableOpacity onPress={() => { selectedQuesIDs(fillupData.questionID, fillupData.marksPerQuestion); setReload(true) }} style={{ width: '25%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                      <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>Select</Text>
                    </TouchableOpacity>
                  </>

                }
              </View>

            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  )
}