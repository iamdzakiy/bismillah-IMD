import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextCoreWebVitals,
  {
    rules: {
      // React Compiler advisories that eslint-config-next 16 turns on as errors.
      // They flag patterns that work today; keep them visible without failing lint.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'prisma/**', 'public/**', 'repomix-output.xml', 'testt.html'],
  },
];

export default config;
