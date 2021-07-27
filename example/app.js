/* eslint-disable no-alert */
var win = Titanium.UI.createWindow({
	backgroundColor: '#FFFFFF'
});

// require bluetooth
var bluetooth = require('appcelerator.bluetooth');
const UUID = '35e1342e-dbf2-492a-8d69-496314ea364c';
global.bluetooth = bluetooth;
global.UUID = UUID;
var table = new Titanium.UI.createTableView({
	scrollable: true,
	backgroundColor: '#FFFFFF',
	separatorColor: '#DBE1E2'
});

var tbl_data = [];

var btRequiredSettingsSection = Ti.UI.createTableViewSection({
	headerTitle: 'Bluetooth Prerequities',
	color: 'black'
});

var btSupportedRow = Ti.UI.createTableViewRow({
	height: 50,
	title: 'Bluetooth Support',
	color: 'black',
	hasCheck: bluetooth.isSupported()
});

btSupportedRow.addEventListener('click', function () {
	Ti.API.info('Verifying Bluetooth support');
	var supportedToast = Ti.UI.createNotification({
		duration: Ti.UI.NOTIFICATION_DURATION_LONG
	});
	if (bluetooth.isSupported()) {
		Ti.API.info('Bluetooth supported = true');
		supportedToast.message = 'Bluetooth support available on this device';
	} else {
		Ti.API.info('Bluetooth supported = false');
		supportedToast.message = 'Bluetooth is not supported on this device';
	}
	supportedToast.show();
});

var btEnabledRow = Ti.UI.createTableViewRow({
	height: 50
});

var btEnabledlabel = Ti.UI.createLabel({
	left: 5,
	text: 'Bluetooth Enabled',
	color: 'black'
});

var btEnabledbutton = Ti.UI.createButton({
	right: 10,
	height: 40,
	width: 100,
	title: 'Check'
});

btEnabledbutton.addEventListener('click', function () {
	Ti.API.info('Checking Bluetooth status');
	var enabledToast = Ti.UI.createNotification({
		duration: Ti.UI.NOTIFICATION_DURATION_LONG
	});
	if (bluetooth.isEnabled()) {
		enabledToast.message = 'Bluetooth is enabled';
		Ti.API.info('Bluetooth enabled');
	} else {
		enabledToast.message = 'Bluetooth is disabled';
		Ti.API.info('Bluetooth disabled');
	}
	enabledToast.show();
});

var btCheckPermissions = Ti.UI.createTableViewRow({
	height: 50
});

var btPermissionlabel = Ti.UI.createLabel({
	left: 5,
	text: 'Bluetooth Permissions',
	color: 'black'
});

var btPermissionbutton = Ti.UI.createButton({
	right: 10,
	height: 40,
	width: 100,
	title: 'Check'
});

btPermissionbutton.addEventListener('click', function () {
	var permissionToast = Ti.UI.createNotification({
		duration: Ti.UI.NOTIFICATION_DURATION_LONG
	});
	if (bluetooth.isRequiredPermissionsGranted()) {
		permissionToast.message = 'Bluetooth Permissions has been granted';
		permissionToast.show();
		Ti.API.info('Permission Granted');
	} else {
		permissionToast.message = 'Bluetooth Permissions grant failed';
		permissionToast.show();
		Ti.API.info('Permission Granted Fail');
	}
});

var btRequestLocationPermission = Ti.UI.createTableViewRow({
	height: 50
});

var btRequestPermissionlabel = Ti.UI.createLabel({
	left: 5,
	text: 'Request Location Permission',
	color: 'black'
});

var btRequestPermissionbutton = Ti.UI.createButton({
	right: 10,
	height: 40,
	width: 100,
	title: 'Request'
});

btRequestPermissionbutton.addEventListener('click', function () {
	bluetooth.requestPermissions((e) => {
		let message = e.success ? 'Permission granted' : 'Permission denied';
		const toast = Ti.UI.createNotification({
			duration: Ti.UI.NOTIFICATION_DURATION_LONG,
			message: message
		});
		toast.show();
		Ti.API.info(message);
	});
});

bluetooth.addEventListener('stateChanged', function (e) {
	Ti.API.info(e.message);
	var stateChangedToast = Ti.UI.createNotification({
		message: e.message,
		duration: Ti.UI.NOTIFICATION_DURATION_LONG
	});
	stateChangedToast.show();
});

var btDevicesSection = Ti.UI.createTableViewSection({
	headerTitle: 'Bluetooth Devices',
	color: 'black'
});

var btDevicesRow = Ti.UI.createTableViewRow({
	height: 50,
	title: 'Bluetooth Paired/Scan Devices',
	color: 'black',
	hasChild: true
});

var devices = require('devices.js');

btDevicesRow.addEventListener('click', function () {
	if (!bluetooth.isEnabled()) {
		alert('Bluetooth is Disabled');
		return;
	}
	if (!bluetooth.isSupported()) {
		alert('Bluetooth is not supported');
		return;
	}
	var devicePage = new devices.deviceWin();
	devicePage.open();
});

var btServerSection = Ti.UI.createTableViewSection({
	headerTitle: 'Bluetooth Connection',
	color: 'black'
});

var btServerRow = Ti.UI.createTableViewRow({
	height: 50,
	title: 'Server',
	color: 'black',
	hasChild: true
});

btServerRow.addEventListener('click', function () {
	if (!bluetooth.isSupported()) {
		alert('Bluetooth is not supported');
		return;
	}
	if (!bluetooth.isRequiredPermissionsGranted()) {
		alert('Required permissions not granted.');
		return;
	}
	if (!bluetooth.isEnabled()) {
		alert('Bluetooth not enabled.');
		return;
	}
	var serverSocket = bluetooth.createServerSocket({
		name: 'Test_Server_Socket',
		uuid: UUID,
		secure: true
	});

	var Server = require('serversocket.js');
	var serverPage = new Server(serverSocket);
	serverPage.open();
});

btEnabledRow.add(btEnabledlabel);
btEnabledRow.add(btEnabledbutton);
btCheckPermissions.add(btPermissionlabel);
btCheckPermissions.add(btPermissionbutton);
btRequestLocationPermission.add(btRequestPermissionlabel);
btRequestLocationPermission.add(btRequestPermissionbutton);
btRequiredSettingsSection.add(btSupportedRow);
btRequiredSettingsSection.add(btEnabledRow);
btRequiredSettingsSection.add(btCheckPermissions);
btRequiredSettingsSection.add(btRequestLocationPermission);
btDevicesSection.add(btDevicesRow);
btServerSection.add(btServerRow);
tbl_data.push(btRequiredSettingsSection);
tbl_data.push(btDevicesSection);
tbl_data.push(btServerSection);
table.setData(tbl_data);

win.add(table);
win.open();
