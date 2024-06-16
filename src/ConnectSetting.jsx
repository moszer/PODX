import Color from './components/Color.jsx'
import Chart from './components/Chart.jsx'
import Software from './components/Software.jsx'
import Power from './components/Power.jsx'
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';

import useBluetooth from './Corebluetooth';
import { useRecoilState, useRecoilValue } from "recoil";
import { todoListAtom } from "./recoil/atom/todoAtom.js"; // Assuming your Recoil atom is defined in atoms.js
import { useEffect, useRef, useState } from 'react';

export default function Setting() {

    const Device_name = localStorage.getItem('DeviceName');
    const fileInputRef = useRef(null);
    const [modalUpdate, setmodalUpdate] = useState(false);

    const {
        fetchData,
        sendFile,
        setFileInput,
        connectToDevice
    } = useBluetooth();

    const todoList = useRecoilValue(todoListAtom);
    const maxfirmware = localStorage.getItem("firmwareMax");

    const Firmware = () => {
        const softwareComponentHtml = ReactDOMServer.renderToString(
            <div className='p-4'>
                <div className='flex justify-defalt items-center'>
                <Software /> 
                    <div>
                        Firmware v1.0
                    </div>
                </div>
                    <div className='flex pl-[32px]'>
                        Firmware is up to date
                    </div>
            </div>
        );

        const ConnectComponenentHtml = ReactDOMServer.renderToString(
            <div className='p-4'>
                
            </div>
        );

        if(todoList.characteristic != null){
            Swal.fire({
                title: "FIRMWARE",
                text: "You won't be able to revert this!",
                showCancelButton: true,
                confirmButtonColor: "#1B1A17",
                cancelButtonColor: "#1B1A17",
                background: "#1B1A17",
                confirmButtonText: "UPDATE",
                html: softwareComponentHtml
              }).then((result) => {
                if (result.isConfirmed) {
                    //
                    setmodalUpdate(true);
                    fetchData();
    
                }
              });
        } else {

           Swal.fire({
                title: "CONNECT",
                text: "You won't be able to revert this!",
                showCancelButton: true,
                confirmButtonColor: "#1B1A17",
                cancelButtonColor: "#1B1A17",
                background: "#1B1A17",
                confirmButtonText: "CONNECT",
                html: ConnectComponenentHtml
              }).then((result) => {
                if (result.isConfirmed) {
                    connectToDevice();
                }
              });

        }
    } 

    useEffect(() => {
        if(todoList.statusUpdate){
            setmodalUpdate(false);
        }
    }, [todoList.statusUpdate])

    return (
        <div className="w-full bg-black">
            {modalUpdate ? (
                <div className='fixed bottom-0 w-full h-[200px] rounded-t-[60px] bg-stone-800 z-50'>
                    <div className='flex justify-center grid grid grid-rows-4 p-4'>
                        <div className='flex justify-center'>SOFTWARE UPDATE IS RUNNING...</div>
                        <div className='flex justify-center'>Dont close your screen</div>
                        <progress className="progress w-[300px] h-[50px]" value={(todoList.firmwareDataByte / maxfirmware) * 100} max="100"></progress>
                    </div>
                </div>
            ) : (
                <></>
            )}

            <div className="flex justify-center grid grid-rows-4 gap-4">
                <div className="pt-4">
                    <div className="w-[360px] h-[500px] rounded-[60px] bg-stone-900">
                            <div className="flex justify-center pt-4">{Device_name}</div>
                    </div>
                </div>
                <div className="">
                    <div className="w-[360px] h-[89px] rounded-[15px] bg-stone-900">
                        <div className="flex">
                            <div className="w-[180px] h-[89px] rounded-[15px] bg-green-500 flex justify-center items-center text-white">
                                50%
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="pt-4">
                            <div className="btn w-[177px] h-[184px] rounded-[15px] bg-stone-900">
                                <div className='flex justify-center items-center'>
                                    <Color />
                                </div>
                                <div className='mb-5'>
                                    LED COLOR
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <div className="btn w-[177px] h-[184px] rounded-[15px] bg-stone-900">
                                <Chart />
                                <div className='mb-5'>
                                   DATA OF VAPE 
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="btn w-[360px] h-[89px] rounded-[15px] bg-stone-900">
                            <Power />SLECT MODE
                        </div>
                    </div>
                    <div className="pt-2">
                        <div className="btn w-[360px] h-[89px] rounded-[15px] bg-stone-900" onClick={Firmware}>
                            <Software /> FIRMWARE
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}