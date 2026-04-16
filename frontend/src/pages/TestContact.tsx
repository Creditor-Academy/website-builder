import React from 'react';
import ContactFormSection from '../components/builder/ContactFormSection';

export default function TestContact() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Test Contact Form</h1>
      <p className="text-slate-600 mb-8">
        This is a test page for the contact form component. The form will submit with a test website ID.
      </p>
      
      <div className="max-w-2xl mx-auto">
        <ContactFormSection
          websiteId="test-website-123"
          onSuccess={(message) => alert('Success: ' + message)}
          onError={(error) => alert('Error: ' + error)}
        />
      </div>
    </div>
  );
}
