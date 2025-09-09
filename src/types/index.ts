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
  marketingPersonName: string;
  status: 'draft' | 'submitted';
  submittedAt?: string;
}