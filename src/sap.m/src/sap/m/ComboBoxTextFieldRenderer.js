/*!
 * ${copyright}
 */
sap.ui.define([
	'./InputBaseRenderer',
	'sap/ui/core/Renderer'
],
	function(InputBaseRenderer, Renderer) {
		"use strict";

		/**
		 * ComboBoxTextFiel renderer.
		 *
		 * @namespace
		 */
		var ComboBoxTextFieldRenderer = Renderer.extend(InputBaseRenderer);
		ComboBoxTextFieldRenderer.apiVersion = 2;
		/**
		 * CSS class to be applied to the root element of the control.
		 *
		 * @readonly
		 * @const {string}
		 */
		ComboBoxTextFieldRenderer.CSS_CLASS_COMBOBOXTEXTFIELD = "sapMComboBoxTextField";

		/**
		 * Add attributes to the input element.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.m.ComboBoxTextField} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxTextFieldRenderer.writeInnerAttributes = function(oRm, oControl) {
			oRm.attr("role", "combobox");
			oRm.attr("aria-haspopup", "listbox");
			oRm.attr("aria-autocomplete", "both");
			oRm.attr("aria-expanded", "false");
			oRm.attr("autocomplete", "off");
			oRm.attr("autocorrect", "off");
			oRm.attr("autocapitalize", "off");
			oRm.attr("type", "text");
		};

		/**
		 * Retrieves the ARIA role for the control.
		 * To be overwritten by subclasses.
		 *
		 */
		ComboBoxTextFieldRenderer.getAriaRole = function() {};

		/**
		 * Add extra styles for input container.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.m.ComboBoxTextField} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxTextFieldRenderer.addOuterStyles = function(oRm, oControl) {
			oRm.style("max-width", oControl.getMaxWidth());
		};

		return ComboBoxTextFieldRenderer;
	}, true);