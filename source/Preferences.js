enyo.kind({
	name: "S4L.Preferences",
	kind: enyo.VFlexBox,
	
	events: {
		onDone: "",
		onAccountDeleted: ""
	},
	
	published: {
		preferences: {
			username: "",
			password: "",
			lastFetch: "",
			autoMarkRead: "",
			autoFetchHtml: "",
			autoFetchText: "",
			saveWhenOpened: "",
			keepReadData: "",
			refreshFreq: "",
			bgRefreshFreq: "",
			bgEnabled: "",
			articleCounts: "",
			themeName: ""
		}
	},
	
	components: [{
		kind: "PageHeader",
		pack: "center",
		content: "Saved4Later - Preferences"
	},{
		kind: "Scroller",
		name: "scroller",
		flex: 1, 
		components: [{
			kind: "VFlexBox",
			className: "box-center",
			components: [{
				kind: "RowGroup",
				caption: "Fetch Settings",
				components: [{ 
					kind: "LabeledContainer", 
					caption: "Automatically fetch web view",
					components: [{
						kind: "ToggleButton",
						name: "uiAutoFetchHtml",
						state: true/*,
						onChange: "callHandler"*/
					}]
				},{
					kind: "LabeledContainer", 
					caption: "Automatically fetch text view",
					components: [{
						kind: "ToggleButton",
						name: "uiAutoFetchText",
						state: true/*,
						onChange: "callHandler"*/
					}]
				},{
					kind: "LabeledContainer", 
					caption: "Save web view when opened",
					components: [{
						kind: "ToggleButton",
						name: "uiSaveWhenOpened",
						state: true/*,
						onChange: "callHandler"*/
					}]
				},{
					name: "uiRefreshFreq",
					kind: "ListSelector", 
					label: "Refresh interval",
					items: [
						{caption: "10 mins", value: 10},
						{caption: "30 mins", value: 30},
						{caption: "60 mins", value: 60}
					]/*,
					onChange: "callHandler"*/
				}]
			},{
				kind: "RowGroup",
				caption: "Read Settings",
				components: [{
					kind: "LabeledContainer", 
					caption: "Automatically mark as read",
					components: [{
						kind: "ToggleButton",
						name: "uiAutoMarkRead",
						state: true/*,
						onChange: "callHandler"*/
					}]
				},{
					kind: "LabeledContainer", 
					caption: "Keep saved page when read",
					components: [{
						kind: "ToggleButton",
						name: "uiKeepReadData",
						state: true/*,
						onChange: "callHandler"*/
					}]
				}]
			},{
				kind: "RowGroup",
				caption: "Interface Settings",
				components: [{
					kind: "LabeledContainer", 
					caption: "Article counts",
					components: [{
						kind: "ToggleButton",
						name: "uiArticleCounts",
						state: true/*,
						onChange: "callHandler"*/
					}]
				},{
					name: "uiThemeName",
					kind: "ListSelector", 
					label: "Theme",
					items: [
						{caption: "Default", value: "Default"}
					]/*,
					onChange: "callHandler"*/
				}]
			},{
				kind: "RowGroup",
				caption: "Background Settings",
				components: [{
					kind: "LabeledContainer", 
					caption: "Background fetching",
					components: [{
						kind: "ToggleButton",
						name: "uiBgEnabled",
						state: true/*,
						onChange: "callHandler"*/
					}]
				},{
					name: "uiBgRefreshFreq",
					kind: "ListSelector", 
					label: "Background update interval",
					items: [
						{caption: "1 hour", value: 60},
						{caption: "3 hours", value: 180},
						{caption: "12 hours", value: 720}
					]/*,
					onChange: "callHandler"*/
				}]
			},{
				className: "enyo-paragraph preferences-info-text",
				content: "Logged in as: xxxx",
				name: "uiUsernameText"
			},{
				kind: "ActivityButton", 
				caption: "Refresh All Account Data",
				//onclick: "refreshDataClick"
			},{
				kind: "ActivityButton", 
				caption: "Delete Account",
				onclick: "deleteAccountClick",
				className: "enyo-button-negative"
			},{
				className: "enyo-paragraph"
			}]
		}]
	},{
		kind: "Toolbar", 
		components: [{ 
			caption: "Done",
			kind: "Button",
			className:"enyo-button-affirmative",
			width: "300px",
			onclick: "doneClicked"
		}]
	}],


	/*************************************************************************/


	log: function(txt) {
		//enyo.log("Preferences:"+txt);
	},


	/*************************************************************************/


	initializePreferences: function() {
		this.log("createDefaultPreferences");
		this.preferences.username = "";
		this.preferences.password = "";
		this.preferences.lastFetch = 0;
		this.preferences.autoMarkRead = false;
		this.preferences.autoFetchHtml = false;
		this.preferences.autoFetchText = false;
		this.preferences.saveWhenOpened = false;
		this.preferences.keepReadData = false;
		this.preferences.refreshFreq = 10;
		this.preferences.bgRefreshFreq = 120;
		this.preferences.bgEnabled = false;
		this.preferences.articleCounts = true;
		this.preferences.themeName = "Default";
		this.savePreferences();
	},
	
	
	fetchPreferences: function() {
		this.log("fetchPreferences");
		if (!enyo.getCookie("prefsInit")) {
			this.log("-  Preferences cookie doesn't exist, creating..");
			this.initializePreferences();
		} else {
			this.loadPreferences();
		}
		return this.preferences;
	},
	
	
	savePreferences: function() {
		this.log("savePreferences");
		var cookieData = enyo.json.stringify(this.preferences);
		enyo.setCookie("prefs", cookieData);
		enyo.setCookie("prefsInit", 'true');
		this.log("-  Preferences saved to cookie: " + cookieData);
	},
	
	
	loadPreferences: function() {
		this.log("loadPreferences");
		var cookieData = enyo.getCookie('prefs');
		this.preferences = enyo.json.parse(cookieData);
		this.log("-  Preferences loaded from cookie: " + cookieData);
	},
	
	
	setCredentials: function(aUsername, aPassword) {
		this.log("setCredentials, user: " + aUsername + ", pass: " + aPassword);
		this.preferences.username = aUsername;
		this.preferences.password = aPassword;
		this.log("-  Credentials set with username: " + this.preferences.username);
		this.savePreferences();
		// TODO: Fix this
		//this.$.uiUsernameText.setCaption("Logged in as: " + this.preferences.username);
	},
	
	
	setLastFetch: function(aFetchTime) {
		this.log("setLastFetch, " + aFetchTime);
		this.preferences.lastFetch = aFetchTime;
		this.savePreferences();
	},
	
	
	updateUI: function() {
		this.log("updateUI");
		this.$.uiAutoMarkRead.setState(this.preferences.autoMarkRead);
		this.$.uiAutoFetchHtml.setState(this.preferences.autoFetchHtml);
		this.$.uiAutoFetchText.setState(this.preferences.autoFetchText);
		this.$.uiSaveWhenOpened.setState(this.preferences.saveWhenOpened);
		this.$.uiKeepReadData.setState(this.preferences.keepReadData);
		this.$.uiRefreshFreq.setValue(this.preferences.refreshFreq);
		this.$.uiBgRefreshFreq.setValue(this.preferences.bgRefreshFreq);
		this.$.uiBgEnabled.setState(this.preferences.bgEnabled);
		this.$.uiArticleCounts.setState(this.preferences.articleCounts);
		this.$.uiThemeName.setValue(this.preferences.themeName);
	},
	
	
	settingChanged: function(inSender) {
		this.log("settingChanged, caller: " + inSender.name);
	},
	
	
	showingChanged: function() {
		this.log("showingChanged");
		this.updateUI();
		this.$.scroller.scrollTo(0,0);
	},
	
	
	deleteAccountClick: function() {
		this.log("deleteAccountClick");
		// TODO: Show a prompt first?
		this.initializePreferences();
		this.log("-  Blank preferences saved");
		this.doAccountDeleted();
	},
	
	
	doneClicked: function() {
		this.log("doneClicked");
		this.savePreferences();
		this.doDone();
	}
});