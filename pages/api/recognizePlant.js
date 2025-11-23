import dbConnect from "@/db/connect";
import { getServerSession } from "next-auth";


export default async function handler(request, response) {
    await dbConnect();

     const session = await getServerSession(request, response);


    if(!session) {
        return response.status(401).json({error: "Unauthorized" });
    }

    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
    
    const {userId, imageBase64} = request.body;

    if(request.method === "POST") {


        try {
            const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-internal-secret": process.env.N8N_INTERNAL_SECRET, 
                },
                body: JSON.stringify({ userId, imageBase64 }),
            });

            if(!n8nResponse.ok) {
                return response.status(400).json({ error: "Error from n8n workflow" });
            }
            const n8nData = await n8nResponse.json();
            console.log(n8nData);
            return response.status(200).json(n8nData);
        

        } catch (error) {
            response.status(400).json({ error: "Error in sending apirequest to n8n" });
        }
    }
    
}