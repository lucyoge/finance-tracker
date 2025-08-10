import { Transaction, User } from '@/types';
import React, { FC, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Edit2, User as UserIcon, UserCheck, Users } from 'lucide-react';
import httpClient from '@/lib/axios';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useInitials } from '@/hooks/use-initials';

interface TransactionDetailsProps {
    transaction: Transaction;
    onClose: () => void;
}

export default function  TransactionDetails ({ transaction, onClose } : TransactionDetailsProps) {
    const [openAssignPanel, setOpenAssignPanel] = useState(false);

    return (
        <div>
            {/* Back Button */}
            <button
                onClick={onClose}
                className="mb-4 flex items-center text-blue-500 hover:underline focus:outline-none"
            >
                <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to transactions
            </button>

            {/* Transaction Details Section */}
            <section className='flex flex-col lg:flex-row justify-between items-start mb-6 px-6 py-4 rounded-xl shadow-2xl bg-white/50 backdrop-blur-2xl border border-corporate-blue/50 p-4'>
                <aside>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h2>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold capitalize">{transaction.type}</span>
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-semibold capitalize">{transaction?.category?.name}</span>
                    </div>
                </aside>
                {/* Assign Button */}
                <aside className='flex justify-end gap-2'>
                    <Button variant={'corporate-light'} className="mt-4 ml-auto text-xs sm:text-sm">
                        <Edit2 className="mr-1" />
                        Edit Transaction
                    </Button>
                </aside>
            </section>
            <section className="rounded-xl shadow-lg lg:p-10 gap-4  bg-white/50 backdrop-blur-2xl border border-corporate-blue/50 p-4">
                {/* Main Info */}
                <div className='lg:col-span-3 text-xl font-semibold text-gray-800 pb-3 mb-4 border-b border-gray-200'>
                    <h1>Transaction Details</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="mb-4">
                        <strong>Amount:</strong>
                        <p className="text-gray-700">{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </div>
                    <div className="mb-4">
                        <strong>Date:</strong>
                        <p className="text-gray-700">{new Date(transaction.transaction_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="mb-4">
                        <strong>Type:</strong>
                        <p className="text-gray-700 capitalize">{transaction.type}</p>
                    </div>
                    <div className="mb-4">
                        <strong>Category:</strong>
                        <p className="text-gray-700 capitalize">{transaction.category?.name}</p>
                    </div>
                    <div className="mb-4">
                        <strong>Payment Method:</strong>
                        <p className="text-gray-700 capitalize">{transaction.payment_method}</p>
                    </div>
                    <div className="mb-4 md:col-span-2">
                        <strong>Description:</strong>
                        <p className="text-gray-700">{transaction.description}</p>
                    </div>
                </div>


                {/* Description */}
                <div className="lg:col-span-2 flex flex-col justify-between">

                    {/* Contact/Action Section */}
                    {/* <div className="mt-6 flex flex-col md:flex-row gap-4">
                        {typeof transaction.contact_email === 'string' && transaction.contact_email && (
                            <a
                                href={`mailto:${transaction.contact_email}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition duration-150"
                            >
                                Contact Agent
                            </a>
                        )}
                        {typeof transaction.website === 'string' && transaction.website && (
                            <a
                                href={transaction.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow transition duration-150"
                            >
                                Visit Website
                            </a>
                        )}
                    </div> */}
                </div>
            </section>

            {/* Create a Fixed Right Hand side panel with higher z-index for displaying and search for users to assign properties to */}
            <div className={`flex flex-col fixed ${openAssignPanel ? 'right-0' : '-right-full'} w-full sm:w-80 top-0 h-full shadow-lg p-4 z-50 bg-white/50 backdrop-blur-2xl sm:rounded-l-2xl border border-corporate-blue/50 transition-all duration-500 ease-in-out`}>
                <section>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className="text-xl font-semibold">Assign Transaction</h2>
                        {/* Close button */}
                        <button
                            onClick={() => setOpenAssignPanel(false)}
                            className="text-white hover:text-gray-700 focus:outline-none bg-red-500 rounded-sm p-1"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18l12-12M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-slate-700 text-sm mb-4">Search for users to assign this transaction to:</p>
                    {/* User search and selection component can be implemented here */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
