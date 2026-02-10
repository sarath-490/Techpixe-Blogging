import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen py-12 transition-colors duration-200">
            <Helmet>
                <title>Contact Us - AI Insights</title>
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Contact Us</h1>
                    <p className="mt-4 text-xl text-gray-500 dark:text-slate-400">Have questions about AI or want to contribute? Get in touch.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                                    <Mail className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Email</h3>
                                <p className="mt-1 text-gray-500 dark:text-slate-400">info@techpixe.com</p>
                                
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                                    <MapPin className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Office</h3>
                                <p className="mt-1 text-gray-500 dark:text-slate-400">
                                    Sri Krishna Nagar<br />
                                    Yousufguda,<br />
                                    Hyderabad - 500045
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                                    <Phone className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Phone</h3>
                                <p className="mt-1 text-gray-500 dark:text-slate-400">+91 63541 07459</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-gray-50 dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors">
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Name</label>
                                <input type="text" className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Your name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
                                <input type="email" className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Message</label>
                                <textarea rows="4" className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="How can we help?"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
