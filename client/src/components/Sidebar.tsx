import { CalendarDaysIcon, LayoutDashboardIcon, LogOutIcon, SparklesIcon, UsersIcon, Wand2Icon } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({isOpen, setIsOpen} : {isOpen: boolean, setIsOpen: (val: boolean) => void}) => {

    const {logout, user} = useAuth()

    const location = useLocation()

    const navItems = [
        {name: "Dashboard", icon: LayoutDashboardIcon, path: "/dashboard"},
        { name: "Accounts", icon: UsersIcon, path: "/accounts" },
        { name: "Scheduler", icon: CalendarDaysIcon, path: "/schedule" },
        { name: "AI Composer", icon: Wand2Icon, path: "/ai-composer" },
    ]

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white border-r border-slate-800 flex flex-col h-full transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

     {/* Logo */}
     <div className="p-6 pb-4">
        <div className='text-xl tracking-tight flex items-center gap-2 font-semibold'>
            <span className='inline-flex size-9 items-center justify-center rounded-lg bg-teal-400 text-slate-950'>
                <SparklesIcon className='size-5' />
            </span>
            Social Scheduler
        </div>

     </div>

      {/* Nav section label */}
      <div className='px-6 py-2'>
        <span className='text-xs text-slate-500 uppercase tracking-wider'>Workspace</span>
      </div>

       {/* Nav links */}
       <nav className='flex-1 px-3 space-y-1'>
            {navItems.map((item)=>{
                const isActive = location.pathname === item.path;

                return (
                    <NavLink key={item.name}
                    to={item.path}
                    end={item.path === "/dashboard"}
                    onClick={()=>setIsOpen(false)} 
                    
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 border ${isActive ? "bg-teal-400 text-slate-950 border-teal-300 shadow-sm" : "text-slate-400 hover:bg-slate-900 border-transparent hover:text-white"}`}>


                        <item.icon className={`size-4.5 shrink-0 ${isActive ? "text-slate-950" : "text-slate-500"}`} />
                        {item.name}
                        {isActive && <span className='ml-auto w-[5px] h-5 rounded-full bg-slate-950'/>}
                    </NavLink>
                )
            })}
       </nav>

       {/* User footer */}
       <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/70 transition-colors">
            <div className='size-8 rounded-lg bg-linear-to-br from-teal-300 to-emerald-400 flex items-center justify-center text-slate-950 text-sm font-semibold shrink-0'>
                {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className='flex-1 min-w-0'>
                <div className='text-sm text-white truncate'>{user?.name}</div>
                <div className='text-xs text-slate-500 truncate'>{user?.email}</div>
            </div>
        </div>

        <button onClick={logout} className="mt-2 flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-slate-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-150">
           <LogOutIcon className="size-4" />
           Sign Out
        </button>

       </div>

    </aside>
  )
}

export default Sidebar
