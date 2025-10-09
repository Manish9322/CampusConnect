import { PublicHeader } from '@/components/shared/public-header';
import { PublicFooter } from '@/components/shared/public-footer';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="prose prose-lg max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Terms of Service</h1>
            <p className="lead text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>Welcome to CampusConnect ("we", "our", "us"). These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms.</p>
            
            <h2>2. Use of Our Services</h2>
            <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for any content you post and for your interactions with other users.</p>
            
            <h2>3. Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the service.</p>
            
            <h2>4. Intellectual Property</h2>
            <p>The service and its original content, features, and functionality are and will remain the exclusive property of CampusConnect and its licensors.</p>
            
            <h2>5. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            
            <h2>6. Limitation of Liability</h2>
            <p>In no event shall CampusConnect, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>

            <h2>7. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which our company is established, without regard to its conflict of law provisions.</p>

            <h2>8. Changes to These Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.</p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at support@campusconnect.com.</p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
