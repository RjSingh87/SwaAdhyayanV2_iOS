import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { GlobleData } from '../../../../../../Store';
import { SWATheam } from '../../../../../../constant/ConstentValue';
export default function Desc() {
	const { manageData, currentIndex, } = useContext(GlobleData);
	const { width } = Dimensions.get('window');

	const tagsStyles = {
		body: {
			color: SWATheam.SwaBlack
		},
		p: {
			color: SWATheam.SwaBlack
		}
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
									:
									<RenderHtml
										tagsStyles={tagsStyles}
										contentWidth={width}
										source={{ html: manageData.questions[currentIndex]?.questionPart1 }}
									/>
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
									: <RenderHtml
										tagsStyles={tagsStyles}
										contentWidth={width}
										source={{ html: manageData.questions[currentIndex]?.questionPart2 }}
									/>
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
									: <RenderHtml
										tagsStyles={tagsStyles}
										contentWidth={width}
										source={{ html: manageData.questions[currentIndex]?.questionPart3 }}
									/>
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
									: <RenderHtml
										tagsStyles={tagsStyles}
										contentWidth={width}
										source={{ html: manageData.questions[currentIndex]?.questionPart4 }}
									/>
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
									: <RenderHtml
										tagsStyles={tagsStyles}
										contentWidth={width}
										source={{ html: manageData.questions[currentIndex]?.questionPart5 }}
									/>
							}
						</View>
						: null}
					<View style={styles.description}>
						<Text style={{ fontWeight: "bold", color: SWATheam.SwaBlack }}>
							Descriptive Question :
						</Text>
						<Text style={{ color: SWATheam.SwaBlack }}>
							You have to write down your answer on paper and later you have to upload it.
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({

	description: {
		backgroundColor: '#e5f5f5',
		padding: 10,
		borderRadius: 15,
		color: SWATheam.SwaBlack
	},
	instruction: {
		marginTop: 20,
		fontSize: 16,
		color: SWATheam.SwaGray
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
		color: "#000"
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
