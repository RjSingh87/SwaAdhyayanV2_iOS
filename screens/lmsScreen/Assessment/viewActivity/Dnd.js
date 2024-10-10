import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, TextInput, Image, CheckBox, ScrollView, TouchableOpacity, TouchableHighlight, Alert, SafeAreaView } from "react-native"
import RenderHtml from 'react-native-render-html';
import { SwaTheam } from "../../../../constant/ConstentValue";
var optionArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
var number = [1, 2, 3, 4];
var option = ["Delhi", "Jaipur", "Rajesthan", "Haryana"];
export default function Dnd({ dndData, index }) {

  const tagsStyles = {
    body: {
      color: SwaTheam.SwaBlack
    },
    p: {
      color: SwaTheam.SwaBlack
    }
  };


  const { width } = useWindowDimensions();
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
          question += `<div style='text-align:center'><img style='height:${DndData.questionImageHight}px; max-width:100%;' src=${imgPath} /></div>`
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
            allDndData += `<div style='text-align:center'><img style='height:${DndData.optionImageHight}px; max-width:100%;' src=${imgPath} /></div>`
          } else {
            allDndData += optionsData.replace(/#/g, '__________');
          }

          let ext2 = optionsImg.split('.');
          if (ext2[1] !== undefined && (ext2[1] == 'png' || ext2[1] == 'PNG' || ext2[1] == 'jpeg' || ext2[1] == 'jpg' || ext2[1] == 'JPG' || ext2[1] == 'gif' || ext2[1] == 'web')) {
            let imgPath = 'https://swaadhyayan.com/data/' + DndData.imagePath + optionsImg
            allDndData += `<div style='text-align:center' ><img style='height:${DndData.optionImageHight}px; max-width:100%;' src=${imgPath} /></div>`
          } else {
            allDndData += optionsImg.replace(/#/g, '___________');
          }
        } else if (optionsData == '' && optionsImg != '') {
          let ext2 = optionsImg.split('.');
          if (ext2[1] !== undefined && (ext2[1] == 'png' || ext2[1] == 'PNG' || ext2[1] == 'jpeg' || ext2[1] == 'jpg' || ext2[1] == 'JPG' || ext2[1] == 'gif' || ext2[1] == 'web')) {
            let imgPath = 'https://swaadhyayan.com/data/' + DndData.imagePath + optionsImg
            allDndData += `<div style='text-align:center'><img style='height:${DndData.optionImageHight}px; max-width:100%;' src=${imgPath} /></div>`

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
          allTarget += `<div style='text-align:center'><img style='height:${DndData.questionImageHight}px; max-width:100%;' src=${imgPath} /></div>`
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
          question += `<div style='text-align:center'><img style='height:${DndData.questionImageHight}px; max-width:100%;' src=${imgPath} /></div>`
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
            allDndData += `<div style='text-align:center'><img style='height:${DndData.optionImageHight}px; max-width:100%;' src=${imgPath} /></div>`
          } else {
            allDndData += optionsData.replace(/#/g, '__________');
          }

          let ext2 = optionsImg.split('.');
          if (ext2[1] !== undefined && (ext2[1] == 'png' || ext2[1] == 'PNG' || ext2[1] == 'jpeg' || ext2[1] == 'jpg' || ext2[1] == 'JPG' || ext2[1] == 'gif' || ext2[1] == 'web')) {
            let imgPath = 'https://swaadhyayan.com/data/' + DndData.imagePath + optionsImg
            allDndData += `<div style='text-align:center' ><img style='height:${DndData.optionImageHight}px; max-width:100%;' src=${imgPath} /></div>`
          } else {
            allDndData += optionsImg.replace(/#/g, '__________');
          }
        } else if (optionsData == '' && optionsImg != '') {
          let ext2 = optionsImg.split('.');
          if (ext2[1] !== undefined && (ext2[1] == 'png' || ext2[1] == 'PNG' || ext2[1] == 'jpeg' || ext2[1] == 'jpg' || ext2[1] == 'JPG' || ext2[1] == 'gif' || ext2[1] == 'web')) {
            let imgPath = 'https://swaadhyayan.com/data/' + DndData.imagePath + optionsImg
            allDndData += `<div style='text-align:center'><img style='height:${DndData.optionImageHight}px; max-width:100%;' src=${imgPath} /></div>`

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
          allTarget += `<div style='text-align:center'><img style='height:${DndData.questionImageHight}px; max-width:100%;' src=${imgPath} /></div>`
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
          let img = `&nbsp; &nbsp;<img style=" height:${dndData2['questionImageHight']}px; max-width:100%; margin-top:10px; display: table-cell;
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
            let img = `&nbsp; &nbsp;<img style=" height:${dndData2['questionImageHight']}px; max-width:100%; margin-top:10px; display: table-cell;
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
          let img = `&nbsp; &nbsp;<img style="height:${dndData2['optionImageHight']}px; max-width:100%; margin-top:10px; display: table-cell;
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
            let img = `&nbsp; &nbsp;<img style=" height:${dndData3['questionImageHight']}px; max-width:100%; margin-top:10px; display: table-cell;
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
          let img = `&nbsp; &nbsp;<img style="height:${dndData3['optionImageHight']}px; max-width:100%; margin-top:10px; display: table-cell;
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
            let img = `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px; max-width:100%; margin-top:10px; display: table-cell;
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
      qImage = `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px;max-width:100%; margin-top:10px; display: table-cell;vertical-align: middle; " src='https://swaadhyayan.com/data/${DndData.imagePath}${arr[1].trim()}'/> &nbsp;`
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
          dataArray += dnd.replace(/#/g, `_________`);
        })
      } else if (data2[1] != undefined && (DndData.subActivityID == 5 || DndData.subActivityID == 6)) {

        data2.map((dnd, dndIndex) => {
          dataArray += dnd.replace(/#/g, `_________`);
          dataIndex += 1;
        })
      } else if (data3[1] != undefined && (DndData.subActivityID == 5 || DndData.subActivityID == 6)) {
        data3.map((dnd, dndIndex) => {
          dataArray += dnd.replace(/#/g, `_________`);
        })
      } else {
        dataArray = data.replace(/#/g, '__________');
      }


      let img1 = (dataArray.includes('.png') || dataArray.includes('.jpg'));
      if (img1 == true) {
        let imagePart = dataArray.split(".");
        if (imagePart[1] != undefined) {
          let imgExt = imagePart[1].substring(0, 3);
          let imagName = imagePart[0] + "." + imgExt;
          let op = imagePart[1].substring(4);
          let quesImagepath11 = `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px;max-width:100%; margin-top:10px; display: table-cell;
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
      targetText = targetText.replace(/<MTECHO>/g, '`');
      targetText = targetText.replace(/<\/MTECHO>/g, '`');

      if (targetText != 0) {
        // target.push(DndData[`target_text${k+1}`])
        target.push(targetText)
      } else {
        break;
      }
    }

    return { question: question, options: options, targetTXT: target }

  }

  // DND type 7 formating
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
            let img = `&nbsp; &nbsp;<div style='text-align:center;'><span style='display:flex;'><img style="height:${DndData.question_image_height}px; max-width:100%; margin-top:10px; display: table-cell;
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
      qImage = `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px;max-width:100%; margin-top:10px; display: table-cell;vertical-align: middle; " src='https://swaadhyayan.com/data/${DndData.imagePath}${arr[1].trim()}'/> &nbsp;`
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
          imagName = imagName.replace('________', '')
          let underScore = "________";
          let quesImagepath11 = `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px;max-width:100%; margin-top:10px; display: table-cell;
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

  if (dndData.subActivityID == 1) {
    var DndData = getDndQuesFormateOne(dndData);
    return (
      <>
        <View style={{ backgroundColor: '#fff', marginBottom: 6 }}>
          <View style={{ backgroundColor: '#efefef', borderRadius: 6, flex: 1 }}>

            {/* <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Chapter:{dndData.chapterName}</Text>
              </View>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Type:DND</Text>
              </View>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Marks:{dndData.quesSelectedMark}</Text>
              </View>
            </View> */}

            <View style={{ padding: 3, margin: 1, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: '#fff' }}>
                  <Text style={{ color: '#000', fontWeight: '700', textAlign: 'center' }}>Chapter: {dndData.chapterName}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#000' }}>Type: DND</Text>
                </View>
                <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#000', textAlign: 'right' }}>Marks: {dndData.marksPerQuestion}</Text>
                </View>
              </View>
            </View>


            <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
              <View style={{}}>
                <Text style={{ color: '#000' }}>Q: {index}</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 10 }}>
                {/* <Text style={{ color: '000', fontWeight: 'bold' }}>This is Question Part Can You Know That ?</Text> */}
                <RenderHtml
                  contentWidth={width}
                  source={{ html: DndData.question }}
                  tagsStyles={tagsStyles}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
              {DndData.target.map((item, index) => {
                return (
                  <View style={{ width: 'auto', padding: 6, backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 10, margin: 5 }} key={index}>
                    <Text style={{ color: '#000' }}>{item}</Text>
                  </View>

                )
              })}
            </View>

            {DndData.options.map((item, key) => {
              return (
                <View style={{ flexDirection: 'row', padding: 5, margin: 4, paddingLeft: 45 }} key={key}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ margin: 2 }}>
                        <Text style={{ color: '#000' }}>{optionArray[key]}.</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                          {/* <Text style={{ color: '#000' }}>{item}</Text> */}
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: item }}
                            tagsStyles={tagsStyles}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}

            <View style={{ marginHorizontal: 10, paddingVertical: 5, borderTopWidth: .7 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 110 }}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>Correct Answers</Text>
                </View>
                <View>
                  <Text style={{ color: '#000' }}>:</Text>
                </View>
                <View style={{ paddingHorizontal: 5, flex: 1 }}>
                  <Text style={{ color: '#000' }}>{dndData.answerText.replaceAll("???", ",")}</Text>
                </View>
              </View>
              {/* <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 110 }}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>Your Answers</Text>
                </View>
                <View>
                  <Text style={{ color: '#000' }}>:</Text>
                </View>
                <View style={{ paddingHorizontal: 5, flex: 1 }}>
                  <Text style={{ color: '#000' }}>{dndData.userAnsText.replaceAll("???", ",").replaceAll("null", "Not Attempt")}</Text>
                </View>
              </View> */}
            </View>

          </View>
        </View>
      </>
    )
  } else if (dndData.subActivityID == 2) {
    var DndData = getDndQuesFormateTwo(dndData);
    return (
      <>
        <View style={{ backgroundColor: '#fff' }}>
          <View style={{ backgroundColor: '#efefef', padding: 8, borderRadius: 6, margin: 8 }}>

            {/* <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Chapter:{dndData.chapterName}</Text>
              </View>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Type:DND</Text>
              </View>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Marks:{dndData.quesSelectedMark}</Text>
              </View>
            </View> */}

            <View style={{ padding: 3, margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: '#fff' }}>
                  <Text style={{ color: '#000', fontWeight: '700', textAlign: 'center' }}>Chapter: {dndData.chapterName}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#000' }}>Type: DND</Text>
                </View>
                <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#000', textAlign: 'right' }}>Marks: {dndData.marksPerQuestion}</Text>
                </View>
              </View>
            </View>


            <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
              <View style={{ width: '12%' }}>
                <Text style={{ color: '#000' }}>Q: {index}</Text>
              </View>
              <View style={{ width: '88%' }}>
                {/* <Text style={{ color: '000', fontWeight: 'bold' }}>This is Question Part Can You Know That ?</Text> */}
                <RenderHtml
                  contentWidth={width}
                  source={{ html: DndData.question }}
                  tagsStyles={tagsStyles}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '12%' }}>
              </View>
              {DndData.targerTXT.map((item, index) => {
                return (

                  <View style={{ padding: 6, width: 'auto', margin: 4, backgroundColor: '#fff', borderRadius: 6 }} key={key}>
                    <Text>{item}</Text>
                  </View>

                )
              })}
            </View>

            {DndData.options.map((item, key) => {
              return (
                <View style={{ flexDirection: 'row', padding: 5, margin: 4 }} key={key}>
                  <View style={{ width: '12%' }}>
                  </View>
                  <View style={{ width: '88%' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: '5%', margin: 2 }}>
                        <Text>{optionArray[key]}.</Text>
                      </View>
                      <View style={{ width: '95%' }}>
                        <View style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                          {/* <Text style={{ color: '#000' }}>{item}</Text> */}
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: item }}
                            tagsStyles={tagsStyles}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}

            <View style={{ marginHorizontal: 10, paddingVertical: 5, borderTopWidth: .7 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 110 }}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>Correct Answers</Text>
                </View>
                <View>
                  <Text style={{ color: '#000' }}>:</Text>
                </View>
                <View style={{ paddingHorizontal: 5, flex: 1 }}>
                  <Text style={{ color: '#000' }}>{dndData.answerText.replaceAll("???", ",")}</Text>
                </View>
              </View>
              {/* <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 110 }}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>Your Answers</Text>
                </View>
                <View>
                  <Text style={{ color: '#000' }}>:</Text>
                </View>
                <View style={{ paddingHorizontal: 5, flex: 1 }}>
                  <Text style={{ color: '#000' }}>{dndData.userAnsText.replaceAll("???", ",").replaceAll("null", "Not Attempt")}</Text>
                </View>
              </View> */}
            </View>

          </View>
        </View>
      </>
    )
  } else if (dndData.subActivityID == 3) {
    var DndData = getDndQuesFormateThree(dndData);
    return (
      <>
        <View style={{ backgroundColor: '#fff' }}>
          <View style={{ backgroundColor: '#efefef', padding: 8, borderRadius: 6, margin: 8 }}>

            {/* <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Chapter:{dndData.chapterName}</Text>
              </View>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Type:DND</Text>
              </View>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Marks:{dndData.quesSelectedMark}</Text>
              </View>
            </View> */}

            <View style={{ padding: 3, margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: '#fff' }}>
                  <Text style={{ color: '#000', fontWeight: '700', textAlign: 'center' }}>Chapter:{dndData.chapterName}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#000' }}>Type:DND</Text>
                </View>
                <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#000', textAlign: 'right' }}>Marks:{dndData.marksPerQuestion}</Text>
                </View>
              </View>
            </View>


            <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
              <View style={{ width: '12%' }}>
                <Text style={{color:'#000'}}>Q:{index}</Text>
              </View>
              <View style={{ width: '88%' }}>
                {/* <Text style={{ color: '000', fontWeight: 'bold' }}>This is Question Part Can You Know That ?</Text> */}
                <RenderHtml
                  contentWidth={width}
                  source={{ html: DndData.question }}
                  tagsStyles={tagsStyles}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '12%' }}>
              </View>
              {DndData.targerTXT.map((item, index) => {
                return (

                  <View style={{ padding: 6, width: 'auto', margin: 4, backgroundColor: '#fff', borderRadius: 6 }} key={index}>
                    <Text>{item}</Text>
                  </View>

                )
              })}
            </View>

            {DndData.options.map((item, key) => {
              return (
                <View style={{ flexDirection: 'row', padding: 5, margin: 4 }} key={key}>
                  <View style={{ width: '12%' }}>
                  </View>
                  <View style={{ width: '88%' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: '5%', margin: 2 }}>
                        <Text>{optionArray[key]}.</Text>
                      </View>
                      <View style={{ width: '95%' }}>
                        <View style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                          {/* <Text style={{ color: '#000' }}>{item}</Text> */}
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: item }}
                            tagsStyles={tagsStyles}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}

            <View style={{ marginHorizontal: 10, paddingVertical: 5, borderTopWidth: .7 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 110 }}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>Correct Answers</Text>
                </View>
                <View>
                  <Text style={{ color: '#000' }}>:</Text>
                </View>
                <View style={{ paddingHorizontal: 5, flex: 1 }}>
                  <Text style={{ color: '#000' }}>{dndData.answerText.replaceAll("???", ",")}</Text>
                </View>
              </View>
              {/* <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 110 }}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>Your Answers</Text>
                </View>
                <View>
                  <Text style={{ color: '#000' }}>:</Text>
                </View>
                <View style={{ paddingHorizontal: 5, flex: 1 }}>
                  <Text style={{ color: '#000' }}>{dndData.userAnsText.replaceAll("???", ",").replaceAll("null", "Not Attempt")}</Text>
                </View>
              </View> */}
            </View>

          </View>
        </View>
      </>
    )
  } else if (dndData.subActivityID == 4 || dndData.subActivityID == 5 || dndData.subActivityID == 6) {
    var DndData = getDNDFormateFourFiveSix(dndData);
    return (
      <>
        <View style={{ backgroundColor: '#fff' }}>
          <View style={{ backgroundColor: '#efefef', padding: 8, borderRadius: 6, margin: 8 }}>

            {/* <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Chapter:{dndData.chapterName}</Text>
              </View>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Type:DND</Text>
              </View>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Marks:{dndData.quesSelectedMark}</Text>
              </View>
            </View> */}

            <View style={{ padding: 3, margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: '#fff' }}>
                  <Text style={{ color: '#000', fontWeight: '700', textAlign: 'center' }}>Chapter:{dndData.chapterName}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#000' }}>Type:DND</Text>
                </View>
                <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#000', textAlign: 'right' }}>Marks:{dndData.marksPerQuestion}</Text>
                </View>
              </View>
            </View>


            <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
              <View style={{ width: '12%' }}>
                <Text style={{color:'#000'}}>Q:{index}</Text>
              </View>
              <View style={{ width: '88%' }}>
                {/* <Text style={{ color: '000', fontWeight: 'bold' }}>This is Question Part Can You Know That ?</Text> */}
                <RenderHtml
                  contentWidth={width}
                  source={{ html: DndData.question }}
                  tagsStyles={tagsStyles}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '12%' }}>
              </View>
              {DndData.targetTXT.map((item, index) => {
                return (

                  <View style={{ padding: 6, width: 'auto', margin: 4, backgroundColor: '#fff', borderRadius: 6 }} key={index}>
                    <Text>{item}</Text>
                  </View>

                )
              })}
            </View>

            {DndData.options.map((item, key) => {
              return (
                <View style={{ flexDirection: 'row', padding: 5, margin: 4 }} key={key}>
                  <View style={{ width: '12%' }}>
                  </View>
                  <View style={{ width: '88%' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: '5%', margin: 2 }}>
                        <Text>{optionArray[key]}.</Text>
                      </View>
                      <View style={{ width: '95%' }}>
                        <View style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                          {/* <Text style={{ color: '#000' }}>{item}</Text> */}
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: item }}
                            tagsStyles={tagsStyles}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}

            <View style={{ marginHorizontal: 10, paddingVertical: 5, borderTopWidth: .7 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 110 }}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>Correct Answers</Text>
                </View>
                <View>
                  <Text style={{ color: '#000' }}>:</Text>
                </View>
                <View style={{ paddingHorizontal: 5, flex: 1 }}>
                  <Text style={{ color: '#000' }}>{dndData.answerText.replaceAll("???", ",")}</Text>
                </View>
              </View>
              {/* <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 110 }}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>Your Answers</Text>
                </View>
                <View>
                  <Text style={{ color: '#000' }}>:</Text>
                </View>
                <View style={{ paddingHorizontal: 5, flex: 1 }}>
                  <Text style={{ color: '#000' }}>{dndData.userAnsText.replaceAll("???", ",").replaceAll("null", "Not Attempt")}</Text>
                </View>
              </View> */}
            </View>

          </View>
        </View>
      </>
    )
  } else if (dndData.subActivityID == 7) {
    var DndData = getDNDFormateSeven(dndData);
    return (
      <>
        <View style={{ backgroundColor: '#fff' }}>
          <View style={{ backgroundColor: '#efefef', padding: 8, borderRadius: 6, margin: 8 }}>

            {/* <View style={{ flexDirection: 'row', padding: 3, justifyContent: 'center', alignContent: 'center', alignItems: 'center', margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Chapter:{dndData.chapterName}</Text>
              </View>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Type:DND</Text>
              </View>
              <View style={{ width: '30%', padding: 5, margin: 4, backgroundColor: '#efefef', borderRadius: 6 }}>
                <Text>Marks:{dndData.quesSelectedMark}</Text>
              </View>
            </View> */}

            <View style={{ padding: 3, margin: 4, backgroundColor: '#93ced0', borderRadius: 6 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '100%', padding: 4, margin: 2, borderRadius: 6, borderBottomWidth: .7, borderColor: '#fff' }}>
                  <Text style={{ color: '#000', fontWeight: '700', textAlign: 'center' }}>Chapter:{dndData.chapterName}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '70%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#000' }}>Type:DND</Text>
                </View>
                <View style={{ width: '27%', padding: 2, margin: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#000', textAlign: 'right' }}>Marks:{dndData.marksPerQuestion}</Text>
                </View>
              </View>
            </View>


            <View style={{ flexDirection: 'row', padding: 5, margin: 4 }}>
              <View style={{ width: '12%' }}>
                <Text style={{color:'#000'}}>Q:{index}</Text>
              </View>
              <View style={{ width: '88%' }}>
                {/* <Text style={{ color: '000', fontWeight: 'bold' }}>This is Question Part Can You Know That ?</Text> */}
                <RenderHtml
                  contentWidth={width}
                  source={{ html: DndData.question }}
                  tagsStyles={tagsStyles}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '12%' }}>
              </View>
              {DndData.targetTXT.map((item, index) => {
                return (

                  <View style={{ padding: 6, width: 'auto', margin: 4, backgroundColor: '#fff', borderRadius: 6 }} key={index}>
                    <Text>{item}</Text>
                  </View>

                )
              })}
            </View>

            {DndData.options.map((item, key) => {
              return (
                <View style={{ flexDirection: 'row', padding: 5, margin: 4 }} key={key}>
                  <View style={{ width: '12%' }}>
                  </View>
                  <View style={{ width: '88%' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: '5%', margin: 2 }}>
                        <Text>{optionArray[key]}.</Text>
                      </View>
                      <View style={{ width: '95%' }}>
                        <View style={{ backgroundColor: '#efefef', margin: 2, borderRadius: 6 }} >
                          {/* <Text style={{ color: '#000' }}>{item}</Text> */}
                          <RenderHtml
                            contentWidth={width}
                            source={{ html: item }}
                            tagsStyles={tagsStyles}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}

            <View style={{ marginHorizontal: 10, paddingVertical: 5, borderTopWidth: .7 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 110 }}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>Correct Answers</Text>
                </View>
                <View>
                  <Text style={{ color: '#000' }}>:</Text>
                </View>
                <View style={{ paddingHorizontal: 5, flex: 1 }}>
                  <Text style={{ color: '#000' }}>{dndData.answerText.replaceAll("???", ",")}</Text>
                </View>
              </View>
              {/* <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 110 }}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>Your Answers</Text>
                </View>
                <View>
                  <Text style={{ color: '#000' }}>:</Text>
                </View>
                <View style={{ paddingHorizontal: 5, flex: 1 }}>
                  <Text style={{ color: '#000' }}>{dndData.userAnsText.replaceAll("???", ",").replaceAll("null", "Not Attempt")}</Text>
                </View>
              </View> */}
            </View>

          </View>
        </View>
      </>
    )
  }

}