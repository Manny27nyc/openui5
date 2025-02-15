/* global QUnit */

sap.ui.define([
	"sap/ui/fl/write/api/Version",
	"sap/ui/fl/initial/_internal/connectors/Utils",
	"sap/ui/fl/initial/_internal/connectors/KeyUserConnector",
	"sap/ui/thirdparty/sinon-4"
], function(
	Version,
	Utils,
	KeyUserConnector,
	sinon
) {
	"use strict";

	var sandbox = sinon.createSandbox();

	QUnit.module("Connector", {
		afterEach: function() {
			sandbox.restore();
		}
	}, function() {
		QUnit.test("loadFlexData trigger the correct request to back end then:" +
			"- store the token and settings values" +
			"- return cacheKey value" +
			"- merges the compVariants in the changes", function (assert) {
			var mPropertyBag = {
				url: "/flexKeyuser",
				reference: "reference",
				version: Version.Number.Draft
			};
			var mParameter = {
				version: Version.Number.Draft,
				"sap-language": "en"
			};
			var sExpectedUrl = "/flexKeyuser/flex/keyuser/v1/data/reference?version=" + Version.Number.Draft;
			var oStubGetUrlWithQueryParameters = sandbox.stub(Utils, "getUrl").returns(sExpectedUrl);
			var oStubSendRequest = sandbox.stub(Utils, "sendRequest").resolves({
				response: {
					changes: [1],
					compVariants: [2],
					settings: {
						isKeyUser: true,
						isVariantSharingEnabled: true
					}
				},
				xsrfToken: "newToken",
				status: "200",
				etag: "abc123"
			});
			return KeyUserConnector.loadFlexData(mPropertyBag).then(function (oFlexData) {
				assert.ok(oStubGetUrlWithQueryParameters.calledOnce, "getUrl is called once");
				assert.equal(oStubGetUrlWithQueryParameters.getCall(0).args[0], "/flex/keyuser/v1/data/", "with correct route path");
				assert.deepEqual(oStubGetUrlWithQueryParameters.getCall(0).args[1], mPropertyBag, "with correct property bag");
				assert.deepEqual(oStubGetUrlWithQueryParameters.getCall(0).args[2], mParameter, "with correct parameters input");
				assert.ok(oStubSendRequest.calledOnce, "sendRequest is called once");
				assert.equal(oStubSendRequest.getCall(0).args[0], sExpectedUrl, "with correct url");
				assert.equal(oStubSendRequest.getCall(0).args[1], "GET", "with correct method");
				assert.equal(oStubSendRequest.getCall(0).args[2].xsrfToken, undefined, "with correct token");
				assert.equal(KeyUserConnector.xsrfToken, "newToken", "new token is set");
				assert.deepEqual(KeyUserConnector.settings, { isKeyUser: true, isVariantSharingEnabled: true}, "new settings is stored");
				assert.equal(oFlexData.changes.length, 2, "two entries are in the change section");
				assert.equal(oFlexData.changes[0], 1, "the change entry is contained");
				assert.equal(oFlexData.changes[1], 2, "the compVariant entry is contained");
				assert.equal(oFlexData.cacheKey, "abc123", "the cacheKey value is returned");
			});
		});

		QUnit.test("loadFlexData requests the 'Original App'", function (assert) {
			var mPropertyBag = {
				url: "/flexKeyuser",
				reference: "reference",
				version: Version.Number.Original
			};

			var sExpectedUrl = "/flexKeyuser/flex/keyuser/v1/data/reference?version=" + Version.Number.Original;
			sandbox.stub(Utils, "getUrl").returns(sExpectedUrl);
			var oStubSendRequest = sandbox.stub(Utils, "sendRequest").resolves({
				response: {
					changes: []
				},
				xsrfToken: "newToken",
				status: "200",
				etag: "abc123"
			});
			return KeyUserConnector.loadFlexData(mPropertyBag).then(function () {
				assert.ok(oStubSendRequest.calledOnce, "sendRequest is called once");
				assert.equal(oStubSendRequest.getCall(0).args[0], sExpectedUrl, "with correct url");
				assert.equal(oStubSendRequest.getCall(0).args[1], "GET", "with correct method");
			});
		});
	});

	QUnit.done(function () {
		document.getElementById("qunit-fixture").style.display = "none";
	});
});