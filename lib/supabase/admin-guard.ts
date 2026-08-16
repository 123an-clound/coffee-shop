export function isProtectedAdminPath(pathname: string): boolean {
  if (!pathname.startsWith('/admin')) return false
  if (pathname === '/admin/login') return false
  return true
}
