import { View, Text, useWindowDimensions, } from "react-native"
import RenderHtml from 'react-native-render-html';
import { SWATheam } from "../../../../constant/ConstentValue";
var optionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
export default function Tnf({ tnfData, index }) {

  const tagsStyles = {
    body: {
      color: SWATheam.SwaBlack
    },
    p: {
      color: SWATheam.SwaBlack
    },
    u: { textDecorationLine: 'underline', textDecorationStyle: 'solid' },
    img: {
      maxWidth: 130,
      height: 'auto',
      resizeMode: 'contain',
    },

  };

  const { width } = useWindowDimensions();
  var TnfData = getTnfQuesFormateOne(tnfData);
  function getTnfQuesFormateOne(tnfData) {

    let question = "";
    let options = [];
    let tnfBtn = [];

    for (let j = 0; j < 4; j++) {
      let quesPart = tnfData[`questionPart${j + 1}`]
      quesPart = quesPart.replace(/<MTECHO>/g, '`');
      quesPart = quesPart.replace(/<\/MTECHO>/g, '`');

      if (quesPart != "") {
        let ext = quesPart.split(".")
        if (ext[1] !== undefined && (ext[1] == 'png' || ext[1] == 'PNG' || ext[1] == 'jpeg' || ext[1] == 'jpg' || ext[1] == 'JPG' || ext[1] == 'gif' || ext[1] == 'web')) {
          let img = `&nbsp; &nbsp;<img style="height:${tnfData.questionImageHight}px; max-width:100%; margin-top:10px; display: table-cell;
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
          let img = `&nbsp; &nbsp;<img style="height:${tnfData.questionImageHight}px; max-width:100%; margin-top:10px; display: table-cell;
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
  return (
    <>
      <View style={{ backgroundColor: '#fff', marginBottom: 6 }}>
        <View style={{ backgroundColor: '#efefef', borderRadius: 6 }}>

          {/* <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
            <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
              <Text>Chapter:{tnfData.chapterName}</Text>
            </View>
            <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
              <Text>Type:TNF</Text>
            </View>
            <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
              <Text>Marks:{tnfData.quesSelectedMark}</Text>
            </View>
          </View> */}

          <View style={{ backgroundColor: '#93ced0', borderRadius: 6 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: '#fff' }}>
                <Text style={{ color: '#000', fontWeight: '700', textAlign: 'center' }}>Chapter: {tnfData.chapterName}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: '#000' }}>Type:TNF</Text>
              </View>
              <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                <Text style={{ color: '#000', textAlign: 'right' }}>Marks: {tnfData.marksPerQuestion}</Text>
              </View>
            </View>
          </View>


          <View style={{ flexDirection: 'row', padding: 5, }}>
            <View style={{ width: 55 }}>
              <Text style={{ color: '#000' }}>Q: {index}</Text>
            </View>
            <View style={{ flex: 1 }}>
              {/* <Text style={{ color: '000', fontWeight: 'bold' }}>{tnfData.question}</Text> */}
              <RenderHtml
                contentWidth={width}
                source={{ html: TnfData.question }}
                tagsStyles={tagsStyles}
              />
              {TnfData.options.map((item, key) => {
                return (
                  <View style={{ flexDirection: 'row', padding: 2, }} key={key}>
                    <View style={{ width: 20 }}>
                      <Text style={{ color: '#000' }}>{optionArray[key]}.</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <RenderHtml
                        contentWidth={width}
                        source={{ html: item }}
                        tagsStyles={tagsStyles}
                      />
                    </View>
                    <View style={{ width: TnfData.tnfBtn[0] == 'Correct' && TnfData.tnfBtn[1] == 'Incorrect' || TnfData.tnfBtn[0] == 'Daylight' && TnfData.tnfBtn[1] == 'Darkness' ? 135 : 100, flexDirection: 'row' }}>
                      <View style={{ width: 'auto' }}>
                        <View style={{ backgroundColor: '#92cbb2', margin: 2, padding: 4, borderRadius: 6 }} >
                          {/* <Text style={{ color: '#000', textAlign: 'center' }}>{TnfData.tnfBtn[0]}</Text> */}
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: TnfData.tnfBtn[0] }}
                            tagsStyles={tagsStyles}
                          />
                        </View>
                      </View>
                      <View style={{ width: 'auto' }}>
                        <View style={{ backgroundColor: '#e4949a', margin: 2, padding: 4, borderRadius: 6 }} >
                          {/* <Text style={{ color: '#000', textAlign: 'center' }}>{TnfData.tnfBtn[1]}</Text> */}
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: TnfData.tnfBtn[1] }}
                            tagsStyles={tagsStyles}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>

          <View style={{ marginHorizontal: 10, paddingVertical: 5, borderTopWidth: .7 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 110 }}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>Correct Answers</Text>
              </View>
              <View>
                <Text style={{ color: '#000' }}>:</Text>
              </View>
              <View style={{ paddingHorizontal: 5, flex: 1 }}>
                {/* <Text style={{ color: '#000' }}>{tnfData.answerText.replaceAll("???", ",")}</Text> */}
                <RenderHtml
                  contentWidth={width}
                  source={{ html: tnfData.answerText.replaceAll("???", ",") }}
                  tagsStyles={tagsStyles}
                />
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
                <Text style={{ color: '#000' }}>{tnfData.userAnsText.replaceAll("???", ",").replaceAll('null', 'Not Attempt')}</Text>
              </View>
            </View> */}
          </View>
        </View>
      </View>
    </>
  )
}