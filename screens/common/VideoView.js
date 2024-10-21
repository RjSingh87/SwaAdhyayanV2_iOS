import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, SafeAreaView, Platform, StatusBar } from 'react-native';
import React, { useContext, useRef, useState, useEffect } from 'react'
import { GlobleData } from '../../Store'
import SwaHeader from './SwaHeader'
// import VideoLoader from './VideoLoader';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
import { SWATheam } from '../../constant/ConstentValue';
import AntDesign from 'react-native-vector-icons/AntDesign';

const VideoView = ({ navigation, route }) => {
    let videoUrl = ''
    if (route.params.siteUrl != undefined || route.params.siteUrl != null) {
        videoUrl = route.params.siteUrl + route.params.filePath + '/' + route.params.uploadFileName
    } else {
        videoUrl = route.params.url
    }

    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }

    useEffect(() => {
        StatusBar.setHidden(true);
        Orientation.lockToLandscape()
    }, [])

    const [clicked, setClicked] = useState(false)
    const [paused, setPaused] = useState(false)
    const [progress, setProgress] = useState(null)
    // const [fullScreen, setFullScreen] = useState(true)
    const [currentValue, setCurrentValue] = useState(0)
    const [loading, setLoading] = useState(true)
    const ref = useRef()

    const format = seconds => {
        let minuts = parseInt(seconds / 60)
            .toString()
            .padStart(2, 0);
        let secs = (Math.trunc(seconds) % 60).toString().padStart(2, 0);
        return `${minuts}:${secs}`
    }

    function toggleModal() {
        navigation.goBack()
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <>
                <View style={{ width: "100%", height: '100%', backgroundColor: SWATheam.SwaBlack }}>
                    <TouchableOpacity activeOpacity={1} style={{ width: "100%", height: "100%" }}
                        onPress={() => setClicked(!clicked)}>
                        <Video
                            paused={paused}
                            // controls={true}
                            source={{ uri: videoUrl }}
                            ref={ref}
                            onProgress={(val) => {
                                if (val != undefined) {
                                    setLoading(false)
                                }
                                setCurrentValue(val.currentTime)
                                setProgress(val)
                            }}
                            onBuffer={this.onBuffer}           // Callback when remote video is buffering
                            onError={this.videoError}          // Callback when video cannot be loaded
                            resizeMode="contain"
                            style={styles.videoView} />
                        {clicked &&
                            <TouchableOpacity style={{ width: "100%", height: "100%", position: "absolute", justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,.7)' }}
                                onPress={() => setClicked(!clicked)}>
                                <TouchableOpacity style={{ position: 'absolute', top: 12, right: 12 }}
                                    onPress={toggleModal}>
                                    <AntDesign name="close" size={30} color={SWATheam.SwaWhite} />
                                </TouchableOpacity>
                                <View style={{ width: '70%', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            ref.current.seek(progress.currentTime - 10)
                                            setCurrentValue(ref.current.seek(progress.currentTime - 10))
                                        }}
                                    >
                                        <Image source={require("../assets/backword.png")} style={{ width: 40, height: 40, tintColor: '#fff' }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setPaused(!paused)
                                            if (paused) {
                                                setClicked(false)
                                            }
                                        }}
                                    >
                                        <Image source={paused ? require("../assets/playbtn.png") : require("../assets/pouse.png")} style={{ width: 40, height: 40, tintColor: '#fff' }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            ref.current.seek(progress.currentTime + 10)
                                            setCurrentValue(ref.current.seek(progress.currentTime + 10))
                                        }}>
                                        <Image source={require("../assets/fowward.png")} style={{ width: 40, height: 40, tintColor: '#fff' }} />
                                    </TouchableOpacity>

                                </View>
                                <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', bottom: 0, paddingHorizontal: 20, paddingBottom: 10 }}>
                                    <Text style={{ color: 'white' }}>{format(progress.currentTime)}</Text>
                                    <Slider
                                        style={{ flex: 1, height: 40 }}
                                        value={currentValue}
                                        maximumValue={progress.seekableDuration}
                                        minimumTrackTintColor="#FFFFFF"
                                        maximumTrackTintColor="#fff"
                                        onValueChange={(val) => {
                                            setCurrentValue(val)
                                            ref.current.seek(val)
                                        }}
                                    />
                                    <View style={{ flexDirection: 'row', width: 90, justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: 'white' }}>{format(progress.seekableDuration)}</Text>
                                        {/* <View>
                                                <Image source={!fullScreen ? require("../assets/fullView.png") : require("../assets/minimize.png")} style={{ tintColor: 'white', width: 30, height: 30 }} />

                                            </View> */}

                                    </View>

                                </View>
                            </TouchableOpacity>
                        }
                    </TouchableOpacity>

                </View>
            </>
        </SafeAreaView>

    )
}

export default VideoView

const styles = StyleSheet.create({
    videoView: {
        width: "100%",
        height: "100%",
    }
})