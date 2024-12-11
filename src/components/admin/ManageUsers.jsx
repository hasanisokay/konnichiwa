'use client'
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SearchBox from "../search/SearchBox";

const ManageUsers = ({ u }) => {
    const user = useSelector(state => state.user.userData)
    const [users, setUsers] = useState(u)
    useEffect(() => {
        setUsers(u)
    }, [u])
    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`/api/puts/change-role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: userId, role: newRole, updatedBy: user.email }),
            });

            if (response.status === 200) {
                const data = await response.json();
                toast.success(data.message || "Role updated successfully");
                setUsers(prev => {
                    return prev.map(u => u._id === userId ? { ...u, role: newRole } : u)
                })
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to update role");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred");
        }
    };

    const userRows = useMemo(() => {
        return users.map((user) => (
            <tr
                key={user._id}
                className="border-b odd:bg-gray-100 dark:odd:bg-gray-700 even:bg-white dark:even:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
                <td className="py-2 px-4 text-sm">{user.name}</td>
                <td className="py-2 px-4 text-sm">{user.email}</td>
                <td className="py-2 px-4 text-sm">{user.role}</td>
                <td className="py-2 px-4 text-sm">{user.status}</td>
                <td className="py-2 px-4 text-sm">
                    {user.role === "user" ? (
                        <button
                            onClick={() => handleRoleChange(user._id, "admin")}
                            className="bg-green-500 min-w-[150px] text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Promote to Admin
                        </button>
                    ) : (
                        <button
                            onClick={() => handleRoleChange(user._id, "user")}
                            className="bg-red-500 min-w-[150px] text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Demote to User
                        </button>
                    )}
                </td>
            </tr>
        ));
    }, [users]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6 text-black">Manage Users</h1>
            <SearchBox placeholder={'search with name or email'}/>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                    <thead className="bg-slate-200 dark:bg-slate-600">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-medium min-w-[160]">Name</th>
                            <th className="py-3 px-4 text-left text-sm font-medium">Email</th>
                            <th className="py-3 px-4 text-left text-sm font-medium">Role</th>
                            <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                            <th className="py-3 px-4 md:text-left text-center text-sm font-medium min-w-[150px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>{userRows}</tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
