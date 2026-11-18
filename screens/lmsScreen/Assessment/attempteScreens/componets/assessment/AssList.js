import React, { useEffect, useState, useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, StatusBar, Image, useWindowDimensions, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { GlobleData } from '../../../../../../Store';
import { apiRoot, SWATheam } from '../../../../../../constant/ConstentValue';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../../../../../common/Loader';
import Services from '../../../../../../Services';
import Orientation from 'react-native-orientation-locker';
import AssessmentReport from '../../../AssessmentReport';
import RenderHtml, { HTMLElementModel, HTMLContentModel } from 'react-native-render-html';

const customHTMLElementModels = {
	mathfrac: HTMLElementModel.fromCustomModel({
		tagName: 'mathfrac',
		contentModel: HTMLContentModel.mixed
	})
};

const mathRenderers = {
	mathfrac: function MathFracRenderer({ tnode }) {
		const num = (tnode && tnode.attributes && tnode.attributes.num) ? tnode.attributes.num : '1';
		const den = (tnode && tnode.attributes && tnode.attributes.den) ? tnode.attributes.den : '1';
		const whole = (tnode && tnode.attributes && tnode.attributes.whole) ? tnode.attributes.whole : '';
		const textColor = (tnode && tnode.styles && tnode.styles.color) ? tnode.styles.color : SWATheam.SwaBlack;
		return (
			<View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 2 }}>
				{whole ? (
					<Text style={{ fontSize: 14, fontWeight: 'bold', color: textColor, marginRight: 2 }}>
						{whole}
					</Text>
				) : null}
				<View style={{ alignItems: 'center', justifyContent: 'center' }}>
					<Text style={{ fontSize: 12, fontWeight: 'bold', color: textColor, borderBottomWidth: 1.2, borderColor: textColor, paddingBottom: 1, paddingHorizontal: 2, textAlign: 'center' }}>
						{num}
					</Text>
					<Text style={{ fontSize: 12, fontWeight: 'bold', color: textColor, paddingTop: 1, paddingHorizontal: 2, textAlign: 'center' }}>
						{den}
					</Text>
				</View>
			</View>
		);
	}
};

function formatMathHtml(html) {
	if (!html || typeof html !== 'string') return '';
	let res = html;

	// Handle <MTECHO> fractions
	res = res.replace(/<MTECHO>([\s\S]*?)<\/MTECHO>/gi, (match, inner) => {
		const fracMatch = inner.trim().match(/^(\d+)?\s*(\d+)\s*\/\s*(\d+)$/);
		if (fracMatch) {
			const whole = fracMatch[1] || '';
			const num = fracMatch[2];
			const den = fracMatch[3];
			return `<mathfrac num="${num}" den="${den}" whole="${whole}"></mathfrac>`;
		}
		return inner;
	});

	// 1. MathML <math ...>...</math>
	res = res.replace(/<math[^>]*>([\s\S]*?)<\/math>/gi, (match, inner) => {
		// Check for <mfrac>
		const mfracMatch = inner.match(/<mfrac[^>]*>([\s\S]*?)<\/mfrac>/i);
		if (mfracMatch) {
			const fracBody = mfracMatch[1].trim();
			const beforeFrac = inner.slice(0, mfracMatch.index);
			const wholeMatch = beforeFrac.match(/<mn[^>]*>(\d+)<\/mn>/i);
			const whole = wholeMatch ? wholeMatch[1] : '';

			const rowMatches = [...fracBody.matchAll(/<mrow[^>]*>([\s\S]*?)<\/mrow>/gi)];
			let num = '1', den = '1';
			if (rowMatches.length >= 2) {
				num = rowMatches[0][1].replace(/<[^>]+>/g, '').trim();
				den = rowMatches[1][1].replace(/<[^>]+>/g, '').trim();
			} else {
				const parts = [...fracBody.matchAll(/<([a-zA-Z0-9]+)[^>]*>([\s\S]*?)<\/\1>/gi)];
				if (parts.length >= 2) {
					num = parts[0][2].replace(/<[^>]+>/g, '').trim();
					den = parts[1][2].replace(/<[^>]+>/g, '').trim();
				} else {
					const clean = fracBody.replace(/<[^>]+>/g, ' ').trim().split(/\s+/);
					num = clean[0] || '1';
					den = clean[1] || '2';
				}
			}
			return `<mathfrac num="${num}" den="${den}" whole="${whole}"></mathfrac>`;
		}

		// Check simple fraction text inside <math> like 1/2 or 2 1/3
		const textOnly = inner.replace(/<[^>]+>/g, '').trim();
		const slashMatch = textOnly.match(/^(\d+)?\s*(\d+)\s*\/\s*(\d+)$/);
		if (slashMatch) {
			const whole = slashMatch[1] || '';
			const num = slashMatch[2];
			const den = slashMatch[3];
			return `<mathfrac num="${num}" den="${den}" whole="${whole}"></mathfrac>`;
		}

		// Sup / sub / sqrt
		let processed = inner.replace(/<msup[^>]*><([a-zA-Z0-9]+)[^>]*>([\s\S]*?)<\/\1><([a-zA-Z0-9]+)[^>]*>([\s\S]*?)<\/\3><\/msup>/gi, '$2<sup>$4</sup>');
		processed = processed.replace(/<msqrt[^>]*>([\s\S]*?)<\/msqrt>/gi, '&radic;<span style="text-decoration:overline">$1</span>');
		processed = processed.replace(/<\/?(?:math|mrow|mn|mi|mo|mtext)[^>]*>/gi, '');
		return processed;
	});

	// 2. LaTeX \frac{num}{den}
	res = res.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/gi, '<mathfrac num="$1" den="$2" whole=""></mathfrac>');

	return res;
}

