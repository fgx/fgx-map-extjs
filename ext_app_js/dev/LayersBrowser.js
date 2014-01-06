

//================================================================
Ext.define("FGx.dev.LayersBrowser",  {

extend: "Ext.tab.Panel",

//======================================================
grid_layers: function(){
	if(!this.gridLayers){
		this.gridLayers = Ext.create("Ext.grid.Panel", {
			region: 'center',
			//title: "Layer Defs",
			//width: 200,
			flex: 1,
			store:  Ext.create("Ext.data.JsonStore", {
				fields: [	
					{name: "layer", type:"string"},
					{name: "tilecache", type:"string", defaultValue: null},
					{name: "mapnik", type:"string", defaultValue: null},
					{name: "type", type:"string", defaultValue: null},
					{name: "levels", type:"int", defaultValue: null},
					{name: "metabuffer", type:"int", defaultValue: null},
					{name: "openlayers", type:"string", defaultValue: null},
					{name: "stylename", type:"string", defaultValue: null}
				],
				idProperty: "layer",
				proxy: {
					type: "ajax",
					url: "/ajax/map/layers",
					method: 'GET',
					reader: {
						type: "json",
						root: "layers"
					}
				},
				autoLoad: true,
				listeners: {
					scope: this,
					load: function(store, records, success){
						
						return;
						
						// Concept to add resolutaions columns abandoned for now
						var data = store.getProxy().getReader().rawData;
						//console.log(store.getProxy().getReader().rawData);
						var grid = this.grid_layers();
						
						//Ext.getCmp("resources_xml_text").setRawValue(data.tilecache_cfg);
						for(var i = 0; i < 20; i++){
							var col = Ext.create("Ext.grid.column.Column", {
								text: i, flex: 1
							});
							grid.headerCt.insert(grid.columns.length, col);
						}
						grid.getView().refresh();
					}
				}
			}),
			viewConfig:{
				forceFit: true
			},
			columns: [ 
				{header: "Unique", dataIndex: "layer", swidth:100, menuDisabled: true,
					renderer: function(val, meta, record, idx){
						meta.style = "font-weight: bold;"
						return val;
					}
				},
				{header: "OpenLayer", dataIndex: "openlayers", swidth:150, menuDisabled: true},
				{text: "Tilecache", menuDisabled: true, columns: [
						{header: "Layer", dataIndex: "tilecache", menuDisabled: true, sortable: true},
						{header: "Levels", dataIndex: "levels", menuDisabled: true, sortable: true},
						{header: "metabuffer", dataIndex: "metabuffer", sflex:1, menuDisabled: true, sortable: true}
					]
				},
				{text: "Mapnik", menuDisabled: true, columns: [
						{header: "Layer", dataIndex: "mapnik", menuDisabled: true, sortable: true},
						{header: "Type", dataIndex: "type", menuDisabled: true, sortable: true},
						{header: "Style", dataIndex: "stylename", menuDisabled: true, sortable: true}
					]
				}

				
			],
			listeners:{
				scope: this,
				selectionchange: function(grid, selection, e){
					if(selection.length > 0){
						this.fetch_layer( selection[0].get("layer") );
					}
				}
			}
		});
	}
	return this.gridLayers;
},


//=================================================================
get_tree_store: function(){
	if(!this.xTreeStore){
		this.xTreeStore = Ext.create("Ext.data.TreeStore", {
			fields: [
				"x_key", "x_val"
			],
			root: {
				expanded: false,
				text: "My Root",
				id: "root"
			}
		});
	}
	return this.xTreeStore;
},

layer_tree: function(){
	if(!this.xLayerTree){
		this.xLayerTree = Ext.create("Ext.tree.Panel", {
			autoScroll: true,
			width: "100%",
			flex: 1,
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
			
			store: this.get_tree_store()
		});
	}
	return this.xLayerTree;
},

fetch_layer: function(layer){
	Ext.Ajax.request({
		url: "/ajax/map/layer/" + layer,
		method: "GET",
		scope: this,
		success: function(response, opts) {
			var payload = Ext.decode(response.responseText);
			var data = payload.data;
			
			//console.log(data);
			this.down("textarea[name=style_xml_text]").setRawValue(data.stylexml );
			
			var sto = this.get_tree_store();
			//sto.removeAll();
			
			var root = Ext.create("mTree", {
				x_key: data.layer, x_val: " ",
				expanded: false,  expandable: true
			});
			sto.setRootNode(root);
			
			
			var tcNode = Ext.create("mTree", {
						x_key: "Tilecache", x_val: "",
						expanded: true,  expandable: true
			});
			root.appendChild(tcNode);
			var tcParams = data.tilecache_params;
			for(var ki in tcParams){
				//console.log(ki);
				var r = tcParams[ki];
				var tcKid =  Ext.create("mTree", {
					x_key: ki, x_val: r, leaf: true,
					sssexpanded: false, sssexpandable: true
				});
				tcNode.appendChild(tcKid);
			}
			var mnNode = Ext.create("mTree", {
						x_key: "Mapnik", x_val: "",
						expanded: true,  expandable: true
			});
			root.appendChild(mnNode);
			var mnParams = data.mapnik_params;
			for(var ki in mnParams){
				//console.log(ki);
				var r = mnParams[ki];
				var mnKid =  Ext.create("mTree", {
					x_key: ki, x_val: r, leaf: true
				});
				mnNode.appendChild(mnKid);
			}
			
			root.expand();
		},
		failure: function(response, opts) {
			console.log('server-side failure with status code ' + response.status);
		}
		
	});
},

initComponent: function() {
	
	Ext.apply(this, {
		layout: 'border',
		fgxType: "LayersBrowsers",
		title: "Layers",
		iconCls: "icoDatabase",
		activeTab: 0,
		tbar: [
			
		],
		//height: window.innerHeight - 5,
		items: [
			{xtype: "panel", title: "Layers", layout: "border", border: false, frame: false, 
				items: [
					this.grid_layers(),
					{xtype: "panel", region: "east", title: "Layer Details", 
						layout: "vbox", width: 500, 
						items: [
							
							{xtype: "fieldset", title: "Style XML", width: "100%",
								items: [
									{xtype: "textarea", name: "style_xml_text", height: 200, width: "100%"}
								]
		   
							},
						this.layer_tree(),
						]
					}
				]
			},
			//this.view_tilecache(),
			{xtype: "panel", title: "Mapnik Config", layout: "fit",
				items: [
					{xtype: "textarea", name: "resources_xml", id: "resources_xml_text"}
				]
			}
		]
		
	
	});
	this.callParent();
	
},


load:  function(){
	this.grid_layers().getStore().load();
}

});  // end  constructor