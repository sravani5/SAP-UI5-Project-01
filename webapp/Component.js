sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel"
], function(UIComponent, JSONModel, ResourceModel) {
	"use strict";
	return UIComponent.extend("practice.Component", {
		metadata: {
			// rootView: {
			// 	"viewName": "practice.view.App",
			// 	"type": "XML",
			// 	"async": true,
			// 	"id": "app"
			// }
			 manifest: "json"
		},
		init: function() {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			// set data model
			var oData = {
				recipient: {
					name: "World"
				}
			};
			var oModel = new JSONModel(oData);
			this.setModel(oModel);

			// set i18n model
			var i18nModel = new ResourceModel({
				bundleName: "pratice.i18n.i18n"
			});
			this.setModel(i18nModel, "i18n");
		}
	});
});