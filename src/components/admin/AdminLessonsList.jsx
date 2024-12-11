'use client'

import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const AdminLessonsList = ({ lessons: l }) => {
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [originalLesson, setOriginalLesson] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [lessons, setLessons] = useState(l);

    const savedLessons = useMemo(() => lessons, [lessons]);
    const handleEdit = (lesson) => {
        setSelectedLesson({ ...lesson });
        setOriginalLesson({ ...lesson });
        setIsEditing(true);
    };

    const handleDelete = (lesson) => {
        setSelectedLesson(lesson);
        setIsDeleting(true);
    };

    const confirmDelete = async () => {
        const res = await fetch("/api/deletes/delete-lesson", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(selectedLesson)
        });
        const data = await res.json()
        if (data?.status === 200) {
            toast.success(data?.message, {
                position: "top-center",
                autoClose: 1500
            })
            setLessons(lessons.filter((lesson) => lesson._id !== selectedLesson._id));
        } else {
            toast.error(data?.message, {
                position: "top-center",
                autoClose: 1500
            })
        }
        setIsDeleting(false);
        setSelectedLesson(null);
    };

    const saveEdit = async () => {
        if (
            selectedLesson.lessonName === originalLesson.lessonName &&
            selectedLesson.lessonNumber === originalLesson.lessonNumber
        ) {
            toast.error("No change detected.", {
                position: "top-center",
                autoClose: 1500
            })
            return;
        }
        const res = await fetch("/api/puts/edit-lesson", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(selectedLesson)
        });
        const data = await res.json()
        if (data?.status === 200) {
            toast.success(data?.message, {
                position: "top-center",
                autoClose: 1500
            })
            setLessons(lessons.map((lesson) =>
                lesson._id === selectedLesson._id ? selectedLesson : lesson
            ));
        } else {
            toast.error(data?.message, {
                position: "top-center",
                autoClose: 1500
            })
        }
        setIsEditing(false);
        setSelectedLesson(null);
        setOriginalLesson(null);
    };

    return (
        <div className="bg-gray-100 md:p-6">
            <h1 className="text-2xl p-4 md:p-0 font-bold text-gray-700 mb-4">Lessons</h1>
            <div className="bg-white shadow rounded-lg md:p-4 w-full">
                {savedLessons?.length === 0 ? (
                    <p className="text-gray-500 text-center">No lessons available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2 text-left">Lesson Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Lesson Number</th>
                                    <th className="border border-gray-300 p-2 text-left">Vocabulary Size</th>
                                    <th className="border border-gray-300 p-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedLessons?.map((lesson) => (
                                    <tr key={lesson._id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2">{lesson.lessonName}</td>
                                        <td className="border border-gray-300 p-2">{lesson.lessonNumber}</td>
                                        <td className="border border-gray-300 p-2">{lesson.vocabSize}</td>
                                        <td className="border border-gray-300 p-2 text-center">
                                            <button
                                                className="text-blue-500 hover:underline mx-2"
                                                onClick={() => handleEdit(lesson)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-500 hover:underline mx-2"
                                                onClick={() => handleDelete(lesson)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditing && selectedLesson && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Edit Lesson</h2>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Lesson Name</label>
                        <input
                            type="text"
                            value={selectedLesson.lessonName}
                            onChange={(e) =>
                                setSelectedLesson({ ...selectedLesson, lessonName: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        />
                        <label className="block mb-2 text-sm font-medium text-gray-700">Lesson Number</label>
                        <input
                            type="number"
                            value={selectedLesson.lessonNumber}
                            onChange={(e) =>
                                setSelectedLesson({ ...selectedLesson, lessonNumber: parseInt(e.target.value) })
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                onClick={saveEdit}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {isDeleting && selectedLesson && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Delete Lesson</h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete the lesson {selectedLesson.lessonName}?
                            It will delete {selectedLesson.vocabSize > 0 ? selectedLesson.vocabSize :"all"} vocabularies in it too. This operation is irreversible.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => setIsDeleting(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                onClick={confirmDelete}
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

export default AdminLessonsList;
