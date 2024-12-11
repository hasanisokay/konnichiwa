'use client'
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";

const LessonFilter = () => {
    const [lessons, setLessons] = useState([])
    const [selectedLesson, setSelectedLesson] = useState(null);
    const router = useRouter()
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        const fetchLessons = async () => {
            if (lessons.length > 0) return;
            const res = await fetch('/api/gets/lesson-numbers');
            const data = await res.json();
            if (data?.status === 200) {
                setLessons(data?.data?.lessonNumbers);
            } else {
                toast.error('Failed to get lesson numbers.');
            }
        };

        fetchLessons();
    }, []);

    useEffect(() => {
        if (hasMounted) {

            const query = new URLSearchParams(window.location.search);
            query.set('lesson_no', selectedLesson?.value||"");
            router.replace(`${window.location.pathname}?${query.toString()}`, { scroll: false });
        } else {
            setHasMounted(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLesson]);

    const lessonOptions = useMemo(() =>
        lessons?.map((lesson) => ({
            value: lesson.lessonNumber,
            label: `Lesson ${lesson.lessonNumber}: ${lesson.lessonName}`,
        })), [lessons]);


    return (
        <div>
            <Select
                options={lessonOptions}
                value={selectedLesson}
                onChange={setSelectedLesson}
                placeholder="Select a Lesson"
                className="text-black"
                isClearable
                instanceId={'lessonSelectorInAdmin'}
            />
        </div>
    );
};

export default LessonFilter;