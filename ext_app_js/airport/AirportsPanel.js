/*global Ext: false, console: false, FGx: false */

Ext.define("FGx.airport.AirportsPanel", {

extend: "Ext.Panel",
				   
txt_width:60,

action_new_tab: function(){
	if(!this.actionNewTab){
		this.actionNewTab = Ext.create("Ext.Button", {
			text: "New Tab", 
			iconCls: "icoMapGo",
			disabled: true,
			scope: this,
			handler: function(){
				var r = this.get_airports_grid().getSelectionModel().getSelection().data;	
				//console.log("OPEN", r);
				//this.fireEvent("OPEN_AIRPORT", r);
				r.lat = r.apt_center_lat84;
				r.lon = r.apt_center_lon84;
				r.iconCls = "icoAirport";
				r.title = r.apt_ident;
				r.closable = true;
				VP.open_map(r);
			}
		});
	
	}
	return this.actionNewTab;
	
},

//===========================================================
//== Grid
get_airports_grid: function(){
	if(!this.xAirportsGrid){
		this.xAirportsGrid = Ext.create("Ext.grid.GridPanel", {
			region: "center",
			frame: false, plain: true, border: false,
			hideHeader: true,
			autoScroll: true,
			autoWidth: true,
			enableHdMenu: false,
			viewConfig: {
				emptyText: 'No airports in view', 
				deferEmptyText: false,
				forceFit: true
			}, 
			
			stripeRows: true,
			store: this.get_airports_store(),
			loadMask: true,
			tbar: [
				this.action_new_tab()
			],
			columns: [ 
				{header: 'Airport', dataIndex:'code', 
					sortable: true, flex: 1, menuDisabled: true,
					renderer: function(v, meta, rec){
						return rec.get("code") + ": " + rec.get("name");
					}
				}
			]
		});
		this.xAirportsGrid.on("selectionchange", function(selModel, selected, eOpts){
			if( selected.length === 0){
				this.action_new_tab().setDisabled(true);
				this.fireEvent("AIRPORT", null );
				return;
			}
			this.action_new_tab().setDisabled(false);			
			this.fetch_airport( selected[0].get("code") );
			this.fireEvent("AIRPORT", selected[0].getData() );
		}, this);
	}
	return this.xAirportsGrid;

},

fetch_airport: function(apt_ident){
	Ext.Ajax.request({
		url: NAVDATA_SERVER + "/airport/" + apt_ident + ".json",
		method: "GET",
		scope: this,
		success: function(response, opts) {
			var data = Ext.decode(response.responseText);
			//console.log(data);
			var apt = data.airport;
			var sto = this.get_runways_store();
			//sto.removeAll();
			
			var root = Ext.create("mTree", {
				x_key: data.airport.apt_ident, x_val: data.airport.apt_name_ascii,
				expanded: false,  expandable: true
			});
			sto.setRootNode(root);
			var runs = data.runways;
			for(var ir = 0; ir < runs.length; ir++){
				var r = runs[ir];
				var rwyNode = Ext.create("mTree", {
						x_key: r.rwy, x_val: r.rwy_length,
						expanded: true,  expandable: true
				});
				root.appendChild(rwyNode);
				
				for(var it = 0; it < r.thresholds.length; it++){
					var t = r.thresholds[it];
					var tn =  Ext.create("mTree", {
						x_key: t.rwy_ident, x_val: "", 
						expanded: false, expandable: true
					});
					rwyNode.appendChild(tn);
					var props = ["rwy_threshold", "rwy_ident", "rwy_reil", "rwy_marking", "rwy_overrun", "rwy_app_lighting"];
					for(var pi =0; pi < props.length; pi++){
						var pk = props[pi];
						var lbl =  pk.replace("rwy_", "");
						lbl = lbl.replace("_", " ");
						var pn =  Ext.create("mTree",{
							x_key: lbl, x_val: t[pk], 
							leaf: true
						});
						tn.appendChild(pn);
					}
				}					
			}
			if(root.hasChildNodes()){
				root.expand();
			}
		},
		failure: function(response, opts) {
			console.log('server-side failure with status code ' + response.status);
		}
		
	});
},

//=================================================================
get_runways_store: function(){
	if(!this.xRunwaysStore){
		this.xRunwaysStore = Ext.create("Ext.data.TreeStore", {
			model: "mTree",
			root: {
				expanded: false,
				text: "My Root",
				id: "root"
			}
		});
	}
	return this.xRunwaysStore;
},

get_runways_tree: function(){
	if(!this.xRunwaysTree){
		this.xRunwaysTree = Ext.create("Ext.tree.Panel", {
			region: "east", autoScroll: true,
			frame: false,  border: false,
			useArrows: true,
			rootVisible: true,
			columns: [
				{xtype: 'treecolumn', header: 'Item', dataIndex: 'x_key', 	flex: 1},
				{header: 'Value', dataIndex: 'x_val', 	flex: 1}
			],
			viewConfig: {
				forceFit: true
			},
			width: 250,
			store: this.get_runways_store()
		});
	}
	return this.xRunwaysTree;
},

initComponent: function() {
	Ext.apply(this, {
		iconCls: "icoAirport",
		title: "Airports",
		layout: "border",
		frame: false, plain: true, border: false,
		items: [
			this.get_airports_grid(),
			this.get_runways_tree()		   
		],
		tbar: [	
			{xtype: 'buttongroup', 
				title: 'Find Code',
				columns: 2,
				items: [
					{iconCls: "icoClr",	scope: this, tooltip: "Clear text box",
						handler: function(){
							var widget = this.down("textfield[name=search_apt_ident]");
							widget.setValue("");
							widget.focus();
						}
					},
					{xtype: "textfield",  name: "search_apt_ident",
						width: this.txt_width,
						enableKeyEvents: true,
						listeners: {
							scope: this,
							keyup: function(txtFld, e){
								txtFld.setValue( txtFld.getValue().trim() );
								var s = txtFld.getValue();
								if(s.length > 1){
									this.get_airports_store().load({params: {
										code: s,
										//apt_type: this.get_apt_types(),
										//apt_size: this.get_apt_sizes()
									}});
								}
							}
						}
					}
				]
			},
			{xtype: 'buttongroup', 
				title: 'Find Name',
				columns: 2,
				items: [
					{iconCls: "icoClr",	scope: this, tooltip: "Clear text box",
						handler: function(){
							var widget = this.down("textfield[name=search_apt_text]");
							widget.setValue("");
							widget.focus();
						}
					},
					{xtype: "textfield",  name: "search_apt_text",
						width: this.txt_width,
						enableKeyEvents: true,
						listeners: {
							scope: this,
							keyup: function(txtFld, e){
								if(txtFld.getValue().length > 3){
									var s = txtFld.getValue().trim();
									if(s.length > 3){
										this.get_airports_store().load({params: {apt_name_ascii: 1}});
									}
								}
							}
						}
					}
				]
			},
			{xtype: 'buttongroup', 
				title: 'Search For - TODO',
				columns: 5,
				items: [
					{text: "Major", apt_filter: 1, pressed: true, enableToggle: true, apt_type: "land", apt_size: "large"},
					{text: "Regional", apt_filter: 1, pressed: true, enableToggle: true,  apt_type: "land", apt_size: "medium"},
					{text: "Small", apt_filter: 1, enableToggle: true,  apt_type: "land", apt_size: "small"},
					{text: "SeaPort", apt_filter: 1, enableToggle: true,  apt_type: "sea"},
					{text: "HeliPort", apt_filter: 1, enableToggle: true, apt_type: "heli"}
				]
			}
		]
		
	});
	this.callParent();
}, // initComponent

get_apt_types: function(){
	var widgets = this.query("[apt_filter=1]");
	var arr = [];
	for(var w in widgets){
		if(w.pressed){
			arr.push(w.apt_size);
		}
	}
	console.log("types", widgets, arr);
	return "-";
},
get_apt_sizes: function(){
	var widgets = this.query("[apt_type=land]");
	var arr = [];
	for(var idx in widgets){
		var w = widgets[idx]
		if(w.pressed){
			arr.push(w.apt_size);
		}
		//console.log(w.pressed, w.text, w);
	}
	//console.log("sizes=", arr.join(",");
	return arr.join(",");
},


//== Store
get_airports_store: function(){
	if(!this.xStore){
		this.xStore = Ext.create("Ext.data.JsonStore", {
			model: "mAirport",
			proxy: {
				type: "ajax",
				url: NAVDATA_SERVER + '/airports.json',
				method: "GET",
				reader: {
					type: "json",
					root: 'rows'
				}
			},
			autoLoad: false,
			
			remoteSort: false,
			sortInfo: {
				field: "code", 
				direction: 'ASC'
			}
		});
	}
	return this.xStore;
}



});

