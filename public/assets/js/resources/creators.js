var reset = function () {
  if (typeof gform.instances.modal !== "undefined") {
    gform.instances.modal.destroy();
  }
  $(mymodal.ref.el)
    .find(".modal-body")
    .html(
      '<center style="height:300px"><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center>'
    );
};
var selectGroup = function (e) {
  // $(mymodal.ref.el).find('.modal-body').berry({
  //   attributes:instanceData,
  //     name:"modal", fields:[
  //       {label: 'Group', name:'group_id', required: true, type:'select',satisfied:function(value){
  //         return (this.toJSON() !== "")
  //       },value:instanceData.group_id, choices: '/api/groups?limit=true', default:{"label":"Choose One","value":""}},
  //     ],actions:false
  //   })
  // $(mymodal.ref.el).find('.modal-body').berry
  $g.getData(["/api/groups?limit=true"], groups => {
    new $g.form(
      {
        data: instanceData,
        name: "modal",
        fields: [
          {
            label: "Group",
            name: "group_id",
            required: true,
            type: "select",
            value: instanceData.group_id,
            options: [
              { name: "Choose One", value: null },
              { type: "optgroup", options: "groups" },
            ],
            format: { label: "{{name}}", value: group => group.id },
          },
        ],
        actions: [],
      },
      mymodal.el.querySelector(".modal-body")
    );
  });
};

