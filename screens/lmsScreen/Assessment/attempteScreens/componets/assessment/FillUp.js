import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { GlobleData } from '../../../../../../Store';
import { SWATheam } from '../../../../../../constant/ConstentValue';
export default function FillUp() {
	const { manageData, currentIndex, storeData, onchangeGetData } = useContext(GlobleData);
	const { width } = Dimensions.get('window');
	let op1 = manageData.questions[currentIndex]?.optionText1
	let op2 = manageData.questions[currentIndex]?.optionText2
	let op3 = manageData.questions[currentIndex]?.optionText3
	let op4 = manageData.questions[currentIndex]?.optionText4
	let op5 = manageData.questions[currentIndex]?.optionText5
	let op6 = manageData.questions[currentIndex]?.optionText6
	let op7 = manageData.questions[currentIndex]?.optionText7
	let op8 = manageData.questions[currentIndex]?.optionText8

	const optionText1Fun1 = () => {
		const parts = op1.split('#');
		const replacedContent1 = parts.map((part, index) => {
			if (index !== parts.length - 1) {
				let value = null;
				if (storeData[currentIndex]?.optionText1 !== undefined) {
					if (storeData[currentIndex]?.optionText1[index] !== undefined) {
						value = storeData[currentIndex]?.optionText1[index];
					}
				}
				return (
					<View key={index} style={[styles.inLineText, { flex: 1 }]}>
						<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentIndex, text, 'optionText1', index)}
							style={styles.inputs_inner}
						/>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent1;
	};


	const optionText1Fun2 = () => {
		const parts = op2.split('#');
		const replacedContent2 = parts.map((part, index) => {
			if (index !== parts.length - 1) {
				let value = null;
				if (storeData[currentIndex]?.optionText2 !== undefined) {
					if (storeData[currentIndex]?.optionText2[index] !== undefined) {
						value = storeData[currentIndex]?.optionText2[index];
					}
				}
				return (
					<View key={index} style={[styles.inLineText, { flex: 1 }]}>
						<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentIndex, text, 'optionText2', index)}
							style={styles.inputs_inner}
						/>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent2;
	};

	const optionText1Fun3 = () => {
		const parts = op3.split('#');
		const replacedContent3 = parts.map((part, index) => {
			if (index !== parts.length - 1) {
				let value = null;
				if (storeData[currentIndex]?.optionText3 !== undefined) {
					if (storeData[currentIndex]?.optionText3[index] !== undefined) {
						value = storeData[currentIndex]?.optionText3[index];
					}
				}
				return (
					<View key={index} style={[styles.inLineText, { flex: 1 }]}>
						<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentIndex, text, 'optionText3', index)}
							style={styles.inputs_inner}
						/>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent3;
	};

	const optionText1Fun4 = () => {
		const parts = op4.split('#');
		const replacedContent4 = parts.map((part, index) => {
			if (index !== parts.length - 1) {
				let value = null;
				if (storeData[currentIndex]?.optionText4 !== undefined) {
					if (storeData[currentIndex]?.optionText4[index] !== undefined) {
						value = storeData[currentIndex]?.optionText4[index];
					}
				}
				return (
					<View key={index} style={[styles.inLineText, { flex: 1 }]}>
						<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentIndex, text, 'optionText4', index)}
							style={styles.inputs_inner}
						/>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent4;
	};

	const optionText1Fun5 = () => {
		const parts = op5.split('#');
		const replacedContent5 = parts.map((part, index) => {
			if (index !== parts.length - 1) {
				let value = null;
				if (storeData[currentIndex]?.optionText5 !== undefined) {
					if (storeData[currentIndex]?.optionText5[index] !== undefined) {
						value = storeData[currentIndex]?.optionText5[index];
					}
				}
				return (
					<View key={index} style={[styles.inLineText, { flex: 1 }]}>
						<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentIndex, text, 'optionText5', index)}
							style={styles.inputs_inner}
						/>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent5;
	};
	const optionText1Fun6 = () => {
		const parts = op6.split('#');
		const replacedContent6 = parts.map((part, index) => {
			if (index !== parts.length - 1) {
				let value = null;
				if (storeData[currentIndex]?.optionText6 !== undefined) {
					if (storeData[currentIndex]?.optionText6[index] !== undefined) {
						value = storeData[currentIndex]?.optionText6[index];
					}
				}
				return (
					<View key={index} style={[styles.inLineText, { flex: 1 }]}>
						<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentIndex, text, 'optionText6', index)}
							style={styles.inputs_inner}
						/>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent6;
	};
	const optionText1Fun7 = () => {
		const parts = op7.split('#');
		const replacedContent7 = parts.map((part, index) => {
			if (index !== parts.length - 1) {
				let value = null;
				if (storeData[currentIndex]?.optionText7 !== undefined) {
					if (storeData[currentIndex]?.optionText7[index] !== undefined) {
						value = storeData[currentIndex]?.optionText7[index];
					}
				}
				return (
					<View key={index} style={[styles.inLineText, { flex: 1 }]}>
						<Text>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentIndex, text, 'optionText7', index)}
							style={styles.inputs_inner}
						/>
					</View>
				);
			}
			return <Text key={index}>{part}</Text>;
		});

		return replacedContent7;
	};
	const optionText1Fun8 = () => {
		const parts = op8.split('#');
		const replacedContent8 = parts.map((part, index) => {
			if (index !== parts.length - 1) {
				let value = null;
				if (storeData[currentIndex]?.optionText8 !== undefined) {
					if (storeData[currentIndex]?.optionText8[index] !== undefined) {
						value = storeData[currentIndex]?.optionText8[index];
					}
				}
				return (
					<View key={index} style={[styles.inLineText, { flex: 1 }]}>
						<Text>{part}</Text>
						<TextInput
							value={value}
							onChangeText={(text) => onchangeGetData(currentIndex, text, 'optionText8', index)}
							style={styles.inputs_inner}
						/>
					</View>
				);
			}
			return <Text key={index}>{part}</Text>;
		});

		return replacedContent8;
	};

	return (

		<View style={styles.mainHolder}>

			<View style={styles.roline}>
				<Text style={styles.qNumber}>{manageData.qNumber}</Text>
				<View style={{ flex: 1 }}>
					{manageData.questions[currentIndex]?.questionPart1 ?
						<View>
							{
								manageData.questions[currentIndex]?.questionPart1.endsWith('.png') ||
									manageData.questions[currentIndex]?.questionPart1.endsWith('.PNG') ||
									manageData.questions[currentIndex]?.questionPart1.endsWith('.JPG') ||
									manageData.questions[currentIndex]?.questionPart1.endsWith('.jpg') ?
									<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.questionPart1 }} style={styles.questImgs} />
									: <Text style={styles.question}>{manageData.questions[currentIndex]?.questionPart1}</Text>
							}
						</View>
						: null}
					{manageData.questions[currentIndex]?.questionPart2 ?
						<View>
							{
								manageData.questions[currentIndex]?.questionPart2.endsWith('.png') ||
									manageData.questions[currentIndex]?.questionPart2.endsWith('.PNG') ||
									manageData.questions[currentIndex]?.questionPart2.endsWith('.JPG') ||
									manageData.questions[currentIndex]?.questionPart2.endsWith('.jpg') ?
									<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.questionPart2 }} style={styles.questImgs} />
									: <Text style={styles.question}>{manageData.questions[currentIndex]?.questionPart2}</Text>
							}
						</View>
						: null}
					{manageData.questions[currentIndex]?.questionPart3 ?
						<View>
							{
								manageData.questions[currentIndex]?.questionPart3.endsWith('.png') ||
									manageData.questions[currentIndex]?.questionPart3.endsWith('.PNG') ||
									manageData.questions[currentIndex]?.questionPart3.endsWith('.JPG') ||
									manageData.questions[currentIndex]?.questionPart3.endsWith('.jpg') ?
									<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.questionPart3 }} style={styles.questImgs} />
									: <Text style={styles.question}>{manageData.questions[currentIndex]?.questionPart3}</Text>
							}
						</View>
						: null}
					{manageData.questions[currentIndex]?.questionPart4 ?
						<View>
							{
								manageData.questions[currentIndex]?.questionPart4.endsWith('.png') ||
									manageData.questions[currentIndex]?.questionPart4.endsWith('.PNG') ||
									manageData.questions[currentIndex]?.questionPart4.endsWith('.JPG') ||
									manageData.questions[currentIndex]?.questionPart4.endsWith('.jpg') ?
									<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.questionPart4 }} style={styles.questImgs} />
									: <Text style={styles.question}>{manageData.questions[currentIndex]?.questionPart4}</Text>
							}
						</View>
						: null}
					{manageData.questions[currentIndex]?.questionPart5 ?
						<View>
							{
								manageData.questions[currentIndex]?.questionPart5.endsWith('.png') ||
									manageData.questions[currentIndex]?.questionPart5.endsWith('.PNG') ||
									manageData.questions[currentIndex]?.questionPart5.endsWith('.JPG') ||
									manageData.questions[currentIndex]?.questionPart5.endsWith('.jpg') ?
									<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.questionPart5 }} style={styles.questImgs} />
									: <Text style={styles.question}>{manageData.questions[currentIndex]?.questionPart5}</Text>
							}
						</View>
						: null}

					{/* options section */}
					{op1 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold", color: SWATheam.SwaBlack }}>(A)</Text>
								<View style={{ flex: 1 }}>
									<View style={styles.optionsText}>
										{optionText1Fun1()}
									</View>
									{manageData.questions[currentIndex]?.optionImage1 ?
										<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.optionImage1 }}
											style={styles.optImgs} />
										: null}
								</View>
							</View>
						</View>
						: null}
					{op2 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold", color: SWATheam.SwaBlack }}>(B)</Text>
								<View>
									<View
										style={styles.optionsText}>
										{optionText1Fun2()}
									</View>
									{manageData.questions[currentIndex]?.optionImage2 ?
										<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.optionImage2 }}
											style={styles.optImgs} />
										: null}
								</View>
							</View>
						</View>
						: null}
					{op3 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold", color: SWATheam.SwaBlack }}>(C)</Text>
								<View style={{ flex: 1 }}>
									<View
										style={styles.optionsText}>
										{optionText1Fun3()}
									</View>
									{manageData.questions[currentIndex]?.optionImage3 ?
										<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.optionImage3 }}
											style={styles.optImgs} />
										: null}
								</View>
							</View>
						</View>
						: null}
					{op4 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold", color: SWATheam.SwaBlack }}>(D)</Text>
								<View style={{ flex: 1 }}>
									<View
										style={styles.optionsText}>
										{optionText1Fun4()}
									</View>
									{manageData.questions[currentIndex]?.optionImage4 ?
										<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.optionImage4 }}
											style={styles.optImgs} />
										: null}
								</View>
							</View>
						</View>
						: null}
					{op5 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold", color: SWATheam.SwaBlack }}>(E)</Text>
								<View style={{ flex: 1 }}>
									<View
										style={styles.optionsText}>
										{optionText1Fun5()}
									</View>
									{manageData.questions[currentIndex]?.optionImage5 ?
										<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.optionImage5 }}
											style={styles.optImgs} />
										: null}
								</View>
							</View>
						</View>
						: null}
					{op6 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold", color: SWATheam.SwaBlack }}>(F)</Text>
								<View style={{ flex: 1 }}>
									<View
										style={styles.optionsText}>
										{optionText1Fun6()}
									</View>
									{manageData.questions[currentIndex]?.optionImage6 ?
										<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.optionImage6 }}
											style={styles.optImgs} />
										: null}
								</View>
							</View>
						</View>
						: null}
					{op7 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold", color: SWATheam.SwaBlack }}>(G)</Text>
								<View style={{ flex: 1 }}>
									<View
										style={styles.optionsText}>
										{optionText1Fun7()}
									</View>
									{manageData.questions[currentIndex]?.optionImage7 ?
										<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.optionImage7 }}
											style={styles.optImgs} />
										: null}
								</View>
							</View>
						</View>
						: null}
					{op8 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold", color: SWATheam.SwaBlack }}>(H)</Text>
								<View style={{ flex: 1 }}>
									<View
										style={styles.optionsText}>
										{optionText1Fun8()}
									</View>
									{manageData.questions[currentIndex]?.optionImage8 ?
										<Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + manageData.questions[currentIndex]?.optionImage8 }}
											style={styles.optImgs} />
										: null}
								</View>
							</View>
						</View>
						: null}
					{/* options section */}

				</View>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	inputs_inner: {
		borderWidth: 1,
		height: 40,
		borderColor: "#999",
		width: "90%",
		color: SWATheam.SwaBlack
	},
	mainHolder: {
		margin: 10
	},
	qNumber: {
		fontWeight: "bold",
		width: 30,
		color: SWATheam.SwaBlack
	},
	roline: {
		flexDirection: "row"
	},
	question: {
		flexDirection: "row",
		textAlign: "justify",
		fontSize: 15,
		color: SWATheam.SwaBlack
	},
	mcqHolder: {
		borderWidth: 1,
		borderColor: "#e1e1e1",
		borderRadius: 20,
		marginTop: 10,
		padding: 7,
		backgroundColor: "#fff"
	},
	rowHori: {
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	tnfRow: {
		flexDirection: "row",
		marginLeft: 25,
		marginTop: 5
	},
	btnsTnf: {
		borderWidth: 1,
		padding: 2,
		width: 70,
		borderRadius: 5,
		borderColor: "#0ca279",
		marginRight: 5
	},
	textTnf: {
		textAlign: "center"
	},
	optImgs: {
		maxWidth: 100,
		height: 50,
		resizeMode: "contain"
	},
	dragItemList: {
		backgroundColor: "#f8f9fa",
		padding: 5,
		margin: 5
	},
	optItem: {
		borderWidth: 1,
		borderColor: '#000',
		borderRadius: 5,
		margin: 5,
		padding: 3,
		paddingLeft: 5,
		paddingRight: 5,
		color: "#000",
	},
	questImgs: {
		width: "50%",
		height: 80,
		resizeMode: "contain"
	},

});
