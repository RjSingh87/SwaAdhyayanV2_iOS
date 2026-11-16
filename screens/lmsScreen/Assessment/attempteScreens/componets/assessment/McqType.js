import React, { useContext, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { GlobleData } from '../../../../../../Store';
import { SWATheam } from '../../../../../../constant/ConstentValue';

export default function McqType() {
	const { userData, manageData, currentIndex, mcqClicked, currentAns } = useContext(GlobleData);
	const { questions, siteUtls } = manageData;
	const question = questions[currentIndex];
	const questionParts = [
		question?.questionPart1,
		question?.questionPart2,
		question?.questionPart3,
		question?.questionPart4,
		question?.questionPart5,
	];
	const handleMcqClick = useCallback((optionID, questionID, optionText) => {
		mcqClicked(optionID, questionID, optionText);
	}, [mcqClicked]);

	const Option = ({ optionText, optionID, questionID, currentAns, optionLabel }) => {
		if (!optionText) return null;

		const isImage = /\.(png|jpg|jpeg)$/i.test(optionText);
		const uri = `${siteUtls}${question?.imagePath}${optionText}`;
		const isSelected = currentAns?.quesID === questionID && currentAns?.queOptionsID === optionID;

		return (
			<TouchableOpacity
				style={[styles.mcqHolder]}
				onPress={() => handleMcqClick(optionID, questionID, optionText)}
			>
				<View style={[styles.rowHori]}>
					<View style={[styles.cricleMcq, { backgroundColor: isSelected ? userData.data.colors.mainTheme : SWATheam.SwaLightGray }]} />
					<Text style={{ width: 25, fontWeight: "bold", color: SWATheam.SwaBlack }}>{optionLabel}</Text>
					<View style={{ flex: 1 }}>
						{isImage ? (
							<Image source={{ uri }} style={{ width: 50, height: 50 }} />
						) : (
							<Text style={{ color: SWATheam.SwaBlack }}>{optionText}</Text>
						)}
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	const options = [
		{ optionText: question?.optionText1, optionID: question?.optionID1, label: '(a)' },
		{ optionText: question?.optionText2, optionID: question?.optionID2, label: '(b)' },
		{ optionText: question?.optionText3, optionID: question?.optionID3, label: '(c)' },
		{ optionText: question?.optionText4, optionID: question?.optionID4, label: '(d)' },
		{ optionText: question?.optionText5, optionID: question?.optionID5, label: '(e)' },
		{ optionText: question?.optionText6, optionID: question?.optionID6, label: '(f)' },
	];


	return (
		<View style={styles.mainHolder}>
			<View style={styles.roline}>
				<Text style={styles.qNumber}>{manageData.qNumber}</Text>
				<View style={{ flex: 1 }}>
					{questionParts.map((part, index) => {
						if (!part) return null;

						const isImage = /\.(png|jpg|jpeg)$/i.test(part);
						const uri = `${siteUtls}${question?.imagePath}${part}`;

						return (
							<View key={index}>
								{isImage ? (
									<Image source={{ uri }} style={styles.questImgs} />
								) : (
									<Text style={styles.question}>{part}</Text>
								)}
							</View>
						);
					})}
					{options.map((option, index) => (
						<Option
							key={index}
							optionText={option.optionText}
							optionID={option.optionID}
							questionID={question?.questionID}
							currentAns={currentAns}
							optionLabel={option.label}
						/>
					))}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	mainHolder: {
		margin: 10,
	},
	qNumber: {
		fontWeight: "bold",
		width: 30,
		color: SWATheam.SwaBlack,
	},
	roline: {
		flexDirection: "row",
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
		borderRadius: 50,
		marginTop: 10,
		padding: 3,
		backgroundColor: "#fff",
	},
	rowHori: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	questImgs: {
		width: "100%",
		minHeight: 150,
		resizeMode: "contain",
	},
	cricleMcq: {
		width: 23,
		height: 23,
		borderRadius: 50,
		backgroundColor: "#cecece",
		marginHorizontal: 5,
	},
});
