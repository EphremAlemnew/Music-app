import { Music, Library, User, Play, TrendingUp, Clock, BarChart3, HardDrive, Wifi, Shield } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Songs</p>
              <p className="text-3xl font-bold">1,247</p>
            </div>
            <Music className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Playlists</p>
              <p className="text-3xl font-bold">23</p>
            </div>
            <Library className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Users</p>
              <p className="text-3xl font-bold">156</p>
            </div>
            <User className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Plays Today</p>
              <p className="text-3xl font-bold">892</p>
            </div>
            <Play className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg">Recently Played</h3>
          </div>
          <p className="text-muted-foreground mb-4">Your recent music activity</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Sample Song - Artist Name</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Rock Anthem - Rock Band</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Library className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg">Top Playlists</h3>
          </div>
          <p className="text-muted-foreground mb-4">Most popular playlists</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Top Hits 2024 (15 songs)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Chill Vibes (8 songs)</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg">Trending Now</h3>
          </div>
          <p className="text-muted-foreground mb-4">Popular tracks this week</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Jazz Blues - Jazz Master</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Electronic Beat - DJ Pro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">Song played</p>
                  <p className="text-xs text-muted-foreground">Jazz Blues by Jazz Master</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">2m ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Library className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">Playlist created</p>
                  <p className="text-xs text-muted-foreground">My Favorites</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">5m ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">New user joined</p>
                  <p className="text-xs text-muted-foreground">Alice Johnson</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">12m ago</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Music Analytics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Pop Music</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Rock</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '30%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Jazz</span>
                <span>15%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '15%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Electronic</span>
                <span>10%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{width: '10%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Storage & System Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold">Storage Usage</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used</span>
              <span>2.4 GB / 10 GB</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{width: '24%'}}></div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold">Server Status</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 dark:text-green-400">Online</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="font-semibold">Security</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 dark:text-green-400">Secure</span>
          </div>
        </div>
      </div>
    </div>
  )
}