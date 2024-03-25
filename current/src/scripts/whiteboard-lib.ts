import { Endpoint, JsPlumbInstance } from "@jsplumb/browser-ui";
// import {getInterfa}
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
    lhsSpan: HTMLSpanElement;
    lhsMathField: any;

    constructor(whiteboard: HTMLElement, instance:JsPlumbInstance, pos: number[] = [0, 0]) {
        this.outputs = [];
        this.children = [];
        this.frozen = false;
        this.container = document.createElement('span');
        // this.container.classList.add('draggableNode');
        this.container.classList.add('node-container');
        whiteboard.appendChild(this.container);

        // setup main row
        this.mainRowContainer = document.createElement('main-row-container');
        this.lhsSpan = document.createElement('span');
        this.lhsSpan.id = 'lhsSpan';
        // this.lhsMathField = MathField
        this.mainRowContainer.appendChild(this.lhsSpan);

        instance.manage(this.container);
    }
    updateSelf(): void {
        console.log("Updating");
    }
    updateChildren(): void {
        console.log("Updating Children");
    }
}

