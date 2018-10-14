sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel"
	
], function(Controller, MessageToast, JSONModel, ResourceModel) {
	"use strict";

	return Controller.extend("practice.controller.HelloPanel", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf practice.view.HellpPanel
		 */
			onInit: function() {
		 // set i18n model on view
         var i18nModel = new ResourceModel({
            bundleName: "practice.i18n.i18n"
         });
         this.getView().setModel(i18nModel, "i18n");
			},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf practice.view.HellpPanel
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf practice.view.HellpPanel
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf practice.view.HellpPanel
		 */
		//	onExit: function() {
		//
		//	}
		onClick: function() {
			MessageToast.show("Hello World");
		},
		onDialogOpen: function(oEvnt) { 
			// if (!this.oDialog) {
				//create Dialog
				this.oDialog = sap.ui.xmlfragment("practice.fragments.Dialog", this);
				//add dialog to the view(models,lifecycles)
				this.getView().addDependent(this.oDialog);
			// }
			this.oDialog.open();
		},
		onCloseDialog : function (oEvnt) {
			// oEvnt.oSource.oParent.getId().close();
			this.oDialog.close();
		},
		handleUrlPress: function (evt) {
			sap.m.URLHelper.redirect(this._getVal(evt), true);
		},
		_getVal: function(evt) {
			return sap.ui.getCore().byId(evt.getParameter('id')).getValue();
		}
	});

});