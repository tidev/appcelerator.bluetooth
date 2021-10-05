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
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;
import appcelerator.bluetooth.Receivers.DiscoveryBroadcastReceiver;
import appcelerator.bluetooth.Receivers.StateBroadcastReceiver;
import appcelerator.bluetooth.Receivers.UUIDBroadcastReceiver;
import java.util.ArrayList;
import java.util.Set;
import org.appcelerator.kroll.KrollDict;
import org.appcelerator.kroll.KrollFunction;
import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.KrollObject;
import org.appcelerator.kroll.KrollPromise;
import org.appcelerator.kroll.KrollRuntime;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.titanium.TiApplication;
import org.appcelerator.titanium.TiBaseActivity;
import org.appcelerator.titanium.TiC;

@Kroll.module(name = "Bluetooth", id = "appcelerator.bluetooth")
public class BluetoothModule extends KrollModule
{
	// Standard Debugging variables
	private static final String LCAT = "BluetoothModule";
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
	private BluetoothAdapter btAdapter;
	private StateBroadcastReceiver stateReceiver;
	private DiscoveryBroadcastReceiver discoveryReceiver;

	public BluetoothModule()
	{
		super();

		// Fetch bluetooth adapter.
		final Context context = TiApplication.getInstance();
		BluetoothManager bluetoothManager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
		if (bluetoothManager != null) {
			this.btAdapter = bluetoothManager.getAdapter();
		}

		// Set up bluetooth broadcast receivers.
		IntentFilter intentFilter = new IntentFilter();
		intentFilter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);
		this.discoveryReceiver = new DiscoveryBroadcastReceiver(this);
		this.stateReceiver = new StateBroadcastReceiver(this);
		context.registerReceiver(stateReceiver, intentFilter);

		// Unregister broadcast receivers when the JS runtime is about to be terminated.
		KrollRuntime.addOnDisposingListener(new KrollRuntime.OnDisposingListener() {
			@Override
			public void onDisposing(KrollRuntime runtime)
			{
				KrollRuntime.removeOnDisposingListener(this);
				context.unregisterReceiver(stateReceiver);
				DiscoveryBroadcastReceiver.unregisterAll();
				UUIDBroadcastReceiver.unregisterAll();
			}
		});
	}

	@Override
	public String getApiName()
	{
		return "Appcelerator.Bluetooth";
	}

	@Kroll.method
	public boolean enable()
	{
		if (!isSupported()) {
			Log.e(LCAT, BT_UNSUPPORTED);
			return false;
		}
		return btAdapter.enable();
	}

	@Kroll.method
	public boolean disable()
	{
		if (!isSupported()) {
			Log.e(LCAT, BT_UNSUPPORTED);
			return false;
		}
		return btAdapter.disable();
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
		return isRequiredPermissionsGranted(false);
	}

	private boolean isRequiredPermissionsGranted(boolean isRequestingLocationOnly)
	{
		// Create the permission list.
		ArrayList<String> permissionList = new ArrayList<>(4);
		permissionList.add(Manifest.permission.ACCESS_FINE_LOCATION);
		if (!isRequestingLocationOnly) {
			if (Build.VERSION.SDK_INT >= 31) {
				permissionList.add(Manifest.permission.BLUETOOTH_ADVERTISE);
				permissionList.add(Manifest.permission.BLUETOOTH_CONNECT);
				permissionList.add(Manifest.permission.BLUETOOTH_SCAN);
			} else {
				permissionList.add(Manifest.permission.BLUETOOTH);
				permissionList.add(Manifest.permission.BLUETOOTH_ADMIN);
			}
		}

		// Determine if permissions are granted.
		// Note: On OS versions older than Android 6.0, check if permission is defined in manifest.
		TiApplication context = TiApplication.getInstance();
		PackageManager packageManager = context.getPackageManager();
		String packageName = context.getPackageName();
		for (String permissionName : permissionList) {
			if (Build.VERSION.SDK_INT >= 23) {
				if (context.checkSelfPermission(permissionName) != PackageManager.PERMISSION_GRANTED) {
					return false;
				}
			} else if (packageManager.checkPermission(permissionName, packageName)
					   != PackageManager.PERMISSION_GRANTED) {
				return false;
			}
		}
		return true;
	}

	@Kroll.method
	public KrollPromise<KrollDict>
	requestAccessFinePermission(@Kroll.argument(optional = true) KrollFunction permissionCallback)
	{
		return requestPermissions(permissionCallback, true);
	}

	@Kroll.method
	public KrollPromise<KrollDict> requestPermissions(@Kroll.argument(optional = true) KrollFunction permissionCallback)
	{
		return requestPermissions(permissionCallback, false);
	}

	private KrollPromise<KrollDict> requestPermissions(KrollFunction permissionCallback,
													   boolean isRequestingLocationOnly)
	{
		final KrollObject krollObject = getKrollObject();
		return KrollPromise.create((promise) -> {
			// Do not continue if we already have permission.
			if (isRequiredPermissionsGranted(isRequestingLocationOnly)) {
				KrollDict responseData = new KrollDict();
				responseData.putCodeAndMessage(0, null);
				if (permissionCallback != null) {
					permissionCallback.callAsync(krollObject, responseData);
				}
				promise.resolve(responseData);
				return;
			} else if (Build.VERSION.SDK_INT < 23) {
				KrollDict responseData = new KrollDict();
				responseData.putCodeAndMessage(-1, "Permission(s) not defined in manifest.");
				if (permissionCallback != null) {
					permissionCallback.callAsync(krollObject, responseData);
				}
				promise.reject(new Throwable(responseData.getString(TiC.EVENT_PROPERTY_ERROR)));
				return;
			}

			// Do not continue if there is no activity to host the request dialog.
			Activity activity = TiApplication.getInstance().getCurrentActivity();
			if (activity == null) {
				KrollDict responseData = new KrollDict();
				responseData.putCodeAndMessage(-1, "There are no activities to host the permission request dialog.");
				if (permissionCallback != null) {
					permissionCallback.callAsync(krollObject, responseData);
				}
				promise.reject(new Throwable(responseData.getString(TiC.EVENT_PROPERTY_ERROR)));
				return;
			}

			// Create the permission list.
			ArrayList<String> permissionList = new ArrayList<>(4);
			permissionList.add(Manifest.permission.ACCESS_FINE_LOCATION);
			if (Build.VERSION.SDK_INT >= 31) {
				permissionList.add(Manifest.permission.ACCESS_COARSE_LOCATION);
				if (!isRequestingLocationOnly) {
					permissionList.add(Manifest.permission.BLUETOOTH_ADVERTISE);
					permissionList.add(Manifest.permission.BLUETOOTH_CONNECT);
					permissionList.add(Manifest.permission.BLUETOOTH_SCAN);
				}
			}

			// Show dialog requesting permission.
			TiBaseActivity.registerPermissionRequestCallback(TiC.PERMISSION_CODE_LOCATION, permissionCallback,
															 krollObject, promise);
			activity.requestPermissions(permissionList.toArray(new String[0]), TiC.PERMISSION_CODE_LOCATION);
		});
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
		if (!btAdapter.startDiscovery()) {
			Log.e(LCAT, "startDiscovery(): Could not start discovery due to the error. ");
			return false;
		}

		IntentFilter intentFilter = new IntentFilter();
		intentFilter.addAction(BluetoothAdapter.ACTION_DISCOVERY_STARTED);
		intentFilter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
		intentFilter.addAction(BluetoothDevice.ACTION_FOUND);
		TiApplication.getInstance().registerReceiver(this.discoveryReceiver, intentFilter);
		return true;
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
}
