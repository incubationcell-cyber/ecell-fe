import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

export default function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-foreground">Settings</h1>

      {/* Website Settings */}
      <div className="max-w-2xl space-y-6">
        <Card className="p-6 border border-border">
          <h2 className="text-xl font-bold mb-6 text-foreground">
            Website Information
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="college" className="text-foreground font-semibold">
                College Name
              </Label>
              <Input
                id="college"
                defaultValue="Jaipur Engineering College"
                className="bg-muted border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-semibold">
                Contact Email
              </Label>
              <Input
                id="email"
                defaultValue="ecell@jec.ac.in"
                type="email"
                className="bg-muted border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-semibold">
                Contact Phone
              </Label>
              <Input
                id="phone"
                defaultValue="+91 9876543210"
                className="bg-muted border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground font-semibold">
                Location
              </Label>
              <Input
                id="location"
                defaultValue="Jaipur, Rajasthan"
                className="bg-muted border-border text-foreground"
              />
            </div>

            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Social Media Settings */}
        <Card className="p-6 border border-border">
          <h2 className="text-xl font-bold mb-6 text-foreground">Social Media</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-foreground font-semibold">
                LinkedIn Profile
              </Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/..."
                className="bg-muted border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-foreground font-semibold">
                Twitter/X Profile
              </Label>
              <Input
                id="twitter"
                placeholder="https://twitter.com/..."
                className="bg-muted border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-foreground font-semibold">
                Instagram Profile
              </Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/..."
                className="bg-muted border-border text-foreground"
              />
            </div>

            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Update Social Links
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border border-destructive/20 bg-destructive/5">
          <h2 className="text-xl font-bold mb-4 text-destructive">Danger Zone</h2>
          <p className="text-muted-foreground mb-4">
            Irreversible and destructive actions. Please proceed with caution.
          </p>
          <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent">
            Reset All Data
          </Button>
        </Card>
      </div>
    </div>
  );
}
