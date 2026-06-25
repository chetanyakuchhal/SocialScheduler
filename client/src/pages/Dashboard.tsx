import { ActivityIcon, AlertCircleIcon, CheckCircleIcon, ClockIcon, SendIcon, Share2Icon, TrendingUpIcon } from "lucide-react"
import { useEffect, useState } from "react"
import api from "../api/axios"



const Dashboard = () => {

  const [stats, setStats] = useState({scheduled: 0, published: 0, connectedAccounts: 0})
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(()=>{
    const fetchDashboardData = async () => {
      try {
        setError("")
        const [postsRes, accountsRes, activityRes] = await Promise.all([api.get("/api/posts"), api.get("/api/accounts"), api.get("/api/activity")])

        const posts = postsRes.data;
        setStats({
          scheduled: posts.filter((p: any) => p.status === 'scheduled').length,
          published: posts.filter((p: any) => p.status === 'published').length,
          connectedAccounts: accountsRes.data.filter((a: any) => a.status === 'connected').length,
        })
        setActivities(activityRes.data)
      } catch (error: any) {
        setError(error?.response?.data?.message || "Dashboard data could not be loaded")
      } finally {
        setLoading(false)
      }
    };
    fetchDashboardData();
  },[])

  const statCards = [
    {
      label: "Scheduled Posts",
      value: stats.scheduled,
      icon: ClockIcon,
      trend: "+2 today",
    },
    {
      label: "Published Posts",
      value: stats.published,
      icon: CheckCircleIcon,
      trend: "All time",
    },
    {
      label: "Connected Accounts",
      value: stats.connectedAccounts,
      icon: Share2Icon,
      trend: "Active",
    },
  ]

  return (
    <div className="space-y-8 animate-rise-in">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-300">Command Center</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Today’s publishing overview</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track scheduled work, connected channels, and recent publishing events.</p>
          </div>
          <div className="h-16 min-w-56 rounded-lg bg-slate-950 p-3 text-white dark:bg-teal-400 dark:text-slate-950">
            <div className="text-xs opacity-70">Workflow health</div>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold"><TrendingUpIcon className="size-4" /> Ready for the next post</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertCircleIcon className="size-4" />
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card)=>(
          <div key={card.label} className="bg-white dark:bg-slate-900 relative border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-300 dark:hover:border-teal-500">
            <div className="flex items-center justify-between mb-5">

              <div className="inline-flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <card.icon className="size-5" />
              </div>

              <div className="text-xs text-teal-700 dark:text-teal-300 flex items-center gap-1">
                <TrendingUpIcon className="size-3"/>
                {card.trend}
              </div>

            </div>
            <div className="text-3xl font-semibold text-slate-950 dark:text-white tabular-nums">{loading ? "..." : card.value}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-slate-950 dark:text-white font-semibold">Recent Activity</h2>
            <span className="text-sm text-slate-400">{loading ? "Loading" : `${activities.length} events`}</span>
        </div>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="size-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-3">
              <ActivityIcon className="size-6 text-slate-400 dark:text-slate-500"/>
            </div>
            <p className="text-slate-600 dark:text-slate-300">No activity yet</p>
            <p className="text-slate-400 text-sm mt-1 text-center">Connect accounts and schedule posts to see events here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activities.map((activity)=>(
              <div key={activity._id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors">
                <div className="size-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
                  <SendIcon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">Published</span>
                    <span className="text-xs text-slate-400 shrink-0">{new Date(activity.createdAt).toLocaleString()}</span>
                  </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{activity.description}</p>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard
