export async function sendMagicLinkEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?token=${token}`

  // For development, log the token and URL
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Magic Link Email:')
    console.log('To:', email)
    console.log('Token:', token)
    console.log('Link:', verifyUrl)
    console.log('---')
    return
  }

  // TODO: In production, use Resend, SendGrid, or Supabase email service
  // Example with Resend:
  // const { error } = await resend.emails.send({
  //   from: 'noreply@reflow.app',
  //   to: email,
  //   subject: 'Your Reflow Magic Link',
  //   html: `<a href="${verifyUrl}">Click here to verify</a>`,
  // })
  // if (error) throw error
}