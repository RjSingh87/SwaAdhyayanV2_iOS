import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image, Alert, Dimensions, Button } from "react-native"
import { useEffect, useState, useContext, } from "react"
import { useIsFocused } from '@react-navigation/native';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker'
import { GlobleData } from "../../../../Store"
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue"
import Services from "../../../../Services"
import Loader from "../../../common/Loader"
import ImageViewer from "../../../common/ImageViewer";
import HWPdfViewer from "../../../common/HWPdfViewer";
import YoutubeUrlView from "../../../common/YoutubeUrlView";
import SearchFilter from "../../../common/SearchFilter";
import Share from 'react-native-share';
// duplicate import removed
// duplicate Share import removed


const SaveHomeWork = () => {
	const { userData } = useContext(GlobleData)
	const [sectionData, setSectionData] = useState({ data: null, status: false })
	const [loading, setLoading] = useState(false)
	const [showPopUp, setShowPopUp] = useState(false)
	const [savedHomework, setSavedHomework] = useState({ data: null, status: false })
	const [filteredData, setFilteredData] = useState([]);
	// Sync filtered data with fetched homework
	useEffect(() => {
		if (savedHomework.status && savedHomework.data) {
			setFilteredData(savedHomework.data);
		}
	}, [savedHomework]);
	// Handler for search results
	const handleSearchResult = (results) => {
		setFilteredData(results);
	};
	const [datePickerControl, setDatePickerControl] = useState({ status: false, type: "", homeWorkID: null })
	const [homeworkDates, setHomeworkDates] = useState({})
	const [selectedHomeWork, setSelectedHomeWork] = useState(null)
	const [date, setDate] = useState(new Date())
	let [selectSectionArr, setSelectSectionArr] = useState([])
	const [fileType, setFileType] = useState({ data: null, type: '', fileSrc: null, status: false })



	useEffect(() => {
		getSavedHomeWork()
	}, [])

	function getSavedHomeWork() {
		setLoading(true)
		const payload = {
			"schoolID": userData.data.schoolID,
			"userRefID": userData.data.userRefID,
			"isAssigned": 0
		}
		Services.post(apiRoot.getCreatedHomework, payload)
			.then((res) => {
				if (res.status == "success") {
					console.log({ res, payload }, "GETSAVED")
					setLoading(false)
					const data = res.data
					setSavedHomework((prev) => {
						return { ...prev, data: data, status: true }
					})
				} else {
					// alert(res.message)
					setSavedHomework({ data: null, status: false })
				}
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	function editDate(dateStr, type, targetHomeWorkID) {
		if (!targetHomeWorkID) return;

		let day = dateStr.getDate()
		let month = dateStr.getMonth() + 1
		let year = dateStr.getFullYear()

		let hours = dateStr.getHours()
		let minutes = dateStr.getMinutes()

		if (day < 10) {
			day = "0" + day
		}
		if (month < 10) {
			month = "0" + month
		}
		if (hours < 10) {
			hours = "0" + hours
		}
		if (minutes < 10) {
			minutes = "0" + minutes
		}

		const fTime = hours + ':' + minutes
		const selectedDate = day + '-' + month + '-' + year + ' ' + fTime

		setHomeworkDates((prev) => ({
			...prev,
			[targetHomeWorkID]: {
				...prev[targetHomeWorkID],
				[type]: selectedDate
			}
		}))
	}

	function deleteHomeWork(homeWorkID) {
		Alert.alert(
			'Are you sure!',
			'Delete homework?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'OK',
					onPress: () => {
						const payload = {
							schoolID: userData.data.schoolID,
							userRefID: userData.data.userRefID,
							homeWorkID: homeWorkID,
						};

						Services.post(apiRoot.deleteSavedHomework, payload)
							.then((res) => {
								if (res.status === 'success') {
									Alert.alert(res.message);
									setHomeworkDates((prev) => {
										const updated = { ...prev };
										delete updated[homeWorkID];
										return updated;
									});
									if (savedHomework?.data?.length > 0) {
										getSavedHomeWork();
									}
								} else {
									Alert.alert(res.message);
								}
							})
							.catch((err) => {
								console.log('Delete Homework Error:', err);
							});
					},
				},
			]
		);
	}

	function getSections(item) {
		const dates = homeworkDates[item.homeWorkID] || {}
		const itemStartDate = dates.startDate
		const itemEndDate = dates.endDate

		if (!itemStartDate || !itemEndDate) {
			Alert.alert("Info!", "Please select valid Start Date and End Date.")
			return
		}
		if (itemStartDate === itemEndDate) {
			Alert.alert("Info!", "Start Date and End Date cannot be the same.")
			return
		}

		setSelectedHomeWork(item)
		setSelectSectionArr([])
		setLoading(true)
		const payload = {
			"schoolID": userData.data.schoolID,
			"academicYear": userData.data.academicYear,
			"classID": item.classID,
			"userTypeID": userData.data.userTypeID,
			"userRefID": userData.data.userRefID
		}
		Services.post(apiRoot.getSectionList, payload)
			.then((res) => {
				if (res.status == "success") {
					// console.log({ res, payload })
					setLoading(false)
					const data = res.data
					setSectionData((prev) => {
						return { ...prev, data: data, status: true }
					})
					setShowPopUp(true)
				} else {
					Alert.alert("Info!", res.message)
				}
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	function closePopUp() {
		setShowPopUp(false)
		setSelectedHomeWork(null)
		setSelectSectionArr([])
	}

	function selectSection(item) {
		const ID = item.sectionID
		if (selectSectionArr.includes(ID)) {
			setSelectSectionArr(selectSectionArr.filter(item => item !== ID))
		} else {
			setSelectSectionArr([...selectSectionArr, ID])
		}
	}

	function assingHomeWork() {
		if (!selectedHomeWork) {
			Alert.alert("Error!", "No homework selected.")
			return
		}
		if (selectSectionArr.length === 0) {
			Alert.alert("Info!", "Please select at least one section.")
			return
		}

		const targetHomeWorkID = selectedHomeWork.homeWorkID
		const dates = homeworkDates[targetHomeWorkID] || {}

		if (!dates.startDate || !dates.endDate) {
			Alert.alert("Info!", "Please select valid Start Date and End Date.")
			return
		}

		setLoading(true)
		const payload = {
			"schoolID": userData.data.schoolID,
			"userRefID": userData.data.userRefID,
			"homeWorkID": targetHomeWorkID,
			"startDate": dates.startDate,
			"endDate": dates.endDate,
			"sectionIDs": selectSectionArr,
		}

		Services.post(apiRoot.assignHomework, payload)
			.then((res) => {
				if (res.status == "success") {
					// console.log({ res, payload }, "ASSIGNHOMEWORK")
					setLoading(false)
					Alert.alert("Success!", res.message)
					setShowPopUp(false)
					setSelectedHomeWork(null)
					setSelectSectionArr([])
					setHomeworkDates((prev) => {
						const updated = { ...prev };
						delete updated[targetHomeWorkID];
						return updated;
					})
					getSavedHomeWork()
				} else {
					setLoading(false)
					Alert.alert("Info!", res.message)
				}
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	function setAssignDate(item, type) {
		setDatePickerControl({
			status: true,
			type: type,
			homeWorkID: item.homeWorkID,
		})
	}

	const formatCreatedDate = (dateStr) => {
		if (!dateStr) return "";
		try {
			const str = String(dateStr).trim();
			const parts = str.split(' ');
			const datePart = parts[0];
			let timePart = parts[1] || '';

			if (timePart) {
				const timeSegments = timePart.split(':');
				if (timeSegments.length >= 2) {
					timePart = `${timeSegments[0].padStart(2, '0')}:${timeSegments[1].padStart(2, '0')}`;
				}
			}

			let formattedDate = datePart;
			const matchYMD = datePart.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
			if (matchYMD) {
				const year = matchYMD[1];
				const month = matchYMD[2].padStart(2, '0');
				const day = matchYMD[3].padStart(2, '0');
				formattedDate = `${day}-${month}-${year}`;
			} else {
				const matchDMY = datePart.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
				if (matchDMY) {
					const day = matchDMY[1].padStart(2, '0');
					const month = matchDMY[2].padStart(2, '0');
					const year = matchDMY[3];
					formattedDate = `${day}-${month}-${year}`;
				}
			}

			return timePart ? `${formattedDate} ${timePart}` : formattedDate;
		} catch (e) {
			return dateStr;
		}
	};


	const viewFile = (item) => {
		const rawPath = item.filePath || item.youTubeUrl || "";
		const cleanPath = rawPath.split('?')[0].trim();
		const extension = cleanPath.split('.').pop().toLowerCase();

		const imageTypes = ['jpg', 'jpeg', 'JPG', 'png', 'gif', 'webp'];
		const isImage = imageTypes.includes(extension);
		const isPdf = extension === 'pdf';

		if ((item.youTubeUrl || /^https?:\/\//i.test(cleanPath)) && !isImage && !isPdf) {
			setFileType((prev) => ({
				...prev,
				data: item,
				type: 'url',
				fileSrc: item.youTubeUrl || rawPath,
				status: true,
				from: 'url',
			}));
		}
		else if (rawPath && (isImage || isPdf)) {
			setFileType((prev) => ({
				...prev,
				data: item,
				type: isPdf ? 'pdf' : extension,
				fileSrc: rawPath,
				status: true,
				from: isImage ? 'image' : 'document',
			}));
		}
		else {
			Alert.alert(
				"Error!",
				"File is not available to view or its format is invalid.",
			);
		}
	};

	function downloadDoc(item, type, baseUrl,) {
		setLoading(true)
		if (type == "video") {
			requestDownloadPermission(item, type)
		} else if (type == "img") {
			requestDownloadPermission(item, type)
		} else if (type == 'audio') {
			requestDownloadPermission(item, type)
		}
		else if (type == "doc") {
			const docPath = baseUrl + item.docFileNPath
			requestDownloadPermission(docPath, type, item)
		}
	}


	const requestDownloadPermission = async (docPath, type) => {
		try {
			const shareOptions = {
				title: 'Share PDF',
				url: `${docPath}`,
				type: 'application/pdf',
				failOnCancel: false,
			};
			setLoading(false)
			await Share.open(shareOptions);
		} catch (err) {
			console.log('Share error:', err);
			setLoading(false)
		}
	};




	return (
		<>
			<View style={{ flex: 1 }}>
				<View style={{ backgroundColor: userData.data.colors.liteTheme, borderRadius: 5, flex: 1, padding: 10 }}>
					{savedHomework.status && (
						<SearchFilter
							data={savedHomework.data}
							searchKeys={['subjectName', 'homeWorkDesc', 'assignedBy']}
							fallbackKeys={['subjectName', 'homeWorkDesc']}
							onResult={handleSearchResult}
							placeholder="Search homework..."
							resetTrigger={savedHomework.status}
						/>
					)}
					{loading ?
						<Loader /> :
						<ScrollView>
							{
								savedHomework.status ?
									<View>
										{filteredData.map((item, index) => {
											const itemDates = homeworkDates[item.homeWorkID] || {}
											const newStartDate = itemDates.startDate || ""
											const newEndDate = itemDates.endDate || ""

											const rawFileName = item?.filePath || item?.youTubeUrl || "";
											const fileName = rawFileName.split('?')[0];

											let buttonName = 'View'

											if (fileName) {
												if (/\.pdf$/i.test(fileName)) {
													buttonName = 'View PDF 📄';
												}
												else if (/\.(jpg|jpeg|png)$/i.test(fileName)) {
													buttonName = 'View Image 🏞️';
												}
												else if (/^https?:\/\//i.test(fileName)) {
													buttonName = 'Watch ▶️';
												}
											}

											return (
												<View style={{ borderWidth: .7, borderColor: 'grey', marginBottom: 5, borderRadius: 5, padding: 5, backgroundColor: SWATheam.SwaWhite }} key={index}>
													<View style={{ flexDirection: 'row', marginBottom: 5 }}>
														<View style={{ width: 100 }}>
															<Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Class</Text>
														</View>
														<View style={{ paddingRight: 10 }}>
															<Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
														</View>
														<View style={{ flex: 1 }}>
															<Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.className}</Text>
														</View>
													</View>
													<View style={{ flexDirection: 'row', marginBottom: 5 }}>
														<View style={{ width: 100 }}>
															<Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Subject </Text>
														</View>
														<View style={{ paddingRight: 10 }}>
															<Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
														</View>
														<View style={{ flex: 1 }}>
															<Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.subjectName}</Text>
														</View>
													</View>
													<View style={{ flexDirection: 'row', marginBottom: 5 }}>
														<View style={{ width: 100 }}>
															<Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Description</Text>
														</View>
														<View style={{ paddingRight: 10 }}>
															<Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
														</View>
														<View style={{ flex: 1 }}>
															<Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.homeWorkDesc}</Text>
														</View>
													</View>

													<View style={{ flexDirection: 'row', marginBottom: 5 }}>
														<View style={{ width: 100, }}>
															<Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Created Date</Text>
														</View>
														<View style={{ paddingRight: 10 }}>
															<Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
														</View>
														<View style={{ flex: 1 }}>
															<Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{formatCreatedDate(item.createdDate)}</Text>
														</View>
													</View>
													<View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
														<View style={{ width: 100, }}>
															<Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Start Date</Text>
														</View>
														<View style={{ paddingRight: 10 }}>
															<Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
														</View>
														<View style={{ flex: 1 }}>
															<TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, padding: 4 }} onPress={() => setAssignDate(item, "startDate")}>
																<View style={{ flex: 1 }}>
																	<Text style={{ color: SWATheam.SwaBlack }}>{newStartDate}</Text>
																</View>
																<View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
																	<FontAwesome6 name={"calendar"} size={16} color={'grey'} />
																</View>
															</TouchableOpacity>
														</View>
													</View>
													<View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
														<View style={{ width: 100, }}>
															<Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>End Date</Text>
														</View>
														<View style={{ paddingRight: 10 }}>
															<Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
														</View>
														<View style={{ flex: 1 }}>
															<TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, padding: 4 }} onPress={() => setAssignDate(item, "endDate")}>
																<View style={{ flex: 1 }}>
																	<Text style={{ color: SWATheam.SwaBlack }}>{newEndDate}</Text>
																</View>
																<View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
																	<FontAwesome6 name={"calendar"} size={16} color={'grey'} />
																</View>
															</TouchableOpacity>
														</View>
													</View>
													<View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
														<TouchableOpacity style={{ width: 130, backgroundColor: SWATheam.SwaGreen, borderRadius: 5, paddingHorizontal: 10, marginRight: 5 }} onPress={() => viewFile(item)}>
															<Text style={{ color: SWATheam.SwaWhite, padding: 5, textAlign: "center" }}>{buttonName}</Text>
														</TouchableOpacity>
														<TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 10, marginRight: 5 }} onPress={() => getSections(item)}>
															<Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>Assign</Text>
														</TouchableOpacity>
														<TouchableOpacity style={{ backgroundColor: SWATheam.SwaRed, borderRadius: 5, paddingHorizontal: 10 }} onPress={() => deleteHomeWork(item.homeWorkID)}>
															<Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>Delete</Text>
														</TouchableOpacity>
													</View>
												</View>
											)
										})
										}
									</View>
									:
									<View style={{ borderWidth: 1, backgroundColor: SWATheam.SwaWhite, borderColor: 'grey', borderRadius: 5 }}>
										<Text style={{ color: SWATheam.SwaRed, fontSize: 14, textAlign: 'center', padding: 5 }}>Homework not available</Text>
									</View>
							}
						</ScrollView>
					}

					<DatePicker
						modal
						open={datePickerControl.status}
						date={date}
						mode='datetime'
						onConfirm={(selectedDate) => {
							const type = datePickerControl.type
							const targetHomeWorkID = datePickerControl.homeWorkID
							setDatePickerControl((prev) => {
								return { ...prev, status: false }
							})
							editDate(selectedDate, type, targetHomeWorkID)
						}}
						onCancel={() => {
							setDatePickerControl((prev) => {
								return { ...prev, status: false }
							})
						}}
					/>

				</View>



				{showPopUp &&
					<View style={styles.selectFieldPopUp}>
						<View style={{ backgroundColor: SWATheam.SwaWhite, marginHorizontal: 30, padding: 8, maxHeight: 300, borderRadius: 5 }}>
							<TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', borderBottomWidth: .7, paddingBottom: 5, borderColor: 'grey' }} onPress={() => closePopUp()}>
								<AntDesign name={"close"} size={20} color={SWATheam.SwaBlack} />
							</TouchableOpacity>
							<ScrollView>
								<View>
									{
										sectionData?.data?.map((item, index) => {
											return (
												<TouchableOpacity onPress={() => { selectSection(item) }} key={index}>
													<View style={{ padding: 10, borderBottomWidth: item.length > 1 ? .7 : null, borderColor: 'grey', flexDirection: 'row', alignItems: 'center' }}>
														{selectSectionArr.includes(item.sectionID) ?
															<MaterialIcons name={"check-box"} size={20} color={userData.data.colors.mainTheme} /> :
															<MaterialIcons name={"check-box-outline-blank"} size={20} color={userData.data.colors.mainTheme} />
														}
														<Text style={{ paddingLeft: 10, fontSize: 15, color: SWATheam.SwaBlack }}>
															{item.sectionName}
														</Text>
													</View>
												</TouchableOpacity>
											)
										})
									}
								</View>
							</ScrollView>
							<View style={{ flexDirection: 'row', borderTopWidth: .7, borderColor: 'grey', paddingTop: 7, justifyContent: 'flex-end' }}>
								<TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 3, paddingHorizontal: 10, paddingVertical: 3 }} onPress={() => assingHomeWork()}>
									<Text style={{ color: SWATheam.SwaWhite }}>Save</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				}

			</View>

			{(fileType.status && fileType.type == 'image' || fileType.type == 'png' || fileType.type == 'jpg' || fileType.type == 'jpeg') &&
				<ImageViewer fileType={fileType} setFileType={setFileType} downloadDoc={downloadDoc} />
			}
			{(fileType.status && fileType.type == 'pdf') &&
				<HWPdfViewer colorSwa={userData.data.colors.mainTheme} fileType={fileType} setFileType={setFileType} downloadDoc={downloadDoc} />
			}
			{(fileType.status && fileType.type == 'url') &&
				<YoutubeUrlView fileType={fileType} colorSwa={userData.data.colors.mainTheme} setFileType={setFileType} />
			}
		</>

	)
}

const styles = StyleSheet.create({
	headerText: {
		fontSize: 20,
		marginBottom: 5,
		fontWeight: 'bold',
		color: SWATheam.SwaBlack,
		paddingVertical: 5,
		flexDirection: 'row',
		justifyContent: 'center'
	},

	flexContainer: {
		flexDirection: 'row',
		marginBottom: 5,
	},

	BtextClr: {
		color: SWATheam.SwaBlack
	},

	thClr: {
		color: '#654b25'
	},


	WtextClr: {
		color: SWATheam.SwaWhite
	},

	selectFieldPopUp: {
		position: 'absolute',
		top: 0,
		left: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		width: '100%',
		height: '100%',
		justifyContent: 'center'
	},

	description: {
		height: 100,
		borderWidth: 1,
		borderWidth: 1,
		borderColor: 'grey',
		borderRadius: 5,
		padding: 8,
		marginBottom: 7,
		textAlignVertical: 'top'
	},

	urlInput: {
		height: 100,
		borderWidth: 1,
		borderWidth: 1,
		borderColor: 'grey',
		borderRadius: 50,
		padding: 8,
		marginBottom: 7,
		textAlignVertical: 'top'
	},

});

export default SaveHomeWork

