import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Website {
  id: string;
  name: string;
  domain: string;
  status: 'Draft' | 'Published' | 'Deleted';
  lastUpdated: string;
}

const dummyMyWebsites: Website[] = [
  { id: "web1", name: "My Personal Blog", domain: "myblog.athenalms.com", status: "Published", lastUpdated: "2023-10-26" },
  { id: "web2", name: "Portfolio Site", domain: "myporfolio.athenalms.com", status: "Draft", lastUpdated: "2023-11-15" },
];

const dummyAllWebsites: Website[] = [
  { id: "web1", name: "My Personal Blog", domain: "myblog.athenalms.com", status: "Published", lastUpdated: "2023-10-26" },
  { id: "web2", name: "Portfolio Site", domain: "myporfolio.athenalms.com", status: "Draft", lastUpdated: "2023-11-15" },
  { id: "web3", name: "Client Project X", domain: "projectx.athenalms.com", status: "Published", lastUpdated: "2023-12-01" },
  { id: "web4", name: "E-commerce Store", domain: "shop.athenalms.com", status: "Draft", lastUpdated: "2023-09-20" },
];

export default function DashboardWebsites() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Simulate admin role toggle

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setWebsites(isAdmin ? dummyAllWebsites : dummyMyWebsites);
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, [isAdmin]);

  const handleEdit = (website: Website) => {
    console.log("Edit website:", website);
    // In a real application, this would navigate to an edit page or open a modal
  };

  const handleDelete = (website: Website) => {
    console.log("Delete website:", website);
    // In a real application, this would trigger a deletion confirmation and API call
  };

  const handleDuplicate = (website: Website) => {
    console.log("Duplicate website:", website);
    // In a real application, this would create a copy of the website
  };

  const handlePreview = (website: Website) => {
    console.log("Preview website:", website);
    // In a real application, this would open the website in a new tab
  };

  if (isLoading) {
    return <div className="p-6">Loading websites...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Website Management</h2>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {isAdmin ? "All Websites" : "My Websites"}
        </h3>
        <Button onClick={() => setIsAdmin(!isAdmin)}>
          Toggle Admin View ({isAdmin ? "ON" : "OFF"})
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {websites.map((website) => (
            <TableRow key={website.id}>
              <TableCell className="font-medium">{website.id}</TableCell>
              <TableCell>{website.name}</TableCell>
              <TableCell>{website.domain}</TableCell>
              <TableCell>{website.status}</TableCell>
              <TableCell>{website.lastUpdated}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(website)}>Edit</Button>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleDuplicate(website)}>Duplicate</Button>
                <Button variant="secondary" size="sm" className="mr-2" onClick={() => handlePreview(website)}>Preview</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(website)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
