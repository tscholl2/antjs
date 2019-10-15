import { Domain, Element } from "./ring";
import { Polynomials, Polynomial } from "./polynomial";

export type Matrix<E> = Array<Array<E>>;

export class Matrices<E extends Element> {
  public ring: Domain<E>;
  public n: number;
  public polynomials: Polynomials<E>;
  constructor(R: Domain<E>, n: number) {
    this.ring = R;
    this.n = n;
    this.polynomials = new Polynomials(R);
  }
  /**
   * Returns the nxn 0 matrix.
   * @returns {Matrix}
   */
  zero(): Matrix<E> {
    const A = new Array(this.n);
    for (let i = 0; i < this.n; i++) {
      A[i] = new Array(this.n);
      for (let j = 0; j < this.n; j++) {
        A[i][j] = 0n;
      }
    }
    return A;
  }

  /**
   * Returns the nxn identity matrix.
   * @returns {Matrix}
   */
  one(): Matrix<E> {
    const A = this.zero();
    for (let i = 0; i < this.n; i++) {
      A[i][i] = this.ring.one();
    }
    return A;
  }

  /**
   * Returns the matrix sum A + B.
   * @param {Matrix} A
   * @param {Matrix} B
   * @returns {Matrix}
   */
  add(A: Matrix<E>, B: Matrix<E>): Matrix<E> {
    if (A.length !== this.n || B.length !== this.n) {
      throw new Error(`expected ${this.n} got ${A.length} and ${B.length}`);
    }
    const C = this.zero();
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        C[i][j] = this.ring.add(A[i][j], B[i][j]);
      }
    }
    return C;
  }

  /**
   * Returns the matrix difference A - B.
   * @param {Matrix} A
   * @param {Matrix} B
   * @returns {Matrix}
   */
  sub(A: Matrix<E>, B: Matrix<E>): Matrix<E> {
    if (A.length !== this.n || B.length !== this.n) {
      throw new Error(`expected ${this.n} got ${A.length} and ${B.length}`);
    }
    const C = this.zero();
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        C[i][j] = this.ring.sub(A[i][j], B[i][j]);
      }
    }
    return C;
  }

  /**
   * Returns the matrix product A * B.
   * @param {Matrix} A
   * @param {Matrix} B
   * @returns {Matrix}
   */
  mul(A: Matrix<E>, B: Matrix<E>): Matrix<E> {
    if (A.length !== this.n || B.length !== this.n) {
      throw new Error(`expected ${this.n} got ${A.length} and ${B.length}`);
    }
    const C = this.zero();
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        for (let k = 0; k < this.n; k++) {
          C[i][j] = this.ring.add(C[i][j], this.ring.mul(A[i][k], B[k][j]));
        }
      }
    }
    return C;
  }

  /**
   * Returns the matrix scaled k*A.
   * @param {Matrix} A
   * @param {bigint} k
   * @returns {Matrix}
   */
  scale(r: E, A: Matrix<E>): Matrix<E> {
    if (A.length !== this.n) {
      throw new Error(`expected ${this.n} got ${A.length}`);
    }
    const B = this.zero();
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        B[i][j] = this.ring.mul(r, A[i][j]);
      }
    }
    return B;
  }

  int(k: number) {
    return this.bint(BigInt(k));
  }

  bint(k: bigint) {
    const A = this.one();
    for (let i = 0; i < this.n; i++) {
      A[i][i] = this.ring.bint(k);
    }
  }

  /**
   * Returns the determinent of the matrix A.
   * @param {Matrix} A
   * @returns {bigint}
   */
  det(A: Matrix<E>): E {
    const n = A.length;
    if (n === 1) {
      return A[0][0];
    }
    let D = this.ring.zero();
    for (let i = 0; i < n; i++) {
      const c = this.det(this.minor(A, i, 0));
      const s = BigInt((-1) ** i);
      D = this.ring.add(D, this.ring.mul(A[i][0], this.ring.scale(s, c)));
    }
    return D;
  }

  /**
   * Returns the i,j minor of the matrix A.
   * This is the matrix A without row i
   * or column j.
   * @param {Matrix} A
   * @param {number} i
   * @param {number} j
   * @returns {Matrix}
   */
  minor<T>(A: Array<Array<T>>, i: number, j: number): Array<Array<T>> {
    const n = A.length;
    const Am = new Array(n - 1);
    for (let i = 0; i < n - 1; i++) {
      Am[i] = new Array(n - 1);
    }
    for (let r = 0; r < n - 1; r++) {
      for (let c = 0; c < n - 1; c++) {
        Am[r][c] = A[r >= i ? r + 1 : r][c >= j ? c + 1 : c];
      }
    }
    return Am;
  }

  /**
   * Returns the cofactor matrix C of A.
   * The i,j entry of C is the determinent
   * of the i,j minor of A.
   * @param {Matrix} A
   * @returns {Matrix}
   */
  cofactor(A: Matrix<E>): Matrix<E> {
    if (A.length !== this.n) {
      throw new Error(`expected ${this.n} got ${A.length}`);
    }
    const C = this.zero();
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        const d = this.det(this.minor(A, i, j));
        const s = BigInt((-1) ** (i + j));
        C[i][j] = this.ring.scale(s, d);
      }
    }
    return C;
  }

  /**
   * Returns the inverse matrix A^(-1).
   * if it exists in M_n(Z).
   * @param {Matrix} A
   * @returns {Matrix}
   */
  inverse(A: Matrix<E>): Matrix<E> {
    const d = this.det(A);
    if (!this.ring.isUnit(d)) {
      throw new Error(`expected matrix in GLn(R)`);
    }
    let B = this.cofactor(A);
    B = this.scale(d, B);
    B = this.transpose(B);
    return B;
  }

  /**
   * Returns the transpose matrix.
   * @param {Matrix} A
   * @returns {Matrix}
   */
  transpose(A: Matrix<E>): Matrix<E> {
    if (A.length !== this.n) {
      throw new Error(`expected ${this.n} got ${A.length}`);
    }
    const At = this.zero();
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        At[i][j] = A[j][i];
      }
    }
    return At;
  }

  /**
   * Returns the characteristic polynomial of the
   * matrix A. The polynomial is represented as
   * a list of coefficients arr with arr[i]
   * the coefficient of x^i.
   * @param {Matrix} A
   * @returns {bigint[]}
   */
  characteristicPolynomial(A: Matrix<E>): Polynomial<E> {
    const B: any = this.zero();
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        B[i][j] = this.polynomials.sub(
          i === j ? this.polynomials.x(1) : this.polynomials.zero(),
          this.polynomials.fromElement(A[i][j])
        );
      }
    }
    const det = (A: E[][][]): Polynomial<E> => {
      if (A.length <= 1) {
        return A[0][0];
      }
      let f = this.polynomials.zero();
      for (let i = 0; i < this.n; i++) {
        const Am = this.minor(A as any, i, 0) as any;
        const d = this.polynomials.mul(A[i][0], det(Am));
        const g = this.polynomials.mul(d, this.polynomials.int((-1) ** i));
        f = this.polynomials.add(f, g);
      }
      return f;
    };
    return det(B);
  }

  /**
   * Returns the matrix A represented as a string.
   * @param {Matrix} A
   * @returns {string}
   */
  toString(A: Matrix<E>): string {
    return `[${A.map(row => `[${row.map(a => `${a}`).join(",")}]`).join(",")}]`;
  }
}
