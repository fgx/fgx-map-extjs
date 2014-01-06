

Ext.define("FGx.bookmark.BookMarkDialog", {

extend: "Ext.Window",

initComponent: function() {
	
	Ext.apply(this, {
		title: 'BookMark',
		width: 500,
		items: [
			this.get_form()
		]
	});
	
	this.callParent();
}, // initComponent	

get_form: function(){
	if(!this.xForm){
		this.xForm = Ext.create("Ext.form.Panel", {
			frame: true, border: false,
			defaults: {
				labelAlign: "right",
				labelWidth: 100
			},
			bodyStyle: "padding: 50px",
			items: [
				{fieldLabel: "Name", xtype: "textfield", anchor: "90%", name: "name"},
				{fieldLabel: "Lat", xtype: "textfield", anchor: "50%", name: "lat"},
				{fieldLabel: "Lon", xtype: "textfield", anchor: "50%", name: "lon"},
				{fieldLabel: "Zoom", xtype: "numberfield", anchor: "50%", name: "zoom"}
			],
			
			buttons: [
				{text: "Cancel", iconCls: "icoCancel", xtype: "button", scope: this, 
					handler: function(){
						this.close();
					}
				},
				{text: "Save -TODO", iconCls: "icoSave", xtype: "button", scope: this,
					handler: function(){
						this.close();
					}
				}
			]
			
		});
		
	}
	return this.xForm;
},

run_show: function(){
	this.show();
}

});
