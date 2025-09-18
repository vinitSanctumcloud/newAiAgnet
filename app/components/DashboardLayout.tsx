"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Settings,
  BarChart3,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  ChevronRight,
  Moon,
  Sun,
  Activity,
  X,
  Bot,
} from 'lucide-react';

// Import Shadcn UI components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut } from 'next-auth/react';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface SidebarProps {
  pathname: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeSubmenu: string | null;
  setActiveSubmenu: (menu: string | null) => void;
}

interface HeaderProps extends SidebarProps {
  toggleSidebar: () => void;
}

function Sidebar({ pathname, isSidebarOpen, setIsSidebarOpen, darkMode, toggleDarkMode, activeSubmenu, setActiveSubmenu }: SidebarProps) {
  const [userData, setUserData] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "/avatars/john-smith.jpg"
  });
  const router = useRouter();

  const toggleSubmenu = (menu: string) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      setUserData({ name: '', email: '', avatar: '' });
      localStorage.removeItem('auth-token');
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
      alert('An error occurred while logging out. Please try again.');
    }
  };

  return (
    <>
      {/* Hamburger Menu Button for Small Screens */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        lg:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 flex flex-col shadow-lg
        fixed top-0 left-0 h-screen w-64 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static z-40 border-r border-gray-200 dark:border-gray-700
      `}>
        {/* Sidebar Header */}
        <div className="sticky top-0 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-lg mr-3">
              <LayoutDashboard size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              DashBoard
            </span>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-2 rounded-lg transition-all duration-200 group ${pathname === '/dashboard'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/70'
                  }`}
              >
                <div className={`p-1.5 rounded-md mr-2 ${pathname === '/dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300'
                  }`}>
                  <Home size={18} />
                </div>
                <span>Home</span>
                {pathname === '/dashboard' && <div className="ml-auto w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full"></div>}
              </Link>
            </li>
            <li>
              <Link
                href="/aiagnet"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-2 rounded-lg transition-all duration-200 group ${pathname === '/aiagnet'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/70'
                  }`}
              >
                <div className={`p-1.5 rounded-md mr-2 ${pathname === '/aiagnet'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300'
                  }`}>
                  <User size={18} />
                </div>
                <span>AI Agent</span>
                {pathname === '/aiagnet' && <div className="ml-auto w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full"></div>}
              </Link>
            </li>
            <li>
              <Link
                href="/live_ai-agent"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-2 rounded-lg transition-all duration-200 group ${pathname === '/live_ai-agent'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/70'
                  }`}
              >
                <div
                  className={`p-1.5 rounded-md mr-2 ${pathname === '/live_ai-agent'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300'
                    }`}
                >
                  <Bot size={18} /> {/* you can use Bot or Cpu icon from lucide-react */}
                </div>
                <span>Live AI Agent Preview</span>
                {pathname === '/live_ai-agent' && (
                  <div className="ml-auto w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </Link>
            </li>

            <li>
              <button
                onClick={() => toggleSubmenu('reports')}
                className="flex items-center justify-between w-full p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/70 group"
              >
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md mr-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300">
                    <BarChart3 size={18} />
                  </div>
                  <span>Reports</span>
                </div>
                <ChevronRight size={16} className={`transition-transform ${activeSubmenu === 'reports' ? 'rotate-90' : ''}`} />
              </button>
              {activeSubmenu === 'reports' && (
                <ul className="ml-4 mt-1 space-y-1 pl-6 border-l border-gray-200 dark:border-gray-700">
                  <li>
                    <Link
                      href="/dashboard/reports/financial"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/70 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Financial
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/reports/usage"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/70 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Usage
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link
                href="/dashboard/analytics"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-2 rounded-lg transition-all duration-200 group ${pathname === '/dashboard/analytics'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/70'
                  }`}
              >
                <div className={`p-1.5 rounded-md mr-2 ${pathname === '/dashboard/analytics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300'
                  }`}>
                  <Activity size={18} />
                </div>
                <span>Analytics</span>
                {pathname === '/dashboard/analytics' && <div className="ml-auto w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full"></div>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/support"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-2 rounded-lg transition-all duration-200 group ${pathname === '/dashboard/support'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/70'
                  }`}
              >
                <div className={`p-1.5 rounded-md mr-2 ${pathname === '/dashboard/support'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300'
                  }`}>
                  <HelpCircle size={18} />
                </div>
                <span>Support</span>
                {pathname === '/dashboard/support' && <div className="ml-auto w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full"></div>}
              </Link>
            </li>
          </ul>
        </nav>
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <Button
            onClick={toggleDarkMode}
            variant="outline"
            className="flex items-center w-full mb-5 justify-start gap-2 rounded-md px-3 py-2 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-0"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span className="text-sm text-gray-800 dark:text-gray-200">
              {darkMode ? 'Light Theme' : 'Dark Theme'}
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center mb-4 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userData.email}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userData.name}</p>
                  <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                    {userData.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>v1.2.0</p>
            <p>© 2025 DashBoard</p>
          </div>
        </div>
      </div>
    </>
  );
}

// Header Component
function Header({  }: HeaderProps) {
  return (
    <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm z-10 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between py-4 px-4">
        <div className="flex items-center">
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-3">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Access dashboard navigation options</SheetDescription>
              </VisuallyHidden>
              <Sidebar
                pathname={pathname}
                isSidebarOpen={true}
                setIsSidebarOpen={toggleSidebar}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                activeSubmenu={activeSubmenu}
                setActiveSubmenu={setActiveSubmenu}
              />
            </SheetContent>
          </Sheet> */}
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-lg">
              <LayoutDashboard size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              DashBoard
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

// Main Layout Component
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
      <Sidebar
        pathname={pathname}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        activeSubmenu={activeSubmenu}
        setActiveSubmenu={setActiveSubmenu}
      />

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col h-full">
        <Header
          toggleSidebar={toggleSidebar}
          pathname={pathname}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 bg-white dark:bg-gray-900 hide-scrollbar">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}