import { ActionFunction, ActionFunctionArgs, json } from "@remix-run/node";
import { connect } from "lib/mongodb";
import Message from "model/message";
import mongoose from "mongoose";

export const action: ActionFunction =async({request}:ActionFunctionArgs)=>{
    try {
        const url = new URL(request.url)
        const searchParams = url.searchParams
        const formdata = await request.formData()
        const message = formdata.get("message");
        const chatid = searchParams.get("chatid");
        const sender = searchParams.get("sender");

        if(!message || !chatid || !sender){
            return json({error: "Field are requred"},{status: 400})
        }


        await connect()
        const saveMessage = new Message({
          chatid: new mongoose.Types.ObjectId(chatid as string),
          message,
          sender: new mongoose.Types.ObjectId(sender as string)
        });
        await saveMessage.save()
          const messages = await Message.find({ chatid: chatid });
          console.log("this message", messages);
        
        return json({ message: "message sen succeesufully", messages });
    } catch (error) {
        console.log((error as Error).message)
        return json({error: "Internal server issue"},{status: 500})
    }

}