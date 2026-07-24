import React, { useContext, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import AssiList from './AssList';
import SwaHeader from '../../../../../common/SwaHeader';
import { GlobleData } from '../../../../../../Store';
import Services from '../../../../../../Services';
import { apiRoot } from '../../../../../../constant/ConstentValue';
import Loader from '../../../../../common/Loader';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const Assessment = ({ navigation }) => {
	const insets = useSafeAreaInsets();
	const { userData } = useContext(GlobleData)
	const [isLoading, setIsLoading] = useState(true)
	const [assessList, setAssessList] = useState()

	// useEffect(()=>{
	// 	getGenerateAsslist()

	// },[])

	useEffect(() => {
		getGenerateAsslist()
		const goBack = navigation.addListener('focus', () => {
			getGenerateAsslist()
			StatusBar.setHidden(false);
			Orientation.lockToPortrait();
		});
		return goBack
	}, [navigation])

	function getGenerateAsslist() {
		setIsLoading(true)
		const payload = {
			"schoolID": userData.data.schoolID,
			"userRefID": userData.data.userRefID,
		}
		Services.post(apiRoot.getGeneratedAssessmentList, payload)
			.then((res) => {
				// console.log(res, 'check res---------')
				if (res.status == "success") {
					setAssessList(res.data)
					setIsLoading(false)
				} else {
					alert(res.message)
					if (navigation.canGoBack()) {
						navigation.goBack();
					} else {
						navigation.navigate('home');
					}
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
		<SafeAreaProvider style={{ flex: 1, paddingTop: insets.top, backgroundColor: userData.data.colors.mainTheme, marginBottom: insets.bottom }}>
			<SwaHeader title={'Assessment'} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
			{isLoading ?
				<Loader /> :
				<AssiList navigation={navigation} assments={assessList} />
			}
		</SafeAreaProvider>
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