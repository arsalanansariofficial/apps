export interface Modal_Ref {
  open: () => void;
  close: () => void;
}

export interface App_Exception {
  code: number;
  message: string;
}

export interface App_Request {
  data?: any;
  params?: any;
  url: string;
  headers?: any;
  baseURL: string;
  method?: 'POST' | 'PUT' | 'GET' | 'DELETE' | 'PATCH';
}

export type IDENTIFIER =
  | 'cart'
  | 'user'
  | 'product'
  | 'response'
  | 'products'
  | 'isLoading'
  | 'exception'
  | 'filteredProducts'
  | 'userHavingOrders';

export interface App_User {
  __v: number;
  _id: string;
  token: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  orders: App_Order[];
  expirationDate: string;
}

export interface App_Product {
  __v: number;
  _id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  productImage: string;
}

export interface App_Order {
  _id: string;
  __v: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  products: App_Product[];
}
