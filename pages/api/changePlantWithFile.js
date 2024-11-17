import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";
import formidable from "formidable";
import AWS from "aws-sdk";
import fs from "fs";

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

  const { method, body, query } = request;
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

      const file = files.image?.[0]; // Prüfen, ob `files.image` existiert und nicht leer ist

      let imageUrl = null;

      if (file) {
        const filePath = file.filepath;

        if (!filePath) {
          return response.status(400).json({ error: "Der Dateipfad ist undefiniert." });
        }

        console.log("File Path:", filePath);

        try {
          const fileStream = fs.createReadStream(filePath);

          const s3Response = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `plants/${file.originalFilename}`,
            Body: fileStream,
            ContentType: file.mimetype,
          }).promise();

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
