'use client';

import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const initialImages = [
  {
    id: 1,
    title: 'Startup Pitch Event',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
    category: 'Events',
  },
  {
    id: 2,
    title: 'Workshop Session',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
    category: 'Workshop',
  },
  {
    id: 3,
    title: 'Team Collaboration',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
    category: 'Team',
  },
];

export default function GalleryManagement() {
  const [images, setImages] = useState(initialImages);
  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    image: '',
    category: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAddNew = () => {
    setFormData({ id: 0, title: '', image: '', category: '' });
    setIsEditing(false);
    setOpen(true);
  };

  const handleEdit = (img: typeof initialImages[0]) => {
    setFormData(img);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setImages(images.filter((i) => i.id !== id));
    toast.success('Image deleted');
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.image || !formData.category) {
      toast.error('Please fill all fields');
      return;
    }

    if (isEditing) {
      setImages(images.map((i) => (i.id === formData.id ? formData : i)));
      toast.success('Image updated');
    } else {
      setImages([...images, { ...formData, id: Date.now() }]);
      toast.success('Image added');
    }

    setOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manage Gallery</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddNew}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {isEditing ? 'Edit Image' : 'Add Image'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-muted border-border text-foreground"
                  placeholder="Image title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-foreground">
                  Category
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="bg-muted border-border text-foreground"
                  placeholder="e.g., Events, Workshop"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-foreground">
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="bg-muted border-border text-foreground"
                  placeholder="https://..."
                />
              </div>

              {formData.image && (
                <div className="w-full h-40 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isEditing ? 'Update' : 'Add'} Image
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <Card
            key={img.id}
            className="overflow-hidden border border-border hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
              <img
                src={img.image || "/placeholder.svg"}
                alt={img.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-foreground mb-2">{img.title}</h3>
              <p className="text-sm text-primary mb-4">{img.category}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(img)}
                  className="flex-1 border-border text-foreground hover:bg-muted"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(img.id)}
                  className="flex-1 border-border text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
