/**
 * Appcelerator Titanium Mobile - Bluetooth Module
 * Copyright (c) 2020 by Axway, Inc. All Rights Reserved.
 * Proprietary and Confidential - This source code is not for redistribution
 */
package appcelerator.bluetooth;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothSocket;
import android.util.Log;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import ti.modules.titanium.BufferProxy;

@SuppressLint("LongLogTag")
class BluetoothSocketConnectedReaderWriter
{

	private final InputStream inputStream;
	private final OutputStream outputStream;
	private IEventListener listener;
	private volatile boolean isClosed = false;

	private static final String TAG = "BluetoothSocketConnectedReaderWriter";

	BluetoothSocketConnectedReaderWriter(BluetoothSocket socket, IEventListener listener) throws IOException
	{
		this.inputStream = socket.getInputStream();
		this.outputStream = socket.getOutputStream();
		this.listener = listener;

		init();
	}

	private void init()
	{

		Thread readThread = new Thread(() -> {
			byte[] buffer = new byte[4096];

			while (!isClosed) {
				try {
					int read = inputStream.read(buffer);
					BufferProxy bufferProxy = new BufferProxy();
					bufferProxy.write(0, buffer, 0, read);
					listener.onDataReceived(bufferProxy);
				} catch (IOException e) {
					if (isClosed) {
						// exception while reading occurred due to closing the stream.
						return;
					}
					Log.e(TAG, "Exception while reading the inputstream.", e);
					IEventListener tempListener = listener;
					close();
					tempListener.onStreamError(e);
				}
			}
		});
		readThread.start();
	}

	void write(BufferProxy bufferProxy)
	{
		if (isClosed) {
			Log.d(TAG, "trying to write on the stream, but streams already been closed.");
			return;
		}

		try {
			outputStream.write(bufferProxy.getBuffer());
		} catch (IOException e) {
			Log.e(TAG, "exception while writing data on the stream.", e);
		}
	}

	void close()
	{
		if (isClosed) {
			Log.d(TAG, "trying to close the streams, but streams already been closed.");
			return;
		}

		listener = null;
		isClosed = true;

		try {
			inputStream.close();
		} catch (IOException e) {
			Log.e(TAG, "exception while closing inputstream", e);
		}
		try {
			outputStream.close();
		} catch (IOException e) {
			Log.e(TAG, "exception while closing outputstream", e);
		}
	}

	public interface IEventListener {
		void onDataReceived(BufferProxy proxy);
		void onStreamError(IOException e);
	}
}
