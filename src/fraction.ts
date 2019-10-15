import { Integers } from "./math";

type Fraction = [bigint, bigint];

export class Rationals {
  static one(): Fraction {
    return [1n, 1n];
  }
  static zero(): Fraction {
    return [0n, 1n];
  }
  static reduce(x: Fraction): Fraction {
    const [a, b] = x;
    const d = Integers.gcd(a, b);
    return [a / d, b / d];
  }
  static add(x: Fraction, y: Fraction): Fraction {
    return Rationals.reduce([x[0] * y[1] + x[1] * y[0], x[1] * y[1]]);
  }
  static mul(x: Fraction, y: Fraction): Fraction {
    return Rationals.reduce([x[0] * y[0], x[1] * y[1]]);
  }
  static scale(k: bigint, x: Fraction): Fraction {
    return Rationals.reduce([k * x[0], x[1]]);
  }
  static sub(x: Fraction, y: Fraction): Fraction {
    return Rationals.reduce([x[0] * y[1] - x[1] * y[0], x[1] * y[1]]);
  }
  static div(x: Fraction, y: Fraction): Fraction {
    return Rationals.reduce([x[0] * y[1], x[1] * y[0]]);
  }
}
