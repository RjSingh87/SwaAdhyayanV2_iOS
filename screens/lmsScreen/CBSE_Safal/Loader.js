import { StyleSheet, Text, View, Modal, Image } from 'react-native';
export default function Loader() {
	return (
		<>
			<View>
				<Modal animationType="slide" visible={true} transparent={true} >
					<View style={styles.loaderBack}>
						<Image style={{ resizeMode: 'contain', width: 45, height: 45, alignSelf: "center", margin: 10 }}
							source={require('../../assets/loading.gif')} />
						<Text>Please wait few second</Text>
					</View>
				</Modal>
			</View>
		</>
	);
}
const styles = StyleSheet.create({
	loaderBack: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: 'rgba(244, 239, 239, 0.5)',
	}
});