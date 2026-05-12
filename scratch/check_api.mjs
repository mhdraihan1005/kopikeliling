const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key");
  process.exit(1);
}

async function checkModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Models Response:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

checkModels();
