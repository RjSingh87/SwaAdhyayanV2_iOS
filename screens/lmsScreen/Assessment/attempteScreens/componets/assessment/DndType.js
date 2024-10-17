import React, { useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, ScrollView, Image } from 'react-native';
import { GlobleData } from '../../../../../../Store';
import { SWATheam } from '../../../../../../constant/ConstentValue';
const DraggableItem = ({ text, onDragEnd }) => {
	const pan = useState(new Animated.ValueXY())[0];
	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onPanResponderMove: Animated.event(
			[null, { dx: pan.x, dy: pan.y }],
			{ useNativeDriver: false }
		),
		onPanResponderRelease: (e, gesture) => {
			onDragEnd({ text, x: gesture.moveX, y: gesture.moveY });
			Animated.spring(pan, {
				toValue: { x: 0, y: 0 },
				useNativeDriver: false,
			}).start();
		}
	});
	return (
		<Animated.View
			{...panResponder.panHandlers}
			style={[pan.getLayout(), styles.draggable]}
		>
			<Text style={{ color: SWATheam.SwaBlack }}>{text}</Text>
		</Animated.View>
	);
};

const DroppableArea = React.forwardRef(({ children }, ref) => {
	return (
		<View ref={ref} style={styles.droppable}>
			{children}
		</View>
	);
});

