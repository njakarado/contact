export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: Address;
}
