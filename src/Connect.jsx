import React from 'react';
import LOGO from './components/Logo';
import BACK from './components/Back'
import Qrcode from './components/Qrcode';
import Setting from './ConnectSetting';

export default function Connect() {

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
                        <button className="btn w-full max-w-xs bg-black-500 text-white">CONNECT</button>
                    </div> 
                </div>
            </div>
            )}
        </div>
    )
}