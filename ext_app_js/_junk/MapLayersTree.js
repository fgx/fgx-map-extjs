
Ext.namespace("FGx");

FGx.MapLayersTree = function(){

var self = this;	
	

this.layerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());
			
// using OpenLayers.Format.JSON to create a nice formatted string of the
// configuration for editing it in the UI
this.treeConfigL = [ 
	{nodeType: "gx_baselayercontainer"
		
	}, 
	{
		nodeType: "gx_overlaylayercontainer",
		expanded: true,
		// render the nodes inside this container with a radio button,
		// and assign them the group "foo".
		loader: {
			baseAttrs: {
			radioGroup: "foo",
			uiProvider: "layernodeui"
		}
		}
	}, 
	{
		nodeType: "gx_layer",
		layer: "VFR",
		isLeaf: false,
		// create subnodes for the layers in the LAYERS param. If we assign
		// a loader to a LayerNode and do not provide a loader class, a
		// LayerParamLoader will be assumed.
		loader: {
			param: "LAYERS"
		}
	},
	{
		nodeType: "gx_layer",
		layer: "IFR",
		isLeaf: false,
		// create subnodes for the layers in the LAYERS param. If we assign
		// a loader to a LayerNode and do not provide a loader class, a
		// LayerParamLoader will be assumed.
		loader: {
			param: "LAYERS"
		}
	}
];
// The line below is only needed for this example, because we want to allow
// interactive modifications of the tree configuration using the
// "Show/Edit Tree Config" button. Don't use this line in your code.
this.treeConfig = new OpenLayers.Format.JSON().write(this.treeConfigL, true);
			
// create the tree with the configuration from above
this.tree = new Ext.tree.TreePanel({
	border: true,
	DEADregion: "west",
	title: "Layers",
	width: 200,
	split: true,
	DEADcollapsible: true,
	DEADcollapseMode: "mini",
	autoScroll: true,
	plugins: [
		new GeoExt.plugins.TreeNodeRadioButton({
				listeners: {
					"radiochange": function(node) {
						alert(node.text + " is now the active layer.");
					}
				}
		})
	],
	loader: new Ext.tree.TreeLoader({
				// applyLoader has to be set to false to not interfer with loaders
				// of nodes further down the tree hierarchy
				applyLoader: false,
				uiProviders: {
				"layernodeui": this.layerNodeUI
				}
	}),
	root: {
		nodeType: "async",
		// the children property of an Ext.tree.AsyncTreeNode is used to
		// provide an initial set of layer nodes. We use the treeConfig
		// from above, that we created with OpenLayers.Format.JSON.write.
		children: Ext.decode(this.treeConfig)
		// Don't use the line above in your application. Instead, use
		//children: treeConfig

	},
	listeners: {
		"radiochange": function(node){
			alert(node.layer.name + " is now the the active layer.");
		}
	},
	rootVisible: false,
	lines: false,
	bbar: [
		{
			text: "Show/Edit Tree Config",
			handler: function() {
				this.treeConfigWin.show();
				Ext.getCmp("treeconfig").setValue(this.treeConfig);
			}
		}
	]
});

} //= 