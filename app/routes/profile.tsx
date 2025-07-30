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

interface UserType {
  fullname: string;
  email: string;
  status: string;
  image: string;
}
interface TypeLoader {
  user: UserType;
}

interface FetcherType {
  user: {
    image: string;
  };
}
export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = await getSession(request);
    const userdda = session.get("user");
    if (!userdda.username) {
      return redirect("/login");
    }
    await connect();
    const user = await User.findOne({ username: userdda.username });
    return json({ user });
  } catch (error) {
    console.log((error as Error).message);
    return json({ message: "Internal server issue" });
  }
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  try {
    const session = await getSession(request);
    const userdata = session.get("user");
    const formadata = await request.formData();

    if (formadata.has("image")) {
      const image = formadata.get("image");
      await connect();
      const user = await User.findOneAndUpdate(
        {
          username: userdata?.username,
        },
        {
          image,
        },
        {
          new: true,
        }
      );
      return json({ user }, { status: 200 });
    }
    return json({ message: "done" });
  } catch (error) {
    console.log((error as Error).message);
    return json({ error: "Internal server issue" }, { status: 500 });
  }
};
//// handlking the saves
export default function ProfilePage() {
  const loaderdata = useLoaderData<TypeLoader>();
  const fetcher = useFetcher<FetcherType>();
  const isLoading = fetcher.state === "submitting";

  ///base64 image

  const base64Format = async (file: File) => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.log((error as Error).message)
      
    }
  };
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];

      const imageUrl = await base64Format(file as File);

      const formdata = new FormData();

      formdata.append("image", imageUrl as string);

      fetcher.submit(formdata, {
        method: "post",
      });
    } catch (error) {
      console.log((error as Error).message);
    }
  };
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

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Picture */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            
                { loaderdata.user.image ? (
                  <img src={loaderdata.user.image} className="object-cover" alt="Profile"/>):(
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
            </svg>)}
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

        {/* Profile Form */}
        <fetcher.Form className="space-y-6" method="post">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={loaderdata.user.fullname}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={loaderdata.user.email || "example@gmail.com"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={loaderdata.user.status ?? loaderdata.user.status}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Away">Away</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </fetcher.Form>

        {/* Additional Options */}
        <div className="mt-8 space-y-4">
          <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Notifications</span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>

          <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                Privacy & Security
              </span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>

          <button className="w-full text-left px-4 py-3 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-red-600">
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
