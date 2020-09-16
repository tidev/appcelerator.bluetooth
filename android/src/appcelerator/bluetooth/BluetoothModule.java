/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth;

import android.Manifest;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.util.Log;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import appcelerator.bluetooth.Receivers.DiscoveryBroadcastReceiver;
import appcelerator.bluetooth.Receivers.StateBroadcastReceiver;
import java.util.Set;
import org.appcelerator.kroll.KrollDict;
import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.kroll.common.TiConfig;

@Kroll.module(name = "Bluetooth", id = "appcelerator.bluetooth")
public class BluetoothModule extends KrollModule
{

	// Standard Debugging variables
	private static final String LCAT = "BluetoothModule";
	private static final boolean DBG = TiConfig.LOGD;
	@Kroll.constant
	public static final int DEVICE_TYPE_CLASSIC = BluetoothDevice.DEVICE_TYPE_CLASSIC;
	@Kroll.constant
	public static final int DEVICE_TYPE_DUAL = BluetoothDevice.DEVICE_TYPE_DUAL;
	@Kroll.constant
	public static final int DEVICE_TYPE_LE = BluetoothDevice.DEVICE_TYPE_LE;
	@Kroll.constant
	public static final int DEVICE_TYPE_UNKNOWN = BluetoothDevice.DEVICE_TYPE_UNKNOWN;
	@Kroll.constant
	public static final int SCAN_MODE_CONNECTABLE = BluetoothAdapter.SCAN_MODE_CONNECTABLE;
	@Kroll.constant
	public static final int SCAN_MODE_CONNECTABLE_DISCOVERABLE = BluetoothAdapter.SCAN_MODE_CONNECTABLE_DISCOVERABLE;
	@Kroll.constant
	public static final int SCAN_MODE_NONE = BluetoothAdapter.SCAN_MODE_NONE;
	@Kroll.constant
	public static final int STATE_OFF = BluetoothAdapter.STATE_OFF;
	@Kroll.constant
	public static final int STATE_ON = BluetoothAdapter.STATE_ON;
	@Kroll.constant
	public static final int STATE_TURNING_OFF = BluetoothAdapter.STATE_TURNING_OFF;
	@Kroll.constant
	public static final int STATE_TURNING_ON = BluetoothAdapter.STATE_TURNING_ON;

	private final int DEVICE_DISCOVERABLE_DEFAULT_INTERVAL = 300; // in seconds.
	private final String BT_UNSUPPORTED = "Bluetooth is not supported";
	private final String BT_DISABLED = "Bluetooth is disabled";
	private final String PAIRED_DEVICES_SUCCESS_KEY = "success";
	private final String PAIRED_DEVICES_MESSAGE_KEY = "message";
	private final String PAIRED_DEVICES_KEY = "pairedDevices";
	private final BluetoothAdapter btAdapter;
	private StateBroadcastReceiver stateReceiver;
	private DiscoveryBroadcastReceiver discoveryReceiver;

