'use client';

import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { Plus, Trash2, PenSquare, Globe } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

type StartupItem = {
  id: string;
  startUpName: string;
  founder: string;
  about: string;
  website: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type StartupForm = {
  startUpName: string;
  founder: string;
  about: string;
  website: string;
  isActive: boolean;
};

const emptyForm: StartupForm = {
  startUpName: '',
  founder: '',
  about: '',
  website: '',
  isActive: true,
};

function mapToPayload(form: StartupForm) {
  return {
    startUpName: form.startUpName.trim(),
    founder: form.founder.trim(),
    about: form.about.trim(),
    website: form.website.trim(),
    isActive: form.isActive,
  };
}

export default function StartupPage() {
  const [startups, setStartups] = useState<StartupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [addForm, setAddForm] = useState<StartupForm>(emptyForm);
  const [editForm, setEditForm] = useState<StartupForm>(emptyForm);
  const [editingId, setEditingId] = useState<string>('');

  const sortedStartups = useMemo(
    () =>
      [...startups].sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bTime - aTime;
      }),
    [startups]
  );

  async function loadStartups() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/startup', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      const payload = await response.json();
      const data = Array.isArray(payload?.data) ? payload.data : [];
      setStartups(data);
    } catch {
      toast.error('Unable to load startups. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStartups();
  }, []);

  function openEditModal(item: StartupItem) {
    setEditingId(item.id);
    setEditForm({
      startUpName: item.startUpName,
      founder: item.founder,
      about: item.about,
      website: item.website,
      isActive: item.isActive,
    });
    setIsEditOpen(true);
  }

  async function handleCreateStartup() {
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/startup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(mapToPayload(addForm)),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to create startup');
      }

      setAddForm(emptyForm);
      setIsAddOpen(false);
      await loadStartups();
      toast.success(payload?.message || 'Startup created successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateStartup() {
    if (!editingId) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/startup/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(mapToPayload(editForm)),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to update startup');
      }

      setIsEditOpen(false);
      setEditingId('');
      await loadStartups();
      toast.success(payload?.message || 'Startup updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteStartup(startupId: string, startupName: string) {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete startup?',
      text: `This will permanently remove ${startupName}.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/startup/${startupId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to delete startup');
      }

      await loadStartups();
      toast.success(payload?.message || 'Startup deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Startup List</h1>
          <p className="text-muted-foreground mt-2">
            Manage startups with modal-based create and edit actions.
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Startup
        </Button>
      </div>

      {loading ? (
        <Card className="border border-border">
          <CardContent className="p-6 text-muted-foreground">Loading startups...</CardContent>
        </Card>
      ) : null}

      {!loading && sortedStartups.length === 0 ? (
        <Card className="border border-border">
          <CardContent className="p-6 text-muted-foreground">
            No startups found. Use the Add Startup button to create one.
          </CardContent>
        </Card>
      ) : null}

      {!loading ? (
        <div className="grid grid-cols-1 gap-4">
          {sortedStartups.map((startup) => (
            <Card key={startup.id} className="border border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{startup.startUpName}</CardTitle>
                    <CardDescription className="mt-1">Founder: {startup.founder}</CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(startup)}
                      className="inline-flex items-center justify-center rounded-md border border-border p-2 hover:bg-muted"
                      aria-label="Edit startup"
                    >
                      <PenSquare className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteStartup(startup.id, startup.startUpName)}
                      className="inline-flex items-center justify-center rounded-md border border-destructive/40 p-2 text-destructive hover:bg-destructive/10"
                      aria-label="Delete startup"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{startup.about}</p>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 underline underline-offset-4"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      startup.isActive
                        ? 'bg-green-500/10 text-green-700'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {startup.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Startup</DialogTitle>
            <DialogDescription>Create a new startup entry.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-startup-name">Startup Name</Label>
              <Input
                id="add-startup-name"
                value={addForm.startUpName}
                onChange={(e) => setAddForm((prev) => ({ ...prev, startUpName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-founder">Founder</Label>
              <Input
                id="add-founder"
                value={addForm.founder}
                onChange={(e) => setAddForm((prev) => ({ ...prev, founder: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-about">About</Label>
              <Input
                id="add-about"
                value={addForm.about}
                onChange={(e) => setAddForm((prev) => ({ ...prev, about: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-website">Website</Label>
              <Input
                id="add-website"
                type="url"
                value={addForm.website}
                onChange={(e) => setAddForm((prev) => ({ ...prev, website: e.target.value }))}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={addForm.isActive}
                onChange={(e) => setAddForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              />
              Active startup
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateStartup} disabled={submitting}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Startup</DialogTitle>
            <DialogDescription>Update startup details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startup-name">Startup Name</Label>
              <Input
                id="edit-startup-name"
                value={editForm.startUpName}
                onChange={(e) => setEditForm((prev) => ({ ...prev, startUpName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-founder">Founder</Label>
              <Input
                id="edit-founder"
                value={editForm.founder}
                onChange={(e) => setEditForm((prev) => ({ ...prev, founder: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-about">About</Label>
              <Input
                id="edit-about"
                value={editForm.about}
                onChange={(e) => setEditForm((prev) => ({ ...prev, about: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-website">Website</Label>
              <Input
                id="edit-website"
                type="url"
                value={editForm.website}
                onChange={(e) => setEditForm((prev) => ({ ...prev, website: e.target.value }))}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={editForm.isActive}
                onChange={(e) => setEditForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              />
              Active startup
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStartup} disabled={submitting}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
