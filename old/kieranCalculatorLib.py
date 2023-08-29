import sympy as sp
import latex2sympy2


def solve_for_var(eq, solveVar):
    try:
        #sanitize input by changing "d" to "\mathrm{d}"
        eq = eq.replace("d",r"d_{actuallyD}")
        solveVar = latex2sympy2.latex2sympy(solveVar)
        inlhs = latex2sympy2.latex2sympy(eq[:eq.index("=")])
        inrhs = latex2sympy2.latex2sympy(eq[eq.index("=")+1:])
        expr = sp.Eq(inlhs,inrhs)
        out = sp.solve(expr,solveVar)
        #outrhs = sp.solve(expr,solveVar)[0]
        return out
    except Exception as e:
        return str(e)