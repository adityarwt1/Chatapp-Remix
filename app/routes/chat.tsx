"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import {
  json,
  type LoaderFunction,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { getSession } from "lib/session.server";
import { connect } from "lib/mongodb";
import User from "model/user";
import SearchPopup from "~/components/SearchPopup";
import ChatModel from "model/chats";
import mongoose from "mongoose";

export interface UserType {
  _id: string
  fullname: string;
  email: string;
  status: string;
  image: string;
  username:string
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}
interface FetchType {
  user: UserType;
  users: UserType
}



export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  try {
    const session = await getSession(request);
    const userdata = session.get("user");
    if (!userdata) {
      return redirect("/login");
    }
    await connect();
    const user = await User.findOne({ username: userdata.username });

    //// extracting the chat from the database

    const userA = new mongoose.Types.ObjectId(userdata._id as string)
    const chat = await ChatModel.find({ 
      $or:[
        {participant1: userA},
        {participant2 : userA}
      ]
     })
    console.log("chats found on database", chat )

    let chats =[]
    if(chat.length >0){
      for(let i = 0; i < chat.length; i++){
        if(String(chat[i].participant1) !== String(userdata._id) ){
          const user = await User.findOne({ _id: chat[i].participant2 }).select(
            "fullname username status image updatedAt"
          );
          chats.push(user)
        }
        if(String(chat[i].participant2) !== String(userdata._id)){
          const user = await User.findOne({ _id: chat[i].participant2 }).select(
            "fullname username status image updatedAt"
          );
          chats.push(user);
        }
        else{
          break;
        }
      }
    }
    console.log("chat users", chats)
    
    return json({ message: "Chat Page", user ,chats }, { status: 200 });
  } catch (error) {
    console.log((error as Error).message);
    return json(
      { message: "Internal server issue", error: "Internal user issue" },
      { status: 500 }
    );
  }
};

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [message, setMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const loaderData = useLoaderData<FetchType>();
  const [query, setQuery] = useState("")
  const fetcher = useFetcher<FetchType>();
const users = (fetcher.data?.users ) || [];


  useEffect(()=>{
    if(query.length < 2)
    if(query){
      const formdata = new FormData()
      formdata.append("query", query)
      fetcher.submit(formdata, {
        method: "post",
        action: "/backendsearch",
      });
    }
  },[query])


  const chats: Chat[] = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hey, how are you?",
      timestamp: "2:30 PM",
      unread: 2,
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "See you tomorrow!",
      timestamp: "1:15 PM",
      unread: 0,
    },
    {
      id: 3,
      name: "Team Chat",
      lastMessage: "Meeting at 3 PM",
      timestamp: "12:45 PM",
      unread: 5,
    },
    {
      id: 4,
      name: "Alice Johnson",
      lastMessage: "Thanks for your help",
      timestamp: "11:30 AM",
      unread: 0,
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      text: "Hey there! How are you doing?",
      sender: "other",
      timestamp: "2:25 PM",
    },
    {
      id: 2,
      text: "I'm doing great, thanks for asking!",
      sender: "user",
      timestamp: "2:26 PM",
    },
    {
      id: 3,
      text: "That's awesome to hear!",
      sender: "other",
      timestamp: "2:27 PM",
    },
    {
      id: 4,
      text: "How was your weekend?",
      sender: "other",
      timestamp: "2:30 PM",
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar (30%) */}
      <div
        className={`${
          showSidebar ? "block" : "hidden"
        } md:block w-full md:w-[30%] bg-white border-r border-gray-200 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4 px-2">
            <h1 className="text-xl font-bold text-blue-600">ChatApp</h1>
            <div className="relative flex-1 mx-4">
              <input
                type="text"
                placeholder="Search chats..."
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchPopup users={users} />
            </div>
            <Link to="/profile" className="relative group">
              {loaderData.user?.image ? (
                <img
                  src={loaderData.user.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 border border-gray-300">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loaderData?.chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => {
                setSelectedChat(chat._id);
                setShowSidebar(false);
              }}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 text-left w-full ${
                selectedChat === chat._id
                  ? "bg-blue-50 border-r-2 border-blue-600"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                {/* DP + Name + Message */}
                <div className="flex items-center gap-3 flex-1">
                  {/* Profile Image */}
                  <img
                    src={chat.image || "/default-avatar.png"} // fallback image
                    alt={chat.fullname}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  {/* Name and Message */}
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {chat.fullname}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage || "Start Chatting!"}
                    </p>
                  </div>
                </div>

                {/* Time + Unread Badge */}
                <div className="text-right min-w-fit">
                  <p className="text-xs text-gray-500">
                    {new Date(chat.updatedAt).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  {chat.unread > 0 && (
                    <span className="inline-block bg-blue-600 text-white text-xs rounded-full px-2 py-1 mt-1">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area (70%) */}
      <div className="w-full md:w-[70%] flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden mr-3 text-gray-600"
                >
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  {loaderData.chats.find((c) => c._id === selectedChat)?.fullname}
                </h2>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to ChatApp
              </h3>
              <p className="text-gray-600">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
