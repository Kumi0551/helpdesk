// app/Components/UserCard.tsx
"use client";

import Link from "next/link";
import { FaUser } from "react-icons/fa";

interface UserCardProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    isActive?: boolean;
  };
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link href={`/admin/users/${user.id}`} className="block mb-4">
      <div
        className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow ${
          user.isActive ? "hover:border-purple-300" : "border-2 border-red-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center ${
              user.isActive ? "bg-slate-200" : "bg-red-100"
            }`}
          >
            <FaUser
              className={user.isActive ? "text-slate-600" : "text-red-500"}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className={`font-medium truncate ${
                  user.isActive ? "text-slate-900" : "text-red-900"
                }`}
              >
                {user.name || "Unnamed User"}
              </h3>
              {!user.isActive && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Deactivated
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              user.role === "SUPER_ADMIN"
                ? "bg-purple-100 text-purple-800"
                : user.role === "ADMIN"
                ? "bg-blue-100 text-blue-800"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {user.role}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
