
export function MapSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                Our Location
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Come Visit Us
            </h2>
             <p className="max-w-[700px] text-muted-foreground md:text-xl">
                We are located in the heart of the city. Find us on the map below.
            </p>
        </div>
        <div className="w-full h-[400px] rounded-lg overflow-hidden border">
           <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.220141639535!2d-122.419415684681!3d37.77492957975817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c1f9fa5ab%3A0x8aa8b66e3b5e43f1!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1628795550269!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
      </div>
    </section>
  );
}
