import React, { useState, useEffect, useContext } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-paper';
import JUMBW from './JUMBW';
import Instructions from './Instructions';
import Header from './Header';
import McqType from './McqType';
import Tnf from './TnfType';
// import Timer from './Timer'
import DndType from './DndType';
import DdType from './DdType';
import Matching from './Matching';
import FillUp from './FillUp';
import Desc from './Desc';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { launchCamera as openCamera, launchImageLibrary } from 'react-native-image-picker';
import { GlobleData } from '../../../../../../Store';
import SwaHeader from '../../../../../common/SwaHeader';
import { apiRoot, SWATheam, token } from '../../../../../../constant/ConstentValue';
import Loader from '../../../../../common/Loader';
import Services from '../../../../../../Services';
// import Orientation from 'react-native-orientation-locker';

export default function AttemptHolder({ navigation }) {
	function onClickLeftIcon() {
		navigation.goBack()
	}
	function onClickRightIcon() {
		setIsInstruction(true)
	}

	const {
		userData,
		getAssQuest,
		manageData,
		currentIndex,
		submitAttem,
		prev, next,
		isDec,
		attemptStore,
		setIsdec,
		sure,
		cancelSubmit,
		examSubmit,
	} = useContext(GlobleData);
	useEffect(() => {
		getAssQuest()
	}, [])

	useEffect(() => {
		if (manageData.questions[currentIndex]?.activityID === 4) {
			StatusBar.setHidden(true);
			// Orientation.lockToLandscape()
		} else {
			StatusBar.setHidden(false);
			// Orientation.lockToPortrait()
		}
	}, [manageData])


	const [cameraType, setCameraType] = useState('back');
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [loader, setLoader] = useState(false);
	const [imgStore, setImgStore] = useState([])
	const [imageUri, setImageUri] = useState();
	const [dataHendler, setDataHendlar] = useState({
		instComp: false
	})
	function instructions() {
		setDataHendlar((x) => {
			return {
				...x,
				instComp: true,
			}
		})
	}
	function hideInstComp() {
		setDataHendlar((x) => {
			return {
				...x,
				instComp: false,
			}
		})
	}

	const handleOpenCamera = () => {
		const options = {
			mediaType: 'photo',
			cameraType: cameraType,
		};
		openCamera(options, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.errorCode) {
				console.log('ImagePicker Error: ', response.errorMessage);
			} else {
				const uri = response.assets[0].uri;
				setImageUri(uri);
				uploadImgsDec(uri)
			}
			setIsCameraOpen(false);
		});
	};

	const chooseFile = () => {
		const options = {
			mediaType: 'photo',
		};
		launchImageLibrary(options, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.errorCode) {
				console.log('ImagePicker Error: ', response.errorMessage);
			} else {
				const uri = response.assets[0].uri;
				setImageUri(uri);
				uploadImgsDec(uri)
			}
		});
	};

	const toggleCameraType = () => {
		setCameraType((prevType) => (prevType === 'back' ? 'front' : 'back'));
	};


	function uploadImgsDec(url) {
		console.log(url, 'hello')
		setLoader(true);
		const formData = new FormData();
		formData.append('schoolCode', userData.data.schoolCode);
		formData.append('userRefID', userData.data.userRefID);
		formData.append('classID', userData.data.classID);
		formData.append('assessmentID', attemptStore.assMentIds);
		formData.append('subjectID', attemptStore.sujectIds);
		formData.append('descImage', {
			uri: url,
			name: 'photo.png',
			fileName: 'image',
			type: 'image/png',
		});

		Services.uploadData(apiRoot.uploadDescExamImage, formData)
			.then((res) => {

				if (res.status === "success") {
					setImgStore(res);
				} else {
					alert("Upload failed");
				}
			})
			.catch((err) => {
				console.error("Error during fetch:", err);
				alert('Error occurred: ' + err.message);
			})
			.finally(() => {
				setLoader(false);
			});
	}

	function hideModel() {
		setIsdec(false)
		navigation.goBack()
	}

	function removeItemImg(roData, index) {
		setLoader(true)
		let clckGetName = roData[index];
		const payload = {
			"schoolCode": userData.data.schoolCode,
			"userRefID": userData.data.userRefID,
			"classID": userData.data.classID,
			"assessmentID": attemptStore.assMentIds,
			"subjectID": attemptStore.sujectIds,
			"solutionSheet": clckGetName
		}
		Services.post(apiRoot.deleteDescExamImage, payload)
			.then((res) => {
				if (res.status === "success") {
					alert(res.message)
					setImgStore(res)
					setLoader(false)
				} else {
					alert(res.message)
				}
			})
			.catch((err) => {
				alert('Error occurred');
			})
			.finally(() => {
				setLoader(false)
			});
	}

	const convertTimeToSeconds = (timeString) => {
		if (!timeString) return 0;
		const [hours, minutes, seconds] = timeString.split(':').map(Number);
		return hours * 3600 + minutes * 60 + seconds;
	};

	let TotalTime = manageData.questions[currentIndex]?.totalTime;
	const [countDown, setCountDown] = useState(convertTimeToSeconds(TotalTime));
	const [runTimer, setRunTimer] = useState(false);

	useEffect(() => {
		let timerId;
		if (runTimer) {
			timerId = setInterval(() => {
				setCountDown((prevCountDown) => prevCountDown - 1);
			}, 2000);
		}

		return () => {
			if (timerId) {
				clearInterval(timerId);
			}
		};
	}, [runTimer]);

	useEffect(() => {
		if (countDown <= 0 && runTimer) {
			examSubmit()
			setRunTimer(false);
			setCountDown(0);
		} else if (countDown > 0 && !runTimer && TotalTime) {
			console.log('Resuming timer with new TotalTime:', TotalTime);
			setRunTimer(true);
		}
	}, [countDown, runTimer, TotalTime]);

	useEffect(() => {
		if (TotalTime !== undefined) {
			setCountDown(convertTimeToSeconds(TotalTime));
			setRunTimer(true);
		}
	}, [TotalTime]);

	const hours = Math.floor(countDown / 3600);
	const minutes = Math.floor((countDown % 3600) / 60);
	const seconds = countDown % 60;
	let timeBox = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

	return (
		<GestureHandlerRootView style={{ flex: 1, marginTop: 24 }}>
			{manageData.showLoader ?
				<Loader /> :
				<View style={{ flex: 1 }}>
					{manageData.questions[currentIndex]?.activityID != 4 &&
						<SwaHeader title={'Assessment Attempt'} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
					}
					<Header />
					<View style={styles.headerTimer}>
						<Text style={{ fontSize: 13 }}>{timeBox}</Text>
						<TouchableOpacity style={styles.information} onPress={instructions}>
							<Icon name="info" size={16} color={SWATheam.SwaWhite} />
						</TouchableOpacity>
					</View>
					<View style={styles.mainScreen}>
						{/* componets renser here */}

						<ScrollView>
							{manageData.questions[currentIndex]?.activityID === 1 ?
								<McqType />
								: manageData.questions[currentIndex]?.activityID === 2 ?
									<Tnf />
									: manageData.questions[currentIndex]?.activityID === 9 ?
										<DndType />
										: manageData.questions[currentIndex]?.activityID === 10 ?
											<JUMBW />
											: manageData.questions[currentIndex]?.activityID === 12 ?
												<DdType />
												: manageData.questions[currentIndex]?.activityID === 4 ?
													<Matching />
													: manageData.questions[currentIndex]?.activityID === 3 ?
														<FillUp />
														: manageData.questions[currentIndex]?.activityID === 15 ?
															<Desc />
															:
															null
							}
						</ScrollView>


						{/* instraction  */}
						<View>
							{dataHendler.instComp &&
								<>
									<Modal animationType="slide">
										<View style={styles.headersInst}>
											<Text style={{ color: SWATheam.SwaWhite }}>Instructions</Text>
											<TouchableOpacity onPress={hideInstComp}>
												<Icon name="close" size={20} color={SWATheam.SwaWhite} />
											</TouchableOpacity>
										</View>
										<Instructions />
									</Modal>
								</>
							}
						</View>
						{/* instraction  */}

					</View>
					<View style={styles.footer}>
						<View style={styles.flextButton}>
							<Button mode="contained" buttonColor="#426f91" onPress={prev} style={{ width: 110, marginRight: 5 }} disabled={currentIndex === 0}>
								Previous
							</Button>
							<Button mode="contained" buttonColor="#426f91" onPress={next} style={{ width: 110 }} disabled={currentIndex === manageData.questions.length - 1}>
								Next
							</Button>
						</View>
						<View>
							{currentIndex === manageData.totalQuest - 1 ? (
								<Button onPress={submitAttem} mode="contained" style={[styles.buttonBox1, { backgroundColor: "#407026" }]}>
									<Text style={[styles.textButton]}>Submit</Text>
								</Button>
							) : null}

						</View>
					</View>
					{isDec &&
						<View style={{ flex: 1, height: "100%" }}>
							<Modal animationType="slide" transparent={true}>
								<View style={{ flex: 1, justifyContent: "center", height: "100%", backgroundColor: '#0000003b' }}>
									<View style={styles.selectImgCamera}>
										<TouchableOpacity style={styles.closeIcons} onPress={hideModel}>
											<Icon style={{ margin: "auto" }} name="close" size={22} color="#000" />
										</TouchableOpacity>
										<View style={styles.imhHolder}>
											{imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
										</View>
										<View style={styles.uploaderImgsList}>
											<Text style={{ fontSize: 13 }}>Uploaded Images</Text>
											<View style={{ flexDirection: 'row', justifyContent: "space-between", flexWrap: 'wrap' }}>
												{imgStore.data?.map((item, index) => {
													if (item != '') {
														let roData = imgStore.rawData
														return (
															<View style={styles.imgsBox} key={index}>
																<TouchableOpacity style={styles.removeItem} onPress={() => { removeItemImg(roData, index) }}>
																	<Icon style={{ margin: "auto" }} name="close" size={16} color="red" />
																</TouchableOpacity>
																<Image source={{ uri: item }} style={styles.uploadThumb} />
															</View>
														)
													}
												})}
											</View>
										</View>

										<View style={styles.rowButton}>
											<TouchableOpacity style={styles.buttonTou} onPress={() => setIsCameraOpen(true)}>
												<Text style={{ color: SWATheam.SwaWhite }}>Open Camera</Text>
											</TouchableOpacity>
											<TouchableOpacity style={styles.buttonTou} onPress={chooseFile}>
												<Text style={{ color: SWATheam.SwaWhite }}>Choose File</Text>
											</TouchableOpacity>
										</View>

										<View style={styles.finalSubmitRow}>
											<TouchableOpacity style={styles.finalSubBtn}>
												<Text style={{ textAlign: "center", color: SWATheam.SwaWhite }} onPress={hideModel}>Final Submit</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</Modal>
						</View>
					}
					<View>
						<Modal animationType="slide" visible={isCameraOpen} transparent={true}>
							<View style={styles.modalContainer}>
								<View style={styles.modalContent}>
									<View style={styles.rowButton2}>
										<TouchableOpacity style={styles.buttonTou} onPress={toggleCameraType}>
											<Icon name="refresh" size={16} color={SWATheam.SwaWhite} />
										</TouchableOpacity>
										<TouchableOpacity style={styles.buttonTou} onPress={handleOpenCamera}>
											<Icon name="camera" size={16} color={SWATheam.SwaWhite} />
										</TouchableOpacity>
										<TouchableOpacity style={styles.buttonTou} onPress={() => setIsCameraOpen(false)}>
											<Icon name="close" size={16} color={SWATheam.SwaWhite} />
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</Modal>
					</View>
					{loader && <Loader />}

					{sure &&
						<View style={{ flex: 1, height: "100%", }}>
							<Modal animationType="slide" transparent={true}>
								<View style={styles.areYouSure}>
									<View style={styles.centerHolder}>
										<View style={styles.qIcons}><Icon style={{ margin: "auto" }} name="question" size={70} color="#ffaa00" /></View>
										<Text style={{ fontSize: 20, fontWeight: "bold", color: SWATheam.SwaBlack, marginTop: 10 }}>Are you sure?</Text>
										<Text style={{ fontSize: 13, marginTop: 10, color: SWATheam.SwaBlack }}>Once Submit, your will not be able to Attempt Again !</Text>
										<View style={styles.footerButton}>
											<TouchableOpacity style={styles.buttonFoot} onPress={cancelSubmit}>
												<Text style={{ color: SWATheam.SwaWhite, fontSize: 15 }}>Cancel</Text>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => examSubmit(navigation)} style={[styles.buttonFoot, { backgroundColor: "green" }]}>
												<Text style={{ color: SWATheam.SwaWhite, fontSize: 15 }}>Confirm!</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</Modal>
						</View>
					}
				</View>
			}



		</GestureHandlerRootView>
	);
}
const styles = StyleSheet.create({
	buttonFoot: {
		width: 80,
		backgroundColor: 'red',
		alignItems: 'center',
		padding: 7,
		borderRadius: 5,
		elevation: 5,
	},
	footerButton: {
		flexDirection: 'row',
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
		marginTop: 20
	},
	qIcons: {
		padding: 10,
		borderWidth: 1,
		borderColor: '#e7d99d',
		width: 80,
		height: 80,
		borderRadius: 50,
		elevation: 1,
		backgroundColor: '#fff',
		display: "flex",
		alignItems: "center",
		justifyContent: 'center'
	},
	centerHolder: {
		maxWidth: 350,
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 10,
		alignItems: "center"
	},
	areYouSure: {
		width: "100%",
		height: "100%",
		backgroundColor: "#0000003b",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	finalSubBtn: {
		backgroundColor: "#5bae5b",
		margin: 2,
		borderRadius: 5,
		width: 130,
		paddingLeft: 10,
		paddingRight: 10,
		padding: 10,
		elevation: 3
	},
	finalSubmitRow: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30
	},
	removeItem: {
		paddingHorizontal: 10,
		padding: 5,
		borderWidth: 1,
		borderColor: "#eaeef0"
	},
	closeIcons: {
		position: 'absolute',
		right: 5,
		top: 5,
		borderWidth: 1,
		borderColor: 'red',
		padding: 5,
		paddingHorizontal: 10,
		borderRadius: 5
	},
	imgsBox: {
		borderWidth: 1,
		borderColor: "#faf5ab",
		margin: 2,
	},
	uploadThumb: {
		width: 100,
		height: 100,
		resizeMode: "contain"
	},
	uploadImgs: {
		textAlign: 'center',
		width: 80,
		padding: 5,
		borderWidth: 1,
		borderColor: "#cabdd1",
		margin: 10
	},
	uploaderImgsList: {
		marginVertical: 10,
		borderTopColor: "#c3dbff",
		borderTopWidth: 1,
	},
	imgInBox: {
		maxWidth: "100%",
		height: 70,
	},
	imhHolder: {
		width: 70,
		height: 70,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#eaf6f6',
		alignSelf: 'center',
		margin: 10,
		overflow: "hidden",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonTou: {
		borderRadius: 5,
		borderRadius: 10,
		elevation: 5,
		backgroundColor: "#0089d1",
		color: "#fff",
		padding: 10,
		paddingHorizontal: 10,
		fontSize: 14
	},
	rowButton: {
		flexDirection: 'row',
		alignItems: "center",
		justifyContent: "space-between"
	},
	rowButton2: {
		flexDirection: 'row',
		justifyContent: "space-around",
		alignItems: "center",
	},
	selectImgCamera: {
		borderRadius: 15,
		borderWidth: 1,
		borderColor: '#d1e8e2',
		padding: 15,
		margin: 20,
		elevation: 2,
		backgroundColor: "#fff",
		position: "relative"
	},
	headersInst: {
		backgroundColor: "#27a2d4",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
		elevation: 5
	},
	textBolds: {
		fontSize: 14,
		fontWeight: "bold"
	},
	information: {
		width: 20,
		height: 20,
		backgroundColor: '#196aaa',
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 50

	},
	headerTimer: {
		backgroundColor: "#dddddd",
		padding: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	mainScreen: {
		backgroundColor: '#fff',
		margin: 5,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: '#999',
		flex: 1
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		// position: 'absolute',
		// left: 0,
		// bottom: 0,
		backgroundColor: "#faf0e6",
		width: '100%',
		padding: 2,
	},
	flextButton: {
		flexDirection: 'row'
	},
	buttonBox: {
		backgroundColor: "#5587e3",
		margin: 2,
		borderRadius: 5,
		width: 90,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 7,
		paddingBottom: 7,
	},
	textButton: {
		color: '#fff',
		textAlign: "center"
	},
	image: {
		width: 100,
		height: 100,
		marginTop: 20,
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	modalContent: {
		width: 300,
		padding: 20,
		backgroundColor: 'white',
		borderRadius: 10,
	},
});