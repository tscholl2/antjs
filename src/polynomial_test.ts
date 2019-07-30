import * as test from "tape";
import { PolynomialMath } from "./polynomial";
import { Domain } from "./ring";

const ZZ: Domain<bigint> = {
  add: (x, y) => x + y,
  sub: (x, y) => x - y,
  mul: (x, y) => x * y,
  zero: () => 0n,
  equal: (x, y) => x === y,
  one: () => 1n,
  int: a => BigInt(a),
  bint: a => a,
  isUnit: r => r * r === 1n,
  scale: (k, a) => k * a
};

test("[polynomial] misc functions", t => {
  t.plan(5);

  t.deepEqual(PolynomialMath(ZZ).fromString("x^2 + 1"), [1n, 0n, 1n]);
  t.deepEqual(PolynomialMath(ZZ).fromString("x^2 + x + 1"), [1n, 1n, 1n]);
  t.deepEqual(PolynomialMath(ZZ).fromString("x^2 + 2*x + 1"), [1n, 2n, 1n]);
  t.deepEqual(PolynomialMath(ZZ).fromString("3*x^2 - 2*x + 1"), [1n, -2n, 3n]);
  t.deepEqual(PolynomialMath(ZZ).fromString("1"), [1n]);

  t.end();
});
