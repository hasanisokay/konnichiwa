'use client'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { defaultAvatarLink } from "@/constants/constantNames.mjs";
import Link from "next/link";

const UserLessonPage = ({ l }) => {
    const user = useSelector(state => state.user.userData);
    const [allLessons, setAllLessons] = useState(l);
    const [progress, setProgress] = useState({});
    const [totalWords, setTotalWords] = useState(0);
    useEffect(() => { setAllLessons(l) }, [l])
    // in allLessons its an array. with objects like,
    // {
    //     "_id": "6759ad43dff25a801a9fb58a",
    //     "lessonName": "First",
    //     "lessonNumber": 1,
    //     "vocabSize": 2
    // }
    // now show them properly with start learning button on each lesson. it will be next link. with href '/lessons/lessonNumber'
    // keep the rest as same before.
    // use pro styling
    return (
        <div className="container mx-auto px-4 py-6">
            {/* Welcome Screen */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-semibold text-blue-500">Welcome, {user?.name}!</h1>
                <p className="text-xl mt-2 text-gray-600">Lets start learning!</p>
                <Image src={user?.photoUrl || defaultAvatarLink} width={100} height={100} alt="User Avatar" className="w-20 h-20 rounded-full mx-auto mt-4" />
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <h2 className="text-xl font-medium text-gray-700">Overall Progress</h2>
                <div className="w-full bg-gray-200 h-2 rounded-lg">
                    <div
                        className="bg-blue-500 h-2 rounded-lg"
                        style={{
                            width: `${(Object.values(progress).flat().filter(Boolean).length / totalWords) * 100}%`,
                        }}
                    />
                </div>
                <p className="text-center mt-2 text-gray-500">{Object.values(progress).flat().filter(Boolean).length}/{totalWords} words learned</p>
            </div>
            {/* lessons list */}
            <div className="space-y-6">
                {allLessons.map((lesson) => (
                    <div key={lesson.lessonNumber} className="flex items-center justify-between bg-white p-6 rounded-lg shadow-lg">
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-800">{lesson.lessonName}</h3>
                            <p className="text-lg text-gray-600">Lesson {lesson.lessonNumber}</p>
                            <p className="text-sm text-gray-500">{lesson.vocabSize} vocabularies</p>
                        </div>
                        <Link
                            href={`/lessons/${lesson.lessonNumber}`}
                            className="inline-block py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Start Learning
                        </Link>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default UserLessonPage;
