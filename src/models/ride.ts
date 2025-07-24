export interface Ride {
  id?: number;
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver_id: number;
  driver_name: string;
  value: number;
  date: string; // ISO string
} 