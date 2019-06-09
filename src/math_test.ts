import * as test from "tape";
import { BigIntMath } from "./math";

test("[math] arithmetic functions", t => {
  t.plan(250);

  t.deepEqual(BigIntMath.isPerfectPower(81n), [3n, 4n]);
  t.deepEqual(BigIntMath.isPerfectPower(82n), [82n, 1n]);

  t.throws(() => BigIntMath.bitLength(-1n));
  t.deepEqual(BigIntMath.bitLength(0n), 0);
  t.deepEqual(BigIntMath.bitLength(1n), 1);
  t.deepEqual(BigIntMath.bitLength(2n), 2);
  t.deepEqual(BigIntMath.bitLength(3n), 2);
  t.deepEqual(BigIntMath.bitLength(4n), 3);
  t.deepEqual(BigIntMath.bitLength(5n), 3);

  t.deepEqual(BigIntMath.max(1n, 2n), 2n);
  t.deepEqual(BigIntMath.max(-1n, 2n, 100n), 100n);
  t.deepEqual(BigIntMath.min(1n, 2n), 1n);
  t.deepEqual(BigIntMath.min(-1n, 2n, 100n), -1n);

  t.deepEqual(BigIntMath.sign(-5n), -1n);
  t.deepEqual(BigIntMath.sign(0n), 0n);
  t.deepEqual(BigIntMath.sign(5n), 1n);

  t.deepEqual(BigIntMath.abs(-5n), 5n);
  t.deepEqual(BigIntMath.abs(0n), 0n);
  t.deepEqual(BigIntMath.abs(5n), 5n);

  t.deepEqual(BigIntMath.gcd(6n, 10n), 2n);
  t.deepEqual(BigIntMath.gcd(6n, 10n, 14n), 2n);
  t.deepEqual(BigIntMath.gcd(6n, -10n, 14n), 2n);
  t.deepEqual(BigIntMath.gcd(6n, -10n, 14n, 5n), 1n);

  t.deepEqual(BigIntMath.xgcd(6n, 10n), [2n, [2n, -1n]]);
  t.deepEqual(BigIntMath.xgcd(6n, 10n, 14n), [2n, [2n, -1n, 0n]]);
  t.deepEqual(BigIntMath.xgcd(6n, -10n, 14n), [2n, [2n, 1n, 0n]]);
  t.deepEqual(BigIntMath.xgcd(6n, -10n, 14n, 5n), [1n, [-4n, -2n, 0n, 1n]]);

  t.deepEqual(BigIntMath.sum(1n, 2n, 3n, 4n), 10n);
  t.deepEqual(BigIntMath.prod(1n, 2n, 3n, 4n), 24n);

  t.deepEqual(BigIntMath.lcm(1n, 2n, 3n, 4n), 12n);
  t.deepEqual(BigIntMath.lcm(5n, 7n), 35n);

  t.deepEqual(BigIntMath.sqrt(0n), 0n);
  t.deepEqual(BigIntMath.sqrt(1n), 1n);
  t.deepEqual(BigIntMath.sqrt(100n), 10n);
  t.deepEqual(BigIntMath.sqrt(120n), 10n);
  t.deepEqual(BigIntMath.sqrt(121n), 11n);

  t.deepEqual(BigIntMath.pow(2n, 100n, 3n), 1n);
  t.deepEqual(BigIntMath.pow(2n, 100n), 2n ** 100n);
  t.deepEqual(BigIntMath.pow(2n, 100n, 0n), 2n ** 100n);

  t.deepEqual(BigIntMath.ord(2n ** 100n, 2n), 100n);
  t.deepEqual(BigIntMath.ord(15n * 2n ** 100n, 2n), 100n);

  for (let i = 0; i < 100; i++) {
    const x = BigIntMath.random(5n);
    t.ok(x < 5n);
    t.ok(x >= 0n);
  }

  t.deepEqual(BigIntMath.isProbablePrime(2n), true);
  t.deepEqual(BigIntMath.isProbablePrime(3n), true);
  t.deepEqual(BigIntMath.isProbablePrime(1n), false);
  t.deepEqual(BigIntMath.isProbablePrime(6n), false);
  t.deepEqual(BigIntMath.isProbablePrime(10000000004n), false);
  t.deepEqual(BigIntMath.isProbablePrime(10000000005n), false);
  t.deepEqual(BigIntMath.isProbablePrime(10000000006n), false);
  t.deepEqual(BigIntMath.isProbablePrime(10000000019n), true);

  t.deepEqual(
    BigIntMath.toString(123456789123456789123456789n),
    "123456789123456789123456789"
  );

  t.end();
});
