import dbConnect from "@/db/connect";
import User from "@/db/models/User";



export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }


  const { email, password, name, username, passwordcompare } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-Mail und Passwort sind erforderlich" });
  }

  if(passwordcompare !== password) {
    return res.status(400).json({ error: "Passwörter stimmen nicht überein" });
  }
  
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const isValid = passwordRegex.test(password);

  if(!isValid) {
    return res.status(400).json({ error: "Das Passwort entspricht nicht den Anforderungen" });
  }

  await dbConnect(); 

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Ein Benutzer mit dieser E-Mail existiert bereits." });
    }

    const newUser = new User({ email, password, name, username });
    await newUser.save();
  
      return res.status(201).json({ message: "Benutzer erstellt!" });
  } catch (error) {
    res.status(500).json({ error: "Interner Serverfehler" });
  }
}
