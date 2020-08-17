/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth;

import android.app.Activity;
import android.bluetooth.BluetoothDevice;
import android.content.IntentFilter;
import android.os.ParcelUuid;
import appcelerator.bluetooth.Receivers.UUIDBroadcastReceiver;
import org.appcelerator.kroll.KrollProxy;
import org.appcelerator.kroll.annotations.Kroll;

@Kroll.proxy()
public class BluetoothDeviceProxy extends KrollProxy
{

	private BluetoothDevice btDevice;
	private UUIDBroadcastReceiver uuidReceiver = new UUIDBroadcastReceiver(this);

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
		IntentFilter intentFilter = new IntentFilter();
		intentFilter.addAction(BluetoothDevice.ACTION_UUID);
		getActivity().registerReceiver(uuidReceiver, intentFilter);
		return btDevice.fetchUuidsWithSdp();
	}

	@Override
	public void onDestroy(Activity activity)
	{
		getActivity().unregisterReceiver(uuidReceiver);
		super.onDestroy(activity);
	}
}