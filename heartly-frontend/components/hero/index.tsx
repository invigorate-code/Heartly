import { Button, Divider, Input } from "@heroui/react";
import Image from 'next/image';
import React from 'react';
import { CheckIcon } from '../icons/CheckIcon';
import mockImg from '@/app/mock.png';

export const Hero = () => {
   return (
      <>
         <div className="flex flex-col items-center justify-center w-full gap-3 px-6 sm:flex-row sm:mt-20">
            <div className="pt-13 flex flex-col gap-5">
               <div className="max-w-[600px] text-5xl font-semibold">
                  <h1 className="text-pink-500">Compassionate Care,</h1>
                  <h1>Seamlessly Organized</h1>
               </div>

               <span className="text-accents8 max-w-[680px] text-lg">
                  Heartly is your all-in-one solution for managing and enhancing care in Adult Residential Facilities. With an intuitive interface and powerful tools, Heartly helps you deliver personalized, heartfelt care with the efficiency and reliability you need.
               </span>

               <div className="flex flex-row gap-8 pt-4 w-[80%]">
                  <Button className='w-[30%]'>Learn More</Button>
                  <Button color='success' className='w-[70%]'>Get Started</Button>
               </div>

               <div className="flex flex-wrap gap-8 py-7 sm:py-4">
                  <div className="flex items-center text-accents7">
                     <CheckIcon /> Streamline Care Management.
                  </div>
                  <div className="flex items-center text-accents7">
                     <CheckIcon /> Build a Caring Community.
                  </div>
                  <div className="flex items-center text-accents7">
                     <CheckIcon /> Enhance Peace of Mind.
                  </div>
               </div>
            </div>

            <div>
               <Image className="w-[775px] object-contain" src={mockImg} alt="mockup" />
            </div>
         </div>

         <hr className="absolute inset-0 left-0 mt-10" />

      </>
   );
};
