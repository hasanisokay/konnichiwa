'use client';
import formatDate from "@/utils/formatDate.mjs";
import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";

const TutorialsList = ({ t }) => {
    const [tutorials, setTutorials] = useState(t);
    const [showModal, setShowModal] = useState(false);
    const [selectedTutorial, setSelectedTutorial] = useState(null);

    useEffect(() => {
        setTutorials(t);
    }, [t]);

    const handleDelete = async () => {
        if (!selectedTutorial) return;

        try {
            const res = await fetch('/api/deletes/delete-tutorial', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tutorialId: selectedTutorial._id }),
            });

            const data = await res.json();

            if (res.ok) {
                setTutorials((prevTutorials) =>
                    prevTutorials.filter((tutorial) => tutorial._id !== selectedTutorial._id)
                );
                toast.success(data.message || 'Tutorial deleted successfully!');
            } else {
                toast.error(data.message || 'Failed to delete tutorial.');
            }
        } catch (error) {
            console.error('Error deleting tutorial:', error);
            toast.error('An error occurred while deleting the tutorial.');
        } finally {
            setShowModal(false);
            setSelectedTutorial(null);
        }
    };

    const confirmDelete = (tutorial) => {
        setSelectedTutorial(tutorial);
        setShowModal(true);
    };

    const memoizedTutorials = useMemo(() => tutorials, [tutorials]);

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Tutorials</h2>

            {memoizedTutorials?.length === 0 ? (
                <p className="text-center text-lg text-gray-500 dark:text-gray-400">No tutorials available</p>
            ) : (
                <div className="space-y-6">
                    {memoizedTutorials.map((tutorial) => (
                        <div
                            key={tutorial._id}
                            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{tutorial.title}</h3>
                                <a
                                    href={tutorial.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Watch Tutorial
                                </a>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                <span className="font-medium">Admin:</span> {tutorial.adminEmail}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <span className="font-medium">Created on:</span> {formatDate(tutorial.createdOn)}
                            </p>
                            <div className="mt-4 flex justify-between items-center">
                                <button
                                    onClick={() => confirmDelete(tutorial)}
                                    className="bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Confirm Deletion</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Are you sure you want to delete the tutorial{" "}
                            <strong>{selectedTutorial.title}</strong>?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TutorialsList;
