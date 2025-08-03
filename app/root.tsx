import {
  json,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";

import "./tailwind.css";
import { getSession } from "lib/session.server";
import { useEffect } from "react";
import nProgress from "nprogress";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];


export const loader: LoaderFunction   = async ({request})=>{
  const sessinio = await getSession(request)
  const userdata = sessinio.get("user")
  if(userdata?.username){

     redirect("/chat")
     return json({message: "User data found"})
  }
  else{
    redirect('/login')
    return json({message: "nothind to send for now"})
  }
}
export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigation()

  useEffect(()=>{
if(navigate.state === "loading"){
  nProgress.start()
}
else{
nProgress.done()
}
  },[navigate.state ])
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}


export const meta: MetaFunction = () => {
  const keywords = [
    "ChatApp",
    "messaging",
    "real-time chat",
    "Aditya Rawat",
    "web development",
    "React",
    "Remix",
    "instant messaging",
    "group chat",
    "private chat",
    "secure messaging",
    "online communication",
    "chat application",
    "modern UI",
    "end-to-end encryption",
    "cloud messaging",
    "cross-platform",
    "web sockets",
    "progressive web app",
    "social networking",
    "team collaboration",
    "video chat",
    "voice messages",
  ];

  return [
    { title: "ChatApp - Aditya Rawat | Modern Messaging Solution" },
    {
      name: "description",
      content:
        "ChatApp by Aditya Rawat is a modern, secure messaging platform featuring real-time chat, group conversations, and cross-platform compatibility. Built with React and Remix for optimal performance.",
    },
    { name: "keywords", content: keywords.join(", ") },

    // Open Graph / Facebook
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://yourappdomain.com" },
    {
      property: "og:title",
      content: "ChatApp - Aditya Rawat | Modern Messaging Solution",
    },
    {
      property: "og:description",
      content:
        "Secure, real-time chat application with modern features like group messaging, file sharing, and cross-platform support. Developed by Aditya Rawat using cutting-edge web technologies.",
    },
    { property: "og:image", content: "/banner.png" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:creator", content: "@YourTwitterHandle" },
    {
      name: "twitter:title",
      content: "ChatApp - Aditya Rawat | Modern Messaging Solution",
    },
    {
      name: "twitter:description",
      content:
        "Real-time chat application featuring secure messaging, group chats, and modern UI. Built with React and Remix by Aditya Rawat.",
    },
    { name: "twitter:image", content: "/banner.png" },

    // Additional SEO tags
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charset: "utf-8" },
    { name: "theme-color", content: "#4285f4" }, // Example brand color
    { name: "robots", content: "index, follow" }, // For search engine crawling
  ];
};


export default function App() {
  return <Outlet />;
}
