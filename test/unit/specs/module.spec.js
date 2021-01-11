let bluetooth;
const IOS = (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad');

describe('appcelerator.bluetooth ', function () {

	if (IOS) {
		return;
	}

	it('can be required', () => {
		bluetooth = require('appcelerator.bluetooth');

		expect(bluetooth).toBeDefined();
	});

	describe('methods', () => {

		describe('.isEnabled()', () => {
			it('is Function', () => {
				expect(bluetooth.isEnabled).toEqual(jasmine.any(Function));
			});

		});

		describe('.isSupported()', () => {
			it('is a Function', () => {
				expect(bluetooth.isSupported).toEqual(jasmine.any(Function));
			});

			it('returns a boolean', () => {
				expect(bluetooth.isSupported()).toEqual(jasmine.any(Boolean));
			});
		});

		describe('.isRequiredPermissionsGranted()', () => {
			it('is the Function', () => {
				expect(bluetooth.isRequiredPermissionsGranted).toEqual(jasmine.any(Function));
			});

			it('returns the boolean', () => {
				expect(bluetooth.isRequiredPermissionsGranted()).toEqual(jasmine.any(Boolean));
			});
		});

		describe('getAddress()', () => {
			it('address is a String property', () => {
				expect(bluetooth.address).toEqual(jasmine.any(String));
			});
		});

		describe('getName()', () => {
			it('getName returns a string', () => {
				expect(bluetooth.getName()).toEqual(jasmine.any(String));
			});

			it('name is a String property', () => {
				expect(bluetooth.name).toEqual(jasmine.any(String));
			});

			it('getName is a function', () => {
				expect(bluetooth.getName).toEqual(jasmine.any(Function));
			});
		});

		describe('getRemoteDevice', () => {
			it('getRemoteDevice is a function', () => {
				expect(bluetooth.getRemoteDevice).toEqual(jasmine.any(Function));
			});
		});

		describe('.checkBluetoothAddress', () => {
			it('checkBluetoothAddress is a function', () => {
				expect(bluetooth.checkBluetoothAddress).toEqual(jasmine.any(Function));
			});

			it('checkBluetoothAddress returns a boolean', () => {
				expect(bluetooth.checkBluetoothAddress('abcd')).toEqual(jasmine.any(Boolean));
			});
		});

		it('getPairedDevices is a function', () => {
			expect(bluetooth.getPairedDevices).toEqual(jasmine.any(Function));
		});

		describe('Discovery', () => {
			it('startDiscovery is a function', () => {
				expect(bluetooth.startDiscovery).toEqual(jasmine.any(Function));
			});

			it('startDiscovery returns a boolean', () => {
				expect(bluetooth.startDiscovery()).toEqual(jasmine.any(Boolean));
			});

			it('isDiscovering is a function', () => {
				expect(bluetooth.isDiscovering).toEqual(jasmine.any(Function));
			});

			it('isDiscovering returns a boolean', () => {
				expect(bluetooth.isDiscovering()).toEqual(jasmine.any(Boolean));
			});

			it('cancelDiscovery is a function', () => {
				expect(bluetooth.cancelDiscovery).toEqual(jasmine.any(Function));
			});
		});

		describe('get scan mode', () => {
			it('getScanMode is a function', () => {
				expect(bluetooth.getScanMode).toEqual(jasmine.any(Function));
			});

			it('getScanMode returns a number', () => {
				expect(bluetooth.getScanMode()).toEqual(jasmine.any(Number));
			});

			it('scan mode is a property', () => {
				expect(bluetooth.scanMode).toEqual(jasmine.any(Number));
			});
		});

		describe('get state', () => {
			it('getState is a function', () => {
				expect(bluetooth.getState).toEqual(jasmine.any(Function));
			});

			it('getState returns a number', () => {
				expect(bluetooth.getState()).toEqual(jasmine.any(Number));
			});

			it('state is a property', () => {
				expect(bluetooth.state).toEqual(jasmine.any(Number));
			});
		});

		it('ensureDiscoverable is a function', () => {
			expect(bluetooth.ensureDiscoverable).toEqual(jasmine.any(Function));
		});

		it('requestAccessFinePermission is a function', () => {
			expect(bluetooth.requestAccessFinePermission).toEqual(jasmine.any(Function));
		});

		describe('server socket', () => {
			it('createServerSocket is a function', () => {
				expect(bluetooth.createServerSocket).toEqual(jasmine.any(Function));
			});

			it('createServerSocket returns a object', () => {
				expect(bluetooth.createServerSocket({
					name: 'Test_Server_Socket',
					uuid: '8ce255c0-200a-11e0-ac64-0800200c9a66',
					secure: true
				})).toEqual(jasmine.any(Object));
			});
		});
	});
});
