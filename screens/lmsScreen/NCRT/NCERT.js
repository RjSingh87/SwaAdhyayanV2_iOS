import { StyleSheet, Text, View, Modal, Button, TextInput, Pressable, Alert, TouchableOpacity, Image, ScrollView, useWindowDimensions, KeyboardAvoidingView, Platform, StatusBar, SafeAreaView } from 'react-native';
import { useState, useContext } from 'react';
import { DataTable } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';
import Loader from '../../common/Loader';
import { Checkbox, RadioButton } from 'react-native-paper';
import { GlobleData } from '../../../Store';
import { SWATheam, apiRoot } from '../../../constant/ConstentValue';
import SwaHeader from '../../common/SwaHeader';
import Services from '../../../Services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MsgModal from '../../common/MsgModal';

export default function NCERT({ navigation, route }) {
	const insets = useSafeAreaInsets();
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
		},
		img: {
			maxWidth: 130,
			height: 'auto',
			resizeMode: 'contain',
		},
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
		},
		img: {
			maxWidth: 130,
			height: 'auto',
			resizeMode: 'contain',
		},
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
	const subjectID = route.params.selectedField.subject.subjectID




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
			"schoolID": userData.data.schoolID,
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
					let dd = getQuest.ncertQuestion[0]?.questionData || [];
					if (dd.length === 0) {
						setLoaders(false);
						Alert.alert('No questions found for the selected chapters.');
						return;
					}

					let ans = Array(dd.length);
					for (let i = 0; i < ans.length; i++) {
						ans[i] = {};
					}

					setStoreData(ans)
					setTotalQuest(dd.length);
					const getType = dd?.[currentQuestionIndex]?.activityID;
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
			return updatedValues;

		});
	};
	const [finalPost, setFinalPost] = useState([]);
	const attemptData = (questionData) => {
		const thisData = [];
		const prevData = finalPost;
		for (let i = 0; i < prevData.length; i++) {
			thisData.push(prevData[i])
		}

		let reAttempt = 0;
		for (let i = 0; i < thisData.length; i++) {
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
		setholderRepo((rep) => ({ ...rep, holderSuccess: false }));
		setReportData((pre) => ({
			...pre,
			attemptSuccess: true,
			afterClickView: false,
			reportList: false,
		}));
		setActData((pre) => ({
			...pre,
			modelHolder: false,
		}));
		navigation.goBack();
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
					if (finalAssess.status == "success") {
						setAreYouSure(false)
						setReportData((pre) => ({
							...pre,
							attemptSuccess: true,
							afterClickView: false,
						}))
						setholderRepo((pre) => {
							return {
								...pre,
								holderSuccess: true,
								successMsg: finalAssess.msg || "Exam Submitted Successfully!",
								runTimeQsetIds: finalAssess.qSetID
							}
						})

					} else {
						Alert.alert("Info", finalAssess.message);
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
		let ansArray = currentAns.selectedAnswerID.split(",");
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
		setLoaders(true);
		setreport([]);
		let setIds = item.qSetID;
		Services.post(apiRoot.studentNcertViewReport, { "qSetID": setIds })
			.then((finalAssess) => {
				setLoaders(false);
				if (finalAssess.status == "success") {
					setreport(finalAssess.data.reportData || []);
					let total = finalAssess.data.totalMarks;
					let opten = finalAssess.data.optainedMarks;
					let present = finalAssess.data.percentage || 0;
					let totlPresent = typeof present === 'number' ? parseFloat(present.toFixed(2)) : present;
					setReportData((pre) => ({
						...pre,
						totalMarks: total,
						optainedMarks: opten,
						preSent: totlPresent,
						attemptSuccess: false,
						afterClickView: true,
						reportList: false,
					}));
					setholderRepo((pre) => ({ ...pre, holderSuccess: true }));
				} else {
					Alert.alert("Info", finalAssess.message || "Report not found");
				}
			})
			.catch((err) => {
				setLoaders(false);
				console.log(err);
			});
	}

	function viewReport() {
		setLoaders(true);
		setreport([]);
		const qSetId = startingTestData.qSetIds || holderRepo.runTimeQsetIds;
		Services.post(apiRoot.studentNcertViewReport, { "qSetID": qSetId })
			.then((finalAssess) => {
				setLoaders(false);
				if (finalAssess.status == "success") {
					setreport(finalAssess.data.reportData || []);
					let total = finalAssess.data.totalMarks;
					let opten = finalAssess.data.optainedMarks;
					let present = finalAssess.data.percentage || 0;
					let totlPresent = typeof present === 'number' ? parseFloat(present.toFixed(2)) : present;
					setReportData((pre) => ({
						...pre,
						totalMarks: total,
						optainedMarks: opten,
						preSent: totlPresent,
						attemptSuccess: false,
						afterClickView: true,
						reportList: false,
					}));
					setholderRepo((pre) => ({ ...pre, holderSuccess: true }));
				} else {
					Alert.alert("Info", finalAssess.message || "Report not found");
				}
			})
			.catch((err) => {
				setLoaders(false);
				console.log(err);
			});
	}

	// action views 
	const [getquest, setGetQuest] = useState();
	const [actData, setActData] = useState({
		modelHolder: false,
		showQuestActId: ""
	});
	function hideExamQuest() {
		setActData((old) => ({ ...old, modelHolder: false }));
	}
	function viewAction(item) {
		let allItem = item;
		setGetQuest(allItem);
		setActData((old) => ({
			...old,
			modelHolder: true,
			showQuestActId: item.activityID,
		}));
	}
	function allAttemReport() {
		setLoaders(true);
		Services.post(apiRoot.studentAllNcertAttemptReport, { "userRefID": userData.data.userRefID })
			.then((atmtData) => {
				setLoaders(false);
				if (atmtData.status == "success") {
					setallReportData(atmtData.data || []);
					setReportData((s) => ({
						...s,
						reportList: true,
					}));
				} else {
					Alert.alert("Info", atmtData.message || "Failed to load attempt reports.");
				}
			})
			.catch((err) => {
				setLoaders(false);
				console.log(err);
			});
	}
	function hideReportList() {
		setReportData((s) => ({
			...s,
			reportList: false,
		}));
	}

	// HTML sanitization & entity decoding helpers
	const cleanHtmlEntities = (str) => {
		if (!str || typeof str !== 'string') return '';
		return str
			.replace(/&sbquo;?/gi, ',')
			.replace(/&nbsp;?/gi, ' ')
			.replace(/&amp;/gi, '&')
			.replace(/&quot;/gi, '"')
			.replace(/&#39;|&apos;/gi, "'")
			.replace(/&lt;/gi, '<')
			.replace(/&gt;/gi, '>')
			.replace(/&ndash;/gi, '–')
			.replace(/&mdash;/gi, '—')
			.replace(/&lsquo;|&rsquo;/gi, "'")
			.replace(/&ldquo;|&rdquo;/gi, '"')
			.replace(/&hellip;/gi, '...')
			.replace(/<MTECHO>/gi, '')
			.replace(/<\/MTECHO>/gi, '')
			.replace(/<[^>]+>/g, '')
			.trim();
	};

	const sanitizeHtml = (html) => {
		if (!html || typeof html !== 'string') return '';
		return html
			.replace(/&sbquo;?/gi, ',')
			.replace(/<MTECHO>/gi, '')
			.replace(/<\/MTECHO>/gi, '');
	};

	// fillData function
	const renderOptionFill = (optKey, imgKey) => {
		const items = question?.[currentQuestionIndex]?.[optKey];
		if (!items) return null;
		const splitArr = items.split('~__~');
		return splitArr.map((part, index) => {
			if (index !== splitArr.length - 1) {
				let value = storeData?.[currentQuestionIndex]?.[optKey]?.[index] || '';
				const imgName = question?.[currentQuestionIndex]?.[imgKey];
				return (
					<View key={`part-${optKey}-${index}`} style={styles.inLineText}>
						<RenderHtml
							contentWidth={width}
							source={{ html: sanitizeHtml(part) }}
							tagsStyles={tagsStyles}
						/>
						<TextInput
							value={value}
							placeholder="Type your answer here"
							onChangeText={(text) => onchangeGetData(currentQuestionIndex, text, optKey, index)}
							style={styles.inputs_inner}
						/>
						{imgName ? (
							<View>
								<Image
									source={{ uri: ImgBase + question?.[currentQuestionIndex]?.imagePath + imgName }}
									style={styles.optionsImgs}
								/>
							</View>
						) : null}
					</View>
				);
			}
			return (
				<RenderHtml
					key={`render-${optKey}-${index}`}
					contentWidth={width}
					source={{ html: sanitizeHtml(part) }}
					tagsStyles={optionStyle}
				/>
			);
		});
	};

	const optionText1Fun1 = () => renderOptionFill('optionText1', 'optionImage1');
	const optionText1Fun2 = () => renderOptionFill('optionText2', 'optionImage2');
	const optionText1Fun3 = () => renderOptionFill('optionText3', 'optionImage3');
	const optionText1Fun4 = () => renderOptionFill('optionText4', 'optionImage4');
	const optionText1Fun5 = () => renderOptionFill('optionText5', 'optionImage5');
	const optionText1Fun6 = () => renderOptionFill('optionText6', 'optionImage6');

	// Helper functions for Answer display, evaluation, and question view
	const isOptionChosen = (item, optIndex) => {
		if (!item) return false;
		const sId = item.selectedAnswerID ?? item.chouseOptID;
		if (sId === undefined || sId === null || sId === '' || sId === '0' || sId === 0) return false;
		const optId = item['optionID' + optIndex];
		if (optId && String(sId) === String(optId)) return true;
		if (String(sId) === String(optIndex)) return true;
		return false;
	};

	const isOptionCorrect = (item, optIndex) => {
		if (!item) return false;
		const cId = item.correctAnswerID ?? item.answerID;
		if (cId === undefined || cId === null || cId === '') return false;
		const optId = item['optionID' + optIndex];
		if (optId && String(cId) === String(optId)) return true;
		if (String(cId) === String(optIndex)) return true;
		return false;
	};

	const isItemCorrect = (item) => {
		if (!item) return false;

		const sId = item.selectedAnswerID ?? item.chouseOptID;
		if (sId === undefined || sId === null || sId === '' || sId === '0' || sId === 0 || sId === 'Not answered') {
			return false;
		}

		const actId = item.activityID;
		const cId = item.correctAnswerID ?? item.answerID;

		if (actId == 1 || (!actId && (item.optionText1 || item.optionID1))) { // MCQ
			if (sId && cId && String(sId).trim() === String(cId).trim()) return true;
			for (let i = 1; i <= 6; i++) {
				if (isOptionChosen(item, i) && isOptionCorrect(item, i)) {
					return true;
				}
			}
			return false;
		}

		if (actId == 2) { // True / False
			if (sId && cId && String(sId).trim() === String(cId).trim()) return true;
			return false;
		}

		// Fill in blanks / Subjective / other
		const userText = cleanHtmlEntities(item.chouseOptText || String(sId || '')).toLowerCase();
		const corrText = cleanHtmlEntities(item.answerText || item.correctOptText || '').toLowerCase();
		if (userText && corrText && userText === corrText) return true;

		return false;
	};

	const getCorrectAnswerDisplay = (item) => {
		if (!item) return '-';
		const actId = item.activityID;
		const cId = item.correctAnswerID ?? item.answerID;

		// Activity 1: MCQ
		if (actId == 1 || (!actId && (item.optionText1 || item.optionID1))) {
			for (let i = 1; i <= 6; i++) {
				if (isOptionCorrect(item, i)) {
					return `(${String.fromCharCode(96 + i)})`;
				}
			}
			if (item.correctOptText && item.correctOptText !== '0') {
				return cleanHtmlEntities(item.correctOptText);
			}
			if (item.answerText) {
				return cleanHtmlEntities(item.answerText);
			}
			return cId ? `(${cId})` : '-';
		}

		// Activity 2: True / False
		if (actId == 2) {
			if (item.correctOptText && item.correctOptText !== '0') {
				return cleanHtmlEntities(item.correctOptText);
			}
			if (item.answerText) {
				return cleanHtmlEntities(item.answerText);
			}
			if (item.correctAnswerID) {
				return String(item.correctAnswerID).split(',').map((pair) => {
					const parts = pair.split('-');
					if (parts.length === 2) {
						const subQ = String.fromCharCode(96 + parseInt(parts[0]));
						const val = parts[1] === '1' ? 'True' : 'False';
						return `(${subQ}) ${val}`;
					}
					return pair;
				}).join(', ');
			}
			return '-';
		}

		// Activity 3 / Subjective / Fill in blanks
		const text = item.answerText || item.correctOptText;
		if (text) {
			return cleanHtmlEntities(text);
		}
		return cId ? String(cId) : '-';
	};

	const getUserAnswerDisplay = (item) => {
		if (!item) return '-';
		const actId = item.activityID;
		const sId = item.selectedAnswerID ?? item.chouseOptID;

		if (sId === undefined || sId === null || sId === '' || sId === '0' || sId === 0) {
			return 'Not answered';
		}

		// Activity 1: MCQ
		if (actId == 1 || (!actId && (item.optionText1 || item.optionID1))) {
			for (let i = 1; i <= 6; i++) {
				if (isOptionChosen(item, i)) {
					return `(${String.fromCharCode(96 + i)})`;
				}
			}
			if (item.chouseOptText) {
				return cleanHtmlEntities(item.chouseOptText);
			}
			return `(${sId})`;
		}

		// Activity 2: True / False
		if (actId == 2) {
			if (typeof sId === 'string' && sId.includes('-')) {
				return sId.split(',').map((pair) => {
					const parts = pair.split('-');
					if (parts.length === 2) {
						const subQ = String.fromCharCode(96 + parseInt(parts[0]));
						const val = parts[1] === '1' ? 'True' : 'False';
						return `(${subQ}) ${val}`;
					}
					return pair;
				}).join(', ');
			}
			if (item.chouseOptText) {
				return cleanHtmlEntities(item.chouseOptText);
			}
			return cleanHtmlEntities(String(sId));
		}

		// Activity 3 / Subjective / Fill in blanks
		if (item.chouseOptText) {
			return cleanHtmlEntities(item.chouseOptText);
		}
		if (sId) {
			return cleanHtmlEntities(String(sId));
		}
		return 'Not answered';
	};

	// Renderers for Report screens
	const renderQuestionDetailView = () => {
		if (!getquest) return null;
		const qActId = actData.showQuestActId || getquest.activityID;

		return (
			<View style={{ flex: 1, backgroundColor: '#fff' }}>
				<View style={styles.allExamHeader}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<TouchableOpacity onPress={hideExamQuest} style={{ paddingRight: 10, paddingVertical: 4 }}>
							<AntDesign name="arrowleft" size={22} color={SWATheam.SwaBlack} />
						</TouchableOpacity>
						<Text style={{ color: SWATheam.SwaBlack, fontWeight: 'bold', fontSize: 16 }}>Exam Question</Text>
					</View>
					<TouchableOpacity onPress={hideExamQuest} style={{ padding: 4 }}>
						<AntDesign name="close" size={22} color="#555" />
					</TouchableOpacity>
				</View>
				<ScrollView style={{ flex: 1, padding: 15 }}>
					{[1, 2, 3, 4, 5].map((partNum) => {
						const partContent = getquest['questionPart' + partNum];
						if (!partContent) return null;
						const isImg =
							partContent.endsWith('.png') ||
							partContent.endsWith('.PNG') ||
							partContent.endsWith('.jpg') ||
							partContent.endsWith('.JPG') ||
							partContent.endsWith('.jpeg');
						return (
							<View key={`qPart-${partNum}`} style={{ marginBottom: 10 }}>
								{isImg ? (
									<Image
										source={{ uri: ImgBase + (getquest.imagePath || '') + partContent }}
										style={styles.questImgs}
										resizeMode="contain"
									/>
								) : (
									<RenderHtml
										contentWidth={width - 30}
										source={{ html: sanitizeHtml(partContent) }}
										tagsStyles={tagsStyles}
									/>
								)}
							</View>
						);
					})}

					{qActId == 1 && (
						<View style={{ marginTop: 10 }}>
							{[1, 2, 3, 4, 5, 6].map((optNum) => {
								const optText = getquest['optionText' + optNum];
								if (!optText) return null;
								const isUser = isOptionChosen(getquest, optNum);
								const isCorr = isOptionCorrect(getquest, optNum);
								const isImg =
									optText.endsWith('.png') ||
									optText.endsWith('.PNG') ||
									optText.endsWith('.jpg') ||
									optText.endsWith('.JPG');

								let borderColor = '#e0e0e0';
								let bgColor = '#f8f9fa';
								if (isCorr && isUser) {
									borderColor = '#28a745';
									bgColor = '#d4edda';
								} else if (isCorr) {
									borderColor = '#28a745';
									bgColor = '#e8f5e9';
								} else if (isUser) {
									borderColor = '#dc3545';
									bgColor = '#f8d7da';
								}

								return (
									<View
										key={`mcqOpt-${optNum}`}
										style={[
											styles.textWithInput,
											{
												borderColor: borderColor,
												borderWidth: 1.5,
												backgroundColor: bgColor,
												borderRadius: 8,
												padding: 10,
												marginBottom: 8,
												flexDirection: 'row',
												justifyContent: 'space-between',
												alignItems: 'center',
											},
										]}
									>
										<View style={[styles.AWithContent, { flex: 1 }]}>
											<Text style={[styles.indty, { fontWeight: 'bold' }]}>
												({String.fromCharCode(96 + optNum)})
											</Text>
											{isImg ? (
												<Image
													source={{ uri: ImgBase + (getquest.imagePath || '') + optText }}
													style={{ width: 50, height: 50, resizeMode: 'contain' }}
												/>
											) : (
												<RenderHtml
													contentWidth={width - 120}
													source={{ html: sanitizeHtml(optText) }}
													tagsStyles={optionStyle}
												/>
											)}
										</View>
										<View style={{ marginLeft: 8 }}>
											{isCorr && isUser && (
												<Text style={{ color: '#28a745', fontWeight: 'bold', fontSize: 11 }}>
													✓ Correct & Your Ans
												</Text>
											)}
											{isCorr && !isUser && (
												<Text style={{ color: '#28a745', fontWeight: 'bold', fontSize: 11 }}>
													✓ Correct Ans
												</Text>
											)}
											{!isCorr && isUser && (
												<Text style={{ color: '#dc3545', fontWeight: 'bold', fontSize: 11 }}>
													✗ Your Ans
												</Text>
											)}
										</View>
									</View>
								);
							})}
						</View>
					)}

					{qActId == 2 && (
						<View style={{ marginTop: 10 }}>
							{[1, 2, 3, 4, 5, 6].map((optNum) => {
								const optText = getquest['optionText' + optNum];
								if (!optText) return null;
								const isImg =
									optText.endsWith('.png') ||
									optText.endsWith('.PNG') ||
									optText.endsWith('.jpg') ||
									optText.endsWith('.JPG');

								const isUserTrue = getquest.selectedAnswerID?.includes(`${optNum}-1`);
								const isUserFalse = getquest.selectedAnswerID?.includes(`${optNum}-2`);

								return (
									<View
										key={`tnfOpt-${optNum}`}
										style={{
											borderWidth: 1,
											borderColor: '#e0e0e0',
											borderRadius: 8,
											padding: 10,
											marginBottom: 10,
											backgroundColor: '#fff',
										}}
									>
										<View style={styles.AWithContent}>
											<Text style={[styles.indty, { fontWeight: 'bold' }]}>
												({String.fromCharCode(96 + optNum)})
											</Text>
											{isImg ? (
												<Image
													source={{ uri: ImgBase + (getquest.imagePath || '') + optText }}
													style={{ width: 50, height: 50, resizeMode: 'contain' }}
												/>
											) : (
												<RenderHtml
													contentWidth={width - 80}
													source={{ html: sanitizeHtml(optText) }}
													tagsStyles={optionStyle}
												/>
											)}
										</View>
										<View style={[styles.buttonRows, { marginTop: 8 }]}>
											<View
												style={[
													styles.btnTNF,
													{
														backgroundColor: isUserTrue ? '#28a745' : '#e9ecef',
														paddingVertical: 6,
														paddingHorizontal: 16,
														borderRadius: 6,
													},
												]}
											>
												<Text
													style={{
														textAlign: 'center',
														color: isUserTrue ? '#fff' : '#333',
														fontWeight: '600',
													}}
												>
													True {isUserTrue ? '(Your Choice)' : ''}
												</Text>
											</View>
											<View
												style={[
													styles.btnTNF,
													{
														backgroundColor: isUserFalse ? '#dc3545' : '#e9ecef',
														paddingVertical: 6,
														paddingHorizontal: 16,
														borderRadius: 6,
														marginLeft: 10,
													},
												]}
											>
												<Text
													style={{
														textAlign: 'center',
														color: isUserFalse ? '#fff' : '#333',
														fontWeight: '600',
													}}
												>
													False {isUserFalse ? '(Your Choice)' : ''}
												</Text>
											</View>
										</View>
									</View>
								);
							})}
						</View>
					)}

					<View
						style={{
							marginTop: 18,
							marginBottom: 30,
							padding: 16,
							backgroundColor: '#f8f9fa',
							borderRadius: 10,
							borderWidth: 1,
							borderColor: '#dee2e6',
						}}
					>
						<View style={{ marginBottom: 14 }}>
							<Text style={{ fontWeight: 'bold', color: SWATheam.SwaBlack, fontSize: 14, marginBottom: 6 }}>
								Your Answer:
							</Text>
							<View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: isItemCorrect(getquest) ? '#a3d9a5' : '#f5c6cb' }}>
								<Text style={{ color: isItemCorrect(getquest) ? '#2e7d32' : '#c62828', fontSize: 14, fontWeight: '500' }}>
									{getUserAnswerDisplay(getquest)}
								</Text>
							</View>
						</View>

						<View style={{ marginBottom: 10 }}>
							<Text style={{ fontWeight: 'bold', color: '#1b5e20', fontSize: 14, marginBottom: 6 }}>
								Correct Answer:
							</Text>
							<View style={{ backgroundColor: '#e8f5e9', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#c3e6cb' }}>
								<Text style={{ color: '#155724', fontWeight: '600', fontSize: 14 }}>
									{getCorrectAnswerDisplay(getquest)}
								</Text>
							</View>
						</View>

						{getquest.marks != null && (
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#dee2e6', paddingTop: 10, marginTop: 8 }}>
								<Text style={{ color: '#666', fontSize: 13 }}>Result / Marks:</Text>
								<Text style={{ color: isItemCorrect(getquest) ? '#28a745' : '#dc3545', fontWeight: 'bold', fontSize: 13 }}>
									{isItemCorrect(getquest) ? `Correct (${getquest.marks} marks)` : 'Incorrect (0 marks)'}
								</Text>
							</View>
						)}
					</View>
				</ScrollView>
			</View>
		);
	};

	const renderAllReportsView = () => {
		return (
			<View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
				<View style={styles.allExamHeader}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<TouchableOpacity onPress={hideReportList} style={{ paddingRight: 10, paddingVertical: 4 }}>
							<AntDesign name="arrowleft" size={22} color={SWATheam.SwaBlack} />
						</TouchableOpacity>
						<Text style={{ color: SWATheam.SwaBlack, fontWeight: 'bold', fontSize: 16 }}>
							Student All Exam Report
						</Text>
					</View>
					<TouchableOpacity onPress={hideReportList} style={{ padding: 4 }}>
						<AntDesign name="close" size={22} color="#555" />
					</TouchableOpacity>
				</View>
				<ScrollView style={{ flex: 1, padding: 10 }}>
					{allReportData && allReportData.length > 0 ? (
						allReportData.map((item, index) => (
							<View style={styles.holderAllReport} key={index}>
								<View style={styles.rowCol}>
									<Text style={styles.columsStart}>Set Code :</Text>
									<Text style={{ color: SWATheam.SwaBlack, fontWeight: '600' }}>
										{item.qSetCode || item.qSetID || '-'}
									</Text>
								</View>
								<View style={styles.rowCol}>
									<Text style={styles.columsStart}>Attempted Date :</Text>
									<Text style={{ color: SWATheam.SwaBlack }}>{item.dateOfAttempt || '-'}</Text>
								</View>
								{item.totalMarks != null && (
									<View style={styles.rowCol}>
										<Text style={styles.columsStart}>Score :</Text>
										<Text style={{ color: SWATheam.SwaBlack }}>
											{item.optainedMarks ?? 0} / {item.totalMarks} ({item.percentage ?? 0}%)
										</Text>
									</View>
								)}
								<View style={styles.rowCol}>
									<Text style={styles.columsStart}>Status :</Text>
									<Text style={{ color: '#28a745', fontWeight: '600' }}>Attempted</Text>
								</View>
								<View
									style={[
										styles.rowCol,
										{ justifyContent: 'flex-end', borderBottomWidth: 0, paddingTop: 10 },
									]}
								>
									<TouchableOpacity
										onPress={() => viewReportSecond(item)}
										style={{
											backgroundColor: userData?.data?.colors?.mainTheme || '#0d6efd',
											paddingHorizontal: 14,
											paddingVertical: 7,
											borderRadius: 6,
										}}
									>
										<Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>
											View Report
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						))
					) : (
						<View style={{ padding: 40, alignItems: 'center' }}>
							<Text style={{ color: '#888', fontSize: 15 }}>No past attempt reports found.</Text>
						</View>
					)}
				</ScrollView>
			</View>
		);
	};

	const renderExamReportTableView = () => {
		return (
			<View style={{ flex: 1, backgroundColor: '#fff' }}>
				<View style={styles.headerHolder}>
					<Text style={{ color: SWATheam.SwaBlack, fontWeight: 'bold', fontSize: 16 }}>
						Student Exam Report
					</Text>
					<TouchableOpacity onPress={closeReportHolder} style={{ padding: 4 }}>
						<AntDesign name="close" size={22} color="#9ba8ae" />
					</TouchableOpacity>
				</View>

				<View style={styles.table}>
					<View style={styles.headesHead}>
						<Text style={{ fontWeight: 'bold', fontSize: 15, color: SWATheam.SwaBlack }}>Exam Report</Text>
						<TouchableOpacity
							onPress={allAttemReport}
							style={{ backgroundColor: '#0c8781', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5 }}
						>
							<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Attempt Report</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.rowHed}>
						<Text style={styles.cell}>Total Marks: {reportDat.totalMarks ?? '-'}</Text>
						<Text style={styles.cell}>Obtained Marks: {reportDat.optainedMarks ?? '-'}</Text>
						<Text style={styles.cell}>Percentage: {reportDat.preSent ?? '-'}%</Text>
					</View>
				</View>

				<ScrollView style={{ flex: 1 }}>
					<View style={styles.InnerBoxTbls}>
						<DataTable style={styles.container}>
							<DataTable.Header style={styles.tableHeader}>
								<DataTable.Title style={{ flex: 0.5 }}>
									<Text style={{ fontWeight: 'bold', color: SWATheam.SwaBlack }}>No.</Text>
								</DataTable.Title>
								<DataTable.Title style={{ flex: 1.35, paddingRight: 8 }}>
									<Text style={{ fontWeight: 'bold', color: SWATheam.SwaBlack }}>Correct Ans</Text>
								</DataTable.Title>
								<DataTable.Title style={{ flex: 1.35, paddingLeft: 8 }}>
									<Text style={{ fontWeight: 'bold', color: SWATheam.SwaBlack }}>Your Ans</Text>
								</DataTable.Title>
								<DataTable.Title style={{ flex: 0.8, justifyContent: 'center' }}>
									<Text style={{ fontWeight: 'bold', color: SWATheam.SwaBlack }}>Status</Text>
								</DataTable.Title>
								<DataTable.Title style={{ flex: 1.0, justifyContent: 'center' }}>
									<Text style={{ fontWeight: 'bold', color: SWATheam.SwaBlack }}>Action</Text>
								</DataTable.Title>
							</DataTable.Header>

							{getReport && getReport.length > 0 ? (
								getReport.map((item, index) => {
									const itemCorrect = isItemCorrect(item);
									return (
										<DataTable.Row key={index} style={{ borderBottomColor: '#f0f0f0', minHeight: 48, paddingVertical: 4 }}>
											<DataTable.Cell style={{ flex: 0.5 }}>
												<Text style={{ color: SWATheam.SwaBlack }}>{index + 1}.</Text>
											</DataTable.Cell>
											<DataTable.Cell style={{ flex: 1.35, paddingRight: 8 }}>
												<Text style={{ color: '#1b5e20', fontWeight: '600' }}>
													{getCorrectAnswerDisplay(item)}
												</Text>
											</DataTable.Cell>
											<DataTable.Cell style={{ flex: 1.35, paddingLeft: 8 }}>
												<Text style={{ color: itemCorrect ? '#2e7d32' : '#c62828', fontWeight: '500' }}>
													{getUserAnswerDisplay(item)}
												</Text>
											</DataTable.Cell>
											<DataTable.Cell style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
												{itemCorrect ? (
													<Image style={{ resizeMode: 'contain', width: 20, height: 20 }} source={require('../../assets/r.png')} />
												) : (
													<Image style={{ resizeMode: 'contain', width: 20, height: 20 }} source={require('../../assets/w.png')} />
												)}
											</DataTable.Cell>
											<DataTable.Cell style={{ flex: 1.0, justifyContent: 'center', alignItems: 'center' }}>
												<TouchableOpacity onPress={() => viewAction(item)} style={{ padding: 4 }}>
													<Text style={styles.viewQuestionBtns}>View Q.</Text>
												</TouchableOpacity>
											</DataTable.Cell>
										</DataTable.Row>
									);
								})
							) : (
								<View style={{ padding: 20, alignItems: 'center' }}>
									<Text style={{ color: '#888' }}>No report questions found.</Text>
								</View>
							)}
						</DataTable>
					</View>
				</ScrollView>
			</View>
		);
	};

	const renderSubmittedSuccessView = () => {
		return (
			<View style={styles.modalOverlay}>
				<View style={[styles.modalContainer, { minHeight: 250, maxHeight: 320, padding: 20, justifyContent: 'center' }]}>
					<View style={[styles.headerHolder, { backgroundColor: 'transparent', paddingHorizontal: 0, marginBottom: 15 }]}>
						<Text style={{ color: SWATheam.SwaBlack, fontWeight: 'bold', fontSize: 16 }}>
							Student Exam Report
						</Text>
						<TouchableOpacity onPress={closeReportHolder} style={{ padding: 4 }}>
							<AntDesign name="close" size={22} color="#9ba8ae" />
						</TouchableOpacity>
					</View>
					<View style={styles.showSms}>
						<Image
							style={{ resizeMode: 'contain', width: 60, height: 60, alignSelf: 'center', marginBottom: 15 }}
							source={require('../../assets/mark.png')}
						/>
						<Text style={styles.youHaveSucc}>
							{holderRepo.successMsg || 'Exam Submitted Successfully!'}
						</Text>
						<View style={styles.viewReortBtns}>
							<Button
								title="View Report"
								color={SWATheam.SwaWhite}
								onPress={viewReport}
							/>
						</View>
					</View>
				</View>
			</View>
		);
	};
	const isReportModalVisible = Boolean(holderRepo.holderSuccess || reportDat.reportList || actData.modelHolder);

	return (
		<>
			{loader ?
				<Loader /> :
				<View style={{ flex: 1, paddingTop: insets.top, backgroundColor: userData.data.colors.mainTheme, marginBottom: insets.bottom }}>
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
											<Text style={styles.textSmall}>Attempted Questions : {finalPost.length}</Text>
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
													<View style={{ flexDirection: 'row' }}>
														<Text style={{ fontWeight: 'bold' }}>{currentQuestionIndex + 1}. </Text>
														{
															question[currentQuestionIndex]?.questionPart1.endsWith('.png') ||
																question[currentQuestionIndex]?.questionPart1.endsWith('.PNG') ||
																question[currentQuestionIndex]?.questionPart1.endsWith('.JPG') ||
																question[currentQuestionIndex]?.questionPart1.endsWith('.jpg') ?
																<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart1 }} style={styles.questImgs} />
																:
																<RenderHtml
																	contentWidth={width}
																	source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart1) }}
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
																	source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart2) }}
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
																	source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart3) }}
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
																	source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart4) }}
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
																	source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart5) }}
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
																		source={{ html: sanitizeHtml(question[currentQuestionIndex]?.optionText1) }}
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
																		source={{ html: sanitizeHtml(question[currentQuestionIndex]?.optionText2) }}
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
																		source={{ html: sanitizeHtml(question[currentQuestionIndex]?.optionText3) }}
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
																		source={{ html: sanitizeHtml(question[currentQuestionIndex]?.optionText4) }}
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
																		source={{ html: sanitizeHtml(question[currentQuestionIndex]?.optionText5) }}
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
																		source={{ html: sanitizeHtml(question[currentQuestionIndex]?.optionText6) }}
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
															<View style={{ flexDirection: 'row' }}>
																<Text style={{ fontWeight: 'bold' }}>{currentQuestionIndex + 1}. </Text>
																{
																	question[currentQuestionIndex]?.questionPart1.endsWith('.png') ||
																		question[currentQuestionIndex]?.questionPart1.endsWith('.PNG') ||
																		question[currentQuestionIndex]?.questionPart1.endsWith('.JPG') ||
																		question[currentQuestionIndex]?.questionPart1.endsWith('.jpg') ?
																		<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart1 }} style={styles.questImgs} />
																		:
																		<RenderHtml
																			contentWidth={width}
																			source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart1) }}
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
																			source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart2) }}
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
																			source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart3) }}
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
																			source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart4) }}
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
																			source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart5) }}
																			tagsStyles={tagsStyles}
																		/>
																}
															</View>
															: null}

														<View style={styles.optionsView}>
															{question[currentQuestionIndex]?.optionText1 ?
																<View style={{ flexDirection: "row", flexWrap: 'wrap', backgroundColor: "#e5e7eb", paddingHorizontal: 5, paddingVertical: 10, margin: 5 }}>
																	<Text style={{ width: 30, fontWeight: "bold" }}>(a)</Text>
																	<View>
																		{question[currentQuestionIndex]?.optionText1.endsWith('.png') || question[currentQuestionIndex]?.optionText1.endsWith('.jpg') ?
																			<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.optionText1 }} style={{ width: 50, height: 50 }} />
																			:
																			<View style={{ padding: 0 }}>
																				{optionText1Fun1()}
																			</View>
																		}
																	</View>
																</View>
																: ''}
															{question[currentQuestionIndex]?.optionText2 ?
																<View style={{ flexDirection: "row", flexWrap: 'wrap', backgroundColor: "#e5e7eb", padding: 5, margin: 5 }}>
																	<Text style={{ width: 30, fontWeight: "bold" }}>(b)</Text>
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
																<View style={{ flexDirection: "row", flexWrap: 'wrap', backgroundColor: "#e5e7eb", padding: 5, margin: 5 }}>
																	<Text style={{ width: 30, fontWeight: "bold" }}>(c)</Text>
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

																<View style={{ flexDirection: "row", flexWrap: 'wrap', backgroundColor: "#e5e7eb", padding: 5, margin: 5 }}>
																	<Text style={{ width: 30, fontWeight: "bold" }}>(d)</Text>
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

																<View style={{ flexDirection: "row", flexWrap: 'wrap', backgroundColor: "#e5e7eb", padding: 5, margin: 5 }}>
																	<Text style={{ width: 30, fontWeight: "bold" }}>(e)</Text>
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
																<View style={{ flexDirection: "row", flexWrap: 'wrap', backgroundColor: "#e5e7eb", padding: 5, margin: 5 }}>
																	<Text style={{ width: 30, fontWeight: "bold" }}>(f)</Text>
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
															<View style={{ flexDirection: 'row' }}>
																<Text style={{ fontWeight: 'bold' }}>{currentQuestionIndex + 1}. </Text>
																{
																	question[currentQuestionIndex]?.questionPart1.endsWith('.png') ||
																		question[currentQuestionIndex]?.questionPart1.endsWith('.PNG') ||
																		question[currentQuestionIndex]?.questionPart1.endsWith('.JPG') ||
																		question[currentQuestionIndex]?.questionPart1.endsWith('.jpg') ?
																		<Image source={{ uri: ImgBase + question[currentQuestionIndex]?.imagePath + question[currentQuestionIndex]?.questionPart1 }} style={styles.questImgs} />
																		:
																		<RenderHtml
																			contentWidth={width}
																			source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart1) }}
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
																			source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart2) }}
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
																			source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart3) }}
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
																			source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart4) }}
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
																			source={{ html: sanitizeHtml(question[currentQuestionIndex].questionPart5) }}
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
																					source={{ html: sanitizeHtml(question[currentQuestionIndex]?.optionText1) }}
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
																					source={{ html: sanitizeHtml(question[currentQuestionIndex]?.optionText2) }}
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
																					source={{ html: sanitizeHtml(question[currentQuestionIndex]?.optionText3) }}
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
																					source={{ html: sanitizeHtml(question[currentQuestionIndex]?.optionText4) }}
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
											let chapterName = ""
											if (subjectID == 1) {
												chapterName = item.chapterNameLang2
											} else {
												chapterName = item.chapterName
											}
											return (
												<View key={index}>

													<Pressable
														style={styles.examView}
														onPress={() => chapterFun(item)}
													>
														{selectedIds.includes(item.chapterID) ? (
															<AntDesign
																name={"checksquareo"}
																color={SWATheam.SwaBlack}
																size={18}
																style={{ width: 25, padding: 3 }}
															/>
														) : (
															<Feather
																name={"square"}
																color={SWATheam.SwaBlack}
																size={20}
																style={{ width: 25, padding: 1 }}
															/>
														)}

														<Text style={{ marginLeft: 8 }}>{chapterName}</Text>
													</Pressable>


													{/* <Checkbox.Item
														reverse={false}
														labelStyle={{ fontSize: 13 }}
														onPress={() => { chapterFun(item) }}
														label={chapterName}
														status={selectedIds.includes(item.chapterID) ? "checked" : 'unchecked'}
														style={[styles.examView, { backgroundColor: selectedIds.includes(item.chapterID) ? "#e2f7ee" : "#fff" }]}
													/> */}
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

					{/* Modal 1: Are you sure submit modal */}
					{areYouSure && (
						<Modal
							animationType="fade"
							transparent={true}
							visible={areYouSure}
							onRequestClose={() => setAreYouSure(false)}
						>
							<View style={styles.modalOverlay}>
								<View style={styles.innerBox}>
									<Image style={{ resizeMode: 'contain', width: 70, height: 70, alignSelf: "center", marginBottom: 15 }} source={require('../../assets/mark.png')} />
									<Text style={styles.textAlinCenetr}>Are you sure?</Text>
									<Text style={styles.runningTest}>Do you want to submit your exam?</Text>
									<View style={styles.rowAreYousure}>
										<View style={{ width: 90 }}>
											<Button onPress={() => { submitAssessment(0) }}
												title="Cancel"
												color="#dc143c"
											/>
										</View>
										<View style={{ width: 90 }}>
											<Button onPress={() => { submitAssessment(1) }}
												title="OK"
												color="#228b22"
											/>
										</View>
									</View>
								</View>
							</View>
						</Modal>
					)}

					{/* Modal 2: Unified Report Modal (Exam Report, All Attempts, View Q.) */}
					{isReportModalVisible && (
						<Modal
							animationType="slide"
							visible={isReportModalVisible}
							onRequestClose={() => {
								if (actData.modelHolder) {
									hideExamQuest();
								} else if (reportDat.reportList) {
									hideReportList();
								} else {
									closeReportHolder();
								}
							}}
						>
							<SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top }}>
								{actData.modelHolder
									? renderQuestionDetailView()
									: reportDat.reportList
										? renderAllReportsView()
										: reportDat.afterClickView
											? renderExamReportTableView()
											: renderSubmittedSuccessView()}
							</SafeAreaView>
						</Modal>
					)}
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
		flex: 1,
		flexDirection: 'row',
		alignItems: "center",
		paddingVertical: 8,
		backgroundColor: SWATheam.SwaWhite,
		marginVertical: 3,
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
	inLineText: {
		// flexDirection: "row",
		// flexWrap: 'wrap',
	},
	inputs_inner: {
		borderBottomWidth: 1,
		marginTop: 20,
		borderStyle: 'solid',
		borderColor: SWATheam.SwaBlack,
		minWidth: '100%',
		maxWidth: '100%',
		height: 50,
		backgroundColor: SWATheam.SwaWhite
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
		backgroundColor: "#c7f0fe",
	},
	headerHolder: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#e3e8ea',
		marginTop: 0,
	},
	headerCloseIcons: {
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
		backgroundColor: "#e3e8ea",
		marginTop: 60,
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
		flex: 1,
		backgroundColor: '#fff',
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
		marginTop: 10,
		backgroundColor: SWATheam.SwaBlue,
		borderRadius: 20,
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
		borderColor: '#a7e237',
		borderRadius: 10,
		margin: 20,
	},
	ReportHolder: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 0,

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
		minHeight: 100,
		maxHeight: 120,
		marginVertical: 10,
		resizeMode: 'contain'
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.35)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 30,
	},

	modalContainer: {
		width: '100%',
		minHeight: 400,
		maxHeight: '85%',
		backgroundColor: '#fff',
		borderRadius: 12,
		overflow: 'hidden',
	},
});