function formatAnswerHtml(rawAns) {
	if (!rawAns || typeof rawAns !== 'string') return '';
	let s = rawAns.replace(/['\"]/g, '').replace(/#/g, ' ______ ');
	const parts = s.split(',');
	const cleaned = parts.map(p => {
		const trimmed = p.trim();
		if (trimmed.toLowerCase() === 'null' || trimmed === '') {
			return 'Not Attempted';
		}
		const mtechoMatch = trimmed.match(/<MTECHO>([\s\S]*?)<\/MTECHO>/i);
		const val = mtechoMatch ? mtechoMatch[1].trim() : trimmed;
		const fracMatch = val.match(/^(\d+)?\s*(\d+)\s*\/\s*(\d+)$/);
		if (fracMatch) {
			const whole = fracMatch[1] || '';
			const num = fracMatch[2];
			const den = fracMatch[3];
			return `<mathfrac num="${num}" den="${den}" whole="${whole}"></mathfrac>`;
		}
		return formatMathHtml(trimmed);
	});
	return cleaned.join(', ');
}

const getImageUrl = (imagePath, fileName) => {
	if (!fileName || typeof fileName !== 'string') return '';
	const trimmed = fileName.trim();
	if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
		return trimmed;
	}
	const base = 'https://swaadhyayan.com/data/';
	let path = (imagePath || '').trim();
	if (path && !path.endsWith('/')) {
		path = path + '/';
	}
	if (path && path.startsWith('/')) {
		path = path.slice(1);
	}
	const file = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
	return `${base}${path}${file}`;
};

export default function AssiList({ navigation }) {
	const tagsStyles = {
		body: {
			color: SWATheam.SwaBlack
		},
		p: {
			color: SWATheam.SwaBlack
		},
		img: {
			maxWidth: 130,
			height: 'auto',
			resizeMode: 'contain',
		},
	};

	const { width } = useWindowDimensions();
	const { userData, attemptWaiting, setFinalPost } = useContext(GlobleData);

	const [loader, setLoader] = useState(false);
	const [result, setResult] = useState(false);
	const [resultData, setResultdata] = useState([]);
	const [studentDetails, setStudentDetails] = useState()
	const [assessList, setAssessList] = useState([]);
	const [reportData, setReportData] = useState({ data: null, status: false })
	const [uploadSheets, setUploadSheets] = useState({ data: null, isValidateByExaminer: null, url: '', status: false })
	const [searchQuery, setSearchQuery] = useState('')
	const [searchLoading, setSearchLoading] = useState(false)

	const filteredAssessments = useMemo(() => {
		if (!assessList || assessList.length === 0) return []
		if (searchQuery.trim() === '') return assessList
		return assessList.filter(item =>
			item.assessmentName?.toLowerCase().includes(searchQuery.trim().toLowerCase())
		)
	}, [assessList, searchQuery])

	function handleSearchChange(text) {
		setSearchQuery(text)
		if (text.length === 0) {
			setSearchLoading(true)
			setTimeout(() => { setSearchLoading(false) }, 100)
		}
	}

	function handleClearSearch() {
		setSearchLoading(true)
		setSearchQuery('')
		setTimeout(() => { setSearchLoading(false) }, 100)
	}

	useEffect(() => {
		getGenerateAsslist()
		const goBack = navigation.addListener('focus', () => {
			getGenerateAsslist()
			StatusBar.setHidden(false);
			Orientation.lockToPortrait();
		});
		return goBack
	}, [navigation])

	function getGenerateAsslist() {
		setLoader(true)
		const payload = {
			"schoolID": userData?.data?.schoolID,
			"userRefID": userData?.data?.userRefID,
		}
		Services.post(apiRoot.getGeneratedAssessmentList, payload)
			.then((res) => {
				// console.log(res, "timelelelel?")
				if (res.status == "success") {
					setLoader(false)
					setAssessList(res.data);
					setUploadSheets((prev) => {
						return { ...prev, url: res.url }
					})
				} else {
					// alert(res.message)
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
			"schoolID": userData.data.schoolID,
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
			"schoolID": userData.data.schoolID,
			"userRefID": userData.data.userRefID,
			"userTypeID": userData.data.userTypeID,
			"assessmentID": item.assessmentID,
		};

		Services.post(apiRoot.viewResult, payload)
			.then((res) => {
				if (res.status === "success") {
					// console.log({ payload, res }, "View result")
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
		if (!item?.solutionSheet || item.solutionSheet.trim() === '') {
			Alert.alert('', 'Answer Not Uploaded.');
			return;
		}
		const sheets = item.solutionSheet.split(',').filter(sheet => sheet && sheet.trim() !== '');
		if (sheets.length === 0) {
			Alert.alert('', 'Answer Not Uploaded.');
			return;
		}
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
			<View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme }}>
				<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
					{assessList?.length > 0 &&
						<View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 5 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: SWATheam.SwaWhite, borderWidth: 1, borderColor: userData?.data?.colors?.hoverTheme || SWATheam.SwaGray, borderRadius: 6, paddingHorizontal: 10, height: 42 }}>
								<Ionicons name="search" size={20} color={SWATheam.SwaGray} style={{ marginRight: 6 }} />
								<TextInput
									placeholder="Search Assessment Name..."
									placeholderTextColor={SWATheam.SwaGray}
									value={searchQuery}
									onChangeText={handleSearchChange}
									style={{ flex: 1, color: SWATheam.SwaBlack, paddingVertical: 0, fontSize: 14 }}
								/>
								{searchLoading ? (
									<ActivityIndicator size="small" color={userData?.data?.colors?.mainTheme || SWATheam.SwaBlue} />
								) : searchQuery.length > 0 ? (
									<TouchableOpacity onPress={handleClearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
										<AntDesign name="closecircle" size={18} color={SWATheam.SwaGray} />
									</TouchableOpacity>
								) : null}
							</View>
						</View>
					}
					<View style={{ flex: 1 }}>
						<ScrollView keyboardShouldPersistTaps="handled">
							{searchLoading ? (
								<View style={{ padding: 30, alignItems: 'center', justifyContent: 'center' }}>
									<ActivityIndicator size="small" color={userData?.data?.colors?.mainTheme || SWATheam.SwaBlue} />
									<Text style={{ marginTop: 8, color: SWATheam.SwaGray, fontSize: 13 }}>Resetting assessments...</Text>
								</View>
							) : filteredAssessments.length > 0 ? (
								filteredAssessments.map((item, asslist) => {
									let attemptIds = item.attemptID;
									return (
										<View style={styles.holder} key={asslist}>
											<View style={styles.rowList}>
												<Text style={{ color: SWATheam.SwaBlack, width: 150 }}>Assessment Name : </Text>
												<Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>{item.assessmentName}</Text>
											</View>
											<View style={styles.rowList}>
												<Text style={{ color: SWATheam.SwaBlack, width: 150 }}>Subject : </Text>
												<Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>{item.subjectName}</Text>
											</View>
											<View style={styles.rowList}>
												<Text style={{ color: SWATheam.SwaBlack, width: 150 }}>Start Date :</Text>
												<Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>{item.startDate?.split("-").reverse().join("/")} </Text>
											</View>
											<View style={styles.rowList}>
												<Text style={{ color: SWATheam.SwaBlack, width: 150 }}>End Date :</Text>
												<Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>{item.endDate?.split("-").reverse().join("/")} </Text>
											</View>
											{attemptIds !== 0 && item.resultDeclareStatus ?
												<>
													<Text style={styles.resultBold}>Result </Text>
													<View style={styles.rowList}>
														<Text style={{ color: SWATheam.SwaBlack, width: 150 }}>Scored Marks : </Text>
														<Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>{item.obtainedMarks}</Text>
													</View>
													<View style={styles.rowList}>
														<Text style={{ color: SWATheam.SwaBlack, width: 150 }}>Total Marks : </Text>
														<Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>{item.totalMarks}</Text>
													</View>
													<View style={styles.rowList}>
														<Text style={{ color: SWATheam.SwaBlack, width: 150 }}>Percentage</Text>
														<Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>{item.percentage}</Text>
													</View>
												</>
												: ""}
											<View style={styles.rowList}>
												<Text style={{ color: SWATheam.SwaBlack, width: 150 }}>Total Questions</Text>
												<Text style={{ color: SWATheam.SwaBlack, flex: 1 }}>{item.noOfQuestion}</Text>
											</View>
											<View style={styles.rowList}>
												<Text style={{ color: SWATheam.SwaBlack, width: 150 }}>Status</Text>
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
													onPress={() => { attemptWaiting(item), navigation.navigate('AttemptHolder', { totalTime: item.totalTime }) }}
												>
													<Text
														style={[styles.statusP, { color: SWATheam.SwaBlack }]}>Attempt Waiting</Text>
												</TouchableOpacity>
												: ""
											}
											{attemptIds === 1 ?
												<View style={[styles.rowList, { justifyContent: 'space-between' }]}>
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
								})
							) : (
								<View style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5, backgroundColor: SWATheam.SwaWhite, padding: 15, margin: 10 }}>
									<Text style={{ color: 'red', fontSize: 14, textAlign: 'center' }}>No assessment found matching search.</Text>
								</View>
							)}
						</ScrollView>
					</View>
				</KeyboardAvoidingView>

				{loader && <Loader />}

				{result && !loader ? (
					<View style={{ flex: 1, paddingTop: 60, }}>
						<Modal animationType="slide">
							<View style={[styles.resultHeader, { backgroundColor: userData.data.colors.mainTheme }]}>
								<Text style={{ color: "#fff" }}>Result</Text>
								<TouchableOpacity style={styles.closeIcons} onPress={closeResult}>
									<AntDesign name="close" size={20} color="#fff" />
								</TouchableOpacity>
							</View>
							<View style={styles.headerDetails}>
								<Text style={styles.assName}>
									Assessment Name : {studentDetails?.assessmentName}
								</Text>
								<View style={styles.rowDetails}>
									<View>
										<Text style={styles.textLeft}>Class: {userData.data.className}</Text>
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
										// ── helpers ────────────────────────────────────────────
										const replaceHashHtml = (html) =>
											html ? html.replace(/#/g, ' ______ ') : '';

										const cleanHtml = (txt) => {
											if (!txt || typeof txt !== 'string') return '';
											let formatted = formatMathHtml(replaceHashHtml(txt));
											// If <img> tags have relative src, resolve with base url
											formatted = formatted.replace(/<img([^>]+)src=['"]([^'"]+)['"]/gi, (m, before, src) => {
												if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
													return m;
												}
												const fullSrc = getImageUrl(item.imagePath, src);
												return `<img${before}src="${fullSrc}"`;
											});
											return formatted;
										};

										// ── your answer attempt check ───────────────────────────
										const rawUserAns = item.userAnsText;
										const isNotAttempted =
											!rawUserAns ||
											rawUserAns.trim() === '' ||
											/^[\s,]+$/.test(rawUserAns.trim()) ||
											rawUserAns.trim().split(',').every(p => p.trim().toLowerCase() === 'null' || p.trim() === '');

										// ── option keys & question part keys (1 to 8) ─────────────
										const optionKeys = ['optionText1', 'optionText2', 'optionText3', 'optionText4', 'optionText5', 'optionText6', 'optionText7', 'optionText8'];
										const optionLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
										const questionPartKeys = [
											'questionPart1', 'questionPart2', 'questionPart3', 'questionPart4',
											'questionPart5', 'questionPart6', 'questionPart7', 'questionPart8'
										];

										// ── activity type flags ──────────────────────────────────
										// activityID 1: MCQ, 10: Jumble words
										// activityID 2: TNF (True/False)
										// activityID 3, 15: Fill in blanks
										// activityID 4: Matching
										// activityID 9, 12: DND / DD (Drag & Drop)
										const isMCQ = item.activityID == 1 || item.activityID == 10;
										const isTNF = item.activityID == 2;
										const isFillup = item.activityID == 3 || item.activityID == 15;
										const isMatching = item.activityID == 4;
										const isDragDrop = item.activityID == 9 || item.activityID == 12;

										// ── render all question parts (questionPart1 ~ 8: text, HTML with math, images) ──
										const renderQuestionParts = () => (
											<View style={styles.questionPart}>
												{questionPartKeys.map((qKey) => {
													const qVal = item[qKey];
													if (!qVal || qVal.trim() === '') return null;
													const isImg = /\.(png|jpg|jpeg|gif|webp)$/i.test(qVal.trim());
													if (isImg) {
														return (
															<Image
																key={qKey}
																source={{ uri: getImageUrl(item.imagePath, qVal.trim()) }}
																style={styles.questionImage}
															/>
														);
													}
													return (
														<View key={qKey} style={{ marginBottom: 4 }}>
															<RenderHtml
																contentWidth={width - 50}
																source={{ html: cleanHtml(qVal) }}
																tagsStyles={tagsStyles}
																customHTMLElementModels={customHTMLElementModels}
																renderers={mathRenderers}
															/>
														</View>
													);
												})}
											</View>
										);

										// ── render Draggable Target Tiles (for Drag & Drop) ─────
										const renderTargetBoxes = () => {
											const targetKeys = ['targetText1', 'targetText2', 'targetText3', 'targetText4', 'targetText5', 'targetText6', 'targetText7', 'targetText8'];
											let targets = [];
											targetKeys.forEach(tKey => {
												const tVal = item[tKey];
												if (tVal && tVal.trim() !== '') {
													targets.push(tVal);
												}
											});
											if (targets.length === 0 && item.answerText) {
												const raw = item.answerText.replace(/<\/?[^>]+>/g, '').replace(/['\"]/g, '');
												raw.split(',').forEach(part => {
													part.split('???').forEach(sub => {
														const clean = sub.trim();
														if (clean && clean.toLowerCase() !== 'null' && !targets.includes(clean)) {
															targets.push(clean);
														}
													});
												});
											}
											if (targets.length === 0) return null;
											return (
												<View style={styles.targetBoxesContainer}>
													{targets.map((tgt, tIdx) => {
														const cleanTgt = tgt.replace(/<\/?MTECHO>/gi, '').replace(/['\"]/g, '').trim();
														const isTgtImg = /\.(png|jpg|jpeg|gif|webp)$/i.test(cleanTgt);
														if (isTgtImg) {
															return (
																<View key={tIdx} style={styles.targetTile}>
																	<Image
																		source={{ uri: getImageUrl(item.imagePath, cleanTgt) }}
																		style={{ width: 60, height: 40, resizeMode: 'contain' }}
																	/>
																</View>
															);
														}
														const fracMatch = cleanTgt.match(/^(\d+)?\s*(\d+)\s*\/\s*(\d+)$/);
														let formattedTgt;
														if (fracMatch) {
															const whole = fracMatch[1] || '';
															formattedTgt = `<mathfrac num="${fracMatch[2]}" den="${fracMatch[3]}" whole="${whole}"></mathfrac>`;
														} else {
															formattedTgt = cleanHtml(cleanTgt);
														}
														return (
															<View key={tIdx} style={styles.targetTile}>
																<RenderHtml
																	contentWidth={width - 50}
																	source={{ html: formattedTgt }}
																	tagsStyles={tagsStyles}
																	customHTMLElementModels={customHTMLElementModels}
																	renderers={mathRenderers}
																/>
															</View>
														);
													})}
												</View>
											);
										};

										// ── render Drag & Drop options (optionText1~8 + optionImage1~8) ──
										const renderDndOptions = () =>
											optionKeys.map((key, i) => {
												const val = item[key];
												const optImg = item[`optionImage${i + 1}`];
												if ((!val || val.trim() === '') && (!optImg || optImg.trim() === '')) return null;

												const isValImg = val && /\.(png|jpg|jpeg|gif|webp)$/i.test(val.trim());
												const hasOptImg = optImg && optImg.trim() !== '';

												let optHtml = (val || '').replace(/<\/?MTECHO>/gi, '');
												if (!isValImg && optHtml) {
													if (optHtml.includes('#')) {
														optHtml = optHtml.replace(/#/g, ' ______ ');
													} else {
														optHtml = optHtml + ' ______ ';
													}
													optHtml = cleanHtml(optHtml);
												}

												return (
													<View key={key} style={styles.optionRow}>
														<View style={styles.optionBullet}>
															<Text style={styles.optionBulletText}>{optionLabels[i]}.</Text>
														</View>
														<View style={{ flex: 1 }}>
															{isValImg ? (
																<Image
																	source={{ uri: getImageUrl(item.imagePath, val.trim()) }}
																	style={styles.optionImageStyle}
																/>
															) : optHtml ? (
																<RenderHtml
																	contentWidth={width - 70}
																	source={{ html: optHtml }}
																	tagsStyles={tagsStyles}
																	customHTMLElementModels={customHTMLElementModels}
																	renderers={mathRenderers}
																/>
															) : null}
															{hasOptImg && (
																<Image
																	source={{ uri: getImageUrl(item.imagePath, optImg.trim()) }}
																	style={styles.optionImageStyle}
																/>
															)}
														</View>
													</View>
												);
											});

										// ── render MCQ options (optionText1~8 + optionImage1~8) ──
										const renderMcqOptions = () =>
											optionKeys.map((key, i) => {
												const val = item[key];
												const optImg = item[`optionImage${i + 1}`];
												if ((!val || val.trim() === '') && (!optImg || optImg.trim() === '')) return null;

												const isValImg = val && /\.(png|jpg|jpeg|gif|webp)$/i.test(val.trim());
												const hasOptImg = optImg && optImg.trim() !== '';

												return (
													<View key={key} style={styles.optionRow}>
														<View style={styles.optionBullet}>
															<Text style={styles.optionBulletText}>{optionLabels[i]}.</Text>
														</View>
														<View style={{ flex: 1 }}>
															{isValImg ? (
																<Image
																	source={{ uri: getImageUrl(item.imagePath, val.trim()) }}
																	style={styles.optionImageStyle}
																/>
															) : val && val.trim() !== '' ? (
																<RenderHtml
																	contentWidth={width - 70}
																	source={{ html: cleanHtml(val) }}
																	tagsStyles={tagsStyles}
																	customHTMLElementModels={customHTMLElementModels}
																	renderers={mathRenderers}
																/>
															) : null}
															{hasOptImg && (
																<Image
																	source={{ uri: getImageUrl(item.imagePath, optImg.trim()) }}
																	style={styles.optionImageStyle}
																/>
															)}
														</View>
													</View>
												);
											});

										// ── render Fillup options (optionText1~8 + optionImage1~8) ──
										const renderFillupOptions = () =>
											optionKeys.map((key, i) => {
												const val = item[key];
												const optImg = item[`optionImage${i + 1}`];
												if ((!val || val.trim() === '') && (!optImg || optImg.trim() === '')) return null;

												const isValImg = val && /\.(png|jpg|jpeg|gif|webp)$/i.test(val.trim());
												const hasOptImg = optImg && optImg.trim() !== '';

												return (
													<View key={key} style={styles.fillupOptionRow}>
														{isValImg ? (
															<Image
																source={{ uri: getImageUrl(item.imagePath, val.trim()) }}
																style={styles.optionImageStyle}
															/>
														) : val && val.trim() !== '' ? (
															<RenderHtml
																contentWidth={width - 50}
																source={{ html: cleanHtml(val) }}
																tagsStyles={tagsStyles}
																customHTMLElementModels={customHTMLElementModels}
																renderers={mathRenderers}
															/>
														) : null}
														{hasOptImg && (
															<Image
																source={{ uri: getImageUrl(item.imagePath, optImg.trim()) }}
																style={styles.optionImageStyle}
															/>
														)}
													</View>
												);
											});

										// ── render TNF options (statement on left, [ True ] [ False ] on right) ──
										const renderTNFOptions = () =>
											optionKeys.map((key, i) => {
												const val = item[key];
												const optImg = item[`optionImage${i + 1}`];
												if ((!val || val.trim() === '') && (!optImg || optImg.trim() === '')) return null;

												const isValImg = val && /\.(png|jpg|jpeg|gif|webp)$/i.test(val.trim());
												const hasOptImg = optImg && optImg.trim() !== '';

												return (
													<View key={key} style={styles.tnfRow}>
														<View style={{ flex: 1, paddingRight: 8 }}>
															{isValImg ? (
																<Image
																	source={{ uri: getImageUrl(item.imagePath, val.trim()) }}
																	style={styles.optionImageStyle}
																/>
															) : (
																<Text style={styles.tnfStatement} numberOfLines={0}>
																	<Text style={{ fontWeight: 'bold' }}>{optionLabels[i]}. </Text>
																	{val.replace(/<[^>]*>/g, '')}
																</Text>
															)}
															{hasOptImg && (
																<Image
																	source={{ uri: getImageUrl(item.imagePath, optImg.trim()) }}
																	style={styles.optionImageStyle}
																/>
															)}
														</View>
														<View style={styles.tnfButtons}>
															<View style={[styles.tnfBtn, styles.tnfTrue]}>
																<Text style={styles.tnfBtnText}>True</Text>
															</View>
															<View style={[styles.tnfBtn, styles.tnfFalse]}>
																<Text style={[styles.tnfBtnText, { color: '#c53030' }]}>False</Text>
															</View>
														</View>
													</View>
												);
											});

										// ── render answer bar with fractions and white text ─────
										const renderAnswerBar = () => {
											const formattedCorrect = formatAnswerHtml(item.answerText);
											const formattedYour = formatAnswerHtml(item.userAnsText);

											return (
												<View style={styles.answerBar}>
													<View style={styles.answerBarLeft}>
														<Text style={styles.answerBarLabel}>Correct Answer :</Text>
														<RenderHtml
															contentWidth={(width - 40) / 2}
															source={{ html: `<span style="color:#ffffff;font-size:13px;">${formattedCorrect || '—'}</span>` }}
															tagsStyles={{ body: { color: '#ffffff', fontSize: 13, margin: 0 }, span: { color: '#ffffff', fontSize: 13 } }}
															customHTMLElementModels={customHTMLElementModels}
															renderers={mathRenderers}
														/>
													</View>
													<View style={styles.answerBarRight}>
														<Text style={styles.answerBarLabel}>Your Answer :</Text>
														{isNotAttempted ? (
															<Text style={styles.notAttemptedText}>Not Attempted</Text>
														) : (
															<RenderHtml
																contentWidth={(width - 40) / 2}
																source={{ html: `<span style="color:#ffffff;font-size:13px;">${formattedYour}</span>` }}
																tagsStyles={{ body: { color: '#ffffff', fontSize: 13, margin: 0 }, span: { color: '#ffffff', fontSize: 13 } }}
																customHTMLElementModels={customHTMLElementModels}
																renderers={mathRenderers}
															/>
														)}
													</View>
												</View>
											);
										};

										// ── render card header (Q. Number, Chapter badge, Marks) ─
										const renderCardHeader = () => (
											<View style={styles.statusView}>
												<View style={{ flex: 1 }}>
													<Text style={styles.questNums}>Q. {index + 1}</Text>
													{item.chapterName ? (
														<Text style={styles.chapterBadgeText}>Chapter : {item.chapterName}</Text>
													) : null}
												</View>
												<View style={styles.headerMarksBadge}>
													<Text style={styles.headerMarksText}>Marks : {item.marksPerQuestion}</Text>
													<Text style={[styles.headerMarksText, { color: item.obtainedMarks > 0 ? '#15803d' : '#b91c1c' }]}>
														Obtained : {item.obtainedMarks}
													</Text>
												</View>
											</View>
										);

										return (
											<View key={item.attemptID || index}>
												{/* ── Drag & Drop (activityID 9, 12) ── */}
												{isDragDrop ? (
													<View style={styles.boxQuest}>
														{renderCardHeader()}
														{renderQuestionParts()}
														{renderTargetBoxes()}
														{renderDndOptions()}
														{renderAnswerBar()}
														<View style={styles.statusView2}>
															<Text style={styles.textHeading}>Obtained Marks</Text>
															<Text style={styles.obtaimMarks}>{item.obtainedMarks}</Text>
														</View>
													</View>
													/* ── MCQ (activityID 1, 10) ── */
												) : isMCQ ? (
													<View style={styles.boxQuest}>
														{renderCardHeader()}
														{renderQuestionParts()}
														{renderMcqOptions()}
														{renderAnswerBar()}
														<View style={styles.statusView2}>
															<Text style={styles.textHeading}>Obtained Marks</Text>
															<Text style={styles.obtaimMarks}>{item.obtainedMarks}</Text>
														</View>
													</View>
													/* ── Fill-up (activityID 3, 15) ── */
												) : isFillup ? (
													<View style={styles.boxQuest}>
														{renderCardHeader()}
														{renderQuestionParts()}
														{renderFillupOptions()}
														{renderAnswerBar()}
														<View style={styles.statusView2}>
															<Text style={styles.textHeading}>Obtained Marks</Text>
															<Text style={styles.obtaimMarks}>{item.obtainedMarks}</Text>
														</View>
													</View>
													/* ── TNF (activityID 2) ── */
												) : isTNF ? (
													<View style={styles.boxQuest}>
														{renderCardHeader()}
														{renderQuestionParts()}
														{renderTNFOptions()}
														{renderAnswerBar()}
														<View style={styles.statusView2}>
															<Text style={styles.textHeading}>Obtained Marks</Text>
															<Text style={styles.obtaimMarks}>{item.obtainedMarks}</Text>
														</View>
													</View>
													/* ── Matching (activityID 4) ── */
												) : isMatching ? (
													<View style={styles.boxQuest}>
														{renderCardHeader()}
														{renderQuestionParts()}
														{renderFillupOptions()}
														{renderAnswerBar()}
														<View style={styles.statusView2}>
															<Text style={styles.textHeading}>Obtained Marks</Text>
															<Text style={styles.obtaimMarks}>{item.obtainedMarks}</Text>
														</View>
													</View>
												) : (
													<View style={styles.boxQuest}>
														{renderCardHeader()}
														{renderQuestionParts()}
														{renderFillupOptions()}
														{renderAnswerBar()}
														<View style={styles.statusView2}>
															<Text style={styles.textHeading}>Obtained Marks</Text>
															<Text style={styles.obtaimMarks}>{item.obtainedMarks}</Text>
														</View>
													</View>
												)}
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
	// --- question preview styles ---
	questionPart: {
		paddingVertical: 8,
		paddingHorizontal: 2,
		borderBottomWidth: 1,
		borderColor: '#e0e0e0',
		marginBottom: 4,
	},
	optionRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		paddingVertical: 2,
		paddingLeft: 4,
	},
	optionBullet: {
		width: 22,
		alignItems: 'center',
		paddingTop: 4,
	},
	optionBulletText: {
		fontSize: 13,
		fontWeight: '600',
		color: SWATheam.SwaBlack,
	},
	// --- answer bar (like web: dark slate strip) ---
	answerBar: {
		flexDirection: 'row',
		backgroundColor: '#4a5568',
		borderRadius: 4,
		marginTop: 8,
		marginBottom: 4,
		overflow: 'hidden',
	},
	answerBarLeft: {
		flex: 1,
		paddingHorizontal: 8,
		paddingVertical: 6,
		borderRightWidth: 1,
		borderRightColor: 'rgba(255,255,255,0.3)',
	},
	answerBarRight: {
		flex: 1,
		paddingHorizontal: 8,
		paddingVertical: 6,
	},
	answerBarLabel: {
		color: '#a0aec0',
		fontSize: 11,
		marginBottom: 2,
		fontWeight: '600',
	},
	notAttemptedText: {
		color: '#fc8181',
		fontStyle: 'italic',
		fontSize: 13,
		fontWeight: '600',
	},
	answerValueText: {
		color: '#fff',
		fontSize: 13,
		fontWeight: '500',
	},
	// ── TNF styles ────────────────────────────────────────
	tnfRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderColor: '#edf2f7',
		paddingVertical: 8,
		paddingHorizontal: 4,
	},
	tnfStatement: {
		color: SWATheam.SwaBlack,
		fontSize: 14,
		lineHeight: 20,
	},
	tnfButtons: {
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
	},
	chapterBadgeText: {
		fontSize: 11,
		color: '#475569',
		marginTop: 2,
		fontWeight: '500',
	},
	headerMarksBadge: {
		alignItems: 'flex-end',
	},
	headerMarksText: {
		fontSize: 12,
		fontWeight: 'bold',
		color: SWATheam.SwaBlack,
	},
	optionImageStyle: {
		width: 140,
		height: 100,
		resizeMode: 'contain',
		marginVertical: 4,
		borderRadius: 4,
	},
	questionImage: {
		width: '100%',
		height: 180,
		resizeMode: 'contain',
		marginVertical: 6,
	},
	targetBoxesContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		marginVertical: 8,
		paddingHorizontal: 2,
	},
	targetTile: {
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: '#ffffff',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 8,
		marginBottom: 8,
	},
	fillupOptionRow: {
		paddingVertical: 5,
		paddingHorizontal: 4,
		borderBottomWidth: 0.5,
		borderColor: '#f1f5f9',
	},
	tnfBtn: {
		paddingHorizontal: 18,
		paddingVertical: 5,
		borderRadius: 5,
		borderWidth: 1,
	},
	tnfTrue: {
		borderColor: '#38a169',
		backgroundColor: '#f0fff4',
	},
	tnfFalse: {
		borderColor: '#e53e3e',
		backgroundColor: '#fff5f5',
	},
	tnfBtnText: {
		fontSize: 13,
		fontWeight: '600',
		color: SWATheam.SwaBlack,
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
		paddingTop: 60,
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
		// justifyContent: "space-between",
		borderBottomColor: "#b2d8d8",
		borderBottomWidth: 1,
		paddingBottom: 7,
		marginBottom: 7,
		// alignItems: "center",
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
