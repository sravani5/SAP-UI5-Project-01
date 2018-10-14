sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/Filter',
	"sap/ui/model/json/JSONModel",
	"practice/model/formatter",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast",
	"sap/ui/model/resource/ResourceModel"
], function(Controller, Filter, JSONModel, formatter, Spreadsheet, MessageToast, ResourceModel) {
	"use strict";

	return Controller.extend("practice.controller.InvoiceList", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf practice.view.InvoiceList
		 */
		onInit: function() {
			var oViewModel = new JSONModel({
				isEditable: false
			});
			this.getView().setModel(oViewModel, "oViewModel");
			// this.oProductData=this.getView().getModel("invoice").getProperty("/Invoices");
			// set i18n model on view
			var i18nModel = new ResourceModel({
				bundleName: "practice.i18n.i18n"
			});
			this.getView().setModel(i18nModel, "i18n");
			//load the local json model and set to view
			var that = this;
			var sPath = jQuery.sap.getModulePath("practice", "/Invoices.json");
			this._oModel = new JSONModel();
			$.ajax({
				url: sPath
			}).then(function(data) {
				that._oModel.setData(data);
				that.getView().setModel(that._oModel, "invoice");
			});

		},
		onSearch: function(oEvnt) {
			var aFilter = [],
				sQuery = oEvnt.getSource().getValue();
			var filter = new Filter("ProductName", sap.ui.model.FilterOperator.Contains, sQuery);
			aFilter.push(filter);

			//List update after filtering 
			var oListData = this.getView().byId("invoiceList").getBinding("items");
			oListData.filter(aFilter);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf practice.view.InvoiceList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf practice.view.InvoiceList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf practice.view.InvoiceList
		 */
		//	onExit: function() {
		//
		//	}
		onEdit: function() {
			var oModel = this.getView().getModel("invoice");
			oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			var productDatatemp;

			productDatatemp = this.getView().getModel("invoice").getProperty("/Invoices");
			this.oProductData = productDatatemp;
			this.getView().getModel("oViewModel").setProperty("/isEditable", true);
			// this.getView().byId("editTable").setVisible(true);
		},
		onSave: function() {
			var oEditData = this.getView().byId("table").getBinding("items").oList;
			var oModel = this.getView().getModel("invoice");
			oModel.refresh();
			this.getView().getModel("oViewModel").setProperty("/isEditable", false);
		},
		onCancel: function() {
			this.getView().getModel("oViewModel").setProperty("/isEditable", false);
			// var oModel = this.getView().getModel("invoice").getProperty("/Invoices");
			// this.getView().getModel("invoice").setProperty("/Invoices", oModel);
			// oModel.refresh();
			// this.getView().byId("table").setVisible(true);
			// this.getView().byId("editTable").setVisible(false);
		},
		onaddRow: function() {
			debugger;
			var oTableData = [];
			var newObj = {
				"ProductName": " ",
				"Quantity": " ",
				"ExtendedPrice": " ",
				"ShipperName": " ",
				"ShippedDate": " ",
				"Status": " "
			};
			var oModel = this.getView().getModel("invoice");
			oTableData = oModel.getProperty("/Invoices");
			oTableData.push(newObj);
			oModel.refresh();
			this.getView().getModel("oViewModel").setProperty("/isEditable",true);
		},
		createColumnConfig: function() {
			return [{
				label: 'ProductName',
				property: 'ProductName'
			}, {
				label: 'Quantity',
				property: 'Quantity'
			}, {
				label: 'ExtendedPrice',
				property: 'ExtendedPrice'
			}, {
				label: 'ShipperName',
				property: 'ShipperName'
			}, {
				label: 'Status',
				property: 'Status'
			}];
		},
		onExport: function() {
			var aCols, aProducts, oSettings;
			aCols = this.createColumnConfig();
			aProducts = this.getView().getModel("invoice").getProperty("/Invoices");
			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: aProducts
			};

			new Spreadsheet(oSettings)
				.build()
				.then(function() {
					MessageToast.show("Spreadsheet export has finished");
				});
		},
		handleValueChange: function(oEvnt) {
			var oFileUpId = this.byId("fileUpload");
			var domRef = oFileUpId.getFocusDomRef();
			var file = domRef.files[0];
			oFileUpId.clear();
			this._import(file);
		},
		_import: function(file) {
			if (file && window.FileReader) {
				var reader = new FileReader();
				var that = this;
				reader.onload = function(evt) {
					var data = evt.target.result;
					//var xlsx = XLSX.read(data, {type: 'binary'});
					var CHUNK_SIZE = 0x8000; // arbitrary number here, not too small, not too big
					var index = 0;
					var array = new Uint8Array(data);
					var length = array.length;
					var arr = '';
					var slice1;
					while (index < length) {
						slice1 = array.subarray(index, Math.min(index + CHUNK_SIZE, length)); // `Math.min` is not really necessary here I think
						arr += String.fromCharCode.apply(null, slice1);
						index += CHUNK_SIZE;
					}
					try {
						var xlsx = XLSX.read(btoa(arr), {
							type: 'base64'
						});
					} catch (err) {
						sap.m.MessageBox.show(err.message, {
							title: "Error",
							styleClass: "sapUiSizeCompact messageBox",
							icon: sap.m.MessageBox.Icon.ERROR,
							actions: [sap.m.MessageBox.Action.OK]
						});
						that.getView().byId("fileUploader").setValue("");
						return false;
					}

					var result = xlsx.Strings;
					result = {};
					var sheet = xlsx.SheetNames[0];
					// xlsx.Sheets[xlsx.SheetNames[0]]['!ref'] = "A1:F10";
					xlsx.SheetNames.forEach(function(sheetName) {
						var rObjArr = XLSX.utils
							.sheet_to_row_object_array(xlsx.Sheets[sheetName]);
						if (rObjArr.length > 0) {
							result[sheetName] = rObjArr;
						}
					});
					var sheetData = result[sheet];
					if (sheetData === undefined) {
						sap.m.MessageBox.show("Invalid Excel\nUse Excel template to upload", {
							title: "Error",
							styleClass: "sapUiSizeCompact messageBox",
							icon: sap.m.MessageBox.Icon.ERROR,
							actions: [sap.m.MessageBox.Action.OK]
						});
						that.getView().byId("fileUploader").setValue("");
						return false;
					}
					that._creatobjPy(sheetData);

				};
				reader.readAsArrayBuffer(file);
			}
		},
		_creatobjPy: function(data) {
			var oExcelData = [];

			var oTableData = this.getView().getModel("invoice").getProperty("/Invoices");
			var oFinalData = oTableData.concat(data);
			this.getView().getModel("invoice").setProperty("/Invoices", oFinalData);
		},
		handleIconTabBarSelect:function(oEvnt){
			// var oselectedKey=oEvnt.getParameter("selectedKey"),
			// oTable=this.getView().byId("table"),
			// aFilter=[];
			// if(oSelecetdKey === "Ok"){
			// 	var oFilter=new sap.ui.model.Filter("")
			// 	oTable.getBinding("items").filter([]);
			
			
		}
	});

});