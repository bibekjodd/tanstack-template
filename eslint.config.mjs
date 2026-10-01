import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

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
    files: ['src/components/ui/**'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'react-refresh/only-export-components': 'off'
    }
  }
]);
