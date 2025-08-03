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


export const meta: MetaFunction = ()=>{
  return [
    {title: "ChatApp - Aditya Rawat"}
  ]
}

export default function App() {
  return <Outlet />;
}
