import React from 'react'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title as ChartTitle,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);
import Title from './Title'
import assets from '../assets/assets'
import {motion} from 'motion/react'


const OurWork = () => {
    // Example usage data for the analytics card
        const usageData = {
                used: 150,
                total: 200,
                months: [
                        { month: 'May', usage: 80 },
                        { month: 'Jun', usage: 120 },
                        { month: 'Jul', usage: 150 },
                        { month: 'Aug', usage: 170 },
                        { month: 'Sep', usage: 150 },
                ]
        };

        const chartData = {
            labels: usageData.months.map(m => m.month),
            datasets: [
                {
                    label: 'Usage (GB)',
                    data: usageData.months.map(m => m.usage),
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)', // indigo
                        'rgba(139, 92, 246, 0.8)', // purple
                        'rgba(236, 72, 153, 0.8)', // pink
                        'rgba(59, 130, 246, 0.8)', // blue
                        'rgba(251, 191, 36, 0.8)', // yellow
                    ],
                    borderRadius: 12,
                    maxBarThickness: 36,
                },
            ],
        };

        const chartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Usage: ${context.parsed.y}GB`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: '#6366F1',
                        font: { weight: 'bold' },
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#E0E7FF',
                    },
                    ticks: {
                        color: '#6366F1',
                        font: { weight: 'bold' },
                        callback: function(value) { return value + 'GB'; }
                    },
                },
            },
        };

    const workData = [
        {
            title: 'Subscription Plan Management',
            description: 'Easily manage, upgrade, or downgrade your subscription plans with real-time analytics and usage tracking.',
            image: assets.work_dashboard_management
        },
        {
            title: 'User Billing & Invoicing',
            description: 'Automated billing, invoicing, and payment tracking for seamless subscription experiences.',
            image: assets.work_mobile_app
        },
        {
            title: 'Usage Analytics (User View)',
            description: 'Visualize your plan usage with interactive charts and progress bars for a dashboard experience.',
            image: assets.work_fitness_app
        },
    ];


    return (
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            id='our-work' className='flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'>
                    <div className='flex flex-col items-center w-full max-w-2xl mx-auto'>
                        <div className='w-full rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-50/80 via-white/80 to-purple-100/80 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-indigo-900/80 backdrop-blur-md relative overflow-hidden mt-8'>
                            {/* Glassmorphism effect */}
                            <div className='absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-tr from-indigo-200/30 via-purple-200/20 to-transparent dark:from-indigo-900/30 dark:via-purple-900/20' />
                            <div className='relative z-10'>
                                <div className='mb-2 font-semibold text-lg text-indigo-700 dark:text-indigo-200 flex items-center gap-2'>
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="inline-block mr-1"><circle cx="12" cy="12" r="10" fill="url(#usageGradient)"/><defs><linearGradient id="usageGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#6366F1"/><stop offset="1" stopColor="#A21CAF"/></linearGradient></defs></svg>
                                    Usage Analytics (User View)
                                </div>
                                <div className='mb-3 text-sm font-medium text-gray-700 dark:text-gray-200'>
                                    <span className='font-bold text-indigo-600 dark:text-indigo-300'>{usageData.used}GB</span> of <span className='font-bold'>{usageData.total}GB</span> used
                                </div>
                                {/* Animated Progress Bar */}
                                <div className='w-full h-5 bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-200 dark:from-gray-800 dark:via-gray-900 dark:to-indigo-900 rounded-full overflow-hidden mb-6 border border-indigo-200 dark:border-indigo-800 shadow-inner'>
                                    <div
                                        className='h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse transition-all duration-700 rounded-full shadow-lg'
                                        style={{ width: `${(usageData.used / usageData.total) * 100}%` }}
                                    />
                                </div>
                                                        {/* Professional Usage Chart (Bar) with Chart.js */}
                                                        <div className='w-full h-96 mt-2 mb-1 flex items-center justify-center'>
                                                            <Bar data={chartData} options={{
                                                                ...chartOptions,
                                                                maintainAspectRatio: false,
                                                                aspectRatio: 2,
                                                                plugins: {
                                                                    ...chartOptions.plugins,
                                                                    legend: { display: false },
                                                                    title: { display: false },
                                                                },
                                                            }} className='w-full' />
                                                        </div>
                            </div>
                        </div>
                    </div>
        </motion.div>
    );
}

export default OurWork
