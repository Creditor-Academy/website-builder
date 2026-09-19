import React from 'react';

const WebsiteShimmer: React.FC = () => {
  return (
    <tr className="animate-pulse">
      <td className="whitespace-nowrap px-4 py-3">
        <div className="h-4 w-40 rounded bg-gray-200" />
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <div className="h-4 w-48 rounded bg-gray-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 rounded bg-gray-200" />
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <div className="h-4 w-32 rounded bg-gray-200" />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-right">
        <div className="ml-auto h-8 w-8 rounded-full bg-gray-200" />
      </td>
    </tr>
  );
};

export default WebsiteShimmer;
