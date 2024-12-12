'use client';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./animation.css";
import SpeakerIcon from "../svg/SpeakerIcon";
import speakWord from "@/utils/speakWord.mjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const SingleLessonPage = ({ l }) => {
    const router = useRouter();
    const user = useSelector((state) => state.user.userData);
    const audioRef = useRef();
    const [lessonData, setLessonData] = useState(l[0] || {});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showComplete, setShowComplete] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (l?.length > 0) {
            setLessonData(l[0]);
        }
    }, [l]);

    const handleComplete = async () => {
        const res = await fetch("/api/posts/save-progress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ learnedLesson: lessonData.lessonNumber, email: user.email }),
            credentials: "include",
        });
        const data = await res.json();

        if (data.status === 200 || data.status === 204) {
            toast.success(data.message, {
                autoClose: 3000,
                position: "top-center",
            });
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
        }, 5000);
    };

    const handleSlideChange = (swiper) => {
        setCurrentIndex(swiper.activeIndex);
        if (swiper.activeIndex === lessonData?.vocabularies?.length - 1) {
            setShowComplete(true);
        } else {
            setShowComplete(false);
        }
    };

    return (
        <div className="relative">
            {showConfetti && <Confetti numberOfPieces={2000} width={window.innerWidth} height={window.innerHeight} />}
            <audio ref={audioRef} src="/sounds/applause.mp3" type="audio/mp3" preload="auto" />

            <div className="px-4 py-6 overflow-hidden">
                <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Showing {currentIndex + 1} of {lessonData?.vocabularies?.length}
                </p>

                <Swiper
                    onSlideChange={handleSlideChange}
                    spaceBetween={50}
                    slidesPerView={1}
                >
                    {lessonData?.vocabularies?.map((vocab, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white dark:bg-gray-800 p-6 lg:w-[500px] md:w-[400px] w-[300px] mx-auto min-h-[200px] rounded-lg shadow-md hover:shadow-lg transition">
                                <h3 className="text-xl  font-semibold text-gray-800 dark:text-white">{vocab.word}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex items-center">
                                    <span>Meaning: {vocab.meaning}</span>
                                    <SpeakerIcon clickHandler={() => speakWord(vocab.meaning, "en-US")} />
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                    <span>Pronunciation: {vocab.pronunciation}</span>
                                    <SpeakerIcon clickHandler={() => speakWord(vocab.pronunciation)} />
                                </p>
                                <p className="text-xs text-gray-400 mt-1">When to say: {vocab.whenToSay}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="flex justify-center mt-6 space-x-4">
                    <button
                        onClick={() => {
                            const swiper = document.querySelector(".swiper").swiper;
                            swiper.slidePrev();
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                        disabled={currentIndex === 0}
                    >
                        Previous
                    </button>
                    {!showComplete && <button
                        onClick={() => {
                            const swiper = document.querySelector(".swiper").swiper;
                            swiper.slideNext();
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 transition"
                        disabled={currentIndex === lessonData?.vocabularies?.length - 1}
                    >
                        Next
                    </button>}
                    {
                        showComplete && <button
                            onClick={handleComplete}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition"
                        >
                            Complete
                        </button>
                    }

                </div>

            </div>
        </div>
    );
};

export default SingleLessonPage;
