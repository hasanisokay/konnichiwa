'use client'
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import "./animation.css"
import SpeakerIcon from "../svg/SpeakerIcon";
import speakWord from "@/utils/speakWord.mjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const SingleLessonPage = ({ l }) => {
    const router = useRouter();
    const user = useSelector(state => state.user.userData)
    const audioRef = useRef();
    const [lessonData, setLessonData] = useState(l[0] || {});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showComplete, setShowComplete] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [animationClass, setAnimationClass] = useState("fade-in");

    useEffect(() => {
        if (l?.length > 0) {
            setLessonData(l[0]);
            setCurrentIndex(0);
        }
    }, [l]);

    const handleNext = () => {
        if (currentIndex < lessonData?.vocabularies?.length - 1) {
            setAnimationClass("fade-out");
            setTimeout(() => {
                setCurrentIndex((prevIndex) => prevIndex + 1);
                setAnimationClass("fade-in");
            }, 300); // wait for fade-out to complete before changing word
        } else {
            setShowComplete(true);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setAnimationClass("fade-out");
            setTimeout(() => {
                setCurrentIndex((prevIndex) => prevIndex - 1);
                setAnimationClass("fade-in");
            }, 300); // wait for fade-out to complete before changing word
        }
    };

    const handleComplete = async () => {
        const res = await fetch('/api/posts/save-progress', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ learnedLesson: lessonData.lessonNumber, email: user.email }),
            credentials: 'include'
        })
        const data = await res.json();
        console.log(data)
        if (data.status === 200 || data.status === 204) {
            toast.success(data.message, {
                autoClose: 1000,
                position: 'top-center'
            })
        }

        if (audioRef.current) {
            audioRef.current.play();
        }

        setShowConfetti(true);
        document.body.style.overflow = "hidden";

        setTimeout(() => {
            setShowConfetti(false);
            document.body.style.overflow = "";
            router.push("/lessons");
        }, 7000);
    };

    const vocab = lessonData?.vocabularies?.[currentIndex];

    return (
        <div className="container mx-auto px-4 py-6 overflow-hidden">
            {showConfetti && <Confetti numberOfPieces={2000} width={window.innerWidth} height={window.innerHeight} />}
            <audio ref={audioRef} src="/sounds/applause.mp3" type="audio/mp3" preload="auto" />

            <div className="flex flex-col items-center justify-center">
                {vocab ? (
                    <div className={`bg-white p-6 md:min-w-[400px] min-w-[300px]  min-h-[200px] rounded-lg shadow-md hover:shadow-lg transition ${animationClass}`}>
                        <h3 className="text-xl font-semibold text-gray-800">
                            {vocab.word}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Meaning: {vocab.meaning}
                            <SpeakerIcon
                                clickHandler={() => speakWord(vocab.meaning, 'en-US')}
                            />
                        </p>
                        <p className="text-sm text-gray-500">Pronunciation: {vocab.pronunciation}
                            <SpeakerIcon
                                clickHandler={() => speakWord(vocab.pronunciation)}
                            />


                        </p>
                        <p className="text-xs text-gray-400 mt-1">When to say: {vocab.whenToSay}</p>
                    </div>
                ) : (
                    <p className="text-gray-500">No vocabulary to display.</p>
                )}

                {/* Navigation Buttons */}
                {!showComplete && (
                    <div className="flex items-center space-x-4 mt-6">
                        <button
                            onClick={handlePrev}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                            disabled={currentIndex === 0}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Complete Button */}
                {showComplete && (
                    <button
                        onClick={handleComplete}
                        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        Complete
                    </button>
                )}
            </div>
        </div>
    );
};

export default SingleLessonPage;
