sap.ui.define([], function() {
	"use strict";
	return {
		statusText: function(sStatus) {
			switch (sStatus) {
				case "A":
					return "Inprogress";
				case "B":
					return "Done";
				case "c":
					return "New";
			}
		}
	};
});