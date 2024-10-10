import { StyleSheet, Text, View, Modal, Button, TextInput, TouchableOpacity, Image, ScrollView, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import RenderHtml from 'react-native-render-html';
import Loader from '../../common/Loader';
import { Checkbox, RadioButton } from 'react-native-paper';
import { GlobleData } from '../../../Store';
import { SWATheam, apiRoot } from '../../../constant/ConstentValue';
import SwaHeader from '../../common/SwaHeader';
import Services from '../../../Services';

export default function NCERT({ navigation, route }) {
	const { userData } = useContext(GlobleData)
	const { width } = useWindowDimensions();
	const tagsStyles = {
		body: {
			fontSize: 17,
			color: SWATheam.SwaBlack,
			fontWeight: '500',
			flexShrink: 1
		},
		p: {
			fontSize: 17,
			color: SWATheam.SwaBlack,
			fontWeight: '500',
			flexShrink: 1
		}
	};

	const optionStyle = {
		body: {
			fontSize: 17,
			color: SWATheam.SwaBlack,
			flexShrink: 1
		},
		p: {
			fontSize: 17,
			color: SWATheam.SwaBlack,
			flexShrink: 1
		}
	};


	function onClickLeftIcon() {
		navigation.goBack()
	}
	function onClickRightIcon() {
		setIsInstruction(true)
	}

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
	const ImgBase = 'https://swaadhyayan.com/data/';


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
			.then((getQuest) => {
				if (getQuest.status == "success") {
					setLoaders(false)
					setQuestion(getQuest.ncertQuestion[0]?.questionData)
					let setIds = getQuest.ncertQuestion[0]?.qSetID;
					let testTyp = getQuest.ncertQuestion[0]?.testTypeID;
					setstartingTestData((p) => {
						return { ...p, qSetIds: setIds, testTypesIds: testTyp }
					})
					let dd = getQuest.ncertQuestion[0]?.questionData;
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
					alert(getQuest.message)
					setAttemptScreen(false)
				}
			})
			.catch((err) => {
				console.log(err)
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
	const [storeData, setStoreData] = useState([])
	const onchangeGetData = (index, value, option, opInd) => {
		setStoreData(prevState => {
			const updatedValues = [...prevState];
			if (updatedValues[index] != undefined) {
				let valueArray = [];
				if (updatedValues[index][option] != undefined) {
					valueArray = updatedValues[index][option];
				}
				valueArray[opInd] = value;
				updatedValues[index][option] = valueArray;
			} else {
				let valueArray = [];
				valueArray[opInd] = value;
				updatedValues[index] = { [option]: valueArray }
			}
			FinalSubmitData();

			// updatedValues[index] = { ...updatedValues[index], [option]: value };
			return updatedValues;

		});
		// console.log(storeData, "---------------------")
	};
	const [finalPost, setFinalPost] = useState([]);
	// attemptData data functions
	const attemptData = (questionData) => {
		const thisData = [];
		const prevData = finalPost;
		// prevData.map((item) => {
		// 	thisData.push(item);
		// });
		for (i = 0; i < prevData.length; i++) {
			thisData.push(prevData[i])
		}


		let reAttempt = 0;

		// thisData.map((item, index) =>{
		// 	if (questionData.questionID == item.questionID) {
		// 		reAttempt = 1;
		// 		thisData[index] = questionData;
		// 	}
		// });

		for (i = 0; i < thisData.length; i++) {
			if (questionData.questionID == thisData[i].questionID) {
				reAttempt = 1;
				thisData[i] = questionData;
			}

		}

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
		const optionText1 = storeData[currentQuestionIndex]?.optionText1 ? storeData[currentQuestionIndex]?.optionText1 : "";
		const optionText2 = storeData[currentQuestionIndex]?.optionText2 ? storeData[currentQuestionIndex]?.optionText2 : "";
		const optionText3 = storeData[currentQuestionIndex]?.optionText3 ? storeData[currentQuestionIndex]?.optionText3 : "";
		const optionText4 = storeData[currentQuestionIndex]?.optionText4 ? storeData[currentQuestionIndex]?.optionText4 : "";
		const optionText5 = storeData[currentQuestionIndex]?.optionText5 ? storeData[currentQuestionIndex]?.optionText5 : "";
		const optionText6 = storeData[currentQuestionIndex]?.optionText6 ? storeData[currentQuestionIndex]?.optionText6 : "";
		const mergedVariable = [optionText1, optionText2, optionText3, optionText4, optionText5, optionText6];
		const filteredValues = mergedVariable.filter(mergedVariable => mergedVariable !== "");
		const selectedText = filteredValues.join(',');

		const Fdata = {
			"questionID": Qids,
			'chouseOptID': 0,
			"chouseOptText": selectedText,
			"correctOptText": correctOpText,
			"questionMarks": marks,
			"getMarks": marks,
			"correctAnswerID": 0,
			"selectedAnswerID": selectedText,
			"attemptStatus": "1",
			"userRefID": userData.data.userRefID,
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
			"userRefID": userData.data.userRefID,
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
			Services.post(apiRoot.submitNcertExamAttempt, { finalAttemptData: finalPost })
				.then((finalAssess) => {
					// console.log(JSON.stringify(finalAssess),'finalAssess check')
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
						alert(finalAssess.message);
					}

				})
				.catch((err) => {
					console.log(err)
				})
				.finally(() => {

				})
		} else {
			setAreYouSure(false)
		}
	}
	// submit final attempt end
	// tnf functions start here 
	function tnfAction(optIDS, answer, crtq) {
		const curreIn = crtq
		let currentAns = finalPost.filter(item => item.questionID == curreIn.questionID)[0];
		let marks = question[currentQuestionIndex].marks;
		let correctAnsIds = question[currentQuestionIndex].answerID;

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
			"correctAnswerID": correctAnsIds,
			"selectedAnswerID": selectedOption,
			"attemptStatus": "1",
			"userRefID": userData.data.userRefID,
			"testTypeID": startingTestData.testTypesIds,
			"qSetID": startingTestData.qSetIds,
			"activityID": actIds
		}
		// console.log(TnfPayLoad, "***")
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
		setreport([]);
		let setIds = item.qSetID
		const xdata = {
			"qSetID": setIds
		}
		Services.post(apiRoot.studentNcertViewReport, { "qSetID": setIds })
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
					alert(finalAssess.message);
				}
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {

			})
	}

	function viewReport() {
		setreport([])
		Services.post(apiRoot.studentNcertViewReport, { "qSetID": startingTestData.qSetIds })
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
					alert(finalAssess.message);
				}

			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {
			})
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

		Services.post(apiRoot.studentAllNcertAttemptReport, { "userRefID": userData.data.userRefID })
			.then((atmtData) => {
				if (atmtData.status == "success") {
					setallReportData(atmtData.data);
					setLoaders(false)
					setReportData((s) => {
						return {
							...s,
							// afterClickView: false,
							reportList: true,
						}
					})
				} else {
					alert(atmtData.message);
				}
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {

			})
	}
	function hideReportList() {
		setReportData((s) => {
			return {
				...s,
				reportList: false,
			}
		})
	}

	// fillData function
	const optionText1Fun1 = () => {
		let items = question[currentQuestionIndex]?.optionText1
		const replacedContent1 = items.split('~__~').map((part, index) => {
			if (index !== items.split('~__~').length - 1) {
				let value = "";
				if (storeData[currentQuestionIndex].optionText1 != undefined) {
					if (storeData[currentQuestionIndex].optionText1[index] != undefined) {
						value = storeData[currentQuestionIndex].optionText1[index]
					}
				}

				// <Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart1 }} style={styles.questImgs} />

				return (
					<View key={index} style={styles.inLineText}>
						<Text>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentQuestionIndex, text, 'optionText1', index)}
							style={styles.inputs_inner} />
						<View>
							{question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionImage1 ?
								<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionImage1 }} style={styles.optionsImgs} />
								: null}
						</View>

					</View>
				)
			}
			return (
				<Text>{part}</Text>
			);
		})
		return replacedContent1
	};
	const optionText1Fun2 = () => {
		let items = question[currentQuestionIndex]?.optionText2
		const replacedContent2 = items.split('~__~').map((part, index) => {
			if (index !== items.split('~__~').length - 1) {
				let value = "";
				if (storeData[currentQuestionIndex].optionText2 != undefined) {
					if (storeData[currentQuestionIndex].optionText2[index] != undefined) {
						value = storeData[currentQuestionIndex].optionText2[index];
					}
				}
				return (
					<View key={index} style={styles.inLineText}>
						<Text>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentQuestionIndex, text, 'optionText2', index)}
							style={styles.inputs_inner} />
						{question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionImage2 ?
							<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionImage2 }} style={styles.optionsImgs} />
							: null}
					</View>
				);
			}
			return (
				<Text>{part}</Text>
			);
		});
		return replacedContent2;
	};
	const optionText1Fun3 = () => {
		let items = question[currentQuestionIndex]?.optionText3
		const replacedContent3 = items.split('~__~').map((part, index) => {
			if (index !== items.split('~__~').length - 1) {
				let value = "";
				if (storeData[currentQuestionIndex].optionText3 != undefined) {
					if (storeData[currentQuestionIndex].optionText3[index] != undefined) {
						value = storeData[currentQuestionIndex].optionText3[index];
					}
				}
				return (
					<View key={index} style={styles.inLineText}>
						<Text>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentQuestionIndex, text, 'optionText3', index)}
							style={styles.inputs_inner} />
						{question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionImage3 ?
							<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionImage3 }} style={styles.optionsImgs} />
							: null}
					</View>
				);
			}
			return (
				<Text>{part}</Text>
			);
		});
		return replacedContent3;
	};
	const optionText1Fun4 = () => {
		let items = question[currentQuestionIndex]?.optionText4
		const replacedContent4 = items.split('~__~').map((part, index) => {
			if (index !== items.split('~__~').length - 1) {
				let value = "";
				if (storeData[currentQuestionIndex].optionText4 != undefined) {
					if (storeData[currentQuestionIndex].optionText4[index] != undefined) {
						value = storeData[currentQuestionIndex].optionText4[index];
					}
				}
				return (
					<View key={index} style={styles.inLineText}>
						<Text>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentQuestionIndex, text, 'optionText4', index)}
							style={styles.inputs_inner} />
						{question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionImage4 ?
							<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionImage4 }} style={styles.optionsImgs} />
							: null}
					</View>
				);
			}
			return (
				<Text>{part}</Text>
			);
		});
		return replacedContent4;
	};
	const optionText1Fun5 = () => {
		let items = question[currentQuestionIndex]?.optionText5
		const replacedContent5 = items.split('~__~').map((part, index) => {
			if (index !== items.split('~__~').length - 1) {
				let value = "";
				if (storeData[currentQuestionIndex].optionText5 != undefined) {
					if (storeData[currentQuestionIndex].optionText5[index] != undefined) {
						value = storeData[currentQuestionIndex].optionText5[index];
					}
				}
				return (
					<View key={index} style={styles.inLineText}>
						<Text>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentQuestionIndex, text, 'optionText5', index)}
							style={styles.inputs_inner} />
						{question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionImage5 ?
							<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionImage5 }} style={styles.optionsImgs} />
							: null}
					</View>
				);
			}
			return (
				<Text>{part}</Text>
			);
		});
		return replacedContent5;
	};
	const optionText1Fun6 = () => {
		let items = question[currentQuestionIndex]?.optionText6
		const replacedContent6 = items.split('~__~').map((part, index) => {
			if (index !== items.split('~__~').length - 1) {
				let value = "";
				if (storeData[currentQuestionIndex].optionText6 != undefined) {
					if (storeData[currentQuestionIndex].optionText6[index] != undefined) {
						value = storeData[currentQuestionIndex].optionText6[index];
					}
				}
				return (
					<View key={index} style={styles.inLineText}>
						<Text>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentQuestionIndex, text, 'optionText6', index)}
							style={styles.inputs_inner} />
						{question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionImage6 ?
							<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionImage6 }} style={styles.optionsImgs} />
							: null}
					</View>
				);
			}
			return (
				<Text>{part}</Text>
			);
		});
		return replacedContent6;
	};

	return (
		<>
			{loader ?
				<Loader /> :
				<View style={{ flex: 1, marginTop: 24 }}>
					{!attemptScreen &&
						<SwaHeader title={"NCERT"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
					}

					{/* chaoter list */}

					{attemptScreen ?
						<View>
							<View style={styles.attemptHolder}>
								<View style={{ padding: 10, backgroundColor: userData.data.colors.mainTheme }}>
									<Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: SWATheam.SwaWhite, borderBottomWidth: 1, padding: 2, borderColor: userData.data.colors.liteTheme }}>NCRT EXAM TEST</Text>
									<View style={styles.rowView}>
										<View style={styles.rowForTExt}>
											<Text style={styles.textSmall}>Total Questions : {totalQuest}</Text>
											<Text style={styles.textSmall}>Attempted Questions : {startPoint}</Text>
										</View>
									</View>
								</View>
								{/* question Views Holders start */}

								<KeyboardAvoidingView
									behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
									style={styles.questHolders}>
									<ScrollView>
										{question[currentQuestionIndex].activityID == 1
											?
											<View>
												{question[currentQuestionIndex].questionPart1 ?
													<View>
														{
															question[currentQuestionIndex]?.questionPart1.endsWith('.png') ||
																question[currentQuestionIndex]?.questionPart1.endsWith('.PNG') ||
																question[currentQuestionIndex]?.questionPart1.endsWith('.JPG') ||
																question[currentQuestionIndex]?.questionPart1.endsWith('.jpg') ?
																<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart1 }} style={styles.questImgs} />
																:
																<RenderHtml
																	contentWidth={width}
																	source={{ html: question[currentQuestionIndex].questionPart1 }}
																	tagsStyles={tagsStyles}
																/>
														}
													</View>
													: null}

												{question[currentQuestionIndex].questionPart2 ?
													<View>
														{
															question[currentQuestionIndex]?.questionPart2.endsWith('.PNG') ||
																question[currentQuestionIndex]?.questionPart2.endsWith('.png') ||
																question[currentQuestionIndex]?.questionPart2.endsWith('.JPG') ||
																question[currentQuestionIndex]?.questionPart2.endsWith('.jpg') ?
																<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart2 }} style={styles.questImgs} />
																:
																<RenderHtml
																	contentWidth={width}
																	source={{ html: question[currentQuestionIndex].questionPart2 }}
																	tagsStyles={tagsStyles}
																/>
														}
													</View>
													: null}
												{question[currentQuestionIndex].questionPart3 ?
													<View>
														{
															question[currentQuestionIndex]?.questionPart3.endsWith('.PNG') ||
																question[currentQuestionIndex]?.questionPart3.endsWith('.png') ||
																question[currentQuestionIndex]?.questionPart3.endsWith('.JPG') ||
																question[currentQuestionIndex]?.questionPart3.endsWith('.jpg') ?
																<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart3 }} style={styles.questImgs} />
																:
																<RenderHtml
																	contentWidth={width}
																	source={{ html: question[currentQuestionIndex].questionPart3 }}
																	tagsStyles={tagsStyles}
																/>
														}
													</View>
													: null}
												{question[currentQuestionIndex].questionPart4 ?
													<View>
														{
															question[currentQuestionIndex]?.questionPart4.endsWith('.PNG') ||
																question[currentQuestionIndex]?.questionPart4.endsWith('.png') ||
																question[currentQuestionIndex]?.questionPart4.endsWith('.JPG') ||
																question[currentQuestionIndex]?.questionPart4.endsWith('.jpg') ?
																<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart4 }} style={styles.questImgs} />
																:
																<RenderHtml
																	contentWidth={width}
																	source={{ html: question[currentQuestionIndex].questionPart4 }}
																	tagsStyles={tagsStyles}
																/>
														}
													</View>
													: null}
												{question[currentQuestionIndex].questionPart5 ?
													<View>
														{
															question[currentQuestionIndex]?.questionPart5.endsWith('.PNG') ||
																question[currentQuestionIndex]?.questionPart5.endsWith('.png') ||
																question[currentQuestionIndex]?.questionPart5.endsWith('.JPG') ||
																question[currentQuestionIndex]?.questionPart5.endsWith('.jpg') ?
																<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart5 }} style={styles.questImgs} />
																:
																<RenderHtml
																	contentWidth={width}
																	source={{ html: question[currentQuestionIndex].questionPart5 }}
																	tagsStyles={tagsStyles}
																/>
														}
													</View>
													: null}

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
															style={[styles.textWithInput2]}>
															<View style={styles.AWithContent}>
																<RadioButton
																	status={currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID1 ? "checked" : 'unchecked'}
																	onPress={() => {
																		mcqClicked(
																			question[currentQuestionIndex].optionID1,
																			question[currentQuestionIndex].questionID,
																			question[currentQuestionIndex].optionText1,
																		)
																	}}
																/>
																<Text style={styles.indty}>(a)</Text>
																{question[currentQuestionIndex]?.optionText1.endsWith('.png') || question[currentQuestionIndex]?.optionText1.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText1 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText1 }}
																		tagsStyles={optionStyle}
																	/>
																}
															</View>
														</TouchableOpacity>
														: null}
													{question[currentQuestionIndex]?.optionText2 ?
														<TouchableOpacity
															onPress={() => {
																mcqClicked(
																	question[currentQuestionIndex].optionID2,
																	question[currentQuestionIndex].questionID,
																	question[currentQuestionIndex].optionText2,
																)
															}}
															style={[styles.textWithInput2]}>
															<View style={styles.AWithContent}>
																<RadioButton
																	status={currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID2 ? "checked" : 'unchecked'}
																	onPress={() => {
																		mcqClicked(
																			question[currentQuestionIndex].optionID2,
																			question[currentQuestionIndex].questionID,
																			question[currentQuestionIndex].optionText2,
																		)
																	}}
																/>
																<Text style={styles.indty}>(b)</Text>
																{question[currentQuestionIndex]?.optionText2.endsWith('.png') || question[currentQuestionIndex]?.optionText2.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText2 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText2 }}
																		tagsStyles={optionStyle}
																	/>
																}
															</View>
														</TouchableOpacity>
														: null}
													{question[currentQuestionIndex]?.optionText3 ?
														<TouchableOpacity
															onPress={() => {
																mcqClicked(
																	question[currentQuestionIndex].optionID3,
																	question[currentQuestionIndex].questionID,
																	question[currentQuestionIndex].optionText3,
																)
															}}
															style={[styles.textWithInput2]}>
															<View style={styles.AWithContent}>
																<RadioButton
																	status={currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID3 ? "checked" : 'unchecked'}
																	onPress={() => {
																		mcqClicked(
																			question[currentQuestionIndex].optionID3,
																			question[currentQuestionIndex].questionID,
																			question[currentQuestionIndex].optionText3,
																		)
																	}}
																/>
																<Text style={styles.indty}>(c)</Text>
																{question[currentQuestionIndex]?.optionText3.endsWith('.png') || question[currentQuestionIndex]?.optionText3.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText3 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText3 }}
																		tagsStyles={optionStyle}
																	/>
																}
															</View>
														</TouchableOpacity>
														: null}
													{question[currentQuestionIndex]?.optionText4 ?
														<TouchableOpacity
															onPress={() => {
																mcqClicked(
																	question[currentQuestionIndex].optionID4,
																	question[currentQuestionIndex].questionID,
																	question[currentQuestionIndex].optionText4,
																)
															}}
															style={[styles.textWithInput2]}>
															<View style={styles.AWithContent}>
																<RadioButton
																	status={currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID4 ? "checked" : 'unchecked'}
																	onPress={() => {
																		mcqClicked(
																			question[currentQuestionIndex].optionID4,
																			question[currentQuestionIndex].questionID,
																			question[currentQuestionIndex].optionText4,
																		)
																	}}
																/>
																<Text style={styles.indty}>(a)</Text>
																{question[currentQuestionIndex]?.optionText4.endsWith('.png') || question[currentQuestionIndex]?.optionText4.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText4 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText4 }}
																		tagsStyles={optionStyle}
																	/>
																}
															</View>
														</TouchableOpacity>
														: null}
													{question[currentQuestionIndex]?.optionText5 ?
														<TouchableOpacity
															onPress={() => {
																mcqClicked(
																	question[currentQuestionIndex].optionID5,
																	question[currentQuestionIndex].questionID,
																	question[currentQuestionIndex].optionText5,
																)
															}}
															style={[styles.textWithInput2]}>
															<View style={styles.AWithContent}>
																<RadioButton
																	status={currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID5 ? "checked" : 'unchecked'}
																	onPress={() => {
																		mcqClicked(
																			question[currentQuestionIndex].optionID5,
																			question[currentQuestionIndex].questionID,
																			question[currentQuestionIndex].optionText5,
																		)
																	}}
																/>
																<Text style={styles.indty}>(a)</Text>
																{question[currentQuestionIndex]?.optionText5.endsWith('.png') || question[currentQuestionIndex]?.optionText5.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText5 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText5 }}
																		tagsStyles={optionStyle}
																	/>
																}
															</View>
														</TouchableOpacity>
														: null}
													{question[currentQuestionIndex]?.optionText6 ?
														<TouchableOpacity
															onPress={() => {
																mcqClicked(
																	question[currentQuestionIndex].optionID6,
																	question[currentQuestionIndex].questionID,
																	question[currentQuestionIndex].optionText6,
																)
															}}
															style={[styles.textWithInput2]}>
															<View style={styles.AWithContent}>
																<RadioButton
																	status={currentAns?.questionID == question[currentQuestionIndex].questionID && currentAns?.selectedAnswerID == question[currentQuestionIndex].optionID6 ? "checked" : 'unchecked'}
																	onPress={() => {
																		mcqClicked(
																			question[currentQuestionIndex].optionID6,
																			question[currentQuestionIndex].questionID,
																			question[currentQuestionIndex].optionText6,
																		)
																	}}
																/>
																<Text style={styles.indty}>(a)</Text>
																{question[currentQuestionIndex]?.optionText6.endsWith('.png') || question[currentQuestionIndex]?.optionText6.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText6 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: question[currentQuestionIndex]?.optionText6 }}
																		tagsStyles={optionStyle}
																	/>
																}
															</View>
														</TouchableOpacity>
														: null}
												</View>
											</View>
											: question[currentQuestionIndex].activityID == 3
												? <>
													<View>

														{question[currentQuestionIndex].questionPart1 ?
															<View>
																{
																	question[currentQuestionIndex]?.questionPart1.endsWith('.png') ||
																		question[currentQuestionIndex]?.questionPart1.endsWith('.PNG') ||
																		question[currentQuestionIndex]?.questionPart1.endsWith('.JPG') ||
																		question[currentQuestionIndex]?.questionPart1.endsWith('.jpg') ?
																		<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart1 }} style={styles.questImgs} />
																		:
																		<RenderHtml
																			contentWidth={width}
																			source={{ html: question[currentQuestionIndex].questionPart1 }}
																			tagsStyles={tagsStyles}
																		/>

																}
															</View>
															: null}

														{question[currentQuestionIndex].questionPart2 ?
															<View>
																{
																	question[currentQuestionIndex]?.questionPart2.endsWith('.PNG') ||
																		question[currentQuestionIndex]?.questionPart2.endsWith('.png') ||
																		question[currentQuestionIndex]?.questionPart2.endsWith('.JPG') ||
																		question[currentQuestionIndex]?.questionPart2.endsWith('.jpg') ?
																		<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart2 }} style={styles.questImgs} />
																		:
																		<RenderHtml
																			contentWidth={width}
																			source={{ html: question[currentQuestionIndex].questionPart2 }}
																			tagsStyles={tagsStyles}
																		/>
																}
															</View>
															: null}
														{question[currentQuestionIndex].questionPart3 ?
															<View>
																{
																	question[currentQuestionIndex]?.questionPart3.endsWith('.PNG') ||
																		question[currentQuestionIndex]?.questionPart3.endsWith('.png') ||
																		question[currentQuestionIndex]?.questionPart3.endsWith('.JPG') ||
																		question[currentQuestionIndex]?.questionPart3.endsWith('.jpg') ?
																		<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart3 }} style={styles.questImgs} />
																		:
																		<RenderHtml
																			contentWidth={width}
																			source={{ html: question[currentQuestionIndex].questionPart3 }}
																			tagsStyles={tagsStyles}
																		/>
																}
															</View>
															: null}
														{question[currentQuestionIndex].questionPart4 ?
															<View>
																{
																	question[currentQuestionIndex]?.questionPart4.endsWith('.PNG') ||
																		question[currentQuestionIndex]?.questionPart4.endsWith('.png') ||
																		question[currentQuestionIndex]?.questionPart4.endsWith('.JPG') ||
																		question[currentQuestionIndex]?.questionPart4.endsWith('.jpg') ?
																		<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart4 }} style={styles.questImgs} />
																		:
																		<RenderHtml
																			contentWidth={width}
																			source={{ html: question[currentQuestionIndex].questionPart4 }}
																			tagsStyles={tagsStyles}
																		/>
																}
															</View>
															: null}
														{question[currentQuestionIndex].questionPart5 ?
															<View>
																{
																	question[currentQuestionIndex]?.questionPart5.endsWith('.PNG') ||
																		question[currentQuestionIndex]?.questionPart5.endsWith('.png') ||
																		question[currentQuestionIndex]?.questionPart5.endsWith('.JPG') ||
																		question[currentQuestionIndex]?.questionPart5.endsWith('.jpg') ?
																		<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart5 }} style={styles.questImgs} />
																		:
																		<RenderHtml
																			contentWidth={width}
																			source={{ html: question[currentQuestionIndex].questionPart5 }}
																			tagsStyles={tagsStyles}
																		/>
																}
															</View>
															: null}

														<View style={styles.optionsView}>
															{question[currentQuestionIndex]?.optionText1 ?
																<View style={{ flexWrap: 'wrap', backgroundColor: "#e5e7eb", padding: 5, margin: 5 }}>
																	<Text style={{ width: 20, fontWeight: "bold" }}>a.</Text>
																	<View>
																		{question[currentQuestionIndex]?.optionText1.endsWith('.png') || question[currentQuestionIndex]?.optionText1.endsWith('.jpg') ?
																			<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText1 }} style={{ width: 50, height: 50 }} />
																			:
																			<View>
																				{optionText1Fun1()}
																			</View>
																		}
																	</View>
																</View>
																: ''}
															{question[currentQuestionIndex]?.optionText2 ?
																<View style={{ flexWrap: 'wrap', backgroundColor: "#e5e7eb", padding: 5, margin: 5 }}>
																	<Text style={{ width: 20, fontWeight: "bold" }}>b.</Text>
																	<View>
																		{question[currentQuestionIndex]?.optionText2.endsWith('.png') || question[currentQuestionIndex]?.optionText2.endsWith('.jpg') ?
																			<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText2 }} style={{ width: 50, height: 50 }} />
																			:
																			<View>
																				{optionText1Fun2()}
																			</View>
																		}
																	</View>
																</View>
																: null}
															{question[currentQuestionIndex]?.optionText3 ?

																<View style={{ flexWrap: 'wrap', backgroundColor: "#e5e7eb", padding: 5, margin: 5 }}>
																	<Text style={{ width: 20, fontWeight: "bold" }}>c.</Text>
																	<View>
																		{question[currentQuestionIndex]?.optionText3.endsWith('.png') || question[currentQuestionIndex]?.optionText3.endsWith('.jpg') ?
																			<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText3 }} style={{ width: 50, height: 50 }} />
																			:
																			<View>
																				{optionText1Fun3()}
																			</View>
																		}
																	</View>
																</View>


																: null}
															{question[currentQuestionIndex]?.optionText4 ?

																<View style={{ flexWrap: 'wrap', backgroundColor: "#e5e7eb", padding: 5, margin: 5 }}>
																	<Text style={{ width: 20, fontWeight: "bold" }}>d.</Text>
																	<View>
																		{question[currentQuestionIndex]?.optionText4.endsWith('.png') || question[currentQuestionIndex]?.optionText4.endsWith('.jpg') ?
																			<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText4 }} style={{ width: 50, height: 50 }} />
																			:
																			<View>
																				{optionText1Fun4()}
																			</View>
																		}
																	</View>
																</View>


																: null}
															{question[currentQuestionIndex]?.optionText5 ?

																<View style={{ flexWrap: 'wrap', backgroundColor: "#e5e7eb", padding: 5, margin: 5 }}>
																	<Text style={{ width: 20, fontWeight: "bold" }}>e.</Text>
																	<View>
																		{question[currentQuestionIndex]?.optionText5.endsWith('.png') || question[currentQuestionIndex]?.optionText5.endsWith('.jpg') ?
																			<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText5 }} style={{ width: 50, height: 50 }} />
																			:
																			<View>
																				{optionText1Fun5()}
																			</View>
																		}
																	</View>
																</View>


																: null}
															{question[currentQuestionIndex]?.optionText6 ?
																<View style={{ flexWrap: 'wrap', backgroundColor: "#e5e7eb", padding: 5, margin: 5 }}>
																	<Text style={{ width: 20, fontWeight: "bold" }}>f.</Text>
																	<View>
																		{question[currentQuestionIndex]?.optionText6.endsWith('.png') || question[currentQuestionIndex]?.optionText6.endsWith('.jpg') ?
																			<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText6 }} style={{ width: 50, height: 50 }} />
																			:
																			<View>
																				{optionText1Fun6()}
																			</View>
																		}
																	</View>
																</View>
																: null}
														</View>
													</View>
												</>
												: question[currentQuestionIndex].activityID == 2
													? <View>

														{question[currentQuestionIndex].questionPart1 ?
															<View>
																{
																	question[currentQuestionIndex]?.questionPart1.endsWith('.png') ||
																		question[currentQuestionIndex]?.questionPart1.endsWith('.PNG') ||
																		question[currentQuestionIndex]?.questionPart1.endsWith('.JPG') ||
																		question[currentQuestionIndex]?.questionPart1.endsWith('.jpg') ?
																		<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart1 }} style={styles.questImgs} />
																		:
																		<RenderHtml
																			contentWidth={width}
																			source={{ html: question[currentQuestionIndex].questionPart1 }}
																			tagsStyles={tagsStyles}
																		/>
																}
															</View>
															: null}

														{question[currentQuestionIndex].questionPart2 ?
															<View>
																{
																	question[currentQuestionIndex]?.questionPart2.endsWith('.PNG') ||
																		question[currentQuestionIndex]?.questionPart2.endsWith('.png') ||
																		question[currentQuestionIndex]?.questionPart2.endsWith('.JPG') ||
																		question[currentQuestionIndex]?.questionPart2.endsWith('.jpg') ?
																		<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart2 }} style={styles.questImgs} />
																		:
																		<RenderHtml
																			contentWidth={width}
																			source={{ html: question[currentQuestionIndex].questionPart2 }}
																			tagsStyles={tagsStyles}
																		/>

																}
															</View>
															: null}
														{question[currentQuestionIndex].questionPart3 ?
															<View>
																{
																	question[currentQuestionIndex]?.questionPart3.endsWith('.PNG') ||
																		question[currentQuestionIndex]?.questionPart3.endsWith('.png') ||
																		question[currentQuestionIndex]?.questionPart3.endsWith('.JPG') ||
																		question[currentQuestionIndex]?.questionPart3.endsWith('.jpg') ?
																		<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart3 }} style={styles.questImgs} />
																		:
																		<RenderHtml
																			contentWidth={width}
																			source={{ html: question[currentQuestionIndex].questionPart3 }}
																			tagsStyles={tagsStyles}
																		/>
																}
															</View>
															: null}
														{question[currentQuestionIndex].questionPart4 ?
															<View>
																{
																	question[currentQuestionIndex]?.questionPart4.endsWith('.PNG') ||
																		question[currentQuestionIndex]?.questionPart4.endsWith('.png') ||
																		question[currentQuestionIndex]?.questionPart4.endsWith('.JPG') ||
																		question[currentQuestionIndex]?.questionPart4.endsWith('.jpg') ?
																		<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart4 }} style={styles.questImgs} />
																		:

																		<RenderHtml
																			contentWidth={width}
																			source={{ html: question[currentQuestionIndex].questionPart4 }}
																			tagsStyles={tagsStyles}
																		/>
																}
															</View>
															: null}
														{question[currentQuestionIndex].questionPart5 ?
															<View>
																{
																	question[currentQuestionIndex]?.questionPart5.endsWith('.PNG') ||
																		question[currentQuestionIndex]?.questionPart5.endsWith('.png') ||
																		question[currentQuestionIndex]?.questionPart5.endsWith('.JPG') ||
																		question[currentQuestionIndex]?.questionPart5.endsWith('.jpg') ?
																		<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart5 }} style={styles.questImgs} />
																		:
																		<RenderHtml
																			contentWidth={width}
																			source={{ html: question[currentQuestionIndex].questionPart5 }}
																			tagsStyles={tagsStyles}
																		/>
																}
															</View>
															: null}

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
																					tagsStyles={optionStyle}
																				/>
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
																: null}
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
																					tagsStyles={optionStyle}
																				/>
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
																: null}
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
																					tagsStyles={optionStyle}
																				/>
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
																: null}
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
																					tagsStyles={optionStyle}
																				/>
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
																						<Text>False</Text>
																					</TouchableOpacity>
																				</>
																			}
																		</View>
																	</>
																</View>
																: null}
														</View>
													</View>
													: <Text>NOT Yet</Text>
										}
									</ScrollView>
								</KeyboardAvoidingView>

								{/* question Views Holders end */}
								{/* footer Sections start */}

								<View style={{
									flexDirection: 'row',
									justifyContent: "space-between",
									alignItems: "center",
									backgroundColor: userData.data.colors.liteTheme,
									padding: 5,
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
										<Button title="Submit" color="#1e90ff" onPress={submitAss} />
									</View>
								</View>
								{/* footer Sections end */}
							</View>
						</View> :
						<>
							<View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme }}>
								<ScrollView>
									<View style={{ backgroundColor: userData.data.colors.liteTheme, padding: 10 }}>
										{chapterList.map((item, index) => {
											return (
												<View key={index}>
													<Checkbox.Item
														reverse={false}
														labelStyle={{ fontSize: 13 }}
														onPress={() => { chapterFun(item) }}
														label={item.chapterName}
														status={selectedIds.includes(item.chapterID) ? "checked" : 'unchecked'}
														style={[styles.examView, { backgroundColor: selectedIds.includes(item.chapterID) ? "#e2f7ee" : "#fff" }]}
													/>
												</View>
											)
										})}
									</View>
								</ScrollView>
								<TouchableOpacity style={{ backgroundColor: SWATheam.SwaBlue, padding: 10, margin: 10, borderRadius: 6 }}
									onPress={() => startAssessment()}>
									<Text style={{ textTransform: 'uppercase', textAlign: 'center', color: SWATheam.SwaWhite }}>Start Assessment</Text>
								</TouchableOpacity>
							</View>
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
										<Text style={{ color: SWATheam.SwaBlack }}>Student Exam Report</Text>
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
												<View style={[styles.headesHead, { backgroundColor: userData.data.colors.liteTheme }]}>
													<Text style={{ color: SWATheam.SwaBlack }}>Exam Report</Text>
													<View style={styles.attptRepBtn}>
														<Button onPress={allAttemReport} style={{ fontSize: 11, padding: 5, width: 80 }} title="Attempt Report" color={userData.data.colors.mainTheme} />
													</View>
												</View>
												<View style={styles.rowHed}>
													<Text style={[styles.cell]}>Total Marks: {reportDat.totalMarks}</Text>
													<Text style={styles.cell}>Optained Marks :{reportDat.optainedMarks}</Text>
													<Text style={styles.cell}>Percentage: {reportDat.preSent}</Text>
												</View>
											</View>
											<ScrollView>
												<View style={styles.InnerBoxTbls}>
													<DataTable style={styles.container}>
														<DataTable.Header style={styles.tableHeader}>
															<DataTable.Title>No.</DataTable.Title>
															<DataTable.Title>Correct Ans</DataTable.Title>
															<DataTable.Title>Your Ans</DataTable.Title>
															<DataTable.Title>Status</DataTable.Title>
															<DataTable.Title>Action</DataTable.Title>
														</DataTable.Header>
														{getReport.map((item, index, rData) => {
															return (
																<DataTable.Row key={index}>
																	<DataTable.Cell style={{ width: 50 }}>{index + 1}.</DataTable.Cell>
																	<DataTable.Cell>
																		{item?.correctAnswerID == 1 && item.activityID == 1 ? <Text>(a)</Text> : null}
																		{item?.correctAnswerID == 2 && item.activityID == 1 ? <Text>(b)</Text> : null}
																		{item?.correctAnswerID == 3 && item.activityID == 1 ? <Text>(c)</Text> : null}
																		{item?.correctAnswerID == 4 && item.activityID == 1 ? <Text>(d)</Text> : null}
																	</DataTable.Cell>
																	<DataTable.Cell>
																		{item?.selectedAnswerID == 1 && item.activityID == 1 ? <Text>(a)</Text> : null}
																		{item?.selectedAnswerID == 2 && item.activityID == 1 ? <Text>(b)</Text> : null}
																		{item?.selectedAnswerID == 3 && item.activityID == 1 ? <Text>(c)</Text> : null}
																		{item?.selectedAnswerID == 4 && item.activityID == 1 ? <Text>(d)</Text> : null}
																	</DataTable.Cell>
																	<DataTable.Cell>
																		{item.selectedAnswerID == item.correctAnswerID && item.activityID == 1
																			|| item.answerID == item.selectedAnswerID && item.activityID == 2
																			|| item.selectedAnswerID == item.answerText && item.activityID == 3 ?
																			<Text><Icon name="check" size={20} color="#0d9048" /></Text> :
																			<Text><Icon name="close" size={20} color="red" /></Text>
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
									<Text style={{ color: SWATheam.SwaBlack }}>Exam Question</Text>
									<View><Icon onPress={hideExamQuest} name="close" size={20} color="#9ba8ae" /></View>
								</View>
								<View style={styles.holderActQuest}>
									{actData.showQuestActId == 1 ?
										<>
											<View>
												<RenderHtml
													contentWidth={width}
													source={{ html: getquest.questionPart1 }}
													tagsStyles={tagsStyles}
												/>
												<View style={styles.optionsView}>
													{getquest?.optionText1 ?
														<View style={[styles.textWithInput, ({ backgroundColor: getquest.optionID1 == getquest.selectedAnswerID ? '#51e3b3' : "#e3e8ea" })]}>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(a)</Text>
																{getquest?.optionText1.endsWith('.png') || getquest?.optionText1.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText1 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: getquest?.optionText1 }}
																		tagsStyles={optionStyle}
																	/>
																}
															</View>
														</View>
														: null}
													{getquest?.optionText2 ?
														<View style={[styles.textWithInput, ({ backgroundColor: getquest.optionID2 == getquest.selectedAnswerID ? '#51e3b3' : "#e3e8ea" })]}>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(b)</Text>
																{getquest?.optionText2.endsWith('.png') || getquest?.optionText2.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText2 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: getquest?.optionText2 }}
																		tagsStyles={optionStyle}
																	/>
																}
															</View>
														</View>
														: null}

													{getquest?.optionText3 ?
														<View style={[styles.textWithInput, ({ backgroundColor: getquest.optionID3 == getquest.selectedAnswerID ? '#51e3b3' : "#e3e8ea" })]}>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(c)</Text>
																{getquest?.optionText3.endsWith('.png') || getquest?.optionText3.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText3 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: getquest?.optionText3 }}
																		tagsStyles={optionStyle}
																	/>

																}
															</View>
														</View>
														: null}

													{getquest?.optionText4 ?
														<View style={[styles.textWithInput, ({ backgroundColor: getquest.optionID4 == getquest.selectedAnswerID ? '#51e3b3' : "#e3e8ea" })]}>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(d)</Text>
																{getquest?.optionText4.endsWith('.png') || getquest?.optionText4.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText4 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: getquest?.optionText4 }}
																		tagsStyles={optionStyle}
																	/>
																}
															</View>
														</View>
														: null}

													{getquest?.optionText5 ?
														<View style={[styles.textWithInput, ({ backgroundColor: getquest.optionID5 == getquest.selectedAnswerID ? '#51e3b3' : "#e3e8ea" })]}>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(d)</Text>
																{getquest?.optionText5.endsWith('.png') || getquest?.optionText5.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText5 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: getquest?.optionText5 }}
																		tagsStyles={optionStyle}
																	/>
																}
															</View>
														</View>
														: null}

													{getquest?.optionText6 ?
														<View style={[styles.textWithInput, ({ backgroundColor: getquest.optionID6 == getquest.selectedAnswerID ? '#51e3b3' : "#e3e8ea" })]}>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(d)</Text>
																{getquest?.optionText6.endsWith('.png') || getquest?.optionText6.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText6 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: getquest?.optionText6 }}
																		tagsStyles={optionStyle}
																	/>
																}
															</View>
														</View>
														: null}


												</View>
											</View>
										</>
										: null
									}

									{actData.showQuestActId == 2 ?

										<View>
											<RenderHtml
												contentWidth={width}
												source={{ html: getquest?.questionPart1 }}
												tagsStyles={tagsStyles}
											/>
											<View style={styles.optionsView}>
												{getquest?.optionText1 ?
													<View style={styles.textWithInput}>
														<>
															<View style={styles.AWithContent}>
																<Text style={styles.indty}>(a)</Text>
																{getquest?.optionText1.endsWith('.png') || getquest?.optionText1.endsWith('.jpg') ?
																	<Image source={{ uri: ImgBase + getquest?.imagePath + getquest?.optionText1 }} style={{ width: 50, height: 50 }} />
																	:
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: getquest?.optionText1 }}
																		tagsStyles={optionStyle}
																	/>
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
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: getquest?.optionText2 }}
																		tagsStyles={optionStyle}
																	/>
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
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: getquest?.optionText3 }}
																		tagsStyles={optionStyle}
																	/>
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
																	<RenderHtml
																		contentWidth={width}
																		source={{ html: getquest?.optionText4 }}
																		tagsStyles={optionStyle}
																	/>
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

										: null}
									{actData.showQuestActId == 3 ?
										<>
											<View style={styles.holderView}>
												<RenderHtml
													contentWidth={width}
													source={{ html: getquest?.questionPart1 }}
													tagsStyles={optionStyle}
												/>
												<View style={styles.rowLines}>
													<Text style={styles.someBolds}>Your Answer:</Text>
													<Text>{getquest.selectedAnswerID}</Text>
												</View>
												<View style={styles.rowLines}>
													<Text style={styles.someBolds}>Correct Answer:</Text>
													<Text>{getquest?.answerText}</Text>
												</View>
											</View>
										</>
										:
										""}

								</View>
							</Modal>
						</View>
					}

					{/* student all report data */}

					{reportDat.reportList &&
						<View>
							<Modal animationType="slide">
								<View style={styles.allExamHeader}>
									<Text style={{ color: SWATheam.SwaBlack }} >Student All Exam Report</Text>
									<View><Icon name="close" size={20} color="#231e1a" onPress={hideReportList} /></View>
								</View>
								<ScrollView >
									{allReportData.map((item, index) => {
										return (
											<View style={styles.holderAllReport} key={index}>
												<View style={styles.rowCol}>
													<Text style={styles.columsStart}>Set Code :</Text>
													<Text style={{ color: SWATheam.SwaBlack }}>{item.qSetCode}</Text>
												</View>
												<View style={styles.rowCol}>
													<Text style={styles.columsStart}>Attempted Date :</Text>
													<Text style={{ color: SWATheam.SwaBlack }}>{item.dateOfAttempt}</Text>
												</View>
												<View style={styles.rowCol}>
													<Text style={styles.columsStart}>Status :</Text>
													<Text style={{ color: SWATheam.SwaBlack }}>Attempted :</Text>
												</View>
												<View style={styles.rowCol}>
													<Text style={styles.columsStart}>Action :</Text>
													<Text>
														<TouchableOpacity onPress={() => { viewReportSecond(item) }}>
															<Text style={[styles.viewReportBtn, { backgroundColor: userData.data.colors.mainTheme }]} >View Report</Text>
														</TouchableOpacity>
													</Text>
												</View>
											</View>
										)
									})}

								</ScrollView>
							</Modal>


						</View>
					}
					{/* student all report data */}
				</View>
			}
		</>
	);
}
const styles = StyleSheet.create({
	someBolds: {
		fontWeight: "bold",
		color: "#45ab4f"
	},
	rowLines: {
		marginBottom: 8,
		borderBottomWidth: 1,
		borderColor: "#bacec8",
	},
	questView: {
		fontWeight: "bold",
		fontSize: 15,
		color: '#000',
	},

	examView: {
		fontSize: 11,
		borderBottomWidth: 1,
		borderColor: "#e2e2e2",
		flexDirection: 'row-reverse'

	},
	columsStart: {
		width: 150,
		color: SWATheam.SwaBlack
	},
	rowCol: {
		flexDirection: 'row',
		padding: 5,
		borderColor: "#cfe2f3",
		borderBottomWidth: 1
	},
	holderAllReport: {
		borderWidth: 1,
		padding: 10,
		margin: 10,
		elevation: 1,
		borderColor: "#ccb9b9",
		borderRadius: 10,
		backgroundColor: "#fffff0"
	},
	questImgs: {
		width: "100%",
		minHeight: 200,
		resizeMode: "contain"
	},
	// inLineText: {
	// 	flexDirection: "row",
	// 	flexWrap: 'wrap',
	// },
	inputs_inner: {
		borderBottomWidth: 1,
		borderColor: SWATheam.SwaBlack,
		width: 100,
	},
	viewReportBtn: {
		fontSize: 13,
		borderRadius: 5,
		padding: 4,
		color: SWATheam.SwaWhite
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
		whiteSpace: "nowrap",
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
		marginVertical: 4,
		justifyContent: "space-between",
		alignItems: "center",
		paddingLeft: 4,
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
		justifyContent: 'center',
		alignItems: 'center',
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
		backgroundColor: 'rgba(52, 52, 52, 0.8)',
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
		whiteSpace: 'nowrap'
	},
	cell: {
		flex: 1,
		padding: 3,
		borderWidth: 1,
		textAlign: "center",
		fontSize: 12,
		color: SWATheam.SwaBlack,
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
		minHeight: "10%",
		color: SWATheam.SwaBlack
	},
	AWithContent: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
		alignItems: "center"
	},
	// inputs: {
	// 	width: "90%",
	// 	margin: 2,
	// 	height: 25,
	// 	padding: 3,
	// 	borderColor: "#dcdcdc",
	// 	borderWidth: 1,
	// 	backgroundColor: "#fff",
	// 	borderRadius: 3,
	// 	marginLeft: 25
	// },
	textWithInput2: {
		elevation: 1,
		borderWidth: 1,
		borderRadius: 50,
		padding: 8,
		borderColor: "#acb9dd",
		margin: 5

	},
	textWithInput: {
		width: "100%",
		flexDirection: 'row',
		flexWrap: 'wrap',
		// justifyContent: "space-between",
		// alignItems: "center",
		backgroundColor: "#f5f5f5",
		padding: 7,
		marginTop: 5
	},
	optionsText: {
		fontSize: 15,
		color: SWATheam.SwaBlack,
		borderRadius: 5,
	},
	questHolders: {
		flex: 1,
		padding: 10,

	},
	buttonBox: {
		marginLeft: 10,
	},
	rowFristCol: {
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: "center",
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
		backgroundColor: "#fff",
		position: "fixed",
		width: "100%",
		height: "100%",
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
		borderColor: "#f7f4ed",
		borderRadius: 3,
		margin: 10,
		borderWidth: 1,
		backgroundColor: "#fff",
		height: "80%",
		overflow: "auto",
		elevation: 5
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
	},
	optionsImgs: {
		minHeight: 60,
		minWidth: "30%",
		width: "100%",
		resizeMode: 'contain'
	}
});