import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions } from 'react-native'
import React, { useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { WebView } from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../lmsScreen/CBSE_Safal/Loader';
import { SWATheam } from '../../constant/ConstentValue';

const UrlView = ({ fileType, colorSwa, setFileType }) => {
  // clg(fileType, "fileTypeYoutube")
  const statusBarHeight = StatusBar.currentHeight
  const videoUrl = fileType.data.youTubeUrl
  const isFocused = useIsFocused();
  const { width, height } = Dimensions.get('window');
  const [loading, setLoading] = useState(true)

  const getYouTubeId = url => {
    const regExp =
      /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([^&\n?#]+)/;
    const match = url?.match(regExp);
    return match ? match[1] : null;
  };


  return (
    <View style={[styles.selectFieldPopUp, { justifyContent: 'center' }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colorSwa, position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 99, paddingVertical: 10, paddingStart: 5 }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => setFileType(false)}>
            <AntDesign name={'arrowleft'} size={25} color={'#fff'} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 2, }}>
          <Text style={{ color: '#fff', textAlign: 'center', }} numberOfLines={1} ellipsizeMode='tail' >
            {videoUrl || "Youtube Link"}
          </Text>

        </View>
        <View style={{ flex: 1 }}></View>
      </View>

      <View>
        {loading && <Loader />}
      </View>



      <YoutubePlayer
        height={(width - 20) * 0.56}
        width={width - 20}
        play={isFocused}
        videoId={getYouTubeId(videoUrl)}
        onReady={() => { setLoading(false) }}
        onError={() => { setLoading(false) }}
      />


      {/* <WebView source={{ uri: videoUrl }} style={{ flex: 1, marginTop: statusBarHeight }} /> */}
    </View>

  )
}

export default UrlView

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#000',
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center'
  },

  flexContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },

  BtextClr: {
    color: '#000'
  },

  thClr: {
    color: '#654b25'
  },

  colorSwa: {
    color: '#0c8781'
  },

  WtextClr: {
    color: '#fff'
  },

  selectFieldPopUp: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: "center",
  }

});