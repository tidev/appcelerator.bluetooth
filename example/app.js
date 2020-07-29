/* eslint-disable no-alert */
var win = Titanium.UI.createWindow({
	backgroundColor: '#FFFFFF'
});

// require bluetooth
var bluetooth = require('appcelerator.bluetooth');
global.bluetooth = bluetooth;
var isAndroid = Ti.Platform.osname === 'android';
if (isAndroid) {
	var checkBTSupported = Ti.UI.createButton({
		title: 'Check Bluetooth support',
		top: '5%',
		height: '10%',
		width: '80%'
	});

	var devices = require('devices.js');
	var devicePage = new devices.deviceWin();

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
		top: '17%',
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
		top: '29%',
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

	bluetooth.addEventListener('stateChanged', function (e) {
		Ti.API.info(e.message);
		alert(e.message);
	});

	var requestLocationPermissionBtn = Ti.UI.createButton({
		title: 'Request Permission',
		top: '41%',
		height: '10%',
		width: '80%'
	});

	requestLocationPermissionBtn.addEventListener('click', function () {
		if (!bluetooth.isRequiredPermissionsGranted()) {
			bluetooth.requestAccessFinePermission();
		} else {
			alert('Required Permission is already granted');
			Ti.API.info('Required Permission is already granted');
		}
	});

	var makeDiscoverBtn = Ti.UI.createButton({
		title: 'Make Device Discoverable',
		top: '53%',
		height: '10%',
		width: '80%'
	});

	makeDiscoverBtn.addEventListener('click', function () {
		bluetooth.ensureDiscoverable();
	});

	var deviceInfo = Ti.UI.createButton({
		title: 'Paired/Scan Devices',
		top: '65%',
		height: '10%',
		width: '80%'
	});

	deviceInfo.addEventListener('click', function () {
		devicePage.open();
	});

	var serverBtn = Ti.UI.createButton({
		title: 'SERVER',
		top: '85%',
		height: '10%',
		width: '80%'
	});

	serverBtn.addEventListener('click', function () {

		if (!bluetooth.isSupported()) {
			alert('bluetooth not supported on this device.');
			return;
		}

		if (!bluetooth.isRequiredPermissionsGranted()) {
			alert('required permissions not granted.');
			return;
		}

		if (!bluetooth.isEnabled()) {
			alert('bluetooth not enabled.');
			return;
		}

		var serverSocket = bluetooth.createServerSocket({
			name: 'Test_Server_Socket',
			uuid: '8ce255c0-200a-11e0-ac64-0800200c9a66',
			secure: true
		});

		var Server = require('serversocket.js');
		var serverPage = new Server(serverSocket);
		serverPage.open();
	});

	win.add(checkBTSupported);
	win.add(checkBTEnabled);
	win.add(checkBTPermissionsGranted);
	win.add(makeDiscoverBtn);
	win.add(requestLocationPermissionBtn);
	win.add(deviceInfo);
	win.add(serverBtn);
}
win.open();
