let btmodule;

describe('Bluetooth init ', function () {

	beforeAll(function (done) {
		btmodule = require('appcelerator.bluetooth');

		if (btmodule.isEnabled()) {
			done();
		} else {
			setTimeout(function () {
				btmodule.addEventListener('stateChanged', function (e) {
					if (e.message === 'Bluetooth is on') {
						done();
					}
				});
				btmodule.enable();
			}, 5000);
		}
	});

	it('bluetooth is enabled', () => {
		expect(btmodule.isEnabled()).toBeTrue();
	});
});
