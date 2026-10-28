import dbConnect from "../../../db/connect";
import User from "../../../db/models/User";
import crypto from "crypto";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { token, newPassword, confirmedPassword } = req.body;

  if (!token || !newPassword || !confirmedPassword) {
    return res.status(400).json({ message: "Fülle bitte alle felder aus" });
  }

  if(confirmedPassword !== newPassword) {
    return res.status(400).json({ message: "Passwörter stimmen nicht überein" });
  }
  
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const isValid = passwordRegex.test(newPassword);

  if(!isValid) {
    return res.status(400).json({ message: "Das Passwort entspricht nicht den Anforderungen" });
  }


  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Der Link ist ungültig oder abgelaufen" });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined; 
    user.passwordResetExpires = undefined; 
    await user.save();

    res.status(200).json({ message: "Passwort erfolgreich geändert" });
  } catch (error) {
    console.error("Fehler beim Zurücksetzen des Passworts:", error);
    return res.status(500).json({ message: "Fehler beim Zurücksetzen des Passworts" });
  }
}
