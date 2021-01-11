/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth.Receivers;

import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Parcelable;
import appcelerator.bluetooth.BluetoothDeviceProxy;
import java.util.HashMap;

public class UUIDBroadcastReceiver extends BroadcastReceiver
{
	private BluetoothDeviceProxy btDeviceProxy;
	private final String EVENT_FETCHED_UUIDS = "fetchedUUIDs";
	private final String EVENT_FETCHED_UUIDS_DEVICE_KEY = "device";
	private final String EVENT_FETCHED_UUIDS_KEYS = "UUIDs";

	public UUIDBroadcastReceiver(BluetoothDeviceProxy btDeviceProxy)
	{
		this.btDeviceProxy = btDeviceProxy;
	}

	@Override
	public void onReceive(Context context, Intent intent)
	{

		String action = intent.getAction();
		HashMap<String, Object> dict = new HashMap<>();
		if (BluetoothDevice.ACTION_UUID.equals(action)) {
			BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
			Parcelable[] uuidExtra = intent.getParcelableArrayExtra(BluetoothDevice.EXTRA_UUID);
			if (device != null && uuidExtra != null) {
				String[] uuidStrings = new String[uuidExtra.length];
				int i = 0;
				for (Parcelable parcelUuid : uuidExtra) {
					uuidStrings[i] = parcelUuid.toString();
					i++;
				}
				BluetoothDeviceProxy bluetoothDeviceProxy = new BluetoothDeviceProxy(device);
				dict.put(EVENT_FETCHED_UUIDS_DEVICE_KEY, bluetoothDeviceProxy);
				dict.put(EVENT_FETCHED_UUIDS_KEYS, uuidStrings);
				btDeviceProxy.fireEvent(EVENT_FETCHED_UUIDS, dict);
				btDeviceProxy.getActivity().unregisterReceiver(this);
				btDeviceProxy.setFetchuuidState(false);
			}
		}
	}
}