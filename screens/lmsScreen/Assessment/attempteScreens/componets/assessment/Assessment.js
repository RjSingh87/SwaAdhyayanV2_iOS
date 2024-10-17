import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AssiList from './AssList';
import SwaHeader from '../../../../../common/SwaHeader';
import { GlobleData } from '../../../../../../Store';
import Services from '../../../../../../Services';
import { apiRoot } from '../../../../../../constant/ConstentValue';
import Loader from '../../../../../common/Loader';

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
		<View style={{ flex: 1, marginTop: 24 }}>
			<SwaHeader title={'Assessment'} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
			{isLoading ?
				<Loader /> :
				<AssiList navigation={navigation} assessList={assessList} />
			}
		</View>
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