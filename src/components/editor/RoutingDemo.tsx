import React from 'react';
import { Button } from '@/components/ui/button';

export function RoutingDemo() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Universal Button Routing System</h2>
      
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2 text-green-800">✅ Features Implemented:</h3>
        <ul className="space-y-1 text-sm text-green-700">
          <li>• <strong>5 Route Types:</strong> External, Internal, Email, Phone, Anchor</li>
          <li>• <strong>Hero Section Integration:</strong> All hero variants now support routing</li>
          <li>• <strong>Properties Panel Controls:</strong> Configure routes per button</li>
          <li>• <strong>Smart URL Handling:</strong> Auto-prefixes for mailto:, tel:, etc.</li>
          <li>• <strong>Target Control:</strong> Choose new tab or same tab for external links</li>
          <li>• <strong>Global Button Routes:</strong> Reusable route configurations</li>
        </ul>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2 text-blue-800">📝 How to Use:</h3>
        <ol className="space-y-1 text-sm text-blue-700">
          <li>1. Select any Hero or CTA section</li>
          <li>2. In Properties Panel, configure button routes:</li>
          <li>3. Choose route type (External/Internal/Email/Phone/Anchor)</li>
          <li>4. Enter URL (auto-formats based on type)</li>
          <li>5. Buttons will now navigate accordingly</li>
        </ol>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2 text-purple-800">🔗 Route Types Explained:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-white p-3 rounded border border-purple-200">
            <strong className="text-purple-600">External:</strong>
            <p className="text-xs mt-1">Opens external websites in new tab</p>
            <code className="text-xs bg-purple-100 px-1 rounded">https://example.com</code>
          </div>
          <div className="bg-white p-3 rounded border border-purple-200">
            <strong className="text-purple-600">Internal:</strong>
            <p className="text-xs mt-1">Navigates within your site</p>
            <code className="text-xs bg-purple-100 px-1 rounded">/about</code>
          </div>
          <div className="bg-white p-3 rounded border border-purple-200">
            <strong className="text-purple-600">Email:</strong>
            <p className="text-xs mt-1">Opens email client</p>
            <code className="text-xs bg-purple-100 px-1 rounded">mailto:contact@site.com</code>
          </div>
          <div className="bg-white p-3 rounded border border-purple-200">
            <strong className="text-purple-600">Phone:</strong>
            <p className="text-xs mt-1">Opens phone dialer</p>
            <code className="text-xs bg-purple-100 px-1 rounded">tel:+1234567890</code>
          </div>
          <div className="bg-white p-3 rounded border border-purple-200">
            <strong className="text-purple-600">Anchor:</strong>
            <p className="text-xs mt-1">Scrolls to page section</p>
            <code className="text-xs bg-purple-100 px-1 rounded">#section-id</code>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 text-orange-800">🚀 Advanced Features:</h3>
        <ul className="space-y-1 text-sm text-orange-700">
          <li>• <strong>Global Button Routes:</strong> Create reusable button configurations</li>
          <li>• <strong>RouteableButton Component:</strong> Drop-in routing for any button</li>
          <li>• <strong>RouteableLink Component:</strong> Routing for anchor tags</li>
          <li>• <strong>Smart Placeholders:</strong> Context-aware URL suggestions</li>
          <li>• <strong>Security:</strong> All external links get proper security attributes</li>
        </ul>
      </div>
    </div>
  );
}
