export interface User {
  id: string;
  name: string;
  email: string;
  role: 'marketing' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  finalizedRate: number;
  remarks?: string;
}

export interface ClientVisit {
  id: string;
  clientName: string;
  businessLocation: string;
  date: string;
  products: Product[];
  marketingPersonId: string;
  marketingPersonName: string;
  status: 'draft' | 'submitted';
  submittedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}