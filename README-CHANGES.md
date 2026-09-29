# Changes made

1. **Admin hidden.** Open the store as `yoursite.vercel.app/#admin`. Login is now your Supabase email + password (see below).
2. **Orders reach you.** The store keeps orders in each customer's own browser (localStorage), so you never saw them. Now, after checkout, WhatsApp opens with the full order (items, address, total) addressed to your store number. A real database (Supabase/Firebase) is still the proper fix.
3. **Social links.** Edit `window.SOCIAL_LINKS` in `js/data.js`. Empty = icon hidden.
4. **Countdown timer.** It was a fake loop that restarted every 3 days. Now set a real `window.OFFER_END_DATE` in `js/data.js`; if empty or expired, the timer section is hidden.
5. **Text.** Removed "authorized" boutique claim and the "rolex style" SEO keyword.

# Still to do by you
- Replace Unsplash stock photos with real product photos.
- Check the hero numbers (4,500+ clients, 4.9 rating), the seeded reviews in `js/data.js`, and the "100% Authentic / Swiss" wording. Keep only what is true.
- Add GA4 / Meta Pixel scripts in `index.html` `<head>`.

# Rebrand to Watch Mart
- Name changed everywhere (page title, header, footer, policies, WhatsApp messages, admin, invoices). Coupon is now `WATCHMART15`.
- New logo: `assets/logo.svg` (full logo) and `assets/logo-mark.svg` (icon, also used as favicon). The header/footer icon is inlined in `index.html`.
- Email shown on the site is `orders@watchmart.pk` and the gallery text mentions `@watchmart.pk`. These are placeholders: replace with your real email and social handle (Admin > Settings, and `index.html`).
- Social icons are hidden until you fill in `SOCIAL_LINKS` in `js/data.js`.
- Browsers that already had the old name saved are updated automatically to Watch Mart.

# Supabase (online database)
- `js/supabase.js` connects the store to Supabase (URL + publishable key only; never put the secret key anywhere).
- Watches, categories, coupons, shipping and settings edited in Admin are saved online and appear for every visitor.
- Orders are saved online (also retried automatically if the customer's internet drops) and shown in Admin > Orders.
- Order tracking checks the online database. Admin can upload photos straight from the phone/computer in the product form.
- First admin login asks to upload the demo watches to the database. Say OK once.
- Not yet online: customer reviews (still browser-only).
