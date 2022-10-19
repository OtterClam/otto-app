export interface CropImageOptions {
  w?: number
  h?: number
  q?: number
}

export const getCroppedImageUrl = (url: string, options: CropImageOptions = {}): string => {
  if (process.env.NEXT_PUBLIC_DISABLE_IMAGE_RESIZE_SERVICE === 'true') {
    return url
  }

  if (!/^https?:\/\//.test(url) && typeof location !== 'undefined') {
    url = `${location.protocol}//${location.host}/${url.replace(/^\/+/, '')}`
  }

  const croppedUrl = new URL('https://images.weserv.nl')

  croppedUrl.searchParams.set('url', url)
  croppedUrl.searchParams.set('il', '')

  Array.from(Object.entries(options)).forEach(([key, val]) => {
    croppedUrl.searchParams.set(key, val)
  })

  return croppedUrl.toString()
}
