function DataComm(btSocket) {
	var win = Titanium.UI.createWindow({
		title: 'Data Communication',
		backgroundColor: 'white'
	});

	var view = Ti.UI.createView({
		layout: 'composite',
		width: '100%',
		height: '100%'
	});

	// bottom view
	var bottomHView = Ti.UI.createView({
		layout: 'horizontal',
		bottom: 10,
		width: '100%',
		height: Ti.UI.SIZE,
		backgroundColor: 'grey'
	});
	var field = Ti.UI.createTextField({
		left: 5,
		right: 5,
		color: 'white',
		backgroundColor: 'transparent',
		hintText: 'Type here',
		width: '50%'
	});
	var btnSend = Ti.UI.createButton({
		title: 'Send'
	});
	var btnClose = Ti.UI.createButton({
		title: 'Close'
	});
	bottomHView.add(field);
	bottomHView.add(btnSend);
	bottomHView.add(btnClose);

	// vertical view.
	var verticalview = Ti.UI.createView({
		layout: 'vertical',
		top: 0,
		width: '100%',
		height: '75%'
	});

	var labelTitle = Titanium.UI.createLabel({
		text: 'Test Data Communication',
		color: 'black',
		top: 10
	});

	var labelConnectedDevice = Titanium.UI.createLabel({
		text: 'Device: ' + btSocket.getRemoteDevice().name,
		color: 'black',
		top: 20
	});

	// list
	var tableData = [];
	var tableView = Ti.UI.createTableView({
		top: '30',
		height: Ti.UI.FILL,
		separatorColor: '#DBE1E2',
		data: tableData
	});
	verticalview.add(labelTitle);
	verticalview.add(labelConnectedDevice);
	verticalview.add(tableView);

	// send button handling.
	btnSend.addEventListener('click', function () {
		// no text to send.
		if (!field.hasText()) {
			return;
		}
		var labelText = field.value;
		field.value = '';

		var chatRow = Ti.UI.createTableViewRow();
		var chatLabel = Ti.UI.createLabel({
			color: 'blue',
			text: labelText,
			right: 5
		});
		chatRow.add(chatLabel);
		tableData.push(chatRow);
		tableView.data = tableData;

		var buffer = Ti.createBuffer({ value: labelText });
		btSocket.write(buffer);
	});

	// close button.
	btnClose.addEventListener('click', function () {
		btSocket.close();
		btnSend.color = 'Red';
		btnSend.enabled = false;
	});

	// listener- receive
	btSocket.addEventListener('receivedData', function (e) {
		var labelText = Ti.Codec.decodeString({ source: e.data });
		var chatRow = Ti.UI.createTableViewRow();
		var chatLabel = Ti.UI.createLabel({
			color: 'blue',
			text: labelText,
			left: 5
		});
		chatRow.add(chatLabel);
		tableData.push(chatRow);
		tableView.data = tableData;
	});

	// listener- error
	btSocket.addEventListener('error', function (e) {
		btnSend.color = 'Red';
		btnSend.enabled = false;
		alert('Error: ' + e.errorMessage); // eslint-disable-line no-alert
	});

	view.add(bottomHView);
	view.add(verticalview);

	win.add(view);

	return win;
}
module.exports = DataComm;
