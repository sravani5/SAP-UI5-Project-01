sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel"
], function(Controller, MessageToast, JSONModel, ResourceModel) {
	"use strict";
	return Controller.extend("practice.controller.App", {
		onInit: function() {
		// 	// set data model on view
		// 	var oData = {
		// 		recipient: {
		// 			name: "Worldddd"
		// 		}
		// 	};
		// 	var oModel = new JSONModel(oData);
		// 	this.getView().setModel(oModel);

			//set i18 model to view

			var i18nModel = new ResourceModel({
				bundleName: "practice.i18n.i18n"
			});
			this.getView().setModel(i18nModel, "i18n");

		}
		// onClick: function() {
		// 	MessageToast.show("Hello World");
		// }
	});
});