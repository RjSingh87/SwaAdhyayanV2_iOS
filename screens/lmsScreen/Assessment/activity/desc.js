import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions, TouchableOpacity, TouchableHighlight, Alert, SafeAreaView } from "react-native"
import { SWATheam } from "../../../../constant/ConstentValue";
import RenderHtml from 'react-native-render-html';
export default function Desc({ descData, editMarks, index, selectedQuesIDs, selectedQuesIDsArray }) {

  const [reload, setReload] = useState(false)
  const { width } = useWindowDimensions();

  useEffect(() => {
    descData = descData
  }, [reload])

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

          <View style={{ padding: 3, margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: SWATheam.SwaWhite }}>
                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', textAlign: 'center' }}>Chapter:{descData.chapterName}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: SWATheam.SwaBlack }}>Type:DESC</Text>
              </View>
              <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: SWATheam.SwaBlack, textAlign: 'right' }}>Marks:{descData.marksPerQuestion}</Text>
              </View>
            </View>
          </View>


          <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
            <View style={{ width: 50, }}>
              <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700' }}>Q:{index}</Text>
            </View>
            <View style={{ flex: 1, }}>
              {descData.questionPart1 != null ?
                <View>
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: descData.questionPart1 }}
                    tagsStyles={tagsStyles}
                  />
                </View> : null
              }
              {descData.questionPart2 != null ?
                <View>
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: descData.questionPart2 }}
                    tagsStyles={tagsStyles}
                  />
                </View> : null
              }
              {descData.questionPart3 != null ?
                <View>
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: descData.questionPart3 }}
                    tagsStyles={tagsStyles}
                  />
                </View> : null
              }
              {descData.questionPart4 != null ?
                <View>
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: descData.questionPart4 }}
                    tagsStyles={tagsStyles}
                  />

                </View> : null
              }

            </View>
          </View>

          <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'space-between', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            {selectedQuesIDsArray.includes(descData.questionID + "|" + descData.marksPerQuestion) == true ?
              <>
                <TouchableOpacity style={{ width: '20%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center' }} disabled>Edit</Text>
                </TouchableOpacity>
                {/* <View style={{ width: '50%', padding: 5, margin: 4 }}>
                </View> */}
                <TouchableOpacity onPress={() => { selectedQuesIDs(descData.questionID, descData.marksPerQuestion); setReload(false) }} style={{ width: '25%', padding: 5, margin: 4, backgroundColor: '#cd5c5c', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite }}>Deselect</Text>
                </TouchableOpacity>
              </>
              :
              <>
                <TouchableOpacity onPress={() => { editMarks(descData.questionID) }} style={{ width: '20%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }} >Edit</Text>
                </TouchableOpacity>
                {/* <View style={{ width: '50%', padding: 5, margin: 4 }}>
                </View> */}
                <TouchableOpacity onPress={() => { selectedQuesIDs(descData.questionID, descData.marksPerQuestion); setReload(true) }} style={{ width: '25%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
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