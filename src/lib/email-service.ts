// Email service using EmailJS
// Install with: npm install @emailjs/browser

// Note: Import will work once @emailjs/browser is installed
// import emailjs from '@emailjs/browser';

// Configuration - set these in your environment variables or use defaults
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_hn5lrl4';
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';

// Email assets hosted on Cloudflare R2
const EMAIL_LOGO_URL = process.env.REACT_APP_EMAIL_LOGO_URL || 'https://pub-bfb994b9a59b4cde864e00ae50d54eb3.r2.dev/emails/outpost-logo.png';

// Template IDs - configure these in EmailJS dashboard
const TEMPLATES = {
  customerConfirmation: process.env.REACT_APP_EMAILJS_TEMPLATE_CUSTOMER || 'template_ty4nfnj',
  staffNotification: process.env.REACT_APP_EMAILJS_TEMPLATE_STAFF || 'template_pvjzi6q',
  quoteSent: process.env.REACT_APP_EMAILJS_TEMPLATE_QUOTE || 'template_wnny4xr',
};

export interface CustomerConfirmationData {
  to_email: string;
  customer_name: string;
  enquiry_ref: string;
  product_name: string;
  estimated_response: string;
}

export interface StaffNotificationData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_name: string;
  enquiry_id: string;
  enquiry_ref: string;
  enquiry_type: string;
  estimated_quantity?: string;
  additional_notes?: string;
  logo_quality?: string;
  admin_link: string;
}

export interface QuoteSentData {
  to_email: string;
  customer_name: string;
  enquiry_ref: string;
  product_name: string;
  quote_amount: string;
  quote_notes?: string;
  mockup_image_url?: string;
}

// Check if EmailJS is properly configured
export function isEmailConfigured(): boolean {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_PUBLIC_KEY && TEMPLATES.customerConfirmation);
}

// Initialize EmailJS - call this once on app startup
export async function initEmailService(): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn('EmailJS not configured. Email notifications will be disabled.');
    return;
  }

  try {
    // Dynamic import to avoid build errors if package isn't installed
    const emailjs = await import('@emailjs/browser');
    emailjs.default.init(EMAILJS_PUBLIC_KEY);
    console.log('EmailJS initialized successfully');
  } catch (error) {
    console.warn('EmailJS package not installed. Run: npm install @emailjs/browser');
  }
}

