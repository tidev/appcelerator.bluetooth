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

	});
});
