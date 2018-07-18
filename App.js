import React from 'react';
import { RefreshControl, Button, ScrollView, Platform, Text, View, StyleSheet, TouchableOpacity, Image, SafeAreaView, } from 'react-native';
import { compose, lifecycle, setDisplayName, } from 'recompose';
import { Provider, } from 'react-redux';
import { createMyStore, connecty, } from './redux';
import { Constants, WebBrowser, } from 'expo';
import { apiHost, } from './config';

const store = createMyStore();

const TaskButtons = ( { tasks, reportTask, } ) => <View style={ taskButtonStyles.container }>
	{ tasks.map( task => <TouchableOpacity
		onPress={ () => reportTask( task.quest ) }
		key={ task.quest }
	><Image
		source={ {
			uri: `${ apiHost }/icons/${ task.reward }.png`,
		} }
		style={ taskButtonStyles.icon }
	/><Text style={ taskButtonStyles.hintText }>{ task.hint }</Text></TouchableOpacity> ) }
	<TouchableOpacity
		onPress={ () => reportTask( 'Poo' ) }
	><Text style={ [ taskButtonStyles.icon, taskButtonStyles.otherIcon, ] }>💩</Text><Text style={ taskButtonStyles.hintText }>Other</Text></TouchableOpacity>
</View>;

const ClosestStop = ( { stop, tasks, currentlyFetchingTasks, reportTask, removeStop, removeReportedTask, } ) => <View style={ closestStopStyles.container }>
	<View style={ closestStopStyles.header }>
		<Text style={ closestStopStyles.stopName }>
			{ stop.name }{ stop.taskQuest ? ': ' + stop.taskQuest : '' }{ '  ' }
		</Text>
		{ ! stop.taskQuest && <TouchableOpacity
			style={ closestStopStyles.deleteStop }
			onPress={ () => removeStop( stop ) }
		>
			<Image source={ require( './icons/trash-solid.png' ) } />
		</TouchableOpacity> }
	</View>
	{ ! currentlyFetchingTasks && ! stop.taskQuest && <TaskButtons
		tasks={ tasks }
		reportTask={ taskQuest => reportTask( stop.id, taskQuest ) }
	/> }
	{ stop.taskQuest && <TouchableOpacity
		onPress={ () => {
			removeReportedTask( stop.id );
		} }
	><Image source={ require( './icons/edit-solid3.png' ) } /></TouchableOpacity> }
</View>;

const NearbyStops = ( { stops, selectClosest, } ) => <View style={ nearbyStopsStyles.container }>
	{ stops.map( stop => <TouchableOpacity
		key={ stop.id }
		onPress={ () => selectClosest( stop ) }
	>
		<Text style={ nearbyStopsStyles.stopName }>{ stop.name + ( stop.taskQuest ? ': ' + stop.taskQuest : '' ) }</Text>
	</TouchableOpacity> ) }
</View>;

const ResearchReporter = ( {
	errorMessage,
	currentlyFetchingStops, closestStop, stops,
	tasks, currentlyFetchingTasks,
	reportTask, loadNearbyStops, removeStop, selectClosest,
	removeReportedTask,
} ) => <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}><ScrollView
	refreshControl={ <RefreshControl
		refreshing={ currentlyFetchingStops }
		onRefresh={ loadNearbyStops }
	/> }
>
	{ errorMessage && <Text style={ styles.paragraph }>{ errorMessage }</Text> }
	{ closestStop &&  <ClosestStop
		stop={ closestStop }
		tasks={ tasks }
		currentlyFetchingTasks={ currentlyFetchingTasks }
		reportTask={ reportTask }
		removeStop={ removeStop }
		removeReportedTask={ removeReportedTask }
	/> }
	{ stops && <NearbyStops
		stops={ stops }
		selectClosest={ selectClosest }
	/> }
	<Button
		title="See map"
		onPress={ () => WebBrowser.openBrowserAsync( 'https://pcr.bernardic.ca/pgr/map?latitude=' + closestStop.latitude + '&longitude=' + closestStop.longitude ) }
	/>
</ScrollView></SafeAreaView>;

const App = () => <Provider store={ store }>
	{ React.createElement( compose(
		connecty( [
			'errorMessage',
			'currentlyFetchingStops', 'closestStop',
			'stops', 'tasks', 'currentlyFetchingTasks',
		], [
			'setUpFetchingStopsBasedOnCurrentLocation',
			'loadTasks', 'reportTask',
			'loadNearbyStops', 'removeStop',
			'selectClosest', 'removeReportedTask',
		] ),
		lifecycle( {
			componentWillMount() {
				this.props.loadTasks();
				this.props.setUpFetchingStopsBasedOnCurrentLocation();
			},
		} ),
		setDisplayName( 'ResearchReporter' ),
	)( ResearchReporter ) ) }
</Provider>;

export default App;

const taskButtonStyles = StyleSheet.create( {
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	hintText: {
		fontSize: 8,
		textAlign: 'center',
	},
	icon: {
		width: 72,
		height: 72,
	},
	otherIcon: {
		fontSize: 24,
		marginTop: 10,
		textAlign: 'center',
		height: 62,
	},
} );

const closestStopStyles = StyleSheet.create( {
	container: {
		flex: 3,
	},
	stopName: {
		margin: 24,
		fontSize: 18,
		textAlign: 'center',
	},
	header: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	deleteStop: {
		paddingTop: 25,
	},
} );

const nearbyStopsStyles = StyleSheet.create( {
	container: {
		flex: 1,
	},
	stopName: {
		margin: 24,
		fontSize: 18,
		textAlign: 'center',
	},
} );

const styles = StyleSheet.create( {
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: Constants.statusBarHeight,
		backgroundColor: '#ecf0f1',
	},
	paragraph: {
		margin: 24,
		fontSize: 18,
		textAlign: 'center',
	},
} );
