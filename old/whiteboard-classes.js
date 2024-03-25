class InputEqNode {
    constructor(whiteboard, jsPlumbInstance, pos = (0, 0)) {
      let x = this
      x.lhs = ''
      x.rhs = ''
      x.children = []

      x.container = document.createElement('flex-container')
      x.container.style["flex-direction"] = "column"
      x.container.classList.add('draggableNode')
      x.container.classList.add('node')
      whiteboard.appendChild(x.container)
      
      //setup main row
      x.main = document.createElement('mainRow')
      x.container.appendChild(x.main)

      // setup lhs
      x.lhsSpan = document.createElement('span')
      x.lhsSpan.classList.add('inputMath')
      x.main.appendChild(x.lhsSpan)
      x.lhsMathField = MQ.MathField(x.lhsSpan, {
        spaceBehavesLikeTab: true, // configurable
        handlers: {
          edit: function () {
            autoCommands: 'pi sqrt', x.update()
          }
        }
      })

      // setup equals
      x.equals = document.createElement('span')
      x.equals.classList.add('equals')
      x.main.appendChild(x.equals)
      katex.render('=', x.equals, {
        throwOnError: false
      });
      
      // setup rhs
      x.rhsSpan = document.createElement('span')
      x.rhsSpan.classList.add('inputMath')
      x.main.appendChild(x.rhsSpan)
      x.rhsMathField = MQ.MathField(x.rhsSpan, {
        spaceBehavesLikeTab: true, // configurable
        handlers: {
          edit: function () {
            autoCommands: 'pi sqrt', x.update()
          }
        }
      })

      // setup output row
      x.outRow = document.createElement('outRow')
      x.container.appendChild(x.outRow)

      x.leftOut = document.createElement('anchor')

      jsPlumbInstance.manage(this.container)
      x.update();
    }
    update() {
      let x = this
      //x.endpoints.push(
      //            instance.addEndpoint(x.container, {
      //              target: true,
      //              endpoint: 'Rectangle',
      //              anchor: 'Top'
      //            })
    //         )
      //code that goes in all nodes to allow recursive updating of everything downstream
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].update()
      }
    }
  }