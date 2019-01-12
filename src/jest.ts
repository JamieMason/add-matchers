/// <reference types="jest" />
import { CustomMatcher } from '.';

export type JestMatcherAdapter = (
  name: string,
  matcher: CustomMatcher
) => jest.CustomMatcher;

export const getJestAdapter = (scope: { expect: jest.Expect }) => {
  const getLongName = (name: string): string => {
    return name.replace(/\B([A-Z])/g, ' $1').toLowerCase();
  };

  const createToBeMatcher: JestMatcherAdapter = (name, matcher) => {
    return function(received: any, ...args: any[]): jest.CustomMatcherResult {
      const arity = matcher.length - 1;
      const realArgs = args.slice(0, arity);
      const pass = matcher(...realArgs, received);
      const infix = pass ? ' not ' : ' ';
      const longName = getLongName(name);
      const formattedReceived = this.utils.printReceived(received);
      const formattedArgs = args
        .map((val) => this.utils.printExpected(val))
        .join(', ');
      const message = `expected ${formattedReceived}${infix}${longName} ${formattedArgs}`;
      return { message: () => message, pass };
    };
  };

  const createToHaveMatcher: JestMatcherAdapter = (name, matcher) => {
    return function(received: any, key: string, ...args: any[]) {
      const arity = matcher.length - 2;
      const realArgs = args.slice(0, arity);
      const pass = matcher(key, ...realArgs, received);
      const infix = pass ? ' not ' : ' ';
      const longName = getLongName(name);
      const formattedReceived = this.utils.printReceived(received);
      const formattedArgs = args
        .map((val) => this.utils.printExpected(val))
        .join(', ');
      const message = `expected member "${key}" of ${formattedReceived}${infix}${longName} ${formattedArgs}`;
      return { message: () => message, pass };
    };
  };

  const createJestMatcher = (name: string, matcher: CustomMatcher) => {
    const isMemberMatcher = name.search(/^toHave/) !== -1;
    const adapter = isMemberMatcher ? createToHaveMatcher : createToBeMatcher;
    const matchersByName = { [name]: adapter(name, matcher) };
    scope.expect.extend(matchersByName);
    return matchersByName;
  };

  return createJestMatcher;
};
