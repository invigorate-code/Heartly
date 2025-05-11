import React from 'react';
import { BoxIcon } from '../icons/BoxIcon';


export const Faq = () => {
   return (
      <>
         <div className="flex flex-col py-20 px-6 gap-18">
            <div className="flex flex-col items-center">
               <span className="text-blue-600">FAQ</span>
               <h2>You Have Questions?</h2>
               <span className="max-w-[700px] text-accents8 text-center">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed condimentum,
                  nisl ut aliquam lacinia, nisl nisl aliquet aliquet.
               </span>
            </div>

            <div className="flex flex-col gap-10 lg:px-64">
               <div className="flex justify-center gap-5">
                  <BoxIcon />
                  <div className="flex flex-col gap-3">
                     <h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit?</h3>
                     <span className="text-accents8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                        condimentum, nisl ut aliquam lacinia, nisl nisl aliquet aliquet Lorem
                        ipsum dolor sit amet, consectetur adipiscing elit. Sed condimentum,
                        nisl ut aliquam lacinia, nisl nisl aliquet aliquet Lorem ipsum dolor
                        sit amet, consectetur adipiscing elit. Sed condimentum, nisl ut
                        aliquam lacinia, nisl nisl aliquet aliquet Lorem ipsum dolor sit amet,
                        aliquam lacinia, nisl nisl aliquet aliquet.
                     </span>
                     <span className="text-accents8">
                        elit. Sed condimentum, nisl ut aliquam lacinia, nisl nisl aliquet
                        aliquet elit. Sed condimentum, nisl ut aliquam lacinia, nisl nisl
                        aliquet aliquet elit. Sed condimentum, nisl ut aliquam lacinia, nisl
                        nisl aliquet aliquet elit. Sed condimentum, nisl ut aliquam lacinia,
                        nisl nisl aliquet aliquet.
                     </span>
                  </div>
               </div>

               <div className="flex justify-center gap-5">
                  <BoxIcon />
                  <div className="flex flex-col gap-3">
                     <h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit?</h3>
                     <span className="text-accents8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                        condimentum, nisl ut aliquam lacinia, nisl nisl aliquet aliquet Lorem
                        ipsum dolor sit amet, consectetur adipiscing adipiscing elit. Sed
                        condimentum, nisl ut aliquam lacinia, nisl nisl aliquet aliquet Lorem
                        ipsum dolor sit amet, consectetur adipiscing elit. Sed condimentum,
                        nisl ut aliquam lacinia, nisl nisl aliquet aliquet.
                     </span>
                     <span className="text-accents8">
                        elit. Sed condimentum, nisl ut aliquam lacinia, nisl nisl aliquet
                        aliquet elit. Sed condimentum, nisl ut aliquam lacinia, nisl nisl
                        aliquet aliquet elit. Sed condimentum, aliquet.
                     </span>
                  </div>
               </div>

               <div className="flex justify-center gap-5">
                  <BoxIcon />
                  <div className="flex flex-col gap-3">
                     <h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit?</h3>
                     <span className="text-accents8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                        condimentum, nisl ut aliquam lacinia, nisl nisl aliquet.
                     </span>
                     <span className="text-accents8">
                        elit. Sed condimentum, nisl ut aliquam lacinia, nisl nisl aliquet
                        aliquet elit. Sed condimentum, nisl ut aliquam lacinia, nisl nisl
                        aliquet aliquet elit. Sed condimentum, Sed condimentum, nisl ut
                        aliquam lacinia, nisl nisl aliquet aliquet.
                     </span>
                  </div>
               </div>

               <div className="flex justify-center gap-5">
                  <BoxIcon />
                  <div className="flex flex-col gap-3">
                     <h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit?</h3>
                     <span className="text-accents8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                        condimentum, nisl ut aliquam lacinia, nisl nisl aliquet aliquet Lorem
                        ipsum dolor sit amet, consectetur adipiscing.
                     </span>
                     <span className="text-accents8">
                        elit. Sed condimentum, nisl ut aliquam lacinia, nisl nisl aliquet
                        aliquet elit. Sed condimentum, nisl ut aliquam lacinia, nisl nisl
                        aliquet aliquet elit. Sed condimentum, nisl ut aliquam lacinia, nisl
                        nisl aliquet aliquet elit. Sed condimentum, nisl ut aliquam lacinia,
                        nisl nisl aliquet aliquet.
                     </span>
                  </div>
               </div>
            </div>
         </div>

         <hr className="absolute inset-0 left-0 mt-5" />

      </>
   );
};
