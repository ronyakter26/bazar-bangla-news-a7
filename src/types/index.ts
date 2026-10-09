export interface Product {
  id: string | number;
  name?: string;
  title?: string;
  price: string | number;
  change?: string;
  unit?: string;
}

export interface UserSession {
  user?: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
}