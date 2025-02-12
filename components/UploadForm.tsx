"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UploadAnimation from "./UploadAnimation"

export default function UploadForm() {
  const [fileNames, setFileNames] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const names = Array.from(e.target.files).map((file) => file.name)
      setFileNames((prevNames) => [...prevNames, ...names])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (fileNames.length === 0) return
    setUploading(true)
  }

  const removeFile = (index: number) => {
    setFileNames(fileNames.filter((_, i) => i !== index))
  }

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-4">
          <Input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" disabled={uploading} multiple />
          {fileNames.length > 0 && (
            <ul className="list-disc pl-5">
              {fileNames.map((fileName, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{fileName}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Button type="submit" disabled={fileNames.length === 0 || uploading}>
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
        </div>
      </form>
      {uploading && <UploadAnimation fileNames={fileNames} />}
    </div>
  )
}

