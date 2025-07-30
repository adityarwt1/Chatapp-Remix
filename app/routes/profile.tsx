"use client";

import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { connect } from "lib/mongodb";
import { getSession } from "lib/session.server";
import User from "model/user";
import React from "react";
import { EditType, UserType } from "types/types";

interface TypeLoader {
  user: UserType;
}

interface FetcherType {
  user: {
    image: string;
    fullname: string
    username: string
    email :string
    status:string
  };
}

// 🚀 LOADER
export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = await getSession(request);
    const userSession = session.get("user");
    if (!userSession?.username) return redirect("/login");

    await connect();
    const user = await User.findOne({ username: userSession.username });
    if (!user) return redirect("/login");

    return json({ user });
  } catch (error) {
    console.log((error as Error).message);
    return json({ message: "Internal server issue" }, { status: 500 });
  }
};

// 🚀 ACTION
export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  try {
    const session = await getSession(request);
    const sessionUser = session.get("user");
    const formdata = await request.formData();

    await connect();

    // ✅ Handle image upload
    if (formdata.has("image")) {
      const image = formdata.get("image")?.toString();
      const user = await User.findOneAndUpdate(
        { username: sessionUser.username },
        { image },
        { new: true }
      );
      return json({ user }, { status: 200 });
    }

    // ✅ Handle profile info update
    if (formdata.has("status")) {
      const data: Partial<EditType> = {};
      for (const [key, value] of formdata.entries()) {
        data[key as keyof EditType] = value.toString();
      }
       console.log(data)
      const user = await User.findOneAndUpdate(
        { username: sessionUser.username },
        {
          fullname: data.name,
          email: data.email,
          status: data.status,
        },
        { new: true }
      );

      if (!user) {
        return json({ error: "User not found" }, { status: 404 });
      }

      return json({ user }, { status: 200 });
    }

     return json({ message: "Nothing to update" });
  } catch (error) {
    console.log((error as Error).message);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

// 📄 COMPONENT
export default function ProfilePage() {
  const loaderData = useLoaderData<TypeLoader>();
  const fetcher = useFetcher<FetcherType>();
  const userData = fetcher.data?.user ? fetcher.data : loaderData;
  const isLoading = fetcher.state === "submitting";
  const isLogoutLoading = fetcher.state ==="submitting"

  // 📦 Convert image to base64
  const base64Format = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  // 🖼️ Handle image input
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await base64Format(file);
    const formdata = new FormData();
    formdata.append("image", imageUrl);
    fetcher.submit(formdata, { method: "post" });
  };
const handleLogout = async()=>{
  try {
     await fetch("/logout",{method: "POST"})
  } catch (error) {
    console.log((error as Error).message)
  }
}
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link to="/chat" className="text-blue-600 hover:text-blue-700 mr-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Picture */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full overflow-hidden mx-auto mb-4">
            {userData.user.image ? (
              <img
                src={userData.user.image}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>

          <input
            type="file"
            id="image"
            name="image"
            className="hidden"
            accept="image/*"
            onChange={handleImage}
          />
          <label
            htmlFor="image"
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Change Profile Picture
          </label>
        </div>

        {/* Profile Info Form */}
        <fetcher.Form method="post" className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={userData.user.fullname}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              defaultValue={userData.user.username}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={userData.user.email || "example@gmail.com"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={userData.user.status ?? "Available"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Away">Away</option>
              <option value="Offline">Offline</option>
            </select>

            {/* Ensure status is always submitted */}
            <input type="hidden" name="status" value={userData.user.status} />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
          onClick={handleLogout}
            name="_logout"
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition"
          >
            {isLogoutLoading ? "Logout..." : "Logout"}
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
