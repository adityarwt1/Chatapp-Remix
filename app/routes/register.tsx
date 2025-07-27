import { json, Link, useFetcher, useNavigation } from "@remix-run/react";
import { useEffect } from "react";
import nprogress from "nprogress";
import { ActionFunction, ActionFunctionArgs } from "@remix-run/node";

interface Formdata {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
}
export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  try {
    const formdata = await request.formData();
    const data: Partial<Formdata> = {};

    //// extracting the data from the registery

    for (const [key, value] of formdata.entries()) {
      data[key as keyof Formdata] = value.toString();
    }
    for (const [key, value] of formdata.entries()) {
      data[key as keyof FormData] = value.toString();
    }
    console.log("formdata", data);

    return json({ message: "hello" });
  } catch (error) {
    return json({ message: "Interner server issue" }, { status: 500 });
  }
};
export default function RegisterPage() {
  const fetcher = useFetcher();
  const navigate = useNavigation();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (navigate.state === "loading") {
      nprogress.start();
    } else {
      nprogress.done();
    }
  }, [navigate.state]);
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ChatApp
          </Link>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            Create Account
          </h2>
          <p className="text-gray-600 mt-2">Join our community today</p>
        </div>

        <fetcher.Form method="post" className="space-y-6" action="/register">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter your full name"
              required
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
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmpassword"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </fetcher.Form>

        <div className="mt-8 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
