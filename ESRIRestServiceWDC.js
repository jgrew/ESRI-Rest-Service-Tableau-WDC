(function() {
	var myConnector = tableau.makeConnector()

	myConnector.getSchema = function(schemaCallback) {
		tableau.log("Hello WDC!");

		$.getJSON(tableau.connectionData + '?f=pjson', function(resp) {
			tableau.log(resp);

			tableau.connectionName = tableau.connectionName + ': ' + resp.name

			var fields = resp.fields;

			feature_cols = fields.map(function (currentObject) {
				return {
					id: currentObject.name,
					alias: currentObject.alias,
					dataType: currentObject.type
				};
			});

			tableau.log(feature_cols);

			var feature_info = {
				id : resp.name,
				alias : "ESRI Feature Service",
				columns : feature_cols
			};

		})


	};

	myConnector.getData = function(table, doneCallback) {

	};

	convertDataType = function(typeESRI) {
		switch (typeESRI) {
			case 'esriFieldTypeOID':
				type = tableau.dataTypeEnum.float;
				break;
			case 'esriFieldTypeString':
				type = tableau.dataTypeEnum.string;
				break;
			case 'esriFieldTypeDouble':
				type = tableau.dataTypeEnum.float;
				break;
			case 'esriFieldTypeDate':
				type = tableau.dataTypeEnum.date;
				break;
		}
	}

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