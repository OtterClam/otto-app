export interface CropImageOptions {
  w?: number
  h?: number
}

export const getCroppedImageUrl = (url: string, options: CropImageOptions = {}): string => {
  const croppedUrl = new URL('https://images.weserv.nl')

  croppedUrl.searchParams.set('url', url)

  Array.from(Object.entries(options)).forEach(([key, val]) => {
    croppedUrl.searchParams.set(key, val)
  })

  return croppedUrl.toString()
}
