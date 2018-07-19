import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, } from 'react-native';

const NearbyStops = ( { stops, selectClosest, } ) => <View style={ nearbyStopsStyles.container }>
	{ stops.map( stop => <TouchableOpacity
		key={ stop.id }
		onPress={ () => selectClosest( stop ) }
	>
		<Text style={ nearbyStopsStyles.stopName }>
			{ stop.name + ( stop.taskQuest ? ': ' + stop.taskQuest : '' ) }
		</Text>
	</TouchableOpacity> ) }
</View>;

export default NearbyStops;

const nearbyStopsStyles = StyleSheet.create( {
	container: {
		flex: 1,
		marginBottom: 20,
	},
	stopName: {
		marginTop: 10,
		fontSize: 12,
		textAlign: 'center',
	},
} );
