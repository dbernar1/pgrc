import { Platform, } from 'react-native';
import { connect } from 'react-redux';
import { createStore, applyMiddleware, } from 'redux';
import thunk from 'redux-thunk';
import { Constants, Location, Permissions, } from 'expo';
import { apiHost, } from './config';

const actionTypes = {
	SETUP_FAILED: 'SETUP_FAILED',
	LOCATION_CHANGED: 'LOCATION_CHANGED',
	BEGIN_FETCHING_STOPS: 'BEGIN_FETCHING_STOPS',
	FINISH_FETCHING_STOPS: 'FINISH_FETCHING_STOPS',
	BEGIN_FETCHING_TASKS: 'BEGIN_FETCHING_TASKS',
	FINISH_FETCHING_TASKS: 'FINISH_FETCHING_TASKS',
	BEGIN_REPORTING_TASK: 'BEGIN_REPORTING_TASK',
	FINISH_REPORTING_TASK: 'FINISH_REPORTING_TASK',
};

const initialState = {
	currentlyFetchingStops: true,
	errorMessage: null,
	closestStop: null,
	stops: null,
	currentlyFetchingTasks: true,
	tasks: null,
	currentlyReportingTask: false,
};

export const createMyStore = () => createStore(
	( state = initialState, action ) => {
		switch( action.type ) {
			case actionTypes.BEGIN_REPORTING_TASK:
				return {
					...state,
					currentlyReportingTask: true,
				};
			break;
			case actionTypes.FINISH_REPORTING_TASK:
				return {
					...state,
					currentlyReportingTask: false,
				};
			break;
			case actionTypes.BEGIN_FETCHING_TASKS:
				return {
					...state,
					currentlyFetchingTasks: true,
				};
			break;
			case actionTypes.FINISH_FETCHING_TASKS:
				return {
					...state,
					currentlyFetchingTasks: false,
					tasks: action.tasks,
				};
			break;
			case actionTypes.SETUP_FAILED:
				return {
					...state,
					currentlyFetchingStops: false,
					errorMessage: action.message,
				};
			break;
			case actionTypes.BEGIN_FETCHING_STOPS:
				return {
					...state,
					currentlyFetchingStops: true,
				};
			break;
			case actionTypes.FINISH_FETCHING_STOPS:
				return {
					...state,
					currentlyFetchingStops: false,
					closestStop: action.stops[ 0 ],
					stops: action.stops.slice( 1 ),
				};
			break;
			default:
				return state;
			break;
		}
	},
	applyMiddleware( thunk )
);

const getFromAPI = path => fetch(
	`${ apiHost }${ path }`,
	{},
)
.then( r => r.json() );

const postToAPI = ( path, body ) => fetch(
	`${ apiHost }${ path }`,
	{
		method: 'POST',
		body: JSON.stringify( body ),
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
	},
);

const fetchStops = ( latitude, longitude ) => dispatch => {
	dispatch( {
		type: actionTypes.BEGIN_FETCHING_STOPS,
	} );

	getFromAPI( `/stops/${ latitude }/${ longitude }` )
	.then( stops => dispatch( {
		type: actionTypes.FINISH_FETCHING_STOPS,
		stops,
	} ) )
	.catch( console.error );
};

const actions = {
	loadNearbyStops() {
		return dispatch => {
			dispatch( {
				type: actionTypes.BEGIN_FETCHING_STOPS,
			} );

			Location.getCurrentPositionAsync({})
			.then( location => getFromAPI( `/load-nearby/${ location.coords.latitude }/${ location.coords.longitude }` ) )
			.then( stops => dispatch( {
				type: actionTypes.FINISH_FETCHING_STOPS,
				stops,
			} ) )
			.catch( console.error );
		};
	},
	reportTask( stopId, taskQuest ) {
		return dispatch => {
			dispatch( {
				type: actionTypes.BEGIN_REPORTING_TASK,
			} );

			postToAPI( '/tasks', {
				stopId,
				taskQuest,
			} )
			.then( () => dispatch( {
				type: actionTypes.FINISH_REPORTING_TASK,
			} ) )
			.catch( console.error );
		};
	},
	loadTasks() {
		return dispatch => {
			dispatch( {
				type: actionTypes.BEGIN_FETCHING_TASKS,
			} );

			getFromAPI( '/tasks' )
			.then( tasks => dispatch( {
				type: actionTypes.FINISH_FETCHING_TASKS,
				tasks,
			} ) )
			.catch( console.error );
		};
	},
	setUpFetchingStopsBasedOnCurrentLocation() {
		return dispatch => {
			if (
				Platform.OS === 'android'
				&& !Constants.isDevice
			) {
				dispatch( {
					type: actionTypes.SETUP_FAILED,
					message: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
				} );
			} else {
				Permissions.askAsync( Permissions.LOCATION )
				.then( ( { status, } ) => {
					if ( status !== 'granted' ) {
						dispatch( {
							type: actionTypes.SETUP_FAILED,
							message: 'Permission to access location was denied',
						} );
					}

					return Location.watchPositionAsync(
						{
							timeInterval: 2000,
							distanceInterval: 10,
						},
						location => {
							dispatch( fetchStops(
								location.coords.latitude,
								location.coords.longitude
							) );
						}
					);
				} )
				.catch( console.error );
			}
		};
	},
};

const selectors = {};

export const connecty = ( piecesOfDataToMakeAvailable, actionsToMakeAvailable=[] ) => connect(
	( state, ownProps ) => {
		const reduxProps = {};

		piecesOfDataToMakeAvailable.forEach( key => {
			if ( key in selectors ) {
				reduxProps[ key ] = selectors[ key ]( state, ownProps );
			} else {
				reduxProps[ key ] = state[ key ];
			}
		} );

		return reduxProps;
	},
	dispatch => {
		const componentActions = {};

		actionsToMakeAvailable.forEach( actionName => componentActions[ actionName ] = function() {
			return dispatch( actions[ actionName ].apply( null, arguments ) );
		} );
		return componentActions;
	}
);
