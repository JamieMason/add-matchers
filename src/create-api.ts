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

export const createApi = (scope: any) => {
  const adapter = createAdapter(scope);

  const addMatchers = (matchersByName: MatchersByName) => {
    for (const name in matchersByName) {
      if (matchersByName.hasOwnProperty(name)) {
        adapter(name, matchersByName[name]);
      }
    }
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
    for (const name in matchersByName) {
      if (matchersByName.hasOwnProperty(name)) {
        addAsymmetricMatcher(name, matchersByName[name]);
      }
    }
  };

  addMatchers.asymmetric = addAsymmetricMatchers;
  return addMatchers;
};
