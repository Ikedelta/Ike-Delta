## Audit findings

The shared `Button` component (`src/components/ui/button.tsx`) already gives every `<Button>` consistent **hover** (color/shadow shift), **active** (`active:scale-[0.98]`), **focus** (ring), and **disabled** (`disabled:opacity-50 disabled:pointer-events-none`) styling. So the *visual* contract is consistent everywhere `Button` is used.

The gap is **loading states**: many async action buttons fire network calls but never set `disabled` or show a spinner, so users can double-submit and get no feedback. Below is what I found.

### Consistent (no changes needed)
- `Login`, `Register`, `Settings` (dashboard), `CreateProduct`, `AdminSettings` — all use `disabled={loading}` + `<Loader2 className="animate-spin" />`.
- `Header` — shows spinner while auth resolves.
- Page-level loaders in every dashboard/admin page.

### Missing loading / disabled state on action buttons
| File | Button(s) | Issue |
|---|---|---|
| `src/pages/Contact.tsx` | Submit | No `submitting` state, button stays enabled during POST |
| `src/components/home/NewsletterSection.tsx` | Subscribe | No loading / disabled |
| `src/pages/admin/AdminBlog.tsx` | Save post, Delete | No `saving` / `deleting` state |
| `src/pages/admin/AdminCategories.tsx` | Save, Delete | No `saving` / `deleting` |
| `src/pages/admin/AdminNewsletters.tsx` | Create, Send, Delete | No loading state |
| `src/pages/admin/AdminSms.tsx` | Send SMS, Save template, Delete template | No loading state |
| `src/pages/admin/AdminProducts.tsx` | Toggle feature, Delete | No loading state |
| `src/pages/admin/AdminUsers.tsx` | Assign role | Has `disabled={!newRole}` but no loading spinner during the async write |
| `src/pages/dashboard/MyProducts.tsx` | Delete product | No deleting state |
| `src/pages/dashboard/Favorites.tsx` | Remove favorite | No removing state |
| `src/pages/dashboard/Downloads.tsx` | Download | No downloading state |
| `src/pages/dashboard/Notifications.tsx` | Mark read / Mark all read | No loading state |

### Minor button-style outliers
- A few raw `<button>` elements (mobile menu toggles in `Header`, `AdminLayout`) bypass the shared component. They're icon-only toggles with no async work, but they lack the standard focus ring. Low priority.

## Proposed fix

Standardize the loading pattern using the same recipe already used in `Login`/`Register`:

1. Add a local `useState` flag per async action (e.g. `saving`, `deleting`, `sending`).
2. Wrap the async handler in `try { setX(true); ... } finally { setX(false); }`.
3. Set `disabled={flagOrInvalid}` on the trigger button.
4. Swap the label for `<Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…` (or matching verb) while loading.
5. For row-level actions (delete in a list), key the loading flag by row id so only the clicked row shows the spinner.

No changes needed to `Button` itself — its hover/active/disabled variants already match the design system. After applying this pattern, every button across public site, dashboard, and admin will have consistent hover, active, disabled, and loading states.

## Files to edit
- `src/pages/Contact.tsx`
- `src/components/home/NewsletterSection.tsx`
- `src/pages/admin/AdminBlog.tsx`
- `src/pages/admin/AdminCategories.tsx`
- `src/pages/admin/AdminNewsletters.tsx`
- `src/pages/admin/AdminSms.tsx`
- `src/pages/admin/AdminProducts.tsx`
- `src/pages/admin/AdminUsers.tsx`
- `src/pages/dashboard/MyProducts.tsx`
- `src/pages/dashboard/Favorites.tsx`
- `src/pages/dashboard/Downloads.tsx`
- `src/pages/dashboard/Notifications.tsx`

Approve and I'll apply the pattern across the listed files.
