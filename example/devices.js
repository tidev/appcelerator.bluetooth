function deviceWin() {
	var win = Titanium.UI.createWindow({
		backgroundColor: '#FFFFFF',
		title: 'Bluetooth Devices'
	});

	var table = new Titanium.UI.createTableView({
		scrollable: true,
		top: 0,
		backgroundColor: '#FFFFFF',
		separatorColor: '#DBE1E2'
	});

	var tbl_data = [];
	var deviceFoundRow;
	var clientSocket = require('client_socket.js');

	var btDeviceDiscoverableSection = Ti.UI.createTableViewSection({
		headerTitle: 'Device Discoverable',
		color: 'black'
	});

	var btDeviceDiscoverableRow = Ti.UI.createTableViewRow({
		height: 50
	});

	var btDeviceDiscoverablelabel = Ti.UI.createLabel({
		left: 5,
		text: 'Make Device Discoverable',
		color: 'black'
	});

	var deviceDiscoverableButton = Ti.UI.createButton({
		right: 10,
		height: 40,
		width: 100,
		title: 'Click'
	});

	deviceDiscoverableButton.addEventListener('click', function () {
		var deviceDiscoverableToast = Ti.UI.createNotification({
			duration: Ti.UI.NOTIFICATION_DURATION_LONG
		});
		var mode = bluetooth.scanMode;
		if (mode === bluetooth.SCAN_MODE_CONNECTABLE_DISCOVERABLE) {
			deviceDiscoverableToast.message = 'Device is visible to the nearby devices';
			deviceDiscoverableToast.show();
			Ti.API.info('This Device is visible to the nearby devices');
		} else {
			bluetooth.ensureDiscoverable();
		}
	});

	var btPairedDevicesSection = Ti.UI.createTableViewSection({
		headerTitle: 'Paired Devices',
		color: 'black'
	});

	var dict = bluetooth.getPairedDevices();
	Ti.API.info('Paired Devices are:');
	var deviceInfoRow;
	if (dict.success) {
		var pdevices = dict.pairedDevices;
		for (var index = 0; index < pdevices.length; index++) {
			var device = pdevices[index];
			deviceInfoRow = Ti.UI.createTableViewRow({
				title: '\n' + device.name + '\n' + device.address,
				id: device.address,
				color: 'black',
				hasChild: true
			});
			Ti.API.info(device.name + '\n' + device.address);
			btPairedDevicesSection.add(deviceInfoRow);
		}
	} else {
		deviceInfoRow = Ti.UI.createTableViewRow({
			title: dict.message,
			color: 'black'
		});
		btPairedDevicesSection.add(deviceInfoRow);
	}

	btPairedDevicesSection.addEventListener('click', function (e) {
		var indexRow = e.source;
		if (indexRow.hasChild) {
			var clientSocketPage = new clientSocket(bluetooth.getRemoteDevice(indexRow.id));
			clientSocketPage.open();
		}
	});

	var btAvailableDevicesSection = Ti.UI.createTableViewSection({
		headerTitle: 'Available Devices',
		color: 'black'
	});

	var btAvailableDevicesIndicatorRow = Ti.UI.createTableViewRow({
		height: 50
	});

	var activityIndicator = Ti.UI.createActivityIndicator({
		color: '#9F9696',
		style: Ti.UI.ActivityIndicatorStyle.DARK,
		right: 10,
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE
	});

	var deviceDiscoverableSwitch = Ti.UI.createSwitch({
		left: 5,
		height: 40,
		width: 100,
		style: Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
		titleOn: 'Stop',
		titleOff: 'Scan',
		value: false,
	});

	deviceDiscoverableSwitch.addEventListener('change', function () {
		if (!deviceDiscoverableSwitch.value) {
			if (bluetooth.isDiscovering()) {
				bluetooth.cancelDiscovery();
			}
			return;
		}
		var numRows = btDevicesListSection.rowCount;
		if (!bluetooth.isRequiredPermissionsGranted()) {
			alert('Required Permission are not granted'); // eslint-disable-line no-alert
			deviceDiscoverableSwitch.value = false;
			return;
		}
		if (numRows === 0) {
			bluetooth.startDiscovery();
			return;
		} else {
			var rowarray = btDevicesListSection.rows;
			for (var i = 0; i < numRows; i++) {
				table.deleteRow(rowarray[i]);
			}
			bluetooth.startDiscovery();
			return;
		}
	});

	var discoveryStartedListener = () => {
		Ti.API.info('Discovery Started');
		activityIndicator.show();
		var discoveryStartedToast = Ti.UI.createNotification({
			message: 'Discovery is Started',
			duration: Ti.UI.NOTIFICATION_DURATION_SHORT
		});
		discoveryStartedToast.show();
	};

	bluetooth.addEventListener('discoveryStarted', discoveryStartedListener);

	var discoveryFinishedListener = () => {
		Ti.API.info('Discovery Finished');
		activityIndicator.hide();
		deviceDiscoverableSwitch.value = false;
		deviceDiscoverableSwitch.title = 'Scan';
		var discoveryFinishedToast = Ti.UI.createNotification({
			message: 'Discovery is Finished',
			duration: Ti.UI.NOTIFICATION_DURATION_SHORT
		});
		discoveryFinishedToast.show();
	};

	bluetooth.addEventListener('discoveryFinished', discoveryFinishedListener);

	var btDevicesListSection = Ti.UI.createTableViewSection();

	var deviceFoundListener = (e) => {
		Ti.API.info('Device Found');
		var device = e.device;
		deviceFoundRow = Ti.UI.createTableViewRow({
			title: '\n' + device.name + '\n' + device.address,
			color: 'black',
			id: device.address,
			hasChild: true
		});
		Ti.API.info(device.name + '\n' + device.address);
		table.appendRow(deviceFoundRow);
	};

	bluetooth.addEventListener('deviceFound', deviceFoundListener);

	btDevicesListSection.addEventListener('click', function (e) {
		var indexRow = e.source;
		if (indexRow.hasChild) {
			var clientSocketPage = new clientSocket(bluetooth.getRemoteDevice(indexRow.id));
			clientSocketPage.open();
		}
	});

	win.addEventListener('close', function () {
		tbl_data = [];
		if (bluetooth.isDiscovering()) {
			bluetooth.cancelDiscovery();
		}
		bluetooth.removeEventListener('discoveryStarted', discoveryStartedListener);
		bluetooth.removeEventListener('discoveryFinished', discoveryFinishedListener);
		bluetooth.removeEventListener('deviceFound', deviceFoundListener);
	});

	btDeviceDiscoverableRow.add(btDeviceDiscoverablelabel);
	btDeviceDiscoverableRow.add(deviceDiscoverableButton);
	btAvailableDevicesIndicatorRow.add(activityIndicator);
	btAvailableDevicesIndicatorRow.add(deviceDiscoverableSwitch);
	btDeviceDiscoverableSection.add(btDeviceDiscoverableRow);
	btAvailableDevicesSection.add(btAvailableDevicesIndicatorRow);
	tbl_data.push(btDeviceDiscoverableSection);
	tbl_data.push(btPairedDevicesSection);
	tbl_data.push(btAvailableDevicesSection);
	tbl_data.push(btDevicesListSection);
	table.setData(tbl_data);
	win.add(table);
	return win;
}
exports.deviceWin = deviceWin;
