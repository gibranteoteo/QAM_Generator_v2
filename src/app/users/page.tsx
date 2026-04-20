"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Users, KeyRound, Trash2, PlusCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { forceUpdatePassword } from "@/actions/users";

export default function UsersPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Form States
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await authClient.admin.listUsers({ query: { limit: 50 } });
      if (data) {
        setUsers(data.users);
      } else if (error) {
        toast.error("Gagal mengambil data: " + error.message);
      }
    } catch (err: any) {
      toast.error("Gagal mengambil data user: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/login");
    } else if (session.user.role !== "admin") {
      toast.error("Anda tidak memiliki akses ke halaman ini.");
      router.push("/");
    } else {
      loadUsers();
    }
  }, [session, isPending, router]);

  const handleCreateUser = async () => {
    if (!username || !name || !password) return toast.warning("Harap lengkapi semua field.");
    const loadId = toast.loading("Membuat pengguna...");
    const email = `${username}@qam.local`;
    try {
      const { data, error } = await authClient.admin.createUser({
        email,
        name,
        password,
        role: "user"
      });
      if (error) {
        toast.error(error.message, { id: loadId });
      } else {
        toast.success("Pengguna berhasil dibuat!", { id: loadId });
        setIsAddOpen(false);
        setUsername(""); setName(""); setPassword("");
        loadUsers();
      }
    } catch (e: any) {
      toast.error(e.message, { id: loadId });
    }
  };

  const handleRemoveUser = async (uId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini secara permanen?")) return;
    const loadId = toast.loading("Menghapus pengguna...");
    try {
      const { error } = await authClient.admin.removeUser({ userId: uId });
      if (error) {
        toast.error(error.message, { id: loadId });
      } else {
        toast.success("Pengguna dihapus.", { id: loadId });
        loadUsers();
      }
    } catch (e: any) {
      toast.error("Terjadi kesalahan sistem.", { id: loadId });
    }
  };

  const handleUpdatePassword = async () => {
    if (!password || !selectedUser) return toast.warning("Password tidak boleh kosong.");
    const loadId = toast.loading("Memperbarui password...");
    try {
      const result = await forceUpdatePassword(selectedUser.id, password);
      if (result.success) {
        toast.success("Password berhasil diubah!", { id: loadId });
        setIsPassOpen(false);
        setPassword("");
        setSelectedUser(null);
      } else {
        toast.error(result.error, { id: loadId });
      }
    } catch (e: any) {
      toast.error("Terjadi kesalahan sistem.", { id: loadId });
    }
  };

  if (!session || session.user.role !== "admin") return null;

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      <header className="h-14 border-b bg-background flex items-center justify-between px-4 lg:px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h1 className="font-semibold text-lg tracking-tight">Manajemen Pengguna</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 lg:p-8">
        <div className="max-w-5xl mx-auto bg-background rounded-lg shadow-md border overflow-hidden flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-muted/10">
            <div>
              <h2 className="font-bold text-lg">Daftar Pengguna Sistem</h2>
              <p className="text-sm text-muted-foreground">Kelola meteorologist dan akses aplikasi</p>
            </div>
            <Button onClick={() => setIsAddOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <PlusCircle className="w-4 h-4" />
              Tambah User
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Memuat data...</TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Tidak ada pangguna tambahan.</TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email.replace('@qam.local', '')}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                          {u.role || 'user'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => { setSelectedUser(u); setIsPassOpen(true); }}
                          title="Ubah Password"
                        >
                          <KeyRound className="w-4 h-4 text-emerald-600" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleRemoveUser(u.id)}
                          disabled={u.id === session.user.id}
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Add User Dialog */}
      <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if(!open) { setUsername(""); setName(""); setPassword(""); }}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Pengguna Baru</DialogTitle>
            <DialogDescription>Tambahkan ahli meteorologi untuk mengakses form QAM.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nama Lengkap</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Misal: Budi Santoso" />
            </div>
            <div className="space-y-1">
              <Label>Username</Label>
              <Input value={username} type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Misal: budi" />
            </div>
            <div className="space-y-1">
              <Label>Password Awal</Label>
              <Input value={password} type="text" onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 8 karakter" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
            <Button onClick={handleCreateUser} className="bg-indigo-600 hover:bg-indigo-700">Simpan Akun</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPassOpen} onOpenChange={(open) => { setIsPassOpen(open); if(!open) { setPassword(""); setSelectedUser(null); }}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Password Pengguna</DialogTitle>
            <DialogDescription className="text-destructive flex items-center gap-1 mt-1">
              <ShieldAlert className="w-4 h-4" /> Tindakan ini akan memaksa ubah sandi tanpa verifikasi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nama Akun</Label>
              <Input value={selectedUser?.name || ""} disabled />
            </div>
            <div className="space-y-1">
              <Label>Password Baru</Label>
              <Input value={password} type="text" onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 8 karakter" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPassOpen(false)}>Batal</Button>
            <Button onClick={handleUpdatePassword}>Terapkan Sandi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
