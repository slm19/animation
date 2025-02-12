"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function uploadDocuments(formData: FormData) {
  const files = Array.from(formData.values()).filter((value) => value instanceof File) as File[]

  if (files.length === 0) {
    throw new Error("No files uploaded")
  }

  try {
    const uploadPromises = files.map(async (file) => {
      const blob = await put(file.name, file, {
        access: "public",
      })
      return blob.url
    })

    const uploadedUrls = await Promise.all(uploadPromises)

    // Here you might want to save the uploadedUrls to your database
    console.log("Files uploaded successfully:", uploadedUrls)

    revalidatePath("/")
    return uploadedUrls
  } catch (error) {
    console.error("Error uploading files:", error)
    throw new Error("File upload failed")
  }
}

