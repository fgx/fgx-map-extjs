

//================================================================
Ext.define("FGx.dev.DbBrowser",  {

extend: "Ext.Panel",
curr_database : "navdata",

//======================================================
// Tables Grid
grid_tables: function(){
	if(!this.gridTables){
		this.gridTables = Ext.create("Ext.grid.Panel", {
			region: 'center',
			title: "Tables",
			width: 200,
			store:  new Ext.data.JsonStore({
				fields: [	
					{name: "table", type:"string"}
				],
				idProperty: "table",
				
				proxy: {
					type: "ajax",
					url: "/ajax/dev/database/navdata/tables",
					method: 'GET',
					reader: {
						type: "json",
						root: "tables"
					}
				},
				autoLoad: true
			}),
			viewConfig:{
				forceFit: true
			},
			columns: [ 
				{header: "Table", dataIndex: "table", flex:1, menuDisabled: true,
					renderer: function(val, meta, record, idx){
						meta.style = "font-weight: bold;"
						return val;
					}
				}
				//{header: "rows", dataIndex: "rows"}
			],
			listeners:{
				scope: this,
				selectionchange: function(grid, selection, e){
					
					if(selection.length == 0){
						return;
					}
					var rec = selection[0];
					var table = rec.get("table");
					var url = "/ajax/dev/database/" + this.curr_database + "/table/" + table + "/columns";
					this.grid_columns().getStore().getProxy().url = url;
					this.grid_columns().getStore().load();
				}
			}
		});
	}
	return this.gridTables;
},


//=================================================================
//== Columns
grid_columns: function(){
	if(!this.gridColumns){
		this.gridColumns = Ext.create("Ext.grid.Panel", {
			region: 'east', 
			title: "Columns",
			flex: 1,
			store: Ext.create("Ext.data.JsonStore", {
				fields: [	
					{name: "column", type:"string"},
					{name: "type", type:"string"},
					{name: "max_char", type:"string"},
					{name: "nullable", type:"boolean"}
				],
				idProperty: "column",
				proxy: {
					type: "ajax",
					url: "/ajax/dev/database/table/_TABLE_NAME_/columns",
					method: 'GET',
					reader: {
						type: "json",
						root: "columns"
					}
				},
				
				autoLoad: false
				
			}),
			viewConfig:{
				forceFit: true,
				emptyText: "< Select a table",
				deferEmptyText: false
			},
			columns: [ 
				{header: "Column", dataIndex: "column", flex: 1, menuDisabled: true,
					renderer: function(val, meta, record, idx){
						meta.style = "font-weight: bold;"
						return val;
					}
				},
				{header: "Type", dataIndex: "type", flex: 1, menuDisabled: true},
				{header: "Nullable", dataIndex: "nullable", width: 50,
					renderer: function(v){
						return v ? "Yes" : "-";
					}
				}
			]
		});
	}
	return this.gridColumns;
},


on_select_db: function(butt, checked){
	if(checked){
		this.curr_database = butt.text;
		
		this.grid_columns().getStore().removeAll();
		
		this.grid_tables().getStore().getProxy().url = "/ajax/dev/database/" + this.curr_database + "/tables";
		this.grid_tables().getStore().load();
	}
	butt.setIconCls( checked ? "icoOn" : "icoOff");
},


initComponent: function() {
	
	Ext.apply(this, {
		layout: 'border',
		fgxType: "DbBrowser",
		title: "DB Schema",
		iconCls: "icoDatabase",
		activeTab: 0,
		tbar: [
			{xtype: 'buttongroup', 
				title: 'Select Database',
				columns: 3,
				items: [
					{text: "navdata", pressed: true, enableToggle: true, toggleGroup: "sel_db", allowDepress: false,
						toggleHandler: this.on_select_db, scope: this, iconCls: "icoOn"},
					{text: "users", enableToggle: true, toggleGroup: "sel_db",  allowDepress: false,
						toggleHandler: this.on_select_db, scope: this, iconCls: "icoOff"},
					{text: "mpnet",  enableToggle: true,  toggleGroup: "sel_db",  allowDepress: false,
						toggleHandler: this.on_select_db, scope: this, iconCls: "icoOff"},
				]
			}
		],
		plain: true,
		//height: window.innerHeight - 5,
		items: [
			this.grid_tables(),
			this.grid_columns()
		]
	
	});
	this.callParent();
	
},

//this.tablesGrid.load_tables();
load:  function(){
	this.grid_tables().getStore().load();
}

});  // end function cinstructor