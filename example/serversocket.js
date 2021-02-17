function Server(btServerSocket) {
	var serverSocket = btServerSocket;
	var win = Titanium.UI.createWindow({
		title: 'Server Socket',
		backgroundColor: 'white'
	});

	var view = Ti.UI.createView({
		backgroundColor: 'white',
		layout: 'vertical',
		top: 20
	});

	var labelTitle = Titanium.UI.createLabel({
		text: 'Test Server Socket',
		color: 'black',
		top: 20
	});

	var startAccept = Titanium.UI.createButton({
		title: 'Start Accepting Connections',
		color: 'green',
		top: 20
	});

	var stopAcceptingConnBtn = Titanium.UI.createButton({
		title: 'Stop Accepting',
		visible: 'false',
		top: 20
	});

	var closeBtn = Titanium.UI.createButton({
		title: 'Close',
		top: 20
	});

	var stateLabel = Titanium.UI.createLabel({
		text: 'State:',
		color: 'black',
		top: 20
	});

	startAccept.addEventListener('click', function () {
		var startAcceptBtnToast = Ti.UI.createNotification({
			duration: Ti.UI.NOTIFICATION_DURATION_LONG
		});
		if (stateLabel.text === 'Server socket is closed') {
			Ti.API.info('Server Socket: closed');
			startAcceptBtnToast.message = 'Cannot accept: server is closed';
			startAcceptBtnToast.show();
			return;
		}
		if (stateLabel.text === 'accepting...') {
			Ti.API.info('Server Socket: already accepting');
			startAcceptBtnToast.message = 'Server already accepting';
			startAcceptBtnToast.show();
			return;
		}
		serverSocket.startAccept(false);
		if (serverSocket.isAccepting()) {
			Ti.API.info('Server Socket: accepting');
			stateLabel.color = 'black';
			stateLabel.text = 'accepting...';
			stopAcceptingConnBtn.show();
		}
	});

	stopAcceptingConnBtn.addEventListener('click', function () {
		if (stateLabel.text === 'Stopped') {
			Ti.API.info('Server Socket: not accepting');
			var stopBtnToast = Ti.UI.createNotification({
				duration: Ti.UI.NOTIFICATION_DURATION_LONG,
				message: 'Cannot stop: server is not accepting connections'
			});
			stopBtnToast.show();
			return;
		}
		serverSocket.stopAccept();
		Ti.API.info('Server Socket: stopped');
		stateLabel.color = 'black';
		stateLabel.text = 'Stopped';
	});

	closeBtn.addEventListener('click', function () {
		var closeBtnToast = Ti.UI.createNotification({
			duration: Ti.UI.NOTIFICATION_DURATION_LONG
		});
		if (stateLabel.text === 'Server socket is closed') {
			Ti.API.info('Server Socket: already closed');
			closeBtnToast.message = 'server is already closed';
			closeBtnToast.show();
			return;
		}
		serverSocket.close();
		Ti.API.info('Server Socket: closed');
		stopAcceptingConnBtn.hide();
		stateLabel.color = 'red';
		stateLabel.text = 'Server socket is closed';
	});

	serverSocket.addEventListener('connectionReceived', function (e) {
		Ti.API.info('socket is connected');
		stateLabel.color = 'green';
		stateLabel.text = 'Connection received';
		stopAcceptingConnBtn.hide();
		var socket = e.socket;
		var btDeviceProxy = socket.getRemoteDevice();

		var dialog = Ti.UI.createAlertDialog({
			buttonNames: [ 'Ok' ],
			message: 'Bluetooth Socket Accepted.\nDevice Name = ' + btDeviceProxy.name + '\nDevice Address = ' + btDeviceProxy.address,
			title: 'Connection Received'
		});
		dialog.addEventListener('click', function (b) {
			var DataCommunication = require('data_communication.js'); // to use image transfer, make use of  'image_transfer/image_sender.js' file here.
			new DataCommunication(socket).open();
			win.close();
		});
		dialog.show();
		return;
	});

	serverSocket.addEventListener('error', function (e) {
		stopAcceptingConnBtn.hide();
		alert(e.errorMessage); // eslint-disable-line no-alert
		stateLabel.color = 'red';
		stateLabel.text = 'Error';
	});

	view.add(labelTitle);
	view.add(startAccept);
	view.add(stopAcceptingConnBtn);
	view.add(closeBtn);
	view.add(stateLabel);

	win.add(view);

	win.addEventListener('close', function () {
		serverSocket.close();
	});

	return win;
}
module.exports = Server;
