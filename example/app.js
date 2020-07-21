/* eslint-disable no-alert */
var win = Titanium.UI.createWindow({
	backgroundColor: '#FFFFFF'
});

// require bluetooth
var bluetooth = require('appcelerator.bluetooth');

var checkBTSupported = Ti.UI.createButton({
	title: 'Check Bluetooth support',
	top: '10%',
	height: '10%',
	width: '80%'
});

checkBTSupported.addEventListener('click', function () {
	Ti.API.info('Verifying Bluetooth support');
	if (bluetooth.isSupported()) {
		Ti.API.info('Bluetooth supported = true');
		alert('Bluetooth support available on this device');
	} else {
		Ti.API.info('Bluetooth supported = false');
		alert('Bluetooth is not supported on this device');
	}
});

var checkBTEnabled = Ti.UI.createButton({
	title: 'Check Bluetooth Status',
	top: '25%',
	height: '10%',
	width: '80%'
});

checkBTEnabled.addEventListener('click', function () {
	Ti.API.info('Checking Bluetooth status');
	if (bluetooth.isEnabled()) {
		alert('Bluetooth is enabled');
		Ti.API.info('Bluetooth enabled');
	} else {
		alert('Bluetooth is disabled');
		Ti.API.info('Bluetooth disabled');
	}
});

var checkBTPermissionsGranted = Ti.UI.createButton({
	title: 'Check Bluetooth Permissions',
	top: '40%',
	height: '10%',
	width: '80%'
});

checkBTPermissionsGranted.addEventListener('click', function () {
	Ti.API.info('Checking Bluetooth permissions');
	if (bluetooth.isRequiredPermissionsGranted()) {
		alert('Bluetooth Permissions has been granted');
		Ti.API.info('Permission Granted');
	} else {
		alert('Bluetooth Permissions grant failed');
		Ti.API.info('Permission Granted Fail');
	}
});

win.add(checkBTSupported);
win.add(checkBTEnabled);
win.add(checkBTPermissionsGranted);
win.open();
