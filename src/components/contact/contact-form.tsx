
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function ContactForm() {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200">
        <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>Fill out the form and we&apos;ll get back to you shortly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Enter your message" className="min-h-[120px]" />
            </div>
            <Button type="submit" className="w-full">
                Send Message
            </Button>
        </CardContent>
    </Card>
  );
}
