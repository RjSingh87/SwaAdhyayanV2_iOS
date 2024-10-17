import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GlobleData } from '../../../../../../Store';
import { SWATheam } from '../../../../../../constant/ConstentValue';

export default function DdType() {
    const { manageData, currentIndex, hideOptionModel, selectedTexts, setSelectedTexts } = useContext(GlobleData);
    const { width } = Dimensions.get('window');

    // Extracting options
    const options = [
        manageData.questions[currentIndex]?.optionText1,
        manageData.questions[currentIndex]?.optionText2,
        manageData.questions[currentIndex]?.optionText3,
        manageData.questions[currentIndex]?.optionText4,
        manageData.questions[currentIndex]?.optionText5,
        manageData.questions[currentIndex]?.optionText6,
        manageData.questions[currentIndex]?.optionText7,
        manageData.questions[currentIndex]?.optionText8,
    ];

    // State to keep track of which dropdown is open
    const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
    // State to keep track of selected text for each dropdown
    // Initialize with an empty object

    const renderOptions = (opt, optIndex) => {
        return opt.split('#').map((part, index) => {
            part = part.replaceAll("</br>", "");
            if (index !== opt.split('#').length - 1) {
                return (
                    <View key={index} style={{ flexDirection: "row" }}>
                        <Text style={{ color: SWATheam.SwaBlack }}>{part}</Text>
                        <TouchableOpacity style={styles.selectOption} onPress={() => dropDown(manageData.questions[currentIndex][`targetText${optIndex + 1}`], optIndex, index)}>
                            <Text style={styles.selectText}>{selectedTexts[currentIndex]?.[optIndex]?.[index] || 'select option'}</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
            return <Text key={index} style={{ color: SWATheam.SwaBlack }}>{part}</Text>;
        });
    };

    const [ddDrpData, setddDrpData] = useState([]);
    const [dropDownBox, setdropDownBox] = useState(false);

    const dropDown = (data, optIndex, index) => {
        const words = data.split(",");
        const wordsObjects = words.map((word, idx) => ({ id: idx, word }));
        setddDrpData(wordsObjects);
        setActiveDropdownIndex({ optIndex, index }); // Update activeDropdownIndex correctly
        setdropDownBox(true);
    };
    const clickOnItems = (word) => {
        setSelectedTexts(prev => {
            // Initialize the currentIndex if it doesn't exist
            const newSelectedTexts = { ...prev };
            if (!newSelectedTexts[currentIndex]) {
                newSelectedTexts[currentIndex] = [];
            }
            // Initialize the inner array if it doesn't exist
            if (!newSelectedTexts[currentIndex][activeDropdownIndex.optIndex]) {
                newSelectedTexts[currentIndex][activeDropdownIndex.optIndex] = [];
            }
            // Update the selected text
            newSelectedTexts[currentIndex][activeDropdownIndex.optIndex][activeDropdownIndex.index] = word;
            return newSelectedTexts;

        });
        // Close the dropdown box after selection
        setdropDownBox(false);
    };

    return (
        <>
            <View style={styles.mainHolder}>
                <View style={styles.roline}>
                    <Text style={styles.qNumber}>{manageData.qNumber}</Text>
                    <View style={{ flex: 1 }}>
                        {[...Array(5).keys()].map(i => manageData.questions[currentIndex][`questionPart${i + 1}`] && (
                            <View key={i}>
                                {manageData.questions[currentIndex][`questionPart${i + 1}`].endsWith('.png') ||
                                    manageData.questions[currentIndex][`questionPart${i + 1}`].endsWith('.PNG') ||
                                    manageData.questions[currentIndex][`questionPart${i + 1}`].endsWith('.JPG') ||
                                    manageData.questions[currentIndex][`questionPart${i + 1}`].endsWith('.jpg') ?
                                    <Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex].imagePath + manageData.questions[currentIndex][`questionPart${i + 1}`] }} style={styles.questImgs} />
                                    : <Text style={styles.question}>{manageData.questions[currentIndex][`questionPart${i + 1}`]}</Text>
                                }
                            </View>
                        ))}
                        {options.map((opt, index) => opt && (
                            <View key={index} style={styles.mcqHolder}>
                                <ScrollView horizontal={true}>
                                    <View style={styles.rowHori}>
                                        <Text style={{ width: 25, fontWeight: 'bold', color: SWATheam.SwaBlack }}>{`(${String.fromCharCode(65 + index)})`}</Text>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row" }}>
                                                {renderOptions(opt, index)}
                                            </View>
                                            {manageData.questions[currentIndex][`optionImage${index + 1}`] &&
                                                <Image source={{ uri: manageData.siteUtls + manageData.questions[currentIndex].imagePath + manageData.questions[currentIndex][`optionImage${index + 1}`] }} style={styles.optImgs} />
                                            }
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            {dropDownBox &&
                <Modal transparent visible={dropDownBox} onRequestClose={() => setdropDownBox(false)}>
                    <View style={styles.holderModel}>
                        <View style={styles.headerOpts}>
                            <Text style={{ color: SWATheam.SwaGray }}>Select option</Text>
                            <Icon onPress={() => { setdropDownBox(false) }} name="close" size={20} color="#000" />
                        </View>
                        {ddDrpData.map((item, index) => (
                            <TouchableOpacity style={styles.listOpt} key={index} onPress={() => clickOnItems(item.word)}>
                                <Text style={{ color: SWATheam.SwaBlack }}>{item.word}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Modal>
            }
        </>
    );
}

const styles = StyleSheet.create({
    headerOpts: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: '#c8e5e7',
        elevation: 2,
        alignItems: "center"
    },
    listOpt: {
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#c8e5e7",
        padding: 10,
    },
    holderModel: {
        position: 'absolute',
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        backgroundColor: '#fff'
    },
    selectText: {
        paddingHorizontal: 2,
        color: SWATheam.SwaBlack
    },
    selectOption: {
        borderWidth: 1,
        borderColor: "#acdeab",
        padding: 2,
        elevation: 1,
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
        flex: 1,
        flexDirection: 'row',
        alignItems: "center"
    },
    optImgs: {
        maxWidth: 100,
        height: 50,
        resizeMode: "contain"
    },
    questImgs: {
        width: "50%",
        height: 60,
        resizeMode: "contain"
    }
});
