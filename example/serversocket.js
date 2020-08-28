function Server(btServerSocket) {
	var serverSocket = btServerSocket;
	var win = Titanium.UI.createWindow({
		title: 'ServerSocket',
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
		width: '80%',
		color: 'green',
		top: 80
	});
	startAccept.addEventListener('click', function () {
		serverSocket.startAccept(false);
	});

	var stopAcceptingConnBtn = Titanium.UI.createButton({
		title: 'Stop Accepting Connections',
		width: '80%',
		top: 20
	});
	stopAcceptingConnBtn.addEventListener('click', function () {
		serverSocket.stopAccept();
	});

	var closeBtn = Titanium.UI.createButton({
		title: 'Close Server Socket',
		width: '80%',
		top: 20
	});
	closeBtn.addEventListener('click', function () {
		serverSocket.close();
	});

	serverSocket.addEventListener('connectionReceived', function (e) {
		var btDeviceProxy = e.socket.getRemoteDevice();
		alert('Bluetooth Socket Accepted.\nDevice Name = ' + btDeviceProxy.name + '\nDevice Address = ' + btDeviceProxy.address); // eslint-disable-line no-alert
	});
	serverSocket.addEventListener('error', function (e) {
		alert('Error Occurred:\n' + e.errorMessage); // eslint-disable-line no-alert
	});

	view.add(labelTitle);
	view.add(startAccept);
	view.add(stopAcceptingConnBtn);
	view.add(closeBtn);

	win.add(view);

	win.addEventListener('close', function () {
		serverSocket.close();
	});

	return win;
}
module.exports = Server;
