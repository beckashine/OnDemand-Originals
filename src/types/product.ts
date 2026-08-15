export const SPORTS = ["Baseball", "Basketball", "Football", "Hockey", "Soccer"] as const;

export type Sport = (typeof SPORTS)[number];

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  category: string;
  published: boolean;
  sport: Sport;
  signerName: string;
  condition: string;
  authenticated: boolean;
};
