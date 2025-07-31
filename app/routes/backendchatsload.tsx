import { ActionFunction, ActionFunctionArgs, json } from "@remix-run/node";
import { connect } from "lib/mongodb";
import Message from "model/message";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id")
if(!id){
    return json({message: "id must be requered"},{status: 400})
}
    await connect()
    const messages = await Message.find({ chatid: id });

    return json({ message: "message sen succeesufully" , messages});
  } catch (error) {
    console.log((error as Error).message);
    return json({ error: "Internal server issue" }, { status: 500 });
  }
};
