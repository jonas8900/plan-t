import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";


export default async function handler(request, response) {
    await dbConnect();
    const { actionselect, dateforchange } = request.body;

   if(request.method === "PUT") {
       try {
           const plant = await Plant.findByIdAndUpdate(
               request.query.id,
               { [actionselect]: dateforchange },
               { new: true }
           );
           response.status(200).json(plant);
       } catch (error) {
           console.error(error);
           response.status(400).json({ error: error.message });
       }
   }
    
}