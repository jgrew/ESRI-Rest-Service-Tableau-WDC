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

		$.getJSON(tableau.connectionData + '?f=pjson', function(resp) {
			// tableau.log(resp);

			tableau.connectionName = tableau.connectionName + ': ' + resp.name

			var fields = resp.fields;

			var feature_cols = fields.map(function (currentObject) {
				return {
					id: currentObject.name,
					alias: currentObject.alias,
					dataType: ESRITableauDataTypeMap[currentObject.type]
				};
			});

			if (resp.geometryType == 'esriGeometryPoint') {
				feature_cols.push({
					id: 'x',
					alias: 'x',
					dataType: tableau.dataTypeEnum.float	
				});
				feature_cols.push({
					id: 'y',
					alias: 'y',
					dataType: tableau.dataTypeEnum.float	
				});
			}
			// tableau.log(feature_cols);

			var feature_info = {
				id : "FeatureService",
				alias : "ESRI Feature Service",
				columns : feature_cols
			};

			//tableau.log(feature_info);

			schemaCallback([feature_info]);
		})
	};

	myConnector.getData = function(table, doneCallback) {
		$.getJSON(tableau.connectionData + '/query?where=OBJECTID>3D1&outFields=*&f=pjson', function(resp) {
			// tableau.log(resp);

			// tableau.log(table);
			var feature_data = resp.features;
			var tableData = [];

			tableau.log(feature_data.length);

			for (var i = 0, len = feature_data.length; i < len; i++) {

				var dataObject = {};

				for (var j = 0, len_two = table.tableInfo.columns.length; j < len_two; j++) {
					// tableau.log(table.tableInfo.columns[j]);
					// tableau.log(feature_data[i]);

					var key = table.tableInfo.columns[j].id;

					if (key == 'x') {
						var value = feature_data[i].geometry[key];
					} else if (key == 'y') {
						var value = feature_data[i].geometry[key];
					} else {
						var value = feature_data[i].attributes[key];
					}

					if (table.tableInfo.columns[j].dataType == 'datetime') {
						value = new Date(value);
						value = value.toString();
					}


					dataObject[key] = value

					// tableau.log(dataObject);

					
				}

				tableData.push(dataObject);
			}

			tableau.log(tableData);
		table.appendRows(tableData);
		doneCallback();

		})
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
 		$("#submitButton").click(function() { 
             setupConnector();
         });
         $('#restServiceForm').submit(function(event) {
             event.preventDefault();
             setupConnector();
         });
	})

})();