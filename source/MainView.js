enyo.kind({
	name: "S4L.MainView",
	kind: enyo.SlidingPane,
	
	events: {
		onRefreshClicked: ""
	},
	
	published: {
	},
	
	components: [{
		kind: "S4L.StoryList",
		name: "uiStoryList",
		width: "320px",
		onStorySelected: "storySelected",
		onRefreshClicked: "doRefreshClicked"
	},{
		kind: "S4L.StoryView",
		name: "uiStoryView",
		flex: 1
	}],


	/*************************************************************************/


	log: function(txt) {
		//enyo.log("MainView:"+txt);
	},
	
	
	create: function() {
		this.log("create");
		this.inherited(arguments);
	},
	
	
	/*************************************************************************/
	
	
	updateList: function() {
		this.log("updateList");
		this.$.uiStoryList.updateUi();
	},
	
	
	storySelected: function(inSender, inStoryData) {
		this.log("storySelected");
		var url = inStoryData.url;
		this.log("-  Setting webview URL to " + url);
		this.$.uiStoryView.setUrl(url);
	}
});