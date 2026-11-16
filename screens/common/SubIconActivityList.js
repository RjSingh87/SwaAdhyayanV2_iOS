import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SWATheam } from '../../constant/ConstentValue';
import { GlobleData } from '../../Store';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';


const SubIconActivityList = ({ navigation, toolItems, getModuleActivityData, selectedModuleItem, searchID, }) => {
  const insets = useSafeAreaInsets();

  let listData = [];

  if (toolItems.mainData != undefined) {
    listData = toolItems.mainData;
  } else {
    listData = toolItems;
  }

  const { userData, } = useContext(GlobleData);


  const chapterColors = [
    ['#7f7fd5', '#86a8e7'],
    ['#ff9ff3', '#f368e0'],
    ['#48dbfb', '#0abde3'],
    ['#ff9a9e', '#fad0c4'],
    ['#a18cd1', '#fbc2eb'],
    ['#fad0c4', '#ffd1ff'],
    ['#ffecd2', '#fcb69f'],
    ['#ff8177', '#ff867a'],
    ['#cfd9df', '#e2ebf0'],
    ['#a1c4fd', '#c2e9fb'],
    ['#89f7fe', '#66a6ff'],
    ['#fddb92', '#d1fdff'],
    ['#9890e3', '#b1f4cf'],
    ['#fbc2eb', '#a6c1ee'],
    ['#fdcbf1', '#e6dee9'],
    ['#a6c0fe', '#f68084'],
    ['#fccb90', '#d57eeb'],
    ['#e0c3fc', '#8ec5fc'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#5ee7df', '#b490ca'],
    ['#d299c2', '#fef9d7'],
    ['#ebc0fd', '#d9ded8'],
    ['#96fbc4', '#f9f586'],
    ['#fddb92', '#d1fdff'],
    ['#84fab0', '#8fd3f4'],
    ['#cfd9df', '#e2ebf0'],
    ['#a1ffce', '#faffd1'],
    ['#f6d365', '#fda085'],
    ['#fbc2eb', '#a6c1ee'],
    ['#fdcbf1', '#e6dee9'],
    ['#ffdde1', '#ee9ca7'],
    ['#2193b0', '#6dd5ed'],
    ['#ee9ca7', '#ffdde1'],
    ['#de6262', '#ffb88c'],
    ['#06beb6', '#48b1bf'],
    ['#dd5e89', '#f7bb97'],
    ['#56ab2f', '#a8e063'],
    ['#e65c00', '#f9d423'],
    ['#02aab0', '#00cdac'],
    ['#da22ff', '#9733ee'],
    ['#348f50', '#56b4d3'],
  ];

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: userData?.data?.colors?.liteTheme || '#e8edf6', // Base background color similar to screenshot
        }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              marginVertical: 10,
              paddingHorizontal: 10,
            }}
          >
            {listData.map((item, index) => {
              let listKey = '';
              let iconName = '';
              let chapActUrl = '';
              let imgUrl = '';
              let selectedBorder = 0;

              if (searchID != undefined) {
                selectedBorder = searchID == item.chapterID ? 4 : 0;
              }

              const isChildIcon =
                item.childIconID !== undefined &&
                item.childIconID !== null &&
                item.childIconID !== '';

              const isSubTypeIcon =
                item.subTypeID !== undefined &&
                item.subTypeID !== null &&
                item.subTypeID !== '';

              const hasUrlLink =
                selectedModuleItem?.urlLink != null &&
                selectedModuleItem?.urlLink != '';

              if (isChildIcon || isSubTypeIcon) {
                if (isChildIcon) {
                  listKey = item.childIconID;
                } else {
                  listKey = item.subTypeID;
                }
                imgUrl = item.iconImage;
                if (isChildIcon) {
                  iconName = item.childIconName?.replace('<br>', '') || '';
                } else {
                  iconName = item.activityName?.replace('<br>', '') || '';
                }
              } else if (hasUrlLink) {
                if (item.chapterName != null && item.chapterName != undefined) {
                  listKey = item.chapterID;
                  imgUrl = toolItems.chapterImg + item.chapterName.chapterIcon;
                  iconName = '';
                } else {
                  listKey = item.subTypeID;
                  imgUrl = toolItems.activityImg + (index + 1) + '.png';
                  iconName = item.activityName?.replace('<br>', '') || '';
                }
              } else {
                if (item.htmlUrl == 'swaLearning') {
                  listKey = item.activityID;
                  imgUrl = item.imgPath;
                  iconName = item.activityName?.replace('<br>', '') || '';
                } else {
                  if (item?.chapterIcon == null) {
                    listKey = item.chapterID;
                    imgUrl =
                      'https://swaadhyayan.com/school/assets/images/3dIcons/clsMidIcon.png';
                    iconName = item.chapterName || '';
                  } else {
                    listKey = item.chapterID;
                    imgUrl = toolItems.chapterImg + item?.chapterIcon;
                    iconName = '';
                  }
                }
              }

              if (hasUrlLink && item.chapterName != null) {
                chapActUrl = `https://swaadhyayan.com/data/e-Learning/activities/${item.activityUrl}/Unit-${item.chapterNo}.pdf`;
              }

              const handlePress = () => {
                let actUrl = '';
                if (
                  toolItems.activityUrl != null &&
                  toolItems.activityUrl != undefined &&
                  item.htmlUrl == 'VirtualTour'
                ) {
                  actUrl = item.activityPath;
                } else if (
                  toolItems.activityUrl != null &&
                  toolItems.activityUrl != undefined
                ) {
                  if (item.htmlUrl == 'Exercise') {
                    actUrl =
                      'https://swaadhyayan.com/data/e-Learning/otherActivity/' +
                      item.activityUrl +
                      '/index.html';
                  } else {
                    actUrl = item.activityPath;
                  }
                } else if (item.htmlUrl == 'swaLearning') {
                  actUrl = item.activityUrl;
                }

                getModuleActivityData(
                  item,
                  actUrl,
                  chapActUrl,
                  selectedModuleItem?.subTypeID,
                  navigation,
                );
              };

              if (isChildIcon || isSubTypeIcon) {
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={handlePress}
                    style={{
                      height: 180,
                      marginVertical: 10,
                      width: '45%',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      elevation: 9,
                      borderRadius: 16,
                      padding: 8,
                      borderBottomWidth: selectedBorder,
                      borderColor: 'red',
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        padding: 5,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          width: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Image
                          source={{ uri: imgUrl }}
                          style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      </View>

                      {iconName != '' && (
                        <View
                          style={{
                            alignItems: 'center',
                            height: 60,
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              color: SWATheam.SwaBlack,
                            }}
                          >
                            {iconName.length > 20
                              ? iconName.substring(0, 20) + '...'
                              : iconName}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }

              // Current Colors
              const colorBase = chapterColors[index % chapterColors.length][0];
              const colorLight = chapterColors[index % chapterColors.length][1];

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={handlePress}
                  style={{
                    width: '45%',
                    height: 150, // Height reduced slightly to match square look in screenshot
                    marginVertical: 12,
                  }}
                >
                  {iconName === '' ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        elevation: 9,
                        borderRadius: 16,
                        padding: 8,
                        borderBottomWidth: selectedBorder,
                        borderColor: 'red',
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          width: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Image
                          source={{ uri: imgUrl }}
                          style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                    </View>
                  ) : (
                    // ==========================================
                    // 3D GLASS EFFECT WITHOUT GRADIENT
                    // ==========================================
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: colorLight,
                        borderRadius: 20,
                        padding: 4,
                        elevation: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          // backgroundColor: colorBase,
                          borderRadius: 16,
                          borderWidth: 2,
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 10,
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={{
                              color: '#ffffff',
                              fontSize: 60,
                              fontWeight: 'bold',
                              textAlign: 'center',
                              textShadowColor: 'rgba(0, 0, 0, 0.1)',
                              textShadowOffset: {
                                width: 1,
                                height: 2,
                              },
                              textShadowRadius: 3,
                            }}
                          >
                            {index + 1}
                          </Text>
                        </View>

                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 40,
                          }}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              color: '#222222',
                              fontSize: 12,
                              fontWeight: '700',
                            }}
                          >
                            {iconName.length > 25
                              ? iconName.substring(0, 25) + '...'
                              : iconName}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

export default SubIconActivityList;

const styles = StyleSheet.create({});