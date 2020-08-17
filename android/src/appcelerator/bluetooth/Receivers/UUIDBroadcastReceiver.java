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
import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.KrollProxy;

public class UUIDBroadcastReceiver extends BroadcastReceiver
{
	private KrollProxy krollProxy;

	public UUIDBroadcastReceiver(KrollProxy krollProxy)
	{
		this.krollProxy = krollProxy;
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
				dict.put("device", bluetoothDeviceProxy);
				dict.put("UUIDs", uuidStrings);
				krollProxy.fireEvent("fetchedUUIDs", dict);
			}
		}
	}
}