enyo.kind({
	name: "Saved4Later",
	kind: enyo.VFlexBox,
	components: [{
		name: "pane",
		kind: "Pane",
		flex: 1,
		components: [{
			name: "mainview",
			kind: "S4L.MainView",
			onRefreshClicked: "fetchUpdates"
		},{
			name: "preferences",
			kind: "S4L.Preferences",
			onDone: "preferencesDone",
			onAccountDeleted: "accountDeleted"
		}]
	},{
		kind: "AppMenu",
		components: [
			{ caption: "Preferences", onclick: "showPreferences" },
			{ caption: "About", onclick: "showAbout" }
		]
	},{
		name: "fetch",
		kind: "WebService",
		url: "http://readitlaterlist.com/v2/get",
		//url: "http://www.orangeninja.com/s4ltest.json",
		onSuccess: "fetchSuccess",
		onFailure: "fetchFailure"
	},{
		name: "loginDialog",
		kind: "S4L.LoginDialog",
		onSuccess: "authSuccess"
	}],
	
	
	/*************************************************************************/
	
	
	log: function(txt) {
		//enyo.log("Saved4Later:"+txt);
	},
	
	
	create: function() {
		this.log("create");
		this.inherited(arguments);
		window.apikey = "265ddHa3T16bOE2d0lA4f91Dv3gPT377";
		this.initDatabase();
	},
	
	
	rendered: function() {
		this.log("rendered");
		this.inherited(arguments);
		this.log("-  Fetching preferences");
		var prefs = this.$.preferences.fetchPreferences();
		this.log("-  Preference values: " + enyo.json.stringify(prefs));
		if (prefs.username == "") {
			this.log("-  No username set in preferences, opening prompt");
			this.showLoginDialog();
		} else {
			this.fetchUpdates(); //TODO: Re-enable
		}
	},
	
	
	/*************************************************************************/
	
	
	runDbQuery: function(inSql, inVars, inSuccess, inFailure) {
		db.transaction(
			function(tx) {
				tx.executeSql(inSql, inVars, inSuccess, inFailure);
			}
		);
	},
	
	
	initDatabase: function() {
		this.log("initDatabase");
		window.db = openDatabase("Saved4Later", "1.0", "Saved4Later stories database", 1048576);
		if (!db) {
			this.log("-  Failed to get database");
			return;
		}
		this.log("-  openDatabase succeeded");
		var self = this;
		this.runDbQuery(
			"CREATE TABLE IF NOT EXISTS 'tbl_stories' (item_id INTEGER PRIMARY KEY, title TEXT, url TEXT, time_updated INTEGER, time_added INTEGER, state INTEGER)",
			[],
			function(tx, result) {
				self.log("-  Create table call succeeded");
			},
			function(tx, error) {
				self.log("-  Create table call failed");
			}
		);
	},
	
	
	showPreferences: function() {
		this.log("showPreferences");
		this.$.pane.selectViewByName("preferences");
	},
	
	
	showAbout: function() {
		this.log("showAbout");
	},
	
	
	showLoginDialog: function() {
		this.log("showLoginDialog");
		this.$.loginDialog.openAtCenter();
	},
	
	
	preferencesDone: function() {
		this.log("preferencesDone");
		this.$.pane.back();
		// TODO: Handle any changes in prefs
	},
	
	
	accountDeleted: function() {
		this.log("accountDeleted");
		this.$.pane.back();
		this.showLoginDialog();
		var self = this;
		this.runDbQuery(
			"DELETE FROM 'tbl_stories'",
			[],
			function(tx, result) {
				self.log("-  Delete call succeeded");
				self.$.mainview.updateList();
			},
			function(tx, error) {
				self.log("-  Delete call failed");
			}
		);
	},
	
	
	fetchUpdates: function() {
		// TODO: Check limits
		this.log("fetchUpdates");
		var prefs = this.$.preferences.getPreferences();
		var params = {
			apikey: window.apikey,
			username: prefs.username,
			password: prefs.password,
			format: "json",
			since: prefs.lastFetch
		};
		this.log("-  Params: " + enyo.objectToQuery(params));
		this.log("-  Sending to url: " + this.$.fetch.getUrl());
		this.$.fetch.call(params);
		// TODO: Show spinner?
	},
	
	
	fetchSuccess: function(inSender, inResponse, inRequest) {
		this.log("fetchSuccess");
		this.log("-  status: " + inRequest.xhr.status);
		this.log("-  response: " + inRequest.xhr.responseText);
		// TODO: Parse items and add to database
		//this.$.mainview.tmp_setData(inResponse.list);
		//var sqlBatch = [];
		//var sql = "INSERT INTO tbl_stories (item_id, title, url, time_updated, time_added, state) VALUES(?,?,?,?,?,?)";
		var self = this;
		for (i in inResponse.list) {
			var item = inResponse.list[i];
			this.runDbQuery(
				"INSERT INTO tbl_stories (item_id, title, url, time_updated, time_added, state) VALUES(?,?,?,?,?,?)",
				[
					item.item_id, 
					item.title, 
					item.url, 
					item.time_updated, 
					item.time_added,
					item.state
				],
				function(tx, result) {
					self.log("-  Row inserted successfully");
				},
				function(tx, error) {
					self.log("-  Row insert failed");
				}
			);
			//this.log("Running SQL: " + sql);
			//this.myDb.runQuery(sql);
			//sqlBatch.push(sql);
		}
		//this.myDb.runBatch(sqlBatch);
		this.$.mainview.updateList();
		// TODO: Parse and save header limits
		this.$.preferences.setLastFetch(inResponse.since);
	},
	
	
	fetchFailure: function(inSender, inResponse, inRequest) {
		this.log("fetchFailure");
		this.log("-  status: " + inRequest.xhr.status);
		this.log("-  response: " + inRequest.xhr.responseText);
		// TODO: Parse and save header limits
	},
	
	
	authSuccess: function(inSender, inUsername, inPassword) {
		this.log("authSuccess: user " + inUsername);
		this.$.preferences.setCredentials(inUsername, inPassword);
		this.fetchUpdates(); //TODO: Re-enable
	},
	
	
	openAppMenuHandler: function() {
		this.log("openAppMenuHandler");
		this.$.appMenu.open();
	},
	
	
	closeAppMenuHandler: function() {
		this.log("closeAppMenuHandler");
		this.$.appMenu.close();
	}
});
