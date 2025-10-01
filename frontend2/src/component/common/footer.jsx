import { Instagram, Linkedin } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand + Social */}
          <section>
            <h3 className="font-bold text-lg mb-4">Campus Bites</h3>
            <p className="text-gray-400 mb-4">
              From Canteen to you - minus the Queue
            </p>
            <div className="flex space-x-4">
              <Link
                to="https://www.linkedin.com/company/campusbites-in/"
                className="text-gray-400 hover:text-white"
                target="blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                to="https://www.instagram.com/campusbites_in/"
                className="text-gray-400 hover:text-white"
                target="blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </section>

          {/* Quick Links */}
          <section>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/student/quickbite"
                  className="text-gray-400 hover:text-white"
                >
                  QuickBites
                </Link>
              </li>
              <li>
                <Link
                  to="/student/orders"
                  className="text-gray-400 hover:text-white"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </section>

          {/* Information */}
          <section>
            <h3 className="font-bold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-gray-400 hover:text-white"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h3 className="font-bold mb-4">Contact Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="mailto:support@campusbites.in"
                  className="text-gray-400 hover:text-white"
                >
                  support@campusbites.in
                </Link>
              </li>
              <li>
                <Link
                  to="tel:+917529052525"
                  className="text-gray-400 hover:text-white"
                >
                  +91 75290 52525
                </Link>
              </li>
            </ul>
          </section>
        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p className="mb-4">
            By continuing past this page, you agree to our Terms of Service,
            Cookie Policy, Privacy Policy and Content Policies. All trademarks
            are properties of their respective owners.
          </p>
          <p>© {new Date().getFullYear()} Campus Bites. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
