/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth.Receivers;

import android.bluetooth.BluetoothAdapter;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import java.util.HashMap;
import org.appcelerator.kroll.KrollModule;

public class StateBroadcastReceiver extends BroadcastReceiver
{
	private KrollModule krollModule;
	private final String EVENT_STATE_CHANGED = "stateChanged";
	private final String EVENT_STATE_CHANGED_KEY = "message";

	public StateBroadcastReceiver(KrollModule krollModule)
	{
		this.krollModule = krollModule;
	}

	@Override
	public void onReceive(Context context, Intent intent)
	{
		String action = intent.getAction();
		HashMap<String, Object> dict = new HashMap<>();
		if (BluetoothAdapter.ACTION_STATE_CHANGED.equals(action)) {
			final int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR);
			switch (state) {
				case BluetoothAdapter.STATE_OFF:
					dict.put(EVENT_STATE_CHANGED_KEY, "Bluetooth is off");
					krollModule.fireEvent(EVENT_STATE_CHANGED, dict);
					break;
				case BluetoothAdapter.STATE_TURNING_OFF:
					dict.put(EVENT_STATE_CHANGED_KEY, "Bluetooth is turning off");
					krollModule.fireEvent(EVENT_STATE_CHANGED, dict);
					break;
				case BluetoothAdapter.STATE_ON:
					dict.put(EVENT_STATE_CHANGED_KEY, "Bluetooth is on");
					krollModule.fireEvent(EVENT_STATE_CHANGED, dict);
					break;
				case BluetoothAdapter.STATE_TURNING_ON:
					dict.put(EVENT_STATE_CHANGED_KEY, "Bluetooth is turning on");
					krollModule.fireEvent(EVENT_STATE_CHANGED, dict);
					break;
			}
		}
	}
}