import { Suite } from "benchmark";
import { BigIntMath } from "./math";

new Suite()
  .add("isProbablePrime (composite)", () => {
    BigIntMath.isProbablePrime(10000000000600000000009n);
  })
  .add("isProbablePrime (prime)", () => {
    BigIntMath.isProbablePrime(10000000000000000000009n);
  })
  .add("isProbablePrime (random)", () => {
    BigIntMath.isProbablePrime(BigIntMath.random(20000000000000000000000n));
  })
  .on("cycle", (event: any) => {
    console.log(`${event.target}`);
  })
  .run({ async: false });
