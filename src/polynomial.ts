import { Domain, Element } from "./ring";

export type Polynomial<E> = Array<E>;

export class Polynomials<E> {
  public ring: Domain<E>;
  constructor(R: Domain<E>) {
    this.ring = R;
  }
  fromElement(a: E): Polynomial<E> {
    return [a];
  }
  int(a: number): Polynomial<E> {
    return [this.ring.int(a)];
  }
  bint(a: bigint): Polynomial<E> {
    return [this.ring.bint(a)];
  }
  /**
   * Returns the degree of the polynomial f.
   * @param {Polynomial<E>} f
   * @returns {number}
   */
  deg(f: Polynomial<E>): number {
    return f.length - 1;
  }

  /**
   * Returns the zero polynomial.
   * @returns {Polynomial<E>}
   */
  zero(): Polynomial<E> {
    return [];
  }

  /**
   * Returns the constant 1 polynomial.
   * @returns {Polynomial<E>}
   */
  one(): Polynomial<E> {
    return [this.ring.one()];
  }

  /**
   * Returns polynomial x^n.
   * @returns {Polynomial<E>}
   */
  x(n: number): Polynomial<E> {
    const f = new Array(n + 1);
    for (let i = 0; i < n; i++) {
      f[i] = this.ring.zero();
    }
    f[n] = this.ring.one();
    return f;
  }

  /**
   * Returns the product of the polynomials f and g.
   * @param {Polynomial<E>} f
   * @param {Polynomial<E>} g
   * @returns {Polynomial<E>}
   */
  mul = (f: Polynomial<E>, g: Polynomial<E>): Polynomial<E> => {
    const n = this.deg(f);
    const m = this.deg(g);
    const h: Polynomial<E> = new Array(n + m + 1);
    for (let i = 0; i < h.length; i++) {
      h[i] = this.ring.zero();
    }
    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= m; j++) {
        h[i + j] = this.ring.add(h[i + j], this.ring.mul(f[i], g[j]));
      }
    }
    return h;
  };

  /**
   * Returns the product of the polynomials.
   * @param {Polynomial<E>[]} fi
   * @returns {Polynomial<E>}
   */
  prod(...values: Polynomial<E>[]): Polynomial<E> {
    return values.reduce((p, c) => this.mul(p, c), this.one());
  }

  /**
   * Returns the sum of the polynomials.
   * @param {Polynomial<E>[]} fi
   * @returns {Polynomial<E>}
   */
  sum(...values: Polynomial<E>[]): Polynomial<E> {
    return values.reduce((p, c) => this.add(p, c), this.zero());
  }

  /**
   * Returns the sum of the polynomials f and g.
   * @param {Polynomial<E>} f
   * @param {Polynomial<E>} g
   * @returns {Polynomial<E>}
   */
  add(f: Polynomial<E>, g: Polynomial<E>): Polynomial<E> {
    const n = this.deg(f);
    const m = this.deg(g);
    if (n < m) {
      return this.add(g, f);
    }
    const h = new Array(n);
    for (let i = 0; i <= m; i++) {
      h[i] = this.ring.add(f[i], g[i]);
    }
    for (let i = m + 1; i <= n; i++) {
      h[i] = f[i];
    }
    return h;
  }

  /**
   * Returns the difference of the polynomials f and g.
   * @param {Polynomial<E>} f
   * @param {Polynomial<E>} g
   * @returns {Polynomial<E>}
   */
  sub(f: Polynomial<E>, g: Polynomial<E>): Polynomial<E> {
    return this.add(
      f,
      this.scale(g, this.ring.sub(this.ring.zero(), this.ring.one()))
    );
  }

  /**
   * Scales the polynomial f by k.
   * @param {Polynomial<E>} f
   * @param {bigint} k
   * @returns {Polynomial<E>}
   */
  scale(f: Polynomial<E>, k: E): Polynomial<E> {
    return f.map(a => this.ring.mul(k, a));
  }

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
  }

  /**
   * Returns the derivative of the polynomial f.
   * @param {Polynomial<E>} f
   * @returns {Polynomial<E>}
   */
  derivative(f: Polynomial<E>): Polynomial<E> {
    if (f.length === 1) {
      return this.zero();
    }
    const df = new Array(this.deg(f));
    for (let i = 0; i < df.length; i++) {
      df[i] = this.ring.mul(this.ring.int(i + 1), f[i + 1]);
    }
    return df;
  }

  /**
   * Returns the resultant of f and g.
   * https://en.wikipedia.org/wiki/Resultant#Definition
   * @param {Polynomial<E>} f
   * @param {Polynomial<E>} g
   * @returns {bigint}
   */
  resultant(f: Polynomial<E>, g: Polynomial<E>): E {
    const n = this.deg(f);
    const m = this.deg(g);
    // TODO
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
    throw new Error("Unimplemented");
    // TODO: compute determinate of A in R
  }

  /**
   * Returns the discriminant of the polynomial f.
   * @param {Polynomial<E>} f
   * @returns {bigint}
   */
  discriminant(f: Polynomial<E>) {
    const n = this.deg(f);
    const an = f[n];
    const df = this.derivative(f);
    const r = this.resultant(f, df);
    const s = (-1) ** ((n * (n - 1)) / 2);
    //return (R.mul(R.int(s), r) as any) / an;
  }

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
          `${i > 0 && this.ring.equal(a, this.ring.one()) ? "" : `${a}`}${
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
   * @returns {Polynomial<E>}
   */
  fromString(s: string): Polynomial<E> {
    // TODO
    throw Error("unimplemented");
  }
}
