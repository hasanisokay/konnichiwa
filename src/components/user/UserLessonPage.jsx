'use client';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { defaultAvatarLink } from "@/constants/constantNames.mjs";
import Link from "next/link";
import { toast } from "react-toastify";

const UserLessonPage = ({ l, p }) => {
    const [previousProgress,setPreviousProgress] = useState(p)
    const user = useSelector(state => state.user.userData);
    const [allLessons, setAllLessons] = useState(l);
    const [totalWords, setTotalWords] = useState(0);
    const [learnedWords, setLearnedWords] = useState(0);
    const resetProgress = async () => {
        const res = await fetch("/api/puts/reset-progress", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail: user?.email }),
        })
        const data = await res.json();
        if (data?.status === 200) {
            toast.success(data?.message);
            setPreviousProgress([])
        }else{
            toast.error(data?.message)
        }

    }
    useEffect(() => {
        setAllLessons(l);

        // Calculate total words and learned words
        const total = l.reduce((sum, lesson) => sum + lesson.vocabSize, 0);
        const learned = l
            .filter(lesson => previousProgress.includes(lesson.lessonNumber))
            .reduce((sum, lesson) => sum + lesson.vocabSize, 0);

        setTotalWords(total);
        setLearnedWords(learned);
    }, [l, previousProgress]);
 
    return (
        <div className="container mx-auto px-4 py-6">
            {/* Welcome Screen */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-semibold text-blue-500">Welcome, {user?.name}!</h1>
                <p className="text-xl mt-2 text-gray-600 dark:text-gray-200">Let&#39;s start learning!</p>
                <Image 	priority={true} src={user.photoUrl || defaultAvatarLink} width={100} height={100} alt="User Avatar" className="w-20 h-20 rounded-full mx-auto mt-4" />
            </div>

            {/* Progress Bar */}
            <div className="mb-6">

                <h2 className="text-xl font-medium text-gray-700 dark:text-white mb-1">Overall Progress</h2>
                {previousProgress?.length > 0 && <div onClick={() => resetProgress()} className="text-right"><button>Reset</button></div>}

                <div className="w-full bg-gray-200 h-2 rounded-lg">
                    <div
                        className="bg-blue-500 h-2 rounded-lg"
                        style={{
                            width: `${(learnedWords / totalWords) * 100}%`,
                        }}
                    />
                </div>
                <p className="text-center mt-2 text-gray-500 dark:text-gray-300">
                    {learnedWords}/{totalWords} vocabularies learned ({parseInt((learnedWords / totalWords) * 100)}%)
                </p>

            </div>

            {/* Lessons List */}
            <h2 className="text-xl font-medium text-gray-700 dark:text-white mb-4">Available Lessons</h2>
            <div className="space-y-6">
                {allLessons.map((lesson) => (
                    <div key={lesson._id} className="flex items-center justify-between bg-white dark:bg-[#4c4c4c] p-6 rounded-lg shadow-lg">
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">{lesson.lessonName}</h3>
                            <p className="text-lg text-gray-600 dark:text-white">Lesson {lesson.lessonNumber}</p>
                            <p className="text-sm text-gray-500 dark:text-white">{lesson.vocabSize} vocabularies</p>
                        </div>
                        <Link
                            href={`/lessons/${lesson.lessonNumber}`}
                            className="inline-block py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            {previousProgress.includes(lesson.lessonNumber) ? "Review" : "Start Learning"}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserLessonPage;
