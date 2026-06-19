import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ro', 'ru'],
  defaultLocale: 'ro',
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
