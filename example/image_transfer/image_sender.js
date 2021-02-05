/* eslint-disable no-alert */
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

	var btnSend = Ti.UI.createButton({
		title: 'Send Image',
		top: 30
	});

	var btnClose = Ti.UI.createButton({
		title: 'Close',
		top: 40
	});

	verticalview.add(labelTitle);
	verticalview.add(labelConnectedDevice);
	verticalview.add(btnSend);
	verticalview.add(btnClose);

	// send button handling.
	btnSend.addEventListener('click', function () {
		Ti.Media.openPhotoGallery({
			allowMultiple: false,
			mediaTypes: [ Titanium.Media.MEDIA_TYPE_PHOTO ],
			success: function (e) {
				var myBlob = e.media;
				var blobStream = Ti.Stream.createStream({ source: myBlob, mode: Ti.Stream.MODE_READ });
				var newBuffer = Ti.createBuffer({ length: myBlob.length });
				var bytes = 0;
				do {
					bytes = blobStream.read(newBuffer);
				} while (bytes > 0);
				btSocket.write(newBuffer);
				alert('Image data queued for send. Size = ' + myBlob.length + 'bytes');
			},
			error: function (e) {
				alert('error opening image: ' + e);
			}
		});
	});

	// close button.
	btnClose.addEventListener('click', function () {
		btSocket.close();
		btnSend.color = 'Red';
		btnSend.enabled = false;
		btnClose.color = 'Red';
		btnClose.enabled = false;
	});

	// listener- error
	btSocket.addEventListener('error', function (e) {
		btnSend.color = 'Red';
		btnSend.enabled = false;
		alert('Error: ' + e.errorMessage); // eslint-disable-line no-alert
	});

	view.add(verticalview);

	win.add(view);

	return win;
}
module.exports = DataComm;
