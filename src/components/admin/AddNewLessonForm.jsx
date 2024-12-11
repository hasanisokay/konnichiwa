'use client'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


const lessonSchema = z.object({
    lessonName: z
        .string()
        .min(3, "Lesson Name must be at least 3 characters")
        .max(100, "Lesson Name cannot exceed 100 characters"),
    lessonNumber: z
        .number({ invalid_type_error: "Lesson Number must be a number" })
        .positive("Lesson Number must be positive")
        .int("Lesson Number must be an integer"),
});
const AddNewLesson = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            lessonName: "",
            lessonNumber: "",
        },
    });
    const user = useSelector(state => state.user.userData);

    const onSubmit = async (d) => {
        d.adminEmail = user.email;
        try {
            const res = await fetch('/api/posts/add-new-lesson', {
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
            toast.error(`${e?.message || "Error occured. Try again."}`, {
                position: "top-center",
                autoClose: 5000
            });
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Lesson</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Lesson Name */}
                <div>
                    <label htmlFor="lessonName" className="block text-sm font-medium text-gray-700 mb-1">
                        Lesson Name
                    </label>
                    <input
                        type="text"
                        id="lessonName"
                        {...register("lessonName")}
                        className={`w-full px-4 py-2 border rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.lessonName ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Enter lesson name"
                    />
                    {errors.lessonName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lessonName.message}</p>
                    )}
                </div>

                {/* Lesson Number */}
                <div>
                    <label htmlFor="lessonNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Lesson Number
                    </label>
                    <input
                        type="number"
                        id="lessonNumber"
                        {...register("lessonNumber", { valueAsNumber: true })}
                        className={`w-full px-4 py-2 border rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.lessonNumber ? "border-red-500" : "border-gray-300"
                            }`}
                        placeholder="Enter lesson number"
                    />
                    {errors.lessonNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.lessonNumber.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                    >
                        Add Lesson
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNewLesson;


