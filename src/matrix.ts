import { PolynomialMath } from "./polynomial.js";

export type Matrix = bigint[][];

export class MatrixMath {
  /**
   * Returns the nxn 0 matrix.
   * @param {number} n
   * @returns {Matrix}
   */
  static zero(n: number): Matrix {
    const A = new Array(n);
    for (let i = 0; i < n; i++) {
      A[i] = new Array(n);
      for (let j = 0; j < n; j++) {
        A[i][j] = 0n;
      }
    }
    return A;
  }

  /**
   * Returns the nxn identity matrix.
   * @param {number} n
   * @returns {Matrix}
   */
  static one(n: number): Matrix {
    const A = MatrixMath.zero(n);
    for (let i = 0; i < n; i++) {
      A[i][i] = 1n;
    }
    return A;
  }

  /**
   * Returns the matrix sum A + B.
   * @param {Matrix} A
   * @param {Matrix} B
   * @returns {Matrix}
   */
  static add(A: Matrix, B: Matrix): Matrix {
    const n = A.length;
    const C = MatrixMath.zero(n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        C[i][j] = A[i][j] + B[i][j];
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
  static sub(A: Matrix, B: Matrix): Matrix {
    return MatrixMath.add(A, MatrixMath.scale(B, -1n));
  }

  /**
   * Returns the matrix product A * B.
   * @param {Matrix} A
   * @param {Matrix} B
   * @returns {Matrix}
   */
  static mul(A: Matrix, B: Matrix): Matrix {
    const n = A.length;
    const C = MatrixMath.zero(n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          C[i][j] += A[i][k] * B[k][j];
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
  static scale(A: Matrix, k: bigint): Matrix {
    const n = A.length;
    const B = MatrixMath.zero(n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        B[i][j] = k * A[i][j];
      }
    }
    return B;
  }

  /**
   * Returns the determinent of the matrix A.
   * @param {Matrix} A
   * @returns {bigint}
   */
  static det(A: Matrix): bigint {
    const n = A.length;
    if (n === 1) {
      return A[0][0];
    }
    let D = 0n;
    for (let i = 0; i < n; i++) {
      const c = MatrixMath.det(MatrixMath.minor(A, i, 0));
      const s = BigInt((-1) ** i);
      D += A[i][0] * c * s;
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
  static minor(A: Matrix, i: number, j: number): Matrix {
    const n = A.length;
    const Am = MatrixMath.zero(n - 1);
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
  static cofactor(A: Matrix): Matrix {
    const n = A.length;
    const C = MatrixMath.zero(n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const d = MatrixMath.det(MatrixMath.minor(A, i, j));
        const s = BigInt((-1) ** (i + j));
        C[i][j] = d * s;
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
  static inverse(A: Matrix): Matrix {
    const n = A.length;
    const d = MatrixMath.det(A);
    if (d !== 1n && d !== -1n) {
      throw new Error(`expected matrix in GLn(Z)`);
    }
    let B = MatrixMath.cofactor(A);
    B = MatrixMath.scale(B, d);
    B = MatrixMath.transpose(B);
    return B;
  }

  /**
   * Returns the transpose matrix.
   * @param {Matrix} A
   * @returns {Matrix}
   */
  static transpose(A: Matrix): Matrix {
    const n = A.length;
    const At = MatrixMath.zero(n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
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
  static charPoly(A: Matrix): bigint[] {
    const n = A.length;
    const B = MatrixMath.zero(n) as any;
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
        const Am = MatrixMath.minor(A as any, i, 0) as any;
        const d = PolynomialMath.mul(A[i][0], det(Am));
        const g = PolynomialMath.scale(d, BigInt((-1) ** i));
        f = PolynomialMath.add(f, g);
      }
      return f;
    }
  }

  /**
   * Returns the matrix A represented as a string.
   * @param {Matrix} A
   * @returns {string}
   */
  static toString(A: Matrix): string {
    return `[${A.map(row => `[${row.map(a => `${a}`).join(",")}]`).join(",")}]`;
  }
}
