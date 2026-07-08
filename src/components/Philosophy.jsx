import React from 'react';
import { Lightbulb, Puzzle, Heart } from 'lucide-react';

const Philosophy = () => {
    const items = [
        {icon: <Lightbulb size={28} />,
        title: "Imagination",
        desc: "Every brick is a possibility. There are no wrong answers, only new creations waiting to be discovoured.",
        },

        {icon: <Puzzle size={28} />,
        title: "Problem Solving",
        desc: "Building teaches patience, spacial thinking and the joy of turing complex ideas to tangible reality.",
        },

        {icon: <Heart size={28} />,
        title: "Community",
        desc: "MIllions of builders worldwide share, inspire and challenge eachother to creat something extraordinary.",
        },
    ];

    return(
        <section className='w-full bg-yellow-400 py-20'> 
            <div className='man-w-[1200px] mx-auto px-6 md:px-12 text-center'>

                {/* top text*/}
                <p className='text-lg font-semibold mb-3'>Our Philosophy</p>

                <h2 className='text-4xl md:text-5xl font-extrabold text-black'> 
                    "The only limit is your Imagination"
                </h2>

                <p className='text-gray-800 mt-4 max-w-2xl mx-auto'> 
                    For over 90 years, LEGO has inspired builders of all ages to dream bigger,
                    build bolder, and create without boundaries. Every set is a story.
                    Every brick is a beginning.
                </p>

                {/* cards */}
                <div className='grid md:grid-cols-3 gap-8 mt-16'> 
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className='bg-[#e8ddb8] border-2 border-black rounded-2xl p-8
                            shadow-[6px__6px_0px_#000] transtion-duration-300 
                            hover:-translate-y-2 hover:shadow-[10px_10px_0px_#000]'
                        >
                            {/* icon */}
                            <div className='flex justify-center mb-4'>
                                <div className='bg-yellow-400 p-3 rounded-xl border border-black'>
                                    {item.icon} 
                                </div> 
                            </div>  

                            {/* title */}
                            <h3 className='text-lg font-bold text-black mb-2'>
                                {item.title} 
                            </h3> 

                            {/* description */}
                            <p className='text-gray-700 text-sm'> 
                                {item.desc}
                            </p>
                        </div> 
                    ))}
                </div> 

            </div>
        </section> 
    )

};

export default Philosophy;
