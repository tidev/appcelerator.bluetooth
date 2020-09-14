let Bluetooth;

describe('appcelerator.bluetooth module constants', function () {

	it('can be required', () => {
		Bluetooth = require('appcelerator.bluetooth');

		expect(Bluetooth).toBeDefined();
	});

	describe('constants', () => {

		describe('DEVICE_TYPE_*', () => {
			it('DEVICE_TYPE_CLASSIC', () => {
				expect(Bluetooth.DEVICE_TYPE_CLASSIC).toEqual(jasmine.any(Number));
			});

			it('DEVICE_TYPE_DUAL', () => {
				expect(Bluetooth.DEVICE_TYPE_DUAL).toEqual(jasmine.any(Number));
			});

			it('DEVICE_TYPE_LE', () => {
				expect(Bluetooth.DEVICE_TYPE_LE).toEqual(jasmine.any(Number));
			});

			it('DEVICE_TYPE_UNKNOWN', () => {
				expect(Bluetooth.DEVICE_TYPE_UNKNOWN).toEqual(jasmine.any(Number));
			});
		});

		describe('SCAN_MODE_*', () => {
			it('SCAN_MODE_CONNECTABLE', () => {
				expect(Bluetooth.SCAN_MODE_CONNECTABLE).toEqual(jasmine.any(Number));
			});

			it('SCAN_MODE_CONNECTABLE_DISCOVERABLE', () => {
				expect(Bluetooth.SCAN_MODE_CONNECTABLE_DISCOVERABLE).toEqual(jasmine.any(Number));
			});

			it('SCAN_MODE_NONE', () => {
				expect(Bluetooth.SCAN_MODE_NONE).toEqual(jasmine.any(Number));
			});
		});

		it('STATE_OFF', () => {
			expect(Bluetooth.STATE_OFF).toEqual(jasmine.any(Number));
		});

		it('STATE_ON', () => {
			expect(Bluetooth.STATE_ON).toEqual(jasmine.any(Number));
		});

		it('STATE_TURNING_OFF', () => {
			expect(Bluetooth.STATE_TURNING_OFF).toEqual(jasmine.any(Number));
		});

		it('STATE_TURNING_ON', () => {
			expect(Bluetooth.STATE_TURNING_ON).toEqual(jasmine.any(Number));
		});
	});

});
