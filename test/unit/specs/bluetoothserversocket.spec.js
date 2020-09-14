let bluetooth;
let serverSocket;

describe('BluetoothServerSocket ', function () {

	it('bluetooth required', () => {
		bluetooth = require('appcelerator.bluetooth');

		expect(bluetooth).toBeDefined();
	});

	it('serverSocket required', () => {
		serverSocket = bluetooth.createServerSocket({
			name: 'Test_Server_Socket',
			uuid: '8ce255c0-200a-11e0-ac64-0800200c9a66',
			secure: false
		});

		expect(serverSocket).toBeDefined();
	});

	describe('methods', () => {

		describe('isAccepting', () => {
			it('isAccepting is a Function', () => {
				expect(serverSocket.isAccepting).toEqual(jasmine.any(Function));
			});

			it('isAccepting returns a boolean', () => {
				expect(serverSocket.isAccepting()).toEqual(jasmine.any(Boolean));
			});
		});

		it('startAccept is a Function', () => {
			expect(serverSocket.startAccept).toEqual(jasmine.any(Function));
		});

		it('stopAccept is a Function', () => {
			expect(serverSocket.stopAccept).toEqual(jasmine.any(Function));
		});

		it('close is a Function', () => {
			expect(serverSocket.close).toEqual(jasmine.any(Function));
		});

		describe('start, stop and close server', () => {
			var server_socket;

			beforeEach(() => {
				server_socket = bluetooth.createServerSocket({
					name: 'Test',
					uuid: '8ce255c0-200a-11e0-ac64-0800200c9a67',
					secure: false
				});
			});

			afterEach(() => {
				server_socket.close();
			});

			it('startAccept should start accepting the connection', () => {
				server_socket.startAccept();

				expect(server_socket.isAccepting()).toBeTrue();
			});

			it('stopAccept should stop accepting the connection', () => {
				server_socket.startAccept();
				server_socket.stopAccept();

				expect(server_socket.isAccepting()).toBeFalse();
			});

			it('close should stop accepting the connection', () => {
				server_socket.startAccept();
				server_socket.close();

				expect(server_socket.isAccepting()).toBeFalse();
			});

			it('after invoking close, should not be able to start accepting the connection again', () => {
				server_socket.startAccept();
				server_socket.close();
				server_socket.startAccept();

				expect(server_socket.isAccepting()).toBeFalse();
			});
		});
	});
});
