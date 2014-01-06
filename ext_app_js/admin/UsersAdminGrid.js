
Ext.namespace("FGx");

FGx.UsersAdminGrid =  Ext.extend(Ext.grid.GridPanel, {

//===========================================================
//== Grid
constructor: function(config) {
	config = Ext.apply({
		title: 'Users',
		iconCls: 'icoUsers',
		autoScroll: true,
		autoWidth: true,
		enableHdMenu: false,
		viewConfig: {
			emptyText: 'No users in view', 
			deferEmptyText: false,
			forceFit: true
		}, 
		stripeRows: true,
		store: this.get_store(),
		loadMask: true,
		sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
		columns: [ 
			{header: 'CallSign',  dataIndex:'callsign', sortable: true, 
				ssrenderer: this.render_callsign, width: 100
			},
			{header: 'Name', dataIndex:'name', sortable: true,
				ssrenderer: this.render_altitude
			},
			{header: 'Email', dataIndex:'email', sortable: true,
				ssrenderer: this.render_altitude
			},
			{header: 'Level', dataIndex:'level', sortable: true, align: 'right'
			}
		],

		tbar: [	//this.pilotsDataCountLabel
			{xtype: 'buttongroup', hidden: config.xHidden,
				title: 'Actions',
				columns: 3,
				items: [
					{text: "New", iconCls: "icoUserAdd",  scope: this,
						handler: function(){
							this.edit_user(0);
						}
					},
					this.action_edit(),
					this.action_delete()
				]
			}
		],
		
		bbar: [
			new Ext.PagingToolbar({
				store: this.get_store(),
				displayInfo: false,
				pageSize: 500,
				prependButtons: false
			})
		]
		
	}, config);
	FGx.UsersAdminGrid.superclass.constructor.call(this, config);
}, // Constructor	

//== Store
get_store: function(){
	if(!this.xStore){
		this.xStore = new Ext.data.JsonStore({
			idProperty: 'callsign',
			fields: [ 	
				{name: "nav_type", type: 'string'},
				{name: "ident", type: 'string'},
				{name: "name", type: 'string'},
				{name: "lat", type: 'float'},
				{name: "lon", type: 'float'}
			],
			proxy: new Ext.data.HttpProxy({
				url: '/ajax/users',
				method: "GET"
			}),
			root: 'rows',
			remoteSort: false,
			sortInfo: {
				field: "ident", 
				direction: 'ASC'
			}
		});
	}
	return this.xStore;
},

action_edit: function(){
	if( !this.xUserEdit ){
		this.xUserEdit = new Ext.Action({
			iconCls: 'icoUserEdit', disabled: true,
			text: "View", 
			listeners: {
				scope: this, 
				click: function(){
					var selModel = this.getSelectionModel();
					if(!selModel.hasSelection()){
						return;
					}
					var rec = selModel.getSelection()[0];
					this.on_edit( rec );
				}
			}
		});
	}
	return this.xUserEdit;
},

action_delete: function(){
	if( !this.xUserDelete ){
		this.xUserDelete = new Ext.Action({
			iconCls: 'icoUserDelete', disabled: true,
			text: "Delete", 
			listeners: {
				scope: this, 
				click: function(){
					var selModel = this.getSelectionModel();
					if(!selModel.hasSelection()){
						return;
					}
					var rec = selModel.getSelection()[0];
					this.on_edit( rec );
				}
			}
		});
	}
	return this.xUserDelete;
},

edit_user: function(user_id){
	var d = new FGx.UserAdminDialog({user_id: user_id});
	d.run_show();
},

initialize: function(){
	this.get_store().load();
}


});

