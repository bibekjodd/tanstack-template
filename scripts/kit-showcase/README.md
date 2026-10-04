# Kit showcase

Two throwaway routes that render the whole kit, kept as a regression test for `src/components/kit`
and `src/components/fx`.

- `kit-test.tsx` renders every component alone in a labelled box. `/kit-test?only=<Name>` renders one.
- `kit-landing.tsx` is a complete landing page built only from kit parts.

To run them, copy both into `src/routes/`, start `npm run dev`, open `/kit-test` and `/kit-landing`
in a browser (light and dark, desktop and phone) and look for console errors and hydration warnings.
Delete them from `src/routes/` before committing: they are not part of a generated project.
