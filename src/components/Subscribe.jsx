import React, { useState } from 'react';
import { Send, CheckCircle } from "lucide-react";

const Subscribe = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        // NOTE: this only confirms in the UI for now - there's no mailing
        // list / subscribers table wired up on the backend yet. Hook this
        // up to Supabase or a Resend audience once that exists.
        setSubscribed(true);
        setEmail("");
    };

    return (
        <section className='w-full bg-[#eef0f3] py-20'> 
            <div className='max-w-[1200px] mx-auto px-6 md:px-12 flex justify-center'> 
                <div className='w-full max-w-[760px] bg-blue-700 border-2 border-black rounded-[28px] shadow-[6px_6px_0px_#000] px-6 md:px-12 py-12 text-center'> 

                    <div className='flex justify-center mb-6'> 
                        <div className='bg-blue-600 p-4 rounded-2xl'> 
                            <Send size={28} className='text-white'/>
                        </div>
                    </div> 

                    <h2 className='text-3xl md:text-5xl font-extrabold text-white'> 
                        Stay in the Loop
                    </h2>

                    <p className='text-white/90 mt-4 max-w-[520px] mx-auto text-base md:text-lg'>
                        Get the latest sets, building tips, and community highlights delivered to your inbox  
                    </p>

                    {subscribed ? (
                        <div className="mt-6 flex items-center justify-center gap-2 text-white font-semibold">
                            <CheckCircle size={22} />
                            Thanks! You're on the list.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='your@email.com'
                                className='w-full sm:w-[360px] bg-blue-500/70 text-white placeholder:text-white rounded-xl px-5 mt-4 py-4 outline-none focus:ring-2 focus:ring-yellow-300' 
                            /> 

                            <button
                                type="submit"
                                className='bg-yellow-400 text-black font-semibold px-8 cursor-pointer py-4 ml-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-[-2px] transition'    
                            > 
                            Subscribe
                            </button> 
                        </form>
                    )}
                </div>
            </div> 
        </section>
    )
};

export default Subscribe;
