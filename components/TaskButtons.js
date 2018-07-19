import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import { apiHost, } from '../config';

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

export default TaskButtons;

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
