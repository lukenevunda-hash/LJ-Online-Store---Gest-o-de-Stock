
export enum Category {
  ELECTRONICS = 'Eletrônicos',
  CLOTHING = 'Vestuário',
  HOME = 'Casa',
  BEAUTY = 'Beleza',
  OTHER = 'Outros'
}

export enum PaymentMethod {
  CASH = 'Dinheiro',
  TRANSFER = 'Transferência',
  CARD = 'Cartão',
  PIX = 'PIX'
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: Category;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  supplier: string;
  entryDate: string;
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  totalValue: number;
  profit: number;
  date: string;
  paymentMethod: PaymentMethod;
  customerId?: string;
}

export interface Purchase {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  date: string;
  supplier: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}
