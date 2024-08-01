export type App_Authenticated_User = {
  jwt: string;
  user: App_User;
};

export type Error = {
  name: string;
  path: string[];
  message: string;
};

export type App_Exception = {
  name: string;
  status: number;
  message: string;
  details: { errors?: Error[] };
};

export type App_Author = {
  id: number;
  firstname: string;
  lastname: string;
  username: string | null;
};

export type App_Request = {
  data: any;
  params: any;
  url: string;
  headers: any;
  method: string;
  baseURL: string;
};

export type App_Pagination = {
  page: number;
  total: number;
  pageSize: number;
  pageCount: number;
};

export type App_Response<T> = {
  results: T;
  pagination: App_Pagination;
};

export type App_User = {
  id: number;
  email: string;
  provider: string;
  username: string;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  confirmed: boolean;
};

export type App_Order = {
  id: number;
  user: App_User;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  createdBy: App_Author;
  updatedBy: App_Author;
  pricePaidInCents: number;
  products: { count: string };
};

export type App_Admin = {
  token: string;
  sessionTime: string;
  user: {
    id: number;
    email: string;
    lastname: string;
    blocked: boolean;
    isActive: boolean;
    firstname: string;
    createdAt: string;
    updatedAt: string;
    username: string | null;
    preferedLanguage: string | null;
  };
};

export type App_Response_Public<T> = {
  data: T;
  meta: { pagination: App_Pagination };
};

export type App_Response_Data_Public<T> = {
  id: number;
  attributes: T;
};

export type App_Response_File = {
  id: number;
  url: string;
  name: string;
  hash: string;
  size: number;
};

export type App_Product_Public = App_Response_Data_Public<{
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  publishedAt: string;
  priceInCents: number;
  isAvailableForPurchase: boolean;
  filePath: { data: App_Response_Data_Public<App_Response_File> };
  imagePath: { data: App_Response_Data_Public<App_Response_File>[] };
}>;
