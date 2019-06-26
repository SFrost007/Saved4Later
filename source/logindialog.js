enyo.kind({
	name: "S4L.LoginDialog",
	kind: "ModalDialog",
	caption: "Login",
	
	events: {
		onSuccess: ""	// inUsername, inPassword
	},
	
	components: [{
		name: "auth",
		kind: "WebService",
		url: "http://readitlaterlist.com/v2/auth",
		onSuccess: "authSuccess",
		onFailure: "authFailure"
	},{
		kind: "RowGroup",
		components: [{
			kind: "Input",
			hint: "Username",
			name: "uiUsername",
			spellcheck: false,
			autocorrect: false,
			autoWordComplete: false,
			autoCapitalize: "lowercase"
		}]
	},{
		kind: "RowGroup",
		components: [{
			kind: "PasswordInput",
			hint: "Password",
			name: "uiPassword"
		}]
	},{
		layoutKind: "HFlexLayout",
		components: [{
			kind: "Button",
			name: "uiCancelButton",
			caption: "Cancel",
			flex: 1,
			onclick: "cancelClicked"
		},{
			kind: "ActivityButton",
			name: "uiLoginButton",
			caption: "Login",
			flex: 1,
			onclick: "loginClicked",
			className:"enyo-button-affirmative"
		}]
	}],


	/*************************************************************************/


	log: function(txt) {
		//enyo.log("LoginDialog:"+txt);
	},
	
	
	create: function() {
		this.log("create");
		this.inherited(arguments);
		this.apiKey = "265ddHa3T16bOE2d0lA4f91Dv3gPT377";
	},
	

	rendered: function() {
		this.log("rendered");
	},


	/*************************************************************************/


	cancelClicked: function(inSender) {
		this.log("cancelClicked");
		this.$.auth.cancel();
		close();
	},
	
	
	loginClicked: function(inSender) {
		this.log("loginClicked");
		var user = enyo.string.trim(this.$.uiUsername.getValue());
		var pass = enyo.string.trim(this.$.uiPassword.getValue());
		if (user.length === 0) {
			this.$.uiUsername.inputClassName = "error";
			this.$.uiUsername.render();
		}
		if (pass.length === 0) {
			this.$.uiPassword.inputClassName = "error";
			this.$.uiPassword.render();
		}
		if (user.length === 0 || pass.length === 0) {
			return;
		}
		this.log("Sending auth request to server");
		var params = {
			apikey: this.apiKey,
			username: this.$.uiUsername.getValue(),
			password: this.$.uiPassword.getValue()
		};
		this.log("-  Params: " + enyo.objectToQuery(params));
		this.log("-  Sending to url: " + this.$.auth.getUrl());
		this.$.auth.call(params);
		this.setRequestActive(true);
	},
	
	
	openAtCenter: function() {
		this.log("openAtCenter");
		this.inherited(arguments);
		this.$.uiUsername.setValue("");
		this.$.uiPassword.setValue("");
		this.setRequestActive(false);
	},
	
	
	setRequestActive: function(inActive) {
		this.$.uiLoginButton.setActive(inActive);
		this.$.uiLoginButton.setDisabled(inActive);
		//this.$.uiCancelButton.setDisabled(inActive);
		this.$.uiUsername.setDisabled(inActive);
		this.$.uiPassword.setDisabled(inActive);
	},
	
	
	authSuccess: function(inSender, inResponse, inRequest) {
		this.log("authSuccess");
		this.log("-  status: " + inRequest.xhr.status);
		this.log("-  response: " + inRequest.xhr.responseText);
		this.doSuccess(this.$.uiUsername.getValue(), this.$.uiPassword.getValue());
		this.close();
	},
	
	
	authFailure: function(inSender, inResponse, inRequest) {
		this.log("authFailure");
		this.log("-  status: " + inRequest.xhr.status);
		this.log("-  response: " + inRequest.xhr.responseText);
		// TODO: Set warning signs
		// TODO: Handle rate limit (403) and Maintenance (503) differently
		this.setRequestActive(false);
	}
});