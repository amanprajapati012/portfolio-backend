import ImageKit from "imagekit";

if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  throw new Error("❌ IMAGEKIT_PUBLIC_KEY not found in environment");
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
