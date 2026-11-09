import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';
import './globals.css';
const url=process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
export const metadata:Metadata={
  metadataBase:new URL(url),title:{default:'MoreThanCricket — Know your game',template:'%s | MoreThanCricket'},
  description:'Explainable cricket performance analytics for club players. Progression, pressure patterns, consistency and uncertainty-aware projections.',
  applicationName:'MoreThanCricket',
  openGraph:{type:'website',siteName:'MoreThanCricket',title:'MoreThanCricket — Know your game',description:'The scoreboard tells what happened. Explore the patterns behind a cricket career.'},
  twitter:{card:'summary_large_image'}
};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#09131B'};
export default function RootLayout({children}:{children:ReactNode}){
 return <html lang="en" data-theme="dark"><body><a href="#main-content" className="skip-link">Skip to main content</a><SiteHeader/><div id="main-content">{children}</div><SiteFooter/><Analytics/></body></html>;
}
