'use client'

import React from 'react';
import CustomButton from './common/button';
import { WorksUtils } from '../utils/works';

interface WorkData {
    icon: string;
    heading: string;
    paragraph: string;
}

const Works: React.FC = () => {
    return (
        <div className='flex-col center gap-16 w-full md:h-[550px] mt-10 py-10 bg-black relative overflow-hidden'>
            <div className="center">
                <CustomButton onClick={() => {}} background='#1E1E1E' textColor='#FFFFFF' textSize=".8rem" borderRadius="25px" border="1px solid #8C8C8F">How PegoTrack Works</CustomButton>
            </div>

            <div className='center md:gap-4 lg:gap-8 sm:gap-10 flex-wrap lg:w-10/12 md:w-[95%]'>
                {WorksUtils.map((work: WorkData, index: number) => (
                    <div key={index} className='md:w-[30%] w-10/12 flex flex-col gap-3 rounded-[6px] border border-[#4C4F4F] p-5'>
                        <div className='mt-3'>
                            <img src={work.icon} alt="icon" width={48} height={48} />
                        </div>
                        <h3 className='font-semibold text-white text-[18px]'>{work.heading}</h3>
                        <p className='text-[#8C8C8F] text-[14px] min-h-[80px]'>{work.paragraph}</p>
                    </div>
                ))}
            </div>
            <img src="/icons/Vector.png" alt="vector" className='absolute right-0 top-0' />
            <img src="/icons/Vector2.png" alt="vector" className='absolute left-0 bottom-0' />
        </div>
    );
}

export default Works;

