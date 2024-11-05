import dbConnect from "@/db/connect";
import Plant from "@/db/models/Plant";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
    region: process.env.AWS_REGION 
});

export default async function handler(request, response) {
    await dbConnect();
    const { id } = request.query;

    if(request.method === "DELETE") {
        try {
            const plant = await Plant.findByIdAndDelete(id);

            const plantFilePath = plant.file;
            const urlParts = new URL(plantFilePath);
            const key = urlParts.pathname.substring(1); 

            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
            };

            await s3.deleteObject(params).promise();

            response.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            response.status(400).json({ error: error.message });
        }
    }
}