'use client';

import Image from 'next/image';

const partners = [
  { name: 'Innovate Inc.', seed: 'partner1' },
  { name: 'Solutions LLC', seed: 'partner2' },
  { name: 'Global Co.', seed: 'partner3' },
  { name: 'NextGen', seed: 'partner4' },
  { name: 'FutureWorks', seed: 'partner5' },
  { name: 'Synergy Group', seed: 'partner6' },
];

export function PartnersSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            Our Partners
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Trusted by the Best
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            We collaborate with leading organizations to drive innovation and deliver exceptional value.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 items-center justify-center gap-x-8 gap-y-10 sm:grid-cols-3 md:gap-x-12 lg:grid-cols-6">
          {partners.map((partner) => (
            <div key={partner.name} className="flex justify-center" title={partner.name}>
              <Image
                src={`https://picsum.photos/seed/${partner.seed}/140/70`}
                width={140}
                height={70}
                alt={partner.name}
                className="grayscale transition-all duration-300 hover:grayscale-0"
                data-ai-hint="company logo"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
