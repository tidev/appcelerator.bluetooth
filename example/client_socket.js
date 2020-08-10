/* eslint-disable no-alert */
function Socket(btdevice) {
	var device = btdevice;
	var win = Titanium.UI.createWindow({
		title: 'Client Socket',
		backgroundColor: 'white'
	});

	var view = Ti.UI.createView({
		backgroundColor: 'white',
		layout: 'vertical',
		top: 20
	});

	var connectbtn = Titanium.UI.createButton({
		title: 'Connect',
		color: 'green',
		top: 20
	});

	var cancelbtn = Titanium.UI.createButton({
		title: 'Cancel',
		color: 'red',
		visible: 'false',
		top: 20
	});

	var closebtn = Titanium.UI.createButton({
		title: 'close',
		top: 20
	});

	var stateLabel = Titanium.UI.createLabel({
		text: 'State:',
		color: 'black',
		top: 20
	});

	var labelname = Titanium.UI.createLabel({
		text: device.name,
		color: 'black',
		top: 20
	});

	var labeladdress = Titanium.UI.createLabel({
		text: device.address,
		color: 'black',
		top: 20
	});

	view.add(labelname);
	view.add(labeladdress);
	view.add(connectbtn);
	view.add(cancelbtn);
	view.add(closebtn);
	view.add(stateLabel);

	win.add(view);

	var clientSocket = device.createSocket('8ce255c0-200a-11e0-ac64-0800200c9a66');

	if (bluetooth.isDiscovering()) {
		bluetooth.cancelDiscovery();
	}

	connectbtn.addEventListener('click', function () {
		var connectBtnToast = Ti.UI.createNotification({
			duration: Ti.UI.NOTIFICATION_DURATION_LONG
		});
		if (clientSocket === null) {
			Ti.API.info('Socket is null');
			connectBtnToast.message = 'Socket is null';
			connectBtnToast.show();
			return;
		}
		if (stateLabel.text === 'socket is connected') {
			Ti.API.info('Socket is already connected');
			connectBtnToast.message = 'Socket is already connected';
			connectBtnToast.show();
			return;
		}
		if (stateLabel.text === 'Socket is Disconnected') {
			Ti.API.info('Socket is Disconnected');
			connectBtnToast.message = 'Cannot connect socket: Disconnected';
			connectBtnToast.show();
			return;
		}
		clientSocket.connect();
		if (clientSocket.isConnecting()) {
			stateLabel.color = 'black';
			stateLabel.text = 'Socket is connecting';
			cancelbtn.show();
		}
	});

	clientSocket.addEventListener('connected', function (e) { // eslint-disable-line no-unused-vars
		Ti.API.info('socket is connected');
		stateLabel.color = 'green';
		stateLabel.text = 'socket is connected';
		cancelbtn.hide();
	});
	clientSocket.addEventListener('disconnected', function (e) {
		Ti.API.info(e.message);
		stateLabel.color = 'red';
		stateLabel.text = 'Socket is Disconnected';
		cancelbtn.hide();
	});

	clientSocket.addEventListener('error', function (e) {
		alert(e.errorMessage);
		stateLabel.color = 'red';
		stateLabel.text = 'Error';
		cancelbtn.hide();
	});

	cancelbtn.addEventListener('click', function () {
		if (clientSocket.isConnecting()) {
			clientSocket.cancelConnect();
			return;
		}
	});

	closebtn.addEventListener('click', function () {
		var closeBtnToast = Ti.UI.createNotification({
			duration: Ti.UI.NOTIFICATION_DURATION_LONG
		});
		if (clientSocket.isConnected()) {
			clientSocket.close();
		} else {
			Ti.API.info('Cannot Close: Socket is not connected');
			closeBtnToast.message = 'Cannot Close: Socket is not connected';
			closeBtnToast.show();
		}

	});

	win.addEventListener('close', function () {
		clientSocket.close();
	});

	return win;
}
module.exports = Socket;
