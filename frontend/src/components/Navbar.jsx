import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, LogOut, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Re-read user from localStorage whenever route changes
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || 'null'));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/exercises', label: 'Exercises' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/profile', label: 'Profile' },
    ...(user?.role === 'therapist' ? [{ to: '/therapist', label: 'Therapist' }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300"
    >
      <div
        className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(2,6,23,0.95)' : 'rgba(2,6,23,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none'
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-black text-xl">
          <Activity className="w-6 h-6" style={{ color: '#0ea5e9' }} />
          <span className="text-gradient">RehabAI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium transition-colors"
              style={{ color: isActive(link.to) ? '#38bdf8' : '#94a3b8' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', color: '#38bdf8' }}
              >
                <User className="w-4 h-4" />
                {user.username}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => e.target.style.color = '#f87171'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="glass-btn text-sm px-4 py-2">Login</Link>
              <Link to="/signup" className="primary-btn text-sm px-4 py-2">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)' }}
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mx-4 mt-2 overflow-hidden rounded-2xl"
            style={{ background: 'rgba(2,6,23,0.98)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="p-4 space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: isActive(link.to) ? 'rgba(14,165,233,0.1)' : 'transparent',
                    color: isActive(link.to) ? '#38bdf8' : '#94a3b8'
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t pt-3 mt-3 flex flex-col gap-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {user ? (
                  <button onClick={handleLogout} className="glass-btn w-full py-3 text-sm">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="glass-btn w-full py-3 text-sm justify-center" onClick={() => setMobileOpen(false)}>Login</Link>
                    <Link to="/signup" className="primary-btn w-full py-3 text-sm justify-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
