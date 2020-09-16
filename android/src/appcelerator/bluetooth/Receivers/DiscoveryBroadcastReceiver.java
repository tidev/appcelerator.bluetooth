/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth.Receivers;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import appcelerator.bluetooth.BluetoothDeviceProxy;
import java.util.HashMap;
import org.appcelerator.kroll.KrollModule;

public class DiscoveryBroadcastReceiver extends BroadcastReceiver
{
	private KrollModule krollModule;
	private final String EVENT_DEVICE_FOUND = "deviceFound";
	private final String EVENT_DEVICE_FOUND_KEY = "device";
	private final String EVENT_DEVICE_FOUND_RSSI_KEY = "RSSI";
	private final String EVENT_DISCOVERY_STARTED = "discoveryStarted";
	private final String EVENT_DISCOVERY_FINISHED = "discoveryFinished";

	public DiscoveryBroadcastReceiver(KrollModule krollModule)
	{
		this.krollModule = krollModule;
	}

	@Override
	public void onReceive(Context context, Intent intent)
	{

		String action = intent.getAction();
		HashMap<String, Object> dict = new HashMap<>();

		if (BluetoothDevice.ACTION_FOUND.equals(action)) {
			BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
			if (device != null) {
				int RSSI = intent.getShortExtra(BluetoothDevice.EXTRA_RSSI, Short.MIN_VALUE);
				BluetoothDeviceProxy bluetoothDeviceProxy = new BluetoothDeviceProxy(device);
				dict.put(EVENT_DEVICE_FOUND_KEY, bluetoothDeviceProxy);
				dict.put(EVENT_DEVICE_FOUND_RSSI_KEY, RSSI);
				krollModule.fireEvent(EVENT_DEVICE_FOUND, dict);
			}
		} else if (BluetoothAdapter.ACTION_DISCOVERY_STARTED.equals(action)) {
			krollModule.fireEvent(EVENT_DISCOVERY_STARTED, "discovery is started");
		} else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action)) {
			krollModule.fireEvent(EVENT_DISCOVERY_FINISHED, "discovery is finished");
			krollModule.getActivity().unregisterReceiver(this);
		}
	}
}