import Link from "next/link";
import { Music, Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 pt-12 border-t border-white/10">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold text-white">MusicVerse</span>
          </div>
          <p className="text-gray-400 text-sm">
            Your ultimate music streaming platform. Discover, create, and share music with the world.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-purple-400">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-purple-400">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-purple-400">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-purple-400">
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-semibold">Product</h4>
          <div className="space-y-2">
            <Link href="#" className="block text-gray-400 hover:text-purple-400 text-sm">Features</Link>
            <Link href="#" className="block text-gray-400 hover:text-purple-400 text-sm">Premium</Link>
            <Link href="#" className="block text-gray-400 hover:text-purple-400 text-sm">Mobile App</Link>
            <Link href="#" className="block text-gray-400 hover:text-purple-400 text-sm">Desktop App</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-semibold">Company</h4>
          <div className="space-y-2">
            <Link href="#" className="block text-gray-400 hover:text-purple-400 text-sm">About Us</Link>
            <Link href="#" className="block text-gray-400 hover:text-purple-400 text-sm">Careers</Link>
            <Link href="#" className="block text-gray-400 hover:text-purple-400 text-sm">Press</Link>
            <Link href="#" className="block text-gray-400 hover:text-purple-400 text-sm">Contact</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-semibold">Support</h4>
          <div className="space-y-2">
            <Link href="#" className="block text-gray-400 hover:text-purple-400 text-sm">Help Center</Link>
            <Link href="#" className="block text-gray-400 hover:text-purple-400 text-sm">Privacy Policy</Link>
            <Link href="#" className="block text-gray-400 hover:text-purple-400 text-sm">Terms of Service</Link>
            <Link href="#" className="block text-gray-400 hover:text-purple-400 text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/10 text-center">
        <p className="text-gray-400 text-sm">
          © 2024 MusicVerse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}