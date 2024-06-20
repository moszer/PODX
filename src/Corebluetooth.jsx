// coreBluetooth.js
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { todoListAtom } from "./recoil/atom/todoAtom.js"; // Assuming your Recoil atom is defined in atoms.js
import axios from 'axios';
import { browserName } from "react-device-detect";

const uuidService = 0x0180;
const uuidRx = 0xDEAD; // UUID to receive data from ESP32 0xDEAD
const uuidTx = 0xFEF4; // UUID to transfer data to ESP32 0xFEF4
const uuidSendmode = 0xFEAD;

const useBluetooth = () => {
  const [device, setDevice] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [SETMODE, setMode] = useState(null);
  const [receivedData, setReceivedData] = useState("");
  const [error, setError] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [chunkSize, setChunkSize] = useState(128);
  const [callbackSize, setCallbackSize] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const [segmentCallback, setSegmentCallback] = useState(0);
  const [loadPercent, setLoadPercent] = useState(0);
  const [totalByte, setTotalByte] = useState(0);
  const [useByte, setUseByte] = useState(0);

  const [todoList, setTodoList] = useRecoilState(todoListAtom);
  

  const connectToDevice = async () => {
    if (!navigator.bluetooth) {
      setError("Bluetooth API is not supported by this browser.");
      return;
    }
  
    try {
      let device;
      const filterOptions = { filters: [{ name: "ESP32 dev" }] };
      const optionsWithService = { ...filterOptions, optionalServices: [uuidService] };
  
      console.log(`Browser detected: ${browserName}`);
      switch (browserName) {
        case "Chrome":
        case "Mobile Safari":
        case "Brave":
          device = await navigator.bluetooth.requestDevice(optionsWithService);
          break;
        case "WebKit":
          device = await navigator.bluetooth.requestDevice(filterOptions);
          break;
        default:
          alert(`Unsupported browser: ${browserName}`);
          throw new Error("Unsupported browser");
      }
  
      console.log("Device selected:", device);
  
      console.log("Connecting to GATT server...");
      const server = await device.gatt.connect();
  
      console.log("GATT server connected:", server);
  
      console.log("Getting primary service...");
      const service = await server.getPrimaryService(uuidService);
  
      console.log("Primary service retrieved:", service);
  
      console.log("Getting OTA service characteristic...");
      const characteristic = await service.getCharacteristic(uuidRx);
      console.log("Characteristic Properties:", characteristic.properties);
  
      const SENDMODE = await service.getCharacteristic(uuidSendmode);
      console.log("SENDMODE Properties:", SENDMODE.properties);
  
      console.log("Getting callback OTA size characteristic...");
      const callbackOtaSize = await service.getCharacteristic(uuidTx);
  
      console.log("Callback OTA size characteristic retrieved");
  
      setDevice(device);
      setMode(SENDMODE);
      
      localStorage.setItem('DeviceName', device.name);
      setCharacteristic(characteristic);
      setTodoList({ ...todoList, characteristic });
  
      callbackOtaSize.addEventListener(
        "characteristicvaluechanged",
        handleCallbackOtaSize
      );
      await callbackOtaSize.startNotifications();
      console.log("Notifications started for callback OTA size characteristic");
    } catch (error) {
      console.error(`Error connecting to BLE device: ${error}`);
      setError(`Error connecting to BLE device: ${error.message}`);
    }
  };

  const handleCallbackOtaSize = (event) => {
    const value = event.target.value;
    const otaSize = new TextDecoder().decode(value);
    setParsedData(otaSize);
  };

  const disconnectDevice = async () => {
    if (device && device.gatt.connected) {
      await device.gatt.disconnect();
      setDevice(null);
      setCharacteristic(null);
      setReceivedData("");
      setError("");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apifirmware-podx.vercel.app/fetch-firmware', {
        responseType: 'arraybuffer', // Ensure the response is treated as binary data
      });
      
      console.log("Downloading firmware from server...");
      console.log(response.data.byteLength);
      localStorage.setItem("firmwareMax", response.data.byteLength)

      await sendFile(response.data);
      console.log("Start update...");

      setTodoList({ ...todoList, statusUpdate: true });
  
    } catch (error) {
      console.error('Error fetching firmware:', error);
      // Handle error state
    }
  };
  
  const sendFile = async (data) => {
    const CHUNK_SIZE = 128; // Maximum chunk size for Bluetooth write
    let offset = 0;
    
    // Convert data length to an ArrayBuffer
    const lengthBuffer = new ArrayBuffer(4); // Assuming data length fits in 4 bytes (32-bit unsigned integer)
    const lengthView = new DataView(lengthBuffer);
    lengthView.setUint32(0, data.byteLength, true); // Write length as a 32-bit unsigned integer, little-endian

    try {
        // Write the data length first
        
        await characteristic.writeValue(lengthBuffer);
    } catch (error) {
        console.error('Error writing OTA size to characteristic:', error);
        setError('Error writing OTA size to characteristic');
        return;
    }

    try {
      while (offset < data.byteLength) {
        const chunk = data.slice(offset, offset + CHUNK_SIZE);
        await characteristic.writeValue(chunk);
        setTodoList({ ...todoList, firmwareDataByte: offset });
        offset += CHUNK_SIZE;
      }
    } catch (error) {
      console.error("Error writing OTA size to characteristic:", error);
      setError("Error writing OTA size to characteristic");
      return;
    }
  };

  const send_mode = async () => {
    try {
      const data_ = localStorage.getItem("valueMode");
      const encoder = new TextEncoder();
      const data = encoder.encode(data_);
      await SETMODE.writeValue(data);
    } catch (err) {
      console.log(err);
    }
  }

  return {
    device,
    characteristic,
    receivedData,
    error,
    fileInput,
    chunkSize,
    callbackSize,
    parsedData,
    segmentCallback,
    loadPercent,
    totalByte,
    useByte,
    connectToDevice,
    disconnectDevice,
    sendFile,
    setFileInput,
    fetchData,
    send_mode
  };
};

export default useBluetooth;