import React from 'react';
import { RefreshControl, ScrollView, Text, StyleSheet, SafeAreaView, } from 'react-native';
import { compose, lifecycle, setDisplayName, } from 'recompose';
import { Provider, } from 'react-redux';
import { createMyStore, connecty, } from './redux';
import { Constants, } from 'expo';
import { ViewMap, NearbyStops, ClosestStop, } from './components';

const store = createMyStore();

const ResearchReporter = ( {
	errorMessage,
	currentlyFetchingStops, closestStop, stops,
	tasks, currentlyFetchingTasks,
	reportTask, loadNearbyStops, removeStop, selectClosest,
	removeReportedTask,
} ) => <SafeAreaView style={ styles.safeArea }><ScrollView
	refreshControl={ <RefreshControl
		refreshing={ currentlyFetchingStops }
		onRefresh={ loadNearbyStops }
	/> }
>
	{ errorMessage && <Text style={ styles.paragraph }>{ errorMessage }</Text> }
	{ closestStop && <ClosestStop
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
	{ closestStop && <ViewMap latitude={ closestStop.latitude } longitude={ closestStop.longitude } /> }
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

const styles = StyleSheet.create( {
	safeArea: {
		flex: 1,
		backgroundColor: '#fff',
	},
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
