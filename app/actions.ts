"use server"

import { revalidatePath } from "next/cache"

export async function uploadDocuments(formData: FormData) {
  const files = formData.getAll('files')
  if (!files || files.length === 0) {
    return { error: "No files selected" }
  }

  try {
    const fileNames = files.map((file: any) => file.name)
    console.log("Files processed:", fileNames)
    revalidatePath("/")
    return fileNames
  } catch (error) {
    console.error("Error processing files:", error)
    return { 
      error: "Failed to process files", 
      details: error instanceof Error ? error.message : String(error) 
    }
  }
}

