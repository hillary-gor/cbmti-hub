'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { FeePayment, ParsedPaymentData, PaymentFormState, PaymentSource, PaymentStatus } from '@/types/fee_payment';

function parsePaymentMessage(message: string): ParsedPaymentData {
  const data: ParsedPaymentData = {
    amount: null,
    reference: null,
    parsed_date: null,
    parsed_time: null,
    institution: null,
    account_number: null,
    source: null as PaymentSource | null,
    isValid: false,
    errors: [],
  };

  message = message.trim();

  // New M-Pesa regex for "sent to" messages
  // Example: "SB11QK9X7B Confirmed. Ksh12,000.00 sent to NCBA BANK KENYA PLC. for account 5571370018 on 1/2/24 at 3:14 PM New M-PESA balance is Ksh1,044.97."
  const mpesaSentRegex = /(?:M-Pesa Ref:\s*|)([A-Z0-9]+)\s+Confirmed\.\s+Ksh([0-9,]+\.?\d{0,2})\s+sent\s+to\s+([A-Z0-9\s.,]+?)(?:\s+for\s+account\s+([A-Z0-9]+)|)\s+on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/i;


  // New NCBA regex for "Your M-Pesa payment... was successful"
  // Example: "Your M-Pesa payment of KES 6,200.00 to CODE BLUE MEDICAL TRAINING INSTITUTE 123321 was successful on 20/06/2025 07:34 PM. M-Pesa Ref: TFK6OJWXV2. NCBA, Go for it."
  const ncbaMpesaPaymentRegex = /Your M-Pesa payment of (?:KES|Ksh)\s*([0-9,]+\.?\d{0,2})\s+to\s+([A-Z0-9\s.,]+?)(?:\s+(\d+)|)\s+was successful on (\d{1,2}\/\d{1,2}\/\d{2,4})\s+(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\.\s+M-Pesa Ref:\s*([A-Z0-9]+)\.\s*(NCBA|KCB|Equity|Co-op Bank)/i;


  let match;

  // Try NCBA message format first as it's quite distinct
  match = message.match(ncbaMpesaPaymentRegex);
  if (match) {
    data.source = 'ncba'; // Indicates it's an NCBA SMS about an M-Pesa payment
    data.amount = parseFloat(match[1].replace(/,/g, ''));
    data.institution = match[2].trim();
    data.account_number = match[3] || null; // Account number might be optional in this regex capture group
    data.reference = match[6];

    // Date parsing (DD/MM/YYYY)
    const [day, month, year] = match[4].split('/');
    data.parsed_date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // Time parsing (HH:MM AM/PM)
    const timeStr = match[5].toUpperCase().replace(/\s/g, '');
    if (timeStr.endsWith('AM') || timeStr.endsWith('PM')) {
      const [hourMin, ampm] = [timeStr.slice(0, -2), timeStr.slice(-2)];
      const [h, m] = hourMin.split(':');
      let hours = parseInt(h);
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0; // Midnight
      data.parsed_time = `${String(hours).padStart(2, '0')}:${m}:00`;
    } else {
      data.parsed_time = `${match[5]}:00`.substring(0, 8);
    }
  } else {
    // Try M-Pesa "sent to" message format
    match = message.match(mpesaSentRegex);
    if (match) {
      data.source = 'mpesa';
      data.reference = match[1];
      data.amount = parseFloat(match[2].replace(/,/g, ''));
      data.institution = match[3].trim();
      data.account_number = match[4] || null;

      // Date parsing (D/M/YY or DD/MM/YYYY)
      const [day, month, year] = match[5].split('/');
      const fullYear = year.length === 2 ? `20${year}` : year;
      data.parsed_date = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      // Time parsing (H:MM AM/PM or HH:MM AM/PM)
      const timeStr = match[6].toUpperCase().replace(/\s/g, '');
      if (timeStr.endsWith('AM') || timeStr.endsWith('PM')) {
        const [hourMin, ampm] = [timeStr.slice(0, -2), timeStr.slice(-2)];
        const [h, m] = hourMin.split(':');
        let hours = parseInt(h);
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        data.parsed_time = `${String(hours).padStart(2, '0')}:${m}:00`;
      } else {
        data.parsed_time = `${match[6]}:00`.substring(0, 8);
      }
    }
  }


  if (data.amount === null || isNaN(data.amount) || data.amount <= 0) {
    data.errors.push('Could not parse valid amount.');
  }
  if (!data.reference) {
    data.errors.push('Could not parse reference code.');
  }
  if (!data.parsed_date || !/^\d{4}-\d{2}-\d{2}$/.test(data.parsed_date)) {
    data.errors.push('Could not parse valid date (YYYY-MM-DD).');
  }
  if (!data.parsed_time || !/^\d{2}:\d{2}:\d{2}$/.test(data.parsed_time)) {
    data.errors.push('Could not parse valid time (HH:MM:SS).');
  }
  if (!data.source) {
    data.errors.push('Could not determine source (M-Pesa/NCBA).');
  }

  data.isValid = data.errors.length === 0;

  return data;
}

async function getUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

export async function recordFeePayment(
  prevState: PaymentFormState,
  formData: FormData
): Promise<PaymentFormState> {
  const messageText = formData.get('messageText') as string;
  const studentId = await getUserId();

  if (!studentId) {
    redirect('/login');
  }

  if (!messageText) {
    return { status: 'error', message: 'Payment SMS message cannot be empty.', parsedData: null };
  }

  const parsedData = parsePaymentMessage(messageText);

  if (!parsedData.isValid) {
    return { status: 'error', message: `Parsing failed: ${parsedData.errors.join(', ')}`, parsedData: parsedData };
  }

  const supabase = await createClient();

  try {
    const { data: existingPayments, error: duplicateCheckError } = await supabase
      .from('fee_payments')
      .select('id')
      .eq('reference', parsedData.reference)
      .eq('parsed_date', parsedData.parsed_date)
      .eq('parsed_time', parsedData.parsed_time)
      .eq('amount', parsedData.amount)
      .eq('student_id', studentId);

    if (duplicateCheckError) {
      console.error('Duplicate check error:', duplicateCheckError);
      return { status: 'error', message: 'Error checking for duplicates. Please try again.', parsedData: null };
    }

    if (existingPayments && existingPayments.length > 0) {
      return { status: 'error', message: 'Duplicate payment detected. This payment has already been recorded.', parsedData: parsedData };
    }

    const { error: insertError } = await supabase.from('fee_payments').insert({
      student_id: studentId,
      amount: parsedData.amount,
      reference: parsedData.reference,
      institution: parsedData.institution,
      account_number: parsedData.account_number,
      message_text: messageText,
      parsed_date: parsedData.parsed_date,
      parsed_time: parsedData.parsed_time,
      status: 'pending',
      source: parsedData.source,
    });

    if (insertError) {
      console.error('Insert error:', insertError);
      return { status: 'error', message: `Failed to record payment: ${insertError.message}`, parsedData: null };
    }

    revalidatePath('/dashboard/students/record-fee-payment');
    return { status: 'success', message: 'Payment recorded successfully with pending status!', parsedData: parsedData };

  } catch (error) {
    console.error('Unhandled error in recordFeePayment:', error);
    return { status: 'error', message: 'An unexpected error occurred.', parsedData: null };
  }
}

export async function getFeePayments(filterStatus?: PaymentStatus): Promise<FeePayment[]> {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    console.warn('Attempted to fetch payments without an authenticated user.');
    redirect('/login');
  }

  let query = supabase
    .from('fee_payments')
    .select('*')
    .eq('student_id', userId)
    .order('recorded_at', { ascending: false });

  if (filterStatus && ['pending', 'approved', 'declined'].includes(filterStatus)) {
    query = query.eq('status', filterStatus);
  }

  const { data: payments, error } = await query;

  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }

  return payments || [];
}

export async function updatePaymentStatus(paymentId: string, newStatus: PaymentStatus) {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    return { status: 'error', message: 'Authentication required.' };
  }

  const { error } = await supabase
    .from('fee_payments')
    .update({ status: newStatus })
    .eq('id', paymentId)
    .eq('student_id', userId);

  if (error) {
    console.error('Error updating payment status:', error);
    return { status: 'error', message: `Failed to update status: ${error.message}` };
  }

  revalidatePath('/dashboard/students/record-fee-payment');
  return { status: 'success', message: 'Payment status updated.' };
}
