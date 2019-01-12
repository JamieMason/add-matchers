import { CustomMatcher, MatchersByName } from '.';

const createAdapter = (scope: any) => {
  if (scope.expect && scope.expect.extend) {
    return require('./jest').getJestAdapter(scope);
  }
  if (scope.jasmine && scope.jasmine.addMatchers) {
    return require('./jasmine-v2').getJasmineV2Adapter(scope);
  }
  if (scope.jasmine) {
    return require('./jasmine-v1').getJasmineV1Adapter(scope);
  }
  return null;
};

const forEachMatcher = (
  matchersByName: MatchersByName,
  fn: (name: string, matcher: any) => any
) => {
  for (const name in matchersByName) {
    if (matchersByName.hasOwnProperty(name) && name.charAt(0) !== '_') {
      fn(name, matchersByName[name]);
    }
  }
};

export const createApi = (scope: any) => {
  const adapter = createAdapter(scope);

  const addMatchers = (matchersByName: MatchersByName) => {
    forEachMatcher(matchersByName, adapter);
  };

  const addAsymmetricMatcher = (name: string, matcher: CustomMatcher) => {
    scope.any[name] = (...args: any[]) => ({
      asymmetricMatch(actual: any) {
        return matcher.apply(this, [...args, actual]);
      }
    });
  };

  const addAsymmetricMatchers = (matchersByName: MatchersByName) => {
    scope.any = {};
    forEachMatcher(matchersByName, addAsymmetricMatcher);
  };

  addMatchers.asymmetric = addAsymmetricMatchers;
  return addMatchers;
};
