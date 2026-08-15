export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  signerName: string;
  price: number;
  imageUrl: string;
  /** Stock available at the time this item was added — bounds the quantity selector. */
  maxQuantity: number;
  quantity: number;
};
