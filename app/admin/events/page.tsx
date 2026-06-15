'use client';

import { useEffect, useState } from 'react';
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
import { PenSquare, Plus, Trash } from 'lucide-react';
import { toast } from 'react-toastify';

type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  speaker: string;
  image: string;
  scheduledDate?: string;
};

type EventForm = {
  id: string;
  title: string;
  date: string;
  time: string;
  speaker: string;
  bannerImage: File | null;
  scheduledDate: string;
};

const emptyForm: EventForm = {
  id: '',
  title: '',
  date: '',
  time: '',
  speaker: '',
  bannerImage: null,
  scheduledDate: '',
};

function toDateInputValue(isoDate?: string) {
  if (!isoDate) return '';
  if (isoDate.includes('T')) {
    return isoDate.split('T')[0] || '';
  }
  return '';
}

function toTimeInputValue(isoDate?: string) {
  if (!isoDate) return '';
  if (isoDate.includes('T')) {
    const timePart = isoDate.split('T')[1] || '';
    return timePart.slice(0, 8);
  }
  return '';
}

function buildScheduledDate(dateValue: string, timeValue: string) {
  if (!dateValue || !timeValue) return '';
  const normalizedTime = timeValue.length === 5 ? `${timeValue}:00` : timeValue;
  const isoUtc = `${dateValue}T${normalizedTime}.000Z`;
  const parsed = new Date(isoUtc);
  if (Number.isNaN(parsed.getTime())) return '';
  return isoUtc;
}

export default function EventsManagement() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<EventForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  async function loadEvents() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/events', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to fetch events');
      }

      const data = Array.isArray(payload?.data) ? payload.data : [];
      setEvents(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to fetch events');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const handleAddNew = () => {
    setFormData(emptyForm);
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = (event: EventItem) => {
    setFormData({
      ...emptyForm,
      id: event.id,
      title: event.title,
      speaker: event.speaker,
      date: event.scheduledDate ? toDateInputValue(event.scheduledDate) : event.date,
      time: event.scheduledDate ? toTimeInputValue(event.scheduledDate) : event.time,
      scheduledDate: event.scheduledDate || buildScheduledDate(event.date, event.time),
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    const ok = window.confirm('Are you sure you want to delete this event?');
    if (!ok) return;

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to delete event');
      }

      await loadEvents();
      toast.success(result?.message || 'Event deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.time || !formData.speaker) {
      toast.error('Please fill all required fields');
      return;
    }

    const scheduledDate = buildScheduledDate(formData.date, formData.time);
    if (!scheduledDate) {
      toast.error('Please select valid date and time');
      return;
    }

    if (!isEditing && !formData.bannerImage) {
      toast.error('Please upload banner image');
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing) {
        const response = await fetch(`/api/admin/events/${formData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            scheduledDate,
            eventName: formData.title.trim(),
            speaker: formData.speaker.trim(),
          }),
        });

        const result = await response.json();

        if (!response.ok || !result?.success) {
          throw new Error(result?.message || 'Failed to update event');
        }

        await loadEvents();
        toast.success(result?.message || 'Event updated');
      } else {
        const payload = new FormData();
        payload.append('scheduledDate', scheduledDate);
        payload.append('eventName', formData.title.trim());
        payload.append('speaker', formData.speaker.trim());

        if (formData.bannerImage) {
          payload.append('upcomingEventsBanner', formData.bannerImage);
        }

        const response = await fetch('/api/admin/events', {
          method: 'POST',
          credentials: 'include',
          body: payload,
        });

        const result = await response.json();

        if (!response.ok || !result?.success) {
          throw new Error(result?.message || 'Failed to create event');
        }

        await loadEvents();
        toast.success(result?.message || 'Event added');
      }

      setOpen(false);
      setFormData(emptyForm);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manage Events</h1>
        <Button
          onClick={handleAddNew}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-background border-border max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {isEditing ? 'Edit Event' : 'Add Event'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Event Name
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-muted border-border text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-muted border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-foreground">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  step={1}
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="bg-muted border-border text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="speaker" className="text-foreground">
                Speaker
              </Label>
              <Input
                id="speaker"
                value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                className="bg-muted border-border text-foreground"
              />
            </div>

            {isEditing ? null : (
              <div className="space-y-2">
                <Label htmlFor="bannerImage" className="text-foreground">
                  Banner Image
                </Label>
                <Input
                  id="bannerImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, bannerImage: e.target.files?.[0] || null })
                  }
                  className="bg-muted border-border text-foreground"
                />
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isEditing ? 'Update' : 'Add'} Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <Card className="p-6 border border-border text-muted-foreground mb-4">Loading events...</Card>
      ) : null}

      <div className="space-y-4">
        {events.map((event) => (
          <Card
            key={event.id}
            className="p-6 border border-border hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4 gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground">Speaker: {event.speaker || 'TBA'}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(event)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  <PenSquare className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                  className="border-border text-destructive hover:bg-muted"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="w-full h-52 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-primary/10 to-secondary/10">
              <img
                src={event.image || '/placeholder.svg'}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground font-semibold">Date</p>
                <p className="text-foreground">{event.date}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-semibold">Time</p>
                <p className="text-foreground">{event.time}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
