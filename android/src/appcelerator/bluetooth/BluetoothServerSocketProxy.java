/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.util.Log;
import java.io.IOException;
import java.util.UUID;
import org.appcelerator.kroll.KrollDict;
import org.appcelerator.kroll.KrollProxy;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.titanium.TiApplication;

@Kroll.proxy
@SuppressLint("LongLogTag")
public class BluetoothServerSocketProxy extends KrollProxy
{

	private final String name;
	private final String uuid;
	private final boolean isSecure;

	private volatile ServerSocketState state = ServerSocketState.Open;
	private volatile BluetoothServerSocket serverSocket;

	private final String EVENT_ERROR = "error";
	private final String EVENT_ERROR_KEY = "errorMessage";
	private final String EVENT_CONNECTION_RECEIVED = "connectionReceived";
	private final String EVENT_CONNECTION_RECEIVED_KEY = "socket";
	private final String TAG = "BluetoothServerSocketProxy";

	public BluetoothServerSocketProxy(String name, String uuid, boolean isSecure)
	{
		this.name = name;
		this.uuid = uuid;
		this.isSecure = isSecure;
	}

	@SuppressLint("MissingPermission")
	@Kroll.method
	public void startAccept(@Kroll.argument(optional = true) boolean keepListening)
	{
		if (state != ServerSocketState.Open) {
			Log.d(TAG, "startAccept: unable to startAccept as current state = " + state);
			return;
		}

		TiApplication context = TiApplication.getInstance();
		BluetoothManager bluetoothManager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
		BluetoothAdapter bluetoothAdapter = (bluetoothManager != null) ? bluetoothManager.getAdapter() : null;
		if (bluetoothAdapter == null) {
			Log.e(TAG, "startAccept: bluetooth not supported on device.");
			return;
		}

		setState(ServerSocketState.Accepting);

		try {
			if (isSecure) {
				serverSocket = bluetoothAdapter.listenUsingRfcommWithServiceRecord(name, UUID.fromString(uuid));
			} else {
				serverSocket = bluetoothAdapter.listenUsingInsecureRfcommWithServiceRecord(name, UUID.fromString(uuid));
			}
		} catch (IOException e) {
			Log.e(TAG, "startAccept: unable to startAccept due to exception.", e);
			setState(ServerSocketState.Open);
			return;
		}

		// thread.
		new Thread(() -> {
			do {
				try {
					BluetoothSocket socket = serverSocket.accept();
					BluetoothSocketProxy btSocketProxy = new BluetoothSocketProxy(socket, null, false, null);
					KrollDict dict = new KrollDict();
					dict.put(EVENT_CONNECTION_RECEIVED_KEY, btSocketProxy);
					fireEvent(EVENT_CONNECTION_RECEIVED, dict);
				} catch (IOException e) {
					if (state != ServerSocketState.Stopping && state != ServerSocketState.Closed) {
						Log.e(TAG, "startAccept: exception", e);
						KrollDict dict = new KrollDict();
						dict.put(EVENT_ERROR_KEY,
								 "Exception while accepting socket connection. Exception Details = " + e.getMessage());
						fireEvent(EVENT_ERROR, dict);
					}
					break;
				}
			} while (keepListening && state == ServerSocketState.Accepting);

			try {
				// close serverSocket, this object no longer needed.
				serverSocket.close();
			} catch (IOException e) {
				Log.e(TAG, "startAccept: exception on socket close. Exception Details = ", e);
			}

			if (state != ServerSocketState.Closed) {
				setState(ServerSocketState.Open);
			}
		}).start();
	}

	@Kroll.method
	public boolean isAccepting()
	{
		return state == ServerSocketState.Accepting;
	}

	@Kroll.method
	public void stopAccept()
	{
		if (state != ServerSocketState.Accepting) {
			Log.d(TAG, "stopAccept: server socket not in the accepting state. current state = " + state);
			return;
		}

		setState(ServerSocketState.Stopping);

		try {
			serverSocket.close();
		} catch (IOException e) {
			Log.e(TAG, "stopAccept: exception on socket close. Exception Details = ", e);
		}
	}

	@Kroll.method
	public void close()
	{
		if (state == ServerSocketState.Closed) {
			Log.d(TAG, "close: server socket already in closed state.");
			return;
		}

		setState(ServerSocketState.Closed);

		try {
			if (serverSocket != null) {
				serverSocket.close();
			}
		} catch (IOException e) {
			Log.e(TAG, "close: exception on socket close. Exception Details = ", e);
		}
	}

	private void setState(ServerSocketState newState)
	{
		ServerSocketState prevState = state;
		state = newState;
		Log.d(TAG, String.format("setState: server socket state changed from: %1$s to %2$s", prevState.toString(),
								 newState.toString()));
	}

	private enum ServerSocketState { Open, Accepting, Stopping, Closed }
}