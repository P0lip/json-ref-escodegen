export declare class Dependencies {}

export declare class DefaultModule {
  readonly id: string;
  readonly source: string;
}

export type GenerateOptions = {
  module: 'esm' | 'cjs';
  fs: {
    read(source): Promise<unknown>;
    write(source, content): Promise<void>;
  },
  path: {
    isAbsolute(uri): boolean;
    dirname(uri): string;
    normalize(uri): string;
    join(...parts: string[]): string;
  },
  transformExternal(source): boolean;
  transformInline(pointer): boolean;
  dependencies: Dependencies;
}

export default function(source: string, opts: GenerateOptions): DefaultModule;