const App = () => {
	const { manageData, currentIndex, dropedData, setDropedData } =
		useContext(GlobleData);
	let tarGetText_1 = manageData.questions[currentIndex]?.targetText1;
	let tarGetText_2 = manageData.questions[currentIndex]?.targetText2;
	let tarGetText_3 = manageData.questions[currentIndex]?.targetText3;
	let tarGetText_4 = manageData.questions[currentIndex]?.targetText4;
	let tarGetText_5 = manageData.questions[currentIndex]?.targetText5;
	let tarGetText_6 = manageData.questions[currentIndex]?.targetText6;
	let tarGetText_7 = manageData.questions[currentIndex]?.targetText7;
	let tarGetText_8 = manageData.questions[currentIndex]?.targetText8;

	let op1 = manageData.questions[currentIndex]?.optionText1;
	let op2 = manageData.questions[currentIndex]?.optionText2;
	let op3 = manageData.questions[currentIndex]?.optionText3;
	let op4 = manageData.questions[currentIndex]?.optionText4;
	let op5 = manageData.questions[currentIndex]?.optionText5;
	let op6 = manageData.questions[currentIndex]?.optionText6;
	let op7 = manageData.questions[currentIndex]?.optionText7;
	let op8 = manageData.questions[currentIndex]?.optionText8;
	const [droppedItems, setDroppedItems] = useState({
		droppable1: null,
		droppable2: null,
		droppable3: null,
		droppable4: null,
		droppable5: null,
		droppable6: null,
		droppable7: null,
		droppable8: null,
	});
	const droppableRefs = {
		droppable1: [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)],
		droppable2: [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)],
		droppable3: [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)],
		droppable4: [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)],
		droppable5: [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)],
		droppable6: [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)],
		droppable7: [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)],
		droppable8: [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)],
	};

	const optionText1Fun1 = () => {
		if (!op1) return null; // Ensure op1 is defined

		const replacedContent1 = op1.split('#').map((part, index, inp) => {
			// Check if currentIndex and other nested objects exist
			const droppedItem = droppedItems[currentIndex]?.droppable1?.[index];
			const question = manageData.questions[currentIndex];

			if (index !== op1.split('#').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
								<DroppableArea ref={droppableRefs?.droppable1?.[index]}>
									<Text>
										{droppedItem ? ` ${droppedItem}` : ''}
									</Text>
								</DroppableArea>
								{question?.optionImage1 ? (
									<Image
										source={{
											uri: `${manageData.siteUtls}${question.imagePath}${question.optionImage1}`,
										}}
										style={styles.optImgs}
									/>
								) : null}
							</View>
						</View>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent1;
	};



	const optionText1Fun2 = () => {
		if (!op2) return null; // Ensure op2 is defined

		const replacedContent2 = op2.split('#').map((part, index, inp) => {
			const droppedItem = droppedItems[currentIndex]?.droppable2?.[index];
			const question = manageData.questions[currentIndex];

			if (index !== op2.split('#').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
								<DroppableArea ref={droppableRefs?.droppable2?.[index]}>
									<Text>{droppedItem ? ` ${droppedItem}` : ''}</Text>
								</DroppableArea>
								{question?.optionImage2 ? (
									<Image
										source={{ uri: `${manageData.siteUtls}${question.imagePath}${question.optionImage2}` }}
										style={styles.optImgs}
									/>
								) : null}
							</View>
						</View>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent2;
	};

	const optionText1Fun3 = () => {
		if (!op3) return null; // Ensure op3 is defined

		const replacedContent3 = op3.split('#').map((part, index, inp) => {
			const droppedItem = droppedItems[currentIndex]?.droppable3?.[index];
			const question = manageData.questions[currentIndex];

			if (index !== op3.split('#').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
								<DroppableArea ref={droppableRefs?.droppable3?.[index]}>
									<Text>{droppedItem ? ` ${droppedItem}` : ''}</Text>
								</DroppableArea>
								{question?.optionImage3 ? (
									<Image
										source={{ uri: `${manageData.siteUtls}${question.imagePath}${question.optionImage3}` }}
										style={styles.optImgs}
									/>
								) : null}
							</View>
						</View>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent3;
	};

	const optionText1Fun4 = () => {
		if (!op4) return null; // Ensure op4 is defined

		const replacedContent4 = op4.split('#').map((part, index, inp) => {
			const droppedItem = droppedItems[currentIndex]?.droppable4?.[index];
			const question = manageData.questions[currentIndex];

			if (index !== op4.split('#').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
								<DroppableArea ref={droppableRefs?.droppable4?.[index]}>
									<Text>{droppedItem ? ` ${droppedItem}` : ''}</Text>
								</DroppableArea>
								{question?.optionImage4 ? (
									<Image
										source={{ uri: `${manageData.siteUtls}${question.imagePath}${question.optionImage4}` }}
										style={styles.optImgs}
									/>
								) : null}
							</View>
						</View>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent4;
	};

	const optionText1Fun5 = () => {
		if (!op5) return null; // Ensure op5 is defined

		const replacedContent5 = op5.split('#').map((part, index, inp) => {
			const droppedItem = droppedItems[currentIndex]?.droppable5?.[index];
			const question = manageData.questions[currentIndex];

			if (index !== op5.split('#').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
								<DroppableArea ref={droppableRefs?.droppable5?.[index]}>
									<Text>{droppedItem ? ` ${droppedItem}` : ''}</Text>
								</DroppableArea>
								{question?.optionImage5 ? (
									<Image
										source={{ uri: `${manageData.siteUtls}${question.imagePath}${question.optionImage5}` }}
										style={styles.optImgs}
									/>
								) : null}
							</View>
						</View>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent5;
	};

	const optionText1Fun6 = () => {
		if (!op6) return null; // Ensure op6 is defined

		const replacedContent6 = op6.split('#').map((part, index, inp) => {
			const droppedItem = droppedItems[currentIndex]?.droppable6?.[index];
			const question = manageData.questions[currentIndex];

			if (index !== op6.split('#').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
								<DroppableArea ref={droppableRefs?.droppable6?.[index]}>
									<Text>{droppedItem ? ` ${droppedItem}` : ''}</Text>
								</DroppableArea>
								{question?.optionImage6 ? (
									<Image
										source={{ uri: `${manageData.siteUtls}${question.imagePath}${question.optionImage6}` }}
										style={styles.optImgs}
									/>
								) : null}
							</View>
						</View>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent6;
	};

	const optionText1Fun7 = () => {
		if (!op7) return null; // Ensure op7 is defined

		const replacedContent7 = op7.split('#').map((part, index, inp) => {
			const droppedItem = droppedItems[currentIndex]?.droppable7?.[index];
			const question = manageData.questions[currentIndex];

			if (index !== op7.split('#').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
								<DroppableArea ref={droppableRefs?.droppable7?.[index]}>
									<Text>{droppedItem ? ` ${droppedItem}` : ''}</Text>
								</DroppableArea>
								{question?.optionImage7 ? (
									<Image
										source={{ uri: `${manageData.siteUtls}${question.imagePath}${question.optionImage7}` }}
										style={styles.optImgs}
									/>
								) : null}
							</View>
						</View>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent7;
	};

	const optionText1Fun8 = () => {
		if (!op8) return null; // Ensure op8 is defined
		const replacedContent8 = op8.split('#').map((part, index, inp) => {
			const droppedItem = droppedItems[currentIndex]?.droppable1?.[index];
			const question = manageData.questions[currentIndex];

			if (index !== op8.split('#').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
								<DroppableArea ref={droppableRefs?.droppable8?.[index]}>
									<Text>{droppedItem ? ` ${droppedItem}` : ''}</Text>
								</DroppableArea>
								{question?.optionImage8 ? (
									<Image
										source={{ uri: `${manageData.siteUtls}${question.imagePath}${question.optionImage8}` }}
										style={styles.optImgs}
									/>
								) : null}
							</View>
						</View>
					</View>
				);
			}
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>{part}</Text>;
		});

		return replacedContent8;
	};


	const handleDrop = (droppableId, text, index) => {
		setDroppedItems((prevState) => {
			let currentDropList = prevState[currentIndex] || {};
			let newDropList = currentDropList[droppableId] || [];
			// Assign the dropped text to the correct index
			newDropList[index] = text;

			return {
				...prevState,
				[currentIndex]: {
					...currentDropList,
					[droppableId]: newDropList,
				},
			};
		});
		setDropedData((prevData) => [...prevData, text]);
	};


	const onDragEnd = (draggedItem) => {
		Object.keys(droppableRefs).forEach((droppableId) => {
			const ref = droppableRefs[droppableId];

			for (let i = 0; i < ref.length; i++) {
				const element = ref[i].current;

				if (element) {
					element.measure((x, y, width, height, pageX, pageY) => {
						if (
							draggedItem.x > pageX &&
							draggedItem.x < pageX + width &&
							draggedItem.y > pageY &&
							draggedItem.y < pageY + height
						) {
							handleDrop(droppableId, draggedItem.text, i);
						}
					});
				}
			}
		});
	};
	const renderDraggableItem = (text, isImage = false) => {
		if (isImage) {
			return (
				<DraggableItem onDragEnd={onDragEnd}>
					<Image
						source={{
							uri: `${manageData.siteUtls}${manageData.questions[currentIndex]?.imagePath}${text}`,
						}}
						style={styles.optImgs}
					/>
				</DraggableItem>
			);
		}

		return <DraggableItem text={text} onDragEnd={onDragEnd} />;
	};
	const isImage = (fileName) =>
		fileName.endsWith(".png") ||
		fileName.endsWith(".PNG") ||
		fileName.endsWith(".jpg") ||
		fileName.endsWith(".JPG");

	const options = [
		{ key: 'a', enabled: op1, render: optionText1Fun1 },
		{ key: 'b', enabled: op2, render: optionText1Fun2 },
		{ key: 'c', enabled: op3, render: optionText1Fun3 },
		{ key: 'd', enabled: op4, render: optionText1Fun4 },
		{ key: 'e', enabled: op5, render: optionText1Fun5 },
		{ key: 'f', enabled: op6, render: optionText1Fun6 },
		{ key: 'g', enabled: op7, render: optionText1Fun7 },
		{ key: 'h', enabled: op8, render: optionText1Fun8 },
	];
	return (
		<>
			<View style={styles.mainHolder}>
				<View style={styles.roline}>
					<Text style={styles.qNumber}>{manageData.qNumber}</Text>
					<View style={{ flex: 1 }}>
						{[1, 2, 3, 4, 5].map((partIndex) => {
							const questionPart =
								manageData.questions[currentIndex]?.[
								`questionPart${partIndex}`
								];
							if (!questionPart) return null;

							return (
								<View key={partIndex}>
									{questionPart.endsWith(".png") ||
										questionPart.endsWith(".PNG") ||
										questionPart.endsWith(".JPG") ||
										questionPart.endsWith(".jpg") ? (
										<Image
											source={{
												uri:
													manageData.siteUtls +
													manageData.questions[currentIndex]?.imagePath +
													questionPart,
											}}
											style={styles.questImgs}
										/>
									) : (
										<Text style={styles.question}>{questionPart}</Text>
									)}
								</View>
							);
						})}

						<View style={styles.container2}>
							<View style={styles.optionsRow}>
								{tarGetText_1 && (
									<View style={styles.item}>
										{renderDraggableItem(tarGetText_1, isImage(tarGetText_1))}
									</View>
								)}
								{tarGetText_2 && (
									<View style={styles.item}>
										{renderDraggableItem(tarGetText_2, isImage(tarGetText_2))}
									</View>
								)}
								{tarGetText_3 && (
									<View style={styles.item}>
										{renderDraggableItem(tarGetText_3, isImage(tarGetText_3))}
									</View>
								)}
								{tarGetText_4 && (
									<View style={styles.item}>
										{renderDraggableItem(tarGetText_4, isImage(tarGetText_4))}
									</View>
								)}
								{tarGetText_5 && (
									<View style={styles.item}>
										{renderDraggableItem(tarGetText_5, isImage(tarGetText_5))}
									</View>
								)}
								{tarGetText_6 && (
									<View style={styles.item}>
										{renderDraggableItem(tarGetText_6, isImage(tarGetText_6))}
									</View>
								)}
								{tarGetText_7 && (
									<View style={styles.item}>
										{renderDraggableItem(tarGetText_7, isImage(tarGetText_7))}
									</View>
								)}
								{tarGetText_8 && (
									<View style={styles.item}>
										{renderDraggableItem(tarGetText_8, isImage(tarGetText_8))}
									</View>
								)}
								{/* Repeat for other tarGetText_n items */}
							</View>
						</View>




						{/* options section */}


						<View style={styles.questionHolder}>
							<ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
								{options.map((option, index) =>
									option.enabled ? (
										<View key={index} style={styles.mcqHolder}>
											<View style={styles.rowHori}>
												<Text style={{ width: 25, fontWeight: "bold", color: SWATheam.SwaBlack }}>({option.key})</Text>
												<View style={{ flex: 1, width: "100%" }}>
													<ScrollView horizontal={true}>
														<View style={{ flexDirection: "row", alignItems: "center" }}>
															{option.render()}
														</View>
													</ScrollView>
												</View>
											</View>
										</View>
									) : null
								)}
							</ScrollView>
						</View>



					</View>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	row: {
		flexDirection: "row",
		marginVertical: 10,
		flexWrap: "wrap",
	},
	draggable: {
		padding: 8,
		paddingHorizontal: 10,
		margin: 3,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#69efba",
		backgroundColor: "#fff",
		borderRadius: 5,
		elevation: 2,
	},
	droppable: {
		padding: 8,
		paddingHorizontal: 18,
		margin: 3,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#69efba",
		backgroundColor: "#fff",
		borderRadius: 5,
		elevation: 5, // Increase elevation if necessary
	},
	container2: {
		flex: 1, // Makes the container flexible
		justifyContent: 'center', // Center the items vertically
		alignItems: 'center', // Center the items horizontally
		zIndex: 99999
	},
	optionsRow: {
		flexDirection: 'row', // Arrange items in a row
		flexWrap: 'wrap', // Allow items to wrap to the next line
		justifyContent: 'space-around', // Distribute items evenly
	},
	item: {
		margin: 0, // Add some spacing around items
		zIndex: 9999
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
		borderColor: "red",
		borderRadius: 20,
		marginTop: 10,
		padding: 7,
		backgroundColor: "#fff",
		flexDirection: "row"
	},
	mainHolder: {
		margin: 10,
	},
	inLineText: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},

	questionHolder: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#eaf0f7",
		padding: 5,
		marginTop: 10,
		borderRadius: 10,
		overflow: 'hidden', // Optional: to hide overflowing content
	},
	scrollArea: {
		height: 300, // Set the desired height for the scrollable area
		width: '100%', // Set the desired width for the scrollable area
	},
	scrollContent: {
		padding: 10,
	},
	mcqHolder: {
		borderWidth: 1,
		borderColor: "#e1e1e1",
		borderRadius: 20,
		marginTop: 10,
		padding: 7,
		backgroundColor: "#fff",
	},
	rowHori: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	questImgs: {
		width: "100%",
		minHeight: 100,
		resizeMode: "contain",
	},
	optImgs: {
		width: 80,
		height: 80,
		resizeMode: "contain",
	},
});

export default App;