var selectComposite = function () {
  $g.getData(
    ["/api/groups/" + instanceData.group_id + "/composites"],
    composites => {
      // $.ajax({
      //   url: '/api/groups/'+instanceData.group_id+'/composites',
      //   success: function(data) {
      if (composites.length) {
        // composites = data;

        // $(mymodal.ref.el).find('.modal-body').berry({
        //   attributes:instanceData,
        //   name:"modal", fields:[
        //     {label: 'Limit Composite Groups', name: 'limit', type: 'checkbox', show:  {matches:{name:'public', value: 0},test: function(form){return composites.length >0;}} },
        //     {label: 'Composites', legend: 'Composites', name:'composites', type:'fieldset', 'show': {
        //         matches: {
        //           name: 'limit',
        //           value: true
        //         }
        //       },fields:[
        //         {label: false, multiple:{duplicate:true}, type:'fieldset', toArray:true, name: 'composite', fields:[
        //           {label: false, name: 'groups', type: 'select', options: composites}
        //         ]}
        //       ],
        //       template:'{{#attributes.composites.composite}}{{groups}} {{/attributes.composites.composite}}'
        //     }
        //   ],actions:false
        // })

        // $g.forms.modal.destroy();
        new $g.form(
          {
            data: instanceData,
            name: "modal",
            fields: [...fieldLibrary._display, ...fieldLibrary.composites],
            actions: [],
          },
          mymodal.el.querySelector(".modal-body")
        );
      } else {
        $(mymodal.ref.el)
          .find(".modal-body")
          .html(
            "There are no Composites for this group. This step is complete."
          );
      }
      // }
    }
  );
};
instanceData = {};
if (typeof group_id !== "undefined") {
  instanceData.group_id = group_id;
}
if (typeof group !== "undefined") {
  instanceData.group_id = group.id;
}
if (typeof loaded !== "undefined" && typeof loaded.app !== "undefined") {
  instanceData.app_id = loaded.app.id;
}
if (typeof loaded !== "undefined" && typeof loaded.workflow !== "undefined") {
  instanceData.workflow_id = loaded.workflow.id;
}
var createEngine = function (e) {
  // $('.btn-new').click();
  if (typeof gform.instances.modal !== "undefined") {
    gform.instances.modal.destroy();
  }

  var options = {
    init: "start",
    complete: "Successfully Created",
    legend:
      '<span class="btn btn-default btn-sm" data-action="cancel"><i class="fa fa-th"></i></span> Create New',
    transitions: [
      //page
      { name: "createpage", from: "*", to: "pagegroup" },
      { name: "next", from: "page", to: "pagecomposite" },
      { name: "next", from: "pagegroup", to: "page" },
      { name: "submit", from: "pagecomposite", to: "submit" },
      { name: "previous", from: "page", to: "pagegroup" },
      { name: "previous", from: "pagecomposite", to: "page" },
      { name: "complete", from: "success", to: "complete" },
      //endpoint
      { name: "createendpoint", from: "*", to: "endpointgroup" },
      { name: "next", from: "endpointgroup", to: "endpoint" },
      { name: "submit", from: "endpoint", to: "submit" },
      { name: "previous", from: "endpoint", to: "endpointgroup" },
      //link
      { name: "createlink", from: "*", to: "linkgroup" },
      { name: "next", from: "linkgroup", to: "link" },
      { name: "submit", from: "link", to: "submit" },
      { name: "previous", from: "link", to: "linkgroup" },
      //image
      { name: "createimage", from: "*", to: "imagegroup" },
      { name: "next", from: "imagegroup", to: "image" },
      { name: "previous", from: "image", to: "imagegroup" },
      //app
      { name: "createapp", from: "start", to: "appCreate" },
      { name: "submit", from: "appCreate", to: "submit" },
      //app
      { name: "createworkflow", from: "start", to: "workflowCreate" },
      { name: "submit", from: "workflowCreate", to: "submit" },
      //group
      { name: "creategroup", from: "start", to: "groupCreate" },
      { name: "submit", from: "groupCreate", to: "submit" },
      //user
      { name: "createuser", from: "start", to: "userCreate" },
      { name: "submit", from: "userCreate", to: "submit" },
      //appinstance
      { name: "createappinstance", from: "*", to: "appinstancegroup" },
      { name: "next", from: "appinstancegroup", to: "app" },

      //workflowinstance
      {
        name: "createworkflowinstance",
        from: "*",
        to: "workflowinstancegroup",
      },
      { name: "next", from: "workflowinstancegroup", to: "workflow" },

      { name: "next", from: "workflow", to: "workflowinstance" },
      {
        name: "next",
        from: "workflowinstance",
        to: "workflowinstancecomposite",
      },
      { name: "submit", from: "workflowinstancecomposite", to: "submit" },
      { name: "previous", from: "workflowinstance", to: "workflow" },
      { name: "previous", from: "workflow", to: "workflowinstancegroup" },
      {
        name: "previous",
        from: "workflowinstancecomposite",
        to: "workflowinstance",
      },

      { name: "next", from: "app", to: "appinstance" },
      { name: "next", from: "appinstance", to: "appinstancecomposite" },
      { name: "submit", from: "appinstancecomposite", to: "submit" },
      { name: "previous", from: "appinstance", to: "app" },
      { name: "previous", from: "app", to: "appinstancegroup" },
      { name: "previous", from: "instancecomposite", to: "appinstance" },
      //all
      { name: "cancel", from: "*", to: "start" },
      { name: "success", from: "*", to: "success" },
      { name: "error", from: "*", to: "start" },
      { name: "other", from: "success", to: "start" },
    ],
    methods: {
      onStart: function () {
        $(mymodal.ref.el).find(".modal-body").html(startContent);
      },
      onAppCreate: function () {
        // myForm = new gform({name:"modal", attributes: instanceData, fields:[
        //   {label: 'Name', name:'name', required: true},
        //     {label: 'Description', name:'description', required: false, type:'textarea'},
        //     {label: 'Tags', name:'tags', required: false},
        //     {label: 'Lead Developer', name:'user_id', type:'select', options: '/api/apps/developers', required: false, format:{label:'{{first_name}} {{last_name}}',value:'{{id}}'}},
        // ], actions: false},$(mymodal.ref.el).find('.modal-body')[0]);

        options.url = "/api/apps";
        // $(mymodal.ref.el).find('.modal-body').berry({
        //   attributes:instanceData,
        //   name:"modal", fields:[
        //     {label: 'Name', name:'name', required: true},
        //     {label: 'Description', name:'description', required: false, type:'textarea'},
        //     {label: 'Tags', name:'tags', required: false},
        //     {label: 'Lead Developer', name:'user_id', type:'select', choices: '/api/apps/developers', template:'{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}', required: false, value_key:'id',label_key:'email'},
        //       ],actions:false
        // })
        new $g.form(
          {
            data: instanceData,
            name: "modal",
            fields: [
              { label: "Name", name: "name", required: true },
              {
                label: "Description",
                name: "description",
                required: false,
                type: "textarea",
              },
              { label: "Tags", name: "tags", required: false },
              {
                label: "Lead Developer",
                name: "user_id",
                type: "select",
                choices: "/api/apps/developers",
                template:
                  "{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}",
                required: false,
                value_key: "id",
                label_key: "email",
              },
            ],
            actions: [],
          },
          mymodal.el.querySelector(".modal-body")
        );
      },
      onWorkflowCreate: function () {
        // myForm = new gform({name:"modal", attributes: instanceData, fields:[
        //   {label: 'Name', name:'name', required: true},
        //     {label: 'Description', name:'description', required: false, type:'textarea'},
        //     {label: 'Tags', name:'tags', required: false},
        //     {label: 'Lead Developer', name:'user_id', type:'select', options: '/api/apps/developers', required: false, format:{label:'{{first_name}} {{last_name}}',value:'{{id}}'}},
        // ], actions: false},$(mymodal.ref.el).find('.modal-body')[0]);        options.url = '/api/workflows';
        // $(mymodal.ref.el).find('.modal-body').berry({
        //   attributes:instanceData,
        //   name:"modal", fields:[
        //     {label: 'Name', name:'name', required: true},
        //     {label: 'Description', name:'description', required: false, type:'textarea'},
        //     {label: 'Tags', name:'tags', required: false},
        //     {label: 'Lead Developer', name:'user_id', type:'select', choices: '/api/apps/developers', template:'{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}', required: false, value_key:'id',label_key:'email'},
        //       ],actions:false
        // })

        new $g.form(
          {
            data: instanceData,
            name: "modal",
            fields: [
              { label: "Name", name: "name", required: true },
              {
                label: "Description",
                name: "description",
                required: false,
                type: "textarea",
              },
              { label: "Tags", name: "tags", required: false },
              {
                label: "Lead Developer",
                name: "user_id",
                type: "select",
                choices: "/api/apps/developers",
                template:
                  "{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}",
                required: false,
                value_key: "id",
                label_key: "email",
              },
            ],
            actions: [],
          },
          mymodal.el.querySelector(".modal-body")
        );
      },
      onGroupCreate: function () {
        options.url = "/api/groups";
        options.complete =
          "Successfully Created a Group!<br><br> Here are some next steps you may want to take:";

        // myForm = new gform({name:"modal", attributes: instanceData, fields:[
        //     {label: 'Name', name:'name', required: true},
        //     {label: 'Slug', name:'slug', required: true}
        // ], actions: false},$(mymodal.ref.el).find('.modal-body')[0]);

        // $(mymodal.ref.el).find('.modal-body').berry({
        //   attributes:instanceData,
        //   name:"modal", fields:[
        //     {label: 'Name', name:'name', required: true},
        //     {label: 'Slug', name:'slug', required: true}
        //   ],actions:false
        // })

        new $g.form(
          {
            data: instanceData,
            name: "modal",
            fields: [
              { label: "Name", name: "name", required: true },
              { label: "Slug", name: "slug", required: true },
            ],
            actions: [],
          },
          mymodal.el.querySelector(".modal-body")
        );
      },
      onUserCreate: function () {
        options.url = "/api/users";
        options.complete = "Successfully Created a user!";

        // $(mymodal.ref.el).find('.modal-body').berry({
        //   attributes:instanceData,
        //   name:"modal", fields:[
        //     {name:'first_name',label:"First Name"},
        //     {name:'last_name',label:"Last Name"},
        //     {name:'email',label:"Email",required:true,type:'email'},
        //     {name:'password',label:"Password",type:"password"},
        //     {name:'unique_id',label:"Unique ID",required:true}
        //   ],actions:false
        // })

        // myForm = new gform({name:"modal", attributes: instanceData, fields:[
        //   {name:'first_name',label:"First Name"},
        //   {name:'last_name',label:"Last Name"},
        //   {name:'email',label:"Email",required:true,type:'email'},
        //   {name:'password',label:"Password",type:"password"},
        //   {name:'unique_id',label:"Unique ID",required:true}
        // ], actions: false},$(mymodal.ref.el).find('.modal-body')[0]);

        new $g.form(
          {
            data: instanceData,
            name: "modal",
            fields: [
              { name: "first_name", label: "First Name" },
              { name: "last_name", label: "Last Name" },
              { name: "email", label: "Email", required: true, type: "email" },
              { name: "password", label: "Password", type: "password" },
              { name: "unique_id", label: "Unique ID", required: true },
            ],
            actions: [],
          },
          mymodal.el.querySelector(".modal-body")
        );
      },
      onPage: function () {
        options.url = "/api/pages";
        options.complete =
          "Successfully Created a Page!<br><br> Here are some next steps you may want to take:";

        // $(mymodal.ref.el).find('.modal-body').berry({
        //   attributes:instanceData,
        //   name:"modal", fields:[
        //     {label: 'Name', name:'name', required: true},
        //     {label: 'Slug', name:'slug', required: true},
        //     {label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
        //     {label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
        //     {label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
        //     {label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0, enabled:  {matches:{name:'limit', value: false}}}
        //   ],actions:false
        // })
        // myForm = new gform({name:"modal", attributes: instanceData, fields:[
        //   {label: 'Name', name:'name', required: true},
        //   {label: 'Slug', name:'slug', required: true},
        //   {label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
        //   {label: 'Unlisted', name:'unlisted', type: 'checkbox', options:[0,1] },
        //   {label: 'Limit Device', name: 'device', format:{value:'{{index}}'}, value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
        //   {label: 'Public', name:'public', type: 'checkbox', options:[0,1], enabled:  {matches:{name:'limit', value: false}}}

        // ], actions: false},$(mymodal.ref.el).find('.modal-body')[0]);
        new $g.form(
          {
            data: instanceData,
            name: "modal",
            fields: [
              ...fieldLibrary.content,
              // {label: 'Name', name:'name', required: true},
              // {label: 'Slug', name:'slug', required: true},
              // {label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
              // {label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
              // {label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
              // {label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0, enabled:  {matches:{name:'limit', value: false}}}
            ],
            actions: [],
          },
          mymodal.el.querySelector(".modal-body")
        );
      },
      onImage: function () {
        options.url = "/api/images";
        options.complete = "Successfully Created an Image!";

        // $(mymodal.ref.el).find('.modal-body').berry({
        //   attributes:instanceData,
        //   name:"modal", fields:[
        //     {type: 'upload', label: false, path: '/api/images?group_id='+instanceData.group_id, name: 'image_filename'}
        //   ],actions:false
        // })
        // myForm = new gform({name:"modal", attributes: instanceData, fields:[
        //   {type: 'upload', label: false, path: '/api/images?group_id='+instanceData.group_id, name: 'image_filename'}
        // ], actions: false},$(mymodal.ref.el).find('.modal-body')[0]);
        new $g.form(
          {
            data: instanceData,
            name: "modal",
            fields: [
              {
                type: "upload",
                label: false,
                path: "/api/images?group_id=" + instanceData.group_id,
                name: "image_filename",
              },
            ],
            actions: [],
          },
          mymodal.el.querySelector(".modal-body")
        );
      },
      onEndpoint: function () {
        options.url = "/api/endpoints";
        options.complete = "Successfully Created an Endpoint!";

        //     $(mymodal.ref.el).find('.modal-body').berry({
        //       flatten:false,
        //       attributes:instanceData,
        //       name:"modal", fields:[
        //         {label: 'Name', name:'name', required: true},
        //         {label: 'Auth Type', name:'type', type: 'select', choices:[
        //           {label:'HTTP No Auth', value:'http_no_auth'},
        //           {label:'HTTP Basic Auth', value:'http_basic_auth'},
        //         ], required: true},
        //         {label: 'Configuration', name:'config', showColumn:false, fields:[
        //           {label:'URL', required: false,parsable:'show', validate: {is_https:true}, show:{matches:{name:'type',value:'http_basic_auth'}}},
        //           {label:'URL', required: false,parsable:'show', show:{matches:{name:'type',value:'http_no_auth'}}},
        //           {label:'Username', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
        //           {label:'Password', 'name':'secret', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
        //           {label:'Content Type', 'name':'content_type', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show',type:"select",options:[
        //             {label:"Form Data (application/x-www-form-urlencoded)",value:'application/x-www-form-urlencoded'},
        //             {label:"JSON (application/json)",value:'application/json'},
        //             {label:"XML (application/xml)",value:'application/xml'},
        //             {label:"Plain Text (text/plain)",value:'text/plain'},
        //         ],'help':'Please specify the Content Type / Data Encoding your endpoint is expecting for POST / PUT / DELETE actions.  '+
        //         '<div><i>Note this only applies to data which is <b>sent to</b> the endpoint, not data which is received from the endpoint.</i></div>'},
        // ]}
        //       ],actions:false
        //     })

        new $g.form(
          {
            data: instanceData,
            name: "modal",
            fields: [
              { label: "Name", name: "name", required: true },
              {
                label: "Auth Type",
                name: "type",
                type: "select",
                options: [
                  { label: "HTTP No Auth", value: "http_no_auth" },
                  { label: "HTTP Basic Auth", value: "http_basic_auth" },
                ],
                required: true,
              },
              {
                label: "Configuration",
                type: "fieldset",
                name: "config",
                showColumn: false,
                fields: [
                  {
                    label: "URL",
                    required: false,
                    validate: [
                      {
                        type: "is_https",
                        conditions: [
                          {
                            type: "matches",
                            name: "type",
                            value: "http_basic_auth",
                          },
                        ],
                      },
                    ],
                    show: [],
                  },
                  {
                    label: "Username",
                    required: true,
                    show: [
                      {
                        type: "matches",
                        name: "type",
                        value: "http_basic_auth",
                      },
                    ],
                  },
                  {
                    label: "Password",
                    name: "secret",
                    required: true,
                    show: [
                      {
                        type: "matches",
                        name: "type",
                        value: "http_basic_auth",
                      },
                    ],
                  },
                  {
                    label: "Content Type",
                    name: "content_type",
                    required: true,
                    show: [
                      {
                        type: "matches",
                        name: "type",
                        value: "http_basic_auth",
                      },
                    ],
                    type: "select",
                    options: [
                      {
                        label: "Form Data (application/x-www-form-urlencoded)",
                        value: "application/x-www-form-urlencoded",
                      },
                      {
                        label: "JSON (application/json)",
                        value: "application/json",
                      },
                      {
                        label: "XML (application/xml)",
                        value: "application/xml",
                      },
                      { label: "Plain Text (text/plain)", value: "text/plain" },
                    ],
                    help:
                      "Please specify the Content Type / Data Encoding your endpoint is expecting for POST / PUT / DELETE actions.  " +
                      "<div><i>Note this only applies to data which is <b>sent to</b> the endpoint, not data which is received from the endpoint.</i></div>",
                  },
                ],
              },
            ],
            actions: [],
          },
          mymodal.el.querySelector(".modal-body")
        );
      },
      onAppinstance: function () {
        options.url = "/api/appinstances";
        options.complete =
          "Successfully Created an App Instance!<br><br> Here are some next steps you may want to take:";

        $.ajax({
          url: "/api/apps/" + instanceData.app_id + "/versions",
          success: function (versions) {
            // console.log(data);
            // data.unshift({id:0,label:'Latest Stable'})
            // data.unshift({id:-1,label:'Latest (working or stable)'})
            // $(mymodal.ref.el).find('.modal-body').berry({
            //     attributes:instanceData,
            //     name:"modal", fields:[
            //     {label: 'Version', name:'app_version_id', required:true, options:data,type:'select', value_key:'id',label_key:'label'},
            //     {label: 'Name', name:'name', required: true},
            //     {label: 'Slug', name:'slug', required: true},
            //     {label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
            //     {label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
            //     {label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
            //     {label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0, enabled:  {matches:{name:'limit', value: false}}}
            //   ],actions:false
            // })

            new $g.form(
              {
                data: instanceData,
                name: "modal",
                fields: [
                  {
                    label: "Version",
                    name: "app_version_id",
                    edit: false,
                    options: [
                      { id: -1, label: "Latest (Working or Published)" },
                      ...(versions.length
                        ? [{ id: 0, label: "Latest Published" }]
                        : []),
                      ...versions,
                    ],
                    type: "select",
                    format: {
                      value: version => version.id,
                      label: "{{label}}",
                    },
                    post: '<i class="fa fa-pencil" id="version"></i>',
                  },
                  ...fieldLibrary.content,
                  { name: "app_id", required: true, type: "hidden" },
                  { name: "id", type: "hidden" },
                ],
                actions: [],
              },
              mymodal.el.querySelector(".modal-body")
            );
          },
        });
      },
      onWorkflowinstance: function () {
        options.url = "/api/workflowinstances";
        options.complete =
          "Successfully Created a workflow Instance!<br><br> Here are some next steps you may want to take:";

        $.ajax({
          url: "/api/workflows/" + instanceData.workflow_id + "/versions",
          success: function (versions) {
            // console.log(data);
            // data.unshift({id:0,label:'Latest Stable'})
            // data.unshift({id:-1,label:'Latest (working or stable)'})
            // $(mymodal.ref.el).find('.modal-body').berry({
            //     attributes:instanceData,
            //     name:"modal", fields:[
            //     {label: 'Version', name:'app_version_id', required:true, options:data,type:'select', value_key:'id',label_key:'label'},
            //     {label: 'Name', name:'name', required: true},
            //     {label: 'Slug', name:'slug', required: true},
            //     {label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
            //     {label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
            //     {label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
            //     {label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0, enabled:  {matches:{name:'limit', value: false}}}
            //   ],actions:false
            // })

            new $g.form(
              {
                data: instanceData,
                name: "modal",
                fields: [
                  {
                    label: "Version",
                    name: "workflow_version_id",
                    edit: false,
                    options: [
                      { id: -1, label: "Latest (Working or Published)" },
                      ...(versions.length
                        ? [{ id: 0, label: "Latest Published" }]
                        : []),
                      ...versions,
                    ],
                    type: "select",
                    format: {
                      value: version => version.id,
                      label: "{{label}}",
                    },
                    post: '<i class="fa fa-pencil" id="version"></i>',
                  },
                  ...fieldLibrary.content,
                  { name: "workflow_id", required: true, type: "hidden" },
                  { name: "id", type: "hidden" },
                ],
                actions: [],
              },
              mymodal.el.querySelector(".modal-body")
            );
          },
        });
      },

      onPagegroup: selectGroup,
      onEndpointgroup: selectGroup,
      onLinkgroup: selectGroup,
      onImagegroup: selectGroup,
      onAppinstancegroup: selectGroup,
      onWorkflowinstancegroup: selectGroup,

      onApp: function () {
        // $(mymodal.ref.el).find('.modal-body').berry({
        //   attributes:instanceData,
        //     name:"modal", fields:[
        //       {label: 'App', name:'app_id', type:'select',satisfied:function(value){
        //         return (this.toJSON() !== "")
        //       },required:true, choices:'/api/apps', default:{"label":"Choose One","value":""}},
        //     ],actions:false
        //   })

        new $g.form(
          {
            data: instanceData,
            name: "modal",
            fields: [
              {
                label: "App",
                name: "app_id",
                type: "select",
                satisfied: function (value) {
                  return this.toJSON() !== "";
                },
                required: true,
                options: [
                  { label: "Choose One", value: "" },
                  { type: "optgroup", options: "/api/apps" },
                ],
              },
            ],
            actions: [],
          },
          mymodal.el.querySelector(".modal-body")
        );
      },
      onWorkflow: function () {
        // $(mymodal.ref.el).find('.modal-body').berry({
        //   attributes:instanceData,
        //     name:"modal", fields:[
        //       {label: 'Workflow', name:'workflow_id', type:'select',satisfied:function(value){
        //         return (this.toJSON() !== "")
        //       },required:true, choices:'/api/workflows', default:{"label":"Choose One","value":""}},
        //     ],actions:false
        //   })
        new $g.form(
          {
            data: instanceData,
            name: "modal",
            fields: [
              {
                label: "Workflow",
                name: "workflow_id",
                type: "select",
                satisfied: function (value) {
                  return this.toJSON() !== "";
                },
                required: true,
                options: [
                  { label: "Choose One", value: "" },
                  { type: "optgroup", options: "/api/apps" },
                ],
              },
            ],
            actions: [],
          },
          mymodal.el.querySelector(".modal-body")
        );
      },
      onAppinstancecomposite: selectComposite,
      onWorkflowinstancecomposite: selectComposite,
      onPagecomposite: selectComposite,
      onLink: function () {
        options.url = "/api/links";
        // $(mymodal.ref.el).find('.modal-body').berry({
        //   attributes:instanceData,
        //     name:"modal", fields:[
        //       {label: 'Title', name:'title', required: true},
        //       {label: 'Link', name:'link', required: true},
        //       {label: 'Image', name:'image'},
        //       {label: 'Icon', name:'icon',
        //       type:'select', choices:'/assets/data/icons.json'},
        //       {label: 'Color', name:'color'},
        //     ],actions:false
        //   })
        new $g.form(
          {
            data: instanceData,
            name: "modal",
            fields: [
              { label: "Title", name: "title", required: true },
              { label: "Link", name: "link", required: true },
              { label: "Image", name: "image" },
              fieldLibrary.icon,
              { label: "Color", name: "color" },
            ],
            actions: [],
          },
          mymodal.el.querySelector(".modal-body")
        );
      },
      onComplete: function () {
        location.reload();
      },
      onAfterTransition: function (e) {
        $(mymodal.ref.el)
          .find(".modal-footer")
          .find("[data-action]")
          .each(
            function (item) {
              item = $(mymodal.ref.el)
                .find(".modal-footer")
                .find("[data-action]")[item];
              if (
                this.transitions().indexOf($(item).attr("data-action")) == -1
              ) {
                $(item).hide();
              } else {
                $(item).show();
              }
            }.bind(this)
          );
      },
      onBeforeSubmit: function (e) {
        if (typeof gform.instances.modal !== "undefined") {
          if (gform.instances.modal.validate()) {
            $.extend(instanceData, gform.instances.modal.toJSON());
          } else {
            return false;
          }
        } else if (typeof gform.instances.modal != "undefined") {
          if (!gform.instances.modal.validate()) {
            return false;
          } else {
            $.extend(instanceData, gform.instances.modal.toJSON());
          }
        }
        $.ajax({
          url: options.url,
          type: "POST",
          data: instanceData,
          success: function (e) {
            toastr.success("", "Successfully Added");
            fsm.success(this, e);
          }.bind(e),
          error: function (e) {
            toastr.error(e.statusText, "ERROR");
            fsm.error(this, e);
          },
        });
      },
      onSubmit: function () {
        reset();
      },
      onBeforeError: function (e, history, item) {
        if (
          typeof item.responseJSON !== "undefined" &&
          item.responseJSON.error
        ) {
          toastr.error(item.responseJSON.error, "ERROR");
        }
      },
      onAfterSuccess: function (e, history, item) {
        var link = "";
        switch (history.from) {
          case "appCreate":
            instanceData.app_id = item.id;
            options.complete =
              "Successfully Created an App!<br><br> Here are some next steps you may want to take<div>" +
              "<a href='#' style='border-left-color:#31708f' class='list-group-action' data-action='createappinstance'><i class='fa fa-cubes'></i> Instanciate App</a>" +
              "<a href='/admin/apps/" +
              item.id +
              "' class='list-group-action'><i class='fa fa-cube'></i> Edit App</a>" +
              "<a href='#' class='list-group-action' data-action='other'><i class='fa fa-gear'></i> Other</a></div>";
            break;
          case "workflowCreate":
            instanceData.workflow_id = item.id;
            options.complete =
              "Successfully Created aa Workflow!<br><br> Here are some next steps you may want to take<div>" +
              "<a href='#' style='border-left-color:#31708f' class='list-group-action' data-action='createworkflowinstance'><i class='fa fa-check'></i> Instanciate Workflow</a>" +
              "<a href='/admin/workflows/" +
              item.id +
              "' class='list-group-action'><i class='fa fa-check-o'></i> Edit Workflow</a>" +
              "<a href='#' class='list-group-action' data-action='other'><i class='fa fa-gear'></i> Other</a></div>";
            break;
          case "groupCreate":
            instanceData.group_id = item.id;
            options.complete =
              "Successfully Created an App!<br><br> Here are some next steps you may want to take:<div>" +
              startContent +
              "<a href='/admin/groups/" +
              item.id +
              "' class='list-group-action'><i class='fa fa-users'></i> Manage Group</a>" +
              "<a href='#' class='list-group-action' data-action='other'><i class='fa fa-gear'></i> Other</a></div>";
            break;
          case "pagecomposite":
            link =
              "<br><br> Here are some next steps you may want to take:<div><a href='/page/" +
              item.group_id +
              "/" +
              item.slug +
              "' class='list-group-action'><i class='fa fa-file'></i> Visit Page</a>";
          default:
            instanceData.group_id = item.group_id;
            options.complete =
              "Created Successfully!" + link + "<div>Create New</div>";
            startContent +
              "<a href='#' class='list-group-action' data-action='other'><i class='fa fa-gear'></i> Other</a></div>";
        }
        $(mymodal.ref.el).find(".modal-body").html(options.complete);
        $(mymodal.ref.el)
          .find(".modal-body")
          .find("[data-action]")
          .each(
            function (item) {
              item = $(mymodal.ref.el)
                .find(".modal-body")
                .find("[data-action]")[item];
              if (
                this.transitions().indexOf($(item).attr("data-action")) == -1
              ) {
                $(item).hide();
              } else {
                $(item).show();
              }
            }.bind(this)
          );
      },
      onBeforeNext: function () {
        if (typeof gform.instances.modal !== "undefined") {
          if (!gform.instances.modal.validate()) {
            return false;
          } else {
            $.extend(instanceData, gform.instances.modal.toJSON());
          }
        } else if (typeof gform.instances.modal != "undefined") {
          if (!gform.instances.modal.validate()) {
            return false;
          } else {
            $.extend(instanceData, gform.instances.modal.toJSON());
          }
        }
        reset();
      },
      onBeforePrevious: reset,
      onBeforeCancel: function (e) {
        if (e.from !== e.to) {
          reset();
        }
      },
      onBeforeOther: reset,
    },
  };

  // options.legend = '<span class="text-primary"><i class="fa fa-file"></i> New Page</span>';
  // options.legend = '<span class="text-warning"><i class="fa fa-crosshairs"></i> New Endpoint</span>';
  // options.legend = '<span style="color:#444"><i class="fa fa-link"></i> New Link</span>';
  // options.legend = '<span style="color:#555"><i class="fa fa-file"></i> New Image</span>';
  // options.legend = '<span style="color:#d85e16"><i class="fa fa-cube"></i> New Micro App</span>';
  // options.legend = '<span style="color:#44a77f"><i class="fa fa-users"></i> New Group</span>';
  // options.legend = '<span style="color:#333"><i class="fa fa-user"></i> New User</span>';
  // options.legend = '<span class="text-info"><i class="fa fa-cubes"></i> New Micro App Instance</span>';

  mymodal = modal({
    title: options.legend,
    content:
      '<center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center>',
    footer:
      '<span class="btn btn-default" data-action="previous"><i class="fa fa-arrow-left"></i> Back</span><span class="btn btn-info" data-action="next"><i class="fa fa-arrow-right"></i> Next</span><span class="btn btn-success" data-action="submit"><i class="fa fa-check"></i> Create</span><span class="btn btn-primary" data-action="complete"><i class="fa fa-check"></i> Done</span>',
  });
  fsm = new StateMachine(options);
};
$("#graphene-quick-create").on("click", createEngine);
// $('body').on('click','[data-action]',function(e){
//   fsm[e.currentTarget.dataset.action]()
// })
