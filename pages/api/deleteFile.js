import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";
import { getSession } from "next-auth/react";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION // Region deines S3-Buckets
});


export default async function handler(request, response) {
    await dbConnect();

    
    const session = await getSession({ req: request });

    if (!session) {
        return response.status(401).json({ error: "Nicht authentifiziert" });
    }

    const { method, body, query } = request;
    const { id } = query;

    if(method === "DELETE") {
    
        if (!id) {
            return response.status(400).json({ error: "Plant ID is required" });
        }

        try {
            const plant = await Plant.findById(id);
            if(!plant) {
                return response.status(404).json({ error: "Plant not found" });
            }

            const plantFilePath = plant.file;
            const urlParts = new URL(plantFilePath);
            const key = urlParts.pathname.substring(1); 


            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
            };

            await s3.deleteObject(params).promise();

            const updatePlant = await Plant.findByIdAndUpdate(id, 
                { $unset: {file: ""}},
                { new: true }
            );

            if (!updatePlant) {
                return response.status(404).json({ error: "Pflanze nicht gefunden" });
            }

            return response.status(200).json({ status: "Bild erfolgreich entfernt" });
        }
        catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal Server Error" });
        }

    }

}
