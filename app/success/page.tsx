"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const filesParam = searchParams.get("files")
  const fileNames = filesParam ? JSON.parse(decodeURIComponent(filesParam)) : []

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Upload Successful!</h1>
      <p className="mb-4">The following documents have been uploaded:</p>
      <ul className="list-disc pl-5 mb-8">
        {fileNames.map((fileName: string, index: number) => (
          <li key={index}>{fileName}</li>
        ))}
      </ul>
      <Link href="/">
        <Button>Back to Upload</Button>
      </Link>
    </main>
  )
}

