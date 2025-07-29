import { ActionFunction, ActionFunctionArgs, redirect } from "@remix-run/node";
import { getSession, session } from "lib/session.server";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const cookie = await getSession(request);

  return redirect("/", {
    headers: {
      "Set-Cookie": await session.destroySession(cookie),
    },
  });
};
