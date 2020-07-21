/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth;

import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.Kroll;

@Kroll.module(name = "Bluetooth", id = "appcelerator.bluetooth")
public class BluetoothModule extends KrollModule
{

	@Override
	public String getApiName()
	{
		return "Appcelerator.Bluetooth";
	}
}
