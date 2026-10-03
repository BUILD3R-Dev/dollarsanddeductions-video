// webpack's require.context, resolved at bundle time (Remotion bundles with webpack 5).
type RequireContext = {keys(): string[]; <T = unknown>(id: string): T};
declare global {
  namespace NodeJS {
    interface Require {
      context(directory: string, useSubdirectories: boolean, regExp: RegExp): RequireContext;
    }
  }
}
export {};
