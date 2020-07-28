/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
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

	public BluetoothSocketProxy(BluetoothSocket bluetoothSocket, String uuid, boolean secure,
								BluetoothDevice bluetoothDevice)
	{
		super();
		btSocket = bluetoothSocket;
		this.uuid = uuid;
		isSecure = secure;
		this.bluetoothDevice = bluetoothDevice;
	}
}