let bluetooth;
let device;
let socket;

describe('BluetoothSocket ', function () {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 2 * 60 * 1000; // 2min

	it('bluetooth required', () => {
		bluetooth = require('appcelerator.bluetooth');

		expect(bluetooth).toBeDefined();
	});

	it('bluetoothdevice required', () => {
		device = bluetooth.getRemoteDevice('3C:5A:B4:01:02:05');

		expect(device).toBeDefined();
	});

	it('bluetoothsocket required', () => {
		socket = device.createSocket('8ce255c0-200a-11e0-ac64-0800200c9a66');

		expect(socket).toBeDefined();
	});

	describe('methods', () => {

		describe('connect operations', () => {
			it('connect is a Function', () => {
				expect(socket.connect).toEqual(jasmine.any(Function));
			});

			it('isConnecting is a function', () => {
				expect(socket.isConnecting).toEqual(jasmine.any(Function));
			});

			it('cancel connect is a Function', () => {
				expect(socket.cancelConnect).toEqual(jasmine.any(Function));
			});

			it('close is a Function', () => {
				expect(socket.close).toEqual(jasmine.any(Function));
			});

			it('cancelConnect cancels the connecting operation', () => {
				socket.connect();

				expect(socket.isConnecting()).toBeTrue();

				socket.cancelConnect();

				expect(socket.isConnecting()).toBeFalse();
			});

			it('attempting connect for a random uuid fires the error event', done => {
				socket.on('error', () => {
					done();
				});

				socket.connect();
			});
		});

		describe('isConnected', () => {
			it('isConnected is a function', () => {
				expect(socket.isConnected).toEqual(jasmine.any(Function));
			});

			it('isConnected should return false', () => {
				expect(socket.isConnected()).toBeFalse();
			});
		});

		describe('Remote Device ', () => {
			it('getRemoteDevice is a Function', () => {
				expect(socket.getRemoteDevice).toEqual(jasmine.any(Function));
			});

			it('getRemoteDevice returns object', () => {
				expect(socket.getRemoteDevice()).toEqual(jasmine.any(Object));
			});
		});

		it('write is a Function', () => {
			expect(socket.write).toEqual(jasmine.any(Function));
		});

		describe('buffer size', () => {
			it('setReadBufferSize is a Function', () => {
				expect(socket.setReadBufferSize).toEqual(jasmine.any(Function));
			});

			it('setReadBufferSize returns nothing', () => {
				expect(socket.setReadBufferSize(125)).nothing();
			});

			it('readBufferSize is a property', () => {
				expect(socket.readBufferSize).toEqual(jasmine.any(Number));
			});

			it('getReadBufferSize is a function', () => {
				expect(socket.getReadBufferSize).toEqual(jasmine.any(Function));
			});

			it('getReadBufferSize returns a number', () => {
				expect(socket.getReadBufferSize()).toEqual(jasmine.any(Number));
			});
		});
	});
});
