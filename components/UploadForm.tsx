"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UploadAnimation from "./UploadAnimation"
import { uploadDocuments } from "@/app/actions"

export default function UploadForm() {
  const [fileNames, setFileNames] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const newFileNames = newFiles.map((file) => file.name)
      setFileNames((prevNames) => [...prevNames, ...newFileNames])
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (fileNames.length === 0) {
      setError("Please select files to upload.")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      const fileInput = fileInputRef.current
      if (!fileInput?.files || fileInput.files.length === 0) {
        throw new Error("No files selected")
      }

      Array.from(fileInput.files).forEach((file) => {
        formData.append('files', file)
      })

      const result = await uploadDocuments(formData)

      if (result && 'error' in result) {
        throw new Error(result.details || result.error)
      }
    } catch (err) {
      console.error("Processing error:", err)
      setError(err instanceof Error ? err.message : 'Failed to process files')
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFileNames(fileNames.filter((_, i) => i !== index))
    if (fileInputRef.current) {
      fileInputRef.current.value = '' // Reset file input when removing files
    }
    setError(null)
  }

  const handleAnimationComplete = () => {
    // Do nothing - let the animation stay visible
  }

  return (
    <div className="relative w-full max-w-md">
      {!uploading && (
        <form onSubmit={handleSubmit} className="w-full" aria-label="Upload documents">
          <div className="flex flex-col gap-4">
            <Input 
              ref={fileInputRef}
              type="file" 
              onChange={handleFileChange} 
              accept=".pdf,.doc,.docx,.txt" 
              disabled={uploading} 
              multiple 
              aria-describedby="file-error" 
              name="files"
            />
            {error && <p id="file-error" className="text-red-500 text-sm">{error}</p>}
            {fileNames.length > 0 && (
              <ul className="list-disc pl-5" aria-label="Selected files">
                {fileNames.map((fileName, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{fileName}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)} aria-label={`Remove ${fileName}`}>
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <Button type="submit" disabled={fileNames.length === 0 || uploading}>
              <Upload className="mr-2 h-4 w-4" /> Process Files
            </Button>
          </div>
        </form>
      )}
      {uploading && <UploadAnimation fileNames={fileNames} onComplete={handleAnimationComplete} />}
    </div>
  )
}

