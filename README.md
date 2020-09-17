# Appcelerator Bluetooth Module

The Bluetooth module allows you to access the Bluetooth service on Android devices and makes it possible
to communicate using Bluetooth. It can be used to find the devices that are either paired or available in the local area, connecting devices, and transferring data between them.

## Accessing the Bluetooth Module

To access this module from JavaScript, you would do the following:
    
    var bluetooth = require("appcelerator.bluetooth");

The bluetooth variable is a reference to the Module object.

## Getting Started

- Edit the `manifest` with following `uses-permission` element to the Android manifest section of the
  tiapp.xml file.
  ```
  <ti:app>
    <android xmlns:android="http://schemas.android.com/apk/res/android">
      <manifest>
        <uses-permission android:name="android.permission.BLUETOOTH" />
        <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
        <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/> 
      </manifest>
    </android>
  </ti:app>
  ```

- Set the ``` <module> ``` element in tiapp.xml, such as this: 
  ```
  <modules>
      <module platform="android">appcelerator.bluetooth</module>
  </modules>
  ```

## Methods

- ### isSupported
  Checks that the Bluetooth is supported to the local Bluetooth device.

  #### Return value
  True if supported and false if not.

  #### Example

  ```
  if(bluetooth.isSupported())
  {
      Ti.API.info('Bluetooth is supported');
  } else {
      Ti.API.info('Bluetooth is not supported in this device');
  }
  ```

- ### getPairedDevices
  This is a method used to get the paired devices with the local adapter.

  #### Return Value
  It returns a dictionary with keys:
  - message[String]: Description of the reason for not getting pairedDevices.
  - pairedDevices[Object]: Set of the devices which are paired to the local adapter.
  - success[Boolean]: Determines whether the paired devices are successfully fetched or not.

  #### Example

  ```
  var dict = bluetooth.getPairedDevices();
  var device = []; // array for paired devices.
  if (dict.success) {
      var pdevices = dict.pairedDevices;
	  for (var index = 0; index < pdevices.length; index++){
          device[index] = pdevices[index];
      }
  } else {
      //Failed to get paired devices.
      Ti.API.info(dict.message);
  }
  ```

- ### createSocket
  It creates a RFCOMM Bluetooth Socket.

  #### Arguments
  - UUID[String]: UUID of the service this socket will connect to.
  - secure[Boolean]: It specifies whether the connection is secure or insecure

  #### Return value
  Returns the created socket for the device. 

  #### Example

  ```
  // device can be obtained by either getRemoteDevice method, getPairedDevice method or via deviceFound event.
  var socket = device.createSocket('8ce255c0-200a-11e0-ac64-0800200c9a66', false);
  // To connect the socket
  socket.connect();
  ```

- ### createServerSocket
  It creates an object of the BluetoothServerSocketProxy class, which can be used for listening the 
  incoming connections.

  #### Arguments
  - name[String]: Name of the service for SDP record.
  - uuid[String]: UUID of the service for SDP record.
  - secure[Boolean]: It specifies whether the connection is secure or insecure

  #### Return Value
  Returns the object of the BluetoothServerSocketProxy class

  #### Example

  ```
  var serverSocket = bluetooth.createServerSocket({
			name: 'Test_Server_Socket',
			uuid: '8ce255c0-200a-11e0-ac64-0800200c9a66',
			secure: true
	});
  // To accept the incoming connections.
  serverSocket.startAccept(false); 
  ```

## Properties

- ### name
  Name of the local Bluetooth device. 

  #### Arguments
  - name[String]: Name for the local Bluetooth Adapter.

  #### Return Value
  Returns the name of the local Bluetooth Adapter.

  #### Example

  ```
  // To get the name
  var btName = bluetooth.name;

  // To set the name
  var btName = 'XYZ';
  bluetooth.name = btName;
  ```

- ### state
  State of the local Bluetooth Adapter.

  #### Return value
  Returns the current state of the local Bluetooth Adapter.

  #### Example

  ```
  var state = bluetooth.state;
  if(state === bluetooth.STATE_ON)
  {
      Ti.API.info('Bluetooth is on');
  }
  ```

## Constants

- ### Bluetooth Scan Modes
  #### bluetooth.SCAN_MODE_CONNECTABLE
  #### bluetooth.SCAN_MODE_CONNECTABLE_DISCOVERABLE
  #### bluetooth.SCAN_MODE_NONE

- ### Bluetooth Adapter States
  #### bluetooth.STATE_OFF
  #### bluetooth.STATE_ON
  #### bluetooth.STATE_TURNING_OFF
  #### bluetooth.STATE_TURNING_ON

- ### Bluetooth Device Types
  #### bluetooth.DEVICE_TYPE_CLASSIC
  #### bluetooth.DEVICE_TYPE_DUAL
  #### bluetooth.DEVICE_TYPE_LE
  #### bluetooth.DEVICE_TYPE_UNKNOWN

## Example

Please see the `example/` folder.

## Building

Simply run `appc run -p android --build-only` which will compile and package your module. 

Copy the module zip file into the root folder of your Titanium application or in the Titanium system folder (e.g. /Library/Application Support/Titanium).

## Author

Axway

## License

Copyright (c) 2020 by Axway, Inc. Please see the LICENSE file for further details.
