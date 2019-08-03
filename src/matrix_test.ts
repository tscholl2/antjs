import * as test from "tape";
import { MatrixMath } from "./matrix";
import { BigIntMath } from "./math";

test("[matrix] arithmetic functions", t => {
  t.plan(2);

  t.deepEqual(MatrixMath.one(3), [[1n, 0n, 0n], [0n, 1n, 0n], [0n, 0n, 1n]]);
  t.deepEqual(MatrixMath.zero(3), [[0n, 0n, 0n], [0n, 0n, 0n], [0n, 0n, 0n]]);
});

test("[matrix] LU", t => {
  t.plan(1);

  const A = [[0n, 1n, 3n], [3n, 4n, 7n], [8n, 1n, 9n]];
  const [P, L, D, U] = MatrixMath.luDecomposition(A);
  console.log(
    MatrixMath.toString(P),
    MatrixMath.toString(D),
    MatrixMath.toString(L),
    MatrixMath.toString(U)
  );
  const d = BigIntMath.lcm(...D.map((r, i) => r[i]));
  const dPA = MatrixMath.scale(MatrixMath.mul(P, A), d);
  const dDinv = D.map((r, i) => r.map((c, j) => (i != j ? 0n : d / c)));
  const LdDinvU = MatrixMath.mul(L, MatrixMath.mul(dDinv, U));
  t.deepEqual(dPA, LdDinvU);
});
