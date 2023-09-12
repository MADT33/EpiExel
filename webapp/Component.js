sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"raizenepi/model/models",
    "raizenepi/utils/FioriComponentHelper"
], function(UIComponent, Device, models, FioriComponent) {
	"use strict";

	return UIComponent.extend("raizenepi.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},
        createContent: function () {
            //sets component
            FioriComponent.setComponent(this);
            // create root view
            var view = sap.ui.view({
                id: this.createId("App"),
                viewName: "raizenepi.view.App",
                type: "XML",
                viewData: {
                    component: this
                }
            });

            return view;
        }
	});
});