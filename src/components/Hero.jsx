import React from 'react';
import { Link } from "react-router-dom";
import pearl from '../assets/pearl.jpg'

const Hero = () => {
    return (
        <section className='w-full bg-[#f3f3f3] py-16'>
            <div className='max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center px-6 md:px-12'>
                {/*left side*/}
                <div>
                    {/*small writing */ }
                    <div className='inline-flex items-center gap-2 border border-yellow-500 text-black px-4 py-1 rounded-full mb-6'>  
                        <span className='w-2 h-2 bg-yellow-400 rounded-full'></span>
                        <span className='text-medium'>Build something amazing</span>
                    </div>

                    {/* big heading */ }
                    <h1 className='text-5xl md:text-6xl font-extrabold leading-tight'> 
                        <span className='text-black'>BUILD WHAT</span>
                        <br />
                        <span className='text-red-600'>YOU WANT</span>
                    </h1>

                    {/* description */ }
                    <p className='text-gray-600 mt-6 max-w-md'>
                        From iconic sets to rare minifigures, BrickHub is your one-stop shop
                        for everything LEGO. New, used, and retired. Browse our curated
                        catalog or search the full LEGO universe to find exactly what you're after.
                    </p>

                    {/* buttons */ }
                    <div className='flex gap-4 mt-8'> 
                        <Link to="/sets">
                            <button className='bg-red-600 text-white cursor-pointer px-6 py-3 rounded-full shadow-md hover:bg-red-700 transition'> 
                                Explore Sets
                            </button >
                        </Link>
                        <Link to="/minifigures">
                            <button className='border border-red-600 text-red-600 cursor-pointer px-6 py-3 rounded-full shadow-md hover:bg-red-100 transition'> 
                                Explore Minifigures
                            </button>
                        </Link>
                    </div>
                </div> 

                {/* right side */ }
                <div className='flex-justify-center'> 
                    <img 
                        src={pearl} alt="Pearl" className='w-full rounded-2xl border-2 border-black shadow-lg p-4 bg-white'
                    /> 
                </div>
            </div>
            <div className="mt-8 flex gap-4 justify-center">
  <Link
    to="/catalog/search"
    className="bg-black text-white px-8 py-4 rounded-full font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition"
  >
    Find Any LEGO
  </Link>
</div>
        </section>

        
    );
};

export default Hero;
