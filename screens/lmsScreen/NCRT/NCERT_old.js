import { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Modal, Button, TextInput, TouchableOpacity, Image, ScrollView, useWindowDimensions } from 'react-native';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import SwaHeader from '../../common/SwaHeader';
import { GlobleData } from '../../../Store';
import { SwaTheam, apiRoot } from '../../../constant/ConstentValue';
import Services from '../../../Services';
import RenderHtml from 'react-native-render-html';
import Loader from '../../common/Loader';

export default function NCERT({ navigation, route }) {
	const { width } = useWindowDimensions();
	const { userData } = useContext(GlobleData)

	const tagsStyles = {
		body: {
			fontSize: 17,
			color: SwaTheam.SwaBlack,
			flexShrink: 1
		},
		p: {
			fontSize: 17,
			color: SwaTheam.SwaBlack,
			flexShrink: 1
		}
	};

	console.log(userData, 'userData')

	console.log(JSON.stringify(route.params.selectedField), 'check route')
	useEffect(() => {
		getSubjectListFun();
	}, [])
	const apiBaseUrl = "https://swaadhyayan.com/lmsv2/api/";
	const ApiToken = "=4WY5FWeoRWYhd3c";
	const schoolCode = "SWASCH1";
	const clsId = 5;
	const userRefID = 514
	const [popView, setPopView] = useState({
		subjectPop: false,
	})
	const [showBookList, setShowBookList] = useState(false)
	const [booksList, setBookList] = useState([])
	const [getSubId, setgetSubId] = useState()

	const [chapterHolder, setChapterHolder] = useState(true);
	const [question, setQuestion] = useState()
	const [totalQuest, setTotalQuest] = useState(0)
	const [selectedIds, setSelectedIds] = useState([]);
	const [attemptScreen, setAttemptScreen] = useState(false)
	const [startPoint, setStartPoint] = useState(1)
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [act, setAct] = useState();
	const [areYouSure, setAreYouSure] = useState(false);
	const [allReportData, setallReportData] = useState([]);
	const [loader, setLoaders] = useState(false);
	const [startingTestData, setstartingTestData] = useState({
		qSetIds: '',
		testTypesIds: ''
	})
	const chapterList = route.params.data
	const [showActBytype, setshowActBytype] = useState({
		mcqActy: false,
		FillUp: false,
		TNF: false,
	})
	const ImgBase = 'https://swaadhyayan.com/data/';
	function sltSubject() {
		setPopView((old) => {
			return {
				...old, subjectPop: true,
			}
		})
	}

	function onClickLeftIcon() {
		navigation.goBack()
	}
	function onClickRightIcon() {
		setIsInstruction(true)
	}

	// subject List Acco To Class ID start func
	const [getSubjectList, setSubjectList] = useState([]);
	function getSubjectListFun() {
		const postData = {
			"classID": clsId
		}
		fetch(apiBaseUrl + 'getNcertSubjectOfClass', {
			method: "POST",
			body: JSON.stringify(postData),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'API-TOKEN': ApiToken
			}
		})
			.then(response => response.json())
			.then((subjectListData) => {
				if (subjectListData.status == "success") {
					setSubjectList(subjectListData.data);
					setShowBookList(true)
				} else {
					alert("no")
				}
			})
			.catch(error => console.error(error));
	}
	// subject List Acco To Class ID start end
	// books
	const [bIds, setbIds] = useState('');
	function bookButton(item) {
		let bookIds = item.bookID
		setbIds(bookIds);
		const postData = {
			"classID": clsId,
			"subjectID": getSubId,
			"schoolCode": schoolCode,
			"bookID": bookIds
		}
		fetch(apiBaseUrl + 'getChapterOfNcertBook', {
			method: "POST",
			body: JSON.stringify(postData),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'API-TOKEN': ApiToken
			}
		})
			.then(response => response.json())
			.then((chapterData) => {
				if (chapterData.status == "success") {
					setChapterHolder(true)
					setchapterList(chapterData.chapData)
				} else {
					setChapterHolder(false)
				}
			})
			.catch(error => console.error(error));
	}
	// books
	const [showStatusView, setshowView] = useState({
		showMs: "",
		outerBox: false,
	})

	function chapterFun(item) {
		const chapIds = item.chapterID;

		if (selectedIds.includes(chapIds)) {
			setSelectedIds(selectedIds.filter(item => item !== chapIds));
		} else {
			setSelectedIds([...selectedIds, chapIds]);
		}
	}
	function startAssessment() {
		setLoaders(true)

		const NcrtIds = selectedIds.join(', ');
		const postData = {
			"classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? route.params.selectedField.class.classID : userData.data.classID,
			"subjectID": route.params.selectedField.subject.subjectID,
			"schoolCode": userData.data.schoolCode,
			"ncertChapterIDs": NcrtIds,
			"userRefID": userData.data.userRefID
		}
		Services.post(apiRoot.getNcertExamQuestion, postData)
			.then((res) => {
				if (res.status == "success") {
					setLoaders(false)
					setQuestion(res.ncertQuestion[0]?.questionData)
					let setIds = res.ncertQuestion[0]?.qSetID;
					let testTyp = res.ncertQuestion[0]?.testTypeID;
					setstartingTestData((p) => {
						return { ...p, qSetIds: setIds, testTypesIds: testTyp }
					})
					let dd = res.ncertQuestion[0]?.questionData;
					let ans = Array(dd.length);
					for (let i = 0; i < ans.length; i++) {
						ans[i] = {};
					}

					setStoreData(ans)
					setTotalQuest(dd.length);
					const getType = dd[currentQuestionIndex].activityID;
					setAct(getType);
					setAttemptScreen(true);
				} else {
					setLoaders(false)
					alert(res.message)
					setAttemptScreen(false)
				}
			})
			.catch((err) => {
				console.log(err)
				setLoaders(false)
			})
			.finally(() => {
				setLoaders(false)
			})

	}

	// atempt 
	const [qIds, setQids] = useState([])
	const handleNext = () => {
		setCurrentQuestionIndex(currentQuestionIndex + 1);
		setStartPoint(startPoint + 1);
		setQids(question[currentQuestionIndex].questionID)
	};
	const handlePrevious = () => {
		setCurrentQuestionIndex(currentQuestionIndex - 1);
		setStartPoint(startPoint - 1)

	};

	// array Data
	const [currentArray, setcurrentArray] = useState(0)

	const [storeData, setStoreData] = useState([])
	const onchangeGetData = (index, value, option) => {
		setStoreData(prevState => {
			const updatedValues = [...prevState];
			updatedValues[index] = { ...updatedValues[index], [option]: value };
			return updatedValues;
		});
		FinalSubmitData();
	};
	const [finalPost, setFinalPost] = useState([]);


	// attemptData data functions
	const attemptData = (questionData) => {
		const thisData = [];
		const prevData = finalPost;
		prevData.map((item) => {
			thisData.push(item);
		});

		let reAttempt = 0;
		thisData.map((item, index) => {
			if (questionData.questionID == item.questionID) {
				reAttempt = 1;
				thisData[index] = questionData;
			}
		});

		if (!reAttempt) {
			thisData.push(questionData);
		}
		// console.log(thisData, 'thisdata')
		setFinalPost(thisData);
		// console.log(finalPost, 'final')

	}
	// attemptData data functions

	function FinalSubmitData() {
		let Qids = question[currentQuestionIndex].questionID;
		let correctOpText = question[currentQuestionIndex].answerText;
		let marks = question[currentQuestionIndex].marks;
		let actIds = question[currentQuestionIndex].activityID;
		const optionText1 = storeData[currentQuestionIndex]?.optionText1;
		const optionText2 = storeData[currentQuestionIndex]?.optionText2;
		const optionText3 = storeData[currentQuestionIndex]?.optionText3;
		const optionText4 = storeData[currentQuestionIndex]?.optionText4;
		const mergedVariable = `${optionText1},${optionText2},${optionText3},${optionText4}`;
		const Fdata = {
			"questionID": Qids,
			'chouseOptID': 0,
			"chouseOptText": mergedVariable,
			"correctOptText": correctOpText,
			"questionMarks": marks,
			"getMarks": marks,
			"correctAnswerID": 0,
			"selectedAnswerID": 0,
			"attemptStatus": "1",
			"userRefID": userRefID,
			"testTypeID": startingTestData.testTypesIds,
			"qSetID": startingTestData.qSetIds,
			"activityID": actIds
		};
		attemptData(Fdata);
	}

	// mcq function start from here
	const [selectedOptions, setSelectedOptions] = useState({
		qOpt: '',
		crtQiDs: '',

	})

	function mcqClicked(ids, asd, optText) {
		let selctOptText = optText
		let selectedIds = ids
		let Qids = question[currentQuestionIndex].questionID;
		let correctOpText = question[currentQuestionIndex].answerText;
		let marks = question[currentQuestionIndex].marks;
		let actIds = question[currentQuestionIndex].activityID;
		let corrrectAnsIds = question[currentQuestionIndex].answerID;
		setSelectedOptions((pre) => {
			return { ...pre, qOpt: ids, crtQiDs: asd }
		})
		const mcqDataHolder = {
			"questionID": Qids,
			"chouseOptText": selctOptText,
			"correctOptText": correctOpText,
			"questionMarks": marks,
			"getMarks": corrrectAnsIds == selectedIds ? 1 : 0,
			"correctAnswerID": corrrectAnsIds,
			"selectedAnswerID": selectedIds,
			"attemptStatus": "1",
			"userRefID": userRefID,
			"testTypeID": startingTestData.testTypesIds,
			"qSetID": startingTestData.qSetIds,
			"activityID": actIds
		}

		attemptData(mcqDataHolder);

	}

	// console.log(finalPost, "_")



	// submit final attempt start
	function closeReportHolder() {
		setholderRepo((rep) => {
			return { ...rep, holderSuccess: false }
		})
	}
	const [holderRepo, setholderRepo] = useState({
		holderSuccess: false,
		successMsg: "",
		runTimeQsetIds: "",
	})
	function submitAss() {
		setAreYouSure(true)
	}
	function submitAssessment(act) {
		if (act == 1) {
			fetch(apiBaseUrl + 'submitNcertExamAttempt', {
				method: "POST",
				body: JSON.stringify({
					finalAttemptData: finalPost
				}),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'API-TOKEN': ApiToken
				}
			})
				.then(response => response.json())
				.then((finalAssess) => {
					if (finalAssess.status == "success") {
						setAreYouSure(false)
						setholderRepo((pre) => {
							return {
								...pre,
								holderSuccess: true,
								successMsg: finalAssess.msg,
								runTimeQsetIds: finalAssess.qSetID
							}
						})
					} else {
						alert("no ok");
					}
				})
				.catch(error => console.error(error));
		} else {
			setAreYouSure(false)
		}
	}

	// submit final attempt end

	// tnf functions start here 



	function tnfAction(optIDS, answer, crtq) {
		const curreIn = crtq
		let currentAns = finalPost.filter(item => item.questionID == curreIn.questionID)[0];
		console.log(currentAns, 'curr');



		let marks = question[currentQuestionIndex].marks;
		let actIds = question[currentQuestionIndex].activityID;

		const newData = `${optIDS}-${answer}`;
		let selectedOption = newData;
		if (currentAns != undefined) {
			let tnfArray = currentAns.selectedAnswerID.split(",");
			// let currOpt = optIDS;
			let index = -1;
			for (let i = 0; i < tnfArray.length; i++) {
				let optId = tnfArray[i].split("-")[0];
				if (optId == optIDS) {
					index = i;
					break;
				}
			}
			if (index != -1) {

				tnfArray[index] = newData;
			} else {
				tnfArray.push(newData);

			}
			selectedOption = tnfArray.join(",");
		}

		// if (!reAttempt) {
		// 	TnfSelctedData.push(newData);
		// }
		const TnfPayLoad = {
			"questionID": question[currentQuestionIndex].questionID,
			"chouseOptID": selectedOption,
			"chouseOptText": '0',
			"correctOptText": "0",
			"questionMarks": marks,
			"getMarks": marks,
			"correctAnswerID": '  ',
			"selectedAnswerID": selectedOption,
			"attemptStatus": "1",
			"userRefID": userRefID,
			"testTypeID": startingTestData.testTypesIds,
			"qSetID": startingTestData.qSetIds,
			"activityID": actIds
		}
		console.log(TnfPayLoad, "*-7")
		attemptData(TnfPayLoad);
	}
	// console.log(ActiveBtns)

	let currentAns = finalPost.filter(item => item.questionID == question[currentQuestionIndex].questionID)[0];
	let currOption = {};
	if (currentAns != undefined && question[currentQuestionIndex].activityID == 2) {
		ansArray = currentAns.selectedAnswerID.split(",");
		for (let ans of ansArray) {
			let arr = ans.split("-");
			currOption[arr[0]] = arr[1];
		}
	}



	// report 
	const [getReport, setreport] = useState([])
	const [reportDat, setReportData] = useState({
		attemptSuccess: true,
		totalMarks: '',
		optainedMarks: '',
		preSent: '',
		afterClickView: false,
		reportList: false
	})

	function viewReportSecond(item) {
		let setIds = item.qSetID
		const xdata = {
			"qSetID": setIds
		}
		fetch(apiBaseUrl + 'studentNcertViewReport', {
			method: "POST",
			body: JSON.stringify(xdata),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'API-TOKEN': ApiToken
			}
		})
			.then(response => response.json())
			.then((finalAssess) => {
				if (finalAssess.status == "success") {
					setreport(finalAssess.data.reportData);
					let total = finalAssess.data.totalMarks;
					let opten = finalAssess.data.optainedMarks;
					let present = finalAssess.data.percentage;
					let totlPresent = parseFloat(present.toFixed(2));
					setReportData((pre) => {
						return {
							...pre,
							totalMarks: total,
							optainedMarks: opten,
							preSent: totlPresent,
							attemptSuccess: false,
							afterClickView: true,
							reportList: false,
						}
					})
					// alert("ok");
				} else {
					alert("no ok");
				}
			})
			.catch(error => console.error(error));
	}

	function viewReport() {
		const xdata = {
			"qSetID": startingTestData.qSetIds
		}
		fetch(apiBaseUrl + 'studentNcertViewReport', {
			method: "POST",
			body: JSON.stringify(xdata),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'API-TOKEN': ApiToken
			}
		})
			.then(response => response.json())
			.then((finalAssess) => {
				if (finalAssess.status == "success") {
					setreport(finalAssess.data.reportData);
					let total = finalAssess.data.totalMarks;
					let opten = finalAssess.data.optainedMarks;
					let present = finalAssess.data.percentage;
					let totlPresent = parseFloat(present.toFixed(2));
					setReportData((pre) => {
						return {
							...pre,
							totalMarks: total,
							optainedMarks: opten,
							preSent: totlPresent,
							attemptSuccess: false,
							afterClickView: true,
						}
					})
					// alert("ok");
				} else {
					alert("no ok");
				}
			})
			.catch(error => console.error(error));
	}

	// action views 
	const [getquest, setGetQuest] = useState()
	const [actData, setActData] = useState({
		modelHolder: false,
		showQuestActId: ""
	})
	function hideExamQuest() {
		setActData((old) => {
			return { ...old, modelHolder: false }
		})
	}
	function viewAction(item) {

		let allItem = item
		setGetQuest(allItem)
		setActData((old) => {
			return {
				...old,
				modelHolder: true,
				showQuestActId: item.activityID
			}
		})

	}
	function allAttemReport() {
		setLoaders(true)
		const aData = {
			"userRefID": userRefID
		}
		fetch(apiBaseUrl + 'studentAllNcertAttemptReport', {
			method: "POST",
			body: JSON.stringify(aData),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'API-TOKEN': ApiToken
			}
		})
			.then(response => response.json())
			.then((atmtData) => {
				if (atmtData.status == "success") {
					setallReportData(atmtData.data);
					setLoaders(false)
					setReportData((s) => {
						return {
							...s,
							afterClickView: false,
							reportList: true,
						}
					})
				} else {
					alert("no ok");
				}
			})
			.catch(error => console.error(error));

	}
	return (
		<View style={{ flex: 1, marginTop: 24 }}>
			{!attemptScreen &&
				<SwaHeader title={"NCERT"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
			}
			{/* show sms view */}
			{showStatusView.outerBox &&
				<View style={styles.modelScreen}>
					<View style={styles.statusView}>
						<Text>{showStatusView.showMs}</Text>
					</View>
				</View>
			}
			{/* show sms view */}

			{/* chaoter list */}
			{attemptScreen ?
				<View style={{ flex: 1, backgroundColor: SwaTheam.SwaWhite }}>
					<View style={styles.headerAsse}>
						<Text style={styles.booknameHeading}>NCRT EXAM TEST</Text>
						<View style={styles.rowView}>
							<View style={styles.rowForTExt}>
								<Text style={styles.textSmall}>Total Questions : {totalQuest}</Text>
								<Text style={styles.textSmall}>Attempted Questions : {startPoint}</Text>
							</View>
						</View>
					</View>
					{/* question Views Holders start */}
					<View style={styles.questHolders}>
						<View>
							{question[currentQuestionIndex].activityID == 1
								? <View>
									<RenderHtml
										contentWidth={width}
										source={{ html: question[currentQuestionIndex].questionPart1 }}
										tagsStyles={tagsStyles}
									/>

									<View style={styles.optionsView}>
										{question[currentQuestionIndex]?.optionText1 ?

											<TouchableOpacity
												onPress={() => {
													mcqClicked(
														question[currentQuestionIndex].optionID1,
														question[currentQuestionIndex].questionID,
														question[currentQuestionIndex].optionText1,
													)
												}}
												style={[styles.textWithInput, ({ backgroundColor: currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID1 ? '#90ee90' : '#e6e6fa' })]}>
												<>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(a)</Text>
														{question[currentQuestionIndex]?.optionText1.endsWith('.png') || question[currentQuestionIndex]?.optionText1.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText1 }} style={{ width: 50, height: 50 }} />
															:
															<RenderHtml
																contentWidth={width}
																source={{ html: question[currentQuestionIndex]?.optionText1 }}
																tagsStyles={tagsStyles}
															/>
														}
													</View>
												</>
											</TouchableOpacity>
											: ''}
										{question[currentQuestionIndex]?.optionText2 ?
											<TouchableOpacity
												onPress={() => {
													mcqClicked(
														question[currentQuestionIndex].optionID2,
														question[currentQuestionIndex].questionID,
														question[currentQuestionIndex].optionText2,
													)
												}}
												style={[styles.textWithInput, ({ backgroundColor: currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID2 ? '#90ee90' : '#e6e6fa' })]}>

												<>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(b)</Text>
														{question[currentQuestionIndex]?.optionText2.endsWith('.png') || question[currentQuestionIndex]?.optionText2.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText2 }} style={{ width: 50, height: 50 }} />
															:
															<RenderHtml
																contentWidth={width}
																source={{ html: question[currentQuestionIndex]?.optionText2 }}
																tagsStyles={tagsStyles} />
														}
													</View>
												</>
											</TouchableOpacity>
											: ''}
										{question[currentQuestionIndex]?.optionText3 ?
											<TouchableOpacity
												onPress={() => {
													mcqClicked(
														question[currentQuestionIndex].optionID3,
														question[currentQuestionIndex].questionID,
														question[currentQuestionIndex].optionText3,
													)
												}}
												style={[styles.textWithInput, ({ backgroundColor: currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID3 ? '#90ee90' : '#e6e6fa' })]}>

												<>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(c)</Text>
														{question[currentQuestionIndex]?.optionText3.endsWith('.png') || question[currentQuestionIndex]?.optionText3.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText3 }} style={{ width: 50, height: 50 }} />
															:
															<RenderHtml
																contentWidth={width}
																source={{ html: question[currentQuestionIndex]?.optionText3 }}
																tagsStyles={tagsStyles} />
														}
													</View>
												</>
											</TouchableOpacity>
											: ''}
										{question[currentQuestionIndex]?.optionText4 ?
											<TouchableOpacity
												onPress={() => {
													mcqClicked(
														question[currentQuestionIndex].optionID4,
														question[currentQuestionIndex].questionID,
														question[currentQuestionIndex].optionText4,
													)
												}}
												style={[styles.textWithInput, ({ backgroundColor: currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID4 ? '#90ee90' : '#e6e6fa' })]}>

												<>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(d)</Text>
														{question[currentQuestionIndex]?.optionText4.endsWith('.png') || question[currentQuestionIndex]?.optionText4.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText4 }} style={{ width: 50, height: 50 }} />
															:
															<RenderHtml
																contentWidth={width}
																source={{ html: question[currentQuestionIndex]?.optionText4 }}
																tagsStyles={tagsStyles} />
														}
													</View>
												</>
											</TouchableOpacity>
											: ''}
									</View>
								</View>
								: question[currentQuestionIndex].activityID == 3
									? <>
										<View>
											<RenderHtml
												contentWidth={width}
												source={{ html: question[currentQuestionIndex].questionPart1 }}
												tagsStyles={tagsStyles}
											/>
											<View style={styles.optionsView}>
												{question[currentQuestionIndex]?.optionText1 ?

													<View style={styles.textWithInput}>
														<>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(a)</Text>
																{question[currentQuestionIndex]?.optionText1.endsWith('.png') || question[currentQuestionIndex]?.optionText1.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText1 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText1 }}
																		tagsStyles={tagsStyles} />
																}
															</View>
															<View>
																<TextInput
																	value={storeData[currentQuestionIndex]?.optionText1 ? storeData[currentQuestionIndex]?.optionText1 : ""}
																	onChangeText={(text) => onchangeGetData(currentQuestionIndex, text, 'optionText1')}
																	style={styles.inputs} placeholder="" />
															</View>
														</>
													</View>
													: ''}
												{question[currentQuestionIndex]?.optionText2 ?
													<View style={styles.textWithInput}>
														<>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(b)</Text>
																{question[currentQuestionIndex]?.optionText2.endsWith('.png') || question[currentQuestionIndex]?.optionText2.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText2 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText2 }}
																		tagsStyles={tagsStyles} />
																}
															</View>
															<View>
																<TextInput
																	value={storeData[currentQuestionIndex]?.optionText2 ? storeData[currentQuestionIndex]?.optionText2 : ""}
																	onChangeText={(text) => onchangeGetData(currentQuestionIndex, text, 'optionText2')}
																	style={styles.inputs} placeholder="" />
															</View>
														</>
													</View>
													: ''}
												{question[currentQuestionIndex]?.optionText3 ?
													<View style={styles.textWithInput}>
														<>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(c)</Text>
																{question[currentQuestionIndex]?.optionText3.endsWith('.png') || question[currentQuestionIndex]?.optionText3.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText3 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText3 }}
																		tagsStyles={tagsStyles} />
																}
															</View>
															<View>
																<TextInput
																	value={storeData[currentQuestionIndex]?.optionText3 ? storeData[currentQuestionIndex]?.optionText3 : ""}
																	onChangeText={(text) => onchangeGetData(currentQuestionIndex, text, 'optionText3')}
																	style={styles.inputs} placeholder="" />
															</View>
														</>
													</View>
													: ''}
												{question[currentQuestionIndex]?.optionText4 ?
													<View style={styles.textWithInput}>
														<>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(d)</Text>
																{question[currentQuestionIndex]?.optionText4.endsWith('.png') || question[currentQuestionIndex]?.optionText4.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText4 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText4 }}
																		tagsStyles={tagsStyles} />
																}
															</View>
															<View>
																<TextInput
																	value={storeData[currentQuestionIndex]?.optionText4 ? storeData[currentQuestionIndex]?.optionText4 : ""}
																	onChangeText={(text) => onchangeGetData(currentQuestionIndex, text, 'optionText4')}
																	style={styles.inputs} placeholder="" />
															</View>
														</>
													</View>
													: ''}
											</View>
										</View>
									</>
									: question[currentQuestionIndex].activityID == 2
										? <View>
											<Text style={styles.questionHeading}>{question[currentQuestionIndex].questionPart1}</Text>
											<View style={styles.optionsView}>
												{question[currentQuestionIndex]?.optionText1 ?

													<View style={styles.textWithInput}>
														<>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(a)</Text>
																{question[currentQuestionIndex]?.optionText1.endsWith('.png') || question[currentQuestionIndex]?.optionText1.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText1 }} style={{ width: 50, height: 50 }} />
																	:

																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText1 }}
																		tagsStyles={tagsStyles} />

																}
															</View>
															<View style={styles.buttonRows}>
																{
																	<>
																		<TouchableOpacity
																			onPress={() => { tnfAction(1, 1, question[currentQuestionIndex]) }}
																			style={[styles.btnTNF, ({ backgroundColor: currOption["1"] == 1 ? '#adff2f' : "" })]} >
																			<Text>True</Text>
																		</TouchableOpacity>

																		<TouchableOpacity
																			onPress={() => { tnfAction(1, 2, question[currentQuestionIndex]) }}
																			style={[styles.btnTNF, ({ backgroundColor: currOption["1"] == 2 ? '#adff2f' : "" })]} >
																			<Text>False</Text>
																		</TouchableOpacity>
																	</>
																}
															</View>
														</>
													</View>
													: ''}
												{question[currentQuestionIndex]?.optionText2 ?
													<View style={styles.textWithInput}>
														<>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(b)</Text>
																{question[currentQuestionIndex]?.optionText2.endsWith('.png') || question[currentQuestionIndex]?.optionText2.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText2 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText2 }}
																		tagsStyles={tagsStyles} />
																}
															</View>
															<View style={styles.buttonRows}>
																{
																	<>
																		<TouchableOpacity
																			onPress={() => { tnfAction(2, 1, question[currentQuestionIndex]) }}
																			style={[styles.btnTNF, ({ backgroundColor: currOption["2"] == 1 ? '#adff2f' : "" })]} >
																			<Text>True</Text>
																		</TouchableOpacity>

																		<TouchableOpacity
																			onPress={() => { tnfAction(2, 2, question[currentQuestionIndex]) }}
																			style={[styles.btnTNF, ({ backgroundColor: currOption["2"] == 2 ? '#adff2f' : "" })]} >
																			<Text>False</Text>
																		</TouchableOpacity>
																	</>
																}
															</View>
														</>
													</View>
													: ''}
												{question[currentQuestionIndex]?.optionText3 ?
													<View style={styles.textWithInput}>
														<>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(c)</Text>
																{question[currentQuestionIndex]?.optionText3.endsWith('.png') || question[currentQuestionIndex]?.optionText3.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText3 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText3 }}
																		tagsStyles={tagsStyles} />
																}
															</View>
															<View style={styles.buttonRows}>
																{
																	<>
																		<TouchableOpacity
																			onPress={() => { tnfAction(3, 1, question[currentQuestionIndex]) }}
																			style={[styles.btnTNF, ({ backgroundColor: currOption["3"] == 1 ? '#adff2f' : "" })]} >
																			<Text>True</Text>
																		</TouchableOpacity>

																		<TouchableOpacity
																			onPress={() => { tnfAction(3, 2, question[currentQuestionIndex]) }}
																			style={[styles.btnTNF, ({ backgroundColor: currOption["3"] == 2 ? '#adff2f' : "" })]} >
																			<Text>False</Text>
																		</TouchableOpacity>
																	</>
																}
															</View>
														</>
													</View>
													: ''}
												{question[currentQuestionIndex]?.optionText4 ?
													<View style={styles.textWithInput}>
														<>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(d)</Text>
																{question[currentQuestionIndex]?.optionText4.endsWith('.png') || question[currentQuestionIndex]?.optionText4.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText4 }} style={{ width: 50, height: 50 }} />
																	:
																	<Text
																		style={styles.optionsText}>
																		{question[currentQuestionIndex]?.optionText4}
																	</Text>
																}
															</View>
															<View style={styles.buttonRows}>
																{
																	<>
																		<TouchableOpacity
																			onPress={() => { tnfAction(4, 1, question[currentQuestionIndex]) }}
																			style={[styles.btnTNF, ({ backgroundColor: currOption["4"] == 1 ? '#adff2f' : "" })]} >
																			<Text>True</Text>
																		</TouchableOpacity>

																		<TouchableOpacity
																			onPress={() => { tnfAction(4, 2, question[currentQuestionIndex]) }}
																			style={[styles.btnTNF, ({ backgroundColor: currOption["4"] == 2 ? '#adff2f' : "" })]} >
																			<Text>True</Text>
																		</TouchableOpacity>
																	</>
																}
															</View>
														</>
													</View>
													: ''}
											</View>
										</View>
										: <Text>NOT Yet</Text>
							}
						</View>
					</View>
					{/* question Views Holders end */}
					{/* footer Sections start */}
					<View style={{
						position: "absolute",
						flexDirection: 'row',
						justifyContent: "space-between",
						alignItems: "center",
						bottom: 0,
						left: 0,
						backgroundColor: userData.data.colors.hoverTheme,
						padding: 5,
						width: '100%'
					}}>
						<View>
							<View style={styles.rowFristCol}>
								<Button title="Previous" color={userData.data.colors.mainTheme} onPress={handlePrevious} disabled={currentQuestionIndex === 0} />
								<View style={styles.buttonBox}>
									<Button title="Next" color={userData.data.colors.mainTheme} onPress={handleNext} disabled={currentQuestionIndex === question.length - 1} />
								</View>
							</View>
						</View>
						<View>
							{currentQuestionIndex === question.length - 1 ?
								<Button title="Submit" color={userData.data.colors.mainTheme} onPress={submitAss} />
								: ""
							}
							{/* <Button title="Submit" color="#1e90ff" onPress={submitAssessment} /> */}
						</View>
					</View>
					{/* footer Sections end */}
				</View> :
				<>
					{chapterHolder &&
						<View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme }}>
							<ScrollView>
								<View style={{ backgroundColor: userData.data.colors.liteTheme, padding: 10 }}>
									{chapterList.map((item, clist) => {
										return (
											<Text onPress={() => { chapterFun(item) }}
												key={clist} style={{ padding: 10, borderWidth: 1, borderRadius: 6, borderColor: userData.data.colors.mainTheme, marginVertical: 4, backgroundColor: selectedIds.includes(item.chapterID) ? userData.data.colors.mainTheme : SwaTheam.SwaWhite, color: selectedIds.includes(item.chapterID) ? SwaTheam.SwaWhite : SwaTheam.SwaBlack }}>
												{item.chapterName}
											</Text>
										)
									})}
								</View>
							</ScrollView>
							<TouchableOpacity style={{ backgroundColor: SwaTheam.SwaBlue, padding: 10, margin: 10, borderRadius: 6 }}
								onPress={() => startAssessment()}>
								<Text style={{ textTransform: 'uppercase', textAlign: 'center', color: SwaTheam.SwaWhite }}>Start Assessment</Text>
							</TouchableOpacity>
						</View>
					}
				</>
			}

			{areYouSure &&
				<Modal
					animationType="slide"
					transparent={true}
				>
					<View style={styles.modelsAre}>
						<View style={styles.innerBox}>
							<Image style={{ resizeMode: 'contain', width: 80, height: 80, alignSelf: "center", margin: 20 }} source={require('../../assets/mark.png')} />
							<Text style={styles.textAlinCenetr}>Are you sure ??</Text>
							<Text style={styles.runningTest}>Do you want to submit your exam</Text>
							<View style={styles.rowAreYousure}>
								<View style={{ width: 80 }}>
									<Button onPress={() => { submitAssessment(0) }}
										title="Cacel"
										color="#dc143c"
									/>
								</View>
								<View style={{ width: 80 }}>
									<Button onPress={() => { submitAssessment(1) }}
										title="OK"
										color="#228b22"
									/>
								</View>
							</View>
						</View>

					</View>
				</Modal>
			}



			{/* attempt report Model */}
			{holderRepo.holderSuccess &&
				<View style={styles.ReportHolder}>
					<View style={styles.mainHolder}>
						<Modal
							animationType="slide"
							transparent={true}
						>
							<View style={styles.headerHolder}>
								<Text>Student Exam Report</Text>
								<View><Icon onPress={closeReportHolder} name="close" size={20} color="#9ba8ae" /></View>
							</View>

							{reportDat.attemptSuccess &&
								<View style={styles.showSms}>
									<Text style={styles.youHaveSucc}>{holderRepo.successMsg}</Text>
									<View style={styles.viewReortBtns}>
										<Button title="View Report" color="#37bd79" onPress={viewReport} />
									</View>
								</View>
							}


							{reportDat.afterClickView &&
								<>
									<View style={styles.table}>
										<View style={styles.headesHead}>
											<Text>Exam Report</Text>
											<View style={styles.attptRepBtn}>
												<Button onPress={allAttemReport} style={{ fontSize: 11, padding: 5, width: 80 }} title="Attempt Report" color="#0c8781" />
											</View>
										</View>

										<View style={styles.rowHed}>
											<Text style={[styles.cell]}>Total Marks: {reportDat.totalMarks} </Text>
											<Text style={styles.cell}>Optained Marks :{reportDat.optainedMarks} </Text>
											<Text style={styles.cell}>Percentage: {reportDat.preSent}</Text>
										</View>
									</View>
									<ScrollView>
										<View style={styles.InnerBoxTbls}>
											<DataTable style={styles.container}>
												<DataTable.Header style={styles.tableHeader}>
													<DataTable.Title style={{ width: '50' }}>No.</DataTable.Title>
													<DataTable.Title>Correct Ans</DataTable.Title>
													<DataTable.Title>Your Ans</DataTable.Title>
													<DataTable.Title>Status</DataTable.Title>
													<DataTable.Title>Action</DataTable.Title>
												</DataTable.Header>

												{getReport.map((item, index, rData) => {



													return (
														<DataTable.Row key={index}>
															<DataTable.Cell style={{ width: '50' }}>{index + 1}.</DataTable.Cell>
															<DataTable.Cell>
																{item?.correctAnswerID == 1 && item.activityID == 1 ? <Text>(a)</Text> : ""}
																{item?.correctAnswerID == 2 && item.activityID == 1 ? <Text>(b)</Text> : ""}
																{item?.correctAnswerID == 3 && item.activityID == 1 ? <Text>(c)</Text> : ""}
																{item?.correctAnswerID == 4 && item.activityID == 1 ? <Text>(d)</Text> : ""}
															</DataTable.Cell>
															<DataTable.Cell>
																{item?.selectedAnswerID == 1 && item.activityID == 1 ? <Text>(a)</Text> : ""}
																{item?.selectedAnswerID == 2 && item.activityID == 1 ? <Text>(b)</Text> : ""}
																{item?.selectedAnswerID == 3 && item.activityID == 1 ? <Text>(c)</Text> : ""}
																{item?.selectedAnswerID == 4 && item.activityID == 1 ? <Text>(d)</Text> : ""}
															</DataTable.Cell>
															<DataTable.Cell>
																{(item.selectedAnswerID == item.correctAnswerID && item.activityID == 1) || (item.answerID == item.selectedAnswerID && item.activityID == 2) ?
																	<Image style={{ resizeMode: 'contain', width: 20, height: 20, alignSelf: "center", margin: 20 }} source={require('../../assets/r.png')} /> :
																	<Image style={{ resizeMode: 'contain', width: 20, height: 20, alignSelf: "center", margin: 20 }} source={require('../../assets/w.png')} />
																}
															</DataTable.Cell>
															<DataTable.Cell>
																<TouchableOpacity>
																	<Text style={styles.viewQuestionBtns} onPress={() => { viewAction(item) }}>View Q.</Text>
																</TouchableOpacity>
															</DataTable.Cell>
														</DataTable.Row>
													)
												})}

											</DataTable>
										</View>
									</ScrollView>

								</>
							}


						</Modal>
					</View>
				</View>
			}
			{/* attempt report Model */}


			{/* are you sure pop  */}



			{actData.modelHolder &&
				<View style={styles.actionQuestion}>
					<Modal animationType="slide">
						<View style={styles.headerCloseIcons}>
							<Text>Exam Question</Text>
							<View><Icon onPress={hideExamQuest} name="close" size={20} color="#9ba8ae" /></View>
						</View>
						<View style={styles.holderActQuest}>
							{actData.showQuestActId == 1 ?
								<>
									<View>
										<RenderHtml
											contentWidth={width}
											source={{ html: getquest.questionPart1 }}
											tagsStyles={tagsStyles} />

										<View style={styles.optionsView}>
											{getquest?.optionText1 ?
												<View style={[styles.textWithInput, ({ backgroundColor: getquest.optionID1 == getquest.selectedAnswerID ? '#51e3b3' : "#e3e8ea" })]}>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(a)</Text>
														{getquest?.optionText1.endsWith('.png') || getquest?.optionText1.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText1 }} style={{ width: 50, height: 50 }} />
															:
															<Text
																style={styles.optionsText}>
																{getquest?.optionText1}
															</Text>
														}
													</View>
												</View>
												: ""}
											{getquest?.optionText2 ?
												<View style={[styles.textWithInput, ({ backgroundColor: getquest.optionID2 == getquest.selectedAnswerID ? '#51e3b3' : "#e3e8ea" })]}>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(b)</Text>
														{getquest?.optionText2.endsWith('.png') || getquest?.optionText2.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText2 }} style={{ width: 50, height: 50 }} />
															:
															<Text
																style={styles.optionsText}>
																{getquest?.optionText2}
															</Text>
														}
													</View>
												</View>
												: ""}

											{getquest?.optionText3 ?
												<View style={[styles.textWithInput, ({ backgroundColor: getquest.optionID3 == getquest.selectedAnswerID ? '#51e3b3' : "#e3e8ea" })]}>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(c)</Text>
														{getquest?.optionText3.endsWith('.png') || getquest?.optionText3.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText3 }} style={{ width: 50, height: 50 }} />
															:
															<Text
																style={styles.optionsText}>
																{getquest?.optionText3}
															</Text>
														}
													</View>
												</View>
												: ""}

											{getquest?.optionText4 ?
												<View style={[styles.textWithInput, ({ backgroundColor: getquest.optionID4 == getquest.selectedAnswerID ? '#51e3b3' : "#e3e8ea" })]}>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(d)</Text>
														{getquest?.optionText4.endsWith('.png') || getquest?.optionText4.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText4 }} style={{ width: 50, height: 50 }} />
															:
															<Text
																style={styles.optionsText}>
																{getquest?.optionText4}
															</Text>
														}
													</View>
												</View>
												: ""}

											{getquest?.optionText5 ?
												<View style={[styles.textWithInput, ({ backgroundColor: getquest.optionID5 == getquest.selectedAnswerID ? '#51e3b3' : "#e3e8ea" })]}>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(d)</Text>
														{getquest?.optionText5.endsWith('.png') || getquest?.optionText5.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText5 }} style={{ width: 50, height: 50 }} />
															:
															<Text
																style={styles.optionsText}>
																{getquest?.optionText5}
															</Text>
														}
													</View>
												</View>
												: ""}

											{getquest?.optionText6 ?
												<View style={[styles.textWithInput, ({ backgroundColor: getquest.optionID6 == getquest.selectedAnswerID ? '#51e3b3' : "#e3e8ea" })]}>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(d)</Text>
														{getquest?.optionText6.endsWith('.png') || getquest?.optionText6.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText6 }} style={{ width: 50, height: 50 }} />
															:
															<Text
																style={styles.optionsText}>
																{getquest?.optionText6}
															</Text>
														}
													</View>
												</View>
												: ""}


										</View>
									</View>
								</>
								: ""
							}
							{actData.showQuestActId == 2 ?

								<View>
									<Text style={styles.questionHeading}>{getquest?.questionPart1}</Text>
									<View style={styles.optionsView}>
										{getquest?.optionText1 ?
											<View style={styles.textWithInput}>
												<>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(a)</Text>
														{getquest?.optionText1.endsWith('.png') || getquest?.optionText1.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText1 }} style={{ width: 50, height: 50 }} />
															:
															<Text style={styles.optionsText}>
																{getquest?.optionText1}
															</Text>
														}
													</View>
													<View style={styles.buttonRows}>
														{
															<>
																<TouchableOpacity
																	style={[styles.btnTNF, ({ backgroundColor: getquest.selectedAnswerID.includes("1-1") ? '#adff2f' : "" })]} >
																	<Text>True</Text>
																</TouchableOpacity>
																<TouchableOpacity
																	style={[styles.btnTNF, ({ backgroundColor: getquest.selectedAnswerID.includes("1-2") ? '#adff2f' : "" })]} >
																	<Text>False</Text>
																</TouchableOpacity>
															</>
														}
													</View>
												</>
											</View>
											: ''}
										{getquest?.optionText2 ?
											<View style={styles.textWithInput}>
												<>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(b)</Text>
														{getquest?.optionText2.endsWith('.png') || getquest?.optionText2.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText2 }} style={{ width: 50, height: 50 }} />
															:
															<Text
																style={styles.optionsText}>
																{getquest?.optionText2}
															</Text>
														}
													</View>
													<View style={styles.buttonRows}>
														{
															<>
																<TouchableOpacity

																	style={[styles.btnTNF, ({ backgroundColor: getquest.selectedAnswerID.includes("2-1") ? '#adff2f' : "" })]} >
																	<Text>True</Text>
																</TouchableOpacity>

																<TouchableOpacity
																	style={[styles.btnTNF, ({ backgroundColor: getquest.selectedAnswerID.includes("2-2") ? '#adff2f' : "" })]} >
																	<Text>False</Text>
																</TouchableOpacity>
															</>
														}
													</View>
												</>
											</View>
											: ''}
										{getquest?.optionText3 ?
											<View style={styles.textWithInput}>
												<>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(c)</Text>
														{getquest?.optionText3.endsWith('.png') || getquest?.optionText3.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText3 }} style={{ width: 50, height: 50 }} />
															:
															<Text
																style={styles.optionsText}>
																{getquest?.optionText3}
															</Text>
														}
													</View>
													<View style={styles.buttonRows}>
														{
															<>
																<TouchableOpacity

																	style={[styles.btnTNF, ({ backgroundColor: getquest.selectedAnswerID.includes("3-1") ? '#adff2f' : "" })]} >
																	<Text>True</Text>
																</TouchableOpacity>

																<TouchableOpacity

																	style={[styles.btnTNF, ({ backgroundColor: getquest.selectedAnswerID.includes("3-2") ? '#adff2f' : "" })]} >
																	<Text>False</Text>
																</TouchableOpacity>
															</>
														}
													</View>
												</>
											</View>
											: ''}
										{getquest?.optionText4 ?
											<View style={styles.textWithInput}>
												<>
													<View style={styles.AWithContent}>
														<Text style={styles.indty}>(d)</Text>
														{getquest?.optionText4.endsWith('.png') || getquest?.optionText4.endsWith('.jpg') ?
															<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText4 }} style={{ width: 50, height: 50 }} />
															:
															<Text
																style={styles.optionsText}>
																{getquest?.optionText4}
															</Text>
														}
													</View>
													<View style={styles.buttonRows}>
														{
															<>
																<TouchableOpacity
																	style={[styles.btnTNF, ({ backgroundColor: getquest.selectedAnswerID.includes("4-1") ? '#adff2f' : "" })]} >
																	<Text>True</Text>
																</TouchableOpacity>
																<TouchableOpacity
																	style={[styles.btnTNF, ({ backgroundColor: getquest.selectedAnswerID.includes("4-2") ? '#adff2f' : "" })]} >
																	<Text>True</Text>
																</TouchableOpacity>
															</>
														}
													</View>
												</>
											</View>
											: ''}
									</View>
								</View>

								: ""}
						</View>
					</Modal>
				</View>
			}

			{/* student all report data */}

			{reportDat.reportList &&
				<View>
					<Modal animationType="slide">
						<View style={styles.allExamHeader}>
							<Text>Student All Exam Report</Text>
							<View><Icon name="close" size={20} color="#231e1a" /></View>
						</View>
						<ScrollView >
							<View style={styles.InnerBoxTbls}>
								<DataTable border="true" style={[styles.Tblcontainer]}>
									<DataTable.Header style={[styles.tableHeader, { width: 460 }]} >
										<DataTable.Title style={{ flex: -1, width: 50 }}><Text>No.</Text></DataTable.Title>
										<DataTable.Title style={{ flex: -2, width: 130 }} ><Text>Set Code</Text></DataTable.Title>
										<DataTable.Title style={{ flex: -1, width: 150 }}><Text>Attempted Date</Text></DataTable.Title>
										<DataTable.Title style={{ flex: -1, width: 130 }}><Text>Status</Text></DataTable.Title>
										<DataTable.Title style={{ flex: -1, width: 130 }}><Text>Action</Text></DataTable.Title>
									</DataTable.Header>

									{allReportData.map((item, index, alD) => {
										return (
											<DataTable.Row key={index} style={{ width: 460 }} >
												<DataTable.Cell style={{ flex: -1, width: 50 }}><Text>{index + 1}.</Text></DataTable.Cell>
												<DataTable.Cell style={{ flex: -2, width: 130 }}><Text>{item.qSetCode}</Text></DataTable.Cell>
												<DataTable.Cell style={{ flex: -1, width: 150 }} ><Text>{item.dateOfAttempt}</Text></DataTable.Cell>
												<DataTable.Cell style={{ flex: -1, width: 130 }} ><Text>Attempted</Text></DataTable.Cell>

												<DataTable.Cell style={{ flex: -1, width: 130 }}>
													<TouchableOpacity>
														<Text style={styles.viewReportBtn} onPress={() => { viewReportSecond(item) }}>View Report.</Text>
													</TouchableOpacity>
												</DataTable.Cell>
											</DataTable.Row>
										)
									})}
								</DataTable>
							</View>
						</ScrollView>
					</Modal>


				</View>
			}
			{/* student all report data */}
			{loader &&
				<Loader />
			}
		</View>
	);
}
const styles = StyleSheet.create({
	viewReportBtn: {
		fontSize: 13,
		backgroundColor: "#02aca4",
		borderRadius: 5,
		padding: 4,
		color: "#fff"
	},
	Tblcontainer: {
		overflow: "scroll"
	},
	allExamHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
		backgroundColor: "#c7f0fe"
	},
	headerHolder: {
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
		backgroundColor: "#e3e8ea"
	},
	headerCloseIcons: {
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
		backgroundColor: "#e3e8ea"
	},
	holderActQuest: {
		borderWidth: 1,
		borderColor: "#e3e8ea",
		padding: 10,
		margin: 10
	},
	actionQuestion: {
		backgroundColor: '#fff',
		padding: 5,
		position: "absolute",
		zIndex: 2,
		width: "100%",
		height: "100%",
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		top: 0,
		left: 0,
	},
	viewQuestionBtns: {
		fontSize: 12,
		padding: 5,
		backgroundColor: "#ffcb00",
		borderRadius: 5
	},
	container: {
		padding: 10,
		width: "100%",
		overflow: "scroll",
		overflow: "visible"
	},
	tableHeader: {
		backgroundColor: '#DCDCDC',
	},
	rowData: {
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: 'row',
		overflow: "scroll"
	},
	InnerBoxTbls: {
		backgroundColor: "#fff",
	},
	mainHolder: {
		backgroundColor: "#fff"
	},
	headesHead: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#f0fff0",
		padding: 2,
		marginBottom: 8,
	},
	viewReortBtns: {
		width: 150,
		margin: 15,
		margin: 'auto',
		marginTop: 10
	},
	youHaveSucc: {
		textAlign: 'center',
		color: "green",
		fontSize: 15
	},
	showSms: {
		backgroundColor: '#fff',
		padding: 10,
		borderWidth: 1,
		borderBlockColor: "#a7e237",
		borderRadius: 10,
		margin: 20
	},
	ReportHolder: {
		backgroundColor: '#fff',
		padding: 5,
		position: "absolute",
		width: "100%",
		flex: 1,
		height: "100%",
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'

	},
	buttonSame: {
		width: 150,
	},
	runningTest: {
		textAlign: "center",
		fontSize: 14,
	},
	textAlinCenetr: {
		textAlign: "center",
		fontSize: 19,
		fontWeight: "bold"
	},
	innerBox: {
		backgroundColor: "#fff",
		padding: 40,
		borderRadius: 10,
	},
	modelsAre: {
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		padding: 5,
		position: "absolute",
		zIndex: 10,
		width: "100%",
		flex: 1,
		height: "100%",
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'

	},
	table: {
		borderWidth: 0,
		borderColor: "black",
		padding: 10,
		backgroundColor: "#fff",
		width: "100%"
	},
	rowAreYousure: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 20,
	},
	rowHed: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff5ee",
	},
	row: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		width: "100%",
	},
	cell: {
		flex: 1,
		padding: 3,
		borderWidth: 1,
		textAlign: "center",
		fontSize: 12,
		color: "black",
		borderColor: "#a9a9a9",
	},
	ReportModel: {
		backgroundColor: "rgba(177, 177, 177, 0.28)",
		width: "100%",
		height: "100%",
		position: "fixed",
		left: "0",
		top: "0",
		display: "flex",
		alignItems: "center",
		display: "none"
	},
	btnTNF: {
		backgroundColor: '#b0c4de',
		borderColor: '#778899',
		borderWidth: 0,
		borderRadius: 5,
		width: 100,
		margin: 5,
		padding: 4,
		textAlign: "center",
		fontSize: 14,
		borderWidth: 1
	},
	buttonRows: {
		flexDirection: 'row',
		justifyContent: "flex-start",
		alignItems: "center",
		marginLeft: 12
	},
	indty: {
		width: 25,
		minHeight: "10%"
	},
	AWithContent: {
		flexDirection: "row",
	},
	inputs: {
		width: "90%",
		margin: 2,
		height: 25,
		padding: 3,
		borderColor: "#dcdcdc",
		borderWidth: 1,
		backgroundColor: "#fff",
		borderRadius: 3,
		marginLeft: 25
	},
	textWithInput: {
		width: "100%",
		// flexDirection: 'row',
		flexWrap: 'wrap',
		// justifyContent: "space-between",
		// alignItems: "center",
		backgroundColor: "#f5f5f5",
		padding: 7,
		marginTop: 5
	},
	optionsText: {
		fontSize: 15,
		color: SwaTheam.SwaWhite,
		borderRadius: 5,
		flexShrink: 1
	},
	questionHeading: {
		fontSize: 17,
		color: SwaTheam.SwaWhite,
		fontWeight: "bold",
		backgroundColor: "#b0c4de",
		padding: 5,
		borderRadius: 5,
	},
	questHolders: {
		margin: 10,
		borderWidth: 1,
		padding: 5,
		borderColor: "#fff5ee",
		height: "80vh",
		width: "95%",
		overflow: "auto"
	},
	buttonBox: {
		marginLeft: 10,
	},
	rowFristCol: {
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: "center",
	},
	footerSections: {
		position: "absolute",
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: "center",
		bottom: 0,
		left: 0,
		backgroundColor: '#708090',
		padding: 5,
		width: '100%'
	},
	textSmall: {
		color: "#fff",
		fontSize: 15
	},
	rowForTExt: {
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 5
	},
	booknameHeading: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 16,
		color: "#fff",
		borderBottomWidth: 1,
		padding: 2,
		borderColor: "#008080"
	},
	headerAsse: {
		backgroundColor: "#0c8781",
		padding: 10,
	},
	attemptHolder: {
		backgroundColor: "red",
		top: 0,
		left: 0,
		borderColor: "#0c8781",
		borderWidth: 1,
	},
	generateTest: {
		margin: 10,
	},
	chapterName: {
		backgroundColor: "#fff",
		padding: 9,
		margin: 8,
		fontSize: 12,
		borderRadius: 5,
		borderColor: "#ffe4e1",
		borderWidth: 1,
	},
	chapterListHolder: {
		padding: 5,
		borderColor: "#708090",
		borderRadius: 3,

		borderWidth: 1,
		backgroundColor: "#708090",
		height: "80%",
		overflow: "auto"
	},
	selectBar: {
		backgroundColor: '#1e90ff',
		padding: 10,
		width: "100%",
	},
	sltSubJect: {
		backgroundColor: "#fff",
		padding: 9,
		fontSize: 13,
		position: "relative",
		borderWidth: 1,
		borderRadius: 5,
		borderColor: "#dcdcdc",
		alignItems: "center",
		display: "flex"
	},
	Datamodels: {
		backgroundColor: "rgba(177, 177, 177, 0.28)",
		width: "100%",
		height: "100%",
		position: "fixed",
		left: "0",
		top: "0",
		display: "flex",
		alignItems: "center",
	},
	innerModel: {
		backgroundColor: "#fff",
		padding: 10,
		position: "absolute",
		top: '20%',
		width: "99%",
		left: "1%",
		borderRadius: 10,
		fontSize: 12,
		borderColor: "#5f9ea0",
		borderWidth: 1,
	},
	listItem: {
		padding: 10,
		borderBottomWidth: 1,
		borderColor: "#dcdcdc"
	},
	statusView: {
		backgroundColor: "#fffacd",
		textAlign: "center",
		padding: 7,
		margin: 7,
		top: "11%"
	},
	contain: {
		borderWidth: 1,
		borderRadius: 10,
		backgroundColor: "rgb(235 235 235)",
		margin: 8,
		padding: 10,
		alignContent: "center",
		borderColor: "#b0e0e6"
	},
	textBook: {
		textAlign: "center"
	}
});