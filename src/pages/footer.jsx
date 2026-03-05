import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1f2a33] text-white py-16 px-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-1 mb-6">
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
              B
            </div>
            <span className="text-xl font-semibold">uildora</span>
          </div>
          <p className="text-sm text-gray-400 max-w-sm">
            Build modern, responsive websites with powerful tools and full creative control.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="/#about">About Us</a></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-gray-700 flex justify-between text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Buildora Inc. All rights reserved.</p>
        <p>
          Powered by{" "}
          <a
            href="https://lmsathena.com/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline"
          >
            Athena LMS
          </a>
        </p>
      </div>
    </footer>
  );
}