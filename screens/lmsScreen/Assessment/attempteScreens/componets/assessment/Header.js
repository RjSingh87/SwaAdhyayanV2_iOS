import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlobleData } from '../../../../../../Store';
import { SWATheam } from '../../../../../../constant/ConstentValue';
export default function Header() {
	const { userData, manageData, attemptStore } = useContext(GlobleData);
	return (
		<View style={[styles.HeaderTop, { backgroundColor: userData.data.colors.mainTheme, }]}>
			<View style={[styles.rowHeader, { borderBottomWidth: .7, borderColor: SWATheam.SwaWhite, }]}>
				<Text style={styles.textRuning}>Asse. Name : {attemptStore.assName}</Text>
				<Text style={styles.textRuning}>Total Marks : {manageData.TotlMks}</Text>
			</View>
			<View style={[styles.rowHeader, ({ justifyContent: 'center' })]} >
				<Text style={styles.textRuning}>Attempted Question. {manageData.totalQuest}/{manageData.qNumber}</Text>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	textRuning: {
		color: "#fff"
	},
	rowHeader: {
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: "center",
		padding: 3,

	},
	HeaderTop: {

		padding: 5,
		elevation: 9
	},
});
