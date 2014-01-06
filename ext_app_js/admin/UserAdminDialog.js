Ext.namespace("FGx");

FGx.UserAdminDialog = Ext.extend(Ext.Window, {


constructor: function(config) {
	
	config = Ext.apply({
		title: 'BookMark',
		width: 500,
		items: [
			this.get_form()
		]
	}, config);
	
	FGx.UserAdminDialog.superclass.constructor.call(this, config);
}, // Constructor	

get_form: function(){
	if(!this.xForm){
		this.xForm = new Ext.form.FormPanel({
			frame: true, border: 0,
			defaults: {
				
				labelWidth: 100
			},
			bodyStyle: "padding: 20px",
			defaulta: {
				labelAlign: "right",
			},
			items: [
				{fieldLabel: "Name", xtype: "textfield", width: 200, labelAlign: "right", name: "name"},
				{fieldLabel: "Email", xtype: "textfield", width: 300, name: "email"},
				{fieldLabel: "Callsign", xtype: "textfield", width: 50, name: "callsign"},
				{fieldLabel: "Level", xtype: "combo", editable: false, name: "level",
					triggerAction: 'all', lazyRender:true, mode: 'local',
					store: new Ext.data.ArrayStore({
						sssid: 0,
						fields: [
							'level',
							'label'
						],
						data: [[0, 'No Login'], [1, 'Normal Access'], [2, 'Admin Access']]
					}),
					valueField: 'level',
					displayField: 'label'
				}
			],
			buttons: [
				{text: "Cancel", iconCls: "icoCancel", xtype: "button", scope: this, 
					handler: function(){
						this.close();
					}
				},
				{text: "Save", iconCls: "icoSave", xtype: "button", scope: this,
					handler: function(){
						
						var f = this.get_form().getForm();
						console.log("save", f.isValid() );
						if( !f.isValid() ){
							return;
						}
						f.submit({
							url: "/ajax/user/" + this.user_id
							
							
						});
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
