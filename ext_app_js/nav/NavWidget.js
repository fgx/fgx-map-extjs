/*global Ext: false, console: false, FGx: false */

Ext.define("FGx.nav.NavWidget", {

extend: "Ext.grid.GridPanel",
tbw: 50,

initComponent: function() {
	
	Ext.apply(this, {
		title: 'NavAids',
		iconCls: 'icoFix',
		autoScroll: true,
		autoWidth: true,
		enableHdMenu: false,
		viewConfig: {
			emptyText: 'No items', 
			forceFit: true,
			deferEmptyText: false
		}, 
		store: this.get_store(),
		loadMask: true,
		
		columns: [ 
			{header: '&nbsp;', dataIndex:'nav_suffix', width: 20, menuDisabled: true, sortable: true,
				renderer: function(v, meta, rec){
					// classes blow are teh icons
					var oops = "";
					if(v == "FIX"){
						meta.tdCls = "icoFix";
						
					}else if(v == "NDB" || v == "NDB-DME"){
						meta.tdCls = "icoNdb";
							
					}else if(v == "VOR" || v == "VOR-DME" || v == "DME"){
						meta.tdCls = "icoVor";
					}else{
						oops = v;
					}
					return oops;
					//return "<img src='/images/vfr_fix.png'>";
				}
			},
			{header: 'Ident', dataIndex:'nav_ident', sortable: true, align: 'left', 
				hidden: false, width: 70, menuDisabled: true,
				renderer: function(v, meta, rec){
					// @TODO Make this a css class
					return "<b>" + v + "</b>";
				}
			},
			{header: 'Name', dataIndex:'nav_name', menuDisabled: true,
				sortable: true, align: 'left', hidden: false, flex: 1},
			{header: 'Freq', dataIndex:'nav_freq', menuDisabled: true,
				sortable: true, align: 'left', hidden: false, flex: 1,
				renderer: function(v, meta, rec){
					if( rec.get("nav_freq_khz") ){
						return rec.get("nav_freq_khz") + " khz";
						
					}else if( rec.get("nav_freq_mhz") ){
						return rec.get("nav_freq_mhz") + " mhz";
						
					}else{
						return "-";
					}
				}
			},
			{header: 'Lat', dataIndex:'nav_center_lat84', sortable: true, align: 'left', hidden: false, flex: 1},
			{header: 'Lon', dataIndex:'nav_center_lon84', sortable: true, align: 'left', hidden: false, flex: 1}
		],
		
		/* Top Toolbar */
		tbar: [
			{xtype: 'buttongroup',
				title: "Fix",
				columns: 3,
				items: [
					{iconCls: "icoClr", scope: this, tooltip: "Clear text box",
						handler: function(){
							this.get_fix_search_text().setValue("");
							this.get_fix_search_text().focus();
						}
					},
					this.get_fix_search_text()
					//{text: "Nearby"}
				]
			},
			{xtype: 'buttongroup',
				title: "VOR/DME",
				columns: 3,
				items: [
					{iconCls: "icoClr",	scope: this, tooltip: "Clear text box",
						handler: function(){
							this.get_vor_search_text().setValue("");
							this.get_vor_search_text().focus();
						}
					},
					this.get_vor_search_text()
					//{text: "Nearby"}
				]
			},
			{xtype: 'buttongroup',
				title: "NDB",
				columns: 3,
				items: [
					{iconCls: "icoClr",	scope: this, tooltip: "Clear text box",
						handler: function(){
							this.get_ndb_search_text().setValue("");
							this.get_ndb_search_text().focus();
						}
					},
					this.get_ndb_search_text()
				]
			},
			{xtype: 'buttongroup',
				title: "All",
				columns: 3,
				items: [
					{iconCls: "icoClr",	scope: this, tooltip: "Clear text box",
						handler: function(){
							this.get_all_search_text().setValue("");
							this.get_all_search_text().focus();
						}
					},
					this.get_all_search_text()
				]
			}
		],
		listeners: {
			scope: this,
			selectionchange:  function(store, selected, e){
				if(selected.length == 0){
					this.fireEvent("GOTO", null);
					return;
				}
					
				var rec = selected[0];
				//console.log("lat/lon", selected);
				obj = {};
				obj.lat = rec.get("nav_center_lat84");
				obj.lon = rec.get("nav_center_lon84");
				obj.title = rec.get("nav_ident");
				this.fireEvent("GOTO", obj);
			}
		}
		
	});
	this.callParent();
}, // Constructor	





		
//== Store
get_store: function(){
	if(!this.xStore){
		this.xStore = new Ext.data.JsonStore({
			TODOidProperty: 'callsign',
			fields: [ 	
				{name: "nav_suffix", type: 'string'},
				{name: "nav_ident", type: 'string'},
				{name: "nav_name", type: 'string'},
				{name: "nav_center_lat84", type: 'float'},
				{name: "nav_center_lon84", type: 'float'},
				{name: "nav_freq_mhz", type: 'string'},
				{name: "nav_freq_khz", type: 'string'}
			],
			proxy: {
				type: "ajax",
				url: '/ajax/navaids',
				method: "GET",
				reader: {
					type: "json",
					root: 'navaids'
				}
			},
			remoteSort: false,
			sortInfo: {
				field: "ident", 
				direction: 'ASC'
			}
		});
	}
	return this.xStore;
},



//=======================================================
// Search Form
//=======================================================
get_fix_search_text: function(){
	if(!this.txtSearchFix){
		this.txtSearchFix = Ext.create("Ext.form.TextField",{
			width: this.tbw,
			enableKeyEvents: true
		});
		this.txtSearchFix.on("keypress", function(txtFld, e){
			if( e.getKey() == e.ENTER ){
				var t = this.get_fix_search_text();
				t.setValue( t.getValue().trim() );
				var txt = t.getValue();
				if(txt.length < 2){
					return;
				}
				this.get_store().load({params: {search: txt, nav_suffix: "fix"}});
			}
		}, this);
	}
	return this.txtSearchFix;
},
get_vor_search_text: function(){
	if(!this.txtSearchVor){
		this.txtSearchVor = Ext.create("Ext.form.TextField", {
			width: this.tbw,
			enableKeyEvents: true
		});
		this.txtSearchVor.on("keypress", function(txtFld, e){
			if( e.getKey() == e.ENTER ){
				var t = this.get_vor_search_text();
				t.setValue( t.getValue().trim() );
				var txt = t.getValue();
				if(txt.length < 2){
					return;
				}
				this.get_store().load({params: {search: txt, nav_suffix: "vor"}});
			}
		}, this);
	}
	return this.txtSearchVor;
},
get_ndb_search_text: function(){
	if(!this.txtSearchNdb){
		this.txtSearchNdb = Ext.create("Ext.form.TextField", {
			width: this.tbw,
			enableKeyEvents: true
		});
		this.txtSearchNdb.on("keypress", function(txtFld, e){
			if( e.getKey() == e.ENTER ){
				var t = this.get_ndb_search_text();
				t.setValue( t.getValue().trim() );
				var txt = t.getValue();
				if(txt.length < 2){
					return;
				}
				this.get_store().load({params: {search: txt, nav_suffix: "ndb"}});
			}
		}, this);
	}
	return this.txtSearchNdb;
},

get_all_search_text: function(){
	if(!this.txtSearchAll){
		this.txtSearchAll = Ext.create("Ext.form.TextField", {
			width: this.tbw,
			enableKeyEvents: true
		});
		this.txtSearchAll.on("keypress", function(txtFld, e){
			if( e.getKey() == e.ENTER ){
				var t = this.get_all_search_text();
				t.setValue( t.getValue().trim() );
				var txt = t.getValue();
				if(txt.length < 2){
					return;
				}
				this.get_store().load({params: {search: txt, nav_suffix: "__ALL__"}});
			}
		}, this);
	}
	return this.txtSearchAll;
}


});








