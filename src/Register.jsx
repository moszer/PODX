import React from 'react';
import LOGO from './components/Logo';
import BACK from './components/Back'
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const Login = () => navigate('/Login');
    return (
        <div className='overflow-x-hidden overflow-y-hidden'>
            <div className='p-[20px]'>
              <BACK />
            </div>
            <div className='flex justify-center pl-[50px]'>
              <div className='ml-[100px] mt-[-140px]'>
                <LOGO />
              </div>
            </div>
              <div className='fixed bottom-0 left-0 w-full bg-gray-200 p-4 text-center shadow-md rounded-t-[60px] h-[50vh] sm:h-[70vh] md:h-[70vh] lg:h-[70vh] xl:h-[70vh]'>
              REGISTER
              <div className='pt-3'>
                <input type="email" placeholder="Email" className="input input-bordered input-black w-full max-w-xs bg-transparent" />
              </div>
              <div className='pt-3'>
                <input type="password" placeholder="Passwords" className="input input-bordered input-black w-full max-w-xs bg-transparent"/>
              </div>
              <div className='pt-3'>
                <input type="password" placeholder="Confirm Passwords" className="input input-bordered input-black w-full max-w-xs bg-transparent"/>
              </div>
              <div className='pt-3'>
                <button className="btn w-full max-w-xs bg-yellow-500 text-black">Register</button>
              </div>
              <div className='pt-3'>
                <button className="btn w-full max-w-xs bg-black-500 text-white" onClick={Login}>Login</button>
              </div>
            </div>
        </div>
    )
}