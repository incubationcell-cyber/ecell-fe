'use client';

import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

type CollaborationItem = {
  id: string;
  organization: string;
  image: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

type CollaborationForm = {
  id: string;
  organization: string;
  description: string;
  collaborationImage: File | null;
};

const emptyForm: CollaborationForm = {
  id: '',
  organization: '',
  description: '',
  collaborationImage: null,
};

function mapUpdatePayload(form: CollaborationForm) {
  return {
    name: form.organization.trim(),
    about: form.description.trim(),
  };
}

export default function CollaborationsManagement() {
  const [collaborations, setCollaborations] = useState<CollaborationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CollaborationForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const sortedCollaborations = useMemo(
    () =>
      [...collaborations].sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bTime - aTime;
      }),
    [collaborations]
  );

  async function loadCollaborations() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/collaborations', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to fetch collaborations');
      }

      const data = Array.isArray(payload?.data) ? payload.data : [];
      setCollaborations(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to fetch collaborations');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCollaborations();
  }, []);

  function handleAddNew() {
    setFormData(emptyForm);
    setIsEditing(false);
    setOpen(true);
  }

  function handleEdit(collab: CollaborationItem) {
    setFormData({
      id: collab.id,
      organization: collab.organization,
      description: collab.description,
      collaborationImage: null,
    });
    setIsEditing(true);
    setOpen(true);
  }

  async function handleDelete(id: string, organization: string) {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete collaboration?',
      text: `This will remove ${organization}.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/collaborations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to delete collaboration');
      }

      await loadCollaborations();
      toast.success(payload?.message || 'Collaboration deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit() {
    if (!formData.organization || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!isEditing && !formData.collaborationImage) {
      toast.error('Please select a collaboration image');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = isEditing
        ? `/api/admin/collaborations/${formData.id}`
        : '/api/admin/collaborations';

      const method = isEditing ? 'PATCH' : 'POST';

      let response: Response;

      if (isEditing) {
        response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(mapUpdatePayload(formData)),
        });
      } else {
        const createPayload = new FormData();
        createPayload.append('name', formData.organization.trim());
        createPayload.append('about', formData.description.trim());

        if (formData.collaborationImage) {
          createPayload.append('collaborationImage', formData.collaborationImage);
        }

        response = await fetch(endpoint, {
          method,
          credentials: 'include',
          body: createPayload,
        });
      }

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to save collaboration');
      }

      setOpen(false);
      setFormData(emptyForm);
      await loadCollaborations();
      toast.success(payload?.message || (isEditing ? 'Collaboration updated' : 'Collaboration added'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manage Collaborations</h1>

        <Button
          onClick={handleAddNew}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Collaboration
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {isEditing ? 'Edit Collaboration' : 'Add Collaboration'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="org" className="text-foreground">
                Organization Name
              </Label>
              <Input
                id="org"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                className="bg-muted border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              {isEditing ? null : (
                <>
                  <Label htmlFor="image" className="text-foreground">
                    Collaboration Image
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        collaborationImage: e.target.files?.[0] || null,
                      })
                    }
                    className="bg-muted border-border text-foreground"
                  />
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-muted border-border text-foreground"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isEditing ? 'Update' : 'Add'} Collaboration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <Card className="p-6 border border-border text-muted-foreground">Loading collaborations...</Card>
      ) : null}

      {!loading && sortedCollaborations.length === 0 ? (
        <Card className="p-6 border border-border text-muted-foreground">
          No collaborations found. Add a collaboration to get started.
        </Card>
      ) : null}

      {!loading ? (
        <div className="space-y-4">
          {sortedCollaborations.map((collab) => (
            <Card
              key={collab.id}
              className="p-6 border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-6 h-full">
                <div className="w-40 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/10 to-secondary/10">
                  <img
                    src={collab.image || '/placeholder.svg'}
                    alt={collab.organization}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col min-h-[8rem]">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {collab.organization}
                  </h3>
                  <p className="text-muted-foreground mb-2">{collab.description}</p>

                  <div className="flex gap-2 mt-auto pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(collab)}
                      className="border-border text-foreground hover:bg-muted"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(collab.id, collab.organization)}
                      className="border-border text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
