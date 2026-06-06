import { z } from "zod"

/**
 * Validation schema for profile update form.
 */

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  avatar_url: z
    .string()
    .url("Format URL tidak valid")
    .or(z.literal(""))
    .optional(),
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>
