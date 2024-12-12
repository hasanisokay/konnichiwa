'use client';
import React, { useState } from "react";

const UserTutorialList = ({ t }) => {
    const [selectedTutorial, setSelectedTutorial] = useState(null);

    const openInModal = (tutorial) => setSelectedTutorial(tutorial);
    const closeModal = () => setSelectedTutorial(null);
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Tutorial List</h1>
            <div className="grid gap-4">
                {t?.map((tutorial) => (
                    <div key={tutorial._id} className="bg-white dark:bg-[#4c4c4c] shadow-md rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-2 ">{tutorial.title}</h2>
                        <div className="flex gap-4">
                            <button
                                onClick={() => openInModal(tutorial)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Watch Here
                            </button>
                            <a
                                href={tutorial.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Open in New Tab
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {selectedTutorial && (
                <div className="fixed bg-black inset-0 flex items-center justify-center  bg-opacity-70 z-50">
                    <div className=" rounded-xl  w-[80%] h-[80%] lg:w-[50%] lg:h-[50%] md:w-[60%] md:h-[60%] p-6 relative">
                        <div className="w-full aspect-video relative">
                            <iframe
                                src={selectedTutorial.url.replace("watch?v=", "embed/") + "?autoplay=1"}
                                title={selectedTutorial.title}
                                className="w-full h-full rounded-xl"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                            
<button className="text-white absolute top-0 right-0 p-2 bg-red-500 rounded-lg" onClick={closeModal} >Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTutorialList;
