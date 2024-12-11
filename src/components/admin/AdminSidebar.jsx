'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const AdminSidebar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/manage-users', label: 'Manage Users' },
        { href: '/admin/add-lesson', label: 'Add Lesson' },
        { href: '/admin/lessons', label: 'Lessons' },
        { href: '/admin/add-vocabulary', label: 'Add Vocabulary' },
        { href: '/admin/vocabulary-management', label: 'Vocabularies' },
        { href: '/admin/add-tutorial', label: 'Add Tutorial' },
        { href: '/admin/tutorials', label: 'Tutorials' },
    ];

    return (
        <div className="relative md:static md:top-0 md:bottom-0  h-auto flex-shrink-0 md:w-64 w-full md:bg-gray-800 bg-background/95 bg-white backdrop-blur-md supports-[backdrop-filter]:bg-background/60">

            {/* Toggle Button */}
            <button
                className="md:hidden p-4 bg-gray-700 text-white w-full flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-bold">Menu</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {/* Sidebar Content */}
            <aside
                className={`absolute md:sticky top-[56px] text-white left-0 w-full md:w-auto bg-gray-800 md:block transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 md:h-fit p-4`}
            >
                <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
                <ul className="space-y-4">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`block py-2 px-4 rounded ${pathname === link.href
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                onClick={() => setIsOpen(false)} // Close menu on link click
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
};

export default AdminSidebar;
