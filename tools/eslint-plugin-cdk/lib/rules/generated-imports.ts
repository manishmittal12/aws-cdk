import { Rule } from 'eslint';
import { ImportSpecifier } from 'estree';

export function create(context: Rule.RuleContext): Rule.NodeListener {
  return {
    ImportDeclaration: node => {
      const importFrom = node.source.value as string;
      if (importFrom.endsWith('generated.ts')) {
        return;
      }
      const errors: { node: ImportSpecifier, fromImport: string }[] = [];
      node.specifiers.forEach(e => {
        if (e.type === 'ImportSpecifier') {
          if (e.imported.name.startsWith('Cfn')) {
            errors.push({ node: e, fromImport: importFrom });
          }
        }
      });

      errors.forEach(e => {
        context.report({
          message: 'some message',
          node: e.node,
        })
      })
    },
  };
}