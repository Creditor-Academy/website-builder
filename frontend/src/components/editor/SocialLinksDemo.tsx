import React from 'react';
import { Button } from '@/components/ui/button';

export function SocialLinksDemo() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Social Links Management Demo</h2>
      
      <div className="bg-slate-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">✅ Features Implemented:</h3>
        <ul className="space-y-1 text-sm">
          <li>• Add new social media links in Properties Panel</li>
          <li>• Delete existing social links with X button</li>
          <li>• Edit social media platform (dropdown)</li>
          <li>• Edit custom URLs for each social link</li>
          <li>• Support for 11 platforms: Facebook, Twitter, Instagram, LinkedIn, YouTube, GitHub, Email, Phone, Address, Website, Discord</li>
          <li>• Interactive hover effects on footer social icons</li>
          <li>• Proper link handling (email, phone, maps, external sites)</li>
        </ul>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">📝 How to Use:</h3>
        <ol className="space-y-1 text-sm">
          <li>1. Open the Properties Panel (no section selected)</li>
          <li>2. Expand "Global Footer" section</li>
          <li>3. Click "+ Add Link" to add new social media</li>
          <li>4. Select platform from dropdown</li>
          <li>5. Enter your custom URL</li>
          <li>6. Click X to delete unwanted links</li>
        </ol>
      </div>
    </div>
  );
}
