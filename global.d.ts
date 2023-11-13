export {};

declare global {
  export type PartialBy<T, TK extends keyof T> = Omit<T, TK> & Partial<Pick<T, TK>>;
}
