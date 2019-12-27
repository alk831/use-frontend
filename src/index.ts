import * as babylon from 'babylon';
import traverse, { Visitor } from 'babel-traverse';
import * as babel from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import * as BabelTypes from 'babel-types';

let result;

interface Babel {
  types: typeof BabelTypes;
}

type PluginHandler = (babel: Babel) => {
  name?: string
  visitor: Visitor
}

result = babylon.parse(`
  const a = 4;
`, {});

result

console.log(result);

const pluginHandler: PluginHandler = (babel) => ({
  visitor: {
    BinaryExpression(path) {
    },
    CallExpression(path) {
    },
    Identifier(path) {
      if (path.node.name === 'useState') {
        const a = babel.types.callExpression(
          babel.types.identifier("multiply"),
          []
        )
        path.replaceWith(a)
      }
    },
  }
});

export default pluginHandler;

// export default declare((api, options, dirname) => {
//   return {};
// });