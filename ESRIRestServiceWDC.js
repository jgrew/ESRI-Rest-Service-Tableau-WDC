(function() {
	var myConnector = tableau.makeConnector()

	var ESRITableauDataTypeMap = {
        esriFieldTypeString:  tableau.dataTypeEnum.string,
        esriFieldTypeDouble:  tableau.dataTypeEnum.float,
        esriFieldTypeOID:  tableau.dataTypeEnum.int,
        esriFieldTypeGlobalID:  tableau.dataTypeEnum.int,
        esriFieldTypeSmallInteger:  tableau.dataTypeEnum.int,
        esriFieldTypeDate:  tableau.dataTypeEnum.datetime
    }

	myConnector.getSchema = function(schemaCallback) {
		//tableau.log("Hello WDC!");

		$.getJSON(tableau.connectionData + '?f=pjson', function(resp) {
			//tableau.log(resp);

			tableau.connectionName = tableau.connectionName + ': ' + resp.name

			var fields = resp.fields;

			var feature_cols = fields.map(function (currentObject) {
				return {
					id: currentObject.name,
					alias: currentObject.alias,
					dataType: ESRITableauDataTypeMap[currentObject.type]
				};
			});

			//tableau.log(feature_cols);

			var feature_info = {
				id : resp.name,
				alias : "ESRI Feature Service",
				columns : feature_cols
			};

			//tableau.log(feature_info);

			schemaCallback([feature_info]);
		})
	};

	myConnector.getData = function(table, doneCallback) {
		$.getJSON(tableau.connectionData + '/query?where=OBJECTID>3D1&outFields=*&f=pjson', function(resp) {
			tableau.log(resp);

			var features = resp.features,
				tableData = [];

			tableData = features.map(function (currentObject){
				return
			});

		})

		//table.appendRows(tableData);
		doneCallback();
	};

	setupConnector = function() {
         var restServiceUrl = $('#restServiceUrl').val().trim();
         if (restServiceUrl) {
             tableau.connectionData = restServiceUrl;
             tableau.connectionName = 'ESRI Feature Service';
             tableau.submit();
         }
     };

	tableau.registerConnector(myConnector);

	$(document).ready(function() {
 		$("#submitButton").click(function() { // This event fires when a button is clicked
             setupConnector();
         });
         $('#restServiceForm').submit(function(event) {
             event.preventDefault();
             setupConnector();
         });
	})

})();