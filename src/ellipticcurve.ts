import { BigIntMath } from "./math";

export type EllipticCurve = {
  A: bigint;
  B: bigint;
  N: bigint;
};

export type Point = [bigint, bigint] | 0n;

export class EllipticCurveMath {
  private static reduce(N: bigint, x: bigint): bigint {
    x = x % N;
    if (x < 0n) {
      return x + N;
    }
    return x;
  }
  private static inv(N: bigint, x: bigint): bigint {
    x = EllipticCurveMath.reduce(N,x);
    const [d, [y, _]] = BigIntMath.xgcd(x, N);
    if (BigIntMath.abs(d) !== 1n) {
      throw new Error(`unable to invert: ${x} mod ${N}`);
    }
    return EllipticCurveMath.reduce(N, y);
  }
  static contains(E: EllipticCurve, P: Point): boolean {
    if (P === 0n) {
      return true;
    }
    const [x, y] = P;
    return (
      y ** 2n % E.N === EllipticCurveMath.reduce(E.N, x ** 3n + E.A * x + E.B)
    );
  }
  static add(E: EllipticCurve, P: Point, Q: Point): Point {
    let δ;
    if (P === 0n) {
      return Q;
    }
    if (Q === 0n) {
      return P;
    }
    const [x1, y1] = P;
    const [x2, y2] = Q;
    if (x1 !== x2) {
      δ = (y1 - y2) * EllipticCurveMath.inv(E.N, x1 - x2);
    } else {
      if (y1 === 0n) {
        return 0n;
      }
      δ = (3n * x1 ** 2n + E.A) * EllipticCurveMath.inv(E.N, 2n * y1);
    }
    const x = -x1 - x2 + δ ** 2n;
    const y = -y1 + δ * (x1 - x);
    return [EllipticCurveMath.reduce(E.N, x), EllipticCurveMath.reduce(E.N, y)];
  }
  static scale(E: EllipticCurve, k: bigint, P: Point): Point {
    if (k === 0n || P === 0n) {
      return 0n;
    }
    if (k === 1n) {
      return P;
    }
    if (k < 0n) {
      const Q = EllipticCurveMath.scale(E, -k, P);
      return Q === 0n ? Q : [Q[0], -Q[1]];
    }
    let result: Point = P;
    let Q = P;
    while (k > 0) {
      if (k % 2n === 1n) {
        result = EllipticCurveMath.add(E, result, Q);
      }
      P = EllipticCurveMath.add(E, P, P);
      k >>= 1n;
    }
    return result;
  }
}
