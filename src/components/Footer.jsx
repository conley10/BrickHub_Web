import React from 'react'
import { Link } from 'react-router-dom'
import {
    FaDribbbleSquare,
    FaFacebookSquare,
    FaGithubSquare,
    FaInstagramSquare,
    FaTwitterSquare
} from 'react-icons/fa'

const Footer = () => {
  return (
    <div className='w-full mx-auto py-16 px-34 grid lg:grid-cols-3 gap-8 text-gray-300 bg-gray-950'>
        <div>
            <div className='flex items-center gap-3'>
                <div className='h-9 w-9 rounded-full bg-red-600'></div>
                <h1 className='text-3xl font-extrabold'>
                    <span className='text-white'>BRICK</span>
                    <span className='text-red-600'>HUB</span>
                </h1>
            </div>

            <p className='py-4'> Your source for new, used, and retired LEGO sets and minifigures. Can't find what you're after in the shop? Search the full LEGO catalog and we'll help you track it down. </p>
            <div className='flex md:w-[75%] my-6 justify-between '>
                <FaFacebookSquare size={30} className='cursor-pointer hover:text-yellow-300 hover:translate-y-[-2px]' />
                <FaInstagramSquare size={30} className='cursor-pointer hover:text-yellow-300 hover:translate-y-[-2px]' />
                <FaTwitterSquare size={30} className='cursor-pointer hover:text-yellow-300 hover:translate-y-[-2px]' />
                <FaGithubSquare size={30} className='cursor-pointer hover:text-yellow-300 hover:translate-y-[-2px]' />
                <FaDribbbleSquare size={30} className='cursor-pointer hover:text-yellow-300 hover:translate-y-[-2px]' />
            </div>
        </div>
        <div className='lg:col-span-2 flex justify-between mt-6 mr-40'>
            <div>
                <h6 className='font-bold'> SHOP </h6>
                <ul>
                    <li className='py-2 text-sm'><Link to='/sets' className='hover:text-red-600'>Sets</Link></li>
                    <li className='py-2 text-sm'><Link to='/minifigures' className='hover:text-red-600'>Minifigures</Link></li>
                    <li className='py-2 text-sm'><Link to='/catalog/search' className='hover:text-red-600'>Source a Set</Link></li>
                </ul>
            </div>
            <div>
                <h6 className='font-bold'> COMPANY </h6>
                <ul>
                    <li className='py-2 text-sm'><Link to='/about' className='hover:text-red-600'>About Us</Link></li>
                    <li className='py-2 text-sm'><Link to='/contact' className='hover:text-red-600'>Contact</Link></li>
                </ul>
            </div>
            <div>
                <h6 className='font-bold'> YOUR ORDER </h6>
                <ul>
                    <li className='py-2 text-sm'><Link to='/cart' className='hover:text-red-600'>Cart</Link></li>
                    <li className='py-2 text-sm'><Link to='/checkout' className='hover:text-red-600'>Checkout</Link></li>
                </ul>
            </div>

        </div>
    </div>
  )
}

export default Footer