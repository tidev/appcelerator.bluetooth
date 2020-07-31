/* eslint-disable no-alert */
function Socket(btdevice) {
	var device = btdevice;
	var win = Titanium.UI.createWindow({
		title: 'Socket',
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

	var exchangeDataBtn = Titanium.UI.createButton({
		title: 'Exchange Data',
		visible: false,
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
	view.add(exchangeDataBtn);
	view.add(cancelbtn);
	view.add(closebtn);
	view.add(stateLabel);

	win.add(view);

	var socket = device.createSocket('8ce255c0-200a-11e0-ac64-0800200c9a66');

	if (bluetooth.isDiscovering()) {
		bluetooth.cancelDiscovery();
	}

	connectbtn.addEventListener('click', function () {
		if (socket === null) {
			Ti.API.info('Socket is null');
			return;
		}
		if (stateLabel.text === 'socket is connected') {
			Ti.API.info('Socket is already connected');
			alert('Socket is already connected');
			return;
		}
		if (stateLabel.text === 'Socket is Disconnected') {
			alert('Cannot connect: Socket: disconnected');
			return;
		}
		socket.connect();
		if (socket.isConnecting()) {
			stateLabel.color = 'black';
			stateLabel.text = 'Socket is connecting';
			cancelbtn.show();
		}
	});

	exchangeDataBtn.addEventListener('click', function () {
		var DataCommunication = require('data_communication.js');
		new DataCommunication(socket).open();
	});

	socket.addEventListener('connected', function (e) { // eslint-disable-line no-unused-vars
		Ti.API.info('socket is connected');
		stateLabel.color = 'green';
		stateLabel.text = 'socket is connected';
		exchangeDataBtn.show();
		cancelbtn.hide();

	});
	socket.addEventListener('disconnected', function (e) {
		Ti.API.info(e.message);
		stateLabel.color = 'red';
		stateLabel.text = 'Socket is Disconnected';
		exchangeDataBtn.hide();
		cancelbtn.hide();
	});

	socket.addEventListener('error', function (e) {
		alert(e.errorMessage);
		stateLabel.color = 'red';
		stateLabel.text = 'Error';
		exchangeDataBtn.hide();
		cancelbtn.hide();
	});

	cancelbtn.addEventListener('click', function () {
		if (socket.isConnecting()) {
			socket.cancelConnect();
			return;
		}
		if (stateLabel.text === 'socket is connected') {
			Ti.API.info('Cannot cancel: Socket is connected');
			alert('Cannot cancel: Socket is connected');
			return;
		}
		if (stateLabel.text === 'Socket is Disconnected') {
			alert('Cannot connect: Socket is disconnected');
			return;
		}

	});

	closebtn.addEventListener('click', function () {
		if (socket.isConnected()) {
			socket.close();
		} else {
			alert('Cannot Close: Socket is not connected');
		}

	});
	return win;
}
module.exports = Socket;
