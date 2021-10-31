$(document).ready(function(){
	let result = document.getElementById('display');
	let operation = [], operationResult, operand = "";
	
	let display = {
		inputs: () => {
			operationResult = operation.join("") + operand;
			result.innerHTML = operationResult;
		},
		equal: (x) => {
			if (isNaN(x) === false && x != Infinity) {
				result.innerHTML = x;
			} else {
				result.innerHTML = "ERROR";
				operation = [];
				operand = "";
			};
		}
	};
		
	let handlers = {
		number: (x) => { 
      if (x == 0 && operand[0] == 0) {
        null; 
      }  else {
        operand += x;}
			  display.inputs();
     
    },
		operator: (x) => {
			if (operand !== "") {
				operation.push(operand, x);
				operand = "";
				display.inputs();
			}
		},
		dot: () => {
			if (operand !== "" && String(operand).indexOf(".") < 0) {
				operand += ".";
				display.inputs();
			}
		},
		equal: () => {
			operand = eval(operationResult);
			operationResult = eval(operationResult);
			display.equal(operationResult);
			operation = [];
		},
		c: () => {
			operation = [];
			operand = "";
			display.inputs();
      result.innerHTML = 0;
		}
	};


	let calc = document.getElementById("calc");
	
	calc.addEventListener("click", function() {
		let elementClicked = event.target;
		if (elementClicked.classList.contains("number")) {
			handlers.number(elementClicked.innerHTML);
		} else if (elementClicked.classList.contains("operator")) {
			handlers.operator(elementClicked.innerHTML);
		} else if (elementClicked.id === "decimal") {
			handlers.dot(elementClicked.innerHTML);
		} else if (elementClicked.id === "clear") {
			handlers.c();
		} else if (elementClicked.id === "equals") {
			handlers.equal();
		}
	});
});

/* This is finally working, I think there are no functionality bugs left and the code is a lot more organized and less messy than before, it could probably use some improvement but that will have to wait. 
Design-wise its not the most beautiful calculator... and the buttons are not responsive on narrow screens. Overall Im happy with this first result. */