// Send customer confirmation email
export async function sendCustomerConfirmation(
  data: CustomerConfirmationData
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.log('Email not configured - skipping customer confirmation');
    return { success: true }; // Don't fail the submission if email isn't configured
  }

  try {
    const emailjs = await import('@emailjs/browser');

    const templateParams = {
      to_email: data.to_email,
      customer_name: data.customer_name,
      enquiry_ref: data.enquiry_ref,
      product_name: data.product_name,
      estimated_response: data.estimated_response || '24 hours',
      logo_url: EMAIL_LOGO_URL,
    };

    await emailjs.default.send(
      EMAILJS_SERVICE_ID,
      TEMPLATES.customerConfirmation,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Customer confirmation email sent');
    return { success: true };
  } catch (error) {
    console.error('Failed to send customer confirmation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}

// Send staff notification email
export async function sendStaffNotification(
  data: StaffNotificationData
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.log('Email not configured - skipping staff notification');
    return { success: true };
  }

  try {
    const emailjs = await import('@emailjs/browser');

    const templateParams = {
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      product_name: data.product_name,
      enquiry_id: data.enquiry_id,
      enquiry_ref: data.enquiry_ref,
      enquiry_type: data.enquiry_type,
      estimated_quantity: data.estimated_quantity || 'Not specified',
      additional_notes: data.additional_notes || 'None',
      logo_quality: data.logo_quality || 'N/A',
      admin_link: data.admin_link,
      logo_url: EMAIL_LOGO_URL,
    };

    await emailjs.default.send(
      EMAILJS_SERVICE_ID,
      TEMPLATES.staffNotification,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Staff notification email sent');
    return { success: true };
  } catch (error) {
    console.error('Failed to send staff notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}

// Send quote to customer
export async function sendQuoteEmail(
  data: QuoteSentData
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured() || !TEMPLATES.quoteSent) {
    console.log('Email not configured - skipping quote email');
    return { success: true };
  }

  try {
    const emailjs = await import('@emailjs/browser');

    const templateParams = {
      to_email: data.to_email,
      customer_name: data.customer_name,
      enquiry_ref: data.enquiry_ref,
      product_name: data.product_name,
      quote_amount: data.quote_amount,
      quote_notes: data.quote_notes || '',
      mockup_image_url: data.mockup_image_url || '',
      logo_url: EMAIL_LOGO_URL,
    };

    await emailjs.default.send(
      EMAILJS_SERVICE_ID,
      TEMPLATES.quoteSent,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Quote email sent');
    return { success: true };
  } catch (error) {
    console.error('Failed to send quote email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}

// Combined function to send both customer and staff emails after enquiry submission
export async function sendEnquiryEmails(params: {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  enquiryId: string;
  enquiryRef: string;
  productName: string;
  enquiryType: 'upload' | 'design_help' | 'consultation';
  estimatedQuantity?: string;
  additionalNotes?: string;
  logoQuality?: string;
}): Promise<{ customerEmailSent: boolean; staffEmailSent: boolean }> {
  const baseUrl = window.location.origin;
  const adminLink = `${baseUrl}/admin/enquiries/${params.enquiryId}`;

  const enquiryTypeLabels = {
    upload: 'Logo Upload',
    design_help: 'Design Help Requested',
    consultation: 'Consultation Booking',
  };

  // Send both emails in parallel
  const [customerResult, staffResult] = await Promise.all([
    sendCustomerConfirmation({
      to_email: params.customerEmail,
      customer_name: params.customerName,
      enquiry_ref: params.enquiryRef,
      product_name: params.productName,
      estimated_response: '24 hours',
    }),
    sendStaffNotification({
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      customer_phone: params.customerPhone,
      product_name: params.productName,
      enquiry_id: params.enquiryId,
      enquiry_ref: params.enquiryRef,
      enquiry_type: enquiryTypeLabels[params.enquiryType],
      estimated_quantity: params.estimatedQuantity,
      additional_notes: params.additionalNotes,
      logo_quality: params.logoQuality,
      admin_link: adminLink,
    }),
  ]);

  return {
    customerEmailSent: customerResult.success,
    staffEmailSent: staffResult.success,
  };
}

/*
EMAILJS SETUP INSTRUCTIONS
==========================

1. Create an account at https://www.emailjs.com/

2. Create an email service:
   - Go to Email Services > Add New Service
   - Connect your email provider (Gmail, Outlook, etc.)
   - Note the Service ID

3. Create email templates:

   Customer Confirmation Template:
   - Subject: "Your Enquiry Received - {{enquiry_ref}}"
   - Body:
     Hi {{customer_name}},

     Thank you for your enquiry about {{product_name}}.

     Your reference number is: {{enquiry_ref}}

     Our team will review your request and get back to you within {{estimated_response}}.

     Best regards,
     Outpost Custom Team

   Staff Notification Template:
   - Subject: "New Clothing Enquiry - {{enquiry_ref}}"
   - Body:
     New enquiry received!

     Customer: {{customer_name}}
     Email: {{customer_email}}
     Phone: {{customer_phone}}

     Product: {{product_name}}
     Type: {{enquiry_type}}
     Quantity: {{estimated_quantity}}
     Logo Quality: {{logo_quality}}

     Notes: {{additional_notes}}

     View in admin: {{admin_link}}

4. Get your Public Key:
   - Go to Account > General
   - Copy the Public Key

5. Add to environment variables:
   REACT_APP_EMAILJS_SERVICE_ID=your_service_id
   REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
   REACT_APP_EMAILJS_TEMPLATE_CUSTOMER=your_customer_template_id
   REACT_APP_EMAILJS_TEMPLATE_STAFF=your_staff_template_id
   REACT_APP_EMAILJS_TEMPLATE_QUOTE=your_quote_template_id (optional)

*/
