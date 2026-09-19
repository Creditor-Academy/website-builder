/** App routes that require a valid session cookie. */
export function isProtectedAppPath(pathname: string): boolean {
  return (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/builder') ||
    pathname === '/editor' ||
    pathname.startsWith('/editor/') ||
    pathname.startsWith('/template-builder')
  );
}
