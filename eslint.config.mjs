import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const COLOR_NAMES =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const COLOR_UTILITY_PREFIX =
  'text|bg|border|ring|ring-offset|fill|stroke|from|via|to|outline|decoration|divide|accent|caret|shadow|placeholder';
// text-white, bg-black/50, border-slate-200, from-indigo-500 ...
const LITERAL_COLOR_UTILITY = `(?:^|[\\s:!"'\`])(?:${COLOR_UTILITY_PREFIX})-(?:white|black|(?:${COLOR_NAMES})-\\d{2,3})(?:[\\s\\/"'\`]|$)`;
// bg-[#fff], from-[#ffaa40], text-[rgb(...)]
const HEX_ARBITRARY_VALUE = '-\\[(?:#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla)\\()';
// style={{ color: '#fff' }}, background: 'rgb(0 0 0 / 50%)'
const COLOR_FUNCTION_OR_HEX = '^\\s*(?:#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla)\\()';
const TOKEN_MESSAGE =
  'Use a theme token instead of a literal colour: bg-background, text-foreground, bg-primary, text-primary-foreground, border-border, text-muted-foreground, bg-scrim / text-on-scrim over images, var(--chart-1) for an accent. Add a token in src/styles/app.css if none fits.';

export default defineConfig([
  globalIgnores(['.output/**', 'dist/**', 'node_modules/**', 'src/routeTree.gen.ts']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'jsx-a11y/alt-text': 'error',
      // This is TanStack Start. Next.js code type-checks poorly and renders nothing here, so fail
      // it at lint time with the replacement in the message.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next',
              message:
                'This is TanStack Start, not Next.js. Use @tanstack/react-router / @tanstack/react-start.'
            }
          ],
          patterns: [
            {
              group: ['next/*'],
              message:
                'This is TanStack Start, not Next.js: Link/useNavigate come from @tanstack/react-router, images are plain <img>, fonts are <link> tags in the root route head().'
            }
          ]
        }
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "ExpressionStatement[directive='use client']",
          message: 'TanStack Start has no server components; remove "use client".'
        },
        {
          selector: "ExpressionStatement[directive='use server']",
          message:
            'Server code goes in createServerFn() from @tanstack/react-start, not "use server".'
        }
      ]
    }
  },
  {
    // Colour comes from theme tokens (src/styles/app.css), never from a literal in a component:
    // a literal does not follow the project's palette or its dark mode. shadcn's own ui/ files
    // are left as generated.
    files: ['src/components/**/*.{ts,tsx}', 'src/routes/**/*.{ts,tsx}'],
    ignores: ['src/components/ui/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "ExpressionStatement[directive='use client']",
          message: 'TanStack Start has no server components; remove "use client".'
        },
        {
          selector: "ExpressionStatement[directive='use server']",
          message:
            'Server code goes in createServerFn() from @tanstack/react-start, not "use server".'
        },
        {
          selector: `Literal[value=/${LITERAL_COLOR_UTILITY}/]`,
          message: TOKEN_MESSAGE
        },
        {
          selector: `TemplateElement[value.raw=/${LITERAL_COLOR_UTILITY}/]`,
          message: TOKEN_MESSAGE
        },
        {
          selector: `Literal[value=/${HEX_ARBITRARY_VALUE}/]`,
          message: TOKEN_MESSAGE
        },
        {
          selector: `TemplateElement[value.raw=/${HEX_ARBITRARY_VALUE}/]`,
          message: TOKEN_MESSAGE
        },
        {
          selector: `Property[key.name=/^(color|background|backgroundColor|borderColor|fill|stroke|boxShadow)$/] > Literal[value=/${COLOR_FUNCTION_OR_HEX}/]`,
          message: TOKEN_MESSAGE
        },
        {
          // <path fill="#fff" />, <stop stopColor="#ffaa40" />
          selector: `JSXAttribute[name.name=/^(fill|stroke|stopColor|floodColor|lightingColor|color)$/] > Literal[value=/${COLOR_FUNCTION_OR_HEX}/]`,
          message: TOKEN_MESSAGE
        },
        {
          // ctx.fillStyle = '#fff'
          selector: `AssignmentExpression[left.property.name=/^(fillStyle|strokeStyle|shadowColor)$/] > Literal[value=/${COLOR_FUNCTION_OR_HEX}/]`,
          message: TOKEN_MESSAGE
        },
        {
          // A string that is exactly a hex colour: a default prop, a palette array, a config object.
          selector: `Literal[value=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]`,
          message: TOKEN_MESSAGE
        }
      ]
    }
  },
  {
    files: ['src/components/ui/**'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'react-refresh/only-export-components': 'off'
    }
  }
]);
