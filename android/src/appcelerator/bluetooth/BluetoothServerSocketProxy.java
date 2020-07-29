/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth;

import org.appcelerator.kroll.KrollProxy;
import org.appcelerator.kroll.annotations.Kroll;

@Kroll.proxy
public class BluetoothServerSocketProxy extends KrollProxy
{
	private final String name;
	private final String uuid;
	private final boolean isSecure;

	public BluetoothServerSocketProxy(String name, String uuid, boolean isSecure)
	{
		this.name = name;
		this.uuid = uuid;
		this.isSecure = isSecure;
	}
}