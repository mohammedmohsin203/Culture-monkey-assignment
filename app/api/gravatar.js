import md5 from "blueimp-md5";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const hash = md5(email.trim().toLowerCase());
    const url = `https://www.gravatar.com/${hash}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(404).json({ error: "Gravatar profile is not found" });
        }

        const data = await response.json();
        res.status(200).json({
            username: data.entry[0]?.preferredUsername,
            location: data.entry[0]?.currentLocation,
            bio: data.entry[0]?.aboutMe,
            image: `https://www.gravatar.com/avatar/${hash}?s=200`,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Gravatar" });
    }
}
