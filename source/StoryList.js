enyo.kind({
	kind: enyo.SlidingView,
	name: "S4L.StoryList",
	
	events: {
		onStorySelected: "",
		onRefreshClicked: "",
		onAddItemClicked: ""
	},
	
	published: {
	},
	
	components: [{
		kind: enyo.TabGroup,
		onChange: "updateUi",
		name: "uiListSelect",
		components: [
			{value: 0, caption: "Unread (0)", name: "uiUnreadHead" },
			{value: 1, caption: "Read (0)", name: "uiReadHead" }
		]
	},{
		kind: enyo.SearchInput,
		className:"enyo-box-input",
		hint:"Search",
		changeOnInput: true
	},{
		kind: "Scroller",
		flex: 1,
		components: [{
			name: "uiList",
			kind: enyo.VirtualRepeater,
			tapHighlight: true,
			onSetupRow: "getListItem",
			components: [{
				kind: enyo.Item,
				layoutKind: enyo.VFlexLayout,
				onclick: "listItemClick",
				/*kind: "SwipeableItem",
				confirmCaption: "Delete item",
				onConfirm: "deleteStory",
				cancelCaption: "Cancel",
				onCancel: "cancelDelete",*/
				components: [{
					name: "title"
				},{
					style: "font-size: 14px; text-align: left; color: #8A8A8A; margin-top: 8px;",
					components: [{
						kind: "HFlexBox", components: [
							{kind: "Image", name: "icon", style: "width: 16px; height: 16px; margin-right: 8px; padding-top: 2px;"},
							{name: "site"}
						]
					}]
				}]
			}]
		}]
	},{
		kind: "Toolbar", components: [{
			kind: enyo.ToolButton,
			icon: "images/menu-icon-delete.png"
		},{
			kind: enyo.ToolButton,
			icon: "images/menu-icon-refresh.png",
			name: "uiRefreshButton",
			onclick: "refreshClick"
		}]
	}],


	/*************************************************************************/


	log: function(txt) {
		//enyo.log("StoryList:"+txt);
	},
	
	create: function() {
		this.log("StoryList:create");
		this.inherited(arguments);
		this.storyItems = [];
		this.log("*** CREATED storyItems");
		this.myDb = openDatabase("Saved4Later", "1.0", "Saved4Later stories database", 1048576);
		this.updateData();
	},
	
	rendered: function() {
		this.inherited(arguments);
		this.$.uiList.render();
	},
	
	
	/*************************************************************************/
	
	
	// TODO: Find a way to animate this
	refreshClick: function() {
		this.log("refreshClick");
		this.doRefreshClicked();
	},
	
	
	addItemClick: function() {
		this.log("addItemClick");
		this.doAddItemClicked();
	},
	
	
	updateData: function() {
		this.log("updateData");
		var val = this.$.uiListSelect.value;
		this.log("-  List switch state: "+val);
		var self = this;
		this.myDb.transaction(
			function(tx) {
				tx.executeSql(
					"SELECT * FROM tbl_stories WHERE state=? ORDER BY time_added DESC", 
					[val],
					function(tx, result) {
						self.log("-  DB fetch succeeded");
						for (var i=0; i<result.rows.length; i++) {
							var row = result.rows.item(i);
							self.storyItems.push(row);
							self.log('item: ' + enyo.json.stringify(row));
						}
						self.$.uiList.render();
					},
					function(tx, error) {
						self.log("-  DB fetch failed");
					}
				);
			}
		);
	},
	
	
	updateUi: function() {
		this.log("updateUi");
		this.updateData();
		/*var numRead = this.readItems.length;
		var numUnread = this.unreadItems.length;
		this.$.uiReadHead.setCaption("Read ("+numRead+")");
		this.$.uiUnreadHead.setCaption("Unread ("+numUnread+")");*/
		//TODO: Fetch the read counts as SQL queries
		this.$.uiList.render();
	},
	
	
	listItemClick: function(inSender, inEvent) {
		this.log("listItemClick " + inEvent.rowIndex);
		var storyData = this.storyItems[inEvent.rowIndex];
		this.log("-  "+enyo.json.stringify(storyData));
		this.doStorySelected(storyData);
	},
	
	
	getListItem: function(inSender, inIndex) {
		this.log("getListItem " + inIndex);
		var r = this.storyItems[inIndex];
		if (r) {
			this.log("-  Adding list item with title: " + r.title);
			this.$.title.setContent(r.title);
			
			var endOfSchema = r.url.indexOf('//') + 2;
			var firstSlash = r.url.indexOf('/',endOfSchema);
			var domain = r.url.substr(endOfSchema,firstSlash - endOfSchema);
			
			this.$.site.setContent(domain);
			this.$.icon.setSrc(r.url.substr(0,firstSlash)+"/favicon.ico");
			return true;
		}	
	}
});
