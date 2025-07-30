// app/components/SearchPopup.tsx
import { useFetcher } from "@remix-run/react";
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
  const fetcher = useFetcher()

  const handleAdd = async (id: string)=>{
    try {
      const formdata  = new FormData()
      formdata.append("id", id)
      fetcher.submit(formdata,{
        method: "POST",
        action: "/backendchant"
      })
    } catch (error) {
      console.log((error as Error).message)
    }
  }
  return (
    <div className="absolute z-50 bg-white border rounded-lg shadow-md mt-2 w-full max-h-64 overflow-y-auto">
      {users.map((user : Logs) => (
        <fetcher.Form onClick={()=> handleAdd(user._id)}
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
        </fetcher.Form>
      ))}
    </div>
  );
}
