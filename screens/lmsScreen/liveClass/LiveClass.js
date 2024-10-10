import React, { useState, useEffect, useContext } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
	Modal,
	Platform,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Fontisto from "react-native-vector-icons/Fontisto";
import { TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker'
import { Checkbox } from 'react-native-paper';
import SwaHeader from "../../common/SwaHeader";
import { GlobleData } from "../../../Store";
import Services from "../../../Services";
import { apiRoot, SWATheam } from "../../../constant/ConstentValue";
import Loader from "../../common/Loader";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


export default function LiveClass({ navigation }) {
	const { userData } = useContext(GlobleData)
	const [clickedName, setClickedName] = useState();
	const [clsList, setClsList] = useState();
	const [clsIds, setClsIds] = useState();
	const [sectIds, setSectIds] = useState();
	const [subjectIds, setSubjectds] = useState();
	const [sectionList, setsectionList] = useState();
	const [subjectList, setSubjectList] = useState();
	const [actAnyNone, setactAnyNone] = useState([]);
	const [studentList, setStudentList] = useState();
	const [date, setDate] = useState(new Date())
	const [open, setOpen] = useState(false)
	const [open2, setOpen2] = useState(false)
	const [stuNameStore, setStuNameStore] = useState([]);
	const [formattedDateTime, setFormattedDateTime] = useState('');
	const [formattedDateTime2, setFormattedDateTime2] = useState('');
	const [fillData, setFillData] = useState({
		topic: '',
		instruction: '',
		meetUrl: ''
	})

	const [isLoad, setIsload] = useState(false);
	const [meetIds, setMeetIds] = useState()

	const data = [
		{
			id: "1",
			name: "Zoom",
			imgPath: require("../../assets/1.png")
		},
		{
			id: "2",
			name: "Google Meet",
			imgPath: require("../../assets/2.png")
		},
		{
			id: "3",
			name: "Microsoft Team",
			imgPath: require("../../assets/3.png")
		},
	];
	const data2 = [
		{
			id: '1',
			btnName: 'Whole Classes'
		},
		{
			id: '2',
			btnName: 'Selected Students'
		},
	];
	const [selectItem, setSelectItem] = useState({
		class: 'Select',
		section: 'Select',
		subject: 'Select',
		assignTo: "Select",
		startDateTime: 'Start DateTime',
		endDateTime: 'End DateTime',
	});

	const [selectList, setSelectlist] = useState({
		modelBox: false,
		classList: false,
		sectionList: false,
		subjectList: false,
		assignTO: false
	});



	const [meetingIds, setMeetingIds] = useState('1');
	const [studentIdStore, setStudentIdStore] = useState([]);
	const [totalLength, setTotalLength] = useState(0);
	const [studentHolder, setStudentHolder] = useState(false);
	const [stuListModel, setstuListModel] = useState(false);

	useEffect(() => {
		setTotalLength(studentList?.length || 0);
	}, [studentList]);

	function onClickLeftIcon() {
		navigation.goBack()
	}
	function onClickRightIcon() {
		// setIsInstruction(true)
	}
	const formatDateTime = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${year}/${month}/${day} ${hours}:${minutes}`;
	};
	function selectMeetType(meetIds) {
		setMeetingIds(meetIds)
	}
	function hideBoxModel() {
		setSelectlist((x) => {
			return { ...x, modelBox: false }
		})
	}
	function showPopup(num, listName) {
		setSelectlist((x) => {
			return { ...x, modelBox: true };
		});
		if (num === 1) {
			setIsload(true)
			setClickedName(listName);
			setSelectlist((prev) => {
				return { ...prev, classList: true };
			});
			setSelectlist((prev) => {
				return { ...prev, sectionList: false };
			});

			const payload = {
				"schoolCode": userData.data.schoolCode,
				"userTypeID": userData.data.userTypeID,
				"userRefID": userData.data.userRefID,
				"academicYear": userData.data.academicYear
			}
			Services.post(apiRoot.getClassList, payload)
				.then((result) => {
					if (result.status === "success") {
						setClsList(result.data);
						setIsload(false);
					} else {
						alert(result.message);
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setIsload(false);
				});
		}
		else if (num === 2) {
			setIsload(true)
			setClickedName(listName);
			setSelectlist((prev) => {
				return { ...prev, classList: false };
			});
			setSelectlist((prev) => {
				return { ...prev, sectionList: true };
			});
			const payload = {
				"classID": clsIds,
				"schoolCode": userData.data.schoolCode,
				"userTypeID": userData.data.userTypeID,
				"userRefID": userData.data.userRefID,
				"academicYear": userData.data.academicYear
			}
			Services.post(apiRoot.getSectionList, payload)
				.then((result) => {
					if (result.status === "success") {
						setsectionList(result.data);
						setIsload(false);
					} else {
						alert(result.message);
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setIsload(false);
				});
		}
		else if (num === 3) {
			setIsload(true)
			setClickedName(listName);
			setSelectlist((prev) => {
				return { ...prev, classList: false };
			});
			setSelectlist((prev) => {
				return { ...prev, sectionList: false };
			});
			setSelectlist((prev) => {
				return { ...prev, subjectList: true };
			});
			const payLoad = {
				"classID": clsIds,
				"schoolCode": userData.data.schoolCode,
				"userTypeID": userData.data.userTypeID,
				"userRefID": userData.data.userRefID,
				"sectionID": sectIds,
				"academicYear": userData.data.academicYear
			}
			Services.post(apiRoot.getSubjectList, payLoad)
				.then((result) => {
					if (result.status === "success") {
						setSubjectList(result.data);
						setIsload(false);
					} else {
						alert(result.message);
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setIsload(false);
				});
		}
	}
	function getClass(clsName, classIDS) {
		setClsIds(classIDS)
		setSelectItem((x) => {
			return { ...x, class: clsName }
		})
		setTimeout(() => {
			setSelectlist((x) => {
				return { ...x, modelBox: false }
			})
		}, 1000);

	}
	function getSection(name, secIds) {
		setSectIds(secIds)
		setSelectItem((x) => {
			return { ...x, section: name }
		})
		setTimeout(() => {
			setSelectlist((x) => {
				return { ...x, modelBox: false }
			})
		}, 1000);

	}
	function getSubject(name, subIds) {
		setSubjectds(subIds)
		setSelectItem((x) => {
			return { ...x, subject: name }
		})
		setTimeout(() => {
			setSelectlist((x) => {
				return { ...x, modelBox: false }
			})
		}, 1000);

	}

	function assignToModel() {
		setstuListModel(true)
	}
	function closeAssignModal() {
		setstuListModel(false)
	}
	function selectAnyNone(ids) {
		setactAnyNone(ids)
		if (ids == 2) {
			setIsload(true)
			const payLoad = {
				"classID": clsIds,
				"schoolCode": userData.data.schoolCode,
				"sectionID": sectIds,
				"subjectID": subjectIds,
				"academicYear": userData.data.academicYear
			}
			Services.post(apiRoot.getStudentListForLiveClass, payLoad)
				.then((result) => {
					if (result.status === "success") {
						setStudentList(result.data);
						setIsload(false);
						setStudentHolder(true)
					} else {
						alert(result.message);
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setIsload(false);
				});
		}
		else if (ids == 1) {
			setStudentHolder(false)
			setStudentIdStore("All")
			setStuNameStore('All')
		}

	}
	function selectStudent(sId, stuNames) {
		// setStuNameStore(stuNames)
		setStudentIdStore((prev) => {
			if (prev.includes(sId)) {
				// Remove the ID if it's already in the list
				return prev.filter(id => id !== sId);
			} else {
				// Add the ID if it's not in the list
				return [...prev, sId];
			}
		});
		setStuNameStore((prev) => {
			const formattedStuNames = `${stuNames} ,` //stuNames + ' ,'; 
			if (prev.includes(formattedStuNames)) {
				// Remove the ID if it's already in the list
				return prev.filter(id => id !== formattedStuNames);
			} else {
				// Add the ID if it's not in the list
				return [...prev, formattedStuNames + ','];
			}
		});
	}
	const selectAll = () => {
		if (studentIdStore.length === totalLength) {
			// Deselect all if all are already selected
			setStudentIdStore([]);
		} else {
			// Select all students
			const allStudentIds = studentList.map((item) => item.getStudentName.studentID);
			setStudentIdStore(allStudentIds);
		}

		if (studentIdStore.length === totalLength) {
			// Deselect all if all are already selected
			setStuNameStore([]);
		} else {
			// Select all students
			const allStudentNms = studentList.map((item) => item.getStudentName.firstName);
			setStuNameStore(allStudentNms);
		}
	};
	const handleChange = (name, value) => {
		setFillData({
			...fillData,
			[name]: value
		});
	};

	function assignMeeting() {
		const payLoad = {
			"schoolCode": userData.data.schoolCode,
			"userRefID": userData.data.userRefID,
			"plateformID": meetingIds,
			"classID": clsIds,
			"sectionID": sectIds,
			"subjectID": subjectIds,
			"subjectTopic": fillData.topic,
			"meetingURL": fillData.meetUrl,
			"meetingInstruction": fillData.instruction,
			"startDateTime": formattedDateTime,
			"endDateTime": formattedDateTime2,
			"studentIDs": studentIdStore
		}
		Services.post(apiRoot.saveLiveClasses, payLoad)
			.then((result) => {
				if (result.status === "success") {
					alert(result.message);
					setIsload(false);
					getLiveClassListFun();
				} else {
					alert(result.message);
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setIsload(false);
			});
	}

	function getLiveClassListFun() {
		const payLoad = {
			"schoolCode": userData.data.schoolCode,
			"userRefID": userData.data.userRefID,
			"userTypeID": userData.data.userTypeID,
		}
		Services.post(apiRoot.liveClassesList, payLoad)
			.then((result) => {
				if (result.status === "success") {
					navigation.navigate('liveClassList')
					setIsload(false);
				} else {
					console.log(result.message);
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setIsload(false);
			});
	}

	function showList() {
		navigation.navigate('liveClassList')
	}

	const insets = useSafeAreaInsets()



	return (
		<SafeAreaProvider>
			<SafeAreaView edges={['left', 'top', 'right']} style={{ flex: 1, marginTop: Platform.OS == "ios" ? 0 : 24, backgroundColor: userData?.data?.colors?.mainTheme, }}>
				<View style={{ flex: 1, backgroundColor: SWATheam.SwaWhite, paddingBottom: insets.bottom }}>
					<SwaHeader title={"Live Class"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
					<View style={styles.headerAss}>
						<Text style={styles.asslistText}>SCHEDULE LIVE CLASSES</Text>
						<View style={styles.row}>
							<TouchableOpacity style={styles.buttonLive} onPress={showList}>
								<Text style={styles.textInBtn}> Live Classes List</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.buttonLive}>
								<Text style={styles.textInBtn}> Attendance Report</Text>
							</TouchableOpacity>
						</View>
					</View>
					<ScrollView>
						<View style={styles.row2}>
							<ScrollView horizontal>
								{data.map((item) => {
									return (
										<TouchableOpacity key={item.id}
											style={[styles.buttonClick, { borderColor: meetingIds.includes(item.id) ? "green" : '#e5e9e9' }]}
											onPress={() => { selectMeetType(item.id) }} >
											<Image style={styles.iconsImgss} source={item.imgPath} />
											<Text style={{ fontSize: 13, textAlign: "center", color: SWATheam.SwaBlack }}>{item.name}</Text>
										</TouchableOpacity>
									)
								})}
							</ScrollView>
						</View>
						<View style={styles.formBgs}>
							<Text style={styles.titleText}>Select Class</Text>
							<TouchableOpacity style={styles.rowInput} onPress={() => { showPopup(1, 'Select Class') }}>
								<Text style={{ color: SWATheam.SwaBlack }}>{selectItem.class}</Text>
								<AntDesign name="down" size={20} color={SWATheam.SwaBlack} />
							</TouchableOpacity>

							<Text style={styles.titleText}>Select Section</Text>
							<TouchableOpacity style={styles.rowInput} onPress={() => { showPopup(2, 'Select Section') }}>
								<Text style={{ color: SWATheam.SwaBlack }}>{selectItem.section}</Text>
								<AntDesign name="down" size={20} color={SWATheam.SwaBlack} />
							</TouchableOpacity>

							<Text style={styles.titleText}>Select Subject</Text>
							<TouchableOpacity style={styles.rowInput} onPress={() => { showPopup(3, 'Select Subject') }}>
								<Text style={{ color: SWATheam.SwaBlack }}>{selectItem.subject}</Text>
								<AntDesign name="down" size={20} color={SWATheam.SwaBlack} />
							</TouchableOpacity>

							<Text style={styles.titleText}>Assign To</Text>
							<TouchableOpacity style={styles.rowInput} onPress={assignToModel}>
								<Text style={{ color: SWATheam.SwaBlack }}>{stuNameStore}</Text>
								<AntDesign name="down" size={20} color={SWATheam.SwaBlack} />
							</TouchableOpacity>
							<TextInput
								value={fillData.topic}
								label="Topic"
								style={styles.inputBox}
								onChangeText={(text) => handleChange('topic', text)}
							/>
							<TextInput
								label="Instruction"
								value={fillData.instruction}
								style={styles.inputBox}
								onChangeText={(text) => handleChange('instruction', text)}
							/>
							<TextInput
								label="Meeting URL"
								value={fillData.meetUrl}
								style={styles.inputBox}
								onChangeText={(text) => handleChange('meetUrl', text)}
							/>
							<View style={styles.row}>
								<View style={{ width: "48%" }}>
									<Text style={styles.titleText}>Start DateTime</Text>
									<TouchableOpacity style={styles.rowInput} onPress={() => setOpen(true)}>
										<Text>{formattedDateTime}</Text>
										<Fontisto name="date" size={20} color={SWATheam.SwaBlack} />
									</TouchableOpacity>
								</View>
								<View style={{ width: "48%" }}>
									<Text style={styles.titleText}>End DateTime</Text>
									<TouchableOpacity style={styles.rowInput} onPress={() => setOpen2(true)}>
										<Text>{formattedDateTime2}</Text>
										<Fontisto name="date" size={20} color={SWATheam.SwaBlack} />
									</TouchableOpacity>
								</View>
							</View>

						</View>
					</ScrollView>
					<TouchableOpacity style={styles.assignMeeting} onPress={assignMeeting}>
						<Text style={{ textAlign: 'center', color: '#fff', fontSize: 15 }}>Assign Meeting</Text>
					</TouchableOpacity>

					{selectList.modelBox &&
						<Modal animationType="slide" transparent={true}>
							<View style={styles.bgModal}>
								<View style={styles.holderModel}>
									<View style={styles.headingBox}>
										<Text style={styles.selectedReq}>{clickedName}</Text>

									</View>
									<TouchableOpacity style={styles.closeIcons} onPress={hideBoxModel}>
										<AntDesign style name="close" size={30} color={SWATheam.SwaBlack} />
									</TouchableOpacity>

									{
										selectList.classList && clsList?.length > 0 ? (
											clsList.map((item, index) => {
												let className = item.getClassDetail.classDesc;
												let classIDS = item.getClassDetail.classID;
												return (
													<TouchableOpacity
														style={styles.nameOfItem}
														key={index}
														onPress={() => getClass(className, classIDS)}
													>
														<Text style={styles.textname}>{className}</Text>
													</TouchableOpacity>
												);
											})
										) : selectList.sectionList && sectionList?.length > 0 ? (
											sectionList.map((item, index) => {
												let secName = item.sectionName;
												let sectionID = item.sectionID;
												return (
													<TouchableOpacity
														style={styles.nameOfItem}
														key={index}
														onPress={() => getSection(secName, sectionID)}
													>
														<Text style={styles.textname}>{secName}</Text>
													</TouchableOpacity>
												);
											})
										) : selectList.subjectList && subjectList?.length > 0 ? (
											subjectList.map((item, index) => {
												let subName = item.subjectName;
												let subIds = item.subjectID;
												return (
													<TouchableOpacity
														style={styles.nameOfItem}
														key={index}
														onPress={() => getSubject(subName, subIds)}
													>
														<Text style={styles.textname}>{subName}</Text>
													</TouchableOpacity>
												);
											})
										)
											: (
												<Text style={styles.errorText}>Please Select Required Field!</Text>
											)
									}
								</View>
							</View>
						</Modal>
					}
					{stuListModel &&
						<Modal animationType="slide" transparent={true}>
							<View style={styles.ViewBox}>
								<View style={styles.boxContainer}>
									<View style={[styles.headingBox2]}>
										<Text style={{ fontWeight: "bold" }}>Assign To</Text>
										<TouchableOpacity onPress={closeAssignModal}>
											<AntDesign style name="close" size={30} color={SWATheam.SwaBlack} />
										</TouchableOpacity>
									</View>

									<View style={{ flex: 1, padding: 15 }}>

										<View style={styles.optionsCheck}>

											{data2?.map((item, index) => {
												return (
													<TouchableOpacity key={item.id} style={[styles.button, { borderColor: actAnyNone.includes(item.id) ? "green" : "#333" }]}
														onPress={() => { selectAnyNone(item.id) }}>
														<Text style={styles.textStu}>{item.btnName}</Text>
													</TouchableOpacity>
												)
											})}
										</View>


										{studentHolder &&
											<>
												<View style={styles.rowFlex}>
													<TouchableOpacity style={styles.rowCheckWith} onPress={selectAll}>
														<Text>Select All</Text>
														<Checkbox status={studentIdStore.length === totalLength ? 'checked' : 'unchecked'} />
													</TouchableOpacity>
													<TouchableOpacity style={styles.doneBtn} onPress={closeAssignModal}>
														<Text>Done</Text>
													</TouchableOpacity>
												</View>
												<ScrollView contentContainerStyle={{ paddingBottom: 60 }}>

													{studentList?.map((item, index) => {
														let name = item.getStudentName.firstName;
														let className = item.getStudentName.classID;
														let contactNum = item.getStudentName.fatherContact;
														let sectionName = item.getStudentSection.sectionName;
														let stuIds = item.getStudentName.studentID;
														return (
															<View style={[styles.boxHolder, { backgroundColor: studentIdStore.includes(stuIds) ? '#f0fffa' : '#fff' }]} key={stuIds}>
																<TouchableOpacity style={[styles.rowView, { height: 40 }]}
																	onPress={() => { selectStudent(stuIds, name) }}>
																	<Text style={styles.number}>{index + 1}</Text>
																	<Checkbox status={studentIdStore.includes(stuIds) ? 'checked' : 'unchecked'} />
																</TouchableOpacity>
																<View style={styles.rowView}>
																	<Text style={styles.number}>Name</Text>
																	<Text style={styles.numberRight}>{name}</Text>
																</View>
																<View style={styles.rowView}>
																	<Text style={styles.number}>Class : {className}</Text>
																	<Text style={styles.number}>Section : {sectionName}</Text>
																</View>
																<View style={styles.rowView}>
																	<Text style={styles.number}>Contact No</Text>
																	<Text style={styles.numberRight}>{contactNum}</Text>
																</View>
															</View>
														)
													})}
												</ScrollView>
											</>
										}
									</View>

								</View>

							</View>
						</Modal>
					}
					<DatePicker
						modal
						mode="datetime"
						open={open}
						date={date}
						onConfirm={(date) => {
							setOpen(false);
							setDate(date);
							const formatted = formatDateTime(date); // Save the formatted date and time
							setFormattedDateTime(formatted);
						}}
						onCancel={() => {
							setOpen(false);
						}}
					/>
					<DatePicker
						modal
						mode="datetime"
						open={open2}
						date={date}
						onConfirm={(date) => {
							setOpen2(false);
							setDate(date);
							const formatted2 = formatDateTime(date); // Save the formatted date and time
							setFormattedDateTime2(formatted2);
						}}
						onCancel={() => {
							setOpen2(false);
						}}
					/>

					{isLoad && <Loader />}
				</View>

			</SafeAreaView>


		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	buttonTouch: {
		width: 80,
		padding: 8,
		borderRadius: 5,
		elevation: 1,
		backgroundColor: "green"
	},
	iconsq: {
		alignSelf: 'center',
		color: '#fa8805',
		margin: 20
	},
	deleteCls: {
		paddingHorizontal: 15,
		padding: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: 'red',
	},
	joinBtn: {
		paddingHorizontal: 15,
		padding: 5,
		borderRadius: 5,
		backgroundColor: 'green'
	},
	held: {
		paddingHorizontal: 15,
		padding: 5,
		borderRadius: 5,
		backgroundColor: 'red'
	},
	holderListLive: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#212529a1",
		padding: 10
	},
	whiteBox: {
		backgroundColor: '#fff',
		width: "100%",
		height: "100%"
	},
	rowFlex: {
		flexDirection: "row",
		justifyContent: 'space-between',
		alignItems: "center",
		backgroundColor: "#f2f2f2",
		padding: 5
	},
	doneBtn: {
		borderWidth: 1,
		padding: 5,
		paddingHorizontal: 15,
		borderRadius: 5,
		borderColor: "#07a26f"
	},
	rowCheckWith: {
		flexDirection: "row",
		justifyContent: 'space-between',
		alignItems: "center",
	},
	rowView: {
		flexDirection: "row",
		justifyContent: 'space-between',
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: "#dddddd",
		padding: 10
	},
	number: {
		fontSize: 16,
		fontWeight: "bold",
		color: SWATheam.SwaBlack
	},
	numberRight: {
		fontSize: 16,
		color: SWATheam.SwaBlack
	},
	optionsCheck: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		margin: 10
	},
	boxHolder: {
		backgroundColor: "#fff",
		padding: 10,
		elevation: 3,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#a0f1a0",
		marginTop: 18
	},
	textStu: {
		textAlign: "center",
		color: SWATheam.SwaBlack
	},
	button: {
		borderWidth: 1,
		padding: 10,
		borderRadius: 50,
		borderColor: "#e4e4e4",
		elevation: 3,
		backgroundColor: "#fff",
		width: 150,
	},
	ViewBox: {
		backgroundColor: "#00000036",
		width: '100%',
		height: "100%",
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	boxContainer: {
		backgroundColor: "#fff",
		width: '95%',
		borderRadius: 10,
		flex: 1,
		marginTop: 150,
		marginBottom: 20
	},
	errorText: {
		textAlign: 'center',
		margin: 15,
		color: 'red'
	},
	titleText: {
		fontSize: 14,
		marginTop: 15,
		marginLeft: 7,
		color: SWATheam.SwaBlack
	},
	textname: {
		fontSize: 17,
		color: SWATheam.SwaBlack
	},
	nameOfItem: {
		borderBottomWidth: 1,
		borderColor: "#e4e4e4",
		padding: 10
	},
	closeIcons: {
		position: "absolute",
		right: 10,
		top: 10
	},
	selectedReq: {
		textAlign: "center",
		borderBottomWidth: 3,
		borderColor: "#d8d3d3",
		fontSize: 16,
		fontWeight: 'bold'
	},
	headingBox: {
		alignSelf: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headingBox2: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: '#f4f4f4',
		padding: 10,
		elevation: 3
	},
	holderModel: {
		backgroundColor: "#fff",
		padding: 15,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		position: 'relative'
	},
	holderModel2: {
		backgroundColor: "#fff",
		padding: 15,
		position: 'relative',
		margin: 10,
		borderRadius: 10
	},
	assignMeeting: {
		backgroundColor: "#46a26a",
		padding: 10,
		borderRadius: 15,
		elevation: 2,
		margin: 10
	},
	rowInput: {
		margin: 3,
		borderWidth: 1,
		borderColor: "#e3e0e0",
		padding: 10,
		borderRadius: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#fff",
		marginBottom: 10,
		height: 53,
	},
	inputBox: {
		margin: 3,
		borderWidth: 1,
		borderColor: "#e3e0e0",
		padding: 2,
		borderRadius: 10,
		backgroundColor: "#fff",
		marginBottom: 15,
		height: 50,
		flex: 1
	},
	formBgs: {
		borderWidth: 1,
		margin: 5,
		padding: 5,
		borderColor: "#f3f3f3",
		backgroundColor: "#f8f8f8",
		borderRadius: 10
	},
	iconsImgss: {
		width: 30,
		height: 30,
		resizeMode: "contain",
		margin: 'auto'
	},
	buttonClick: {
		borderWidth: 1,
		borderColor: "#e5e9e9",
		width: 115,
		padding: 5,
		paddingHorizontal: 10,
		borderRadius: 10,
		margin: 2,
		elevation: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: "#fff",

	},
	textInBtn: {
		fontSize: 14,
		color: '#fff'
	},
	row2: {
		flexDirection: 'row',
		alignItems: "center",
		justifyContent: "space-around",
		margin: 15,
	},
	row: {
		flexDirection: 'row',
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 15
	},
	headerAss: {
		backgroundColor: "#fff",
		elevation: 5,
		padding: 10
	},
	asslistText: {
		color: "#000",
		textAlign: "center",
		fontSize: 14,
		fontWeight: "bold",
	},
	buttonLive: {
		padding: 10,
		paddingHorizontal: 10,
		borderRadius: 50,
		borderColor: '#5cbbb4',
		backgroundColor: "#0ea0f3",
		elevation: 3
	},
	bgModal: {
		backgroundColor: "#00000047",
		width: "100%",
		height: "100%",
		flex: 1,
		display: 'flex',
		justifyContent: "flex-end"
	},
	bgModal2: {
		backgroundColor: "#00000047",
		width: "100%",
		height: "100%",
		flex: 1,
		display: 'flex',
		justifyContent: "center"
	}
});
