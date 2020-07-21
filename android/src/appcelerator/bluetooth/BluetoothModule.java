/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.content.pm.PackageManager;
import android.util.Log;
import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.kroll.common.TiConfig;

@Kroll.module(name = "Bluetooth", id = "appcelerator.bluetooth")
public class BluetoothModule extends KrollModule
{

	// Standard Debugging variables
	private static final String LCAT = "BluetoothModule";
	private static final boolean DBG = TiConfig.LOGD;

	private final BluetoothAdapter btAdapter;

	public BluetoothModule()
	{
		super();
		btAdapter = BluetoothAdapter.getDefaultAdapter();
	}

	@Override
	public String getApiName()
	{
		return "Appcelerator.Bluetooth";
	}

	@Kroll.method
	public boolean isSupported()
	{
		return btAdapter != null;
	}

	@Kroll.method
	public boolean isEnabled()
	{
		if (!isSupported()) {
			Log.e(LCAT, "Bluetooth is not supported");
			return false;
		}
		if (!isRequiredPermissionsGranted()) {
			Log.e(LCAT, "Bluetooth permissions not granted");
			return false;
		}
		return btAdapter.isEnabled();
	}

	@Kroll.method
	public boolean isRequiredPermissionsGranted()
	{
		return getActivity().getPackageManager().checkPermission(Manifest.permission.BLUETOOTH,
																 getActivity().getPackageName())
			== PackageManager.PERMISSION_GRANTED
			&& getActivity().getPackageManager().checkPermission(Manifest.permission.BLUETOOTH_ADMIN,
																 getActivity().getPackageName())
				   == PackageManager.PERMISSION_GRANTED;
	}
}
