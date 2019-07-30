import { Domain, Element } from "./ring";
import { PolynomialMath } from "./polynomial";

export type Polynomial<E> = Array<E>;

export type Matrix<E> = Array<Array<E>>;

export function MatrixMath<E extends Element>(R: Domain<E>) {
  const M = {
    /**
     * Returns the nxn 0 matrix.
     * @param {number} n
     * @returns {Matrix}
     */
    zero(n: number): Matrix<E> {
      const A = new Array(n);
      for (let i = 0; i < n; i++) {
        A[i] = new Array(n);
        for (let j = 0; j < n; j++) {
          A[i][j] = 0n;
        }
      }
      return A;
    },

    /**
     * Returns the nxn identity matrix.
     * @param {number} n
     * @returns {Matrix}
     */
    one(n: number): Matrix<E> {
      const A = M.zero(n);
      for (let i = 0; i < n; i++) {
        A[i][i] = R.one();
      }
      return A;
    },

    /**
     * Returns the matrix sum A + B.
     * @param {Matrix} A
     * @param {Matrix} B
     * @returns {Matrix}
     */
    add(A: Matrix<E>, B: Matrix<E>): Matrix<E> {
      const n = A.length;
      const C = M.zero(n);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          C[i][j] = R.add(A[i][j], B[i][j]);
        }
      }
      return C;
    },

    /**
     * Returns the matrix difference A - B.
     * @param {Matrix} A
     * @param {Matrix} B
     * @returns {Matrix}
     */
    sub(A: Matrix<E>, B: Matrix<E>): Matrix<E> {
      return M.add(A, M.scale(B, -1n));
    },

    /**
     * Returns the matrix product A * B.
     * @param {Matrix} A
     * @param {Matrix} B
     * @returns {Matrix}
     */
    mul(A: Matrix<E>, B: Matrix<E>): Matrix<E> {
      const n = A.length;
      const C = M.zero(n);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          for (let k = 0; k < n; k++) {
            C[i][j] = R.add(C[i][j], R.mul(A[i][k], B[k][j]));
          }
        }
      }
      return C;
    },

    /**
     * Returns the matrix scaled k*A.
     * @param {Matrix} A
     * @param {bigint} k
     * @returns {Matrix}
     */
    scale(A: Matrix<E>, k: bigint): Matrix<E> {
      const n = A.length;
      const B = M.zero(n);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          B[i][j] = R.scale(k, A[i][j]);
        }
      }
      return B;
    },

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
      let D = R.zero();
      for (let i = 0; i < n; i++) {
        const c = M.det(M.minor(A, i, 0));
        const s = BigInt((-1) ** i);
        D = R.add(D, R.mul(A[i][0], R.scale(s, c)));
      }
      return D;
    },

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
    },

    /**
     * Returns the cofactor matrix C of A.
     * The i,j entry of C is the determinent
     * of the i,j minor of A.
     * @param {Matrix} A
     * @returns {Matrix}
     */
    cofactor(A: Matrix<E>): Matrix<E> {
      const n = A.length;
      const C = M.zero(n);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const d = M.det(M.minor(A, i, j));
          const s = BigInt((-1) ** (i + j));
          C[i][j] = R.scale(s, d);
        }
      }
      return C;
    },

    /**
     * Returns the inverse matrix A^(-1).
     * if it exists in M_n(Z).
     * @param {Matrix} A
     * @returns {Matrix}
     */
    inverse(A: Matrix<E>): Matrix<E> {
      const d = M.det(A);
      if (!R.isUnit(d)) {
        throw new Error(`expected matrix in GLn(R)`);
      }
      let B = M.cofactor(A);
      B = M.scale(d, B);
      B = M.transpose(B);
      return B;
    },

    /**
     * Scales all entries of the matrix.
     * @param {Matrix} A
     * @returns {Matrix}
     */
    scale(k: E, A: Matrix<E>): Matrix<E> {
      const n = A.length;
      const B = M.zero(n);
      for (let i=0;i<n;i++) {
        for (let j=0;j<n;j++) {
          B[i][j] = R.mul(k,A[i][j])
        }
      }
      return B;
    },

    /**
     * Returns the transpose matrix.
     * @param {Matrix} A
     * @returns {Matrix}
     */
    transpose(A: Matrix<E>): Matrix<E> {
      const n = A.length;
      const At = M.zero(n);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          At[i][j] = A[j][i];
        }
      }
      return At;
    },

    /**
     * Returns the characteristic polynomial of the
     * matrix A. The polynomial is represented as
     * a list of coefficients arr with arr[i]
     * the coefficient of x^i.
     * @param {Matrix} A
     * @returns {bigint[]}
     */
    charPoly(A: Matrix<E>): bigint[] {
      const n = A.length;
      const B = M.zero(n) as any;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          B[i][j] = i === j ? [-A[i][j], 1n] : [-A[i][j]];
        }
      }
      return det(B);

      function det(A: bigint[][][]): bigint[] {
        if (A.length <= 1) {
          return A[0][0];
        }
        let f = PolynomialMath.zero();
        for (let i = 0; i < n; i++) {
          const Am = M.minor(A as any, i, 0) as any;
          const d = PolynomialMath.mul(A[i][0], det(Am));
          const g = PolynomialMath.scale(d, BigInt((-1) ** i));
          f = PolynomialMath.add(f, g);
        }
        return f;
      }
    },

    /**
     * Returns the matrix A represented as a string.
     * @param {Matrix} A
     * @returns {string}
     */
    toString(A: Matrix<E>): string {
      return `[${A.map(row => `[${row.map(a => `${a}`).join(",")}]`).join(
        ","
      )}]`;
    }
  };
  return M;
}
