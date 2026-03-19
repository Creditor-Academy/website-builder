import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, UserPlus, Search, Edit, UserX, UserCheck, UserCog, AlertTriangle, Clock, CalendarDays, ShieldCheck, User as UserIcon, Briefcase, CheckCircle, AlertCircle, XCircle, MoreVertical, Trash2 } from 'lucide-react'; // Import icons
import { useToast } from '@/components/ui/use-toast';
import UserShimmer from '@/components/dashboard/UserShimmer';

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
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'createdAt' | 'lastLogin'> & { id?: string }>({ name: '', email: '', role: 'User', status: 'Active' });
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
      toast({
        title: "User Updated ✅",
        description: `User ${editingUser.name} has been updated.`, 
        icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      });
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
      toast({
        title: "User Deactivated 🚫",
        description: `User ${userToDeactivate.name} has been deactivated.`, 
        icon: <XCircle className="h-5 w-5 text-destructive" />,
      });
    }, 300); // Simulate network delay
  };

  const handleRestoreClick = (user: User) => {
    // Simulate API call to restore user
    setTimeout(() => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, status: "Active" } : u))
      );
      toast({
        title: "User Restored ✨",
        description: `User ${user.name} has been restored to active status.`, 
        icon: <CheckCircle className="h-5 w-5 text-primary" />,
      });
    }, 300);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Inactive' | 'Suspended'>('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredUsers = users.filter((user) => {
    const matchesSearchTerm =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilterStatus =
      filterStatus === 'all' || user.status === filterStatus;

    return matchesSearchTerm && matchesFilterStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'role') {
      return a.role.localeCompare(b.role);
    }
    // Default to 'recent' if sortBy is not 'name' or 'role'
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });


  const handleAddUserClick = () => {
    setNewUser({ name: '', email: '', role: 'User', status: 'Active' }); // Reset form
    setIsAddUserModalOpen(true);
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewUser({ ...newUser, [id]: value });
  };

  const handleNewUserSelectChange = (id: keyof Omit<User, 'id' | 'createdAt' | 'lastLogin'>, value: string) => {
    setNewUser({ ...newUser, [id]: value });
  };

  const handleCreateNewUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast({
        title: "Validation Error ⚠️",
        description: "Please fill in all required fields for the new user.", 
        icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        variant: "destructive"
      });
      return;
    }

    const newId = (parseInt(users[users.length - 1]?.id || '0') + 1).toString(); // Simple ID generation, handles empty users array
    const now = new Date().toISOString().split('T')[0];
    const userToAdd: User = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      createdAt: now,
      lastLogin: now,
    };

    setTimeout(() => {
      setUsers((prevUsers) => [...prevUsers, userToAdd]);
      setIsAddUserModalOpen(false);
      setNewUser({ name: '', email: '', role: 'User', status: 'Active' });
      toast({
        title: "User Added Successfully 🎉",
        description: `New user ${userToAdd.name} has been created.`, 
        icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      });
    }, 300);
  };


  return (
    <Card className="rounded-3xl shadow-xl shadow-slate-200/50 p-8">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-slate-500">
        <a href="/dashboard" className="hover:underline">Dashboard</a> / <span className="font-semibold text-slate-700">Users</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Users Management</h2>
          <p className="text-slate-500 mt-1">Manage your users and permissions.</p>
        </div>
        <Button 
          onClick={handleAddUserClick} 
          className="gap-2 w-full md:w-auto h-11 rounded-full 
            bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
            shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 
            transition-all duration-300 hover:scale-[1.02]"
        >
          <UserPlus className="w-5 h-5" /> Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 w-full h-11 rounded-full bg-white border-slate-200 
                       shadow-md shadow-slate-200/50 focus:ring-2 focus:ring-blue-500/20 
                       focus:border-blue-500 transition-all duration-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            className={`rounded-full h-10 px-4 text-sm font-semibold 
                        ${filterStatus === 'all' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
                        transition-all duration-200`}
            onClick={() => setFilterStatus('all')}
          >
            All Users
          </Button>
          <Button
            variant={filterStatus === 'Active' ? 'default' : 'outline'}
            className={`rounded-full h-10 px-4 text-sm font-semibold 
                        ${filterStatus === 'Active' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
                        transition-all duration-200`}
            onClick={() => setFilterStatus('Active')}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'Inactive' ? 'default' : 'outline'}
            className={`rounded-full h-10 px-4 text-sm font-semibold 
                        ${filterStatus === 'Inactive' ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
                        transition-all duration-200`}
            onClick={() => setFilterStatus('Inactive')}
          >
            Inactive
          </Button>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] h-11 rounded-full bg-white border-slate-200 
                                    shadow-md shadow-slate-200/50 focus:ring-2 focus:ring-blue-500/20 
                                    focus:border-blue-500 transition-all duration-300">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white border-slate-200 shadow-lg">
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="role">Role</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-md">
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px] px-2 text-center"><input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" /></TableHead>
              <TableHead className="w-[80px] px-4 py-3 text-slate-500">ID</TableHead>
              <TableHead className="min-w-[200px] px-4 py-3 text-slate-500">User</TableHead>
              <TableHead className="min-w-[100px] px-4 py-3 text-slate-500">Role</TableHead>
              <TableHead className="min-w-[120px] px-4 py-3 text-slate-500">Status</TableHead>
              <TableHead className="min-w-[140px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-slate-400" /> Created At
                </span>
              </TableHead>
              <TableHead className="min-w-[140px] px-4 py-3 text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Last Login
                </span>
              </TableHead>
              <TableHead className="text-right px-4 py-3 text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Shimmer loading effect
              Array.from({ length: 5 }).map((_, i) => <UserShimmer key={i} />)
            ) : sortedUsers.length > 0 ? (
              // Display sorted and filtered users
              sortedUsers.map((user) => (
                <TableRow key={user.id} className="group h-16 border-b border-slate-100 hover:bg-slate-50/70 transition-all duration-200">
                  <TableCell className="px-2 text-center"><input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" /></TableCell>
                  <TableCell className="font-medium text-slate-600 px-4 py-3">#{user.id}</TableCell>
                  <TableCell className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge 
                      className={
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-100/80"
                          : user.role === "Editor"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100/80"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-100/80"
                      }
                    >
                      {user.role === "Admin" && <ShieldCheck className="w-3 h-3 mr-1" />}
                      {user.role === "Editor" && <Briefcase className="w-3 h-3 mr-1" />}
                      {user.role === "User" && <UserIcon className="w-3 h-3 mr-1" />}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      className={
                        user.status === "Active"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80"
                          : user.status === "Inactive"
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-100/80"
                          : "bg-rose-100 text-rose-700 hover:bg-rose-100/80"
                      }
                    >
                      {user.status === "Active" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {user.status === "Inactive" && <AlertCircle className="w-3 h-3 mr-1" />}
                      {user.status === "Suspended" && <XCircle className="w-3 h-3 mr-1" />}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm px-4 py-3">{user.createdAt}</TableCell>
                  <TableCell className="text-slate-500 text-sm px-4 py-3">{user.lastLogin}</TableCell>
                  <TableCell className="text-right px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-slate-100">
                          <MoreVertical className="h-4 w-4 text-slate-500" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border-slate-200 shadow-lg">
                        <DropdownMenuItem onClick={() => handleEditClick(user)} className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100">
                          <Edit className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer focus:bg-slate-100">
                          <UserIcon className="w-4 h-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "Inactive" || user.status === "Suspended" ? (
                            <DropdownMenuItem onClick={() => handleRestoreClick(user)} className="rounded-lg gap-2 cursor-pointer focus:bg-emerald-50 focus:text-emerald-600">
                                <UserCheck className="w-4 h-4" /> Restore User
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => handleDeactivateClick(user)} className="rounded-lg gap-2 cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                                <UserX className="w-4 h-4" /> Deactivate User
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer text-destructive focus:bg-destructive/5">
                          <Trash2 className="w-4 h-4" /> Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // No users found message
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-slate-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] w-[90%] rounded-xl">
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

      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="sm:max-w-[425px] w-[90%] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Add New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="md:text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={handleNewUserChange}
                className="col-span-1 md:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="md:text-right">
                Email
              </Label>
              <Input
                id="email"
                value={newUser.email}
                onChange={handleNewUserChange}
                className="col-span-1 md:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="md:text-right">
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => handleNewUserSelectChange("role", value)}
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
                value={newUser.status}
                onValueChange={(value) => handleNewUserSelectChange("status", value)}
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
            <Button onClick={handleCreateNewUser} disabled={!newUser.name.trim() || !newUser.email.trim()}>Create User</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <AlertDialogContent className="w-[90%] rounded-xl">
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
    </Card>
  );
}