import { createApi } from './create-api';

declare global {
  namespace NodeJS {
    interface Global {
      any: {
        [name: string]: any;
      };
    }
  }
}

export type CustomMatcher = (...args: any[]) => boolean;

export interface AdapterGetters {
  getJestAdapter: any;
  getJasmineV2Adapter: any;
  getJasmineV1Adapter: any;
}

export interface MatchersByName {
  [name: string]: CustomMatcher;
}

export const addMatchers = createApi(global);

export default addMatchers;
