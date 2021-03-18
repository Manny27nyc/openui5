/*!
 * ${copyright}
 */

sap.ui.define([
	"sap/base/util/restricted/_pick",
	"sap/ui/fl/Change",
	"sap/ui/fl/Layer",
	"sap/ui/fl/registry/Settings",
	"sap/ui/fl/LayerUtils",
	"sap/ui/fl/Utils"
], function (
	_pick,
	Change,
	Layer,
	Settings,
	LayerUtils,
	Utils
) {
	"use strict";

	function isUserAuthor(oAuthor) {
		var oUShellContainer = Utils.getUshellContainer();
		var oUser = oUShellContainer && oUShellContainer.getUser();
		return !oUser || oUser.getId().toUpperCase() === oAuthor.toUpperCase();
	}

	/**
	 * Checks if the the variant can be modified due to its layer and the user's authorization.
	 * @param {sap.ui.fl.Layer} sLayer - Layer of the variant
	 * @param {string} sUserId - ID of the variants creator
	 * @returns {boolean} <code>true</code> if the variant is read only
	 *
	 * @private
	 */
	 function isLayerWritableAndUserAuthorized(sLayer, sUserId) {
		if (sLayer === Layer.USER) {
			return true;
		}

		var oSettings = Settings.getInstanceOrUndef();

		var bLayerWritable = sLayer === (oSettings.isPublicLayerAvailable() ? Layer.PUBLIC : Layer.CUSTOMER);
		var bUserAuthorized = oSettings.isKeyUser() || isUserAuthor(sUserId);

		return bLayerWritable && bUserAuthorized;
	}

	/**
	 * A variant can only be modified if the current language equals the original language.
	 * Returns <code>false</code> if the current language does not equal the original language of the variant file.
	 * Returns <code>false</code> if the original language is initial.
	 *
	 * @returns {boolean} <code>true</code> if the current logon language equals the original language of the variant file
	 *
	 * @private
	 */
	function isReadOnlyDueToOriginalLanguage(sOriginalLanguage) {
		if (!sOriginalLanguage) {
			return false;
		}

		return Utils.getCurrentLanguage() !== sOriginalLanguage;
	}

	function isOriginSystem(sSystem, sClient) {
		var oSettings = Settings.getInstanceOrUndef();
		if (!oSettings) {
			return true; // without settings the right to edit or delete a variant cannot be determined
		}
		if (!sSystem || !sClient) {
			return true;
		}

		var sCurrentSystem = oSettings.getSystem();
		var sCurrentClient = oSettings.getClient();
		return sCurrentSystem === sSystem && sClient === sCurrentClient;
	}

	/**
	 * Flexibility CompVariant class. Stores variant content and related information.
	 *
	 * @param {object} oFile - File content and admin data
	 *
	 * @class sap.ui.fl.apply._internal.flexObjects.CompVariant
	 * @extends sap.ui.fl.Change
	 * @private
	 * @ui5-restricted
	 * @since 1.86.0
	 */
	var CompVariant = Change.extend("sap.ui.fl.apply._internal.flexObjects.Variant", /** @lends sap.ui.fl.apply._internal.flexObjects.CompVariant.prototype */ {
		metadata: {
			properties: {
				favorite: {
					type: "boolean",
					defaultValue: false
				},
				executeOnSelect: {
					type: "boolean",
					defaultValue: false
				}
			},
			aggregations: {
				// TODO: change to revertData for alignment, but this will conflict with the derived Change.getRevertData as of today
				revertInfo: {
					type: "sap.ui.fl.apply._internal.flexObjects.CompVariantRevertData",
					multiple : true,
					singularName : "revertInfo",
					defaultValue: []
				}
			}
		},

		constructor: function(oFile) {
			Change.apply(this, arguments);

			if (oFile.layer === Layer.VENDOR || oFile.layer === Layer.CUSTOMER_BASE) {
				this.setFavorite(true);
			}

			if (oFile.favorite !== undefined) {
				this.setFavorite(oFile.favorite);
			}

			if (oFile.content && oFile.content.executeOnSelect) {
				this.setExecuteOnSelect(oFile.content.executeOnSelect);
			}
		}
	});

	/**
	 * Returns <code>true</code> if the current layer is the same as the layer in which the variant was created, or if the variant is from the end-user layer and was created for this user.
	 * @returns {boolean} <code>true</code> if the variant file is read only
	 *
	 * @public
	 */
	CompVariant.prototype.isReadOnly = function () {
		return !isOriginSystem(this.getSourceSystem(), this.getSourceClient())
			|| !isLayerWritableAndUserAuthorized(this.getLayer(), this.getOwnerId());
	};

	/**
	 * Returns <code>true</code> if the variant itself is read only or the user's language does not match
	 * the original language of the variant.
	 * @returns {boolean} <code>true</code> if the label name is read only
	 *
	 * @public
	 */
	CompVariant.prototype.isLabelReadOnly = function () {
		return this.isReadOnly() || isReadOnlyDueToOriginalLanguage(this.getOriginalLanguage());
	};

	CompVariant.createInitialFileContent = function (oPropertyBag) {
		var oNewFile = Change.createInitialFileContent(oPropertyBag);

		// TODO: clean up the createInitialFileContent within the Change class plus create a base class FlexObject
		return _pick(oNewFile, [
			"changeType",
			"namespace",
			"service",
			"content",
			"reference",
			"fileName",
			"fileType",
			"packageName",
			"layer",
			"favorite",
			"executeOnSelect",
			"selector",
			"texts",
			"support"
		]);
	};

	return CompVariant;
});
