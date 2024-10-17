import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SWATheam } from '../../../../../../constant/ConstentValue';

export default function Instructions() {

	return (
		<View>
			<View style={styles.rowItems}>
				<Text style={styles.textBolds}>General Instructions:</Text>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity style={styles.buttonToggle}>
						<Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>English</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.buttonToggle}>
						<Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>Hindi</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.insrTextHolder}>
				<View style={styles.rowLins}>
					<Text style={{ width: 20, color: SWATheam.SwaBlack }}>1.</Text>
					<Text style={styles.textLine}>
						Total duration of examination is 60 minutes. (20 minutes extra for every 60 minutes (1 hour) of the examination time for candidates with disability eligible for compensatory time).
					</Text>
				</View>
			</View>
			<View style={styles.insrTextHolder}>
				<View style={styles.rowLins}>
					<Text style={{ width: 20, color: SWATheam.SwaBlack }}>2.</Text>
					<Text style={styles.textLine}>
						The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.

					</Text>
				</View>
			</View>
		</View>

	);
}
const styles = StyleSheet.create({
	headersInst: {
		backgroundColor: "#27a2d4",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 8,
		elevation: 5
	},
	textBolds: {
		fontSize: 14,
		fontWeight: "bold",
		color: SWATheam.SwaBlack
	},
	rowLins: {
		flexDirection: 'row',
		marginTop: 5
	},
	insrTextHolder: {
		margin: 10,
		borderWidth: 1,
		borderColor: "#f4f4ec",
		padding: 5,
	},
	textLine: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		textAlign: "justify",
		color: SWATheam.SwaBlack

	},
	rowItems: {
		flexDirection: 'row',
		margin: 8,
		justifyContent: "space-between",
		alignItems: 'center'
	},
	buttonToggle: {
		borderWidth: 1,
		borderColor: "#bbbbbb",
		margin: 3,
		width: 70,
		borderRadius: 50,
		padding: 4,
		backgroundColor: "#dddddd"
	}
});