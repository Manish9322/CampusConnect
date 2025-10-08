
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone } from 'lucide-react';

export function CustomerSupportCard() {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-16 duration-700 delay-400">
      <CardHeader>
        <CardTitle>Need Immediate Assistance?</CardTitle>
        <CardDescription>
          Our support team is available to help you with any urgent issues.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-4">
        <Button variant="outline" className="h-auto py-4">
            <div className="flex flex-col items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <span className="font-semibold">Live Chat</span>
            </div>
        </Button>
        <Button variant="outline" className="h-auto py-4">
             <div className="flex flex-col items-center gap-2">
                <Phone className="h-6 w-6 text-primary" />
                <span className="font-semibold">Call Us</span>
            </div>
        </Button>
      </CardContent>
    </Card>
  );
}
