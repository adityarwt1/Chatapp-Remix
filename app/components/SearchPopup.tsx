// app/components/SearchPopup.tsx
import { Link } from "@remix-run/react";
interface Logs {
  fullname: string;
  username: string;
  _id: string
  image: string
  status: string
}
interface UserType{
 users: Logs[]
}
export default function SearchPopup({ users }: UserType) {

  return (
    <div className="absolute z-50 bg-white border rounded-lg shadow-md mt-2 w-full max-h-64 overflow-y-auto">
      {users.map((user : Logs) => (
        <Link
          to={`/chat/${user.username}`}
          key={user._id}
          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          <img
            src={user.image || "/default-avatar.png"}
            alt={user.fullname}
            className="w-10 h-10 rounded-full object-cover border border-gray-300 mr-3"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.fullname}</span>
            <span className="text-xs text-gray-500">{user.status}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
