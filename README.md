# Appcelerator Bluetooth Module

The Bluetooth module allows you to access the Bluetooth service on Android devices and makes it possible
to communicate using Bluetooth. It can be used to find the devices that are either paired or available in the local area, connecting devices, and transferring data between them.

## Accessing the Bluetooth Module

To access this module from JavaScript, you would do the following:
    
``` js
var bluetooth = require("appcelerator.bluetooth");
```

The bluetooth variable is a reference to the Module object.

## Getting Started

- Set the ``` <module> ``` element in tiapp.xml, such as this: 
  ``` xml
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

  ``` js
  if (bluetooth.isSupported()) {
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

  ``` js
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

  ``` js
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

  ``` js
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

  ``` js
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

  ``` js
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

Please see the `example/` folder. By default, the example would work on exchanging of the chat data. If you would like to exchange the image,
simply update the file serversocket.js(line#115) and client_socket.js(line#151) to include the image_sender.js and image_receiver.js file there.

## Observations

- This is the android native behaviour as observed. On a bluetooth socket object with a given uuid,
  if device A connects to device B (via BluetoothSocket connect() method), and then device A creates another
  socket object with the same uuid and attempts to connect with the same device B, then it won’t be successful
  to connect as a connected socket connection already exists. Moreover, while attempting for connection,
  the already connected socket would get disconnected.
  Recommendation: It would always be recommended to close the socket properly before trying to connect using
  the newly created socket object on the same device and same uuid.

- This is the android native behaviour as observed. While device scanning/discovery process, the same device can be found multiple times from the deviceFound event in span of 12 seconds.
  This scenario should be handled by the application. More information for same is available in the apidoc of bluetooth module class in section deviceFound event and startDiscovery method.

## Building

Simply run `appc run -p android --build-only` which will compile and package your module. 

Copy the module zip file into the root folder of your Titanium application or in the Titanium system folder (e.g. `/Library/Application Support/Titanium`).

## Author

Axway

## License

Copyright (c) 2020 by Axway, Inc. Please see the LICENSE file for further details.
