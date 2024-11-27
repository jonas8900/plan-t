import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";
import formidable from "formidable";
import AWS from "aws-sdk";
import fs from "fs";
import sharp from "sharp"; 
import path from "path";

AWS.config.update({
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  await dbConnect();

  const { method, query } = request;
  const { id } = query;

  if (method === "PUT") {
    if (!id) {
      return response.status(400).json({ error: "Plant ID is required" });
    }

    const form = formidable({
      maxFileSize: 3 * 1024 * 1024,
    });

    form.parse(request, async (err, fields, files) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return response
            .status(400)
            .json({ error: "Die Datei ist zu groß. Bitte wählen Sie eine Datei, die kleiner als 3 MB ist." });
        }
        console.error(err);
        return response.status(400).json({ error: "Fehler beim Verarbeiten der Formulardaten." });
      }

      console.log("Fields:", fields);
      console.log("Files:", files);

      const { ...plantData } = fields;

      const plantInfo = {};
      for (const [key, value] of Object.entries(plantData)) {
        plantInfo[key] = value[0];
      }

      const file = files.image?.[0]; 

      let imageUrl = null;

      if (file) {
        const filePath = file.filepath;

        if (!filePath) {
          return response.status(400).json({ error: "Der Dateipfad ist undefiniert." });
        }

        try {
          const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
          const fileExtension = path.extname(file.originalFilename).toLowerCase();
          if (!allowedExtensions.includes(fileExtension)) {
            return response.status(400).json({ error: "Nur Bilddateien sind erlaubt." });
          }
          console.log(new Date(), "Fileconvert with sharp before...");
          const optimizedFilePath = path.join(path.dirname(filePath), `${Date.now()}-optimized.webp`);
          await sharp(filePath, { failOnError: false })
            .rotate()
            .resize({ width: 500 }) 
            .webp({ quality: 80 }) 
            .toFile(optimizedFilePath);  
            console.log(new Date(), "Fileconvert with sharp after...");

          const fileStream = fs.createReadStream(optimizedFilePath);
          const s3Response = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `plants/${Date.now()}-${file.originalFilename}.webp`,
            Body: fileStream,
            ContentType: "image/webp", 
            CacheControl: 'public, max-age=31536000', 
          }).promise();
          console.log(new Date(), "upload to bucket");
          imageUrl = s3Response.Location;
        } catch (error) {
          console.error(error);
          return response.status(500).json({ error: "Fehler beim Hochladen der Datei zu S3." });
        }
      }

      try {
        const updateData = imageUrl
          ? { ...plantInfo, file: imageUrl }
          : plantInfo;

        const plant = await Plant.findByIdAndUpdate(
          id,
          updateData,
          { new: true }
        );

        if (!plant) {
          return response.status(404).json({ error: "Plant not found" });
        }

        response.status(200).json({ status: "Pflanze erfolgreich aktualisiert.", plant });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: error.message });
      }
    });
  }
}
