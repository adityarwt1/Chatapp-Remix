import { ActionFunction, ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { connect } from "lib/mongodb";
import { getSession } from "lib/session.server";
import ChatModel from "model/chats";
import mongoose from "mongoose";

export const action: ActionFunction = async({request}: ActionFunctionArgs )=>{
    try {
        const formdata = await request.formData()
        const id = String(formdata.get("id"))
        const session  = await getSession(request)
        const userdata = session.get("user")

        if(!userdata){
            return redirect("/login")
        }
        await connect()
        const chat = new ChatModel({
          participant1: new mongoose.Types.ObjectId( userdata._id),
          participant2: new mongoose.Types.ObjectId(id),
          
        });
        await chat.save()
        return json({added: true})
    } catch (error) {
        console.log((error as Error).message)
        return json({message: "Internal server issue"})
    }

}