import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { SWATheam } from '../../constant/ConstentValue'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { GlobleData } from '../../Store'

const SelectionBox = ({ getListItem, type, placeholder, selectedField }) => {
    const { userData } = useContext(GlobleData)

    return (
        <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 4, borderColor: userData.data.colors.hoverTheme, backgroundColor: SWATheam.SwaWhite, marginVertical: 5, padding: 4 }}
            onPress={() => getListItem(type)}
        >
            <View style={{ flex: 1, padding: 6, }}>
                <Text style={{ color: SWATheam.SwaGray }}>{selectedField != null ? selectedField : placeholder}</Text>
            </View>
            <View style={{ width: 45, justifyContent: 'center', alignItems: 'center' }}>
                <AntDesign name="down" size={15} color={SWATheam.SwaGray} />
            </View>
        </TouchableOpacity>
    )
}

export default SelectionBox

const styles = StyleSheet.create({})