import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, hasSupabase } from '@/lib/supabase/client';

const inquirySchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  serviceType: z.string().default('Architecture'),
  message: z.string().min(5),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = inquirySchema.parse(body);

    if (hasSupabase && supabase) {
      const { error } = await supabase.from('inquiries').insert([
        {
          full_name: data.fullName,
          email: data.email,
          phone: data.phone || null,
          location: data.location || null,
          service_type: data.serviceType,
          message: data.message,
          status: 'unread',
        },
      ]);

      if (error) {
        console.error('Supabase inquiry insert error:', error);
      }
    } else {
      console.log('Inquiry logged (Local fallback mode):', data);
    }

    return NextResponse.json({ success: true, message: 'Inquiry received' });
  } catch (err: unknown) {
    console.error('Inquiry validation error:', err);
    return NextResponse.json(
      { success: false, error: 'Invalid input data' },
      { status: 400 }
    );
  }
}
