import React from 'react';
import { apiHost } from '../config';
import { Button, } from 'react-native';
import { WebBrowser, } from 'expo';

const ViewMap = ( { latitude, longitude, } ) => <Button
	title="See map"
	onPress={ () => WebBrowser.openBrowserAsync(
		apiHost + '/map?latitude=' + latitude + '&longitude=' + longitude
	) }
/>;

export default ViewMap;
