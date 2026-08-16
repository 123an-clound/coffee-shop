import { describe, it, expect } from 'vitest'
import { isProtectedAdminPath } from './admin-guard'

describe('isProtectedAdminPath', () => {
  it('protects /admin and nested admin routes', () => {
    expect(isProtectedAdminPath('/admin')).toBe(true)
    expect(isProtectedAdminPath('/admin/menu')).toBe(true)
    expect(isProtectedAdminPath('/admin/menu/new')).toBe(true)
  })

  it('does not protect the login page', () => {
    expect(isProtectedAdminPath('/admin/login')).toBe(false)
  })

  it('does not protect public routes', () => {
    expect(isProtectedAdminPath('/menu')).toBe(false)
    expect(isProtectedAdminPath('/')).toBe(false)
  })
})
