'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Moon, Sun, ArrowUpRight } from 'lucide-react';
export function SiteHeader(){
  const [theme,setTheme]=useState<'dark'|'light'>('dark');
  useEffect(()=>{const stored=window.localStorage.getItem('mtc-theme');const next=stored==='light'?'light':'dark';setTheme(next);document.documentElement.dataset.theme=next;},[]);
  function toggle(){const next=theme==='dark'?'light':'dark';setTheme(next);document.documentElement.dataset.theme=next;window.localStorage.setItem('mtc-theme',next);}
  return <div className="nav-frame"><header className="container site-nav">
    <Link className="wordmark" href="/" aria-label="MoreThanCricket home"><span className="brand-icon" aria-hidden="true">M</span>MoreThan<span>Cricket</span></Link>
    <nav className="nav-links" aria-label="Main navigation"><Link href="/#features">The metrics</Link><Link href="/#how">How it works</Link><Link href="/dossier/demo">Live demo</Link><Link href="/import">Import data</Link></nav>
    <div className="nav-actions"><button type="button" className="theme-switch" onClick={toggle} aria-label={`Switch to ${theme==='dark'?'light':'dark'} theme`}>{theme==='dark'?<Sun size={19}/>:<Moon size={19}/>}</button><Link href="/dossier/demo" className="button button-sm button-primary">Explore demo <ArrowUpRight size={16}/></Link></div>
  </header></div>;
}
export function SiteFooter(){return <footer className="footer"><div className="container footer-row"><span>© 2026 MoreThanCricket. Built for the love of the game.</span><nav className="footer-links" aria-label="Footer"><Link href="/privacy">Privacy & data</Link><Link href="/import">Import</Link><Link href="/dossier/demo">Illustrative demo</Link></nav><span>Independent product · Not affiliated with CricHeroes</span></div></footer>}
