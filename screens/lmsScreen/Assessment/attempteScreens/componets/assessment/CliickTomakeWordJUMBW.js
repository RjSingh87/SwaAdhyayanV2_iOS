import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { GlobleData } from '../../../../../../Store';
export default function JUMBW() {
	const {
		manageData,
		currentIndex,
		jumbleWord,
		jumble,
		jumBlePayLoad
	} = useContext(GlobleData);


	const rowData1 = manageData.questions[currentIndex]?.targetText1;
	const options1 = rowData1.split(',');

	const rowData2 = manageData.questions[currentIndex]?.targetText2;
	const options2 = rowData2.split(',');

	const rowData3 = manageData.questions[currentIndex]?.targetText3;
	const options3 = rowData3.split(',');

	const rowData4 = manageData.questions[currentIndex]?.targetText4;
	const options4 = rowData4.split(',');

	const rowData5 = manageData.questions[currentIndex]?.targetText5;
	const options5 = rowData5.split(',');

	const rowData6 = manageData.questions[currentIndex]?.targetText6;
	const options6 = rowData6.split(',');

	const rowData7 = manageData.questions[currentIndex]?.targetText7;
	const options7 = rowData7.split(',');

	const rowData8 = manageData.questions[currentIndex]?.targetText8;
	const options8 = rowData8.split(',');

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
					{manageData.questions[currentIndex]?.optionText1 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold" }}>(a)</Text>
								<ScrollView horizontal>
									<View style={{ flexDirection: "row" }}>
										{options1.map((letter, index) => (
											<TouchableOpacity key={index} onPress={() => jumbleWord(letter, 1)}>
												<View style={styles.holderBox}>
													<Text  style={styles.itemSingle}>{letter}</Text>
												</View>
											</TouchableOpacity>
										))}
									</View>
								</ScrollView>
							</View>
							<View style={styles.rowDta}>
								<Text style={styles.showAfterClick}>{jumble.optLine1}</Text>
							</View>
						</View>
						: null}
					{manageData.questions[currentIndex]?.optionText2 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold" }}>(b)</Text>
								<ScrollView horizontal>
									<View style={{ flexDirection: "row" }}>
										{options2.map((letter, index) => (
											<TouchableOpacity key={index} onPress={() => jumbleWord(letter, 2)}>
												<View style={styles.holderBox}>
													<Text style={styles.itemSingle}>{letter}</Text>
												</View>
											</TouchableOpacity>
										))}
									</View>
								</ScrollView>
							</View>
							<View style={styles.rowDta}>
								<Text style={styles.showAfterClick}>{jumble.optLine2}</Text>
							</View>
						</View>
						: null}
					{manageData.questions[currentIndex]?.optionText3 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold" }}>(c)</Text>
								<ScrollView horizontal>
									<View style={{ flexDirection: "row" }}>
										{options3.map((letter, index) => (
											<TouchableOpacity key={index} onPress={() => jumbleWord(letter, 3)}>
												<View style={styles.holderBox}>
													<Text style={styles.itemSingle}>{letter}</Text>
												</View>
											</TouchableOpacity>
										))}
									</View>
								</ScrollView>
							</View>
							<View style={styles.rowDta}>
								<Text style={styles.showAfterClick}>{jumble.optLine3}</Text>
							</View>
						</View>
						: null}
					{manageData.questions[currentIndex]?.optionText4 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold" }}>(d)</Text>
								<ScrollView horizontal>
									<View style={{ flexDirection: "row" }}>
										{options4.map((letter, index) => (
											<TouchableOpacity key={index} onPress={() => jumbleWord(letter, 4)}>
												<View style={styles.holderBox}>
													<Text style={styles.itemSingle}>{letter}</Text>
												</View>
											</TouchableOpacity>
										))}
									</View>
								</ScrollView>
							</View>
							<View style={styles.rowDta}>
								<Text style={styles.showAfterClick}>{jumble.optLine4}</Text>
							</View>
						</View>
						: null}
					{manageData.questions[currentIndex]?.optionText5 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold" }}>(e)</Text>
								<ScrollView horizontal>
									<View style={{ flexDirection: "row" }}>
										{options5.map((letter, index) => (
											<TouchableOpacity key={index} onPress={() => jumbleWord(letter, 5)}>
												<View style={styles.holderBox}>
													<Text style={styles.itemSingle}>{letter}</Text>
												</View>
											</TouchableOpacity>
										))}
									</View>
								</ScrollView>
							</View>
							<View style={styles.rowDta}>
								<Text style={styles.showAfterClick}>{jumble.optLine5}</Text>
							</View>
						</View>
						: null}
					{manageData.questions[currentIndex]?.optionText6 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold" }}>(f)</Text>
								<ScrollView horizontal>
									<View style={{ flexDirection: "row" }}>
										{options6.map((letter, index) => (
											<TouchableOpacity key={index} onPress={() => jumbleWord(letter, 6)}>
												<View style={styles.holderBox}>
													<Text style={styles.itemSingle}>{letter}</Text>
												</View>
											</TouchableOpacity>
										))}
									</View>
								</ScrollView>
							</View>
							<View style={styles.rowDta}>
								<Text style={styles.showAfterClick}>{jumble.optLine6}</Text>
							</View>
						</View>
						: null}
					{manageData.questions[currentIndex]?.optionText7 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold" }}>(g)</Text>
								<ScrollView horizontal>
									<View style={{ flexDirection: "row" }}>
										{options7.map((letter, index) => (
											<TouchableOpacity key={index} onPress={() => jumbleWord(letter, 7)}>
												<View style={styles.holderBox}>
													<Text style={styles.itemSingle}>{letter}</Text>
												</View>
											</TouchableOpacity>
										))}
									</View>
								</ScrollView>
							</View>
							<View style={styles.rowDta}>
								<Text style={styles.showAfterClick}>{jumble.optLine7}</Text>
							</View>
						</View>
						: null}
					{manageData.questions[currentIndex]?.optionText8 ?
						<View style={styles.mcqHolder}>
							<View style={styles.rowHori}>
								<Text style={{ width: 25, fontWeight: "bold" }}>(h)</Text>
								<ScrollView horizontal>
									<View style={{ flexDirection: "row" }}>
										{options7.map((letter, index) => (
											<TouchableOpacity key={index} onPress={() => jumbleWord(letter, 8)}>
												<View style={styles.holderBox}>
													<Text style={styles.itemSingle}>{letter}</Text>
												</View>
											</TouchableOpacity>
										))}
									</View>
								</ScrollView>
							</View>
							<View style={styles.rowDta}>
								<Text style={styles.showAfterClick}>{jumble.optLine8}</Text>
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
	showAfterClick: {
		fontSize: 20
	},
	rowDta: {
		borderWidth: 1,
		padding: 5,
		marginLeft: 25,
		margin: 5,
		borderRadius: 5,
		height: 40,
		borderColor: "#f0eee9"
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: 50,
	},
	item: {
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	},
	text: {
		fontSize: 18,
	},
	letterBox: {
		margin: 5,
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'skyblue',
		flexDirection: "row"
	},
	letter: {
		fontSize: 24,
		color: 'white',
		fontWeight: 'bold',
	},
	instruction: {
		marginTop: 20,
		fontSize: 16,
		color: 'grey',
	},
	mainHolder: {
		margin: 10
	},
	qNumber: {
		fontWeight: "bold",
		width: 30,
		color: "#037153"
	},
	roline: {
		flexDirection: "row"
	},
	question: {
		flexDirection: "row",
		textAlign: "justify",
		fontSize: 15
	},
	mcqHolder: {
		// borderWidth: 1,
		borderColor: "#",
		marginTop: 2,
		padding: 7,
		backgroundColor: "#fff"
	},
	rowHori: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center"
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
		width: "50%",
		minHeight: 100,
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
		color: SWATheam.SwaWhite
	},
	holderBox: {
		width: 42,
		height: 42,
		fontSize: 18,
		textAlign: "center",
		margin: 1,
		borderRadius: 3,
		backgroundColor: "#5e9645",
		color: "#fff",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	itemSingle: {
		fontSize: 18,
		textAlign: "center",
		color: "#fff",

	}
});
