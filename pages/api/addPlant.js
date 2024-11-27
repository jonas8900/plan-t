import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";
import formidable from "formidable";
import AWS from "aws-sdk";
import sharp from "sharp";
import fs from "fs";
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

  if (request.method === "POST") {
    const form = formidable({
      maxFileSize: 3 * 1024 * 1024, 
    });

    form.parse(request, async (err, fields, files) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return response.status(400).json({ error: "Die Datei ist zu groß. Bitte wählen Sie eine Datei, die kleiner als 3 MB ist." });
        }
        console.error(err);
        return response.status(400).json({ error: "Fehler beim Verarbeiten der Formulardaten." });
      }

      const { userId, ...plantData } = fields;

      const plantInfo = {};
      for (const [key, value] of Object.entries(plantData)) {
        plantInfo[key] = value[0]; 
      }

      const file = files.image?.[0];
      if (!file) {
        return response.status(400).json({ error: "Keine Datei hochgeladen." });
      }

      const filePath = file.filepath;

      if (!filePath) {
        return response.status(400).json({ error: "Der Dateipfad ist undefiniert." });
      }

      try {

        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
        const fileExtension = path.extname(file.originalFilename).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          return response.status(400).json({ error: "Nur Bilddateien sind erlaubt." });
        }

     
        const optimizedFilePath = path.join(path.dirname(filePath), `${Date.now()}-optimized.webp`);

        const sharpPromise = sharp(filePath, { failOnError: false })
          .rotate()
          .resize({ width: 900 })
          .webp({ quality: 80 })
          .toFile(optimizedFilePath);

        const s3UploadPromise = sharpPromise.then(async () => {
          const optimizedFileStream = fs.createReadStream(optimizedFilePath);
          return s3.upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `plants/${Date.now()}-${file.originalFilename}.webp`,
            Body: optimizedFileStream,
            ContentType: "image/webp", 
            CacheControl: 'public, max-age=31536000',
          }).promise();
        });

        const [s3Response] = await Promise.all([s3UploadPromise]); 


        const imageUrl = s3Response.Location;

        const plant = await Plant.create({ ...plantInfo, userId: userId[0], file: imageUrl });

        fs.unlink(filePath, (err) => {
          if (err) console.error("Fehler beim Löschen der Originaldatei:", err);
        });

        fs.unlink(optimizedFilePath, (err) => {
          if (err) console.error("Fehler beim Löschen der optimierten Datei:", err);
        });

        response.status(200).json({ status: "Pflanze erfolgreich erstellt.", plant });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: error.message });
      }
    });
  } else {
    response.setHeader("Allow", ["POST"]);
    response.status(405).end(`Method ${request.method} Not Allowed`);
  }
}
