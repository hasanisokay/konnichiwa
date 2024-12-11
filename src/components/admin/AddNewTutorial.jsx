'use client'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const tutorialSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title cannot exceed 100 characters"),
    url: z
        .string()
        .url("Invalid URL")
        .min(5, "URL must be at least 5 characters")
        .max(255, "URL cannot exceed 255 characters"),
});

const AddNewTutorial = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(tutorialSchema),
        defaultValues: {
            title: "",
            url: "",
        },
    });

    const user = useSelector(state => state.user.userData);

    const onSubmit = async (d) => {
        d.adminEmail = user.email;
        try {
            const res = await fetch('/api/posts/add-new-tutorial', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(d)
            })
            const data = await res.json();
            if (data.status === 200) {
                toast.success(`${data?.message}`, {
                    position: "top-right",
                    autoClose: 1000
                });
                reset();
            } else {
                toast.error(`${data?.message || data?.error}`, {
                    position: "top-center",
                    autoClose: 5000
                });
            }
        } catch (e) {
            toast.error(`${e?.message || "Error occurred. Try again."}`, {
                position: "top-center",
                autoClose: 5000
            });
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Tutorial</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        {...register("title")}
                        className={`w-full px-4 py-2 border rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Enter tutorial title"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                </div>

                {/* URL */}
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                        URL
                    </label>
                    <input
                        type="url"
                        id="url"
                        {...register("url")}
                        className={`w-full px-4 py-2 border rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.url ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Enter tutorial URL"
                    />
                    {errors.url && (
                        <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                    >
                        Add Tutorial
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNewTutorial;
