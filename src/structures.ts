export interface Element {}

export interface Ring<E extends Element> {
  add(x: E, y: E): E;
  sub(x: E, y: E): E;
  mul(x: E, y: E): E;
  zero(): E;
  equal(x: E,y: E): boolean;
}

export interface Domain<E extends Element> extends Ring<E> {
  one(): E;
  int(a: number): E;
  bint(a: bigint): E;
}

export interface Field<E extends Element> extends Domain<E> {
  div(x: E, y: E): E;
}

export interface Module<E extends Element, M extends Element> {
  scale(r: E, m: M): M;
}
