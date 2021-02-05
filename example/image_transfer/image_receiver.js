/* eslint-disable no-alert */
function ImageReceiveComm(btSocket) {
	var win = Titanium.UI.createWindow({
		title: 'Image Receiver',
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

	var btnShowImage = Ti.UI.createButton({
		left: 5,
		right: 5,
		title: 'Show Downloaded Image'
	});
	var btnDeleteImage = Ti.UI.createButton({
		title: 'Delete Image',
		left: 8
	});
	var btnClose = Ti.UI.createButton({
		title: 'Close',
		left: 5
	});
	bottomHView.add(btnShowImage);
	bottomHView.add(btnDeleteImage);
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

	var labelTotalBytesRec = Titanium.UI.createLabel({
		text: 'Total Data Received: 0 bytes',
		color: 'black',
		top: 30
	});

	// imageView
	var imageView = Ti.UI.createImageView({
		top: 40,
		width: 200,
		height: 200,
		borderWidth: 1.0
	});

	verticalview.add(labelTitle);
	verticalview.add(labelConnectedDevice);
	verticalview.add(labelTotalBytesRec);
	verticalview.add(imageView);

	let imageFile = deleteAndCreateNewImage();

	// showImage button handling.
	btnShowImage.addEventListener('click', function () {
		let blob = imageFile.read();
		if (imageFile !== null && blob.length !== 0) {
			imageView.image = imageFile;
		} else {
			alert('No image found');
		}
	});

	// deleteImage button handling.
	btnDeleteImage.addEventListener('click', function () {
		var blob = imageFile.read();
		if (imageFile !== null && blob.length !== 0) {
			imageFile = deleteAndCreateNewImage();
			imageView.image = '';
			alert('Downloaded image deleted');
		} else {
			alert('No image found');
		}
	});

	// close button.
	btnClose.addEventListener('click', function () {
		btSocket.close();
		btnDeleteImage.color = 'Red';
		btnDeleteImage.enabled = false;
		btnShowImage.color = 'Red';
		btnShowImage.enabled = false;
		btnClose.color = 'Red';
		btnClose.enabled = false;
	});

	let totalDataRecBytes = 0;
	let totalDataRecBytesFormatted = '';
	// listener- receive
	btSocket.addEventListener('receivedData', function (e) {
		let receivedChunkSize = e.data.length;
		totalDataRecBytes += receivedChunkSize;
		totalDataRecBytesFormatted = totalDataRecBytes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		labelTotalBytesRec.text = 'Total Data Received: ' + totalDataRecBytesFormatted + ' bytes\n last chunk size: ' + receivedChunkSize + ' bytes';

		if (imageFile.write(e.data.toBlob(), true) === false) {
			alert('error while writing received-data on the image-file.');
			btnClose.fireEvent('click');
		}
	});

	// listener- error
	btSocket.addEventListener('error', function (e) {
		alert('Error: ' + e.errorMessage); // eslint-disable-line no-alert
		btnClose.fireEvent('click');
	});

	view.add(bottomHView);
	view.add(verticalview);

	win.add(view);

	return win;
}
module.exports = ImageReceiveComm;

function deleteAndCreateNewImage() {
	var imageDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'downloaded_images');
	if (!imageDir.exists()) {
		Ti.API.log('info', 'dir not exists');
		imageDir.createDirectory();
	}
	let imgFile = Ti.Filesystem.getFile(imageDir.resolve(), 'image.png');
	if (imgFile.exists()) {
		let deleteResult = imgFile.deleteFile();
	}
	if (!imgFile.exists()) {
		let createResult = imgFile.createFile();
	}
	return imgFile;
}
