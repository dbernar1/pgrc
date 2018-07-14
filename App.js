import React from 'react';
import { Button, ScrollView, Platform, Text, View, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import { compose, lifecycle, setDisplayName, } from 'recompose';
import { Provider, } from 'react-redux';
import { createMyStore, connecty, } from './redux';
import { Constants, } from 'expo';
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

const ClosestStop = ( { stop, tasks, currentlyFetchingTasks, reportTask, } ) => <View style={ closestStopStyles.container }>
	<Text style={ closestStopStyles.stopName }>{ stop.name }</Text>
	{ ! currentlyFetchingTasks && <TaskButtons
		tasks={ tasks }
		reportTask={ taskQuest => reportTask( stop.id, taskQuest ) }
	/> }
</View>;

const NearbyStops = ( { stops, } ) => <View style={ nearbyStopsStyles.container }>
	{ stops.map( stop => <Text key={ stop.id } style={ nearbyStopsStyles.stopName }>{ stop.name }</Text> ) }
</View>;

const ResearchReporter = ( {
	errorMessage,
	currentlyFetchingStops, closestStop, stops,
	tasks, currentlyFetchingTasks,
	reportTask, loadNearbyStops
} ) => <ScrollView>
	<Button title="Load Nearby" onPress={ loadNearbyStops } />
	{ errorMessage && <Text style={ styles.paragraph }>{ errorMessage }</Text> }
	{ currentlyFetchingStops && <Text style={ styles.paragraph }>Loading…</Text> }
	{ closestStop &&  <ClosestStop
		stop={ closestStop }
		tasks={ tasks }
		currentlyFetchingTasks={ currentlyFetchingTasks }
		reportTask={ reportTask }
	/> }
	{ stops && <NearbyStops stops={ stops } /> }
</ScrollView>;

const App = () => <Provider store={ store }>
	{ React.createElement( compose(
		connecty(
			[
				'errorMessage',
				'currentlyFetchingStops', 'closestStop', 'stops',
				'tasks', 'currentlyFetchingTasks',
			],
			[ 'setUpFetchingStopsBasedOnCurrentLocation', 'loadTasks', 'reportTask', 'loadNearbyStops', ]
		),
		lifecycle( {
			componentWillMount() {
				this.props.setUpFetchingStopsBasedOnCurrentLocation();
				this.props.loadTasks();
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
		//margin: 12,
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
