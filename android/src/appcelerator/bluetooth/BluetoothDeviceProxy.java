/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.IntentFilter;
import android.os.ParcelUuid;
import android.util.Log;
import appcelerator.bluetooth.Receivers.UUIDBroadcastReceiver;
import java.io.IOException;
import java.util.UUID;
import org.appcelerator.kroll.KrollProxy;
import org.appcelerator.kroll.annotations.Kroll;

@Kroll.proxy
public class BluetoothDeviceProxy extends KrollProxy
{

	private BluetoothDevice btDevice;
	private static final String TAG = "BluetoothDeviceProxy";
	private UUIDBroadcastReceiver uuidReceiver = new UUIDBroadcastReceiver(this);
	private boolean isFetchingUuid;

	public BluetoothDeviceProxy(BluetoothDevice bluetoothDevice)
	{
		btDevice = bluetoothDevice;
	}

	@Kroll.method
	@Kroll.getProperty
	public String getAddress()
	{
		return btDevice.getAddress();
	}

	@Kroll.method
	@Kroll.getProperty
	public String getName()
	{
		return btDevice.getName();
	}

	@Kroll.method
	@Kroll.getProperty
	public int getType()
	{
		return btDevice.getType();
	}

	@Kroll.method
	@Kroll.getProperty
	public String[] getUUIDs()
	{
		ParcelUuid[] parcelUuids = btDevice.getUuids();
		String[] uuidStrings = new String[parcelUuids.length];
		int i = 0;
		for (ParcelUuid parcelUuid : parcelUuids) {
			uuidStrings[i] = parcelUuid.getUuid().toString();
			i++;
		}
		return uuidStrings;
	}

	@Kroll.method
	public boolean fetchUUIDs()
	{

		if (isFetchingUuid) {
			Log.w(TAG, "fetchUUIDs(): Service discovery to get UUIDs is already ongoing, cannot start again.");
			return false;
		}
		if (!btDevice.fetchUuidsWithSdp()) {
			Log.e(TAG, "fetchUUIDs(): Fail to initiate fetch UUIds due to sanity check failure");
			return false;
		}
		setFetchuuidState(true);
		IntentFilter intentFilter = new IntentFilter();
		intentFilter.addAction(BluetoothDevice.ACTION_UUID);
		getActivity().registerReceiver(uuidReceiver, intentFilter);
		return true;
	}

	public void setFetchuuidState(boolean state)
	{
		isFetchingUuid = state;
	}

	@Kroll.method
	public BluetoothSocketProxy createSocket(String uuid, @Kroll.argument(optional = true) boolean secure)
	{
		BluetoothSocket bluetoothSocket;
		BluetoothSocketProxy bluetoothSocketProxy;
		try {
			if (secure) {
				bluetoothSocket = btDevice.createRfcommSocketToServiceRecord(UUID.fromString(uuid));
			} else {
				bluetoothSocket = btDevice.createInsecureRfcommSocketToServiceRecord(UUID.fromString(uuid));
			}
			bluetoothSocketProxy = new BluetoothSocketProxy(bluetoothSocket, uuid, secure, btDevice);
			return bluetoothSocketProxy;

		} catch (IOException e) {
			Log.e(TAG, "bluetooth socket creation failed", e);
		}
		return null;
	}
}