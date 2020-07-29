/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.util.Log;
import java.io.IOException;
import java.util.UUID;
import org.appcelerator.kroll.KrollDict;
import org.appcelerator.kroll.KrollProxy;
import org.appcelerator.kroll.annotations.Kroll;

@Kroll.proxy
public class BluetoothSocketProxy extends KrollProxy
{
	private static final String LCAT = "BluetoothSocketProxy";
	private BluetoothSocket btSocket;
	private String uuid;
	private boolean isSecure;
	private BluetoothDevice bluetoothDevice;
	private Thread connectThread;

	private socketState state = socketState.open;

	public BluetoothSocketProxy(BluetoothSocket bluetoothSocket, String uuid, boolean secure,
								BluetoothDevice bluetoothDevice)
	{
		super();
		this.btSocket = bluetoothSocket;
		this.uuid = uuid;
		this.isSecure = secure;
		this.bluetoothDevice = bluetoothDevice;
		if (isConnected()) {
			state = socketState.connected;
		}
	}

	@Kroll.method
	public void connect()
	{
		KrollDict dict = new KrollDict();
		if (state != socketState.open) {
			Log.e(LCAT, "Cannot connect socket, Socket: " + state);
			return;
		}
		state = socketState.connecting;
		connectThread = new Thread(() -> {
			try {
				btSocket.connect();
				state = socketState.connected;
				dict.put("socket", this);
				fireEvent("connected", dict);
			} catch (IOException connectException) {
				state = socketState.error;
				dict.put("socket", this);
				dict.put("errorMessage", connectException.getMessage());
				fireEvent("error", dict);
				Log.e(LCAT, "Cannot connect, Exception: " + connectException.getMessage());
			}
		});
		connectThread.start();
	}

	@Kroll.method
	public boolean isConnected()
	{
		if (btSocket != null) {
			return btSocket.isConnected();
		}
		return false;
	}

	@Kroll.method
	public boolean isConnecting()
	{
		return state == socketState.connecting;
	}

	@Kroll.method
	public void cancelConnect()
	{
		if (!isConnecting()) {
			Log.e(LCAT, "cannot cancel connection, Socket: " + state);
			return;
		}
		try {
			btSocket.close();
			state = socketState.disconnected;
		} catch (IOException e) {
			Log.e(LCAT, "trying to cancel" + e.getMessage());
		}
		try {
			if (isSecure) {
				btSocket = bluetoothDevice.createRfcommSocketToServiceRecord(UUID.fromString(uuid));
				state = socketState.open;
			} else {
				btSocket = bluetoothDevice.createInsecureRfcommSocketToServiceRecord(UUID.fromString(uuid));
				state = socketState.open;
			}

		} catch (IOException e) {
			KrollDict dict = new KrollDict();
			state = socketState.error;
			dict.put("socket", this);
			dict.put("errorMessage", "cannot create socket, Exception: " + e.getMessage());
			fireEvent("error", dict);
			Log.e(LCAT, "Cannot create, Exception" + e.getMessage());
		}
	}

	@Kroll.method
	public void close()
	{
		KrollDict dict = new KrollDict();
		try {
			btSocket.close();
			state = socketState.disconnected;
			dict.put("socket", this);
			dict.put("message", "Socket is Disconnected");
			fireEvent("disconnected", dict);
		} catch (IOException e) {
			dict.put("socket", this);
			dict.put("errorMessage", " trying to close socket but exception: " + e.getMessage());
			fireEvent("error", dict);
			Log.e(LCAT, "Cannot close, Exception: " + e.getMessage());
		}
	}

	@Kroll.method
	public BluetoothDeviceProxy getRemoteDevice()
	{
		return new BluetoothDeviceProxy(btSocket.getRemoteDevice());
	}

	private enum socketState { connecting, connected, disconnected, open, error }
}