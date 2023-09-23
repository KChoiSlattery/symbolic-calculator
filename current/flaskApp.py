from flask import Flask, request, render_template
import sympy as sp
import numpy as np
import simplejson as json
import latex2sympy2

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'] ) 
def home():
   return render_template('calculator.html')

@app.route("/whiteboard", methods=['GET', 'POST'] ) 
def whiteboard():
   return render_template('whiteboard.html')

#######################
#old site functions:#
#######################

@app.route("/solveSingleVar",methods=['GET', 'POST'])
def solveSingleVar():
    tex_equation = request.json['equation']
    tex_solve_var = request.json['solve_var']
    try:
        #sanitize input by changing "d" to "\mathrm{d}"
        tex_equation = sanitize_tex(tex_equation)
        sympy_solve_var = latex2sympy2.latex2sympy(sanitize_tex(tex_solve_var))
        inlhs = latex2sympy2.latex2sympy(tex_equation[:tex_equation.index("=")])
        inrhs = latex2sympy2.latex2sympy(tex_equation[tex_equation.index("=")+1:])
        sympy_equation = sp.Eq(inlhs,inrhs)
        free_symbols = sympy_equation.free_symbols
        sympy_solved_rhs = sp.solve(sympy_equation,sympy_solve_var)
        tex_solved_rhs = desanitize_tex(sp.latex(sympy_solved_rhs, inv_trig_style="power"))
        if len(sympy_solved_rhs) == 1:
            octave_code = sp.printing.octave_code(sympy_solved_rhs[0],assign_to=sympy_solve_var)
            python_code = sp.printing.pycode(sympy_solved_rhs[0])
            c_code = sp.printing.ccode(sympy_solved_rhs[0],assign_to=sympy_solve_var)
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
                octave_code = octave_code + r"%Solution " + str(numSolutionsInputted) + ":\n" + desanitize_tex(sp.printing.octave_code(i,assign_to=sympy_solve_var).replace(r"d_{actuallyD}","d"))+endingNewline
                python_code = python_code + r"#Solution " + str(numSolutionsInputted) + ":\n" + desanitize_tex(sp.printing.pycode(sympy_solve_var) + " = " + sp.printing.pycode(i))+endingNewline
                c_code = c_code + r"//Solution " + str(numSolutionsInputted) + ":\n" + desanitize_tex(sp.printing.ccode(i,assign_to=sympy_solve_var))+endingNewline
        return json.dumps({
            "free_symbols": [str(element) for element in free_symbols],
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


#######################
#whiteboard functions:#
#######################

@app.route("/parse_input_eq",methods=['GET','POST'])
def parseLatex():
    input_eq = request.json['input_eq']
    try:
        input_eq = sanitize_tex(input_eq)
        inlhs = latex2sympy2.latex2sympy(input_eq [:input_eq .index("=")])
        inrhs = latex2sympy2.latex2sympy(input_eq [input_eq .index("=")+1:])
        free_symbols = inlhs.free_symbols.union(inrhs.free_symbols)
        sympy_full_equation = sp.Eq(inlhs,inrhs)
        return json.dumps({
            "errored": False,
            "free_symbols_tex": [desanitize_tex(sp.latex(element)) for element in free_symbols],
            "free_symbols_srepr": [sp.srepr(element) for element in free_symbols],
            "srepr": sp.srepr(sympy_full_equation)
        })
    except Exception as error:
        return json.dumps({
            "errored": True,
            "error_code": repr(error),
        })

def sanitize_tex(latex):
    latex = latex.replace(r"\delta","δ")
    latex = latex.replace(r"\Delta","Δ")
    latex = latex.replace(r"\lambda","λ")
    latex = latex.replace(r"\Lambda","Λ")
    latex = latex.replace("d",r"\spadesuit")
    latex = latex.replace("δ",r"\delta")
    latex = latex.replace("Δ",r"\Delta")
    latex = latex.replace("λ",r"\lambda")
    latex = latex.replace("Λ",r"\Lambda")
    return latex

def desanitize_tex(latex):
    latex = latex.replace(r"\spadesuit","d")
    return latex

if __name__ == '__main__':
    app.run(host='127.0.0.1', threaded=True, port="5500")
