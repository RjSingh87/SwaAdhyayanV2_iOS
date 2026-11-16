import React, { useState, useEffect, useContext } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
	Modal,
	StatusBar,
	Alert,
} from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { TextInput, Checkbox } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import SwaHeader from "../../common/SwaHeader";
import { GlobleData } from "../../../Store";
import Services from "../../../Services";
import { apiRoot, SWATheam } from "../../../constant/ConstentValue";
import Loader from "../../common/Loader";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LiveClass({ navigation, route }) {
	const insets = useSafeAreaInsets();
	const { userData } = useContext(GlobleData);

	const [clickedName, setClickedName] = useState('');
	const [clsList, setClsList] = useState([]);
	const [clsIds, setClsIds] = useState(null);
	const [sectIds, setSectIds] = useState(null);
	const [subjectIds, setSubjectds] = useState(null);
	const [sectionList, setsectionList] = useState([]);
	const [subjectList, setSubjectList] = useState([]);
	const [actAnyNone, setactAnyNone] = useState('');
	const [studentList, setStudentList] = useState([]);

	const [startDateObj, setStartDateObj] = useState(new Date());
	const [endDateObj, setEndDateObj] = useState(new Date());
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [formattedDateTime, setFormattedDateTime] = useState('');
	const [formattedDateTime2, setFormattedDateTime2] = useState('');

	const [stuNameStore, setStuNameStore] = useState('');
	const [studentIdStore, setStudentIdStore] = useState([]);
	const [totalLength, setTotalLength] = useState(0);
	const [studentHolder, setStudentHolder] = useState(false);
	const [stuListModel, setstuListModel] = useState(false);

	const [fillData, setFillData] = useState({
		topic: '',
		instruction: '',
		meetUrl: ''
	});

	const [isLoad, setIsload] = useState(false);

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
			btnName: 'Whole Class'
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

	useEffect(() => {
		setTotalLength(studentList?.length || 0);
	}, [studentList]);

	function onClickLeftIcon() {
		navigation.goBack();
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
		setMeetingIds(meetIds);
	}

	function hideBoxModel() {
		setSelectlist((x) => ({ ...x, modelBox: false }));
	}

	function showPopup(num, listName) {
		if (num === 1) {
			setClickedName(listName);
			setSelectlist({
				modelBox: true,
				classList: true,
				sectionList: false,
				subjectList: false,
				assignTO: false
			});
			setIsload(true);
			const payload = {
				schoolID: userData.data.schoolID,
				userTypeID: userData.data.userTypeID,
				userRefID: userData.data.userRefID,
				academicYear: userData.data.academicYear
			};
			Services.post(apiRoot.getClassList, payload)
				.then((result) => {
					if (result.status === "success") {
						setClsList(result.data || []);
					} else {
						alert(result.message || "Failed to get class list");
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setIsload(false);
				});
		} else if (num === 2) {
			if (!clsIds) {
				alert('Please select Class first');
				return;
			}
			setClickedName(listName);
			setSelectlist({
				modelBox: true,
				classList: false,
				sectionList: true,
				subjectList: false,
				assignTO: false
			});
			setIsload(true);
			const payload = {
				classID: clsIds,
				schoolID: userData.data.schoolID,
				userTypeID: userData.data.userTypeID,
				userRefID: userData.data.userRefID,
				academicYear: userData.data.academicYear
			};
			Services.post(apiRoot.getSectionList, payload)
				.then((result) => {
					if (result.status === "success") {
						setsectionList(result.data || []);
					} else {
						alert(result.message || "Failed to get section list");
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setIsload(false);
				});
		} else if (num === 3) {
			if (!clsIds) {
				alert('Please select Class first');
				return;
			}
			if (!sectIds) {
				alert('Please select Section first');
				return;
			}
			setClickedName(listName);
			setSelectlist({
				modelBox: true,
				classList: false,
				sectionList: false,
				subjectList: true,
				assignTO: false
			});
			setIsload(true);
			const payLoad = {
				classID: clsIds,
				schoolID: userData.data.schoolID,
				userTypeID: userData.data.userTypeID,
				userRefID: userData.data.userRefID,
				sectionID: sectIds,
				academicYear: userData.data.academicYear
			};
			Services.post(apiRoot.getSubjectList, payLoad)
				.then((result) => {
					if (result.status === "success") {
						setSubjectList(result.data || []);
					} else {
						alert(result.message || "Failed to get subject list");
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
		setClsIds(classIDS);
		setSelectItem((prev) => ({
			...prev,
			class: clsName,
			section: 'Select',
			subject: 'Select',
		}));
		// Reset downstream selections
		setSectIds(null);
		setsectionList([]);
		setSubjectds(null);
		setSubjectList([]);
		setStudentList([]);
		setStudentIdStore([]);
		setStuNameStore('');
		setactAnyNone('');
		setStudentHolder(false);
		setSelectlist((prev) => ({ ...prev, modelBox: false }));
	}

	function getSection(name, secIds) {
		setSectIds(secIds);
		setSelectItem((prev) => ({
			...prev,
			section: name,
			subject: 'Select',
		}));
		// Reset downstream selections
		setSubjectds(null);
		setSubjectList([]);
		setStudentList([]);
		setStudentIdStore([]);
		setStuNameStore('');
		setactAnyNone('');
		setStudentHolder(false);
		setSelectlist((prev) => ({ ...prev, modelBox: false }));
	}

	function getSubject(name, subIds) {
		setSubjectds(subIds);
		setSelectItem((prev) => ({
			...prev,
			subject: name,
		}));
		// Reset downstream selections
		setStudentList([]);
		setStudentIdStore([]);
		setStuNameStore('');
		setactAnyNone('');
		setStudentHolder(false);
		setSelectlist((prev) => ({ ...prev, modelBox: false }));
	}

	function assignToModel() {
		if (!clsIds) {
			alert('Please select Class first');
			return;
		}
		if (!sectIds) {
			alert('Please select Section first');
			return;
		}
		if (!subjectIds) {
			alert('Please select Subject first');
			return;
		}
		setstuListModel(true);
	}

	function closeAssignModal() {
		if (actAnyNone === '2') {
			const currentIds = Array.isArray(studentIdStore) ? studentIdStore : [];
			if (currentIds.length === 0) {
				// No specific students selected – show a generic label
				setStuNameStore('Selected Students');
			} else if (studentList && currentIds.length === studentList.length) {
				setStuNameStore(`All (${currentIds.length} Students)`);
			} else if (currentIds.length === 1) {
				const stu = studentList?.find(s => s.getStudentName.studentID === currentIds[0]);
				setStuNameStore(stu ? stu.getStudentName.firstName : '1 Student Selected');
			} else {
				setStuNameStore(`${currentIds.length} Students Selected`);
			}
		}
		setstuListModel(false);
	}

	function fetchStudentList() {
		setIsload(true);
		const payLoad = {
			classID: clsIds,
			schoolID: userData.data.schoolID,
			sectionID: sectIds,
			subjectID: subjectIds,
			academicYear: userData.data.academicYear
		};
		Services.post(apiRoot.getStudentListForLiveClass, payLoad)
			.then((result) => {
				if (result.status === "success") {
					setStudentList(result.data || []);
					setStudentHolder(true);
					if (studentIdStore === 'All') {
						setStudentIdStore([]);
						setStuNameStore('');
					}
				} else {
					alert(result.message || 'No students found');
					setStudentList([]);
					setStudentHolder(true);
				}
			})
			.catch((err) => {
				console.log(err);
				alert('Failed to fetch students');
			})
			.finally(() => {
				setIsload(false);
			});
	}

	function selectAnyNone(ids) {
		setactAnyNone(ids);
		if (ids === '1') {
			setStudentHolder(false);
			setStudentIdStore('All');
			setStuNameStore('Whole Class');
		} else if (ids === '2') {
			if (studentList && studentList.length > 0) {
				setStudentHolder(true);
				if (studentIdStore === 'All') {
					setStudentIdStore([]);
					setStuNameStore('Selected Student');
				}
			} else {
				fetchStudentList();
			}
		}
	}

	function selectStudent(sId, stuNames) {
		const currentIds = Array.isArray(studentIdStore) ? [...studentIdStore] : [];
		const index = currentIds.indexOf(sId);
		let updatedIds;
		if (index > -1) {
			updatedIds = currentIds.filter(id => id !== sId);
		} else {
			updatedIds = [...currentIds, sId];
		}
		setStudentIdStore(updatedIds);

		if (updatedIds.length === 0) {
			setStuNameStore('');
		} else if (studentList && updatedIds.length === studentList.length) {
			setStuNameStore(`All (${updatedIds.length} Students)`);
		} else if (updatedIds.length === 1) {
			const stu = studentList?.find(s => s.getStudentName.studentID === updatedIds[0]);
			setStuNameStore(stu ? stu.getStudentName.firstName : stuNames);
		} else {
			setStuNameStore(`${updatedIds.length} Students Selected`);
		}
	}

	const selectAll = () => {
		if (!studentList || studentList.length === 0) return;
		const allStudentIds = studentList.map((item) => item.getStudentName.studentID);
		const currentIds = Array.isArray(studentIdStore) ? studentIdStore : [];
		if (currentIds.length === allStudentIds.length) {
			setStudentIdStore([]);
			setStuNameStore('');
		} else {
			setStudentIdStore(allStudentIds);
			setStuNameStore(`All (${allStudentIds.length} Students)`);
		}
	};

	const handleChange = (name, value) => {
		setFillData((prev) => ({
			...prev,
			[name]: value
		}));
	};

	function assignMeeting() {
		if (!meetingIds) {
			alert('Please select a meeting platform');
			return;
		}
		if (!clsIds) {
			alert('Please select Class');
			return;
		}
		if (!sectIds) {
			alert('Please select Section');
			return;
		}
		if (!subjectIds) {
			alert('Please select Subject');
			return;
		}
		// Ensure there are students in the selected class/section
		if (!studentList || studentList.length === 0) {
			alert('No students available for the selected class/section');
			return;
		}
		if (actAnyNone === '1') {
			// Whole Class: no further validation needed
		} else if (actAnyNone === '2') {
			if (!Array.isArray(studentIdStore) || studentIdStore.length === 0) {
				alert('Please select at least one student');
				return;
			}
		}
		if (!fillData.topic || !fillData.topic.trim()) {
			alert('Please enter Topic');
			return;
		}
		if (!fillData.meetUrl || !fillData.meetUrl.trim()) {
			alert('Please enter Meeting URL');
			return;
		}
		if (!formattedDateTime) {
			alert('Please select Start Date Time');
			return;
		}
		if (!formattedDateTime2) {
			alert('Please select End Date Time');
			return;
		}

		if (startDateObj.getTime() < Date.now() - 2 * 60 * 1000) {
			alert('Start Date & Time cannot be in the past');
			return;
		}
		if (endDateObj.getTime() <= startDateObj.getTime()) {
			alert('End Date & Time must be after Start Date & Time');
			return;
		}

		let cleanUrl = fillData.meetUrl.trim();
		if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
			cleanUrl = 'https://' + cleanUrl;
		}

		// Convert student IDs to a format expected by the backend.
		const studentIdsPayload = Array.isArray(studentIdStore) ? studentIdStore.join(',') : studentIdStore;
		const payLoad = {
			schoolID: userData.data.schoolID,
			userRefID: userData.data.userRefID,
			plateformID: meetingIds,
			classID: clsIds,
			sectionID: sectIds,
			subjectID: subjectIds,
			subjectTopic: fillData.topic.trim(),
			meetingURL: cleanUrl,
			meetingInstruction: fillData.instruction ? fillData.instruction.trim() : '',
			startDateTime: formattedDateTime,
			endDateTime: formattedDateTime2,
			studentIDs: studentIdsPayload
		};

		setIsload(true);
		Services.post(apiRoot.saveLiveClasses, payLoad)
			.then((result) => {
				if (result.status === "success") {
					alert(result.message);
					setSelectItem({
						class: 'Select',
						section: 'Select',
						subject: 'Select',
						assignTo: "Select",
						startDateTime: 'Start DateTime',
						endDateTime: 'End DateTime',
					});
					setClsIds(null);
					setSectIds(null);
					setSubjectds(null);
					setFillData({
						topic: '',
						instruction: '',
						meetUrl: ''
					});
					setStudentList([]);
					setStudentIdStore([]);
					setStuNameStore('');
					setactAnyNone('');
					setStudentHolder(false);
					setFormattedDateTime('');
					setFormattedDateTime2('');
					getLiveClassListFun();
				} else {
					alert(result.message);
				}
			})
			.catch((err) => {
				console.log(err);
				alert('Something went wrong. Please try again.');
			})
			.finally(() => {
				setIsload(false);
			});
	}

	function getLiveClassListFun() {
		const payLoad = {
			schoolID: userData.data.schoolID,
			userRefID: userData.data.userRefID,
			userTypeID: userData.data.userTypeID,
		};
		Services.post(apiRoot.liveClassesList, payLoad)
			.then((result) => {
				if (result.status === "success") {
					navigation.navigate('liveClassList');
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
		navigation.navigate('liveClassList');
	}

	return (
		<SafeAreaProvider style={{ flex: 1, paddingTop: insets.top, marginBottom: insets.bottom, backgroundColor: userData.data.colors.mainTheme }}>
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
			<ScrollView style={{ backgroundColor: userData.data.colors.liteTheme }}>
				<View style={styles.row2}>
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{data.map((item) => {
							const isSelected = meetingIds === item.id;
							return (
								<TouchableOpacity
									key={item.id}
									style={[styles.buttonClick, { borderColor: isSelected ? "green" : '#e5e9e9', borderWidth: isSelected ? 2 : 1 }]}
									onPress={() => { selectMeetType(item.id) }}
								>
									<Image style={styles.iconsImgss} source={item.imgPath} />
									<Text style={{ fontSize: 13, textAlign: "center", color: isSelected ? "green" : SWATheam.SwaBlack, fontWeight: isSelected ? "bold" : "normal" }}>
										{item.name}
									</Text>
								</TouchableOpacity>
							);
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
						<Text style={{ color: SWATheam.SwaBlack }}>{stuNameStore || 'Select'}</Text>
						<AntDesign name="down" size={20} color={SWATheam.SwaBlack} />
					</TouchableOpacity>

					<TextInput
						value={fillData.topic}
						label="Topic"
						style={styles.inputBox}
						onChangeText={(text) => handleChange('topic', text)}
					/>
					<TextInput
						label="Instruction (Optional)"
						value={fillData.instruction}
						style={styles.inputBox}
						onChangeText={(text) => handleChange('instruction', text)}
					/>
					<TextInput
						label="Meeting URL"
						value={fillData.meetUrl}
						style={styles.inputBox}
						autoCapitalize="none"
						onChangeText={(text) => handleChange('meetUrl', text)}
					/>
					<View style={styles.row}>
						<View style={{ width: "48%" }}>
							<Text style={styles.titleText}>Start Date Time</Text>
							<TouchableOpacity style={styles.rowInput} onPress={() => setOpen(true)}>
								<Text style={{ color: formattedDateTime ? SWATheam.SwaBlack : '#888', fontSize: 13 }} numberOfLines={1}>
									{formattedDateTime || 'Select Start Time'}
								</Text>
								<Fontisto name="date" size={18} color={SWATheam.SwaBlack} />
							</TouchableOpacity>
						</View>
						<View style={{ width: "48%" }}>
							<Text style={styles.titleText}>End Date Time</Text>
							<TouchableOpacity
								style={styles.rowInput}
								onPress={() => {
									if (!formattedDateTime) {
										alert('Please select Start Date Time first');
										return;
									}
									setOpen2(true);
								}}
							>
								<Text style={{ color: formattedDateTime2 ? SWATheam.SwaBlack : '#888', fontSize: 13 }} numberOfLines={1}>
									{formattedDateTime2 || 'Select End Time'}
								</Text>
								<Fontisto name="date" size={18} color={SWATheam.SwaBlack} />
							</TouchableOpacity>
						</View>
					</View>

				</View>
			</ScrollView>
			<TouchableOpacity style={styles.assignMeeting} onPress={assignMeeting}>
				<Text style={{ textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Assign Meeting</Text>
			</TouchableOpacity>

			{selectList.modelBox &&
				<Modal animationType="slide" transparent={true} onRequestClose={hideBoxModel}>
					<View style={styles.bgModal}>
						<View style={styles.holderModel}>
							<View style={styles.headingBox}>
								<Text style={styles.selectedReq}>{clickedName}</Text>
							</View>
							<TouchableOpacity style={styles.closeIcons} onPress={hideBoxModel}>
								<AntDesign name="close" size={26} color={SWATheam.SwaBlack} />
							</TouchableOpacity>
							<ScrollView style={{ maxHeight: 350, marginTop: 10 }}>
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
									) : (
										<Text style={styles.errorText}>No records found!</Text>
									)
								}
							</ScrollView>
						</View>
					</View>
				</Modal>
			}

			{stuListModel &&
				<Modal animationType="slide" transparent={true} onRequestClose={closeAssignModal}>
					<View style={styles.ViewBox}>
						<View style={styles.boxContainer}>
							<View style={styles.headingBox2}>
								<Text style={{ fontWeight: "bold", fontSize: 16, color: SWATheam.SwaBlack }}>Assign To</Text>
								<TouchableOpacity onPress={closeAssignModal}>
									<AntDesign name="close" size={26} color={SWATheam.SwaBlack} />
								</TouchableOpacity>
							</View>

							<View style={{ flex: 1, padding: 15 }}>
								<View style={styles.optionsCheck}>
									{data2.map((item) => {
										const isSelected = actAnyNone === item.id;
										return (
											<TouchableOpacity
												key={item.id}
												style={[
													styles.button,
													{
														borderColor: isSelected ? "green" : "#e4e4e4",
														backgroundColor: isSelected ? "#e8f5e9" : "#fff",
														borderWidth: isSelected ? 2 : 1
													}
												]}
												onPress={() => { selectAnyNone(item.id) }}
											>
												<Text style={[styles.textStu, { color: isSelected ? "green" : SWATheam.SwaBlack, fontWeight: isSelected ? "bold" : "normal" }]}>
													{item.btnName}
												</Text>
											</TouchableOpacity>
										);
									})}
								</View>

								{actAnyNone === '1' && (
									<View style={{ alignItems: 'center', justifyContent: 'center', padding: 20, marginTop: 20 }}>
										<AntDesign name="checkcircle" size={44} color="green" />
										<Text style={{ fontSize: 16, fontWeight: 'bold', color: SWATheam.SwaBlack, marginTop: 15 }}>
											Whole Class Selected
										</Text>
										<Text style={{ fontSize: 13, color: '#666', textAlign: 'center', marginTop: 8 }}>
											Meeting will be assigned to all students in {selectItem.class} - {selectItem.section}.
										</Text>
										<TouchableOpacity
											style={[styles.doneBtn, { marginTop: 25, paddingHorizontal: 30, paddingVertical: 10, backgroundColor: '#07a26f' }]}
											onPress={closeAssignModal}
										>
											<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Done</Text>
										</TouchableOpacity>
									</View>
								)}

								{actAnyNone === '2' && studentHolder && (
									<>
										{studentList?.length > 0 ? (
											<>
												<View style={styles.rowFlex}>
													<TouchableOpacity style={styles.rowCheckWith} onPress={selectAll}>
														<Text style={{ color: SWATheam.SwaBlack, fontWeight: 'bold' }}>Select All</Text>
														<Checkbox status={Array.isArray(studentIdStore) && studentIdStore.length === totalLength && totalLength > 0 ? 'checked' : 'unchecked'} />
													</TouchableOpacity>
													<TouchableOpacity style={styles.doneBtn} onPress={closeAssignModal}>
														<Text style={{ color: '#07a26f', fontWeight: 'bold' }}>Done</Text>
													</TouchableOpacity>
												</View>
												<ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
													{studentList.map((item, index) => {
														let name = item.getStudentName.firstName + (item.getStudentName.lastName ? ` ${item.getStudentName.lastName}` : '');
														let className = item.getStudentName.classID;
														let contactNum = item.getStudentName.fatherContact;
														let sectionName = item.getStudentSection?.sectionName || selectItem.section;
														let stuIds = item.getStudentName.studentID;
														let isSelected = Array.isArray(studentIdStore) && studentIdStore.includes(stuIds);
														return (
															<View style={[styles.boxHolder, { backgroundColor: isSelected ? '#f0fffa' : '#fff' }]} key={stuIds || index}>
																<TouchableOpacity
																	style={[styles.rowView, { height: 40 }]}
																	onPress={() => { selectStudent(stuIds, name) }}
																>
																	<Text style={styles.number}>{index + 1}</Text>
																	<Checkbox status={isSelected ? 'checked' : 'unchecked'} />
																</TouchableOpacity>
																<View style={styles.rowView}>
																	<Text style={styles.number}>Name</Text>
																	<Text style={styles.numberRight}>{name}</Text>
																</View>
																<View style={styles.rowView}>
																	<Text style={styles.number}>Class : {className}</Text>
																	<Text style={styles.number}>Section : {sectionName}</Text>
																</View>
																{contactNum ? (
																	<View style={styles.rowView}>
																		<Text style={styles.number}>Contact No</Text>
																		<Text style={styles.numberRight}>{contactNum}</Text>
																	</View>
																) : null}
															</View>
														);
													})}
												</ScrollView>
											</>
										) : (
											<View style={{ alignItems: 'center', marginTop: 40 }}>
												<Text style={{ color: '#666', fontSize: 14 }}>No students found in this class & section.</Text>
											</View>
										)}
									</>
								)}

								{!actAnyNone && (
									<View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
										<Text style={{ color: '#888', fontSize: 14 }}>Please select Whole Class or Selected Students</Text>
									</View>
								)}
							</View>
						</View>
					</View>
				</Modal>
			}

			<DatePicker
				modal
				mode="datetime"
				open={open}
				date={startDateObj}
				minimumDate={new Date()}
				onConfirm={(date) => {
					setOpen(false);
					setStartDateObj(date);
					const formatted = formatDateTime(date);
					setFormattedDateTime(formatted);
					if (endDateObj <= date) {
						const newEnd = new Date(date.getTime() + 60 * 60 * 1000);
						setEndDateObj(newEnd);
						setFormattedDateTime2(formatDateTime(newEnd));
					}
				}}
				onCancel={() => {
					setOpen(false);
				}}
			/>
			<DatePicker
				modal
				mode="datetime"
				open={open2}
				date={endDateObj > startDateObj ? endDateObj : new Date(startDateObj.getTime() + 60 * 60 * 1000)}
				minimumDate={startDateObj}
				onConfirm={(date) => {
					setOpen2(false);
					if (date <= startDateObj) {
						alert('End Date Time must be after Start Date Time');
						return;
					}
					setEndDateObj(date);
					const formatted2 = formatDateTime(date);
					setFormattedDateTime2(formatted2);
				}}
				onCancel={() => {
					setOpen2(false);
				}}
			/>

			{isLoad && <Loader />}
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
		justifyContent: "space-between",
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
		marginTop: 10,
		marginBottom: 10
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
		elevation: 3,
		marginTop: 50,
	},
	holderModel: {
		backgroundColor: "#fff",
		padding: 15,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		position: 'relative',
		maxHeight: '75%'
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
		margin: 15
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
