import { Domain, Element } from "./ring";
import { MatrixMath } from "./matrix";

export type Polynomial<E> = Array<E>;

export function PolynomialMath<E extends Element>(R: Domain<E>) {
  const P = {
    /**
     * Returns the degree of the polynomial f.
     * @param {Polynomial<E>} f
     * @returns {number}
     */
    deg(f: Polynomial<E>): number {
      return f.length - 1;
    },

    /**
     * Returns the zero polynomial.
     * @returns {Polynomial<E>}
     */
    zero(): Polynomial<E> {
      return [];
    },

    /**
     * Returns the constant 1 polynomial.
     * @returns {Polynomial<E>}
     */
    one(): Polynomial<E> {
      return [R.one()];
    },

    /**
     * Returns polynomial x^n.
     * @returns {Polynomial<E>}
     */
    x(n: number): Polynomial<E> {
      const f = new Array(n + 1);
      for (let i = 0; i < n; i++) {
        f[i] = R.zero();
      }
      f[n] = R.one();
      return f;
    },

    /**
     * Returns the product of the polynomials f and g.
     * @param {Polynomial<E>} f
     * @param {Polynomial<E>} g
     * @returns {Polynomial<E>}
     */
    mul(f: Polynomial<E>, g: Polynomial<E>): Polynomial<E> {
      const n = P.deg(f);
      const m = P.deg(g);
      const h: Polynomial<E> = new Array(n + m + 1);
      for (let i = 0; i < h.length; i++) {
        h[i] = R.zero();
      }
      for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
          h[i + j] = R.add(h[i + j], R.mul(f[i], g[j]));
        }
      }
      return h;
    },

    /**
     * Returns the product of the polynomials.
     * @param {Polynomial<E>[]} fi
     * @returns {Polynomial<E>}
     */
    prod(...values: Polynomial<E>[]): Polynomial<E> {
      return values.reduce((p, c) => P.mul(p, c), P.one());
    },

    /**
     * Returns the sum of the polynomials.
     * @param {Polynomial<E>[]} fi
     * @returns {Polynomial<E>}
     */
    sum(...values: Polynomial<E>[]): Polynomial<E> {
      return values.reduce((p, c) => P.add(p, c), P.zero());
    },

    /**
     * Returns the sum of the polynomials f and g.
     * @param {Polynomial<E>} f
     * @param {Polynomial<E>} g
     * @returns {Polynomial<E>}
     */
    add(f: Polynomial<E>, g: Polynomial<E>): Polynomial<E> {
      const n = P.deg(f);
      const m = P.deg(g);
      if (n < m) {
        return P.add(g, f);
      }
      const h = new Array(n);
      for (let i = 0; i <= m; i++) {
        h[i] = R.add(f[i], g[i]);
      }
      for (let i = m + 1; i <= n; i++) {
        h[i] = f[i];
      }
      return h;
    },

    /**
     * Returns the difference of the polynomials f and g.
     * @param {Polynomial<E>} f
     * @param {Polynomial<E>} g
     * @returns {Polynomial<E>}
     */
    sub(f: Polynomial<E>, g: Polynomial<E>): Polynomial<E> {
      return P.add(f, P.scale(g, R.sub(R.zero(), R.one())));
    },

    /**
     * Scales the polynomial f by k.
     * @param {Polynomial<E>} f
     * @param {bigint} k
     * @returns {Polynomial<E>}
     */
    scale(f: Polynomial<E>, k: E): Polynomial<E> {
      return f.map(a => R.mul(k, a));
    },

    /**
     * Returns true if the ideals (f) and (g) in Z[x]
     * sum to (1). Otherwise, returns false.
     * @param {Polynomial<E>} f
     * @param {Polynomial<E>} g
     * @returns {boolean}
     */
    coprime(f: Polynomial<E>, g: Polynomial<E>): boolean {
      // TODO: run xgcd in Q[x] to find u,v such that u*f + v*g = 1.
      //       return false if no such u,v exist or if u,v not in Z[x].
      throw new Error("unimplemented");
    },

    /**
     * Returns the derivative of the polynomial f.
     * @param {Polynomial<E>} f
     * @returns {Polynomial<E>}
     */
    derivative(f: Polynomial<E>): Polynomial<E> {
      if (f.length === 1) {
        return P.zero();
      }
      const df = new Array(P.deg(f));
      for (let i = 0; i < df.length; i++) {
        df[i] = R.mul(R.int(i + 1), f[i + 1]);
      }
      return df;
    },

    /**
     * Returns the resultant of f and g.
     * https://en.wikipedia.org/wiki/Resultant#Definition
     * @param {Polynomial<E>} f
     * @param {Polynomial<E>} g
     * @returns {bigint}
     */
    resultant(f: Polynomial<E>, g: Polynomial<E>): E {
      const n = P.deg(f);
      const m = P.deg(g);
      const A = (P as any).zero(n + m);
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
      throw new Error("Unimplemented");
      // TODO: compute determinate of A in R
    },

    /**
     * Returns the discriminant of the polynomial f.
     * @param {Polynomial<E>} f
     * @returns {bigint}
     */
    discriminant(f: Polynomial<E>) {
      const n = P.deg(f);
      const an = f[n];
      const df = P.derivative(f);
      const r = P.resultant(f, df);
      const s = (-1) ** ((n * (n - 1)) / 2);
      //return (R.mul(R.int(s), r) as any) / an;
    },

    /**
     * Returns a string representing the polynomial f
     * with "x" as the variable.
     * @param {Polynomial<E>} f
     * @returns {string}
     */
    toString(f: Polynomial<E>): string {
      return f
        .map(
          (a, i) =>
            `${i > 0 && R.equal(a, R.one()) ? "" : `${a}`}${
              i === 0 ? "" : i === 1 ? "x" : `x^${i}`
            }`
        )
        .filter(s => !s.startsWith("0"))
        .join(" + ");
    },

    /**
     * Given a string representing a polynomial
     * e.g. "x^2 + 1", returns the polynomial.
     * @param {string} s
     * @returns {Polynomial<E>}
     */
    fromString(s: string): Polynomial<E> {
      // TODO
      throw Error("unimplemented");
    }
  };
  return P;
}
