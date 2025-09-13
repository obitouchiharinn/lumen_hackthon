
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

const ServiceCard = ({ service, index }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);
    const divRef = useRef(null);

    const handleMouseMove = (e) => {
        const bounds = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className='relative overflow-hidden max-w-lg m-2 sm:m-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl shadow-gray-100 dark:shadow-white/10'
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            ref={divRef}
            onMouseMove={handleMouseMove}
        >
            {/* Service Title and Description (from Services.jsx) */}
            <div className='flex flex-col items-center gap-2 p-6 pb-2 bg-white dark:bg-gray-900 z-10 relative w-full'>
                <h3 className='font-bold text-xl text-center'>{service.title}</h3>
                <p className='text-sm text-center text-gray-600 dark:text-gray-300'>{service.description}</p>
            </div>
            {/* Pricing Plan Cards including Student Offer */}
            <div className="w-full flex flex-col gap-4 p-6 pt-2">
                {[
                    { name: 'Starter Plan', price: '₹499/month' },
                    { name: 'Pro Plan', price: '₹999/month' },
                    { name: 'Enterprise Plan', price: '₹1999/month' },
                    { name: 'Student Offer', price: '₹299/month' }
                ].map((plan) => (
                    <div key={plan.name} className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 bg-gray-50 dark:bg-gray-800">
                        <div className="flex flex-col">
                            <span className="font-semibold text-lg">{plan.name}</span>
                            <span className="text-gray-600 dark:text-gray-300 text-sm">{plan.price}</span>
                        </div>
                        <button className="ml-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">Subscribe</button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ServiceCard;
