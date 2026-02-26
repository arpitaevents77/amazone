import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Back to Top */}
      <div
        className="bg-gray-700 py-4 text-center cursor-pointer hover:bg-gray-600 transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span className="text-sm">Back to top</span>
      </div>

      {/* Main Footer */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Get to Know Us */}
            <div>
              <h3 className="font-bold text-lg mb-4">Get to Know Us</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/about" className="hover:underline">About RegionalMart</Link></li>
                <li><Link to="/careers" className="hover:underline">Careers</Link></li>
                <li><Link to="/press" className="hover:underline">Press Releases</Link></li>
                <li><Link to="/sustainability" className="hover:underline">RegionalMart Science</Link></li>
              </ul>
            </div>

            {/* Make Money with Us */}
            <div>
              <h3 className="font-bold text-lg mb-4">Make Money with Us</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/sell" className="hover:underline">Sell on RegionalMart</Link></li>
                <li><Link to="/affiliate" className="hover:underline">Become an Affiliate</Link></li>
                <li><Link to="/advertise" className="hover:underline">Advertise Your Products</Link></li>
                <li><Link to="/fulfillment" className="hover:underline">RegionalMart Pay</Link></li>
              </ul>
            </div>

            {/* RegionalMart Payment */}
            <div>
              <h3 className="font-bold text-lg mb-4">RegionalMart Payment</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/payment" className="hover:underline">Your Account</Link></li>
                <li><Link to="/returns" className="hover:underline">Your Orders</Link></li>
                <li><Link to="/shipping" className="hover:underline">Shipping Rates & Policies</Link></li>
                <li><Link to="/returns-policy" className="hover:underline">Returns & Replacements</Link></li>
              </ul>
            </div>

            {/* Let Us Help You */}
            <div>
              <h3 className="font-bold text-lg mb-4">Let Us Help You</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/help" className="hover:underline">Help Center</Link></li>
                <li><Link to="/covid" className="hover:underline">COVID-19 and RegionalMart</Link></li>
                <li><Link to="/your-orders" className="hover:underline">Your Orders</Link></li>
                <li><Link to="/manage-content" className="hover:underline">Manage Your Content</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="text-2xl font-bold text-orange-400">RegionalMart</div>
              <select className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm">
                <option>🌍 English</option>
                <option>🇮🇳 हिंदी</option>
              </select>
              <select className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm">
                <option>₹ INR - Indian Rupee</option>
                <option>$ USD - US Dollar</option>
              </select>
              <select className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm">
                <option>🇮🇳 India</option>
              </select>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              <Link to="/conditions" className="hover:underline">Conditions of Use & Sale</Link>
              <Link to="/privacy" className="hover:underline">Privacy Notice</Link>
              <Link to="/interest-ads" className="hover:underline">Interest-Based Ads</Link>
            </div>
            <p>&copy; 1996-2026, RegionalMart.com, Inc. or its affiliates</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;