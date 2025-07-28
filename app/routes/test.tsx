import { json, LoaderFunction , LoaderFunctionArgs} from "@remix-run/node";
import { getSession } from "lib/session.server";

export const loader: LoaderFunction = async ({request}: LoaderFunctionArgs)=>{
    try {
        const cookie = await getSession(request)
        const data = cookie.get("user")
        console.log(cookie.get("user") , data)
        return json({data})
    } catch (error) {
        console.log(error)
        return json({message: "Internal reversiiser"})
    }

}