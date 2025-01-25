import React, { useState } from 'react';
import { Menu as MenuIcon, X, ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut, avatarUrl, userName } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/#' + sectionId);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav className={user ? "bg-black/30 backdrop-blur-md py-2 rounded-full shadow-lg fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition duration-300 w-[90%] max-w-6xl border border-white/[0.08]" : "bg-black/30 backdrop-blur-md py-4 rounded-full shadow-lg fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition duration-300 w-[90%] max-w-6xl border border-white/[0.08]"}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="UpResume" className="h-8" />
            <Link to="/" className="text-white text-xl font-bold">
              UpResume
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm">
              How it Works
            </button>
            <Link to="/pricing" className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm">
              Pricing
            </Link>
          </div>

          <div className="hidden md:block">
            {user ? (
              <Menu as="div" className="relative">
                {({ open }) => (
                  <>
                    <Menu.Button 
                      onClick={() => setIsProfileOpen(open)}
                      className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/[0.08]"
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Profile"
                          className="h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                          }}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">{userName?.charAt(0) || 'U'}</span>
                        </div>
                      )}
                      <span className="text-sm">{userName}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </Menu.Button>

                    <Menu.Items className="absolute right-0 mt-2 w-56 rounded-xl bg-black/80 backdrop-blur-xl border border-white/[0.08] shadow-lg py-2 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`flex items-center gap-3 px-4 py-3 text-sm ${
                              active ? 'text-white bg-white/[0.08]' : 'text-white/90'
                            }`}
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`flex items-center gap-3 px-4 py-3 text-sm ${
                              active ? 'text-white bg-white/[0.08]' : 'text-white/90'
                            }`}
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <div className="h-[1px] bg-white/[0.08] my-1 mx-4"></div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={`flex items-center gap-3 w-full text-left px-4 py-3 text-sm ${
                              active ? 'text-white bg-white/[0.08]' : 'text-white/90'
                            }`}
                          >
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </>
                )}
              </Menu>
            ) : (
              <Link 
                to="/signin" 
                className="bg-[#3868F9] text-white px-5 py-1.5 rounded-full hover:bg-[#897IFF] transition duration-200 hover:shadow-lg text-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white/90">
              {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-black/80 backdrop-blur-xl rounded-xl border border-white/[0.08] p-4 absolute top-full left-0 right-0 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  scrollToSection('features');
                  setIsOpen(false);
                }} 
                className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm text-left"
              >
                Features
              </button>
              <button 
                onClick={() => {
                  scrollToSection('how-it-works');
                  setIsOpen(false);
                }} 
                className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm text-left"
              >
                How it Works
              </button>
              <Link 
                to="/pricing" 
                onClick={() => setIsOpen(false)}
                className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm"
              >
                Pricing
              </Link>
              {user ? (
                <Menu as="div" className="relative">
                  {({ open }) => (
                    <>
                      <Menu.Button 
                        onClick={() => setIsProfileOpen(open)}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors w-full px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/[0.08]"
                      >
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Profile"
                            className="h-8 w-8 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                            }}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">{userName?.charAt(0) || 'U'}</span>
                          </div>
                        )}
                        <span className="flex-1 text-left text-sm">{userName}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                      </Menu.Button>

                      <Menu.Items className="absolute left-0 right-0 mt-2 rounded-xl bg-black/90 backdrop-blur-xl border border-white/[0.08] shadow-lg py-1 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              onClick={() => setIsOpen(false)}
                              className={`block px-4 py-2 text-sm ${
                                active ? 'text-white bg-black/60' : 'text-white/90'
                              }`}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              onClick={() => setIsOpen(false)}
                              className={`block px-4 py-2 text-sm ${
                                active ? 'text-white bg-black/60' : 'text-white/90'
                              }`}
                            >
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                setIsOpen(false);
                                handleSignOut();
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                active ? 'text-white bg-black/60' : 'text-white/90'
                              }`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </>
                  )}
                </Menu>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="bg-[#3868F9] text-white px-5 py-1.5 rounded-full hover:bg-[#897IFF] transition duration-200 hover:shadow-lg text-sm text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}