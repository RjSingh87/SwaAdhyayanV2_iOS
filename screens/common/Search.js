import { StyleSheet, Text, View, SafeAreaView, StatusBar, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { GlobleData } from '../../Store'
import Services from '../../Services'
import { apiRoot, SWATheam } from '../../constant/ConstentValue'
import AntDesign from 'react-native-vector-icons/AntDesign';

const Search = () => {
    const statusBarHeight = StatusBar.currentHeight
    const { userData } = useContext(GlobleData)
    const [searchString, setSearchString] = useState("")

    function searchMyKeywords() {
        const payload =
        {
            "schoolID": userData.data.schoolID,
            "userTypeID": userData.data.userTypeID,
            "userRefID": userData.data.userRefID,
            "academicYear": userData.data.academicYear,
            "searchString": searchString,
        }
        if (userData.data.userTypeID == 5 || userData.data.userTypeID == 6) {
            payload["classID"] = userData.data.classID
            payload["transYear"] = userData.data.transYear
        }
        Services.post(apiRoot.searchSwaadhyayan, payload)
            .then((res) => {
                if (res.status == "success") {
                    setSearchString("")

                } else if (res.status == "error") {
                    alert(res.message)
                }
            })
            .catch((err) => {

            })
            .finally(() => {

            })


    }


    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ flex: 1, backgroundColor: 'lightblue', alignItems: 'center', marginTop: statusBarHeight, paddingTop: 20 }}>
                <View style={{ borderWidth: 1, borderColor: userData.data.colors.mainTheme, borderRadius: 6, backgroundColor: '#fff', width: '75%', flexDirection: 'row', height: 50 }}>
                    <TextInput type={"text"} placeholder='Search here' value={searchString} style={{ flex: 1, borderRadius: 6, backgroundColor: SWATheam.SwaWhite }}
                        onChangeText={val => {
                            setSearchString(val)
                        }}
                    />
                    <TouchableOpacity style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: userData.data.colors.mainTheme }} onPress={() => searchMyKeywords()}>
                        <AntDesign name="search1" color={SWATheam.SwaBlue} size={30} />
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>
    )
}

export default Search

const styles = StyleSheet.create({})