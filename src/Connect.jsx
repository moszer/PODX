import React, { useState , useEffect} from 'react';
import LOGO from './components/Logo';
import BACK from './components/Back'
import Qrcode from './components/Qrcode';
import Setting from './ConnectSetting';

import { useNavigate } from 'react-router-dom';


export default function Connect() {
    const navigate = useNavigate();
    const Register = () => navigate('/Register');

    const [device, setDevice] = useState(null);
    const [characteristic, setCharacteristic] = useState(null);
    const [receivedData, setReceivedData] = useState('');
    const [error, setError] = useState('');
    const [fileInput, setFileInput] = useState(null);
    const [chunkSize, setChunkSize] = useState(128);
    const [callbackSize, setCallbackSize] = useState(0);
    const [parsedData, setParsedData] = useState(null);
    const [segmentCallback, setSegmentCallback] = useState(0);
    const [loadPercent, setLoadPercent] = useState(0);
    const [totalByte, setTotalByte] = useState(0);
    const [useByte, setUseByte] = useState(0);

    const uuidService = 0x0180;
    const uuidRx = 0xDEAD; // UUID to receive data from ESP32 0xDEAD
    const uuidTx = 0xFEF4; // UUID to transfer data to ESP32 0xFEF4

    const connectToDevice = async () => {
        if (!navigator.bluetooth) {
        setError('Bluetooth API is not supported by this browser.');
        return;
        }

        try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ name: 'ESP32 dev' }],
            optionalServices: [uuidService]
        });

        console.log('Connecting to GATT server...');
        const server = await device.gatt.connect();

        console.log('Getting primary service...');
        const service = await server.getPrimaryService(uuidService);

        console.log('Getting OTA service...');
        const characteristic = await service.getCharacteristic(uuidRx);
        console.log('Characteristic Properties:', characteristic.properties);

        console.log('Getting callback OTA size...');
        const callbackOtaSize = await service.getCharacteristic(uuidTx);

        setDevice(device);
        setCharacteristic(characteristic);

        callbackOtaSize.addEventListener('characteristicvaluechanged', handleCallbackOtaSize);
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
        setReceivedData('');
        setError('');
        }
    };

    const sendFile = async () => {
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        setError('Please select a file');
        return;
        }

        const otaSize = fileInput.files[0].size;
        const encoder = new TextEncoder();
        const startOtaSize = encoder.encode(otaSize);

        try {
        await characteristic.writeValue(startOtaSize);
        } catch (error) {
        console.error('Error writing OTA size to characteristic:', error);
        setError('Error writing OTA size to characteristic');
        return;
        }

        const file = fileInput.files[0];
        const fileReader = new FileReader();
        let offset = 0;

        fileReader.onload = async (event) => {
        const chunk = new Uint8Array(event.target.result);

        try {
            await characteristic.writeValue(chunk);
        } catch (error) {
            console.error('Error writing chunk to characteristic:', error);
            setError('Error writing chunk to characteristic');
            return;
        }

        offset += chunk.length;

        if (offset < file.size) {
            readNextChunk();
        } else {
            setError('');
        }
        };

        const readNextChunk = () => {
        const slice = file.slice(offset, offset + chunkSize);
        fileReader.readAsArrayBuffer(slice);
        };

        readNextChunk();
    };

    useEffect(() => {
        if (parsedData) {
        try {
            const parsedValue = JSON.parse(parsedData);
            if (parsedValue && typeof parsedValue === 'object') {
            console.log(parsedValue);
            setCallbackSize(parsedValue.ota_size);
            setReceivedData(parsedValue.msg_status);
            setSegmentCallback(parsedValue.Segment);
            setTotalByte(parsedValue.Total_byte);
            setUseByte(parsedValue.Use_byte);
            if (fileInput) {
                const percentOta = (parsedValue.ota_size / fileInput.files[0].size) * 100;
                setLoadPercent(percentOta);
            }
            } else {
            console.error('Parsed value is null or not an object');
            }
        } catch (error) {
            console.error('Error parsing data:', error);
            setError('Error parsing data');
        }
        }
    }, [parsedData, fileInput]);

    return (
        <div className='overflow-x-hidden overflow-y-hidden'>
            {true ? (
                <Setting />
            ) : (
            <div>
                <div className='p-[20px]'>
                <BACK />
                </div>
                <div className='flex justify-center pl-[50px]'>
                <div className='ml-[100px] mt-[-140px]'>
                    <LOGO />
                </div>
                </div>
                <div className='fixed bottom-0 left-0 w-full bg-gray-200 p-4 text-center shadow-md rounded-t-[60px] h-[50vh] sm:h-[70vh] md:h-[70vh] lg:h-[70vh] xl:h-[70vh]'>
                    <div className='flex justify-center'>
                        <Qrcode />
                    </div>
                    <div className='pt-5'>
                        <button className="btn w-full max-w-xs bg-black-500 text-white" onClick={connectToDevice}>CONNECT</button>
                    </div> 
                </div>
            </div>
            )}
        </div>
    )
}