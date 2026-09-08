import { UTApi } from "uploadthing/server";

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN! });

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || !url.includes("utfs.io")) {
      return new Response(JSON.stringify({ success: false, message: "Invalid URL" }), { status: 400 });
    }

    const fileKey = url.split("/").pop();
    if (fileKey) {
      await utapi.deleteFiles(fileKey);
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error("Error deleting file from UploadThing:", err);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}