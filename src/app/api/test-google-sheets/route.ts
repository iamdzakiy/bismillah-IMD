import { NextResponse } from 'next/server';
import { syncRegistrationToSheet, appendToSheet } from '@/lib/google-sheets';

export async function GET() {
  try {
    // Test 1: Simple append test
    await appendToSheet('Test', ['Test timestamp', 'Test data', new Date().toISOString()]);
    
    // Test 2: Registration sync test
    await syncRegistrationToSheet({
      id: 'TEST-' + Date.now(),
      teamName: 'Test Team',
      competitionType: 'NEC',
      captainEmail: 'test@example.com',
      captainName: 'Test User',
      institution: 'Test Institution',
      status: 'PENDING',
      members: [
        {
          name: 'Member 1',
          email: 'member1@example.com',
          institution: 'Test Institution',
          phone: '081234567890',
          age: 20,
          studentProofUrl: 'https://example.com/proof.pdf',
          role: 'MEMBER',
        },
      ],
      paymentProofUrl: 'https://example.com/payment.pdf',
    });

    return NextResponse.json({
      success: true,
      message: 'Google Sheets test completed. Check your sheet for new entries.',
    });
  } catch (error) {
    console.error('Google Sheets test error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}