import { StyleSheet, } from 'react-native';
import React, { useState, useEffect } from 'react';
import Services from './Services';
import { apiRoot } from './constant/ConstentValue';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MsgModal from './screens/common/MsgModal';
export const GlobleData = React.createContext()
export default function Store({ navigation, children }) {
	const [userData, setUserData] = useState({ data: null, message: '', isLogin: false })
	const [msgModalVisible, setMsgModalVisible] = useState({ msg: '', status: false, type: '' })
	const [isAutoSubmit, setIsAutoSubmit] = useState(false)

	useEffect(() => {
		checkLogin()
	}, [navigation])

	// ----------------- check login function start --------------------//
	async function checkLogin() {
		const loginUserData = await AsyncStorage.getItem("logedInUserdata")
		if (loginUserData != null) {
			const fData = JSON.parse(loginUserData)
			setUserData((prev) => {
				return { ...prev, data: fData.data, isLogin: true }
			})
		}
	}
	// ----------------- check login function end --------------------//

	// --------------- login function start --------------- //
	async function login(data, userType, navigation) {
		const payload = {
			"userName": data.userId
		}
		if (userType == 1) {
			payload["password"] = data.password
		}
		Services.post(apiRoot.appLogin, payload)
			.then((res) => {
				if (res.status == "success") {
					// console.log(res.data, 'check userData----------???')
					AsyncStorage
						.setItem("logedInUserdata", JSON.stringify(res))
						.then((res) => console.log("Done"))
						.catch((err) => { console.log(err) })
					setUserData((prev) => {
						return { ...prev, data: res.data, isLogin: true }
					})
					setMsgModalVisible((prev) => {
						return { ...prev, msg: "Login Successful.", status: true, type: 'success' }
					})
					setTimeout(() => {
						setMsgModalVisible((prev) => {
							return { ...prev, status: false }
						})
					}, 1500)
					// navigation.navigate('home')
				} else if (res.status == "error") {
					setMsgModalVisible((prev) => {
						return { ...prev, msg: res.message, status: true, type: 'error' }
					})
					setTimeout(() => {
						setMsgModalVisible((prev) => {
							return { ...prev, status: false }
						})
					}, 1500)
					setUserData((prev) => {
						return { ...prev, message: res.message }
					})
				}
			})
			.catch((error) => {
				console.log(error)
			})
			.finally(() => {
			})
	}
	// ---------------- login function end --------------- //
	// --------------- logout function start -------------//

	function logOut(navigation, type) {
		AsyncStorage.removeItem('logedInUserdata')
		setUserData((prev) => {
			return { ...prev, data: null, isLogin: false, type: type }
		})
	}

	// --------------- logout function end -------------//
	// ------------Assessment store --------------------//
	// useEffect(() => {
	// 	getGenerateAsslist();
	// }, [])

	const [isDec, setIsdec] = useState(false)
	const [attemptStore, setattemptStore] = useState({
		assMentIds: "",
		assName: "",
		sujectIds: ""
	});
	const [jumble, setJumble] = useState({
		optLine1: "",
		optLine2: "",
		optLine3: "",
		optLine4: "",
		optLine5: "",
		optLine6: "",
		optLine7: "",
		optLine8: "",
	})
	const [dropedData, setDropedData] = useState([]);
	const [matchLines, setmatchLines] = useState({});
	const [finalArrayData, setFinalArray] = useState([])
	const [finalPost, setFinalPost] = useState([]);
	const [matchTo, setMatchTo] = useState()
	const [connections, setConnections] = useState([]);
	const [selectedTexts, setSelectedTexts] = useState({});
	// const [assessList, setAssessList] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0)
	const [options1, setOptions1] = useState();
	const [sure, setSure] = useState(false);
	const [manageData, setManageData] = useState({
		showLoader: false,
		AssName: "",
		questions: '',
		status: false,
		qNumber: 1,
		siteUtls: "",
		totalQuest: '',
		TotlMks: ""
	})

	// useEffect(() => {
	// 	getGenerateAsslist();
	// }, [])

	useEffect(() => {
		if (manageData.questions[currentIndex]?.activityID === 9) {
			setDropedData([])
		}
	}, [currentIndex])


	function attemptWaiting(item) {
		setattemptStore((p) => {
			return {
				...p,
				assMentIds: item.assessmentID,
				assName: item.assessmentName,
				sujectIds: item.subjectID,
			}
		})
	}

	function getAssQuest() {
		setManageData((o) => {
			return { ...o, showLoader: true }
		})
		const payload = {
			"schoolID": userData?.data?.schoolID,
			"userRefID": userData?.data?.userRefID,
			"classID": userData?.data?.classID,
			"assessmentID": attemptStore.assMentIds
		}
		console.log(payload)
		Services.post(apiRoot.getAssessmentQuestion, payload)
			.then((res) => {

				if (res.status == "success") {
					setManageData((o) => {
						return {
							...o,
							showLoader: false,
							status: true,
							questions: res.assessmentQues,
							siteUtls: res.siteUrl,
							TotlMks: res.totalMarks,
							totalQuest: res.assessmentQues.length,
						}
					})
					let dd = res.assessmentQues;
					let ans = Array(dd.length);
					for (let i = 0; i < ans.length; i++) {
						ans[i] = {};
					}
					setStoreData(ans)
				} else {
					alert(res.message)
				}
			})
			.catch((err) => {
				alert(err)
			})
			.finally(() => {
				setManageData((o) => {
					return { ...o, showLoader: false }
				})
			})
	}
	function next() {
		if (manageData.questions[currentIndex]?.activityID === 4) {
			matchingDataFun();
		}
		else if (manageData.questions[currentIndex]?.activityID === 10) {
			jumBlePayLoad();
		}
		else if (manageData.questions[currentIndex]?.activityID === 12) {
			dropDownList();
		}
		else if (manageData.questions[currentIndex]?.activityID === 9) {
			dragDrop();
		}
		else if (manageData.questions[currentIndex]?.activityID === 15) {
			discriptions();
		}

		setCurrentIndex(currentIndex + 1)
		setManageData((pre) => {
			return { ...pre, qNumber: pre.qNumber + 1 };
		})

	}
	function prev() {
		if (manageData.questions[currentIndex]?.activityID === 4) {
			matchingDataFun();
		} else if (manageData.questions[currentIndex]?.activityID === 10) {
			jumBlePayLoad();
		}
		else if (manageData.questions[currentIndex]?.activityID === 12) {
			dropDownList();
		}
		else if (manageData.questions[currentIndex]?.activityID === 9) {
			dragDrop();
		}
		else if (manageData.questions[currentIndex]?.activityID === 15) {
			discriptions();
		}
		setCurrentIndex(currentIndex - 1)
		setManageData((pre) => {
			return { ...pre, qNumber: pre.qNumber - 1 };
		})
	}

	// data Stor
	const attemptData = (assessmentQues) => {
		const thisData = [];
		const prevData = finalPost;
		prevData.map((item) => {
			thisData.push(item);
		});

		let reAttempt = 0;
		thisData.map((item, index) => {
			if (assessmentQues.quesID == item.quesID) {
				reAttempt = 1;
				thisData[index] = assessmentQues;
			}
		});

		if (!reAttempt) {
			thisData.push(assessmentQues);
		}
		// console.log(thisData, 'thisdata')
		setFinalPost(thisData);

	}

	function mcqClicked(optIds, quetIds, OptText) {
		let getMarks = manageData.questions[currentIndex].marksPerQuestion;
		let rightAnsText = manageData.questions[currentIndex].answerText;
		let ansIds = manageData.questions[currentIndex].answerIDs;
		// alert(OptText)
		const mcqContainer = {
			"quesID": quetIds,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": userData?.data?.classID,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": optIds,
			"quesOptionText": OptText,
			"StudentResult": "-1",
			"marks": getMarks,
			"rightAnsText": rightAnsText,
			"rightAnsID": ansIds,
			"QueSubCatagory": "1-1",
			"pendingTime": '0',
			"eidID": 2,
			"mID": 6
		}
		// console.log(mcqContainer, '-----------jfjfkjf')
		attemptData(mcqContainer)
	}

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
	function FinalSubmitData() {
		let Qids = manageData.questions[currentIndex].questionID;
		let correctOpText = manageData.questions[currentIndex].answerText;
		let marks = manageData.questions[currentIndex].marksPerQuestion;
		let actIds = manageData.questions[currentIndex].activityID;
		const optionText1 = storeData[currentIndex]?.optionText1 ? storeData[currentIndex]?.optionText1 : "";
		const optionText2 = storeData[currentIndex]?.optionText2 ? storeData[currentIndex]?.optionText2 : "";
		const optionText3 = storeData[currentIndex]?.optionText3 ? storeData[currentIndex]?.optionText3 : "";
		const optionText4 = storeData[currentIndex]?.optionText4 ? storeData[currentIndex]?.optionText4 : "";
		const optionText5 = storeData[currentIndex]?.optionText5 ? storeData[currentIndex]?.optionText5 : "";
		const optionText6 = storeData[currentIndex]?.optionText6 ? storeData[currentIndex]?.optionText6 : "";
		const optionText7 = storeData[currentIndex]?.optionText7 ? storeData[currentIndex]?.optionText7 : "";
		const optionText8 = storeData[currentIndex]?.optionText8 ? storeData[currentIndex]?.optionText8 : "";
		const mergedVariable = [optionText1, optionText2, optionText3, optionText4, optionText5, optionText6, optionText7, optionText8];
		const filteredValues = mergedVariable.filter(mergedVariable => mergedVariable !== "");
		const selectedText = filteredValues.join(',');

		const Fdata = {
			"quesID": Qids,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": userData?.data?.classID,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": selectedText,
			"quesOptionText": selectedText,
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": correctOpText,
			"rightAnsID": "0",
			"QueSubCatagory": "3-1",
			"pendingTime": '0',
			"eidID": 3,
			"mID": 6
		};
		attemptData(Fdata)
	}

	function tnfAction(optIDS, answer, crtq) {
		let currentAns = finalPost.filter(item => item.quesID == crtq)[0];
		let marks = manageData.questions[currentIndex].marksPerQuestion;
		let correctAnsIds = manageData.questions[currentIndex].answerIDs;
		let RightansText = manageData.questions[currentIndex].answerText;

		const newData = `${optIDS}-${answer}`;
		let selectedOption = newData;
		if (currentAns != undefined) {
			let tnfArray = currentAns.queOptionsID.split(",");
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

		// console.log(selectedOption, "*//")

		// if (!reAttempt) {
		// 	TnfSelctedData.push(newData);
		// }
		const TnfPayLoad = {
			"quesID": crtq,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": userData?.data?.classID,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": selectedOption,
			"quesOptionText": "0",
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": RightansText,
			"rightAnsID": correctAnsIds,
			"QueSubCatagory": "2-2",
			"pendingTime": '0',
			"eidID": 1,
			"mID": 6
		}
		attemptData(TnfPayLoad)
	}




	let currentAns = finalPost.filter(item => item.quesID == manageData.questions[currentIndex]?.questionID)[0];
	let currOption = {};

	if (currentAns != undefined && manageData.questions[currentIndex].activityID == 2) {
		ansArray = currentAns.queOptionsID.split(",");
		for (let ans of ansArray) {
			let arr = ans.split("-");
			currOption[arr[0]] = arr[1];
		}
	}




	// DD type function start 
	const filteredData = Object.values(selectedTexts?.[currentIndex] ?? {})
		.filter(item => Array.isArray(item) && item.length > 0);
	const joinedArrays = filteredData.map(innerArray => innerArray.join(','));
	const finalString = joinedArrays.join(',');

	const [ddDrpData, setddDrpData] = useState([]);
	const [dropDownBox, setdropDownBox] = useState(false);
	const [selectText, setSelectedText] = useState("select option")
	function dropDown(data, index) {
		// alert(index)
		const targetText2 = data;
		const words = targetText2.split(",");
		const wordsObjects = words.map((word, index) => ({ id: index, word }));
		setddDrpData(wordsObjects)
		setdropDownBox(true)
	}
	function hideOptionModel() {
		setdropDownBox(false)
	}
	function clickOnItems(xData, index) {
		// alert(x)
		setSelectedText(xData);
	}
	function dropDownList() {
		let marks = manageData.questions[currentIndex].marksPerQuestion;
		let RightansText = manageData.questions[currentIndex].answerText;
		const drpPayLoad = {
			"quesID": manageData.questions[currentIndex].questionID,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": userData?.data?.classID,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": "0",
			"quesOptionText": finalString,
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": RightansText,
			"rightAnsID": RightansText,
			"QueSubCatagory": "12-2",
			"pendingTime": '0',
			"eidID": 2,
			"mID": 6
		}
		attemptData(drpPayLoad)
	}
	// DD type function end 




	// get Matching Data 

	// match Data Convert here
	const convertConnections = (connections, currentIndex) => {
		const currentConnections = connections[currentIndex] || [];
		return currentConnections.map(connection => {
			const match = connection.match(/startPoint_(\d+)-endPoint_(\d+)/);
			if (match) {
				const startId = match[1];
				const endId = match[2];
				return `${startId}-${endId}`;
			}
			return null;
		}).filter(connection => connection !== null);
	};
	const convertedConnections = convertConnections(connections, currentIndex);
	let matchData = convertedConnections.join(",");
	function matchingDataFun() {
		let marks = manageData.questions[currentIndex].marksPerQuestion;
		let RightansText = manageData.questions[currentIndex].answerText;
		const matchPayLoad = {
			"quesID": manageData.questions[currentIndex].questionID,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": userData?.data?.classID,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": matchData,
			"quesOptionText": "0",
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": RightansText,
			"rightAnsID": RightansText,
			"QueSubCatagory": "4-1",
			"pendingTime": '0',
			"eidID": 2,
			"mID": 4
		}
		attemptData(matchPayLoad)

	}



	// console.log(matchDataArray, "*4*4*")

	const jumbleWord = (data, a, index) => {
		const updateOptLine = (optLineKey) => {
			setJumble((prevJumble) => {
				let currentEntry = prevJumble[currentIndex] || {};
				let updatedOptLine = currentEntry[optLineKey] || '';
				if (data.length > 0) {
					updatedOptLine += data + ' ';
				} else {
					updatedOptLine += data;
				}
				const updatedObject = { ...currentEntry, [optLineKey]: updatedOptLine };
				return { ...prevJumble, [currentIndex]: updatedObject };
			});
		};
		if (a === 1) {
			updateOptLine('optLine1');
		} else if (a === 2) {
			updateOptLine('optLine2');
		} else if (a === 3) {
			updateOptLine('optLine3');
		} else if (a === 4) {
			updateOptLine('optLine4');
		} else if (a === 5) {
			updateOptLine('optLine5');
		} else if (a === 6) {
			updateOptLine('optLine6');
		} else if (a === 7) {
			updateOptLine('optLine7');
		} else if (a === 8) {
			updateOptLine('optLine8');
		}
	}

	function jumBlePayLoad() {
		let jumbleData = jumble[currentIndex];
		let a = jumbleData?.optLine1 || "";
		let b = jumbleData?.optLine2 || "";
		let c = jumbleData?.optLine3 || "";
		let d = jumbleData?.optLine4 || "";
		let e = jumbleData?.optLine5 || "";
		let f = jumbleData?.optLine6 || "";
		let g = jumbleData?.optLine7 || "";
		let h = jumbleData?.optLine8 || "";

		let dataArray = [a, b, c, d, e, f, g, h].filter(item => item !== "");; // Create an array
		let mergedArray = dataArray.join(",");

		let marks = manageData.questions[currentIndex].marksPerQuestion;
		let RightansText = manageData.questions[currentIndex].answerText;
		const jmplPaydata = {
			"quesID": manageData.questions[currentIndex].questionID,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": userData?.data?.classID,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": 0,
			"quesOptionText": mergedArray,
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": RightansText,
			"rightAnsID": "0",
			"QueSubCatagory": "10-1",
			"pendingTime": '0',
			"eidID": 3,
			"mID": 8
		}
		attemptData(jmplPaydata)
	}
	function cleardata(pass) {
		if (pass == 1) {
			setJumble((prevJumble) => {
				if (typeof prevJumble !== 'object' || prevJumble === null) {
					console.error('prevJumble is not an object:', prevJumble);
					return prevJumble;
				}
				const newJumble = { ...prevJumble };

				if (newJumble[currentIndex]) {
					newJumble[currentIndex].optLine1 = '';
				} else {
					console.error(`Key ${currentIndex} does not exist in prevJumble.`);
				}
				return newJumble;
			});
		}
		else if (pass == 2) {
			setJumble((prevJumble) => {
				if (typeof prevJumble !== 'object' || prevJumble === null) {
					console.error('prevJumble is not an object:', prevJumble);
					return prevJumble;
				}
				const newJumble = { ...prevJumble };

				if (newJumble[currentIndex]) {
					newJumble[currentIndex].optLine2 = '';
				} else {
					console.error(`Key ${currentIndex} does not exist in prevJumble.`);
				}
				return newJumble;

			});
		}
		else if (pass == 3) {
			setJumble((prevJumble) => {
				if (typeof prevJumble !== 'object' || prevJumble === null) {
					console.error('prevJumble is not an object:', prevJumble);
					return prevJumble;
				}
				const newJumble = { ...prevJumble };

				if (newJumble[currentIndex]) {
					newJumble[currentIndex].optLine3 = '';
				} else {
					console.error(`Key ${currentIndex} does not exist in prevJumble.`);
				}
				return newJumble;

			});
		}
		else if (pass == 4) {
			setJumble((prevJumble) => {
				if (typeof prevJumble !== 'object' || prevJumble === null) {
					console.error('prevJumble is not an object:', prevJumble);
					return prevJumble;
				}
				const newJumble = { ...prevJumble };

				if (newJumble[currentIndex]) {
					newJumble[currentIndex].optLine4 = '';
				} else {
					console.error(`Key ${currentIndex} does not exist in prevJumble.`);
				}
				return newJumble;

			});
		}
		else if (pass == 5) {
			setJumble((prevJumble) => {
				if (typeof prevJumble !== 'object' || prevJumble === null) {
					console.error('prevJumble is not an object:', prevJumble);
					return prevJumble;
				}
				const newJumble = { ...prevJumble };

				if (newJumble[currentIndex]) {
					newJumble[currentIndex].optLine5 = '';
				} else {
					console.error(`Key ${currentIndex} does not exist in prevJumble.`);
				}
				return newJumble;

			});
		}
		else if (pass == 6) {
			setJumble((prevJumble) => {
				if (typeof prevJumble !== 'object' || prevJumble === null) {
					console.error('prevJumble is not an object:', prevJumble);
					return prevJumble;
				}
				const newJumble = { ...prevJumble };

				if (newJumble[currentIndex]) {
					newJumble[currentIndex].optLine6 = '';
				} else {
					console.error(`Key ${currentIndex} does not exist in prevJumble.`);
				}
				return newJumble;

			});
		}
		else if (pass == 7) {
			setJumble((prevJumble) => {
				if (typeof prevJumble !== 'object' || prevJumble === null) {
					console.error('prevJumble is not an object:', prevJumble);
					return prevJumble;
				}
				const newJumble = { ...prevJumble };

				if (newJumble[currentIndex]) {
					newJumble[currentIndex].optLine7 = '';
				} else {
					console.error(`Key ${currentIndex} does not exist in prevJumble.`);
				}
				return newJumble;

			});
		}
		else if (pass == 8) {
			setJumble((prevJumble) => {
				if (typeof prevJumble !== 'object' || prevJumble === null) {
					console.error('prevJumble is not an object:', prevJumble);
					return prevJumble;
				}
				const newJumble = { ...prevJumble };

				if (newJumble[currentIndex]) {
					newJumble[currentIndex].optLine8 = '';
				} else {
					console.error(`Key ${currentIndex} does not exist in prevJumble.`);
				}
				return newJumble;

			});
		}

	}

	function discriptions() {
		let marks = manageData.questions[currentIndex].marksPerQuestion;
		let RightansText = manageData.questions[currentIndex].answerText;
		const payload = {
			"quesID": manageData.questions[currentIndex].questionID,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": userData?.data?.classID,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": 0,
			"quesOptionText": "0",
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": RightansText,
			"rightAnsID": "0",
			"QueSubCatagory": "10-1",
			"pendingTime": '0',
			"eidID": 3,
			"mID": 8
		}
		attemptData(payload)


	}



	function dragDrop() {
		let data = dropedData;
		let marks = manageData.questions[currentIndex].marksPerQuestion;
		let RightansText = manageData.questions[currentIndex].answerText;
		const xdata = {
			"quesID": manageData.questions[currentIndex].questionID,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": userData?.data?.classID,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": "0",
			"quesOptionText": data.join(','),
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": RightansText,
			"rightAnsID": "0",
			"QueSubCatagory": "9-1",
			"pendingTime": '0',
			"eidID": 3,
			"mID": 8
		}
		attemptData(xdata)
	}
	// drag and drop functions end  


	function submitAttem() {
		let marks = manageData.questions[currentIndex].marksPerQuestion;
		let RightansText = manageData.questions[currentIndex].answerText;
		const payload = {
			"quesID": manageData.questions[currentIndex].questionID,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": userData?.data?.classID,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": 0,
			"quesOptionText": "0",
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": RightansText,
			"rightAnsID": "0",
			"QueSubCatagory": "10-1",
			"pendingTime": '0',
			"eidID": 3,
			"mID": 8
		}

		const updated = [...finalPost, payload];
		// setFinalPost(updated);

		const cond1 = finalPost.length == manageData.questions.length;
		const cond2 = manageData.questions[currentIndex]?.activityID === 15;
		const cond3 = updated.length === manageData.questions.length

		if (cond1 || (cond2 && cond3)) {
			setSure(true);
		} else {
			alert('Please attempt all questions.')
		}
	}

	function cancelSubmit() {
		setSure(false);
	}
	function examSubmit(navigation) {
		const activityID = manageData.questions[currentIndex]?.activityID
		if (activityID === 4) {
			matchingDataFun();
		}
		else if (activityID === 10) {
			jumBlePayLoad();
		}
		else if (activityID === 12) {
			dropDownList();
		}
		else if (activityID === 9) {
			dragDrop();
		}
		else if (activityID === 15) {
			discriptions();
		}

		setManageData((o) => {
			return { ...o, showLoader: true }
		})
		const payload = {
			"schoolID": userData?.data?.schoolID,
			"userRefID": userData?.data?.userRefID,
			"academicYear": userData?.data?.academicYear,
			"userTypeID": userData?.data?.userTypeID,
			"classID": userData?.data?.classID,
			"sectionID": userData?.data?.sectionID,
			"attemptData": finalPost
		}
		console.log(payload)
		Services.post(apiRoot.submitAssessment, payload)
			.then((res) => {
				if (res.status == "success") {

					alert(res.message)
					setManageData((o) => {
						return {
							...o,
							showLoader: false,
						}
					});
					if (activityID == 15) {
						setSure(false);
						setIsdec(true)
						navigation.navigate('Assessment')

					} else {
						navigation.navigate('Assessment')
						setSure(false);
					}


				} else {
					alert(res.message)
					navigation.navigate('Assessment')
				}
			})
			.catch((err) => {
				alert("Error: ", err)
			})
			.finally(() => {
				setManageData((o) => {
					return { ...o, showLoader: false }
				});
			})
	}
	// ------------Assessment store --------------------//
	return (
		<>
			<GlobleData.Provider value={{
				login, logOut, userData,
				// assessList: assessList,
				attemptWaiting: attemptWaiting,
				getAssQuest: getAssQuest,
				manageData: manageData,
				currentIndex: currentIndex,
				setCurrentIndex: setCurrentIndex,
				attemptStore: attemptStore,
				next: next,
				prev: prev,
				mcqClicked: mcqClicked,
				finalArrayData: finalArrayData,
				storeData: storeData,
				onchangeGetData: onchangeGetData,
				tnfAction: tnfAction,
				dropDown: dropDown,
				ddDrpData: ddDrpData,
				dropDownBox: dropDownBox,
				hideOptionModel: hideOptionModel,
				clickOnItems: clickOnItems,
				selectText: selectText,
				currentAns: currentAns,
				setOptions1: setOptions1,
				finalPost: finalPost,
				setFinalPost: setFinalPost,
				currOption: currOption,
				matchingDataFun: matchingDataFun,
				jumbleWord: jumbleWord,
				jumble: jumble,
				jumBlePayLoad: jumBlePayLoad,
				cleardata: cleardata,
				setMatchTo: setMatchTo,
				matchLines: matchLines,
				setmatchLines: setmatchLines,
				connections: connections,
				setConnections: setConnections,
				selectedTexts: selectedTexts,
				setSelectedTexts: setSelectedTexts,
				dropedData: dropedData,
				setDropedData: setDropedData,
				submitAttem: submitAttem,
				isDec: isDec,
				// schoolID: schoolID,
				// userRefID: userRefID,
				// ClsIds: ClsIds,
				attemptStore: attemptStore,
				// ApiToken: ApiToken,
				// apiBaseUrl: apiBaseUrl,
				setIsdec: setIsdec,
				sure: sure,
				setSure: setSure,
				cancelSubmit: cancelSubmit,
				examSubmit: examSubmit,
				setIsAutoSubmit: setIsAutoSubmit
				// getGenerateAsslist: getGenerateAsslist
			}}>
				{children}
			</GlobleData.Provider>
			<MsgModal msgModalVisible={msgModalVisible} />

			{/* {manageData.showLoader &&
				<Loader />
			} */}

		</>
	)
}

const styles = StyleSheet.create({})