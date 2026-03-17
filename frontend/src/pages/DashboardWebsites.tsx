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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Globe2, LayoutGrid, ShieldCheck, User as UserIcon, Hash, FileText, Link, Clock, Edit, Copy, Eye, Trash2, MoreVertical, CheckCircle, CircleDotDashed, Ban
} from 'lucide-react';
import WebsiteShimmer from '@/components/dashboard/WebsiteShimmer';

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
  { id: "web5", name: "Old Portfolio", domain: "old.athenalms.com", status: "Deleted", lastUpdated: "2023-08-01" },
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

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Globe2 className="w-7 h-7 text-primary" /> Website Management
        </h2>
        <Button onClick={() => setIsAdmin(!isAdmin)} className="gap-2 w-full md:w-auto">
          {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />} 
          Toggle Admin View ({isAdmin ? "ON" : "OFF"})
        </Button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-slate-600" /> {isAdmin ? "All Websites" : "My Websites"}
        </h3>
        {/* Search Input can go here if needed */}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[80px] px-4 py-3 whitespace-nowrap">
                <span className="flex items-center gap-1.5"><Hash className="w-4 h-4" /> ID</span>
              </TableHead>
              <TableHead className="min-w-[150px] px-4 py-3 whitespace-nowrap">
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> Name</span>
              </TableHead>
              <TableHead className="min-w-[200px] px-4 py-3 whitespace-nowrap">
                <span className="flex items-center gap-1.5"><Link className="w-4 h-4" /> Domain</span>
              </TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 whitespace-nowrap">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Status</span>
              </TableHead>
              <TableHead className="min-w-[150px] px-4 py-3 whitespace-nowrap">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Last Updated</span>
              </TableHead>
              <TableHead className="text-center min-w-[120px] px-4 py-3 whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Shimmer loading effect
              Array.from({ length: 5 }).map((_, i) => <WebsiteShimmer key={i} />)
            ) : websites.length > 0 ? (
              // Display actual websites
              websites.map((website) => (
                <TableRow key={website.id}>
                  <TableCell className="font-medium px-4 py-3 whitespace-nowrap">{website.id}</TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap">{website.name}</TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap">{website.domain}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant={website.status === "Published" ? "default" : website.status === "Deleted" ? "destructive" : "secondary"}
                      className="flex items-center gap-1 w-fit"
                    >
                      {website.status === "Published" && <CheckCircle className="w-3 h-3" />}
                      {website.status === "Draft" && <CircleDotDashed className="w-3 h-3" />}
                      {website.status === "Deleted" && <Ban className="w-3 h-3" />}
                      {website.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-slate-500 text-sm">{website.lastUpdated}</TableCell>
                  <TableCell className="text-center px-4 py-3 whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(website)} className="gap-2">
                          <Edit className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(website)} className="gap-2">
                          <Copy className="w-4 h-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handlePreview(website)} className="gap-2">
                          <Eye className="w-4 h-4" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(website)} className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/5">
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // No websites found message
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No websites found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
