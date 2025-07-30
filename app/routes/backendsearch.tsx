import { ActionFunction, ActionFunctionArgs, json } from "@remix-run/node";
import { connect } from "lib/mongodb";
import User from "model/user";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  try {
    // 1. Parse both searchParams and formData
    const url = new URL(request.url);
    const searchParam = url.searchParams.get("search");

    const formData = await request.formData();
    const queryParam = formData.get("query");

    // 2. Build filter only if needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    const query = queryParam || searchParam;

    if (query && typeof query === "string") {
      filter.$or = [
        { fullname: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ];
    }

    // 3. Connect to DB
    await connect();

    // 4. Fetch user(s)
    const users = await User.find(filter).limit(3);
    return json({ users }); // plural "users"
  } catch (error) {
    console.error("MongoDB search error:", (error as Error).message);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
