import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
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

// The platform acts on lint errors (it sends the agent to fix them) and ignores warnings. Rules
// from the recommended sets that flag style or taste, never a broken app, are warnings or off, so
// the agent never spends a turn on them. Errors stay for what crashes, misbehaves at runtime or
// cannot work in TanStack Start: hooks called conditionally, an unsafe optional chain, a
// duplicate case, an invalid regex, a next/* import, "use client", and literal colours (the
// design rule, plans/36).
const OFF = [
  '@typescript-eslint/no-explicit-any',
  '@typescript-eslint/ban-ts-comment',
  '@typescript-eslint/no-empty-object-type',
  '@typescript-eslint/no-namespace',
  '@typescript-eslint/no-this-alias',
  '@typescript-eslint/no-unnecessary-type-constraint',
  '@typescript-eslint/no-unsafe-function-type',
  '@typescript-eslint/prefer-namespace-keyword',
  '@typescript-eslint/triple-slash-reference',
  'no-control-regex',
  'no-extra-boolean-cast',
  'no-prototype-builtins',
  'no-regex-spaces',
  'no-useless-catch',
  'no-useless-escape',
  'prefer-rest-params',
  'prefer-spread'
];
const WARN = [
  '@typescript-eslint/consistent-type-imports',
  '@typescript-eslint/no-array-constructor',
  '@typescript-eslint/no-extra-non-null-assertion',
  '@typescript-eslint/no-non-null-asserted-optional-chain',
  '@typescript-eslint/no-require-imports',
  '@typescript-eslint/no-unused-expressions',
  '@typescript-eslint/no-wrapper-object-types',
  '@typescript-eslint/prefer-as-const',
  'no-async-promise-executor',
  'no-case-declarations',
  'no-compare-neg-zero',
  'no-cond-assign',
  'no-constant-binary-expression',
  'no-constant-condition',
  'no-debugger',
  'no-empty',
  'no-empty-character-class',
  'no-empty-pattern',
  'no-empty-static-block',
  'no-fallthrough',
  'no-irregular-whitespace',
  'no-misleading-character-class',
  'no-nonoctal-decimal-escape',
  'no-octal',
  'no-self-assign',
  'no-sparse-arrays',
  'no-unused-labels',
  'no-unused-private-class-members',
  'no-useless-backreference',
  'no-var',
  'prefer-const'
];

export default defineConfig([
  globalIgnores(['.output/**', 'dist/**', 'node_modules/**', 'src/routeTree.gen.ts']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      ...Object.fromEntries(OFF.map((rule) => [rule, 'off'])),
      ...Object.fromEntries(WARN.map((rule) => [rule, 'warn']))
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'unused-imports': unusedImports
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Unused imports, unused variables and a missing alt are warnings: the platform's checks act
      // on errors (a crash, a blank page, wrong code), and a warning never sends the agent into a
      // fix cycle. The platform's own eslint --fix still removes unused imports and type imports.
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', args: 'after-used', caughtErrors: 'all' }
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
      'jsx-a11y/alt-text': 'warn',
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
          // An in-page link (href="#cafe", to="#deed") is a fragment, not a colour.
          selector: `Literal[value=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]:not(JSXAttribute[name.name=/^(href|to|hash)$/] > Literal, Property[key.name=/^(href|to|hash)$/] > Literal)`,
          message: TOKEN_MESSAGE
        }
      ]
    }
  },
  {
    files: ['src/components/ui/**'],
    rules: {
      'unused-imports/no-unused-vars': 'off',
      'react-refresh/only-export-components': 'off'
    }
  }
]);
