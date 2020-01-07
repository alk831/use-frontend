import * as t from 'babel-types';
import { isUseMemoFunc } from '../../helpers';
import { VUE_COMPUTED } from '../../consts';
import { Visitor } from 'babel-traverse';

const replaceUseMemoWithComputed = (): Visitor => ({
  CallExpression(path) {
    const { node } = path;

    if (!isUseMemoFunc(node.callee)) return;

    const [callbackToMemoize] = node.arguments;

    if (!t.isArrowFunctionExpression(callbackToMemoize)) return;

    const newIdentifier = t.identifier(VUE_COMPUTED);

    path.replaceWith(t.callExpression(newIdentifier, [callbackToMemoize]));
  }
});

export const useMemoVisitors = [
  replaceUseMemoWithComputed,
];