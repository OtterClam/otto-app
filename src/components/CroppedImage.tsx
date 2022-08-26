import Image, { ImageLoader, ImageProps } from 'next/image'
import { getCroppedImageUrl } from 'utils/image'

const croppedImageLoader: ImageLoader = ({ src, width, quality }) =>
  getCroppedImageUrl(src, {
    w: width,
    q: quality,
  })

export default function CroppedImage(props: ImageProps) {
  return <Image {...props} loader={croppedImageLoader} />
}
