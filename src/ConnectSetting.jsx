import Color from './components/Color.jsx'
import Chart from './components/Chart.jsx'

export default function Setting() {
    return (
        <div className="w-full bg-black">
            <div className="flex justify-center grid grid-rows-4 gap-4">
                <div className="pt-4">
                    <div className="w-[360px] h-[500px] rounded-[60px] bg-stone-900">
                            <div className="flex justify-center pt-4">PODX</div>
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
                            SLECT MODE
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}