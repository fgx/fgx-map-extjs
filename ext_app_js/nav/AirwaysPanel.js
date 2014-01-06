
Ext.define("FGx.nav.AirwaysPanel", {

extend: "Ext.Panel",
tbw: 50,


	//======================================================
// Tables Grid
grid_airways: function(){
	if(!this.gridAirways){
		this.gridAirways = Ext.create("Ext.grid.GridPanel", {
			region: 'center',
			//title: "Airway",
			width: 200,
			enableHdMenu: false,
			frame: false, plain: true, border: false,
			store:  new Ext.data.JsonStore({
				fields: [	
					{name: "airway", type:"string"}
				],
				idProperty: "airway",
				ssortInfo: {},
				proxy: new Ext.data.HttpProxy({
					url: "/ajax/airways",
					method: 'GET'
				}),
				root: "airways",
				autoLoad: false
			}),
			loadMask: true,
			viewConfig:{
				forceFit: true,
				emptyText: "No airways",
				deferEmptyText: true
			},
			columns: [ 
				{header: "Airway", dataIndex: "airway", sortable: true,
					renderer: function(val, meta, record, idx){
						meta.style = "font-weight: bold;"
						return val;
					}
				}
				//{header: "rows", dataIndex: "rows"}
			],
			listeners:{
				scope: this,
				rowclick: function(grid, idx, e){
					
					var rec = this.grid_airways().getStore().getAt(idx);
					//var table = rec.get("airwayy");
					var url = "/ajax/airway/" + rec.get("airway");
					this.grid_segments().getStore().proxy.setUrl(url);
					this.grid_segments().getStore().load();
				}
			}
		});
	}
	return this.gridAirways;
},


//=================================================================
//== Columns
grid_segments: function(){
	if(!this.gridSegments){
		this.gridSegments = Ext.create("Ext.grid.GridPanel", {
			region: 'east', 
			//title: "Segments",
			width: "70%",
			
			store: new Ext.data.JsonStore({
				fields: [	
					{name: "ident_entry", type:"string"},
					{name: "ident_exit", type:"string"},
					{name: "fl_top", type:"string"},
					{name: "fl_base", type:"string"},
					{name: "level", type:"int"},
					{name: "lat1", type:"string"},
					{name: "lon1", type:"string"},
					{name: "lat2", type:"string"},
					{name: "lon2", type:"string"},
					{name: "airway", type:"string"},
					//{name: "nullable", type:"boolean"},
				
				],
				idProperty: "column",
				proxy: new Ext.data.HttpProxy({
					url: "/ajax/airway/_AIRWAY_NAME_",
					method: 'GET'
				}),
				root: "segments",
				autoLoad: false
				
			}),
			viewConfig:{
				forceFit: true,
				emptyText: "< Select a table",
				deferEmptyText: false
			},
			columns: [ 
				{header: "Entry", dataIndex: "ident_entry",
					ssrenderer: function(val, meta, record, idx){
						meta.style = "font-weight: bold;"
						return val;
					}
				},
				{header: "Exit", dataIndex: "ident_exit"},
				
				{header: "airway", dataIndex: "airway"}
				//{header: "lo", dataIndex: "lon1"}
			]
		});
	}
	return this.gridSegments;
},

get_all_search_text: function(){
	if(!this.txtSearchAll){
		this.txtSearchAll = Ext.create("Ext.form.TextField", {
			width: 60,
			enableKeyEvents: true
		});
		this.txtSearchAll.on("keyup", function(txtFld, e){
			//console.log("yes");
			var txt = this.get_all_search_text().getValue();
			//console.log(txt, txt.length);
			if(txt.length > 1){
				var sto = this.grid_airways().getStore()
				//#sto.load({params: {search: t}});
				this.grid_airways().getStore().load({params: {search: txt}});
			}else{
				this.grid_airways().getStore().removeAll();
			}
			/*
			return;
			if( e.getKey() == e.ENTER ){
				var t = this.get_all_search_text();
				t.setValue( t.getValue().trim() );
				var txt = t.getValue();
				if(txt.length < 2){
					return;
				}
				this.grid_airways().getStore().load({params: {search: txt}});
			}*/
		}, this);
	}
	return this.txtSearchAll;
},

initComponent: function() {
	
	Ext.apply(this, {
		title: 'Airways',
		layout: "border",
		iconCls: "icoAirways",
		tbar: [
			{iconCls: "icoClr"},
			this.get_all_search_text()
		],
		items: [
			this.grid_airways(),
			this.grid_segments()
        
		]
	});
	this.callParent();
}, // initComponent	


});