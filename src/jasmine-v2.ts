/// <reference types="jasmine-v2" />
import { CustomMatcher } from '.';

export type JasmineV2MatcherAdapter = (
  name: string,
  matcher: CustomMatcher
) => jasmine.CustomMatcherFactory;

export const getJasmineV2Adapter = (scope: {
  beforeEach: any;
  jasmine: jasmine.Env;
}) => {
  const createToBeMatcher = (
    name: string,
    matcher: CustomMatcher
  ): jasmine.CustomMatcherFactory => {
    return (util) => {
      return {
        compare(actual: any, ...args: any[]) {
          const passes = matcher(...args, actual);
          return {
            message: util.buildFailureMessage(name, passes, actual, ...args),
            pass: passes
          };
        }
      };
    };
  };

  const createToHaveMatcher = function forKeyAndActualAndTwoExpected(
    name: string,
    matcher: CustomMatcher
  ): jasmine.CustomMatcherFactory {
    return (util) => {
      return {
        compare(actual: any, key: string, ...args: any[]) {
          const passes = matcher(key, ...args, actual);
          const message = util
            .buildFailureMessage(name, passes, actual, ...args)
            .replace('Expected', `Expected member "${key}" of`)
            .replace(' to have ', ' to be ');
          return { message, pass: passes };
        }
      };
    };
  };

  const createJasmineV2Matcher = (name: string, matcher: CustomMatcher) => {
    const isMemberMatcher = name.search(/^toHave/) !== -1;
    const adapter = isMemberMatcher ? createToHaveMatcher : createToBeMatcher;
    const matchersByName = { [name]: adapter(name, matcher) };
    scope.beforeEach(() => {
      scope.jasmine.addMatchers(matchersByName);
    });
    return matchersByName;
  };

  return createJasmineV2Matcher;
};
