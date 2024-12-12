'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import uploadImage from "@/utils/uploadImage.mjs";



const registerSchema = z.object({
    name: z
        .string()
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name must be at most 50 characters long'),

    email: z
        .string()
        .email('Invalid email address'),
    photoUrl: z
        .any()
        .optional(),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long'),

    confirmPassword: z
        .string()
        .min(6, 'Confirm Password must be at least 6 characters long'),
})
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords must match',
    })


const SignUpForm = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(registerSchema),
    });
    const router = useRouter();

    const checkEmailAvailability = async (email) => {
        const res = await fetch("/api/posts/check-email-availability", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email }),
            credentials: 'include'
        })
        const data = await res.json();
        if (!data.emailAvailable) {
            toast.error(data.message, {
                position: "top-center",
                autoClose: 1500,
            });
        }
        return data.emailAvailable;
    }

    const onSubmit = async (data) => {
        const isEmailAvailable = await checkEmailAvailability(data?.email);
        if (!isEmailAvailable) return;
        const file = data?.photoUrl ? data?.photoUrl[0] : null;
        if (!file) {
            return toast.error('Select Image File', {
                position: "top-center",
                autoClose: 1500,
            });
        }
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please upload a valid image file (JPEG, JPG, PNG)', {
                    position: "top-center",
                    autoClose: 5000,
                });
                return;
            }
            const maxFileSize = 2 * 1024 * 1024;

            if (file.size > maxFileSize) {
                toast.error('File size must be less than 2MB', {
                    position: "top-center",
                    autoClose: 5000,
                });
                return;
            }
            setLoading(true);
            const photoUrl = await uploadImage(file);
            if (photoUrl) {
                data.photoUrl = photoUrl;
            }
        }
        const res = await fetch('/api/posts/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });
        const response = await res.json();
        setLoading(false)
        if (response.status === 200) {
            toast.success(`${response?.message}`, {
                position: "top-center",
                autoClose: 1500
            });
            router.replace('/login');
        } else {
            toast.error(`${response?.message || response?.error}`, {
                position: "top-center",
                autoClose: 5000
            });
        }
    };
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="w-full sm:w-96 p-6 shadow-lg rounded-lg bg-white">
                <h2 className="text-xl font-semibold text-black text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${loading && 'form-disabled'}`}>
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            {...register('name')}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email')}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Photo Upload Input */}
                    <div>
                        <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">
                            Profile Photo
                        </label>
                        <input
                            id="photoUrl"
                            type="file"
                            accept="image/*"
                            {...register('photoUrl')}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {errors.photoUrl && (
                            <p className="text-sm text-red-500 mt-1">{errors.photoUrl.message}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register('password')}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            {...register('confirmPassword')}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Register"}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 text-sm">
                        Already have an account? Log in.
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
