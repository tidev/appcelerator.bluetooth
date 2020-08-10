var win = Titanium.UI.createWindow({
	backgroundColor: '#FFFFFF'
});

// require bluetooth
var bluetooth = require('appcelerator.bluetooth');
global.bluetooth = bluetooth;
var isAndroid = Ti.Platform.osname === 'android';
if (isAndroid) {
	var table = new Titanium.UI.createTableView({
		scrollable: true,
		top: 0,
		backgroundColor: '#FFFFFF',
		separatorColor: '#DBE1E2'
	});

	var tbl_data = [];

	var btRequiredSettingsSection = Ti.UI.createTableViewSection({ headerTitle: 'Bluetooth Prerequities',
		color: 'black' });
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
			supportedToast.show();
		} else {
			Ti.API.info('Bluetooth supported = false');
			supportedToast.message = 'Bluetooth is not supported on this device';
			supportedToast.show();
		}
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
			enabledToast.show();
			Ti.API.info('Bluetooth enabled');
		} else {
			enabledToast.message = 'Bluetooth is disabled';
			enabledToast.show();
			Ti.API.info('Bluetooth disabled');
		}
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
		var requestPermissionToast = Ti.UI.createNotification({
			duration: Ti.UI.NOTIFICATION_DURATION_LONG
		});
		if (!bluetooth.isRequiredPermissionsGranted()) {
			bluetooth.requestAccessFinePermission();
		} else {
			requestPermissionToast.message = 'Required Permission is already granted';
			requestPermissionToast.show();
			Ti.API.info('Required Permission is already granted');
		}
	});

	bluetooth.addEventListener('stateChanged', function (e) {
		Ti.API.info(e.message);
		var stateChangedToast = Ti.UI.createNotification({
			message: e.message,
			duration: Ti.UI.NOTIFICATION_DURATION_LONG
		});
		stateChangedToast.show();
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
	tbl_data.push(btRequiredSettingsSection);
	table.setData(tbl_data);

	win.add(table);
}
win.open();