	public BluetoothModule()
	{
		super();
		btAdapter = BluetoothAdapter.getDefaultAdapter();
		IntentFilter intentFilter = new IntentFilter();
		intentFilter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);
		stateReceiver = new StateBroadcastReceiver(this);
		discoveryReceiver = new DiscoveryBroadcastReceiver(this);
		getActivity().registerReceiver(stateReceiver, intentFilter);
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
			Log.e(LCAT, BT_UNSUPPORTED);
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
				   == PackageManager.PERMISSION_GRANTED
			&& getActivity().getPackageManager().checkPermission(Manifest.permission.ACCESS_FINE_LOCATION,
																 getActivity().getPackageName())
				   == PackageManager.PERMISSION_GRANTED;
	}

	@Kroll.method
	public void requestAccessFinePermission()
	{
		if (ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION)
			!= PackageManager.PERMISSION_GRANTED) {
			ActivityCompat.requestPermissions(getActivity(), new String[] { Manifest.permission.ACCESS_FINE_LOCATION },
											  1);
		}
	}

	/**
	 * This method will only return address if the android API < 23.
	 * @see <a href="android-6.0-changes">https://developer.android.com/about/versions/marshmallow/android-6.0-changes.html#behavior-hardware-id</a>
	 */
	@Kroll.getProperty
	public String getAddress()
	{
		if (!isSupported()) {
			Log.e(LCAT, BT_UNSUPPORTED);
			return null;
		}
		return btAdapter.getAddress();
	}

	@Kroll.getProperty
	@Kroll.method
	public String getName()
	{
		if (!isSupported()) {
			Log.e(LCAT, BT_UNSUPPORTED);
			return null;
		}
		return btAdapter.getName();
	}

	@Kroll.setProperty
	public boolean setName(String name)
	{
		if (!isEnabled()) {
			Log.e(LCAT, BT_DISABLED);
			return false;
		}
		return btAdapter.setName(name);
	}

	@Kroll.method
	public BluetoothDeviceProxy getRemoteDevice(String address)
	{
		if (isSupported()) {
			BluetoothDevice bluetoothDevice = btAdapter.getRemoteDevice(address);
			return new BluetoothDeviceProxy(bluetoothDevice);
		}
		Log.e(LCAT, BT_UNSUPPORTED);
		return null;
	}

	@Kroll.method
	public boolean checkBluetoothAddress(String address)
	{
		return BluetoothAdapter.checkBluetoothAddress(address);
	}

	@Kroll.method
	public KrollDict getPairedDevices()
	{
		KrollDict devices = new KrollDict();
		if (!isEnabled()) {
			devices.put(PAIRED_DEVICES_SUCCESS_KEY, false);
			devices.put(PAIRED_DEVICES_MESSAGE_KEY, BT_DISABLED);
			return devices;
		}
		Set<BluetoothDevice> pairedDevices = btAdapter.getBondedDevices();
		if (pairedDevices.size() > 0) {
			BluetoothDeviceProxy[] bluetoothDeviceProxySet = new BluetoothDeviceProxy[pairedDevices.size()];
			int i = 0;
			for (BluetoothDevice device : pairedDevices) {
				BluetoothDeviceProxy bluetoothDeviceProxy = new BluetoothDeviceProxy(device);
				bluetoothDeviceProxySet[i] = bluetoothDeviceProxy;
				i++;
			}

			devices.put(PAIRED_DEVICES_KEY, bluetoothDeviceProxySet);
			devices.put(PAIRED_DEVICES_SUCCESS_KEY, true);
			return devices;
		}
		devices.put(PAIRED_DEVICES_SUCCESS_KEY, false);
		devices.put(PAIRED_DEVICES_MESSAGE_KEY, "No Device Found");
		return devices;
	}

	@Kroll.method
	public boolean startDiscovery()
	{
		if (!isEnabled()) {
			Log.e(LCAT, BT_DISABLED);
			return false;
		}
		if (!isRequiredPermissionsGranted()) {
			Log.e(LCAT, "Required permission not granted");
			return false;
		}
		if (btAdapter.startDiscovery()) {
			IntentFilter intentFilter = new IntentFilter();
			intentFilter.addAction(BluetoothAdapter.ACTION_DISCOVERY_STARTED);
			intentFilter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
			intentFilter.addAction(BluetoothDevice.ACTION_FOUND);
			getActivity().registerReceiver(discoveryReceiver, intentFilter);
			return true;
		}
		Log.e(LCAT, "startDiscovery(): Could not start discovery due to the error. ");
		return false;
	}

	@Kroll.method
	public boolean isDiscovering()
	{
		if (!isSupported()) {
			Log.e(LCAT, BT_UNSUPPORTED);
			return false;
		}
		return btAdapter.isDiscovering();
	}

	@Kroll.method
	public boolean cancelDiscovery()
	{
		if (isDiscovering()) {
			return btAdapter.cancelDiscovery();
		}
		return false;
	}

	@Kroll.getProperty
	@Kroll.method
	public int getScanMode()
	{
		if (!isSupported()) {
			Log.e(LCAT, BT_UNSUPPORTED);
			return BluetoothAdapter.ERROR;
		}
		return btAdapter.getScanMode();
	}

	@Kroll.method
	@Kroll.getProperty
	public int getState()
	{
		if (!isSupported()) {
			Log.e(LCAT, BT_UNSUPPORTED);
			return BluetoothAdapter.ERROR;
		}
		return btAdapter.getState();
	}

	@Kroll.method
	public void ensureDiscoverable(@Kroll.argument(optional = true) Integer interval)
	{
		if (btAdapter.getScanMode() != SCAN_MODE_CONNECTABLE_DISCOVERABLE) {
			if (interval == null) {
				// use default interval, if interval value not provided.
				interval = DEVICE_DISCOVERABLE_DEFAULT_INTERVAL;
			}

			Intent discoverableIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE);
			discoverableIntent.putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, interval);
			getActivity().startActivity(discoverableIntent);
		}
	}

	@Kroll.method
	public BluetoothServerSocketProxy createServerSocket(KrollDict dict)
	{
		if (!isSupported()) {
			Log.e(LCAT, "createServerSocket: bluetooth not supported on this device.");
			return null;
		}

		String name = dict.getString("name");
		String uuid = dict.getString("uuid");
		boolean isSecure = dict.optBoolean("secure", false);

		return new BluetoothServerSocketProxy(name, uuid, isSecure);
	}

	@Override
	public void onDestroy(Activity activity)
	{
		try {
			getActivity().unregisterReceiver(stateReceiver);
		} catch (IllegalArgumentException e) {
			Log.w(LCAT, e.getMessage());
		}
		super.onDestroy(activity);
	}
}
