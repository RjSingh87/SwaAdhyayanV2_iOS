import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AssiList from './AssList';
import SwaHeader from '../../../../../common/SwaHeader';
import { GlobleData } from '../../../../../../Store';
import Services from '../../../../../../Services';
import { apiRoot, SWATheam } from '../../../../../../constant/ConstentValue';
import Loader from '../../../../../common/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';

const Assessment = ({ navigation }) => {
	const { userData } = useContext(GlobleData)
	const [isLoading, setIsLoading] = useState(false)
	const [assessList, setAssessList] = useState()

	useEffect(() => {
		getGenerateAsslist()
	}, [])

	function getGenerateAsslist() {
		setIsLoading(true)
		const payload = {
			"schoolCode": userData.data.schoolCode,
			"userRefID": userData.data.userRefID,
		}
		console.log(payload)
		Services.post(apiRoot.getGeneratedAssessmentList, payload)
			.then((res) => {
				if (res.status == "success") {
					setAssessList(res.data)
					setIsLoading(false)
				} else {
					alert(res.message)
					navigation.goBack()
				}
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}
	function onClickLeftIcon() {
		navigation.goBack()
	}
	function onClickRightIcon() {
		setIsInstruction(true)
	}
	return (
		<SafeAreaView edges={['left', 'top', 'right']} style={{ backgroundColor: userData?.data?.colors?.mainTheme, flex: 1, marginTop: Platform.OS == "ios" ? 0 : 20 }}>
			<View style={{ flex: 1, backgroundColor: SWATheam.SwaWhite, marginTop: 0 }}>
				<SwaHeader title={'Assessment'} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
				{isLoading ?
					<Loader /> :
					<AssiList navigation={navigation} assessList={assessList} />
				}
			</View>
		</SafeAreaView>
	);
}
export default Assessment
const styles = StyleSheet.create({
	mainScreen: {
		backgroundColor: '#d7ecff',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		margin: 5,
		marginBottom: 10,
		height: "100%",
		borderWidth: 1,
		borderColor: '#999',
		borderRadius: 10,
	},
});