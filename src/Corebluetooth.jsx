// coreBluetooth.js
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { todoListAtom } from "./recoil/atom/todoAtom.js"; // Assuming your Recoil atom is defined in atoms.js
import axios from 'axios';

const uuidService = 0x0180;
const uuidRx = 0xDEAD; // UUID to receive data from ESP32 0xDEAD
const uuidTx = 0xFEF4; // UUID to transfer data to ESP32 0xFEF4

const useBluetooth = () => {
  const [device, setDevice] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
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
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "ESP32 dev" }],
        //optionalServices: [uuidService],
      });

      console.log("Connecting to GATT server...");
      const server = await device.gatt.connect();

      console.log("Getting primary service...");
      const service = await server.getPrimaryService(uuidService);

      console.log("Getting OTA service...");
      const characteristic = await service.getCharacteristic(uuidRx);
      console.log("Characteristic Properties:", characteristic.properties);

      console.log("Getting callback OTA size...");
      const callbackOtaSize = await service.getCharacteristic(uuidTx);

      setDevice(device);
      
      localStorage.setItem('DeviceName', device.name);

      setCharacteristic(characteristic);
      setTodoList({ ...todoList, characteristic: characteristic});

      callbackOtaSize.addEventListener(
        "characteristicvaluechanged",
        handleCallbackOtaSize
      );
      await callbackOtaSize.startNotifications();
    } catch (error) {
      console.error(`Error connecting to BLE device: ${error}`);
      setError(`Error connecting to BLE device: ${error}`);
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
      const response = await axios.get('http://localhost:3000/fetch-firmware', {
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
  

  useEffect(() => {
    if (parsedData) {
      try {
        const parsedValue = JSON.parse(parsedData);
        if (parsedValue && typeof parsedValue === "object") {
          console.log(parsedValue);
          setCallbackSize(parsedValue.ota_size);
          setReceivedData(parsedValue.msg_status);
          setSegmentCallback(parsedValue.Segment);
          setTotalByte(parsedValue.Total_byte);
          setUseByte(parsedValue.Use_byte);
          if (fileInput) {
            const percentOta =
              (parsedValue.ota_size / fileInput.files[0].size) * 100;
            setLoadPercent(percentOta);
          }
        } else {
          console.error("Parsed value is null or not an object");
        }
      } catch (error) {
        console.error("Error parsing data:", error);
        setError("Error parsing data");
      }
    }
  }, [parsedData, fileInput]);

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
    fetchData
  };
};

export default useBluetooth;