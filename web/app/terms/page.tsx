import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using our services",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing and using this website, you accept and agree to be
            bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily download one copy of the
            materials (information or software) on our website for personal,
            non-commercial transitory viewing only.
          </p>
          <p className="mb-4">
            This is the grant of a license, not a transfer of title, and under
            this license you may not:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>
              Attempt to decompile or reverse engineer any software contained on
              the website
            </li>
            <li>
              Remove any copyright or other proprietary notations from the
              materials
            </li>
            <li>
              Transfer the materials to another person or &ldquo;mirror&rdquo;
              the materials on any other server
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. User Account</h2>
          <p className="mb-4">
            If you create an account on the website, you are responsible for
            maintaining the security of your account and you are fully
            responsible for all activities that occur under the account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Disclaimer</h2>
          <p className="mb-4">
            The materials on our website are provided on an &lsquo;as is&rsquo;
            basis. We make no warranties, expressed or implied, and hereby
            disclaim and negate all other warranties including, without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Limitations</h2>
          <p className="mb-4">
            In no event shall we or our suppliers be liable for any damages
            (including, without limitation, damages for loss of data or profit,
            or due to business interruption) arising out of the use or inability
            to use the materials on our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            6. Revisions and Errata
          </h2>
          <p className="mb-4">
            The materials appearing on our website could include technical,
            typographical, or photographic errors. We do not warrant that any of
            the materials on our website are accurate, complete, or current.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            7. Contact Information
          </h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please
            contact us at support@example.com.
          </p>
        </section>
      </div>
    </div>
  );
}
