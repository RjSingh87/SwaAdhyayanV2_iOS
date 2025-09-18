import { StyleSheet, Text, View, Alert, TouchableOpacity, } from 'react-native';
import React, { useState, useEffect } from 'react';
import Services from './Services';
import { SwaTheam, apiRoot, baseURL } from './constant/ConstentValue';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MsgModal from './screens/common/MsgModal';
export const GlobleData = React.createContext()

export default function Store({ children }) {
	const [userData, setUserData] = useState({ data: null, message: '', isLogin: false })
	const [msgModalVisible, setMsgModalVisible] = useState({ msg: '', status: false, type: '' })

	useEffect(() => {
		checkLogin()
		const loadAttempts = async () => {
			try {
				const storedData = await AsyncStorage.getItem('attemptedQuestions');
				if (storedData !== null) {
					setFinalPost(JSON.parse(storedData));
				}
			} catch (error) {
				console.log('Error loading attempts:', error);
			}
		};
		loadAttempts();
	}, [])

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
					navigation.navigate('home')
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
	const [imageUri, setImageUri] = useState('')
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
	// const [attemptedCount, setAttemptedCount] = useState(0);
	const [matchTo, setMatchTo] = useState()
	const [connections, setConnections] = useState([]);
	const [selectedTexts, setSelectedTexts] = useState({});
	const [currentIndex, setCurrentIndex] = useState(0)
	const [options1, setOptions1] = useState()
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
	const apiBaseUrl = apiRoot;
	const ApiToken = "=4WY5FWeoRWYhd3c";
	// const schoolCode = userData.data.schoolCode;
	// const userRefID = userData.data.userRefID;
	const ClsIds = userData?.data?.classID



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
		const xData = {
			"schoolCode": userData.data.schoolCode,
			"userRefID": userData.data.userRefID,
			"classID": userData.data.classID,
			"assessmentID": attemptStore.assMentIds
		}
		Services.post(apiRoot.getAssessmentQuestion, xData)
			.then((qData) => {
				if (qData.status == "success") {
					// console.log(JSON.stringify(qData.assessmentQues), '________________??')
					setManageData((o) => {
						return {
							...o,
							showLoader: false,
							status: true,
							questions: qData.assessmentQues,
							siteUtls: qData.siteUrl,
							TotlMks: qData.totalMarks,
							totalQuest: qData.assessmentQues.length,
						}
					})
					let dd = qData.assessmentQues;
					let ans = Array(dd.length);
					for (let i = 0; i < ans.length; i++) {
						ans[i] = {};
					}
					setStoreData(ans)
				} else {
					alert(qData.message)
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
		setCurrentIndex(currentIndex - 1)
		setManageData((pre) => {
			return { ...pre, qNumber: pre.qNumber - 1 };
		})
	}

	// data Stor
	const attemptData = async (assessmentQues) => {
		// const thisData = [];
		// const prevData = [finalPost];
		// let reAttempt = 0;
		// prevData.map((item) => { thisData.push(item); });
		// thisData.map((item, index) => {
		// 	if (assessmentQues.quesID === item.quesID) {
		// 		reAttempt = 1;
		// 		thisData[index] = assessmentQues;
		// 	}
		// });
		// if (!reAttempt) { thisData.push(assessmentQues); }
		// setFinalPost(thisData);


		// ------this function made by raju sep 10 2025--------
		const updatedData = [...finalPost];
		const index = updatedData.findIndex(item => item.quesID === assessmentQues.quesID);
		if (index !== -1) {
			updatedData[index] = assessmentQues; // Re-attempt
		} else {
			updatedData.push(assessmentQues);    // First attempt
		}
		setFinalPost(updatedData);

		try {
			await AsyncStorage.setItem('attemptedQuestions', JSON.stringify(updatedData));
		} catch (error) {
			console.log('Error saving attempts:', error);
		}
		// -------end------------- 

	};
	function mcqClicked(optIds, quetIds, OptText) {
		// alert("clickd")
		// return
		let getMarks = manageData.questions[currentIndex].marksPerQuestion;
		let rightAnsText = manageData.questions[currentIndex].answerText;
		let ansIds = manageData.questions[currentIndex].answerIDs;
		let eidID = manageData.questions[currentIndex].eadID;
		let mID = manageData.questions[currentIndex].miID;
		// alert(OptText)
		const mcqContainer = {
			"quesID": quetIds,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": userData.data.classID,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": optIds,
			"quesOptionText": OptText,
			"StudentResult": "-1",
			"marks": getMarks,
			"rightAnsText": rightAnsText,
			"rightAnsID": ansIds,
			"QueSubCatagory": "1-1",
			"pendingTime": "01:04:46",
			"eidID": eidID,
			"mID": mID
		}
		console.log({ mcqContainer })
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
		const mergedVariable = [optionText1, optionText2, optionText3, optionText4, optionText5, optionText6];
		const filteredValues = mergedVariable.filter(mergedVariable => mergedVariable !== "");
		const selectedText = filteredValues.join(',');
		let eidID = manageData.questions[currentIndex].eadID;
		let mID = manageData.questions[currentIndex].miID;

		const Fdata = {
			"quesID": Qids,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": ClsIds,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": "",
			"quesOptionText": selectedText,
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": correctOpText,
			"rightAnsID": "0",
			"QueSubCatagory": "3-1",
			"pendingTime": "00:59:35",
			"eidID": eidID,
			"mID": mID
		};
		let index = finalArrayData.findIndex((item) => item.quesID == Qids);
		if (index == -1) {
			finalArrayData.push(Fdata)
		} else {
			finalArrayData[index].queOptionsID = selectedText
		}
	}

	function tnfAction(optIDS, answer, crtq) {
		let currentAns = finalPost.filter(item => item.quesID == crtq)[0];
		let marks = manageData.questions[currentIndex].marksPerQuestion;
		let correctAnsIds = manageData.questions[currentIndex].answerIDs;
		let RightansText = manageData.questions[currentIndex].answerText;

		let eidID = manageData.questions[currentIndex].eadID;
		let mID = manageData.questions[currentIndex].miID;

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
			"classID": userData.data.classID,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": selectedOption,
			"quesOptionText": "0",
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": RightansText,
			"rightAnsID": correctAnsIds,
			"QueSubCatagory": "2-2",
			"pendingTime": "01:03:57",
			"eidID": eidID,
			"mID": mID
		}
		attemptData(TnfPayLoad)
		// let index = finalArrayData.findIndex((item) => item.quesID == crtq);
		// if (index == -1) {
		// 	finalArrayData.push(TnfPayLoad)
		// } else {
		// 	finalArrayData[index].queOptionsID = selectedOption
		// }
		// setFinalArray(()=>{
		// 	return[finalArrayData]
		// })

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
		let eidID = manageData.questions[currentIndex].eadID;
		let mID = manageData.questions[currentIndex].miID;
		const drpPayLoad = {
			"quesID": manageData.questions[currentIndex].questionID,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": ClsIds,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": "0",
			"quesOptionText": finalString,
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": RightansText,
			"rightAnsID": RightansText,
			"QueSubCatagory": "12-2",
			"pendingTime": "01:04:32",
			"eidID": eidID,
			"mID": mID
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
		let eidID = manageData.questions[currentIndex].eadID;
		let mID = manageData.questions[currentIndex].miID;
		const matchPayLoad = {
			"quesID": manageData.questions[currentIndex].questionID,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": userData.data.classID,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": matchData,
			"quesOptionText": "0",
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": RightansText,
			"rightAnsID": RightansText,
			"QueSubCatagory": "4-1",
			"pendingTime": "01:04:37",
			"eidID": eidID,
			"mID": mID
		}
		attemptData(matchPayLoad)

	}



	// console.log(matchDataArray, "*4*4*")

	const jumbleWord = (data, a, index) => {
		const updateOptLine = (optLineKey) => {
			setJumble((prevJumble) => {
				let currentEntry = prevJumble[currentIndex] || {};
				let updatedOptLine = currentEntry[optLineKey] || '';
				if (updatedOptLine.includes(data)) {
					updatedOptLine = updatedOptLine.replace(data, '');
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

		let dataArray = [a, b, c, d, e, f, g, h].filter(item => item !== ""); // Create an array
		let mergedArray = dataArray.join(",");

		let marks = manageData.questions[currentIndex].marksPerQuestion;
		let RightansText = manageData.questions[currentIndex].answerText;
		let eidID = manageData.questions[currentIndex].eadID;
		let mID = manageData.questions[currentIndex].miID;
		const jmplPaydata = {
			"quesID": manageData.questions[currentIndex].questionID,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": ClsIds,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": 0,
			"quesOptionText": mergedArray,
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": RightansText,
			"rightAnsID": "0",
			"QueSubCatagory": "10-1",
			"pendingTime": "01:04:29",
			"eidID": eidID,
			"mID": mID
		}
		attemptData(jmplPaydata)
	}
	function cleardata(pass) {
		if (pass === 1) {
			if (jumble[currentIndex]?.optLine1 !== undefined) {
				if (typeof jumble[currentIndex].optLine1 === 'string') {
					jumble[currentIndex].optLine1 = "";
				} else if (Array.isArray(jumble[currentIndex].optLine1)) {
					jumble[currentIndex].optLine1 = [];
				} else if (typeof jumble[currentIndex].optLine1 === 'object') {
					jumble[currentIndex].optLine1 = {};
				}
			}
		}
	}




	function dragDrop() {
		let data = dropedData;
		let marks = manageData.questions[currentIndex].marksPerQuestion;
		let RightansText = manageData.questions[currentIndex].answerText;
		let eidID = manageData.questions[currentIndex].eadID;
		let mID = manageData.questions[currentIndex].miID;
		const xdata = {
			"quesID": manageData.questions[currentIndex].questionID,
			"totalMarks": manageData.TotlMks,
			"assessmentID": attemptStore.assMentIds,
			"classID": ClsIds,
			"subjectID": attemptStore.sujectIds,
			"queOptionsID": "0",
			"quesOptionText": data,
			"StudentResult": "-1",
			"marks": marks,
			"rightAnsText": RightansText,
			"rightAnsID": "0",
			"QueSubCatagory": "9-1",
			"pendingTime": "01:04:48",
			"eidID": eidID,
			"mID": mID

		}
		attemptData(xdata)
	}
	// drag and drop functions end  


	function submitAttem() {
		if (finalPost.length === manageData.totalQuest || manageData.questions[currentIndex]?.activityID === 15) {
			setIsdec(true)
		} else {
			Alert.alert("Info", "Please attempt all questions.")
		}


		// if (manageData.questions[currentIndex]?.activityID === 15) {
		// }
	}
	// ------------Assessment store --------------------//
	return (
		<>
			<GlobleData.Provider value={{
				login, logOut, userData,
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
				imageUri: imageUri,
				setImageUri: setImageUri,
				isDec: isDec,
				setIsdec: setIsdec,
				// schoolCode:schoolCode,
				// userRefID:userRefID,
				// ClsIds:ClsIds,
				attemptStore: attemptStore,
				setFinalPost: setFinalPost
				// attemptedCount: attemptedCount

				// ApiToken:ApiToken,
				// apiBaseUrl:apiBaseUrl
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