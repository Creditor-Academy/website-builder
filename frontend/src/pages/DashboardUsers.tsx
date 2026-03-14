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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Users, UserPlus, Search, Edit, UserX, UserCheck, UserCog, AlertTriangle, Clock, CalendarDays, ShieldCheck, User as UserIcon, Briefcase } from 'lucide-react'; // Import new icons

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Suspended'; // Refined status types
  createdAt: string;
  lastLogin: string;
}

export default function DashboardUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  const dummyUsers: User[] = [
    { id: "1", name: "Alice Smith", email: "alice@example.com", role: "Admin", status: "Active", createdAt: "2023-01-15", lastLogin: "2024-03-14" },
    { id: "2", name: "Bob Johnson", email: "bob@example.com", role: "Editor", status: "Inactive", createdAt: "2023-02-20", lastLogin: "2024-03-10" },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "User", status: "Active", createdAt: "2023-03-10", lastLogin: "2024-03-13" },
    { id: "4", name: "Diana Prince", email: "diana@example.com", role: "User", status: "Suspended", createdAt: "2023-04-01", lastLogin: "2024-03-05" },
    { id: "5", name: "Eve Adams", email: "eve@example.com", role: "User", status: "Active", createdAt: "2023-05-01", lastLogin: "2024-03-14" },
  ];

  useEffect(() => {
    // Simulate API call with dummy data
    setIsLoading(true);
    setTimeout(() => {
      setUsers(dummyUsers);
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, []);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    // Simulate API call and success
    setTimeout(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === editingUser.id ? editingUser : user))
      );
      setIsModalOpen(false);
      setEditingUser(null);
    }, 300); // Simulate network delay
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingUser) {
      const { id, value } = e.target;
      setEditingUser({ ...editingUser, [id]: value });
    }
  };

  const handleSelectChange = (id: keyof User, value: string) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [id]: value });
    }
  };

  const handleDeactivateClick = (user: User) => {
    setUserToDeactivate(user);
    setIsDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!userToDeactivate) return;

    // Simulate API call and success
    setTimeout(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userToDeactivate.id ? { ...user, status: "Inactive" } : user
        )
      );
      setIsDeactivateDialogOpen(false);
      setUserToDeactivate(null);
    }, 300); // Simulate network delay
  };

  const handleRestoreClick = (user: User) => {
    // Simulate API call to restore user
    setTimeout(() => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, status: "Active" } : u))
      );
    }, 300);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleAddUser = () => {
    console.log("Add new user");
    // In a real application, this would open a form to add a new user
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Users className="w-7 h-7 text-primary" /> Users Management
        </h2>
        <Button onClick={handleAddUser} className="gap-2 w-full md:w-auto">
          <UserPlus className="w-4 h-4" /> Add User
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-full md:max-w-sm pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[80px] px-4 py-3 whitespace-nowrap">ID</TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 whitespace-nowrap">Name</TableHead>
              <TableHead className="min-w-[150px] px-4 py-3 whitespace-nowrap">Email</TableHead>
              <TableHead className="min-w-[100px] px-4 py-3 whitespace-nowrap">Role</TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 whitespace-nowrap">Status</TableHead>
              <TableHead className="min-w-[140px] px-4 py-3 whitespace-nowrap">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" /> Created At
                </span>
              </TableHead>
              <TableHead className="min-w-[140px] px-4 py-3 whitespace-nowrap">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Last Login
                </span>
              </TableHead>
              <TableHead className="text-center min-w-[160px] px-4 py-3 whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium px-4 py-3 whitespace-nowrap">{user.id}</TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap">{user.name}</TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap">{user.email}</TableCell>
                <TableCell className="px-4 py-3">
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full w-fit"
                  >
                    {user.role === "Admin" && <ShieldCheck className="w-3 h-3 text-indigo-500" />}
                    {user.role === "Editor" && <Briefcase className="w-3 h-3 text-blue-500" />}
                    {user.role === "User" && <UserIcon className="w-3 h-3 text-green-500" />}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Badge
                    variant={user.status === "Active" ? "default" : user.status === "Suspended" ? "destructive" : "secondary"}
                    className="w-fit"
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-slate-500 text-sm px-4 py-3">{user.createdAt}</TableCell>
                <TableCell className="whitespace-nowrap text-slate-500 text-sm px-4 py-3">{user.lastLogin}</TableCell>
                <TableCell className="text-center whitespace-nowrap px-4 py-3">
                  {user.status === "Inactive" || user.status === "Suspended" ? (
                    <Button variant="outline" size="sm" className="mr-2 gap-1" onClick={() => handleRestoreClick(user)}>
                      <UserCheck className="w-4 h-4" /> Restore
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="mr-2 gap-1" onClick={() => handleEditClick(user)}>
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeactivateClick(user)}
                    disabled={user.status === "Inactive" || user.status === "Suspended"}
                    className="gap-1"
                  >
                    <UserX className="w-4 h-4" /> Deactivate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] w-[90%] rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserCog className="w-5 h-5" /> Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="md:text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editingUser?.name || ""}
                onChange={handleChange}
                className="col-span-1 md:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="md:text-right">
                Email
              </Label>
              <Input
                id="email"
                value={editingUser?.email || ""}
                onChange={handleChange}
                className="col-span-1 md:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="md:text-right">
                Role
              </Label>
              <Select
                value={editingUser?.role || ""}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger className="col-span-1 md:col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="md:text-right">
                Status
              </Label>
              <Select
                value={editingUser?.status || ""}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-1 md:col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveUser}>Save changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <AlertDialogContent className="w-[90%] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently deactivate <span className="font-semibold">{userToDeactivate?.name}</span>'s account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivateConfirm}>Deactivate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
