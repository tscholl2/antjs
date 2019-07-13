import { MatrixMath } from "./matrix";

export type Polynomial = bigint[];

export class PolynomialMath {
  /**
   * Returns the degree of the polynomial f.
   * @param {Polynomial} f
   * @returns {number}
   */
  static deg(f: Polynomial): number {
    return f.length - 1;
  }

  /**
   * Returns the zero polynomial.
   * @returns {Polynomial}
   */
  static zero(): Polynomial {
    return [0n];
  }

  /**
   * Returns the constant 1 polynomial.
   * @returns {Polynomial}
   */
  static one(): Polynomial {
    return [1n];
  }

  /**
   * Returns polynomial x^n.
   * @returns {Polynomial}
   */
  static x(n: number = 1): Polynomial {
    const f = new Array(n + 1);
    for (let i = 0; i < n; i++) {
      f[i] = 0n;
    }
    f[n] = 1n;
    return f;
  }

  /**
   * Returns the product of the polynomials f and g.
   * @param {Polynomial} f
   * @param {Polynomial} g
   * @returns {Polynomial}
   */
  static mul(f: Polynomial, g: Polynomial): Polynomial {
    const n = PolynomialMath.deg(f);
    const m = PolynomialMath.deg(g);
    const h = new Array(n + m + 1);
    for (let i = 0; i < h.length; i++) {
      h[i] = 0n;
    }
    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= m; j++) {
        h[i + j] += f[i] * g[j];
      }
    }
    return h;
  }

  /**
   * Returns the product of the polynomials.
   * @param {Polynomial[]} fi
   * @returns {Polynomial}
   */
  static prod(...values: Polynomial[]): Polynomial {
    return values.reduce(
      (p, c) => PolynomialMath.mul(p, c),
      PolynomialMath.one()
    );
  }

  /**
   * Returns the sum of the polynomials.
   * @param {Polynomial[]} fi
   * @returns {Polynomial}
   */
  static sum(...values: Polynomial[]): Polynomial {
    return values.reduce(
      (p, c) => PolynomialMath.add(p, c),
      PolynomialMath.zero()
    );
  }

  /**
   * Returns the sum of the polynomials f and g.
   * @param {Polynomial} f
   * @param {Polynomial} g
   * @returns {Polynomial}
   */
  static add(f: Polynomial, g: Polynomial): Polynomial {
    const n = PolynomialMath.deg(f);
    const m = PolynomialMath.deg(g);
    if (n < m) {
      return PolynomialMath.add(g, f);
    }
    const h = new Array(n);
    for (let i = 0; i <= m; i++) {
      h[i] = f[i] + g[i];
    }
    for (let i = m + 1; i <= n; i++) {
      h[i] = f[i];
    }
    return h;
  }

  /**
   * Returns the difference of the polynomials f and g.
   * @param {Polynomial} f
   * @param {Polynomial} g
   * @returns {Polynomial}
   */
  static sub(f: Polynomial, g: Polynomial): Polynomial {
    return PolynomialMath.add(f, PolynomialMath.scale(g, -1n));
  }

  /**
   * Scales the polynomial f by k.
   * @param {Polynomial} f
   * @param {bigint} k
   * @returns {Polynomial}
   */
  static scale(f: Polynomial, k: bigint): Polynomial {
    return f.map(a => k * a);
  }

  /**
   * Returns true if the ideals (f) and (g) in Z[x]
   * sum to (1). Otherwise, returns false.
   * @param {Polynomial} f
   * @param {Polynomial} g
   * @returns {boolean}
   */
  static coprime(f: Polynomial, g: Polynomial): boolean {
    // TODO: run xgcd in Q[x] to find u,v such that u*f + v*g = 1.
    //       return false if no such u,v exist or if u,v not in Z[x].
    throw new Error("unimplemented");
  }

  /**
   * Returns the derivative of the polynomial f.
   * @param {Polynomial} f
   * @returns {Polynomial}
   */
  static derivative(f: Polynomial): Polynomial {
    if (f.length === 1) {
      return [0n];
    }
    const df = new Array(PolynomialMath.deg(f));
    for (let i = 0; i < df.length; i++) {
      df[i] = BigInt(i + 1) * f[i + 1];
    }
    return df;
  }

  /**
   * Returns the resultant of f and g.
   * https://en.wikipedia.org/wiki/Resultant#Definition
   * @param {Polynomial} f
   * @param {Polynomial} g
   * @returns {bigint}
   */
  static resultant(f: Polynomial, g: Polynomial): bigint {
    const n = PolynomialMath.deg(f);
    const m = PolynomialMath.deg(g);
    const A = MatrixMath.zero(n + m);
    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= m; j++) {
        if (j < m) {
          A[j][i + j] = f[n - i];
        }
        if (i < n) {
          A[m + i][i + j] = g[m - j];
        }
      }
    }
    return MatrixMath.det(A);
  }

  /**
   * Returns the discriminant of the polynomial f.
   * @param {Polynomial} f
   * @returns {bigint}
   */
  static discriminant(f: Polynomial): bigint {
    const n = PolynomialMath.deg(f);
    const an = f[n];
    const df = PolynomialMath.derivative(f);
    const R = PolynomialMath.resultant(f, df);
    const s = BigInt((-1) ** ((n * (n - 1)) / 2));
    return (s * R) / an;
  }

  /**
   * Returns a string representing the polynomial f
   * with "x" as the variable.
   * @param {Polynomial} f
   * @returns {string}
   */
  static toString(f: Polynomial): string {
    return f
      .map(
        (a, i) =>
          `${i > 0 && a === 1n ? "" : `${a}`}${
            i === 0 ? "" : i === 1 ? "x" : `x^${i}`
          }`
      )
      .filter(s => !s.startsWith("0"))
      .join(" + ");
  }

  /**
   * Given a string representing a polynomial
   * e.g. "x^2 + 1", returns the polynomial.
   * @param {string} s
   * @returns {Polynomial}
   */
  static fromString(s: string): Polynomial {
    // TODO
    throw Error("unimplemented");
  }
}
