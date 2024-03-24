import { Endpoint } from "@jsplumb/browser-ui";

type Pos = "left" | "center" | "right"

class Argument {
    minCount: number; // I can't think of any case where this would be more than one, but sure
    maxCount: number; // set to null for infinite
    pos: Pos;
    endpoints: Endpoint[];
    containers: HTMLElement[];
}

class Output {
    pos: Pos;
    endpoint: Endpoint;
    container: HTMLElement[];
}

interface Node {
    args: Argument[];
    returns: Output[];
    children: Node[];
    frozen: boolean;

    updateSelf(): void;
    updateChildren(): void;
}

class InputEqn implements Node {
    args: Argument[];
    returns: Output[];
    children: Node[];
    frozen: boolean;

    container: HTMLElement;

    constructor(whiteboard: HTMLElement, pos: number[] = [0, 0]) {
        this.args = [];
        this.returns = [];
        this.children = [];
        this.frozen = false;

        this.container = document.createElement('flex-container')
        whiteboard.appendChild(this.container)
    }
    updateSelf(): void {
        throw new Error("Method not implemented.");
    }
    updateChildren(): void {
        throw new Error("Method not implemented.");
    }
}