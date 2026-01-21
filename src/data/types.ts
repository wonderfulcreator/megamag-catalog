export type ProductType =
  | "Бумажные подарочные"
  | "Премиум / LUX"
  | "Крафт"
  | "Под бутылку"
  | "Однотонные";

export type ProductVariant = {
  sku: string;
  // optional fields if you later add exact marketplace links per SKU
  ozon?: string;
  wildberries?: string;
  ymarket?: string;
};

export type ProductGroup = {
  id: string;
  type: ProductType;
  series: string;
  size?: string | null;
  title: string;
  tags: string[];
  variantCount: number;
  variants: ProductVariant[];
  coverImage?: string | null;
  images: string[];
};

export type CatalogData = {
  generatedAt: string;
  groups: ProductGroup[];
};
