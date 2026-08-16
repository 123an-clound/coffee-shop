'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/data/admin-users'

export async function signIn(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const isEmailNotConfirmed =
      error.code === 'email_not_confirmed' || /email not confirmed/i.test(error.message)
    if (isEmailNotConfirmed) {
      return {
        error:
          'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư và xác nhận email trước khi đăng nhập.',
      }
    }
    return { error: 'Email hoặc mật khẩu không đúng.' }
  }

  const isAdmin = await isAdminUser(supabase, data.user.id)
  if (!isAdmin) {
    await supabase.auth.signOut()
    return { error: 'Tài khoản này không có quyền quản trị.' }
  }

  redirect('/admin')
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
