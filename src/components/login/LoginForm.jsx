'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/slices/authSlice";
import { z } from "zod";
import Link from "next/link";

const loginSchema = z.object({
    email: z
        .string()
        .email('Invalid email address'),
    password: z
        .string()
        .min(3, 'Password must be at least 3 characters long')
        .max(20, 'Password must be at most 20 characters long'),
});

const LoginForm = ({ redirectTo }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const dispatch = useDispatch();
    const router = useRouter();

    // Submit handler
    const onSubmit = async (data) => {
        const res = await fetch('/api/posts/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const response = await res.json();

        if (response.status === 200) {
            const role = response.data.role;
            toast.success(`${response?.message}`, {
                position: "top-right",
                autoClose: 1000
            });
            dispatch(setUserData(response.data));
            if (role === "user") {
                window.location.href = "/lessons";

            } else if (role === "admin") {
                window.location.href = "/admin";
            }


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
                <h2 className="text-xl font-semibold text-black text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>

                    {/* Sign Up Link */}
                    <div className="mt-4 text-center">
                        <Link href="/signup" className="text-blue-600 hover:text-blue-700 text-sm">
                            Don&apos;t have an account? Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
