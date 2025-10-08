
import { Phone, Mail, MapPin, Twitter, Linkedin, Github } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const contactDetails = [
  { icon: <Mail />, text: 'contact@campusconnect.com', href: 'mailto:contact@campusconnect.com' },
  { icon: <Phone />, text: '(123) 456-7890', href: 'tel:+1234567890' },
  { icon: <MapPin />, text: '123 University Ave, Learnington, ED 54321', href: '#' },
];

const socialLinks = [
    { icon: <Twitter />, href: '#', name: 'Twitter' },
    { icon: <Linkedin />, href: '#', name: 'LinkedIn' },
    { icon: <Github />, href: '#', name: 'GitHub' },
]

export function ContactInfo() {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {contactDetails.map((detail, index) => (
            <a key={index} href={detail.href} className="flex items-center gap-4 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {detail.icon}
              </div>
              <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">{detail.text}</span>
            </a>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
              {socialLinks.map((link) => (
                  <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-muted hover:bg-primary/20 transition-colors">
                      {link.icon}
                      <span className="sr-only">{link.name}</span>
                  </a>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
