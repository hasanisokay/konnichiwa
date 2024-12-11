'use client'

import Image from "next/image";
import { useSelector } from "react-redux";

const AdminDashboard = ({ d }) => {
    // Access user data from Redux store
    const user = useSelector(state => state.user.userData);

    // Destructure the data from the API props
    const { totalUsers, usersJoinedToday, totalLessons, totalVocabularies } = d;
console.log(user.photoUrl)
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Greeting Section */}
            <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 rounded-lg shadow-lg text-white flex items-center space-x-6">
                <Image
                    src={user?.photoUrl || 'https://i.ibb.co.com/tPZFFkY/pngegg.png'} 
                    alt="User Photo" 
                    width={100}
                    height={100}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white"
                />
                <div>
                    <h2 className="text-2xl font-semibold">Welcome, {user?.name || "User"}!</h2>
                    <p className="text-sm opacity-80">{user?.email}</p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {/* Total Users */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h3 className="text-xl font-medium text-gray-700">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
                </div>
                {/* Users Joined Today */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h3 className="text-xl font-medium text-gray-700">Users Joined Today</h3>
                    <p className="text-3xl font-bold text-teal-600">{usersJoinedToday}</p>
                </div>
                {/* Total Lessons */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h3 className="text-xl font-medium text-gray-700">Total Lessons</h3>
                    <p className="text-3xl font-bold text-indigo-600">{totalLessons}</p>
                </div>
                {/* Total Vocabularies */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h3 className="text-xl font-medium text-gray-700">Total Vocabularies</h3>
                    <p className="text-3xl font-bold text-green-600">{totalVocabularies}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
