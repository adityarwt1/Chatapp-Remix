import { createCookieSessionStorage } from "@remix-run/node";

// Create cookie session storage
export const session = createCookieSessionStorage({
  cookie: {
    name: "chat_session", // Cookie name
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    secrets: ["super-secret-key"], // Replace with env variable in real projects
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: true,
  },
});


// Get session
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return session.getSession(cookie);
}
