import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { GlobleData } from '../../Store'
import { SWATheam } from '../../constant/ConstentValue'

const GameList = ({ gameList, getGameView }) => {
  const { userData } = useContext(GlobleData)
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: userData.data.colors.liteTheme }}>
      <ScrollView>
        {gameList.data.mainData.map((item, index) => {
          return (
            <View style={{ marginVertical: 6, justifyContent: 'center', alignItems: 'center' }} key={index}>
              <Text style={{ textAlign: 'center', padding: 8, fontWeight: '500', color: SWATheam.SwaWhite, textTransform: 'capitalize', fontSize: 14, backgroundColor: userData.data.colors.mainTheme, width: '90%', borderTopRightRadius: 6, borderTopLeftRadius: 6 }}>{item.gameName}</Text>
              <TouchableOpacity style={{ height: 200, width: "90%", borderBottomRightRadius: 6, borderBottomLeftRadius: 6, }}
                onPress={() => getGameView(gameList.data.gameUrl + item.gameFolder)}
              >
                <Image source={{ uri: gameList.data.imgUrl + item.gameIcon }} style={{ width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 6 }} />
              </TouchableOpacity>
            </View>

          )
        })}
      </ScrollView>
    </View>
  )
}
export default GameList
const styles = StyleSheet.create({})