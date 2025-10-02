import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function OurTeamSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            Our Team
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Meet the Innovators
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            The passionate minds dedicated to improving education through technology.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="man ceo" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">John Doe</CardTitle>
              <p className="text-sm text-muted-foreground">CEO & Founder</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="woman developer" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">Jane Smith</CardTitle>
              <p className="text-sm text-muted-foreground">Lead Developer</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="man designer" />
                <AvatarFallback>MB</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">Mike Brown</CardTitle>
              <p className="text-sm text-muted-foreground">UX/UI Designer</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="woman marketing" />
                <AvatarFallback>SW</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">Sarah Wilson</CardTitle>
              <p className="text-sm text-muted-foreground">Marketing Head</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
