import {Link} from "react-router-dom";
import Footer from "./footer";
export default function PrivacyPolicy() {
  return (
    <div className="bg-white text-gray-800">
      {/* ================= NAVBAR ================= */}
       <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
          B
        </div>
            <span className="text-xl ml-0 font-semibold">
              uildora
            </span>
          </div>

          <nav className="flex gap-6 text-sm font-medium">
            <Link to="/#hero" className="text-blue-800 border-b-2 border-blue-800">Home</Link>
            <Link to="/#about" className="hover:text-blue-800">About</Link>
            <Link to="/Contact" className="hover:text-blue-800">Contact</Link>
          </nav>
        </div>
      </header> 

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">
        
        {/* ===== LEFT CONTENT ===== */}
        <section className="space-y-12">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-800 mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg">
              This Privacy Policy outlines how{" "}
              <span className="font-semibold text-blue-800">
                Buildora
              </span>{" "}
              collects, uses, and protects personal information when you visit
              our website or use our services.
            </p>
          </div>

          {/* SECTION */}
          <div id="who-we-are">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              1. Who We Are
            </h2>
            <p>
              Buildora provides residential and commercial
              landscape care services. Your privacy is extremely important to
              us.
            </p>
          </div>

          <div id="info-collect">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact details (name, phone, email)</li>
              <li>Address and service location</li>
              <li>Project photos and notes</li>
              <li>Cookies and analytics data</li>
            </ul>
          </div>

          <div id="usage">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              3. How We Use Your Information
            </h2>
            <p>
              We use your data to deliver services, improve our offerings, and
              communicate effectively with you.
            </p>
          </div>

<div id="legal">
    <h2 className="text-2xl font-bold text-blue-800 mb-3">
    4. Legal Basis
    </h2>
    <p>
We process personal data based on consent, legitimate business interests, or contractual obligations.
</p>
</div>

<div id="cookie">
    <h2 className="text-2xl font-bold text-blue-800 mb-3">
5. Cookies & Tracking
</h2>
<p>
We use cookies to enhance website functionality, track performance, and understand how visitors interact with our content.
</p>
</div>

<div id="share">
    <h2 className="text-2xl font-bold text-blue-800 mb-3">
6. Sharing Your Information
</h2>
<p>
With trusted contractors assisting in service delivery.
With payment processors (if applicable).
With legal authorities when required by law.
</p></div>


<div className="security">
    <h2 className="text-2xl font-bold text-blue-800 mb-3">
7. Data Security
</h2>
<p>
We utilize secure internal systems and protocols to protect your information from unauthorized access or misuse.
</p></div>


<div className="retention">
<h2 className="text-2xl font-bold text-blue-800 mb-3">
8. Data Retention</h2>
<p>
Personal data is stored only for as long as necessary for business operations or legal compliance. You may request deletion anytime.
</p></div>

<div className="children">
    <h2 className="text-2xl font-bold text-blue-800 mb-3">
9. Children's Privacy
</h2>
<p>
We do not knowingly collect information from children under age 13.
</p></div>


<div className="transfer">
    <h2 className="text-2xl font-bold text-blue-800 mb-3">
10. International Transfers</h2>
<p>
In rare cases, your information may be processed outside your region, following strict legal protections.
</p>
</div>

<div className="rights">
    <h2 className="text-2xl font-bold text-blue-800 mb-3">
11. Your Rights
</h2>
<p>
Right to access your personal data
Right to request changes
Right to delete your data
Right to withdraw consent
</p></div>

<div className="links">
    <h2 className="text-2xl font-bold text-blue-800 mb-3">
12. External Links
</h2><p>
Our website may contain links to third-party sites, and we are not responsible for their privacy practices.</p>
</div>


<div className="update">
<h2 className="text-2xl font-bold text-blue-800 mb-3">
13. Policy Updates
</h2>
<p>
We may update this policy periodically. Any changes will be posted on this page with the updated date.
</p>
</div>


          <div id="contact">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              14. Contact Us
            </h2>
            <p>
              For privacy concerns, contact us at:{" "}
              <span className="text-blue-900 font-semibold">
                Athena.lms
              </span>
            </p>
          </div>


        <div className="acceptance">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
15. Acceptance of Policy
            </h2>
             <p>
By using our website, you acknowledge and accept the terms described in this Privacy Policy.
             </p>
        </div>
        </section>

        {/* ===== RIGHT INDEX ===== */}
        <aside className="sticky top-32 h-fit bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-blue-800 font-bold text-lg mb-4">
            On this page
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              "Who We Are",
              "Information We Collect",
              "How We Use Your Info",
              "Legal Basis",
              "Cookies & Tracking",
              "Sharing Information",
              "Data Security",
              "Data Retention",
              "Children's Privacy",
              "International Transfers",
              "Your Rights",
              "External Links",
              "Policy Updates",
              "Contact Us",
              "Acceptance",
            ].map((item) => (
              <li
                key={item}
                className="hover:text-blue-800 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </main>




      <Footer />
    </div>
  );
}