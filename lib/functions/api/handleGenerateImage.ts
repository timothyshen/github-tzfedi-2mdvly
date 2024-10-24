"use server";
import { base64ToBlob } from "@/lib/utils/base64ToBlob";
import axios from "axios";
import { uploadFileToIpfs } from "../pinata/uploadFileToIPFS";
import { updateImagePathOnCast } from "../supabase/updateImagePathOnCast";

export async function handleGenerateImage(
  prompt: string,
  createdArtcastId: number
) {
  const payload = {
    prompt,
    output_format: "png",
  };

  const response = await axios.postForm(
    `https://api.stability.ai/v2beta/stable-image/generate/core`,
    axios.toFormData(payload, new FormData()),
    {
      headers: {
        // "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `sk-wqD9htnYJmlatIMHSV4EqgZpkTDgDU3QMTpsyLPuOwehzd4O`,
      },
      method: "POST",
    }
  );

  if (response.status !== 200) {
    throw new Error(`${response.status}: ${await response.data.toString()}`);
  }

  const result = await response.data;
  let imageBlob = base64ToBlob(result.image, "image/jpeg");
  // const imageBuffer = await blobToBuffer(imageBlob);
  // const consenscedImageBuffer = await sharp(imageBuffer)
  //   .jpeg({ quality: 10 }) // Adjust the quality value as needed (between 0 and 100)
  //   .toBuffer();
  // imageBlob = new Blob([consenscedImageBuffer], { type: "image/jpeg" });
  const imageIPFSHash = await uploadFileToIpfs(imageBlob);
  await updateImagePathOnCast(imageIPFSHash, createdArtcastId);
  return imageIPFSHash;
}
