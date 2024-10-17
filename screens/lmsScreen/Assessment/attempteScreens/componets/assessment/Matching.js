import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { GlobleData } from '../../../../../../Store';
import { SWATheam } from '../../../../../../constant/ConstentValue';

export default function Matching() {

    const { manageData, currentIndex, setMatchTo, matchLines, setmatchLines, connections, setConnections } = useContext(GlobleData);

    const createOptionText = (optionText) => {
        if (!optionText) return null;

        return optionText.endsWith('.png') || optionText.endsWith('.jpg') || optionText.endsWith('.PNG') || optionText.endsWith('.JPG') ?
            <Image source={{ uri: `${manageData.siteUtls}${manageData.questions[currentIndex]?.imagePath}${optionText}` }} style={styles.optImgs} />
            :
            <Text style={styles.optionsText}>{optionText}</Text>;
    };

    const optionText_1 = createOptionText(manageData.questions[currentIndex]?.optionText1 || manageData.questions[currentIndex]?.optionImage1);
    const optionText_2 = createOptionText(manageData.questions[currentIndex]?.optionText2 || manageData.questions[currentIndex]?.optionImage2);
    const optionText_3 = createOptionText(manageData.questions[currentIndex]?.optionText3 || manageData.questions[currentIndex]?.optionImage3);
    const optionText_4 = createOptionText(manageData.questions[currentIndex]?.optionText4 || manageData.questions[currentIndex]?.optionImage4);
    const optionText_5 = createOptionText(manageData.questions[currentIndex]?.optionText5 || manageData.questions[currentIndex]?.optionImage5);
    const optionText_6 = createOptionText(manageData.questions[currentIndex]?.optionText6 || manageData.questions[currentIndex]?.optionImage6);
    const optionText_7 = createOptionText(manageData.questions[currentIndex]?.optionText7 || manageData.questions[currentIndex]?.optionImage7);
    const optionText_8 = createOptionText(manageData.questions[currentIndex]?.optionText8 || manageData.questions[currentIndex]?.optionImage8);

    const createTargetText = (targetText) => {
        if (!targetText) return null;

        return targetText.endsWith('.png') || targetText.endsWith('.jpg') || targetText.endsWith('.JPG') || targetText.endsWith('.PNG') ?
            <Image source={{ uri: `${manageData.siteUtls}${manageData.questions[currentIndex]?.imagePath}${targetText}` }} style={styles.optImgs} />
            :
            <Text style={styles.optionsText}>{targetText}</Text>;
    };

    const targetText_1 = createTargetText(manageData.questions[currentIndex]?.targetText1);
    const targetText_2 = createTargetText(manageData.questions[currentIndex]?.targetText2);
    const targetText_3 = createTargetText(manageData.questions[currentIndex]?.targetText3);
    const targetText_4 = createTargetText(manageData.questions[currentIndex]?.targetText4);
    const targetText_5 = createTargetText(manageData.questions[currentIndex]?.targetText5);
    const targetText_6 = createTargetText(manageData.questions[currentIndex]?.targetText6);
    const targetText_7 = createTargetText(manageData.questions[currentIndex]?.targetText7);
    const targetText_8 = createTargetText(manageData.questions[currentIndex]?.targetText8);

    const points = [
        optionText_1 && { id: 'startPoint_1', x: 230, y: 60, label: optionText_1, side: 'left' },
        targetText_1 && { id: 'endPoint_1', x: 530, y: 60, label: targetText_1, side: 'right' },

        optionText_2 && { id: 'startPoint_2', x: 230, y: 160, label: optionText_2, side: 'left' },
        targetText_2 && { id: 'endPoint_2', x: 530, y: 160, label: targetText_2, side: 'right' },

        optionText_3 && { id: 'startPoint_3', x: 230, y: 260, label: optionText_3, side: 'left' },
        targetText_3 && { id: 'endPoint_3', x: 530, y: 260, label: targetText_3, side: 'right' },

        optionText_4 && { id: 'startPoint_4', x: 230, y: 360, label: optionText_4, side: 'left' },
        targetText_4 && { id: 'endPoint_4', x: 530, y: 360, label: targetText_4, side: 'right' },

        optionText_5 && { id: 'startPoint_5', x: 230, y: 460, label: optionText_5, side: 'left' },
        targetText_5 && { id: 'endPoint_5', x: 530, y: 460, label: targetText_5, side: 'right' },

        optionText_6 && { id: 'startPoint_6', x: 230, y: 560, label: optionText_6, side: 'left' },
        targetText_6 && { id: 'endPoint_6', x: 530, y: 560, label: targetText_6, side: 'right' },

        optionText_7 && { id: 'startPoint_7', x: 230, y: 660, label: optionText_7, side: 'left' },
        targetText_7 && { id: 'endPoint_7', x: 530, y: 660, label: targetText_7, side: 'right' },

        optionText_8 && { id: 'startPoint_8', x: 230, y: 760, label: optionText_8, side: 'left' },
        targetText_8 && { id: 'endPoint_8', x: 530, y: 760, label: targetText_8, side: 'right' },
    ].filter(point => point !== null); // Filter out null values

    const Point = ({ point, onPress }) => {
        const isSelected = selectedPoints.some(p => p.id === point.id);
        return (
            <TouchableOpacity
                style={[
                    styles.pointContainer,
                    { left: point.x - 10, top: point.y - 10 },
                    isSelected ? styles.selectedPoint : null
                ]}
                onPress={() => onPress(point)}
            >
                <View>
                    <View style={[styles.point, isSelected ? styles.selectedPointInner : null]} />
                </View>
                <Text style={[styles.label, point.side === 'left' ? styles.labelLeft : styles.labelRight]}>
                    {point.label}
                </Text>
            </TouchableOpacity>
        );
    };

    const [selectedPoints, setSelectedPoints] = useState([]);
    const [lines, setLines] = useState({});

    const handlePointPress = (point) => {
        if (selectedPoints.length === 0) {
            if (point.side === 'left') {
                setSelectedPoints([point]);
            }
        } else {
            const selectedPoint = selectedPoints[0];
            if (selectedPoint.side === 'left' && point.side === 'right') {
                let crtLine = matchLines[currentIndex] ? matchLines[currentIndex] : [];
                const existingLineIndex = crtLine.findIndex(line =>
                    (line.start.id === selectedPoint.id && line.end.id === point.id) ||
                    (line.start.id === point.id && line.end.id === selectedPoint.id)
                );

                if (existingLineIndex !== -1) {
                    const newLines = [...crtLine];
                    newLines.splice(existingLineIndex, 1);
                    setmatchLines((prev) => ({
                        ...prev,
                        [currentIndex]: newLines
                    }));

                    const currentConnections = connections[currentIndex] ? connections[currentIndex] : [];
                    const newConnections = currentConnections.filter(connection =>
                        connection !== `${selectedPoint.id}-${point.id}`
                    );
                    setConnections((prev) => ({
                        ...prev,
                        [currentIndex]: newConnections
                    }));
                } else {
                    const newLine = { start: selectedPoint, end: point };
                    setmatchLines((prev) => ({
                        ...prev,
                        [currentIndex]: [...crtLine, newLine]
                    }));

                    const currentConnections = connections[currentIndex] ? connections[currentIndex] : [];
                    setConnections((prev) => ({
                        ...prev,
                        [currentIndex]: [...currentConnections, `${selectedPoint.id}-${point.id}`]
                    }));
                }
                setSelectedPoints([]);
            } else {
                setSelectedPoints([]);
            }
        }
    };

    // console.log(matchData, "/*");
    // matchingDataFun(matchData)

    const renderLines = () => {
        let newLines = matchLines[currentIndex] ? matchLines[currentIndex] : []
        return newLines.map((line, index) => (
            <Line
                key={`line-${index}`}
                x1={line.start.x + 5}
                y1={line.start.y + 5}
                x2={line.end.x + 5}
                y2={line.end.y + 5}
                stroke="black"
                strokeWidth="2"
            />
        ));
    };
    return (
        <>
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
                        : ""}
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
                        : ""}
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
                        : ""}
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
                        : ""}
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
                        : ""}

                </View>
            </View>
            <View style={styles.rowColman}>
                <Text style={styles.colManText}>Columnn A</Text>
                <Text style={styles.colManText}>Columnn B</Text>
            </View>
            <View style={styles.container}>
                <Svg style={StyleSheet.absoluteFill}>
                    {renderLines()}
                </Svg>
                {points.map((point) => (
                    <Point key={point.id} point={point} onPress={handlePointPress} />
                ))}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    colManText: {
        paddingHorizontal: 10,
        backgroundColor: "#319392",
        color: '#fff',
        padding: 5,
        borderRadius: 5
    },
    container: {
        width: "100%",
        height: 600,
        flex: 1
    },
    pointContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    point: {
        width: 30,
        height: 30,
        borderRadius: 50,
        backgroundColor: 'blue',
    },
    selectedPoint: {
        borderColor: 'green',
        // borderWidth: 2,
    },
    selectedPointInner: {
        backgroundColor: 'green',
    },
    label: {
        position: 'absolute',
        fontSize: 16,
        color: SWATheam.SwaBlack,
        width: 150,
        flexDirection: "row",
        alignItems: "center",
        // borderWidth:1,
    },
    labelLeft: {
        right: 33,
        width: 100,
        textAlign: "right"
    },
    labelRight: {
        left: 33,
        width: 100,
    },
    optImgs: {
        width: 60,
        height: 60,
        resizeMode: "contain",
    },
    rowColman: {
        flexDirection: 'row',
        justifyContent: "space-around",
        width: "100%"
    },
    qNumber: {
        fontWeight: "bold",
        width: 30,
        color: SWATheam.SwaBlack
    },
    roline: {
        flexDirection: "row",
        margin: 10
    },
    question: {
        flexDirection: "row",
        textAlign: "justify",
        fontSize: 15,
        color: SWATheam.SwaBlack
    },
});