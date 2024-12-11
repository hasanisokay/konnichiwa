'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Select from 'react-select'; 


const vocabularySchema = z.object({
    word: z.string().min(1, 'Word is required'),
    pronunciation: z.string().min(1, 'Pronunciation is required'),
    whenToSay: z.string().min(1, 'Description is required'),
    lessonNumber: z.number().min(0, 'Lesson number must be greater than 0').int(),
    meaning: z.string().min(1, 'Meaning is required'),  
});

const AddNewVocabulary = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        resolver: zodResolver(vocabularySchema),
    });
    const user = useSelector(state => state.user.userData);
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);

    const handleLessonChange = (selectedOption) => {
        setSelectedLesson(selectedOption);
        setValue('lessonNumber', selectedOption.value);
    };

    useEffect(() => {
        const fetchLessons = async () => {
            if(lessons.length > 0) return;
            const res = await fetch('/api/gets/lesson-numbers');
            const data = await res.json();
            console.log(data?.data?.lessonNumbers)
            if (data?.status === 200) {
                setLessons(data?.data?.lessonNumbers);
            } else {
                toast.error('Failed to get lesson numbers.');
            }
        };

        fetchLessons();
    }, []);

    const lessonOptions = useMemo(() => 
        lessons?.map((lesson) => ({
          value: lesson.lessonNumber,
          label: `Lesson ${lesson.lessonNumber}: ${lesson.lessonName}`,
        })), [lessons]);

    const onSubmit = async (d) => {
        d.adminEmail = user.email;        
        const res = await fetch('/api/posts/add-new-vocabulary/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(d),
        });

        const data = await res.json();
        if (data?.status === 200) {
            toast.success(data?.message, {
                position: 'top-center',
                autoClose: 1500,
            });
            reset()
            setSelectedLesson(null)
        } else {
            toast.error(data.message, {
                position: 'top-center',
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Add New Vocabulary</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Word</label>
                    <input
                        type="text"
                        {...register('word')}
                        className={`w-full p-2 border border-gray-300 rounded-lg ${errors.word ? 'border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                    />
                    {errors.word && <p className="text-red-500 text-sm mt-1">{errors.word.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Pronunciation</label>
                    <input
                        type="text"
                        {...register('pronunciation')}
                        className={`w-full p-2 border border-gray-300 rounded-lg ${errors.pronunciation ? 'border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                    />
                    {errors.pronunciation && <p className="text-red-500 text-sm mt-1">{errors.pronunciation.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">When to Say</label>
                    <textarea
                        {...register('whenToSay')}
                        rows={4}
                        className={`w-full p-2 border border-gray-300 rounded-lg ${errors.whenToSay ? 'border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                    />
                    {errors.whenToSay && <p className="text-red-500 text-sm mt-1">{errors.whenToSay.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Meaning</label>
                    <textarea
                        {...register('meaning')}
                        rows={4}
                        className={`w-full p-2 border border-gray-300 rounded-lg ${errors.meaning ? 'border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                    />
                    {errors.meaning && <p className="text-red-500 text-sm mt-1">{errors.meaning.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Lesson No</label>
                    <Select
                        options={lessonOptions}
                        value={selectedLesson}
                        onChange={handleLessonChange}
                        className={`w-full ${errors.lessonNumber ? 'border-red-500' : ''}`}
                        placeholder="Select a lesson"
                        instanceId={"lessonNumberSelector"}
                    />
                    {errors.lessonNumber && <p className="text-red-500 text-sm mt-1">{errors.lessonNumber.message}</p>}
                </div>



                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            reset()
                            setSelectedLesson(null)
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNewVocabulary;
