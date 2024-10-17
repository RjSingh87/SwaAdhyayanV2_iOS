import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { GlobleData } from '../../../../../../Store';
import { SWATheam } from '../../../../../../constant/ConstentValue';

export default function Tnf() {
    const { manageData, currentIndex, tnfAction, currOption } = useContext(GlobleData);
    const { width } = Dimensions.get('window');

    const tagsStyles = {
        body: {
            color: SWATheam.SwaBlack
        },
        p: {
            color: SWATheam.SwaBlack
        }
    };

    const renderQuestionPart = (part) => {
        if (!part) return null;
        const isImage = part.endsWith('.png') || part.endsWith('.PNG') || part.endsWith('.JPG') || part.endsWith('.jpg');
        return (
            <View>
                {isImage ? (
                    <Image source={{ uri: `${manageData.siteUtls}${manageData.questions[currentIndex]?.imagePath}${part}` }} style={styles.questImgs} />
                ) : (
                    <Text style={styles.question}>{part}</Text>
                )}
            </View>
        );
    };

    const handleOptionPress = (index, value, questionID) => {
        // Perform the action with immediate effect
        tnfAction(index + 1, value, questionID);

        // Optional: Additional logic can be placed here if needed
    };

    const renderOption = (optionText, optionImage, index) => {
        if (!optionText && !optionImage) return null;

        const isImage = (optionText && (optionText.endsWith('.png') || optionText.endsWith('.jpg'))) || optionImage;

        return (
            <View style={styles.mcqHolder} key={index}>
                <View style={styles.rowHori}>
                    <Text style={{ width: 25, fontWeight: "bold", color: SWATheam.SwaBlack }}>({String.fromCharCode(97 + index)})</Text>
                    <View style={{ flex: 1 }}>
                        {isImage ? (
                            <Image
                                source={{
                                    uri: manageData.siteUtls + manageData.questions[currentIndex]?.imagePath + (optionImage || optionText)
                                }}
                                style={styles.optImgs}
                            />
                        ) : (
                            <Text style={{ color: SWATheam.SwaBlack }}>{optionText}</Text>
                        )}
                    </View>
                </View>
                <View style={styles.tnfRow}>
                    <TouchableOpacity
                        onPress={() => handleOptionPress(index, 1, manageData.questions[currentIndex].questionID)}
                        style={[styles.btnsTnf, { backgroundColor: currOption[String(index + 1)] == 1 ? '#adff2f' : null }]}
                    >
                        <Text style={styles.textTnf}>
                            <RenderHtml
                                tagsStyles={tagsStyles}
                                contentWidth={width}
                                source={{ html: manageData.questions[currentIndex]?.targetText1 }}
                            />
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleOptionPress(index, 2, manageData.questions[currentIndex].questionID)}
                        style={[styles.btnsTnf, { backgroundColor: currOption[String(index + 1)] == 2 ? '#adff2f' : null }]}
                    >
                        <Text style={styles.textTnf}>
                            <RenderHtml
                                tagsStyles={tagsStyles}
                                contentWidth={width}
                                source={{ html: manageData.questions[currentIndex]?.targetText2 }}
                            />
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.mainHolder}>
            <View style={styles.roline}>
                <Text style={styles.qNumber}>{manageData.qNumber}</Text>
                <View style={{ flex: 1 }}>
                    {renderQuestionPart(manageData.questions[currentIndex]?.questionPart1)}
                    {renderQuestionPart(manageData.questions[currentIndex]?.questionPart2)}
                    {renderQuestionPart(manageData.questions[currentIndex]?.questionPart3)}
                    {renderQuestionPart(manageData.questions[currentIndex]?.questionPart4)}
                    {renderQuestionPart(manageData.questions[currentIndex]?.questionPart5)}

                    {/* options section */}
                    {renderOption(manageData.questions[currentIndex]?.optionText1, manageData.questions[currentIndex]?.optionImage1, 0)}
                    {renderOption(manageData.questions[currentIndex]?.optionText2, manageData.questions[currentIndex]?.optionImage2, 1)}
                    {renderOption(manageData.questions[currentIndex]?.optionText3, manageData.questions[currentIndex]?.optionImage3, 2)}
                    {renderOption(manageData.questions[currentIndex]?.optionText4, manageData.questions[currentIndex]?.optionImage4, 3)}
                    {renderOption(manageData.questions[currentIndex]?.optionText5, manageData.questions[currentIndex]?.optionImage5, 4)}
                    {renderOption(manageData.questions[currentIndex]?.optionText6, manageData.questions[currentIndex]?.optionImage6, 5)}
                    {renderOption(manageData.questions[currentIndex]?.optionText7, manageData.questions[currentIndex]?.optionImage7, 6)}
                    {renderOption(manageData.questions[currentIndex]?.optionText8, manageData.questions[currentIndex]?.optionImage8, 7)}
                    {/* options section */}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        textAlign: "center",
        color: SWATheam.SwaBlack

    },
    optImgs: {
        width: 100,
        minHeight: 100,
    }
});
