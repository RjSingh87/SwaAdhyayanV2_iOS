import React, { useState, useRef, useContext, } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, ScrollView, Image, useWindowDimensions } from 'react-native';
import { GlobleData } from '../../../../../../Store';
import { SWATheam } from '../../../../../../constant/ConstentValue';
import RenderHtml from 'react-native-render-html';
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

const App = ({ outerScrollEnabled, setOuterScrollEnabled }) => {
	const { manageData, currentIndex, dropedData, setDropedData, } =
		useContext(GlobleData);

	const tagsStyles = {
		body: {
			fontSize: 15,
			color: SWATheam.SwaBlack
		},
		p: {
			fontSize: 15,
			color: SWATheam.SwaBlack
		}
	};

	const { width } = useWindowDimensions();

	let questionData = manageData.questions[currentIndex];
	let qDataAccordingToSubActType = filterDndQData(questionData)

	// const [tarGetText, setTargetText] = useState({tarGetText_1:null, tarGetText_2:null, tarGetText_3:null, tarGetText_4:null,tarGetText_5:null,tarGetText_6:null,tarGetText_7:null,tarGetText_8:null, })

	let tarGetText_1 = manageData.questions[currentIndex]?.targetText1;
	let tarGetText_2 = manageData.questions[currentIndex]?.targetText2;
	let tarGetText_3 = manageData.questions[currentIndex]?.targetText3;
	let tarGetText_4 = manageData.questions[currentIndex]?.targetText4;
	let tarGetText_5 = manageData.questions[currentIndex]?.targetText5;
	let tarGetText_6 = manageData.questions[currentIndex]?.targetText6;
	let tarGetText_7 = manageData.questions[currentIndex]?.targetText7;
	let tarGetText_8 = manageData.questions[currentIndex]?.targetText8;

	let op1 = null;
	let op2 = null;
	let op3 = null;
	let op4 = null;
	let op5 = null;
	let op6 = null;
	let op7 = null;
	let op8 = null;

	let optionText = null


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
		let netext = text.replace("&sbquo", '')
		netext = netext.replace(/<MTECHO>/g, '`');
		netext = netext.replace(/<\/MTECHO>/g, '`');
		if (isImage) {
			return (
				<DraggableItem onDragEnd={onDragEnd}>
					<Image
						source={{
							uri: `${manageData.siteUtls}${manageData.questions[currentIndex]?.imagePath}${netext}`,
						}}
						style={styles.optImgs}
					/>
				</DraggableItem>
			);
		}
		return <DraggableItem renderColor="black" text={netext} onDragEnd={onDragEnd} />;
	};

	const isImage = (fileName) =>
		fileName.endsWith(".png") ||
		fileName.endsWith(".PNG") ||
		fileName.endsWith(".jpg") ||
		fileName.endsWith(".JPG");


	function filterDndQData(questionData) {
		if (questionData.subActivityID == 1) {
			return getDndQuesFormateOne(questionData)
		} else if (questionData.subActivityID == 2) {
			return getDndQuesFormateTwo(questionData)
		} else if (questionData.subActivityID == 3) {
			return getDndQuesFormateThree(questionData)
		} else if (questionData.subActivityID == 4 || questionData.subActivityID == 5 || questionData.subActivityID == 6) {
			return getDNDFormateFourFiveSix(questionData)
		} else if (questionData.subActivityID == 7) {
			return getDNDFormateSeven(questionData)
		}
	}

	function getDndQuesFormateOne(DndData) {
		let question = "";
		let options = [];
		let target = [];
		let images = [];
		for (let j = 0; j < 4; j++) {
			let quesPart = DndData[`questionPart${j + 1}`]

			if (quesPart != "" && quesPart != null) {
				quesPart = quesPart.replace(/<MTECHO>/g, '`');
				quesPart = quesPart.replace(/<\/MTECHO>/g, '`');

				let imgPart = quesPart.split('.')
				if (imgPart[1] !== undefined && (imgPart[1] == 'png' || imgPart[1] == 'PNG' || imgPart[1] == 'jpeg' || imgPart[1] == 'jpg' || imgPart[1] == 'gif' || imgPart[1] == 'web')) {
					let imgPath = 'https://swaadhyayan.com/data/' + DndData.imagePath + quesPart
					question += `<div style='text-align:center'><img style='height:${DndData.questionImageHight}px; max-width:250px;' src=${imgPath} /></div>`
				} else {
					question += quesPart;
				}
			}
			else {
				break;
			}
		}

		for (let i = 0; i < 8; i++) {
			let optionsId = DndData[`optionID${i + 1}`];
			let optionsData = '';
			let optionsImg = '';
			let allDndData = '';

			if (optionsId != 0) {
				optionsData = DndData[`optionText${i + 1}`];
				optionsData = optionsData.replace(/<MTECHO>/g, '`');
				optionsData = optionsData.replace(/<\/MTECHO>/g, '`');

				optionsImg = DndData[`optionImage${i + 1}`];
				// console.log(optionsImg)

				if (optionsData != '' && optionsImg != '') {
					let ext1 = optionsData.split('.');
					if (ext1[1] !== undefined && (ext1[1] == 'png' || ext1[1] == 'PNG' || ext1[1] == 'jpeg' || ext1[1] == 'jpg' || ext1[1] == 'JPG' || ext1[1] == 'gif' || ext1[1] == 'web')) {
						let imgPath = 'https://swaadhyayan.com/data/' + DndData.imagePath + optionsData
						allDndData += `<div style='text-align:center'><img style='height:${DndData.optionImageHight}px; max-width:230px;' src=${imgPath} /></div>`
					} else {
						allDndData += optionsData.replace(/#/g, '__________');
					}

					let ext2 = optionsImg.split('.');
					if (ext2[1] !== undefined && (ext2[1] == 'png' || ext2[1] == 'PNG' || ext2[1] == 'jpeg' || ext2[1] == 'jpg' || ext2[1] == 'JPG' || ext2[1] == 'gif' || ext2[1] == 'web')) {
						let imgPath = 'https://swaadhyayan.com/data/' + DndData.imagePath + optionsImg
						allDndData += `<div style='text-align:center' ><img style='height:${DndData.optionImageHight}px; max-width:230px;' src=${imgPath} /></div>`
					} else {
						allDndData += optionsImg.replace(/#/g, '__________');
					}
				} else if (optionsData == '' && optionsImg != '') {
					let ext2 = optionsImg.split('.');
					if (ext2[1] !== undefined && (ext2[1] == 'png' || ext2[1] == 'PNG' || ext2[1] == 'jpeg' || ext2[1] == 'jpg' || ext2[1] == 'JPG' || ext2[1] == 'gif' || ext2[1] == 'web')) {
						let imgPath = 'https://swaadhyayan.com/data/' + DndData.imagePath + optionsImg
						allDndData += `<div style='text-align:center'><img style='height:${DndData.optionImageHight}px; max-width:230px;' src=${imgPath} /></div>`

					}
				} else if (optionsData != '' && optionsImg == '') {
					allDndData += optionsData.replace(/#/g, '__________');
				} else {
					// error both empty
					// skip
				}
				options.push(allDndData)
			} else {
				continue;
			}
		}
		for (let k = 0; k < 8; k++) {
			let targetText = DndData[`targetText${k + 1}`];
			targetText = targetText.replace(/<MTECHO>/g, '`');
			targetText = targetText.replace(/<\/MTECHO>/g, '`');

			let allTarget = '';
			if (targetText != '') {
				let ext3 = targetText.split('.');
				if (ext3[1] !== undefined && (ext3[1] == 'png' || ext3[1] == 'PNG' || ext3[1] == 'jpeg' || ext3[1] == 'jpg' || ext3[1] == 'JPG' || ext3[1] == 'gif' || ext3[1] == 'web')) {
					let imgPath = 'https://swaadhyayan.com/data/' + DndData.imagePath + targetText
					allTarget += `<div style='text-align:center'><img style='height:${DndData.questionImageHight}px; max-width:250px;' src=${imgPath} /></div>`
				} else {
					allTarget += targetText;
				}
				target.push(allTarget)
			} else {
				break;
			}
		}

		for (let l = 0; l < 8; l++) {
			let image = DndData[`optionImage${l + 1}`];
			let optionsId = DndData[`optionID${l + 1}`];
			if (optionsId != 0 && image !== '') {
				let Imagepath = 'https://swaadhyayan.com/data/' + DndData.imagePath + image;
				images.push(Imagepath)
			} else {
				break;
			}
		}

		return { question: question, options: options, target: target, images: images }
	}
	function getDndQuesFormateTwo(dndData2) {

		let question = "";
		let options = [];
		let targerTXT = [];
		var quesHead = dndData2[`questionHeading`];
		if (quesHead != undefined) {
			quesHead = quesHead.replace(/<MTECHO>/g, '`');
			quesHead = quesHead.replace(/<\/MTECHO>/g, '`');

			if (quesHead != "") {
				let imgPart = quesHead.split('.')
				if (imgPart[1] !== undefined && (imgPart[1] == 'png' || imgPart[1] == 'PNG' || imgPart[1] == 'jpeg' || imgPart[1] == 'jpg' || imgPart[1] == 'JPG' || imgPart[1] == 'gif' || imgPart[1] == 'web')) {
					let img = `&nbsp; &nbsp;<img style=" height:${dndData2['questionImageHight']}px; max-width:250px; margin-top:10px; display: table-cell;
						vertical-align: middle; " src='https://swaadhyayan.com/data/${dndData2['imagePath']}${quesHead}'/> &nbsp;`
					question += img
				} else {
					question += quesHead;
				}
			}
		}
		for (let j = 0; j < 4; j++) {

			var quesPart = dndData2[`questionPart${j + 1}`];
			if (quesPart != undefined) {
				quesPart = quesPart.replace(/<MTECHO>/g, '`');
				quesPart = quesPart.replace(/<\/MTECHO>/g, '`');

				if (quesPart != "") {
					let imgPart = quesPart.split('.')
					if (imgPart[1] !== undefined && (imgPart[1] == 'png' || imgPart[1] == 'PNG' || imgPart[1] == 'jpeg' || imgPart[1] == 'jpg' || imgPart[1] == 'JPG' || imgPart[1] == 'gif' || imgPart[1] == 'web')) {
						let img = `&nbsp; &nbsp;<img style=" height:${dndData2['questionImageHight']}px; max-width:250px; margin-top:10px; display: table-cell;
						vertical-align: middle; " src='https://swaadhyayan.com/data/${dndData2['imagePath']}${quesPart}'/> &nbsp;`
						question += img
					} else {
						question += quesPart;
					}
				}
				else {
					continue;
				}
			}
			// question += quesPart;
		}

		for (let i = 0; i < 8; i++) {
			let optionsId = dndData2[`optionID${i + 1}`];
			if (optionsId != 0) {
				let targetBlank = dndData2[`optionText${i + 1}`]
				targetBlank = targetBlank.replace(/<MTECHO>/g, '`');
				targetBlank = targetBlank.replace(/<\/MTECHO>/g, '`');

				let optionImage = dndData2[`optionImage${i + 1}`]
				let finalFillup
				if (targetBlank != "") {
					finalFillup = targetBlank.replace(/#/g, '__________');
				}
				if (optionImage != "") {
					let img = `&nbsp; &nbsp;<img style="height:${dndData2['optionImageHight']}px; max-width:250px; margin-top:10px; display: table-cell;
						vertical-align: middle; " src='https://swaadhyayan.com/data/${dndData2['imagePath']}${optionImage}'/> &nbsp;`
					finalFillup += img
				}
				options.push(finalFillup)
			} else {
				continue;
			}

		}

		let targetText = dndData2[`answerText`];
		targetText = targetText.replace(/<MTECHO>/g, '`');
		targetText = targetText.replace(/<\/MTECHO>/g, '`');

		let trgtArry = '';
		let targetPart = '';
		if (targetText != 0) {
			targetPart = targetText.split(',')
			if (targetPart != '') {
				for (let k = 0; k < targetPart.length; k++) {
					trgtArry = targetPart[k].split('???');
					if (trgtArry != '') {
						for (let l = 0; l < trgtArry.length; l++) {
							targerTXT.push(trgtArry[l]);
						}
					}
					else {
						targerTXT.push(targetPart);
					}
				}
			}
		}
		return { question: question, options: options, targerTXT: targerTXT }
	}

	function getDndQuesFormateThree(dndData3) {
		let question = "";
		let options = [];
		let targerTXT = [];
		for (let j = 0; j < 4; j++) {

			var quesPart = dndData3[`questionPart${j + 1}`];
			if (quesPart != undefined) {
				quesPart = quesPart.replace(/<MTECHO>/g, '`');
				quesPart = quesPart.replace(/<\/MTECHO>/g, '`');

				if (quesPart != "") {
					let imgPart = quesPart.split('.')
					if (imgPart[1] !== undefined && (imgPart[1] == 'png' || imgPart[1] == 'PNG' || imgPart[1] == 'jpeg' || imgPart[1] == 'jpg' || imgPart[1] == 'JPG' || imgPart[1] == 'gif' || imgPart[1] == 'web')) {
						let img = `&nbsp; &nbsp;<img style=" height:${dndData3['questionImageHight']}px; max-width:250px; margin-top:10px; display: table-cell;
						vertical-align: middle; " src='https://swaadhyayan.com/data/${dndData3['imagePath']}${quesPart}'/> &nbsp;`
						question += img
					} else {
						question += quesPart;
					}
				}
				else {
					continue;
				}
			}
			// question += quesPart;
		}

		for (let i = 0; i < 8; i++) {
			let optionsId = dndData3[`optionID${i + 1}`];
			if (optionsId != 0) {
				let targetBlank = dndData3[`optionText${i + 1}`]
				targetBlank = targetBlank.replace(/<MTECHO>/g, '`');
				targetBlank = targetBlank.replace(/<\/MTECHO>/g, '`');

				let optionImage = dndData3[`optionImage${i + 1}`]
				let finalFillup
				if (targetBlank != "") {
					finalFillup = targetBlank.replace(/#/g, '__________');
				}
				if (optionImage != "") {
					let img = `&nbsp; &nbsp;<img style="height:${dndData3['optionImageHight']}px; max-width:250px; margin-top:10px; display: table-cell;
						vertical-align: middle; " src='https://swaadhyayan.com/data/${dndData3['imagePath']}${optionImage}'/> &nbsp;`
					finalFillup += img
				}
				options.push(finalFillup)
			} else {
				continue;
			}

		}

		let targetText = dndData3[`answerText`];
		targetText = targetText.replace(/<MTECHO>/g, '`');
		targetText = targetText.replace(/<\/MTECHO>/g, '`');

		let trgtArry = '';
		let targetPart = '';
		if (targetText != 0) {
			targetPart = targetText.split(',')
			if (targetPart != '') {
				for (let k = 0; k < targetPart.length; k++) {
					trgtArry = targetPart[k].split('???');
					if (trgtArry != '') {
						for (let l = 0; l < trgtArry.length; l++) {
							targerTXT.push(trgtArry[l]);
						}
					}
					else {
						targerTXT.push(targetPart);
					}
				}
			}
		}
		return { question: question, options: options, targerTXT: targerTXT }
	}

	function getDNDFormateFourFiveSix(DndData) {
		let question = "";
		let allData = ""
		let target = [];
		let images = [];
		let options = [];
		let allQuesData = '';
		for (let j = 0; j < 4; j++) {
			let quesPart = DndData[`questionPart${j + 1}`]

			if (quesPart != undefined) {

				quesPart = quesPart.replace(/<MTECHO>/g, '`');
				quesPart = quesPart.replace(/<\/MTECHO>/g, '`');

				let quesArray = quesPart.split('.');

				if (quesArray != '') {
					if (quesArray[1] != undefined && (quesArray[1] == "jpg" || quesArray[1] == "PNG" || quesArray[1] == 'jpeg' || quesArray[1] == 'png' || quesArray[1] == 'web' || quesArray[1] == 'gif')) {
						let img = `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px; max-width:250px; margin-top:10px; display: table-cell;
						vertical-align: middle; " src='https://swaadhyayan.com/data/${DndData.imagePath}${quesPart}'/> &nbsp;`
						allData += img;
					}
					else {
						allData += quesPart;
					}
				}
				else {
					continue;
				}
			}

		}

		let allDataArray = allData.split("???");
		question = allDataArray[0].trim();

		let arr = question.split("~~");
		let qImage = '';
		let questions = arr[0];
		if (arr[1] != undefined) {
			qImage = `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px;max-width:250px; margin-top:10px; display: table-cell;vertical-align: middle; " src='https://swaadhyayan.com/data/${DndData.imagePath}${arr[1].trim()}'/> &nbsp;`
			question = questions + '<br/>' + qImage;
		}

		let optionData = "";
		let dataIndex = 0;
		for (let a = 1; a < allDataArray.length; a++) {
			let optionsId = DndData[`optionID${a}`];

			let data = allDataArray[a];
			let dataArray = "";

			let data1 = data.split("<");
			let data2 = data.split(",");
			let data3 = data.split(">");

			if (data1[1] != undefined && (DndData.subActivityID == 5 || DndData.subActivityID == 6)) {

				data1.map((dnd, dndIndex) => {
					dataArray += dnd.replace(/#/g, `__________`);
				})
			} else if (data2[1] != undefined && (DndData.subActivityID == 5 || DndData.subActivityID == 6)) {


				let len = data2[1].split("#").length;
				for (let i = 0; i <= len; i++) {
					dataArray += data2[i] ? data2[i].replaceAll(/#/g, ``) + `__________` + "," : "";
					dataIndex += 1;
				}

			} else if (data3[1] != undefined && (DndData.subActivityID == 5 || DndData.subActivityID == 6)) {
				data3.map((dnd, dndIndex) => {
					console.log("3")
					dataArray += dnd.replace(/#/, `__________`);
				})
			} else {
				console.log("4")
				dataArray = data.replace(/#/g, '__________');
			}


			let img1 = (dataArray.includes('.png') || dataArray.includes('.jpg'));
			if (img1 == true) {
				let imagePart = dataArray.split(".");
				if (imagePart[1] != undefined) {
					let imgExt = imagePart[1].substring(0, 3);
					let imagName = imagePart[0] + "." + imgExt;
					let op = imagePart[1].substring(4);
					let quesImagepath11 = `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px;max-width:250px; margin-top:10px; display: table-cell;
						vertical-align: middle; " src='https://swaadhyayan.com/data/${DndData.imagePath}${imagName.trim()}'/>${op}`;
					optionData = quesImagepath11;
				}

			} else {
				optionData = dataArray
			}

			options.push(optionData)
		}
		for (let k = 0; k < 8; k++) {
			let targetText = DndData[`targetText${k + 1}`];


			if (targetText != 0 && targetText != undefined) {
				// target.push(DndData[`target_text${k+1}`])
				targetText = targetText.replace(/<MTECHO>/g, '`');
				targetText = targetText.replace(/<\/MTECHO>/g, '`');
				target.push(targetText)
			} else {
				break;
			}
		}
		return { question: question, options: options, targetTXT: target }
	}
	function getDNDFormateSeven(DndData) {
		let question = "";
		let allData = ""
		let target = [];
		let images = [];
		let options = [];

		for (let j = 0; j < 4; j++) {
			let quesPart = DndData[`questionPart${j + 1}`]
			if (quesPart != undefined) {
				quesPart = quesPart.replace(/<MTECHO>/g, '`');
				quesPart = quesPart.replace(/<\/MTECHO>/g, '`');

				if (quesPart != "") {

					// if(isQues){
					let quesArray = quesPart.split('.');
					if (quesArray[1] != undefined && (quesArray[1] == "jpg" || quesArray[1] == "PNG" || quesArray[1] == 'jpeg' || quesArray[1] == 'png' || quesArray[1] == 'web' || quesArray[1] == 'gif')) {
						let img = `&nbsp; &nbsp;<div style='text-align:center;'><span style='display:flex;'><img style="height:${DndData.question_image_height}px; max-width:250px; margin-top:10px; display: table-cell;
						vertical-align: middle; " src='https://swaadhyayan.com/data/${DndData.image_path}${quesPart}'/></span></div> &nbsp;`
						allData += img;
					} else {
						allData += quesPart
					}

				} else {
					continue;
				}
			}
		}

		let allDataArray = allData.split("???");
		question = allDataArray[0].trim();

		let arr = question.split("~~");
		let qImage = '';
		let questions = arr[0];
		if (arr[1] != undefined) {
			qImage = `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px;max-width:250px; margin-top:10px; display: table-cell;vertical-align: middle; " src='https://swaadhyayan.com/data/${DndData.imagePath}${arr[1].trim()}'/> &nbsp;`
			question = questions + '<br/>' + qImage;
		}
		// question = allDataArray[0];
		for (let a = 1; a < allDataArray.length; a++) {
			let data = allDataArray[a].trim();
			let optionDataArray = data.replace(/#/g, '__________')
			let optImage = (optionDataArray.includes('.png') || optionDataArray.includes('.jpg') || optionDataArray.includes('.JPG'));
			if (optImage == true) {
				let imagePart = optionDataArray.split(".");
				if (imagePart[1] != undefined) {
					let imgExt = imagePart[1].substring(0, 3);
					let imagName = imagePart[0] + "." + imgExt;
					imagName = imagName.trim()
					imagName = imagName.replace('__________', '')
					let underScore = "__________";
					let quesImagepath11 = `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px;max-width:250px; margin-top:10px; display: table-cell;
					vertical-align: middle; " src='https://swaadhyayan.com/data/${DndData.imagePath}${imagName.trim()}'/>${underScore}`;
					optionData = quesImagepath11;
				}
			} else {
				optionData = optionDataArray
			}
			options.push(optionData)
		}
		for (let k = 0; k < 8; k++) {
			let targetText = DndData[`targetText${k + 1}`];
			if (targetText != undefined) {
				targetText = targetText.replace(/<MTECHO>/g, '`');
				targetText = targetText.replace(/<\/MTECHO>/g, '`');
				if (targetText != 0) {
					target.push(targetText)
				} else {
					break;
				}
			}
		}

		return { question: question, options: options, targetTXT: target, images: images }


	}


	const helloFunction1 = (value, option) => {
		const replacedContent1 = value != undefined ? value.split('__________').map((part, index, inp) => {
			// Check if currentIndex and other nested objects exist
			const droppedItem = droppedItems[currentIndex]?.droppable1?.[index];
			const question = manageData.questions[currentIndex];


			if (index !== value.split('__________').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RenderHtml
									contentWidth={width}
									source={{ html: part }}
									tagsStyles={tagsStyles}
								/>
								<DroppableArea ref={droppableRefs?.droppable1?.[index]}>
									<Text style={{ color: SWATheam.SwaBlack }}>
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
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>
				<RenderHtml
					contentWidth={width}
					source={{ html: part }}
					tagsStyles={tagsStyles}
				/>
			</Text>;

		}) : '';

		return replacedContent1;
	}
	const helloFunction2 = (value, mainIndex) => {
		const replacedContent1 = value != undefined ? value.split('__________').map((part, index, inp) => {
			// Check if currentIndex and other nested objects exist
			const droppedItem = droppedItems[currentIndex]?.droppable2?.[index];
			const question = manageData.questions[currentIndex];


			if (index !== value.split('__________').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RenderHtml
									contentWidth={width}
									source={{ html: part }}
									tagsStyles={tagsStyles}
								/>
								<DroppableArea ref={droppableRefs?.droppable2?.[index]}>
									<Text style={{ color: SWATheam.SwaBlack }}>
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
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>
				<RenderHtml
					contentWidth={width}
					source={{ html: part }}
					tagsStyles={tagsStyles}
				/>
			</Text>;

		}) : '';

		return replacedContent1;
	}
	const helloFunction3 = (value, mainIndex) => {
		const replacedContent1 = value != undefined ? value.split('__________').map((part, index, inp) => {
			// Check if currentIndex and other nested objects exist
			const droppedItem = droppedItems[currentIndex]?.droppable3?.[index];
			const question = manageData.questions[currentIndex];


			if (index !== value.split('__________').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RenderHtml
									contentWidth={width}
									source={{ html: part }}
									tagsStyles={tagsStyles}
								/>
								<DroppableArea ref={droppableRefs?.droppable3?.[index]}>
									<Text style={{ color: SWATheam.SwaBlack }}>
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
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>
				<RenderHtml
					contentWidth={width}
					source={{ html: part }}
					tagsStyles={tagsStyles}
				/>
			</Text>;

		}) : '';

		return replacedContent1;
	}
	const helloFunction4 = (value, mainIndex) => {
		const replacedContent1 = value != undefined ? value.split('__________').map((part, index, inp) => {
			// Check if currentIndex and other nested objects exist
			const droppedItem = droppedItems[currentIndex]?.droppable4?.[index];
			const question = manageData.questions[currentIndex];


			if (index !== value.split('__________').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RenderHtml
									contentWidth={width}
									source={{ html: part }}
									tagsStyles={tagsStyles}
								/>
								<DroppableArea ref={droppableRefs?.droppable4?.[index]}>
									<Text style={{ color: SWATheam.SwaBlack }}>
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
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>
				<RenderHtml
					contentWidth={width}
					source={{ html: part }}
					tagsStyles={tagsStyles}
				/>
			</Text>;

		}) : '';

		return replacedContent1;
	}
	const helloFunction5 = (value, mainIndex) => {

		const replacedContent1 = value != undefined ? value.split('__________').map((part, index, inp) => {
			// Check if currentIndex and other nested objects exist
			const droppedItem = droppedItems[currentIndex]?.droppable5?.[index];
			const question = manageData.questions[currentIndex];


			if (index !== value.split('__________').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RenderHtml
									contentWidth={width}
									source={{ html: part }}
									tagsStyles={tagsStyles}
								/>
								<DroppableArea ref={droppableRefs?.droppable5?.[index]}>
									<Text style={{ color: SWATheam.SwaBlack }}>
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
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>
				<RenderHtml
					contentWidth={width}
					source={{ html: part }}
					tagsStyles={tagsStyles}
				/>
			</Text>;

		}) : '';

		return replacedContent1;
	}
	const helloFunction6 = (value, mainIndex) => {

		const replacedContent1 = value != undefined ? value.split('__________').map((part, index, inp) => {
			// Check if currentIndex and other nested objects exist
			const droppedItem = droppedItems[currentIndex]?.droppable6?.[index];
			const question = manageData.questions[currentIndex];


			if (index !== value.split('__________').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RenderHtml
									contentWidth={width}
									source={{ html: part }}
									tagsStyles={tagsStyles}
								/>
								<DroppableArea ref={droppableRefs?.droppable6?.[index]}>
									<Text style={{ color: SWATheam.SwaBlack }}>
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
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>
				<RenderHtml
					contentWidth={width}
					source={{ html: part }}
					tagsStyles={tagsStyles}
				/>
			</Text>;

		}) : '';

		return replacedContent1;
	}
	const helloFunction7 = (value, mainIndex) => {

		const replacedContent1 = value != undefined ? value.split('__________').map((part, index, inp) => {
			// Check if currentIndex and other nested objects exist
			const droppedItem = droppedItems[currentIndex]?.droppable7?.[index];
			const question = manageData.questions[currentIndex];


			if (index !== value.split('__________').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RenderHtml
									contentWidth={width}
									source={{ html: part }}
									tagsStyles={tagsStyles}
								/>
								<DroppableArea ref={droppableRefs?.droppable7?.[index]}>
									<Text style={{ color: SWATheam.SwaBlack }}>
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
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>
				<RenderHtml
					contentWidth={width}
					source={{ html: part }}
					tagsStyles={tagsStyles}
				/>
			</Text>;

		}) : '';

		return replacedContent1;
	}

	const helloFunction8 = (value, mainIndex) => {

		const replacedContent1 = value != undefined ? value.split('__________').map((part, index, inp) => {
			// Check if currentIndex and other nested objects exist
			const droppedItem = droppedItems[currentIndex]?.droppable8?.[index];
			const question = manageData.questions[currentIndex];


			if (index !== value.split('__________').length - 1) {
				return (
					<View key={index}>
						<View key={index}>
							<View key={inp} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<RenderHtml
									contentWidth={width}
									source={{ html: part }}
									tagsStyles={tagsStyles}
								/>
								<DroppableArea ref={droppableRefs?.droppable8?.[index]}>
									<Text style={{ color: SWATheam.SwaBlack }}>
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
			return <Text style={{ color: SWATheam.SwaBlack }} key={index}>
				<RenderHtml
					contentWidth={width}
					source={{ html: part }}
					tagsStyles={tagsStyles}
				/>
			</Text>;

		}) : '';

		return replacedContent1;
	}












	return (
		<>
			<View style={styles.mainHolder}>
				<View style={styles.roline}>
					<Text style={styles.qNumber}>{currentIndex + 1}</Text>
					<View style={{ flex: 1 }}>
						{/* <Text>{qDataAccordingToSubActType.question}</Text> */}
						<RenderHtml
							contentWidth={width}
							source={{ html: qDataAccordingToSubActType.question }}
							tagsStyles={tagsStyles}
						/>

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
							</View>
						</View>


						{/* options section */}
						<View style={styles.questionHolder}
						>
							<ScrollView style={{ maxHeight: 140 }}
							// onTouchStart={() => setOuterScrollEnabled(false)}
							// onTouchEnd={() => setOuterScrollEnabled(true)}
							// onMomentumScrollEnd={() => setOuterScrollEnabled(true)}
							>
								{qDataAccordingToSubActType.options[0] != undefined ?
									<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
										<Text style={{ color: SWATheam.SwaBlack, fontWeight: "700", width: 22 }}>a.</Text>
										<ScrollView horizontal>
											<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
												{helloFunction1(qDataAccordingToSubActType.options[0])}
											</View>
										</ScrollView>
									</View> : null
								}
								{qDataAccordingToSubActType.options[1] != undefined ?
									<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
										<Text style={{ color: SWATheam.SwaBlack, fontWeight: "700", width: 22 }}>b.</Text>
										<ScrollView horizontal>
											<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
												{helloFunction2(qDataAccordingToSubActType.options[1])}
											</View>
										</ScrollView>
									</View> : null
								}
								{qDataAccordingToSubActType.options[2] != undefined ?
									<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
										<Text style={{ color: SWATheam.SwaBlack, fontWeight: "700", width: 22 }}>c.</Text>
										<ScrollView horizontal>
											<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
												{helloFunction3(qDataAccordingToSubActType.options[2])}
											</View>
										</ScrollView>
									</View> : null
								}
								{qDataAccordingToSubActType.options[3] != undefined ?
									<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
										<Text style={{ color: SWATheam.SwaBlack, fontWeight: "700", width: 22 }}>d.</Text>
										<ScrollView horizontal>
											<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
												{helloFunction4(qDataAccordingToSubActType.options[3])}
											</View>
										</ScrollView>
									</View> : null
								}
								{qDataAccordingToSubActType.options[4] != undefined ?
									<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
										<Text style={{ color: SWATheam.SwaBlack, fontWeight: "700", width: 22 }}>e.</Text>
										<ScrollView horizontal>
											<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
												{helloFunction5(qDataAccordingToSubActType.options[4])}
											</View>
										</ScrollView>
									</View> : null
								}
								{qDataAccordingToSubActType.options[5] != undefined ?
									<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
										<Text style={{ color: SWATheam.SwaBlack, fontWeight: "700", width: 22 }}>f.</Text>
										<ScrollView horizontal>
											<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
												{helloFunction6(qDataAccordingToSubActType.options[5])}
											</View>
										</ScrollView>
									</View> : null
								}
								{qDataAccordingToSubActType.options[6] != undefined ?
									<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
										<Text style={{ color: SWATheam.SwaBlack, fontWeight: "700", width: 22 }}>g.</Text>
										<ScrollView horizontal>
											<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
												{helloFunction7(qDataAccordingToSubActType.options[6])}
											</View>
										</ScrollView>
									</View> : null
								}
								{qDataAccordingToSubActType.options[7] != undefined ?
									<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
										<Text style={{ color: SWATheam.SwaBlack, fontWeight: "700", width: 22 }}>h.</Text>
										<ScrollView horizontal>
											<View style={{ flexDirection: 'row', marginVertical: 2, alignItems: 'center' }}>
												{helloFunction8(qDataAccordingToSubActType.options[7])}
											</View>
										</ScrollView>
									</View> : null
								}
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
		minWidth: 100,
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
		borderWidth: 5,
		borderColor: "#eaf0f7",
		padding: 5,
		marginTop: 10,
		marginBottom: 10,
		borderRadius: 10,
		justifyContent: 'center',
		// overflow: 'hidden', // Optional: to hide overflowing content
	},

	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		// padding: 10,
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