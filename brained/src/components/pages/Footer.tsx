import React from "react";
import { ShoppingBag } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          <div>
            <h4 className="font-semibold text-white mb-4 text-base sm:text-lg">Shop</h4>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li><a href="#" className="hover:text-white transition">All Products</a></li>
              <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition">Sale</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-base sm:text-lg">Company</h4>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-base sm:text-lg">Support</h4>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition">Returns</a></li>
              <li><a href="#" className="hover:text-white transition">Track Order</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-base sm:text-lg">Legal</h4>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-orange-500" />
              <span className="text-lg sm:text-xl font-semibold text-white">ShopEase</span>
            </div>
            <p className="text-sm sm:text-base text-center">
              &copy; 2025 ShopEase. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
