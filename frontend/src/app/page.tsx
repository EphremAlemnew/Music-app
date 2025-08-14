import Link from "next/link";
import { Music, Play, Users, Headphones, Download, Shield, Zap, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <Music className="w-20 h-20 text-purple-400" />
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white">
              Music<span className="text-purple-400">Verse</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover, stream, and share your favorite music with the world.
              Create playlists, explore new artists, and enjoy unlimited music.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
            >
              <Link href="/auth/login">
                <Play className="w-5 h-5 mr-2" />
                Get Started
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3"
            >
              <Link href="/auth/sign-up">Sign Up Free</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Unlimited Music</h3>
              <p className="text-gray-300">Stream millions of songs from your favorite artists</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Create Playlists</h3>
              <p className="text-gray-300">Organize your music and share with friends</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center p-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">High Quality</h3>
              <p className="text-gray-300">Enjoy crystal clear audio streaming</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-20">
          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-8">
            <CardContent className="space-y-4">
              <Download className="w-12 h-12 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Offline Listening</h3>
              <p className="text-gray-300">Download your favorite tracks and listen anywhere, anytime without internet.</p>
              <Button variant="ghost" className="text-purple-400 hover:text-white p-0">
                Learn More <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10 p-8">
            <CardContent className="space-y-4">
              <Shield className="w-12 h-12 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">Ad-Free Experience</h3>
              <p className="text-gray-300">Enjoy uninterrupted music streaming with our premium ad-free experience.</p>
              <Button variant="ghost" className="text-blue-400 hover:text-white p-0">
                Go Premium <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-12 border border-white/10">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Join Millions of Music Lovers</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the future of music streaming with lightning-fast performance and personalized recommendations.
            </p>
            <div className="flex items-center justify-center gap-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">10M+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">50M+</div>
                <div className="text-sm text-gray-400">Songs Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
