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
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import ti.modules.titanium.BufferProxy;

@SuppressLint("LongLogTag")
class BluetoothSocketConnectedReaderWriter
{
	private static final String TAG = "BluetoothSocketConnectedReaderWriter";

	private final InputStream inputStream;
	private final OutputStream outputStream;
	private IEventListener listener;
	private volatile boolean isClosed = false;
	private volatile BlockingQueue<byte[]> sendDataQueue = new LinkedBlockingQueue<>();
	private Thread writerThread;

	BluetoothSocketConnectedReaderWriter(BluetoothSocket socket, short readBufferSizeInBytes, IEventListener listener)
		throws IOException
	{
		this.inputStream = socket.getInputStream();
		this.outputStream = socket.getOutputStream();
		this.listener = listener;

		initReader(readBufferSizeInBytes);
		initWriter();
	}

	private void initReader(short readBufferSizeInBytes)
	{
		Thread readThread = new Thread(() -> {
			byte[] buffer = new byte[readBufferSizeInBytes];
			int bytesRead;
			while (!isClosed) {
				try {
					bytesRead = inputStream.read(buffer, 0, buffer.length);
					BufferProxy bufferProxy = new BufferProxy();
					bufferProxy.write(0, buffer, 0, bytesRead);
					listener.onDataReceived(bufferProxy);
				} catch (IOException e) {
					if (isClosed) {
						return; //exception while reading occurred due to closing the stream.
					}
					Log.e(TAG, "Exception while reading the inputstream.", e);
					close(e);
					return;
				}
			}
		});
		readThread.start();
	}

	private void initWriter()
	{
		writerThread = new Thread(() -> {
			while (!isClosed) {
				byte[] data;
				try {
					data = sendDataQueue.take();
				} catch (InterruptedException e) {
					Log.d(TAG, "initWriter(): writer thread interrupted.");
					return;
				}

				try {
					Log.d(TAG, "initWriter(): initiating write operation for data size - " + data.length + "bytes");
					outputStream.write(data);
					Log.d(TAG, "initWriter(): write completed for data size - " + data.length + "bytes");
				} catch (IOException e) {
					if (isClosed) {
						return; //exception while writing occurred due to closing the stream.
					}
					Log.e(TAG, "initWriter(): exception while writing data on the output stream.", e);
					close(e);
					return;
				}
			}
		});
		writerThread.start();
	}

	void send(BufferProxy bufferProxy)
	{
		if (isClosed) {
			Log.d(TAG, "trying to write on the stream, but streams already been closed.");
			return;
		}
		if (bufferProxy == null || bufferProxy.getBuffer() == null) {
			Log.d(TAG, "send(): unable to send as the data provided is null");
			return;
		}

		sendDataQueue.offer(bufferProxy.getBuffer());
	}

	void close()
	{
		close(null);
	}

	private void close(IOException e)
	{
		if (isClosed) {
			Log.d(TAG, "trying to close the streams, but streams already been closed.");
			return;
		}

		isClosed = true;

		try {
			inputStream.close();
		} catch (IOException exc) {
			Log.e(TAG, "exception while closing inputstream", exc);
		}
		try {
			outputStream.close();
		} catch (IOException exc) {
			Log.e(TAG, "exception while closing outputstream", exc);
		}

		writerThread.interrupt();
		writerThread = null;
		sendDataQueue.clear();
		sendDataQueue = null;

		if (e != null) {
			listener.onStreamError(e);
		}
		listener = null;
	}

	public interface IEventListener {
		void onDataReceived(BufferProxy proxy);
		void onStreamError(IOException e);
	}
}
