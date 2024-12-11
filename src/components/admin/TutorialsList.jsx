'use client'

import formatDate from "@/utils/formatDate.mjs";
import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";

const TutorialsList = ({ t }) => {
    const [tutorials, setTutorials] = useState(t);
    useEffect(() => {
        setTutorials(t)
    }, [t])
    const handleDelete = async (tutorialId) => {
        const confirmed = window.confirm("Are you sure you want to delete this tutorial?");

        if (confirmed) {
            try {
                const res = await fetch('/api/deletes/delete-tutorial', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tutorialId }),
                });

                const data = await res.json();

                if (res.ok) {
                    setTutorials((prevTutorials) =>
                        prevTutorials.filter((tutorial) => tutorial._id !== tutorialId)
                    );
                    toast.success(data.message || 'Tutorial deleted successfully!');
                } else {
                    toast.error(data.message || 'Failed to delete tutorial.');
                }
            } catch (error) {
                console.error('Error deleting tutorial:', error);
                toast.error('An error occurred while deleting the tutorial.');
            }
        } else {
            toast.info("Tutorial deletion was canceled.");
        }
    };


    const memoizedTutorials = useMemo(() => tutorials, [tutorials]);

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tutorials</h2>

            {/* Check if there's any tutorial */}
            {memoizedTutorials?.length === 0 ? (
                <p className="text-center text-lg text-gray-500">No tutorials available</p>
            ) : (
                <div className="space-y-6">
                    {memoizedTutorials.map((tutorial) => (
                        <div key={tutorial._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-100 transition-all">
                            <div className="flex items-center justify-between">
                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900">{tutorial.title}</h3>
                                <a
                                    href={tutorial.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Watch Tutorial
                                </a>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Admin:</span> {tutorial.adminEmail}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                <span className="font-medium">Created on:</span> {formatDate(tutorial.createdOn)}
                            </p>
                            <div className="mt-4 flex justify-between items-center">
                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(tutorial._id)}
                                    className="bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TutorialsList;
