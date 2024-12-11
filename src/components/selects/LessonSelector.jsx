'use client'
import { useEffect, useMemo, useState } from "react";
import Select from 'react-select';

const LessonSelector = ({ changeHandler, value }) => {
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    useEffect(() => {
        const fetchLessons = async () => {
            if (lessons.length > 0) return;
            const res = await fetch('/api/gets/lesson-numbers', { credentials: 'include' });
            const data = await res.json();
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


    const handleLessonChange = (selectedOption) => {
        setSelectedLesson(selectedOption);
        changeHandler(selectedOption)
    };

    return (
        <div>
            <Select
                options={lessonOptions}
                value={selectedLesson || value}
                onChange={handleLessonChange}
                className={`w-full text-black`}
                placeholder="Select a lesson"
                instanceId={"lessonNumberSelector"}
            />
        </div>
    );
};

export default LessonSelector;