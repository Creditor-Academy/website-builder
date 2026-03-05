import {Link} from "react-router-dom";
import Footer from "./footer";

export default function TermsOfService() {
  return (
    <div className="bg-white text-gray-800">
      {/* ================= HEADER ================= */}
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
            <Link to= "/#hero" className="hover:text-blue-800">Home</Link>
            <Link to="/#about" className="hover:text-blue-800">About</Link>
            
            <Link to="/Contact" className="hover:text-blue-800">Contact</Link>
          </nav>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">

        {/* ===== LEFT CONTENT ===== */}
        <section className="space-y-12">
          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-extrabold text-blue-800 mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-700">
              These terms govern your access to and use of{" "}
              <span className="font-semibold text-blue-800">Buildora</span>’s
              website, products, and services. By using Buildora, you agree to
              these terms.
            </p>
          </div>

          {/* 1 */}
          <div id="acceptance">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Buildora, you confirm that you are at least
              18 years old and agree to be bound by these Terms of Service and
              all applicable laws and regulations.
            </p>
          </div>

          {/* 2 */}
          <div id="usage">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              2. Use of Our Services
            </h2>
            <p>
              You may use Buildora only for lawful purposes. You agree not to
              misuse our platform, interfere with its operation, or attempt to
              access restricted areas without authorization.
            </p>
          </div>

          {/* 3 */}
          <div id="accounts">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              3. Accounts & Security
            </h2>
            <p>
              When you create an account, you are responsible for maintaining
              the confidentiality of your login credentials and for all
              activities that occur under your account.
            </p>
          </div>

          {/* 4 */}
          <div id="intellectual-property">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              4. Intellectual Property
            </h2>
            <p>
              All content, templates, designs, and software provided by
              Buildora are owned by or licensed to us and are protected by
              intellectual property laws. You may not copy, distribute, or
              resell our content without permission.
            </p>
          </div>

          {/* 5 */}
          <div id="payments">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              5. Payments & Subscriptions
            </h2>
            <p>
              Paid plans are billed according to the pricing displayed at the
              time of purchase. Fees are non-refundable unless otherwise
              stated. Buildora reserves the right to change pricing with prior
              notice.
            </p>
          </div>

          {/* 6 */}
          <div id="termination">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              6. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your access to
              Buildora if you violate these terms or engage in harmful or
              unlawful activities.
            </p>
          </div>

          {/* 7 */}
          <div id="liability">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              Buildora shall not be liable for any indirect, incidental, or
              consequential damages resulting from your use of the platform.
            </p>
          </div>

          {/* 8 */}
          <div id="changes">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              8. Changes to Terms
            </h2>
            <p>
              We may update these Terms of Service from time to time. Continued
              use of Buildora after changes means you accept the updated terms.
            </p>
          </div>

          {/* 9 */}
          <div id="contact">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">
              9. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us.
              
            </p>
          </div>
        </section>

        {/* ===== RIGHT SIDEBAR ===== */}
        <aside className="sticky top-32 h-fit bg-white border rounded-2xl p-6 shadow-sm">
          <h3 className="text-blue-800 font-bold text-lg mb-4">
            On this page
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            {[
              "Acceptance of Terms",
              "Use of Our Services",
              "Accounts & Security",
              "Intellectual Property",
              "Payments & Subscriptions",
              "Termination",
              "Limitation of Liability",
              "Changes to Terms",
              "Contact Us",
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

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}