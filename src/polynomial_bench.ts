import { Suite } from "benchmark";
import { PolynomialMath } from "./polynomial";
import { Integers } from "./math";

const P = PolynomialMath(Integers);

function randomPoly(): any {
  let f = Array<bigint>(101);
  for (let i = 0; i < 101; i++) {
    f[i] = Integers.random(10000000n);
  }
  return f;
}

const f1 = randomPoly();
const f2 = randomPoly();

new Suite()
  .add("Polynomial f*g", () => {
    P.mul(f1, f2);
  })
  .on("cycle", (event: any) => {
    console.log(`${event.target}`);
  })
  .run({ async: false });
