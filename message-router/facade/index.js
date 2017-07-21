import { patternMatch } from './dictionary';
import { invoker } from './invoker';
export const facade = function (payload) {
  const functionToInvoke = patternMatch.find(payload);
  return invoker(functionToInvoke, payload);
};
