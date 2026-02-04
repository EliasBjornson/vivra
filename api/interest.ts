import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, gender, age, email, phone } = req.body;

    await resend.emails.send({
      from: "Vivra <info@vivrahealth.se>",
      to: ["info@vivrahealth.se"],
      subject: "Ny intresseanmälan",
      html: `
        <h2>Ny intresseanmälan</h2>
        <p><b>Namn:</b> ${name}</p>
        <p><b>Kön:</b> ${gender}</p>
        <p><b>Ålder:</b> ${age}</p>
        <p><b>E-post:</b> ${email}</p>
        <p><b>Telefon:</b> ${phone}</p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("EMAIL ERROR", err);
    return res.status(500).json({ error: "Mail failed" });
  }
}
