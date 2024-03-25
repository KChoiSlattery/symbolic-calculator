import { Endpoint, JsPlumbInstance } from "@jsplumb/browser-ui";
import React from "react";
import { createRoot } from "react-dom/client";
import { EditableMathField } from "react-mathquill";
import { render } from "katex";
import { parseTex } from "tex-math-parser";
import { MathNode, parse } from 'mathjs';


var katexOptions = {
    output: "mathml"
} as const;

type Pos = "left" | "center" | "right"

class Input {
    minCount: number; // I can't think of any case where this would be more than one, but sure
    maxCount: number; // set to null for infinite
    pos: Pos;
    endpoints: Endpoint[];
    containers: HTMLElement[];
}

interface Output {
    pos: Pos;
    endpoint: Endpoint;
    container: HTMLElement[];
    strTex: string;
}

class eqnOutput implements Output {
    pos: Pos;
    endpoint: Endpoint;
    container: HTMLElement[];
    cssClass: string = "";
    strTex: string = "=";
    constructor(instance: JsPlumbInstance) {

    }
}

interface Node {
    children: Node[];
    frozen: boolean;

    updateSelf(): void;
    updateChildren(): void;
}

interface UserInputNode extends Node {
    outputs: Output[];
}

// class OutputsRow {
//     outputs: Output[];
//     left: HTMLElement[];
//     middle: HTMLElement[];
//     right: HTMLElement[];

//     constructor(outputs: Output[]) {
//         this.outputs = outputs;
//         this.updateSelf();
//     }

//     function updateSelf(): void {
//         for (i of this.outputs) {
//             console.log(i.strTex)
//         }
//     }
// }

export class UserInputEqn implements UserInputNode {
    outputs: Output[];
    children: Node[];
    frozen: boolean;

    container: HTMLElement;
    mainRowContainer: HTMLElement;
    lhs: HTMLSpanElement;
    lhsStr: string = "";
    rhs: HTMLSpanElement;
    rhsStr: string = "";
    equals: HTMLSpanElement;
    rhsTree: MathNode;
    lhsTree: MathNode;

    constructor(whiteboard: HTMLElement, instance: JsPlumbInstance, pos: number[] = [0, 0]) {
        this.outputs = [];
        this.children = [];
        this.frozen = false;
        this.container = document.createElement('span');
        // this.container.classList.add('draggableNode');
        this.container.classList.add('node-container');
        whiteboard.appendChild(this.container);

        // setup main row
        this.mainRowContainer = document.createElement('main-row-container');
        this.container.appendChild(this.mainRowContainer);

        // setup lhs
        this.lhs = document.createElement('span');
        // this.lhsTree = parseTex(this.lhsDefaultTex);
        let lhsRoot = createRoot(this.lhs);
        let node = this
        node.lhsTree = parse("");
        lhsRoot.render(<EditableMathField latex="" onChange={(mathField) => {
            node.lhsStr = mathField.text();
            node.lhsTree = parse(node.lhsStr);
            // node.lhsTree = parseTex(node.lhsTex);
            node.updateSelf();
        }
        
        } />);
        this.mainRowContainer.appendChild(this.lhs);

        // setup equals
        this.equals = document.createElement('span');
        render("=", this.equals, katexOptions);
        this.mainRowContainer.appendChild(this.equals);

        // setup rhs
        this.rhs = document.createElement('span');
        // this.rhsTree = new MathNode();
        let rhsRoot = createRoot(this.rhs);
        this.rhsTree = parse("");
        rhsRoot.render(<EditableMathField latex="" onChange={(mathField) => {
            node.rhsStr = mathField.text();
            node.rhsTree = parse(node.rhsStr);

            // node.rhsTree = parseTex(node.rhsTex);
            node.updateSelf();
        }

        } />);
        this.mainRowContainer.appendChild(this.rhs);

        instance.manage(this.container);
    }
    updateSelf(): void {
        console.log("LHS string: "+this.lhsStr);
        console.log("LHS tree: "+this.lhsTree.toString());
        console.log("RHS string: "+this.rhsStr);
        console.log("RHS tree: "+this.rhsTree.toString());
    }
    updateChildren(): void {
        console.log("Updating Children");
    }
}

