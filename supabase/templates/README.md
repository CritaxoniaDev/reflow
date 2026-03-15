# Supabase Email Templates

## Magic Link Template Setup

To use the magic link email template in Supabase:

### 1. Go to Supabase Dashboard
- Navigate to your project > Authentication > Email Templates

### 2. Configure Magic Link Email
- Open the "Magic Link" template
- Copy the HTML from `magic-link.html`
- Paste into the template editor
- Use `{{ .TokenHash }}` for the verification link (Supabase will replace this automatically)

### 3. Customize Sender
- Set "From Name" to: `Reflow`
- Set "Reply To" to: `support@reflow.app`

### 4. Test the Template
- Use Supabase's "Send test email" feature
- Check that the magic link works in your email client

## Environment Variables Needed

```env
SUPABASE_JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key