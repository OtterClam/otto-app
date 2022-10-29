export default interface Product {
  id: number
  name: string
  desc: string
  price: string
  displayPrice: string
  airdropAmount: number
  discountPrice: string
  displayDiscountPrice: string
  amount: number
  type: string
  image: string
  factory: string
  mustDesc?: string
  guarantee_rarity?: string
}
