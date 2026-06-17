import React from 'react';

const WebsiteShimmer: React.FC = () => {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="text-center px-4 py-3 whitespace-nowrap">
        <div className="flex justify-center">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </td>
    </tr>
  );
};

export default WebsiteShimmer;
