import { ActionFunction, ActionFunctionArgs, json } from "@remix-run/node";

export const action: ActionFunction =async({request}:ActionFunctionArgs)=>{
    try {
        const url = new URL(request.url)
        return json({message: "message sen succeesufully"})
    } catch (error) {
        console.log((error as Error).message)
        return json({error: "Internal server issue"},{status: 500})
    }

}