// lib/types/supabase.ts

import { Database, Tables } from '@/types/supabase';

export type Course = Tables<'courses'>;
export type Intake = Tables<'intakes'>;
export type StudentRow = Tables<'students'>;

export type PaymentStatus = 'pending' | 'approved' | 'declined';
export type PaymentSource = 'mpesa' | 'ncba';

export interface FeePayment {
  id: string;
  student_id: string;
  amount: number;
  reference: string;
  institution: string | null;
  account_number: string | null;
  message_text: string;
  parsed_date: string;
  parsed_time: string;
  status: PaymentStatus;
  source: PaymentSource | null;
  recorded_at: string;
}

export interface ParsedPaymentData {
  amount: number | null;
  reference: string | null;
  parsed_date: string | null;
  parsed_time: string | null;
  institution: string | null;
  account_number: string | null;
  source: PaymentSource | null;
  isValid: boolean;
  errors: string[];
}

export interface PaymentFormState {
  status: 'success' | 'error' | '';
  message: string;
  parsedData?: ParsedPaymentData | null;
}

export interface StudentWithRelations extends StudentRow {
  intake?: Tables<'intakes'> | null;
  course?: Tables<'courses'> | null;
}

export type DB = Database;