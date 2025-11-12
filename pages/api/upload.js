import formidable from "formidable";
import fs from "fs";
import { supabase } from "../../lib/supabaseClient";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const form = formidable({ multiples: false });
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const photoFile = files.photo?.[0];
    if (!photoFile || !photoFile.filepath) {
      return res.status(400).json({ error: "No valid photo uploaded" });
    }

    const fileData = fs.readFileSync(photoFile.filepath);
    const fileExt = photoFile.originalFilename.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("requests")
      .upload(fileName, fileData, {
        cacheControl: "3600",
        upsert: false,
        contentType: photoFile.mimetype,
      });

    if (uploadError) throw uploadError;

    const { error: dbError } = await supabase.from("requests").insert([
      {
        name: fields.name,
        email: fields.email,
        event_date: fields.event_date,
        address: fields.address,
        notes: fields.notes,
        photo_path: fileName,
        status: "pending",
      },
    ]);

    if (dbError) throw dbError;

    res.status(200).json({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
