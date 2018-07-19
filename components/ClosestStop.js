import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, } from 'react-native';
import { findWhere, } from 'underscore';
import { apiHost, } from '../config';
import TaskButtons from './TaskButtons';

const ClosestStop = ( {
	stop, tasks,
	currentlyFetchingTasks,
	reportTask, removeStop, removeReportedTask,
} ) => <View style={ closestStopStyles.container }>
	<View style={ closestStopStyles.header }>
		<Text style={ closestStopStyles.stopName }>
			{ stop.name }{ stop.taskQuest ? ': ' + stop.taskQuest : '' }{ '  ' }
		</Text>
		{ stop.taskQuest
		? <EditReportedTask stop={ stop } removeReportedTask={ removeReportedTask } />
		: <RemoveStop stop={ stop } removeStop={ removeStop } /> }
	</View>
	{ ! currentlyFetchingTasks && ! stop.taskQuest && <TaskButtons
		tasks={ tasks }
		reportTask={ taskQuest => reportTask( stop.id, taskQuest ) }
	/> }
	<TodaysQuest stop={ stop } tasks={ tasks } />
</View>;

export default ClosestStop;

const EditReportedTask = ( { stop, removeReportedTask, } ) => <TouchableOpacity
	style={ closestStopStyles.deleteStop }
	onPress={ () => removeReportedTask( stop.id ) }
>
	<Image source={ require( '../icons/edit-solid3.png' ) } />
</TouchableOpacity>;

const RemoveStop = ( { stop, removeStop, } ) => <TouchableOpacity
	style={ closestStopStyles.deleteStop }
	onPress={ () => removeStop( stop ) }
>
	<Image source={ require( '../icons/trash-solid.png' ) } />
</TouchableOpacity>;

const TodaysQuest = ( { stop, tasks, } ) => stop.taskQuest && <Image
	source={ {
		uri: `${ apiHost }/icons/${ findWhere( tasks, { quest: stop.taskQuest, } ).reward }.png`,
	} }
	style={ taskButtonStyles.icon }
/>;

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
