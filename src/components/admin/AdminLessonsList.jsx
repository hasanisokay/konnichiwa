'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const AdminLessonsList = ({ lessons: l }) => {
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [originalLesson, setOriginalLesson] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [lessons, setLessons] = useState(l);

    useEffect(() => {
        setLessons(l);
    }, [l]);

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
        const res = await fetch('/api/deletes/delete-lesson', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedLesson),
        });
        const data = await res.json();
        if (data?.status === 200) {
            toast.success(data?.message, {
                position: 'top-center',
                autoClose: 1500,
            });
            setLessons(lessons.filter((lesson) => lesson._id !== selectedLesson._id));
        } else {
            toast.error(data?.message, {
                position: 'top-center',
                autoClose: 1500,
            });
        }
        setIsDeleting(false);
        setSelectedLesson(null);
    };

    const saveEdit = async () => {
        if (
            selectedLesson.lessonName === originalLesson.lessonName &&
            selectedLesson.lessonNumber === originalLesson.lessonNumber
        ) {
            toast.error('No change detected.', {
                position: 'top-center',
                autoClose: 1500,
            });
            return;
        }

        delete selectedLesson.vocabSize;
        const changeLessonNumber =
            selectedLesson.lessonNumber === originalLesson.lessonNumber;
        const res = await fetch('/api/puts/edit-lesson', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...selectedLesson,
                changeLessonNumber: !changeLessonNumber,
                previousLessonNumber: originalLesson.lessonNumber,
            }),
        });
        const data = await res.json();
        if (data?.status === 200) {
            toast.success(data?.message, {
                position: 'top-center',
                autoClose: 1500,
            });
            setLessons(
                lessons.map((lesson) =>
                    lesson._id === selectedLesson._id ? selectedLesson : lesson
                )
            );
        } else {
            toast.error(data?.message, {
                position: 'top-center',
                autoClose: 1500,
            });
        }
        setIsEditing(false);
        setSelectedLesson(null);
        setOriginalLesson(null);
    };

    return (
        <div className="bg-gray-50 p-2 md:p-8 text-black ">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6 ">Lessons</h1>
            <div className="bg-white shadow-lg rounded-lg ">
                {savedLessons?.length === 0 ? (
                    <p className="text-gray-500 text-center">No lessons available.</p>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="table-auto w-full text-sm md:text-base border border-gray-300">
                        <thead>
                   

                            <tr className='bg-gray-300 dark:bg-gray-900 text-black dark:text-white p-2 text-left'>
                                <th className="border border-gray-300 p-3 text-left max-w-[200px] break-words">
                                    Lesson Name
                                </th>
                                <th className="border border-gray-300 p-3 text-left max-w-[120px]">
                                    Lesson Number
                                </th>
                                <th className="border border-gray-300 p-3 text-left max-w-[150px]">
                                    Vocabulary Size
                                </th>
                                <th className="border border-gray-300 p-3 text-center max-w-[180px]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {savedLessons?.map((lesson) => (
                                <tr
                                    key={lesson._id}
                                    className="border-b dark:text-white odd:bg-gray-100 dark:odd:bg-gray-800 even:bg-white dark:even:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    >
                                    <td className="border border-gray-300 p-3 whitespace-normal break-words">
                                        {lesson.lessonName}
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                        {lesson.lessonNumber}
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                        {lesson.vocabSize}
                                    </td>
                                    <td className="border border-gray-300 p-3 font-semibold text-center">
                                        <button
                                            className="text-blue-600 dark:text-blue-300 hover:text-blue-800 transition"
                                            onClick={() => handleEdit(lesson)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 dark:text-[#ff0f10] hover:text-red-800 ml-4 transition"
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
                        <h2 className="text-lg md:text-xl font-bold mb-4">Edit Lesson</h2>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Lesson Name
                        </label>
                        <input
                            type="text"
                            value={selectedLesson.lessonName}
                            onChange={(e) =>
                                setSelectedLesson({ ...selectedLesson, lessonName: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        />
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Lesson Number
                        </label>
                        <input
                            type="number"
                            value={selectedLesson.lessonNumber}
                            onChange={(e) =>
                                setSelectedLesson({
                                    ...selectedLesson,
                                    lessonNumber: parseInt(e.target.value),
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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
                        <h2 className="text-lg md:text-xl font-bold mb-4">Delete Lesson</h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete the lesson {selectedLesson.lessonName}?
                            This operation is irreversible.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                onClick={() => setIsDeleting(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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
