/**
 * Emulate FormData for some browsers
 * MIT License
 * (c) 2010 François de Metz
 * (c) 2016 Vladimir Kuzmin
 */
(function(w) {
    if (w.FormData)
        return;
    function FormData() {
        this.fake = true;
        this.boundary = "--------FormData" + Math.random();
        this._fields = [];
    }
    FormData.prototype.append = function(key, value) {
        this._fields.push([key, value]);
    }
    FormData.prototype.toString = function() {
        var boundary = this.boundary;
        var body = "";
        this._fields.forEach(function(field) {
            body += "--" + boundary + "\r\n";
            // file upload
            if (field[1].name) {
                var file = field[1];
                body += "Content-Disposition: form-data; name=\""+ field[0] +"\"; filename=\""+ file.name +"\"\r\n";
                body += "Content-Type: "+ file.type +"\r\n\r\n";
                body += file.getAsBinary() + "\r\n";
            } else {
                body += "Content-Disposition: form-data; name=\""+ field[0] +"\";\r\n\r\n";
                body += field[1] + "\r\n";
            }
        });
        body += "--" + boundary +"--";
        return body;
    }
	
	FormData.prototype.get = function(key) {
		var result = null;
		for(var i = 0, len = this._fields.length; i < len; i++) {
			if(this._fields[i][0] === key ) {
				result = this._fields.[i][1];
				break;
			}
		}
		
		return result;
	}
	
	FormData.prototype.getAll = function(key) {
		var result = [];
		for(var i = 0, len = this._fields.length; i < len; i++) {
			if(this._fields[i][0] === key ) {
				result.push(this._fields.[i][1]);				
			}
		}
		
		return result;
	}
	
	FormData.prototype.delete = function(key) {
		var new_fields = [];
		for(var i = 0, len = this._fields.length; i < len; i++) {
			if(this._fields[i][0] !== key ) {
				new_fields.push(this._fields[i][0], this._fields.[i][1]);				
			}
		}
		
		this._fields = new_fields;
	}
	
	
	
    w.FormData = FormData;
})(window);