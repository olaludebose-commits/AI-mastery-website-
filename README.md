# AI MASTERY — Website & learning-platform starter

A responsive, dark futuristic educational website for AI MASTERY. The project includes a polished public site, course catalogue, application and contact forms, student registration/login, a starter student dashboard, administrator application review, certificate issuance/verification, and a Supabase schema with Row Level Security (RLS).

## Project files

- `index.html` — website structure and page sections
- `styles.css` — responsive design system and animations
- `app.js` — course rendering, navigation, form handling, Supabase integration
- `supabase-schema.sql` — database tables, access policies, helper functions and sample course records
- `netlify.toml` — static hosting configuration
- `robots.txt`, `sitemap.xml` — starter SEO files
- `favicon.svg` — simple AI MASTERY brand mark

## Important status note

The visual website works as a static site. **Real account registration, saved applications, saved contact messages, student records, administrator actions, and certificate verification require Supabase configuration.** Until configured, forms show a clear setup message rather than pretending the data was saved.

The current starter is not yet a full LMS content-management system: course/lesson/quiz/assignment tables and RLS are provided, but an admin UI for uploading lessons, editing courses, authoring quizzes, reviewing assignments, PDF certificate rendering, file storage uploads, and email notifications still needs to be implemented before claiming those features are available. The included certificate flow issues database records and supports public ID verification; it does not yet generate a designed PDF. Treat this as a functional foundation to extend, not as a completed production-grade LMS.

## 1. Publish the static website to Netlify

1. Download and extract `ai-mastery-platform.zip`.
2. Open `index.html` locally to preview the public site.
3. Create or sign in to a Netlify account.
4. Choose **Add new site → Deploy manually** and upload the project folder contents, or connect a Git repository containing these files.
5. Netlify serves `index.html` as the homepage. The included `netlify.toml` sets basic security headers and clean fallback behaviour.
6. For the current public brochure, no build command is needed.

## 2. Configure Supabase

1. Create a project at https://supabase.com/.
2. In the Supabase dashboard, open **SQL Editor → New query**.
3. Paste all of `supabase-schema.sql` and run it. Check the output for any SQL errors before proceeding.
4. Open **Project Settings → API** and copy the Project URL and `anon` / publishable key.
5. In `app.js`, replace the empty values at the top:
   ```js
   const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
   const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";
   ```
   The browser key is only safe to use with correct RLS policies. **Never use the `service_role` key in frontend code.**
6. In Supabase **Authentication → URL Configuration**, set the Site URL to your deployed Netlify URL. Add the local preview URL and any custom domain to Redirect URLs if needed.
7. Configure email confirmation and password recovery in Supabase Auth. Set up an SMTP provider if you want reliable production email delivery.
8. Redeploy the updated files to Netlify.

### Security note about applications

The application form permits anonymous submission and does not expose submissions to anonymous visitors. Administrators can read/update them only after being authorised in `user_roles`. Add rate limiting, CAPTCHA/anti-spam protection, and a retention policy before promoting the form widely.

## 3. Create the first administrator safely

1. Create your own account through the student registration form after Supabase is configured.
2. In Supabase **Authentication → Users**, locate that account and copy its UUID.
3. In **SQL Editor**, run the following statement after replacing the placeholder:
   ```sql
   update public.user_roles
   set role = 'admin'
   where user_id = 'PASTE-YOUR-USER-UUID-HERE';
   ```
4. Log out and log back in. Visit `/#admin`. Only accounts with an explicit `admin` role should see administrator data.
5. Do not add a public “make me admin” feature. Do not share the Supabase service-role key.

## 4. Test the configured website

- [ ] Open the site on a phone and desktop; check navigation and layout.
- [ ] Submit an application and confirm it appears in Supabase `applications`.
- [ ] Submit the contact form and confirm it appears in `contact_messages`.
- [ ] Register a student account and confirm the user appears in Supabase Auth.
- [ ] Confirm a student cannot read another student's enrolments, progress, quiz results, or certificates.
- [ ] Confirm a normal student cannot access `/#admin` data.
- [ ] Promote your own account to admin and test application approval/rejection.
- [ ] Test certificate issuance only for an existing student account.
- [ ] Verify a certificate ID through the public verification form.
- [ ] Review RLS policies with Supabase's policy advisor before handling real student records.

## 5. Custom domain

1. In Netlify, open **Domain management → Add a domain**.
2. Enter a domain you own and follow Netlify's DNS instructions.
3. Wait for DNS verification and HTTPS provisioning.
4. Update the Supabase Auth Site URL and Redirect URLs to include the custom domain.
5. Update `sitemap.xml` to use the final canonical domain and redeploy.

## 6. SEO

The included title, meta description, Open Graph tags, semantic headings, favicon, robots file and sitemap are a starter setup. Before launch:
- Replace `https://YOUR-DOMAIN.example/` in `sitemap.xml` with the real canonical domain.
- Add the domain in Google Search Console and submit `/sitemap.xml`.
- Add unique metadata to dedicated course/detail pages if the site is later split into separate routes.
- Use descriptive alt text if you add instructor or course images.

## 7. Recommended next development steps

For a production learning platform, add:
- Real lesson reader/video embed and protected learning-resource storage.
- Persistent lesson completion and course progress calculation.
- Quiz authoring and scoring, assignment submissions and instructor feedback.
- Admin UI for course/lesson/quiz/assignment/announcement CRUD.
- PDF certificate layout and download (e.g. server-side PDF generation).
- Secure email notifications and password reset flows.
- Spam protection, audit logs, backups, privacy/retention controls, and accessibility testing.

## Contact details included

- Main phone: `08116048407`
- WhatsApp: `08054685887`
- Email: `olaludeisaackehinde@gmail.com`

Training currently shown as online, free, every Saturday. Update the site content when programme terms change.
