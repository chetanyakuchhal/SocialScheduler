import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { MenuIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const pageTitles: Record<string, string> = {
    "/dashboard" : "Dashboard",
    "/accounts": "Social Accounts",
    "/schedule": "Post Scheduler",
    "/ai-composer": "AI Composer",
}

const Layout = () => {

    const {isAuthenticated, isLoading} = useAuth()

    const location = useLocation()

    const title = pageTitles[location.pathname] || "SocialAI";

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light")

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    if(isLoading){
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className='size-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin'/>
            </div>
        )
    }

    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }

  return (
    <div className='flex h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100'>

        {/* Mobile Overlay */}
    {isMobileMenuOpen && <div className='fixed inset-0 bg-slate-950/70 z-40 md:hidden' onClick={()=> setIsMobileMenuOpen(false)}/>}

        <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen}/>

    <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Bar */}
        <header className='h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center px-4 md:px-8 gap-4'>

            <button aria-label="Open navigation" className="md:hidden p-2 -ml-2 text-slate-500 dark:text-slate-300" onClick={()=>setIsMobileMenuOpen(true)}>
                <MenuIcon className="size-6"/>
            </button>
            <div>
                <h1 className="text-slate-950 dark:text-white font-semibold">{title}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">Plan, generate, and publish from one calm workspace</p>
            </div>

            <button
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="ml-auto inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
                {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
            </button>

        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 xl:p-10">
            <Outlet />
        </main>

    </div>

    </div>
  )
}

export default Layout
