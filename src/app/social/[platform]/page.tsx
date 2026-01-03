import { socialLinks } from "@/config/site";

const socialMediaMap: Record<string, string> = {
  github: socialLinks.github,
  twitter: socialLinks.twitter,
  linkedin: socialLinks.linkedin,
  youtube: socialLinks.youtube,
  instagram: socialLinks.instagram,
  facebook: socialLinks.facebook,
};

export default async function SocialRedirectPage({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform: platformParam } = await params;
  const platform = platformParam.toLowerCase();
  const socialUrl = socialMediaMap[platform] || "/connect";

  return (
    <html>
      <head>
        {/* Meta refresh fallback for instant redirect */}
        <meta httpEquiv="refresh" content={`0;url=${socialUrl}`} />
        {/* Instant JavaScript redirect */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                window.location.replace('${socialUrl.replace(/'/g, "\\'")}');
              } catch (e) {
                // Fallback if location.replace fails
                window.location.href = '${socialUrl.replace(/'/g, "\\'")}';
              }
            `,
          }}
        />
        <title>Redirecting...</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f5f5f5' }}>
        {/* Minimal fallback content for browsers without JS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#333',
        }}>
          <div style={{ textAlign: 'center' }}>
            <p>Redirecting...</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              If you are not redirected,{' '}
              <a href={socialUrl} style={{ color: '#0066cc', textDecoration: 'none' }}>
                click here
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
