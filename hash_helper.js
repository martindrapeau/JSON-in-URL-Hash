Hash = {
	// Sets the encode and decode functions. If omitted, no
	// translation is performed and the JSON is put directly
	// into the Hash. For example, you could encode the hash
	// in a base64 string.
	translateFunctions: function(encode, decode) {
		this.encode = encode;
		this.decode = decode;
		return this;
	},
	
	// Sets attributes in the hash. Will overwrite
	// any existing attribute with the same names.
	set: function(attributes) {
		var object = this._getHashAsObject();
		for (attr in attributes) object[attr] = attributes[attr];
		var json_string = JSON.stringify(object).replace(/"/g,'');
		if (this.encode) json_string = this.encode(json_string);
		document.location.hash = json_string;
		return this;
	},
	
	// Gets an attribute from the hash. If argument attr
	// is not specified, returns the entire hash as an object.
	get: function(attr) {
		var object = this._getHashAsObject();
		if (!attr) return object;
		return object[attr];
	},
	
	// Returns true if the Hash object is empty
	isEmpty: function() {
		var object = this._getHashAsObject();
		for (var key in object) if (object.hasOwnProperty(key)) return false;
		return true;
	},
	
	// Removes an attribute from the hash.
	remove: function(attr) {
		var object = this._getHashAsObject();
		object[attr] = undefined;
		var json_string = JSON.stringify(object).replace(/"/g,'');
		if (this.encode) json_string = this.encode(json_string);
		document.location.hash = json_string;
		return this;
	},
	
	// Private helper function to retrieve the JSON object
	// from the hash. On ill-formed JSON string, returns 
	// an empty object.
	_getHashAsObject: function() {
		var hash = document.location.hash.replace('#','');
		// Replace escaped curly braces
		hash = hash.replace(/%7B/g, '{');
		hash = hash.replace(/%7D/g, '}');
		hash = hash.replace(/%5B/g, '[');
		hash = hash.replace(/%5D/g, ']');
		// Introduce double quotes on non-numeric strings
		hash = hash.replace(/(['"])?([a-zA-Z0-9_\-]+)(['"])?:/g, '"$2":');
		hash = hash.replace(/(['"])?([a-zA-Z0-9_\-]*[a-zA-Z_\-]+[a-zA-Z0-9_\-]*)(['"])?/g, '"$2"');
		hash = hash.replace(/,,/g, ',"",').replace(/\[,/g, '["",').replace(/,\]/g, ',""]');
		if (this.decode) hash = this.decode(hash);
		var object = {};
		try {object = JSON.parse(hash);} catch(err) {}
		return object;
	},
	
	// Returns the URL without the hash
	getUrlNoHash: function() {
		var pieces = document.location.href.split('#');
		return pieces[0];
	},
	
	// Builds a URL with a hash and returns it as it would
	// be set in the address bar. Does not modify the actual
	// hash in the address bar.
	buildUrl: function(attributes) {
		var url = Hash.getUrlNoHash();
		if (!attributes) return url;
		
		var hash_string = JSON.stringify(attributes).replace(/"/g,'');
		if (this.encode) hash_string = Hash.encode(hash_string);
		return url+'#'+hash_string;
	}
};