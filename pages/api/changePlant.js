import dbConnect from "@/db/connect";

export default async function handler(request, response) {
    await dbConnect();




}