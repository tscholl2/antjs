import { Suite } from "benchmark";
import { PolynomialMath } from "./polynomial";
import { Domain } from "./structures";
import { PolynomialMath as PolynomialMath2 } from "./polynomial2";
import { BigIntMath } from "./math";

const ZZ: Domain<bigint> = {
  add: (x, y) => x + y,
  sub: (x, y) => x - y,
  mul: (x, y) => x * y,
  zero: () => 0n,
  equal: (x, y) => x === y,
  one: () => 1n,
  int: a => BigInt(a),
  bint: a => a
};

const P = PolynomialMath2(ZZ);

function randomPoly(): any {
  let f = Array<bigint>(101);
  for (let i = 0; i < 101; i++) {
    f[i] = BigIntMath.random(10000000n);
  }
  return f;
}

const f1 = randomPoly();
const f2 = randomPoly();

new Suite()
  .add("Polynomial f*g", () => {
    PolynomialMath.mul(f1, f2);
  })
  .add("Polynomial2 f*g", () => {
    P.mul(f1, f2);
  })
  .on("cycle", (event: any) => {
    console.log(`${event.target}`);
  })
  .run({ async: false });
