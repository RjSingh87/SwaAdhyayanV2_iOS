import {
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Text,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { SWA, SWATheam, SWATheamTheam } from '../../constant/ConstentValue';
import WebView from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useIsFocused } from '@react-navigation/native';
import SwaHeader from './SwaHeader';

const VideoView = ({ navigation, route }) => {
    const { width, height } = Dimensions.get('window');

    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(null);
    const [currentValue, setCurrentValue] = useState(0);
    const [loading, setLoading] = useState(true);

    const isFocused = useIsFocused();

    const ref = useRef();

    // ✅ SAFE PARAM EXTRACTION
    const params = route?.params || {};

    // ✅ FINAL VIDEO URL LOGIC (ROBUST)
    let videoUrl = '';

    if (params?.youtubeReferenceLink) {
        videoUrl = params.youtubeReferenceLink;
    } else if (params?.referenceLink) {
        videoUrl = params.referenceLink;
    } else if (params?.url && !params.url.includes('null/null')) {
        videoUrl = params.url;
    } else if (
        params?.siteUrl &&
        params?.filePath &&
        params?.uploadFileName
    ) {
        videoUrl =
            params.siteUrl +
            params.filePath +
            '/' +
            params.uploadFileName;
    } else {
        videoUrl = '';
    }

    // console.log('Final Video URL:', videoUrl);

    useEffect(() => {
        return () => {
            setPaused(true);
        };
    }, []);

    // ✅ YOUTUBE DETECTION
    const isYoutube =
        videoUrl?.includes('youtube.com') ||
        videoUrl?.includes('youtu.be');

    const getYouTubeId = url => {
        const regExp =
            /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([^&\n?#]+)/;
        const match = url?.match(regExp);
        return match ? match[1] : null;
    };

    const videoId = getYouTubeId(videoUrl);

    // ✅ MP4 CHECK
    const isMp4 = videoUrl?.includes('.mp4');

    // ✅ ORIENTATION CONTROL
    useEffect(() => {
        StatusBar.setHidden(true);

        if (!isYoutube) {
            Orientation.lockToLandscape();
        }

        return () => {
            Orientation.unlockAllOrientations();
            StatusBar.setHidden(false);
        };
    }, []);

    // ✅ EMPTY / INVALID URL HANDLING
    if (!videoUrl) {
        return (
            <View style={styles.centerView}>
                <Text style={styles.errorText}>No Video Available</Text>
            </View>
        );
    }

    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }
    // console.log(route?.params, "route?.params")

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                position: 'absolute', top: 50,
                left: 0,
                right: 0,
                zIndex: 999,
                elevation: 999,
            }}>
                <SwaHeader title={""} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} yTubeStatus={true} />
            </View>
            <View style={styles.container}>
                {/* ✅ YOUTUBE PLAYER */}
                {isYoutube && videoId ? (
                    <View style={styles.youtubeContainer}>
                        <YoutubePlayer
                            height={(width - 20) * 0.56}
                            width={width - 20}
                            play={isFocused}
                            videoId={videoId}
                        />
                    </View>
                ) : isMp4 ? (
                    /* ✅ NORMAL VIDEO PLAYER */
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <Video
                            paused={!isFocused}
                            controls={true}
                            source={{ uri: videoUrl }}
                            ref={ref}
                            onProgress={val => {
                                if (val) {
                                    setLoading(false);
                                    setCurrentValue(val.currentTime);
                                    setProgress(val);
                                }
                            }}
                            resizeMode="contain"
                            style={styles.videoView}
                        />
                    </TouchableOpacity>
                ) : (
                    /* ✅ WEBVIEW (iframe / other links) */
                    <WebView
                        source={{
                            html: `<iframe width="100%" height="100%" src="${videoUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`,
                        }}
                    />
                )}
            </View>
        </View>
    );
};

export default VideoView;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: SWATheam.SwaBlack,
    },
    videoView: {
        width: '100%',
        height: '100%',
    },
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#fff',
        fontSize: 16,
    },
    youtubeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});