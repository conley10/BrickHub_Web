import React from "react";
import { Globe, Boxes, Users, Target } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const stats = [
    { id: 1, icon: <Boxes size={28}/>, value: "1,200+", label: "Products Listed"},
    { id: 2, icon: <Globe size={28}/>, value: "30+", label: "Countries Served"},
    { id: 3, icon: <Target size={28}/>, value: "2", label: "Years In the Making"},
    { id: 4, icon: <Users size={28}/>, value: "500+", label: "Happy Customers"},
];

const About = () => {
  return (
    <div className="w-full bg-[#f3f3f3]">
        <section className="w-full bg-[#0b0b0d] border-b-2 border-black">
            <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
                <p className="text-yellow-400 text-sm md:text-base font bold mb-6">
                    New Buisness - Est. 2024
                </p>

                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white"> 
                    Built for Builders, 
                    <br />
                    <span className="text-yellow-400"> 
                        By Builders
                    </span>
                </h1>

                <p className="mt-8 text-gray-300 text-base md:text-xl max-w-[720px] mx-auto leading-relaxed"> 
                    BrickHub is a marketplace dedicated to LEGO fans everywhere. We make it simple to find new, used, and retired sets and minifigures — all in one place.
                </p> 
            </div> 
        </section>

        <section className="w-full bg-yellow-400 border-b-2 border-black"> 
            <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat) => (
                    <div key={stat.id} className="flex flex-col items-center">
                        <div className="mb-3 text-black">
                            {stat.icon}
                        </div>

                        <h3 className="text-4xl font-extrabold text-black">
                            {stat.value} 
                        </h3>

                        <p className="mt-1 text-sm md:text-base text-black">
                            {stat.label}
                        </p>

                    </div>
                ))}
            </div>
        </section>

        <section className="w-full py-20 pl-40 pr-40"> 
            <div className="max-w-[1200px] mx-auto px-6 md:grid-cols-2 gap-10 items-start"> 
                <p className="text-sm font-bold uppercase tracking-wider text-red-600"> 
                    Our Story
                </p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-black leading-tight"> 
                    Why BrickHub Exists 
                </h2>
                <p className="mt-6 text-gray-700 leading-relaxed">
                    BrickHub started with a simple idea: make it easier for LEGO fans to discover the sets and minifigures they actually want. Too often, collecting can feel scattered, confusing, or overpriced.
                </p> 
                <p className="mt-4 text-gray-700 leading-relaxed">
                    We wanted to build a clean, modern place where collectors, resellers, and casual builders could browse stock, compare condition, and find pieces they love without the clutter.
                </p>
                <p className="mt-4 text-gray-700 leading-relaxed pb-30"> 
                    This project is about more than just products — it is about the community, nostalgia, creativity, and excitement that LEGO brings to people of all ages.
                </p>
            </div>

            <div className="bg-red-600 border-2 border-black rounded-3xl p-8 shadow-[6px_6px_0px_#000]">
                <p className="text-sm font-bold uppercase tracking-wider text-yellow-300 mb-3"> 
                    Misson 
                </p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight"> 
                    A better place to buy and sell LEGO
                </h2>
                <p className="mt-6 text-white/90 leading-relaxed"> 
                    Our mission is to create a trusted marketplace for LEGO sets and minifigures, from brand new releases to rare retired favourites.
                </p>
                <p className="mt-6 text-white/90 leading-relaxed">
                    We want BrickHub to feel exciting for collectors, useful for sellers, and welcoming for anyone who just loves to build.
                </p>

                <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl p-5"> 
                    <p className="text-white font-semibold"> 
                        What makes BrickHub different? 
                    </p>
                    <ul className="mt-3 space-y-2 text-white/90">
                        <li>Clear product condition and stock visibility</li>
                        <li>Easy browsing for sets and minifigures</li>
                        <li>A collector-focused design and experience</li>
                    </ul>
                </div>
            </div>
        </section>

        <section className="w-full pb-20"> 
            <div className="max-w-[1200px] mx-auto px-6"> 
                <div className="text-center mb-14"> 
                    <p className="text-sm font-bold text-blue-600 mb-2">
                        What we stand for 
                    </p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-black">
                        Our Values
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-[#f3f3f3] border-2 hover:-translate-y-2 hover:shadow-red-500 transition duration-300 border-black rounded-2xl p-8 text-center shadow-[6px_6px_0px_#000]">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-yellow-400 flex items-center justify-center border-2 border-black">
                            💡
                        </div>
                        <h3 className="text-xl font-bold">
                            Passion Driven
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm">
                            We are builders first. Every decision we make comes from a genuine love of the hobby.
                        </p>
                    </div>

                    <div className="bg-[#f3f3f3] border-2 hover:-translate-y-2 hover:shadow-red-500 transition duration-300 border-black rounded-2xl p-8 text-center shadow-[6px_6px_0px_#000]">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-400 flex items-center justify-center border-2 border-black">
                            🧩
                        </div>
                        <h3 className="text-xl font-bold">
                            Quality Checked
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm">
                            Every used and retired product is reviewed and graded honestly so you know exactly what you're buying.
                        </p>
                    </div>

                    <div className="bg-[#f3f3f3] border-2 hover:-translate-y-2 hover:shadow-red-500 transition duration-300 border-black rounded-2xl p-8 text-center shadow-[6px_6px_0px_#000]">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-400 flex items-center justify-center border-2 border-black">
                            ❤️
                        </div>
                        <h3 className="text-xl font-bold">
                            Community First 
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm">
                            We exist because of our community. We listen, improve, and grow alongside our builders.
                        </p>
                    </div>

                    <div className="bg-[#f3f3f3] border-2 hover:-translate-y-2 hover:shadow-red-500 transition duration-300 border-black rounded-2xl p-8 text-center shadow-[6px_6px_0px_#000]">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-green-400 flex items-center justify-center border-2 border-black">
                            ✔️
                        </div>
                        <h3 className="text-xl font-bold">
                            Trusted Sourcing
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm">
                            We partner with verified sellers and collectors to bring you authentic, genuine LEGO products.
                        </p>
                    </div>

                    <div className="bg-[#f3f3f3] border-2 hover:-translate-y-2 hover:shadow-red-500 transition duration-300 border-black rounded-2xl p-8 text-center shadow-[6px_6px_0px_#000]">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-orange-400 flex items-center justify-center border-2 border-black">
                            🚀
                        </div>
                        <h3 className="text-xl font-bold">
                            Always Growing
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm">
                             We're a new business and proud of it. Expect new features, new stock, and new ideas regularly.
                        </p>
                    </div>

                    <div className="bg-[#f3f3f3] border-2 hover:-translate-y-2 hover:shadow-red-500 transition duration-300 border-black rounded-2xl p-8 text-center shadow-[6px_6px_0px_#000]">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-black flex items-center justify-center border-2 border-black">
                            🌍
                        </div>
                        <h3 className="text-xl font-bold">
                            Ship Worldwide
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm">
                            No matter where you are in the world, we aim to get your bricks to you safely and quickly.
                        </p>
                    </div>
                </div>
            </div>
        </section> 

        <section className="w-full bg-yellow-400 border-t-2 border-black">
            <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
                <h2 className="text-5xl md:text-6xl font-extrabold text-black leading-tight">
                    Ready to start building?
                </h2>
                <p className="mt-6 text-lg md:text-xl max-w-[700px] mx-auto leading-relaxed">
                    Browse our sets and minifigures, and become part of the BrickHub community.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        to="/sets"
                        className="bg-black text-white px-8 py-4 rounded-full font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition cursor-pointer"
                    >
                        Browse Sets 
                    </Link>

                    <Link 
                        to="/minifigures"
                        className="bg-white text-black px-8 py-4 rounded-full font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition cursor-pointer"
                    >
                        Shop Minifigures 
                    </Link>
                </div>
            </div>
        </section>

        <Footer />
    </div>
  );
};

export default About;