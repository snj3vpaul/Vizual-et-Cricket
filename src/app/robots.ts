import type { MetadataRoute } from 'next';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:['/api/','/import','/dossier/private/']},sitemap:`${process.env.NEXT_PUBLIC_SITE_URL??'https://example.com'}/sitemap.xml`};}
