enyo.kind({
	kind: enyo.SlidingView,
	name: "S4L.StoryView",
	
	events: {
	},
	
	published: {
		url: ""
	},
					
	components: [{
		kind: enyo.PageHeader,
		components: [
			{ content: "Saved4Later", name: "uiPageTitle"}
		]
	},{
		kind: enyo.ProgressBar,
		name: "uiProgressBar",
		style: "margin: -2px 0px;"
	},{
		kind: enyo.WebView,
		name: "uiWebView", 
		//url: "file:///placeholder.htm",
		flex: 1,
		onPageTitleChanged: "pageTitleChanged",
		onLoadProgress: "loadProgress",
		onLoadStarted: "loadStarted",
		onLoadStopped: "loadStopped",
		onLoadComplete: "loadComplete"
	},{
		kind: enyo.Toolbar,
		components: [
			{kind: enyo.GrabButton },
			{
				kind: enyo.ToggleButton,
				state: true,
				onLabel: "HTML",
				offLabel: "Text",
				onChange: "textOnlyClicked",
				name: "uiTextOnly"
			},{
				kind: enyo.ToolButton,
				icon: "images/icon-markread.png"
			},{
				kind: enyo.ToolButton,
				icon: "images/menu-icon-refresh.png"
			},{
				kind: enyo.ToolButton,
				icon: "images/share.png",
				onclick: "showShareMenu",
				name: "uiShareButton"
			}
		]
	},{
		kind: enyo.Menu, 
		name: "uiShareMenu", 
		components: [
			{caption: "Open new card", onclick: "openCardClicked"},
			{caption: "Share", onclick: "shareClicked"},
			{caption: "Save", onclick: "saveClicked"}
		]
	}],


	/*************************************************************************/


	log: function(txt) {
		//enyo.log("StoryView:"+txt);
	},
	
	
	create: function() {
		this.log("create");
		this.inherited(arguments);
		this.$.uiProgressBar.hide();
	},
	

	/*************************************************************************/


	pageTitleChanged: function(inSender, inValue) {
		this.log("pageTitleChanged "+inValue);
		this.$.uiPageTitle.setContent(inValue);
	},

	loadProgress: function(inSender, inValue) {
		this.log("loadProgress"+inValue);
		this.$.uiProgressBar.setPosition(inValue);
	},

	loadStarted: function(inSender, inValue) {
		this.log("loadStarted");
		this.$.uiProgressBar.setPosition(0);
		this.$.uiProgressBar.show();
	},

	loadStopped: function(inSender, inValue) {
		this.log("loadStopped"+inValue);
		this.$.uiProgressBar.setPosition(100);
		this.$.uiProgressBar.hide();
	},

	loadCompleted: function(inSender, inValue) {
		this.log("loadCompleted"+inValue);
		this.$.uiProgressBar.setPosition(100);
		this.$.uiProgressBar.hide();
	},
	
	setUrl: function(inUrl) {
		this.log("setUrl " + inUrl);
		this.url = inUrl;
		this.$.uiWebView.setUrl("");
		this.textOnlyClicked();
	},
	
	showShareMenu: function() {
		this.$.uiShareMenu.openAtControl(this.$.uiShareButton);
	},
	
	textOnlyClicked: function(inSender) {
		this.log("textOnlyClicked");
		if (this.$.uiTextOnly.state) {
			this.log("-  HTML mode");
			this.$.uiWebView.setUrl(this.url);
		} else {
			this.log("-  Text only mode");
			var url = "https://text.readitlaterlist.com/v2/text?images=1&url=";
			url += this.url;
			this.$.uiWebView.setUrl(url);
		}
	}
});