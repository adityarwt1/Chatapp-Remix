"use client";

import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Link, useFetcher, useNavigation } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { connect, disconnect } from "lib/mongodb";
import { session } from "lib/session.server";
import User from "model/user";
import nProgress from "nprogress";
import { useEffect } from "react";

interface Formdata {
  username: string;
  password: string;
}

interface FetchType {
  error: string;
}
export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  try {
    const formdata = await request.formData();
    console.log(formdata);

    const data: Partial<Formdata> = {};

    for (const [key, value] of formdata.entries()) {
      data[key as keyof Formdata] = value.toString();
    }

    if (!data) {
      return json({ error: "Invalid Request" }, { status: 400 });
    }

    await connect();
    const user = await User.findOne({ username: data.username });
    await disconnect();

    if (!user) {
      return json({ error: "User not Found" }, { status: 404 });
    }

    const isPasswordTrue = await bcrypt.compare(
      data.password as string,
      user.password
    );
    if (isPasswordTrue) {
      const cookie = await session.getSession();
      cookie.set("user", user);
      return redirect("/chat", {
        headers: {
          "Set-Cookie": await session.commitSession(cookie),
        },
      });
      // return json({ message: "Login Successfully" }, { status: 200 });
    } else {
      return json({ error: "Wrong Password" }, { status: 400 });
    }
  } catch (error) {
    console.log((error as Error).message);
    return json({ error: "Internal Server issue" }, { status: 500 });
  }
};
export default function LoginPage() {
  const navigate = useNavigation();
  const fetcher = useFetcher<FetchType>();
  const isloading = fetcher.state === "submitting";
  useEffect(() => {
    if (navigate.state === "loading") {
      nProgress.start();
    } else {
      nProgress.done();
    }
  }, [navigate.state]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ChatApp
          </Link>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        {fetcher.data?.error && (
          <div className="p-4 bg-red-400 rounded-md my-2 text-white">
            {fetcher.data?.error}
          </div>
        )}

        <fetcher.Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {isloading ? "Signin..." : "Sign In"}
          </button>
        </fetcher.Form>

        <div className="mt-6 text-center">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline text-sm"
          >
            Forgot your password?
          </Link>
        </div>

        <div className="mt-8 text-center">
          <span className="text-gray-600">{"Don't have an account? "}</span>
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
