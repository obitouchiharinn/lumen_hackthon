import React from 'react'
import assets from '../assets/assets'
import {motion} from 'motion/react'

const Footer = ({theme}) => {
  return (
    <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className='bg-slate-50 dark:bg-gray-900 pt-10 sm:pt-10 mt-20 sm:mt-40 px-4 sm:px-10 lg:px-24 xl:px-40'>
      {/* footer top  */}
      <div className='flex justify-between lg:items-center max-lg:flex-col gap-10'>

        <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className='space-y-5 text-sm text-gray-700 dark:text-gray-400'>
            <img src={theme === 'dark' ? assets.logo_dark : assets.logo} className='w-32 sm:w-44' alt="" />

            <p className='max-w-md'>Empowering you to manage subscriptions, track usage, and view analytics with a modern dashboard experience.</p>

      <ul className='flex gap-8'>
        <li><a className='hover:text-primary' href="#hero">Dashboard</a></li>
        <li><a className='hover:text-primary' href="#services">Plans</a></li>
        <li><a className='hover:text-primary' href="#our-work">Usage Analytics</a></li>
        <li><a className='hover:text-primary' href="#contact-us">Support</a></li>
      </ul>
        </motion.div>
        <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className='text-gray-600 dark:text-gray-400'>
            <h3 className='font-semibold'>Stay updated on subscription features</h3>
            <p className='text-sm  mt-2 mb-6'>Get the latest updates, feature releases, and tips for managing your subscriptions, sent to your inbox.</p>
            <div className='flex gap-2 text-sm'>
                <input type="email" placeholder='Enter your email' className='w-full p-3 text-sm outline-none rounded dark:text-gray-200 bg-transparent border border-gray-300 dark:border-gray-500'/>
                <button className='bg-primary text-white rounded px-6'>Subscribe</button>
            </div>
        </motion.div>
      </div>
      <hr className='border-gray-300 dark:border-gray-600  my-6'/>

      {/* footer bottom */}
      <motion.div 
      initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    viewport={{ once: true }}
      className='pb-6 text-sm text-gray-500 flex justify-center sm:justify-between gap-4 flex-wrap'>
  <p>Copyright 2025 © Subscriptly - All Rights Reserved.</p>
        <div className='flex items-center justify-between gap-4'>
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.instagram_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Footer
