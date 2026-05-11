export default function TermsAndConditionsPage() {
  return (
    <main className="w-full bg-purple">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-white">
          {/* Title */}
          <h1 className="font-lexendBold text-5xl md:text-6xl leading-tight mb-12">
            Terms + Conditions Policy
          </h1>

          {/* Content */}
          <div className="space-y-12 text-sm md:text-base leading-relaxed max-w-4xl">
            <section>
              <h3 className="font-lexendBold text-lg mb-4 mt-6">
                1. Use of This Website
              </h3>
              <p className="font-lexend">
                By using this website, you agree to these terms. If you do not
                agree, please do not use the site.
              </p>
            </section>

            <section>
              <h3 className="font-lexendBold text-lg mb-4 mt-6">
                2. Information Disclaimer
              </h3>
              <p className="font-lexend">
                Content on this website is provided for general information only
                and does not constitute professional or medical advice.
              </p>
            </section>

            <section>
              <h3 className="font-lexendBold text-lg mb-4 mt-6">
                3. Accuracy of Information
              </h3>
              <p className="font-lexend">
                We aim to keep information accurate and up to date, but do not
                guarantee completeness or accuracy at all times.
              </p>
            </section>

            <section>
              <h3 className="font-lexendBold text-lg mb-4 mt-6">
                4. Intellectual Property
              </h3>
              <p className="font-lexend">
                All content, logos and materials on this site are owned by MUVE
                Healthcare Group unless otherwise stated. They may not be
                reproduced without permission.
              </p>
            </section>

            <section>
              <h3 className="font-lexendBold text-lg mb-4 mt-6">
                5. Links to Other Websites
              </h3>
              <p className="font-lexend">
                We are not responsible for the content or privacy practices of
                external websites.
              </p>
            </section>

            <section>
              <h3 className="font-lexendBold text-lg mb-4 mt-6">
                6. Limitation of Liability
              </h3>
              <p className="font-lexend">
                MUVE Healthcare Group is not liable for any loss or damage
                arising from use of this website, to the extent permitted by
                law.
              </p>
            </section>

            <section>
              <h3 className="font-lexendBold text-lg mb-4 mt-6">
                7. Changes to Terms
              </h3>
              <p className="font-lexend">
                We may update these terms at any time. Continued use of the
                website indicates acceptance of updated terms.
              </p>
            </section>

            <section>
              <h3 className="font-lexendBold text-lg mb-4 mt-6">
                8. Governing Law
              </h3>
              <p className="font-lexend">
                These terms are governed by the laws of England and Wales.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
