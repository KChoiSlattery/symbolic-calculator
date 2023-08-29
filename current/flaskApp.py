from flask import Flask, request, render_template
import sympy as sp
import numpy as np
import simplejson as json
import latex2sympy2
import requests

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'] ) 
def home():
   return render_template('calculator.html')

@app.route("/whiteboard", methods=['GET', 'POST'] ) 
def whiteboard():
   return render_template('whiteboard.html')

@app.route("/solveSingleVar",methods=['GET', 'POST'])
def solveSingleVar():
    tex_equation = request.json['equation']
    tex_solve_var = request.json['solve_var']
    try:
        #sanitize input by changing "d" to "\mathrm{d}"
        tex_equation = tex_equation.replace("d",r"d_{actuallyD}")
        sympy_solve_var = latex2sympy2.latex2sympy(tex_solve_var)
        inlhs = latex2sympy2.latex2sympy(tex_equation[:tex_equation.index("=")])
        inrhs = latex2sympy2.latex2sympy(tex_equation[tex_equation.index("=")+1:])
        sympy_equation = sp.Eq(inlhs,inrhs)
        free_symbols = sympy_equation.free_symbols
        sympy_solved_rhs = sp.solve(sympy_equation,sympy_solve_var)
        tex_solved_rhs = sp.latex(sympy_solved_rhs, inv_trig_style="power").replace(r"d_{actuallyD}","d")
        if len(sympy_solved_rhs) == 1:
            octave_code = sp.printing.octave_code(sympy_solved_rhs[0],assign_to=sympy_solve_var).replace(r"d_{actuallyD}","d")
            python_code = sp.printing.pycode(sympy_solved_rhs[0]).replace(r"d_actuallyD","d")
            c_code = sp.printing.ccode(sympy_solved_rhs[0],assign_to=sympy_solve_var).replace(r"d_{actuallyD}","d")
        else:
            numSolutionsInputted = 0
            octave_code = ""
            python_code = ""
            c_code = ""
            for i in sympy_solved_rhs:                
                if numSolutionsInputted != len(sympy_solved_rhs):
                    endingNewline = "\n"
                else: 
                    endingNewline = ""
                numSolutionsInputted = numSolutionsInputted + 1
                octave_code = octave_code + r"%Solution " + str(numSolutionsInputted) + ":\n" + sp.printing.octave_code(i,assign_to=sympy_solve_var).replace(r"d_{actuallyD}","d")+endingNewline
                python_code = python_code + r"#Solution " + str(numSolutionsInputted) + ":\n" + sp.printing.pycode(sympy_solve_var) + " = " + sp.printing.pycode(i).replace(r"d_actuallyD","d")+endingNewline
                c_code = c_code + r"//Solution " + str(numSolutionsInputted) + ":\n" + sp.printing.ccode(i,assign_to=sympy_solve_var).replace(r"d_{actuallyD}","d")+endingNewline
        return json.dumps({
            "free_symbols": str(free_symbols),
            "solved_rhs": tex_solved_rhs,
            "octave_code": octave_code,
            "python_code": python_code,
            "c_code": c_code
        })
    except Exception as error:
        return json.dumps({
            "free_symbols": "bbbbbb",
            "solved_rhs": repr(error),
            "octave_code": "",
            "python_code": "",
            "c_code": ""
        })

@app.route("/getFreeSymbols",methods=['GET','POST'])
def getFreeSymbols():
    equation = request.form.get('equation')
    outText = "<select>"
    
    return 

@app.route("/evalPts",methods=['GET', 'POST'])
def evalPts():
    latex2sympy2.set_real(False)
    pts = np.array(request.json['ptsToEval'])
    try:
        expression = request.json['expression']
    
        symExpr = latex2sympy2.latex2sympy(expression)
        print(symExpr)
        x = sp.symbols("x")
        f = sp.lambdify(x, symExpr, "numpy")
        #for sym in symExpr.free_symbols:
        #    print(sym)
        #    f = sp.lambdify(sym, symExpr, "numpy")
        evaldPts = f(pts)
        out = json.dumps(evaldPts.tolist())
        return out
    except Exception as e: 
        out = json.dumps(np.zeros(np.shape(pts)).tolist())
        print(e)
        return out

if __name__ == '__main__':
    app.run(host='127.0.0.1', threaded=True, port="5500")
