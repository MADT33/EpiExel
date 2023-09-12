sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"raizenepi/model/AppJsonModel",
	"raizenepi/utils/jszip",
	"raizenepi/utils/xlsx",
	"sap/m/MessageBox",
	"raizenepi/services/Services",
	"sap/ui/unified/DateTypeRange",
	"sap/m/MessageToast"
	
], function(Controller, AppJsonModel, jszip, xlsx, MessageBox, Services, DateTypeRange, MessageToast) {
	"use strict";

	return Controller.extend("raizenepi.controller.MainView", {

		onInit: function() {
			AppJsonModel.initializeModel()

			let that = this;
		},

		onBack: function() {
			history.go(-1);
		},

		onGuardar: function() {
			var array = this.byId("DP10").getValue();
			

			var Periodo = {
				Periodo: array
			}

			if (array === "") {

				MessageBox.error("Antes de Guardar debe Ingresar una Fecha");

			} else {
				this._oDialog = new sap.m.BusyDialog({
					text: 'Cargando datos...'
				});

				this._oDialog.open();

				const epiList = AppJsonModel.getProperty("/epiList")
				epiList.push(Periodo);
                
				Services.postData({
					Value: "C",
					EPISet: epiList
				}).then(aData => {
					sap.m.MessageToast.show(this.geti18nText("okUpload"))
				//	AppJsonModel.setProperty("/AjusteBSList", [])
					this._oDialog.close();
					 AppJsonModel.initializeModel();
				}).catch(oErr => {
					MessageBox.error(this.geti18nText("errorUpload"))
					this._oDialog.close();
				})
			}
		},

		fnReplaceAjusteBS: function(oTable) {

			for (var i in oTable) {

				var columns = {};
				// columns['Periodo'] = oTable[i]['Periodo Calendario'].toString();
				columns['Material'] = oTable[i]['Material'];
				columns['Centro'] = oTable[i]["Centro"];
				columns['Precio_Contable_2'] =  oTable[i]['Precio Contable 2'];
				columns['Precio_Fiscal_2'] =  oTable[i]['Precio Fiscal 2'];
				columns['Precio_Fis_2'] =  oTable[i]['Precio Fiscal 2'];
				columns['Precio_Val_Fiscal_3'] =  oTable[i]['Precio Val fiscal 3'];
				columns['Precio_Plan_1'] =  oTable[i]['Precio plan 1'];
				columns['Fecha_PrecioPlan_1'] =  oTable[i]['Fecha precio plan 1 '];
				columns['Precio_Plan_2'] =  oTable[i]['Precio plan 2'];
				columns['Fecha_PrecioPlan_2'] =  oTable[i]['Fecha precio plan 2'];
				oTable[i] = columns;
			}
			return oTable;
		},

		fileReader1: function(oFile) {
			var that = this;
			var excelajusteBS = {};

			var reader = new FileReader();

			reader.onload = function(oEvent) {
				var data = oEvent.target.result;

				var workbook = XLSX.read(data, {
					type: 'binary'
				});

				workbook.SheetNames.forEach(function(sheetName) {

					switch (sheetName) {
						case workbook.SheetNames[0]:
							excelajusteBS = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
							break;
						default:
							// code block
					}
				});

				if (excelajusteBS) {

					var excelajusteBSRe = that.fnReplaceAjusteBS(excelajusteBS);

					let epiList = AppJsonModel.getProperty("/epiList")
					epiList = epiList.concat(excelajusteBSRe)
					AppJsonModel.setProperty("/epiList", epiList)
					oLabel.setText(that.geti18nText("registros", [epiList.length]));
				}

				reader.onerror = function(ex) {
					console.log(ex);
				};
			};

			reader.readAsBinaryString(oFile);
		},

		onUploadFile: function(oEvent) {
			this.fileReader1(oEvent.getParameter("files") && oEvent.getParameter("files")[0]);
		},

		geti18nText: function(sText, aVariables = []) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sText, aVariables);
		},

	});

});