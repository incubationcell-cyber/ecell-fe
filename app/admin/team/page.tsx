'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { Plus, PenSquare } from 'lucide-react';
import { toast } from 'react-toastify';

type TeamMember = {
  id: string;
  name: string;
  designation: string;
  image: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type TeamForm = {
  id: string;
  name: string;
  designation: string;
  memberImage: File | null;
  isActive: boolean;
};

const emptyForm: TeamForm = {
  id: '',
  name: '',
  designation: '',
  memberImage: null,
  isActive: true,
};

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<TeamForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const sortedMembers = useMemo(
    () =>
      [...teamMembers].sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bTime - aTime;
      }),
    [teamMembers]
  );

  async function loadTeamMembers() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/team', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to fetch team members');
      }

      const data = Array.isArray(payload?.data) ? payload.data : [];
      setTeamMembers(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to fetch team members');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeamMembers();
  }, []);

  function handleAddNew() {
    setFormData(emptyForm);
    setIsEditing(false);
    setOpen(true);
  }

  function validateTeamForm(isEditMode: boolean) {
    const name = formData.name.trim();
    const designation = formData.designation.trim();

    if (!name) {
      toast.error('Name is required');
      return false;
    }

    if (!designation) {
      toast.error('Designation is required');
      return false;
    }

    if (!isEditMode && !formData.memberImage) {
      toast.error('Member image is required');
      return false;
    }

    if (!isEditMode && formData.memberImage && !formData.memberImage.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return false;
    }

    return true;
  }

  function handleEdit(member: TeamMember) {
    setFormData({
      id: member.id,
      name: member.name,
      designation: member.designation,
      memberImage: null,
      isActive: member.isActive,
    });
    setIsEditing(true);
    setOpen(true);
  }

  async function handleSubmit() {
    if (!validateTeamForm(isEditing)) {
      return;
    }

    setSubmitting(true);
    try {
      let response: Response;

      if (isEditing) {
        response = await fetch(`/api/admin/team/${formData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            fullName: formData.name.trim(),
            designation: formData.designation.trim(),
            isActive: formData.isActive,
          }),
        });
      } else {
        const payload = new FormData();
        payload.append('fullName', formData.name.trim());
        payload.append('designation', formData.designation.trim());
        payload.append('isActive', formData.isActive ? 'true' : 'false');

        if (formData.memberImage) {
          payload.append('memberImage', formData.memberImage);
        }

        response = await fetch('/api/admin/team', {
          method: 'POST',
          credentials: 'include',
          body: payload,
        });
      }

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to add team member');
      }

      setOpen(false);
      setFormData(emptyForm);
      await loadTeamMembers();
      toast.success(data?.message || (isEditing ? 'Team member updated' : 'Team member added'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manage Core Team</h1>

        <Button
          onClick={handleAddNew}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {isEditing ? 'Edit Team Member' : 'Add Team Member'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-muted border-border text-foreground"
                placeholder="Full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation" className="text-foreground">
                Designation
              </Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                className="bg-muted border-border text-foreground"
                placeholder="Position/Role"
              />
            </div>

            {isEditing ? null : (
              <div className="space-y-2">
                <Label htmlFor="memberImage" className="text-foreground">
                  Member Image
                </Label>
                <Input
                  id="memberImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, memberImage: e.target.files?.[0] || null })
                  }
                  className="bg-muted border-border text-foreground"
                />
              </div>
            )}

            <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
              <span className="text-sm text-foreground">Active member</span>
              <button
                type="button"
                role="switch"
                aria-checked={formData.isActive}
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-5' : 'translate-x-1'}`}
                />
              </button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isEditing ? 'Update Member' : 'Add Member'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <Card className="p-6 border border-border text-muted-foreground">Loading team members...</Card>
      ) : null}

      {!loading && sortedMembers.length === 0 ? (
        <Card className="p-6 border border-border text-muted-foreground">
          No core team members found.
        </Card>
      ) : null}

      {!loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden border border-border">
              <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                <img
                  src={member.image || '/placeholder.svg'}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col min-h-[8.5rem]">
                <h3 className="font-bold text-lg text-foreground mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.designation}</p>
                <div className="mt-auto flex items-end justify-between pt-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${member.isActive ? 'bg-green-500/10 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(member)}
                    className="h-8 w-8 border-border text-foreground hover:bg-muted"
                    aria-label="Edit member"
                  >
                    <PenSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
