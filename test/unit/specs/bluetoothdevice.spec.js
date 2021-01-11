let bluetooth;
let device;

describe('BluetoothDevice ', function () {

	it('bluetooth required', () => {
		bluetooth = require('appcelerator.bluetooth');

		expect(bluetooth).toBeDefined();
	});

	it('bluetoothdevice required', () => {
		device = bluetooth.getRemoteDevice('3C:5A:B4:01:02:05');

		expect(device).toBeDefined();
	});

	describe('methods', () => {

		describe('get address', () => {
			it('getAddress is a Function', () => {
				expect(device.getAddress).toEqual(jasmine.any(Function));
			});

			it('getAddress returns a String', () => {
				expect(device.getAddress()).toEqual(jasmine.any(String));
			});

			it('address is a Property', () => {
				expect(device.address).toEqual(jasmine.any(String));
			});
		});

		it('getName is a Function', () => {
			expect(device.getName).toEqual(jasmine.any(Function));
		});

		describe('get type', () => {
			it('getType is a Function', () => {
				expect(device.getType).toEqual(jasmine.any(Function));
			});

			it('type is a Property', () => {
				expect(device.type).toEqual(jasmine.any(Number));
			});

			it('getType returns a Number', () => {
				expect(device.getType()).toEqual(jasmine.any(Number));
			});
		});

		it('getUUIDs is a Function', () => {
			expect(device.getUUIDs).toEqual(jasmine.any(Function));
		});

		describe('fetch uuids', () => {
			it('fetchUUIDs is a Function', () => {
				expect(device.fetchUUIDs).toEqual(jasmine.any(Function));
			});

			it('fetchUUIDs returns a Boolean', () => {
				expect(device.fetchUUIDs()).toEqual(jasmine.any(Boolean));
			});
		});

		describe('create socket', () => {
			it('createSocket is a Function', () => {
				expect(device.createSocket).toEqual(jasmine.any(Function));
			});

			it('create socket returns the Object.', () => {
				expect(device.createSocket('8ce255c0-200a-11e0-ac64-0800200c9a66')).toEqual(jasmine.any(Object));
			});
		});
	});
});
