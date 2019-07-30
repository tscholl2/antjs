import * as test from "tape";
import { PolynomialMath } from "./polynomial";

test("[polynomial] misc functions", t => {
    t.plan(5);
  
    t.deepEqual(PolynomialMath.fromString("x^2 + 1"), [1n, 0n, 1n]);
    t.deepEqual(PolynomialMath.fromString("x^2 + x + 1"), [1n, 1n, 1n]);
    t.deepEqual(PolynomialMath.fromString("x^2 + 2*x + 1"), [1n, 2n, 1n]);
    t.deepEqual(PolynomialMath.fromString("3*x^2 - 2*x + 1"), [1n, -2n, 3n]);
    t.deepEqual(PolynomialMath.fromString("1"), [1n]);
  
    t.end();
  });