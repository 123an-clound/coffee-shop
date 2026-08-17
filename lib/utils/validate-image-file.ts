const MAX_SIZE_BYTES = 5 * 1024 * 1024

type ImageSignature = {
  extension: string
  contentType: string
  matches: (bytes: Uint8Array) => boolean
}

const SIGNATURES: ImageSignature[] = [
  {
    extension: 'jpg',
    contentType: 'image/jpeg',
    matches: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    extension: 'png',
    contentType: 'image/png',
    matches: (b) =>
      b.length >= 8 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47 &&
      b[4] === 0x0d &&
      b[5] === 0x0a &&
      b[6] === 0x1a &&
      b[7] === 0x0a,
  },
  {
    extension: 'webp',
    contentType: 'image/webp',
    matches: (b) =>
      b.length >= 12 &&
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
]

export type ValidateImageFileResult =
  | { ok: true; extension: string; contentType: string }
  | { ok: false; error: string }

export function validateImageFile(bytes: Uint8Array, size: number): ValidateImageFileResult {
  if (size <= 0) {
    return { ok: false, error: 'File rỗng.' }
  }
  if (size > MAX_SIZE_BYTES) {
    return { ok: false, error: 'Ảnh không được vượt quá 5MB.' }
  }
  const signature = SIGNATURES.find((s) => s.matches(bytes))
  if (!signature) {
    return { ok: false, error: 'Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP.' }
  }
  return { ok: true, extension: signature.extension, contentType: signature.contentType }
}
