import { BezierConnector, FlowchartConnector, newInstance, ready } from "@jsplumb/browser-ui";
import { UserInputEqn } from "./whiteboard-lib";

var whiteboard = document.getElementById('whiteboard');
  


ready(() => {
    const instance = newInstance({
        container: whiteboard,
        connector: {
            type: FlowchartConnector.type,
            options: {
            }
        }
    })
    var nodes = [];
    nodes.push(new UserInputEqn(whiteboard, instance));
})