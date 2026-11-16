import { StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import React, { useContext } from 'react'
import { SWATheam } from '../../../../constant/ConstentValue'
import { ProgressChart, PieChart } from 'react-native-chart-kit'
import { ScrollView } from 'react-native-gesture-handler';
import { GlobleData } from '../../../../Store';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Img1 = require('../../../assets/smile.png')

const screenWidth = Dimensions.get("window").width;

const DetailedAnalyticalReportsGraph = ({ reportData }) => {

  const { userData } = useContext(GlobleData)

  let totalProficient = 0
  let totalAdvance = 0
  let totalAverage = 0
  let totalBeginner = 0
  const totalCountOfStudent = reportData.data.classData.length

  reportData.data.classData.map((item, index) => {

    if (item.percentage >= 81 && item.percentage <= 100) {
      totalProficient++;
    } else if (item.percentage >= 61 && item.percentage <= 80) {
      totalAdvance++;
    } else if (item.percentage >= 41 && item.percentage <= 60) {
      totalAverage++;
    } else if (item.percentage >= 0 && item.percentage <= 40) {
      totalBeginner++
    }
  })
  const data = [
    {
      population: totalProficient,
      color: "#2e630b",
      name: "Seoul",
    },
    {
      population: totalAdvance,
      color: "#911a5c",
      name: "Seoul",
    },
    {
      population: totalAverage,
      color: "#009aff",
      name: "Seoul",
    },
    {
      population: totalBeginner,
      color: "#e93c12",
      name: "Seoul",
    },
  ];


  let chapterDataObj = []
  let chapterIDArray = []
  reportData.data.chapterWiseData.map((item, index) => {
    // console.log(item,  'item' )
    item.chaptersData.map((val, ind) => {
      console.log('val', val)
      if (!chapterIDArray.includes(val.chapterID)) {
        chapterIDArray.push(val.chapterID)
        const data = {
          'chapterID': val.chapterID,
          'chapterName': val.chapterName,
          'chapterNo': val.chapterNo,
          'userData': []
        }
        chapterDataObj.push(data)
      }
    })
  });

  reportData.data.chapterWiseData.map((item, index) => {
    item.chaptersData.map((chapterData) => {
      chapterDataObj.map((value, key) => {
        if (chapterData.chapterID == value.chapterID) {
          const userData = {
            'userRefID': item.userRefID,
            'fullName': item.name,
            'percentage': chapterData.percentage
          }
          chapterDataObj[key]['userData'].push(userData);
        }
      })
    });
  });


  return (
    <View>
      <PieChart
        data={data}
        width={screenWidth}
        height={250}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: "#fff",
          backgroundGradientToOpacity: 1,
          color: (opacity = 1) => `rgba(91, 24, 7, ${opacity})`,
          strokeWidth: 2, // optional, default 3
          barPercentage: 0.5,
          useShadowColorFromDataset: false // optional
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[75, 0]}
        hasLegend={false}
        absolute
      />
      <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-around' }}>
        <View style={{ padding: 6, flexDirection: 'row' }}>
          <View style={{ alignItems: 'center', width: 80 }}>
            <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: '#e93c12' }}></View>
            <Text style={{ color: "#e93c12", fontSize: 12 }}>Beginner {Math.round(totalBeginner * 100 / totalCountOfStudent)}%</Text>
          </View>
          <View style={{ alignItems: 'center', width: 80 }}>
            <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: '#009aff' }}></View>
            <Text style={{ color: "#009aff", fontSize: 12 }}>Average {Math.round(totalAverage * 100 / totalCountOfStudent)}%</Text>
          </View>
          <View style={{ alignItems: 'center', width: 80 }}>
            <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: '#911a5c' }}></View>
            <Text style={{ color: "#911a5c", fontSize: 12 }}>Advance {Math.round(totalAdvance * 100 / totalCountOfStudent)}%</Text>
          </View>
          <View style={{ alignItems: 'center', width: 80 }}>
            <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: '#2e630b' }}></View>
            <Text style={{ color: "#2e630b", fontSize: 12 }}>Proficient {Math.round(totalProficient * 100 / totalCountOfStudent)}%</Text>
          </View>
        </View>
      </ScrollView>

      <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', textAlign: 'center', marginTop: 20, textTransform: 'uppercase' }}>Detailed Chapter-Wise Progress</Text>
      <View style={{ width: '90%', alignSelf: 'center', borderRadius: 6, backgroundColor: SWATheam.SwaWhite, marginVertical: 10, elevation: 9 }}>

        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.liteTheme }}>
          <View style={{ padding: 2, flex: 1 }}>
            <Text style={{ color: SWATheam.SwaBlack }}>Superlative</Text>
          </View>
          <View style={{}}>
            <Image source={require('../../..//assets/smile.png')} style={{ height: 30, width: 30 }} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.liteTheme }}>
          <View style={{ padding: 2, flex: 1 }}>
            <Text style={{ color: SWATheam.SwaBlack }}>Satisfactory</Text>
          </View>
          <View style={{}}>
            <Image source={require('../../..//assets/angry.png')} style={{ height: 30, width: 30 }} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.liteTheme }}>
          <View style={{ padding: 2, flex: 1 }}>
            <Text style={{ color: SWATheam.SwaBlack }}>Immediate</Text>
          </View>
          <View style={{}}>
            <Image source={require('../../..//assets/sad.png')} style={{ height: 30, width: 30 }} />
          </View>
        </View>




      </View>

      {/* ChapterWise Table */}

      <View style={{ padding: 10 }}>
        {reportData.data.chapterDetails.map((item, index) => {

          let smileName = require('../../../assets/smile.png')
          let proficientCount = 0;
          let advanceCount = 0;
          let averageCount = 0;
          let beginnerCount = 0;

          let proficientPercentage = 0;
          let advancePercentage = 0;
          let averagePercentage = 0;
          let beginnerPercentage = 0;
          const percentLength = item.percent.length;

          item.percent.map((val, ind) => {
            if (val >= 81 && val <= 100) {
              smileName = require('../../../assets/smile.png');
              proficientCount++;
            } else if (val >= 61 && val <= 80) {
              smileName = require('../../../assets/smile.png');
              advanceCount++;
            } else if (val >= 41 && val <= 60) {
              smileName = require('../../../assets/angry.png');
              averageCount++;
            } else if (val >= 0 && val <= 40) {
              smileName = require('../../../assets/sad.png');
              beginnerCount++;
            }
          })

          proficientPercentage = Math.round((proficientCount / percentLength) * 100) + '%';
          advancePercentage = Math.round((advanceCount / percentLength) * 100) + '%';
          averagePercentage = Math.round((averageCount / percentLength) * 100) + '%';
          beginnerPercentage = Math.round((beginnerCount / percentLength) * 100) + '%';


          return (
            <View style={{ borderRadius: 10, backgroundColor: SWATheam.SwaWhite, padding: 6, backgroundColor: userData.data.colors.liteTheme, marginVertical: 5 }} key={index}>
              <View style={{ flexDirection: 'row', paddingVertical: 8, borderBottomWidth: .7 }}>
                <Text style={{ width: 80, color: SWATheam.SwaBlack }}>Chapter :</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack, fontWeight: '700' }}>{item.chapterName}</Text>
              </View>

              <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>Beginner</Text>
                <Text style={{ color: SWATheam.SwaBlack }}>{beginnerPercentage}</Text>
              </View>
              <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>Average</Text>
                <Text style={{ color: SWATheam.SwaBlack }}>{averagePercentage}</Text>
              </View>
              <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>Advance</Text>
                <Text style={{ color: SWATheam.SwaBlack }}>{advancePercentage}</Text>
              </View>
              <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>Proficient</Text>
                <Text style={{ color: SWATheam.SwaBlack }}>{proficientPercentage}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>Remarks</Text>
                <Image source={smileName} style={{ height: 30, width: 30 }} />
              </View>
            </View>
          )
        })}
      </View>
      {/* /* ChapterWise Table*/}
      <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', textAlign: 'center', marginTop: 20, textTransform: 'uppercase' }}>Chapter-Wise Students Progress</Text>
      <View style={{ backgroundColor: userData.data.colors.liteTheme, padding: 8, marginVertical: 5 }}>
        {chapterDataObj.map((item, index) => {

          return (
            <View style={{ backgroundColor: SWATheam.SwaWhite, borderRadius: 4, marginVertical: 4, padding: 6, }} key={item.chapterID}>
              <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700' }}>Chapter {item.chapterNo} : {item.chapterName}</Text>
              {item.userData.map((val, ind) => {

                let capColor = "#e93c12"
                if (val.percentage >= 81 && val.percentage <= 100) {
                  capColor = "#2e630b";
                } else if (val.percentage >= 61 && val.percentage <= 80) {
                  capColor = "#911a5c";
                } else if (val.percentage >= 41 && val.percentage <= 60) {
                  capColor = "#009aff";
                } else if (val.percentage >= 0 && val.percentage <= 40) {
                  capColor = "#e93c12";
                }


                return (
                  <View style={{ flexDirection: 'row', marginVertical: 4, padding: 4 }} key={ind}>
                    <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>{val.fullName}</Text>
                    <FontAwesome name="graduation-cap" color={capColor} size={25} />
                  </View>

                )
              })}
            </View>
          )

        })}



      </View>
    </View>
  )
}
export default DetailedAnalyticalReportsGraph
const styles = StyleSheet.create({})