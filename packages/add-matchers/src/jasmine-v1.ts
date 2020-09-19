/// <reference types="jasmine-v1" />
import { CustomMatcher } from '.';

export type JasmineV1CustomMatcher = (this: jasmine.Matchers<any>, ...args: any[]) => boolean;

export type JasmineV1MatcherAdapter = (
  name: string,
  matcher: CustomMatcher,
) => JasmineV1CustomMatcher;

export interface JasmineV1MatchersByName {
  [name: string]: JasmineV1CustomMatcher;
}

const adapter = (name: string, matcher: CustomMatcher): JasmineV1CustomMatcher =>
  function (...args) {
    const arity = matcher.length - 1;
    const realArgs = args.slice(0, arity);
    return matcher(...realArgs, this.actual);
  };

export const getJasmineV1Adapter = (scope: jasmine.Env) => {
  const createJasmineV1Matcher = (name: string, matcher: CustomMatcher) => {
    const matchersByName = { [name]: adapter(name, matcher) };
    scope.beforeEach(function (this: jasmine.Spec) {
      this.addMatchers(matchersByName);
    });
    return matchersByName;
  };
  return createJasmineV1Matcher;
};
