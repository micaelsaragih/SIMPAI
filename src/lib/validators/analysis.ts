import { z } from "zod"

/**
 * Validation rules for analysis file uploads.
 * Max size: 20MB, Format: DOCX only.
 */

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB
const ACCEPTED_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export const ANALYSIS_FILE_CONSTRAINTS = {
  maxSizeBytes: MAX_FILE_SIZE_BYTES,
  maxSizeMB: 20,
  acceptedMimeType: ACCEPTED_MIME_TYPE,
  acceptedExtension: ".docx",
  accept: ".docx",
} as const

export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE_BYTES,
      `Ukuran file maksimal ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB`
    )
    .refine(
      (file) =>
        file.type === ACCEPTED_MIME_TYPE ||
        file.name.toLowerCase().endsWith(".docx"),
      "Format file harus DOCX"
    ),
})

export type FileUploadValues = z.infer<typeof fileUploadSchema>

/**
 * Validates a file before upload.
 * Returns an error message string or null if valid.
 */
export function validateUploadFile(file: File): string | null {
  if (!file) {
    return "File wajib diunggah."
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`
  }

  const isValidType = file.type === ACCEPTED_MIME_TYPE
  const isValidExtension = file.name.toLowerCase().endsWith(".docx")

  if (!isValidType && !isValidExtension) {
    return "Format file tidak didukung. Gunakan file DOCX."
  }

  return null
}
