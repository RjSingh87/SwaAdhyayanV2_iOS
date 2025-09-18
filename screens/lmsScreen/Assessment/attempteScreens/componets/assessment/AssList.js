import React, { useEffect, useState, useContext, } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, StatusBar, Image } from 'react-native';
import { GlobleData } from '../../../../../../Store';
import { apiRoot, SWATheam } from '../../../../../../constant/ConstentValue';
import Icon from "react-native-vector-icons/FontAwesome";
import Loader from '../../../../../common/Loader';
import Services from '../../../../../../Services';
// import Orientation from 'react-native-orientation-locker';
import AssessmentReport from '../../../AssessmentReport';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function AssiList({ navigation, }) {

	const { userData, attemptWaiting } = useContext(GlobleData);

	const [loader, setLoader] = useState(false);
	const [result, setResult] = useState(false);
	const [resultData, setResultdata] = useState([]);
	const [studentDetails, setStudentDetails] = useState()
	const [assessList, setAssessList] = useState([]);
	const [reportData, setReportData] = useState({ data: null, status: false })
	const [uploadSheets, setUploadSheets] = useState({ data: null, isValidateByExaminer: null, url: '', status: false })

	useEffect(() => {
		getGenerateAsslist()
		const goBack = navigation.addListener('focus', () => {
			getGenerateAsslist()
			StatusBar.setHidden(false);
			// Orientation.lockToPortrait();
		});
		return goBack
	}, [navigation])

	function getGenerateAsslist() {
		setLoader(true)
		const payload = {
			"schoolCode": userData?.data?.schoolCode,
			"userRefID": userData?.data?.userRefID,
		}
		Services.post(apiRoot.getGeneratedAssessmentList, payload)
			.then((res) => {
				if (res.status == "success") {
					setLoader(false)
					setAssessList(res.data);
					setUploadSheets((prev) => {
						return { ...prev, url: res.url }
					})
				} else {
					alert(res.message)
					setLoader(false)
				}
			})
			.catch((err) => {
				alert(err)
			})
			.finally(() => {
				setLoader(false)
			})

	}


	const date = new Date();
	const todayDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

	function viewReport(item) {
		const payload = {
			"schoolCode": userData.data.schoolCode,
			"userTypeID": userData.data.userTypeID,
			"userRefID": item?.userRefID,
			"assessmentID": item?.assessmentID
		}
		Services.post(apiRoot.viewAssessmentReport, payload)
			.then((res) => {
				if (res.status == "success") {
					const data = res.data
					setReportData((prev) => {
						return { ...prev, data: data, status: true }
					})
				} else if (res.status == 'error') {
					alert(res.message)
				}
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {

			})

	}

	const closeModal = () => {
		// setShowPopUp(false)
		// setResultData((prev) => {
		//     return { ...prev, status: false }
		// })
		setReportData((prev) => {
			return { ...prev, status: false }
		})
	}

	function viewResult(item) {
		setResult(true);
		setLoader(true);
		const payload = {
			"schoolCode": userData.data.schoolCode,
			"userRefID": userData.data.userRefID,
			"userTypeID": userData.data.userTypeID,
			"assessmentID": item.assessmentID,
		};

		Services.post(apiRoot.viewResult, payload)
			.then((res) => {
				if (res.status === "success") {
					setStudentDetails(res.data.details);
					setLoader(false);
					setResultdata(res.data.questions);
				} else if (res.status == "error") {
					alert(res.message);
					setLoader(false);
				}
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {
				setLoader(false);
			});
	}

	function closeResult() {
		setResult(false);
	}

	function viewsheets(item) {
		console.log(item, 'check item')
		const sheets = item.solutionSheet.split(',')
		const imgUrl = uploadSheets.url + item.assessmentID

		setUploadSheets((prev) => {
			return { ...prev, data: sheets, imgUrl: imgUrl, isValidateByExaminer: item.isValidateByExaminer, status: true }
		})

	}
	function closePopup() {
		setUploadSheets((prev) => {
			return { ...prev, status: false }
		})
	}





	return (
		<>
			<View style={{ flex: 1 }}>
				<View style={{ flex: 1 }}>
					<ScrollView>
						{assessList?.map((item, asslist) => {
							let attemptIds = item.attemptID;
							return (
								<View style={styles.holder} key={asslist}>
									<View style={styles.rowList}>
										<Text style={{ color: SWATheam.SwaBlack }}>Assessment Name : </Text>
										<Text style={{ color: SWATheam.SwaBlack }}>{item.assessmentName}</Text>
									</View>
									<View style={styles.rowList}>
										<Text style={{ color: SWATheam.SwaBlack }}>Subject : </Text>
										<Text style={{ color: SWATheam.SwaBlack }}>{item.subjectName}</Text>
									</View>
									<View style={styles.rowList}>
										<Text style={{ color: SWATheam.SwaBlack }}>Start Date : {item.startDate} </Text>
										<Text style={{ color: SWATheam.SwaBlack }}>End: {item.endDate} </Text>
									</View>
									{attemptIds !== 0 ?
										<>
											<Text style={styles.resultBold}>Result </Text>
											<View style={styles.rowList}>
												<Text style={{ color: SWATheam.SwaBlack }}>Scored Marks : {item.obtainedMarks} </Text>
												<Text style={{ color: SWATheam.SwaBlack }}>Total Marks : {item.totalMarks}</Text>
											</View>
											<View style={styles.rowList}>
												<Text style={{ color: SWATheam.SwaBlack }}>Percentage</Text>
												<Text style={{ color: SWATheam.SwaBlack }}>{item.percentage}</Text>
											</View>
										</>
										: ""}
									<View style={styles.rowList}>
										<Text style={{ color: SWATheam.SwaBlack }}>Total Questions</Text>
										<Text style={{ color: SWATheam.SwaBlack }}>{item.noOfQuestion}</Text>
									</View>
									<View style={styles.rowList}>
										<Text style={{ color: SWATheam.SwaBlack }}>Status</Text>
										{attemptIds !== 0 ?
											<>
												<TouchableOpacity style={styles.btnsStatus_2}>
													<Text style={[styles.statusP, { color: "#fff" }]}>Completed</Text>
												</TouchableOpacity>
											</>
											: <TouchableOpacity style={styles.btnsStatus}>
												<Text style={[styles.statusP, { color: SWATheam.SwaBlack }]}>Pending</Text>
											</TouchableOpacity>}

									</View>
									<Text style={styles.statusText}>Action</Text>
									{item.endDate < todayDate && attemptIds === 0 ?
										<TouchableOpacity style={[styles.btnsStatus_3, { width: "50%", alignSelf: 'center' }]}>
											<Text style={[styles.statusP, { color: "#fff" }]}>Assessment Expired</Text>
										</TouchableOpacity>
										: ""}

									{item.endDate >= todayDate && attemptIds === 0 ?
										<TouchableOpacity
											style={[styles.btnsStatus_4, { width: "50%", alignSelf: 'center' }]}
											onPress={() => { attemptWaiting(item), navigation.navigate('AttemptHolder', { "assId": item.assessmentID }) }}
										>
											<Text
												style={[styles.statusP, { color: SWATheam.SwaBlack }]}>Attempt Waiting</Text>
										</TouchableOpacity>
										: ""
									}
									{attemptIds === 1 ?
										<View style={styles.rowList}>
											<TouchableOpacity style={styles.buttonStatus}>
												<Text style={[styles.textInner, { backgroundColor: "#0ca279" }]}>Attempted</Text>
											</TouchableOpacity>
											{item.resultDeclareStatus == 1 ?
												<TouchableOpacity style={styles.buttonStatus}
													onPress={() => { viewResult(item) }}>
													<Text style={styles.textInner}>View Result</Text>
												</TouchableOpacity> :
												<View style={styles.buttonStatus}>
													<Text style={styles.textInner}>Result Awaited</Text>
												</View>
											}
											{item.resultDeclareStatus == 1 &&
												<TouchableOpacity style={styles.buttonStatus} onPress={() => { viewReport(item) }}>
													<Text style={styles.textInner}>View Report</Text>
												</TouchableOpacity>

											}
										</View>
										: ""}
									{item.solutionSheet != null ?
										<TouchableOpacity style={{ width: 200, padding: 6, backgroundColor: userData.data.colors.mainTheme, borderRadius: 10, alignSelf: 'center' }} onPress={() => { viewsheets(item) }}>
											<Text style={styles.textInner}>Check Your Answer Sheets</Text>
										</TouchableOpacity> : null
									}
								</View>
							)
						})}

					</ScrollView>
				</View>

				{loader && <Loader />}

				{result && !loader ? (
					<View style={{ flex: 1, height: 20 }}>
						<Modal animationType="slide">
							<View style={styles.resultHeader}>
								<Text style={{ color: "#fff" }}>Result</Text>
								<TouchableOpacity style={styles.closeIcons} onPress={closeResult}>
									<Icon name="close" size={20} color="#fff" />
								</TouchableOpacity>
							</View>
							<View style={styles.headerDetails}>
								<Text style={styles.assName}>
									Assessment Name : {studentDetails?.assessmentName}
								</Text>
								<View style={styles.rowDetails}>
									<View>
										<Text style={styles.textLeft}>Class: {userData.data.className} </Text>
										<Text style={styles.textLeft}>
											Name: {studentDetails?.firstName}
										</Text>
										<Text style={styles.textLeft}>
											Date: {studentDetails?.attemptDate}
										</Text>
									</View>
									<View>
										<Text style={styles.textRight}>
											Subject: {studentDetails?.subjectName}
										</Text>
										<Text style={styles.textRight}>
											Total Marks: {studentDetails?.totalMarks}
										</Text>
										<Text style={styles.textRight}>
											Marks Obtained: {studentDetails?.obtainedMarks}
										</Text>
									</View>
								</View>
							</View>
							<View style={styles.holderBox}>
								<ScrollView>
									{resultData.map((item, index) => {
										const correctAns = item.answerText.replace(/\s/g, "");
										const yourAns = item.userAnsText.replace(/\s/g, "");

										return (
											<View key={item.id}>
												{item.activityID == 1 ||
													item.activityID == 9 ||
													item.activityID == 10 ||
													item.activityID == 12 ||
													item.activityID == 3 ||
													item.activityID == 15 ? (
													<View style={styles.boxQuest} >
														<View style={styles.statusView}>
															<Text style={styles.questNums}>Q. {index + 1}</Text>
															<Text style={{ fontWeight: "bold", color: SWATheam.SwaBlack }}>
																Marks : {item.marksPerQuestion}
															</Text>
														</View>
														<View style={styles.rowBorder}>
															<Text style={styles.textHeading}>
																Correct Answer
															</Text>
															<Text style={styles.textHeading}>{correctAns}</Text>
														</View>
														<View style={styles.rowBorder}>
															<Text style={styles.textHeading}>Your Answer</Text>
															{yourAns ? (
																<Text style={styles.textHeading}>{yourAns}</Text>
															) : (
																<Text style={styles.textHeading}>
																	... ... ... ... ... ...
																</Text>
															)}
														</View>
														<View style={styles.statusView2}>
															<Text style={styles.textHeading}>
																Obtained Marks
															</Text>
															<Text style={styles.obtaimMarks}>
																{item.obtainedMarks}
															</Text>
														</View>
													</View>
												) : item.activityID == 2 || item.activityID == 4 ? (
													<View style={styles.boxQuest}>
														<View style={styles.statusView}>
															<Text style={styles.questNums}>Q. {index + 1}</Text>
															<Text style={{ fontWeight: "bold" }}>
																Marks : {item.marksPerQuestion}
															</Text>
														</View>

														<View style={styles.statusView2}>
															<Text style={styles.textHeading}>
																Obtained Marks
															</Text>
															<Text style={styles.obtaimMarks}>
																{item.obtainedMarks}
															</Text>
														</View>
														{item.activityID == 2 ? (
															<Text style={styles.typeAct}>TNF</Text>
														) : (
															<Text style={styles.typeAct}>Matching</Text>
														)}
													</View>
												) : null}
											</View>
										);
									})}
								</ScrollView>
							</View>
						</Modal>
					</View>
				) : null}




			</View>
			{
				reportData.status &&
				<AssessmentReport reportData={reportData} closeModal={closeModal} colorSwa={userData.data.colors.mainTheme} />
			}

			{uploadSheets.status ?
				<Modal
					animationType="slide"
					transparent={true}
				>
					<View style={styles.garyContainer}>
						<TouchableOpacity style={{ flex: 1 }} />
						<View style={{ backgroundColor: SWATheam.SwaWhite, borderRadius: 10 }}>
							<View style={{ borderBottomWidth: 1, padding: 10 }}>
								<Text style={{ color: SWATheam.SwaBlack, fontWeight: "500", textAlign: 'center', textTransform: 'uppercase' }}> Uploaded Answer Sheets</Text>
							</View>
							{uploadSheets.isValidateByExaminer != 1 ?
								<Text style={{ padding: 10, color: SWATheam.SwaRed }}>Your uploaded answersheet is pending to validate by teacher. Reports and answersheet will be updated after teacher validation.</Text> : null
							}
							<View style={{ padding: 10, backgroundColor: SWATheam.SwaGray, }}>
								<ScrollView horizontal>
									{uploadSheets.data.map((item, index) => {
										return (
											<View style={{ width: 250, height: 200, backgroundColor: SWATheam.SwaWhite, borderWidth: 1, borderColor: SWATheam.SwaWhite, marginHorizontal: 10 }} key={index}>
												<View style={{ backgroundColor: userData.data.colors.liteTheme, padding: 10, borderBottomWidth: 1, overflow: 'hidden' }}>
													<Text style={{ color: SWATheam.SwaBlack }}>Page - {index + 1} </Text>
												</View>
												<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
													<Image source={{ uri: uploadSheets.imgUrl + '/' + item }} style={{ width: "100%", height: "100%", resizeMode: 'contain', borderWidth: 1, }} />
												</View>

											</View>

										)

									})}
								</ScrollView>
							</View>
							<View style={{ backgroundColor: SWATheam.SwaWhite, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}>
								<TouchableOpacity style={{ width: 100, backgroundColor: userData.data.colors.mainTheme, padding: 10, borderRadius: 8 }} onPress={() => { closePopup() }}>
									<Text style={{ color: SWATheam.SwaWhite, fontWeight: '500', textAlign: 'center' }}>Close</Text>
								</TouchableOpacity>

							</View>


						</View>
						<TouchableOpacity style={{ flex: 1 }} />
					</View>
				</Modal> : null
			}
		</>

	);
}
const styles = StyleSheet.create({
	garyContainer: {
		flex: 1,
		padding: 10,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
	},
	typeAct: {
		fontSize: 13,
		marginLeft: 6,
		color: SWATheam.SwaBlack,
	},
	questNums: {
		fontWeight: "bold",
		color: SWATheam.SwaBlack,
		fontSize: 15,
	},
	obtaimMarks: {
		fontWeight: "bold",
		color: SWATheam.SwaRed,
		fontSize: 15,
	},
	statusView: {
		borderBottomWidth: 1,
		borderColor: "#cfe2f3",
		padding: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	statusView2: {
		padding: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},

	rowBorder: {
		borderBottomWidth: 1,
		borderColor: "#cfe2f3",
		padding: 5,
	},
	textHeading: {
		marginTop: 5,
		fontSize: 15,
		color: SWATheam.SwaBlack
	},
	boxQuest: {
		borderWidth: 1,
		padding: 10,
		borderColor: "#afdaa9",
		margin: 5,
		borderRadius: 5,
		elevation: 3,
		backgroundColor: "#fff",
	},
	textLeft: {
		marginBottom: 5,
		color: SWATheam.SwaBlack
	},
	holderBox: {
		backgroundColor: "#fff",
		padding: 10,
		margin: 0,
		borderRadius: 10,
		flex: 1,
	},
	assName: {
		textAlign: "center",
		fontWeight: "bold",
		borderBottomWidth: 1,
		borderColor: "#eeeeef",
		padding: 5,
		color: SWATheam.SwaBlack,
		width: "100%",
	},
	textRight: {
		textAlign: "right",
		marginBottom: 5,
		color: SWATheam.SwaBlack
	},
	rowDetails: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	closeIcons: {
		borderWidth: 1,
		paddingHorizontal: 5,
		borderColor: "#fff",
		borderRadius: 5,
	},
	headerDetails: {
		elevation: 5,
		backgroundColor: "#f8f9fe",
		padding: 10,
	},

	resultHeader: {
		backgroundColor: SWATheam.SwaGreen,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 7,
	},
	headerAss: {
		backgroundColor: "#fff",
		elevation: 5,
	},
	asslistText: {
		color: "#000",
		marginBottom: 5,
		textAlign: "center",
		margin: 15,
		fontSize: 15,
		fontWeight: "bold",
	},
	holder: {
		borderWidth: 1,
		borderColor: "#8bb4ff",
		padding: 15,
		margin: 10,
		borderRadius: 20,
		backgroundColor: "#fff",
		elevation: 5,
	},
	rowList: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomColor: "#b2d8d8",
		borderBottomWidth: 1,
		paddingBottom: 7,
		marginBottom: 7,
		alignItems: "center",
	},
	resultBold: {
		fontWeight: "bold",
		paddingBottom: 5,
		color: "green",
	},
	btnsStatus: {
		backgroundColor: "#e9d700",
		padding: 3,
		width: 100,
		borderRadius: 20,
	},
	btnsStatus_2: {
		backgroundColor: "#115852",
		padding: 3,
		width: 100,
		borderRadius: 20,
	},
	btnsStatus_3: {
		backgroundColor: "red",
		padding: 3,
		width: 100,
		borderRadius: 20,
	},
	btnsStatus_4: {
		backgroundColor: "white",
		padding: 3,
		width: 100,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#228b22",
		elevation: 3,
	},
	statusP: {
		textAlign: "center",
	},
	statusText: {
		textAlign: "center",
		fontWeight: "bold",
		marginBottom: 5,
	},
	buttonStatus: {
		backgroundColor: "#228b22",
		width: 110,
		padding: 3,
		borderRadius: 7,
	},
	textInner: {
		textAlign: "center",
		color: "#fff",
	},
});
