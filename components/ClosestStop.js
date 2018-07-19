import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, } from 'react-native';
import { findWhere, } from 'underscore';
import { apiHost, } from '../config';

const ClosestStop = ( {
	stop, tasks,
	currentlyFetchingTasks,
	reportTask, removeStop, removeReportedTask,
} ) => <View style={ closestStopStyles.container }>
	<View style={ closestStopStyles.header }>
		<Text style={ closestStopStyles.stopName }>
			{ stop.name }{ stop.taskQuest ? ': ' + stop.taskQuest : '' }{ '  ' }
		</Text>
		{ ! stop.taskQuest && <RemoveStop stop={ stop } removeStop={ removeStop } /> }
	</View>
	{ ! currentlyFetchingTasks && ! stop.taskQuest && <TaskButtons
		tasks={ tasks }
		reportTask={ taskQuest => reportTask( stop.id, taskQuest ) }
	/> }
	{ ! currentlyFetchingTasks && <TodaysQuest stop={ stop } tasks={ tasks } removeReportedTask={ removeReportedTask } /> }
</View>;

export default ClosestStop;

const RemoveStop = ( { stop, removeStop, } ) => <TouchableOpacity
	style={ closestStopStyles.deleteStop }
	onPress={ () => removeStop( stop ) }
>
	<Image source={ require( '../icons/trash-solid.png' ) } />
</TouchableOpacity>;

const TodaysQuest = ( { stop, tasks, removeReportedTask, } ) => stop.taskQuest && <View style={ closestStopStyles.todaysQuestContainer }>
	<Image
		source={ {
			uri: `${ apiHost }/icons/${ findWhere( tasks, { quest: stop.taskQuest, } ).reward }.png`,
		} }
		style={ taskButtonStyles.icon }
	/>
	<EditReportedTask stop={ stop } removeReportedTask={ removeReportedTask } />
</View>;

const EditReportedTask = ( { stop, removeReportedTask, } ) => <TouchableOpacity
	style={ closestStopStyles.deleteStop }
	onPress={ () => removeReportedTask( stop.id ) }
>
	<Image source={ require( '../icons/edit-solid3.png' ) } />
</TouchableOpacity>;

const TaskButton = ( { task, reportTask, } ) => <TouchableOpacity
	onPress={ () => reportTask( task.quest ) }
>
	<Image
		source={ {
			uri: `${ apiHost }/icons/${ task.reward }.png`,
		} }
		style={ taskButtonStyles.icon }
	/>
	<Text style={ taskButtonStyles.hintText }>{ task.hint }</Text>
</TouchableOpacity>;

const OtherTasksButton = ( { reportTask, } ) => <TouchableOpacity
	onPress={ () => reportTask( 'Poo' ) }
>
	<Text style={ [ taskButtonStyles.icon, taskButtonStyles.otherIcon, ] }>💩</Text>
	<Text style={ taskButtonStyles.hintText }>Other</Text>
</TouchableOpacity>;

const TaskButtons = ( { tasks, reportTask, } ) => <View style={ taskButtonStyles.container }>
	<OtherTasksButton reportTask={ reportTask } />

	{ tasks.map( task => <TaskButton
		key={ task.quest }
		task={ task }
		reportTask={ reportTask }
	/> ) }
</View>;

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
	todaysQuestContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
} );
