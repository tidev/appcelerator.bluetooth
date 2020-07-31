/* eslint-disable no-alert */
function deviceWin() {
	var win = Titanium.UI.createWindow({
		backgroundColor: '#FFFFFF',
		title: 'Scan Devices',
		onBack: function () {
			tableView.data = [];
			win.close();
		}
	});

	var clientSocket = require('client_socket.js');

	var deviceInfoRow;
	var tableData = [];
	var device;
	var count = 0;

	var tableView = Ti.UI.createTableView({
		top: '25%',
		separatorColor: '#DBE1E2',
		data: tableData
	});

	var getPairedDevices = Ti.UI.createButton({
		title: 'Show Paired devices',
		top: 0,
		height: '10%',
		width: '50%'
	});

	var scanDevice = Ti.UI.createButton({
		title: 'Start Scanning',
		top: '10%',
		height: '10%',
		width: '50%'
	});

	getPairedDevices.addEventListener('click', function () {
		var dict = bluetooth.getPairedDevices();
		if (dict.success) {
			tableData = [];
			var pdevices = dict.pairedDevices;
			for (var index = 0; index < pdevices.length; index++) {
				device = pdevices[index];
				deviceInfoRow = Ti.UI.createTableViewRow({
					title: '\n' + device.name + '\n' + device.address,
					color: 'black'
				});
				tableData.push(deviceInfoRow);
			}
			tableView.data = tableData;
		} else {
			alert(dict.message);
		}
	});

	scanDevice.addEventListener('click', function () {
		if (!bluetooth.isRequiredPermissionsGranted()) {
			bluetooth.requestAccessFinePermission();
			return;
		}
		if (count !== 0) {
			bluetooth.cancelDiscovery();
			return;
		}
		if (bluetooth.startDiscovery()) {
			tableData = [];
			tableView.data = tableData;
			count++;
			scanDevice.title = 'Stop Scanning';
			return;
		}
	});

	bluetooth.addEventListener('discoveryStarted', function () {
		Ti.API.info('Discovery Started');
		alert('Device discovery is started');
	});

	bluetooth.addEventListener('discoveryFinished', function () {
		Ti.API.info('Discovery Finished');
		alert('Device discovery is finished');
		scanDevice.title = 'Start Scanning';
		count = 0;
	});

	bluetooth.addEventListener('deviceFound', function (e) {
		Ti.API.info('Device Found');
		device = e.device;
		deviceInfoRow = Ti.UI.createTableViewRow({
			title: '\n' + device.name + '\n' + device.address,
			color: 'black'
		});
		deviceInfoRow.addEventListener('click', function () {
			var clientSocketPage = new clientSocket(e.device);
			clientSocketPage.open();
		});
		tableData.push(deviceInfoRow);
		tableView.data = tableData;

	});

	win.add(getPairedDevices);
	win.add(scanDevice);
	win.add(tableView);
	return win;
}
exports.deviceWin = deviceWin;
