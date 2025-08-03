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
        <meta
          property="og:image"
          content="https://img.freepik.com/premium-vector/chat-app-logo-sms-messenger-label-design-mobile-app-online-conversation-with-texting-message-ui-design-concept-vector-illustration_172533-1513.jpg"
        ></meta>

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
  const title = "ChatApp - Aditya Rawat | Modern Messaging Solution";
  const description = "ChatApp by Aditya Rawat is a modern, secure messaging platform...";
  const imageUrl = "https://img.freepik.com/premium-vector/chat-app-logo-sms-messenger-label-design-mobile-app-online-conversation-with-texting-message-ui-design-concept-vector-illustration_172533-1513.jpg"
  const siteUrl = "https://chatapp-remix.vercel.app/";


  return [
      
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords.join(", ") },
    
    // Open Graph
    { property: "og:type", content: "website" },
    { property: "og:url", content: siteUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: "ChatApp" },
    
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@aditya_rwt01" },
    { name: "twitter:creator", content: "@aditya_rwt01" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    
    // Additional tags
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charset: "utf-8" },
    { name: "theme-color", content: "#4285f4" },
    { name: "robots", content: "index, follow" },
  ];

};


export default function App() {
  return <Outlet />;
}
