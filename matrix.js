//     ___ _     _          _   _        _                  
//    / __| |___| |__  __ _| | | |_  ___| |_ __  ___ _ _ ___
//   | (_ | / _ \ '_ \/ _` | | | ' \/ -_) | '_ \/ -_) '_(_-<
//    \___|_\___/_.__/\__,_|_| |_||_\___|_| .__/\___|_| /__/
//                                        |_|               
var I = function(dims){
	return scl([], dims);
}
//-----------------------------------------------------------------------------
var scl = function(sclVec, size){
	// construct a result matrix
	var r = new Array(size || sclVec.length);
	for(var i = size; i--; ){
		r[i] = new Array(size);
		for(var j = size; j--;){
			// copy proper scale factors for each
			// dimension of the matrix
			if(i == j)
				if(i < sclVec.length) 
					r[i][j] = sclVec[i];
				else
					r[i][j] = 1;
			else
				r[i][j] = 0;
		}
	}

	return r;
};
//-----------------------------------------------------------------------------
var rot2d = function(theta, size){
		// construct a result matrix
	var r = new Array(size);
	for(var i = size; i--; ){
		r[i] = Array
			.apply(null, new Array(r.length))
			.map(Number.prototype.valueOf,0);
	}

	var c = Math.cos(theta), s = Math.sin(theta);

	r[0][0] = c; r[1][0] = -s;
	r[0][1] = s; r[1][1] =  c;
	r[2][2] = 1;

	return r;
};
//-----------------------------------------------------------------------------
//    __  __     _   _            _    
//   |  \/  |___| |_| |_  ___  __| |___
//   | |\/| / -_)  _| ' \/ _ \/ _` (_-<
//   |_|  |_\___|\__|_||_\___/\__,_/__/
//
([]).__proto__._compat = function(m){
	try{
		return this[0].length == m.length &&
		       this.length == m[0].length;
	}
	catch(ex){
		console.log('_compat(): ', ex);
		return false;
	}
};
//-----------------------------------------------------------------------------
([]).__proto__.add = function(m){
	if(!this._compat(m)) return null;

	// construct a result matrix
	var r = new Array(m.length);
	for(var i = r.length; i--; r[i] = new Array(this.length));

	// add
	for(var i = 0; i < r.length; i++){
		for(var j = 0; j < r[0].length; j++){
			r[i][j] = this[i][j] + m[i][j];
		}
	}

	return r;
};
//-----------------------------------------------------------------------------
([]).__proto__.sub = function(m){
	if(!this._compat(m)) return null;

	// construct a result matrix
	var r = new Array(m.length);
	for(var i = r.length; i--; r[i] = new Array(this.length));

	// subtract
	for(var i = 0; i < r.length; i++){
		for(var j = 0; j < r[0].length; j++){
			r[i][j] = this[i][j] - m[i][j];
		}
	}

	return r;
};
//-----------------------------------------------------------------------------
([]).__proto__.X = ([]).__proto__.mul = function(m){
	// make sure m's row matches this's column length
	if(!this._compat(m)) return null;
	
	// construct a result matrix
	var r = new Array(m.length);
	for(var i = r.length; i--; r[i] = new Array(this.length));

	// multiply
	for(var i = 0; i < r.length; i++){
		for(var j = 0; j < r[0].length; j++){
			r[i][j] = 0;
			for(var k = 0; k < r[0].length; r[i][j] += this[k][j] * m[i][k++]);
		}
	}

	return r;
};
//-----------------------------------------------------------------------------
([]).__proto__.o = ([]).__proto__.dot = function(vector){
	if(!this._compat(vector) || this.length > 1) return NaN;

	var s = 0;
	for(var i = this[0].length; i--; s += this[0][i] * vector[0][i]);
	return s;
};
//-----------------------------------------------------------------------------
([]).__proto__.x = ([]).__proto__.cross = function(v){
	if(!this._compat(vector) || this.length > 1 || this[0].length == 3) return null;

	var t = this;
	return [
		[t[1] * v[2] - t[2] * v[1]],
		[t[2] * v[0] - t[0] * v[2]],
		[t[0] * v[1] - t[1] * v[0]]
	];
};
//----------------------------------------------------------------------------
([]).__proto__.normalize = function(){
	var r = [ new Array(this[0].length) ];
	

};
//----------------------------------------------------------------------------
([]).__proto__.distSqr = function(vector){
	return this.o(vector);
};
//----------------------------------------------------------------------------
([]).__proto__.dist = function(vector){
	return Math.sqrt(this.o(vector));
};
//-----------------------------------------------------------------------------
([]).__proto__.translate = function(position){
	for(var i = 0; i < position.length; i++)
		this[this.length - 1][i] = position[i];
	return this;
};
//-----------------------------------------------------------------------------
([]).__proto__.serialize = function(args){
	var str = '';
	if(typeof(args) == 'string'){
		switch(args){
			case 'svg':
				str = 'M';
				for(var i = 0; i < this.length; i++){
					var col = this[i], len = col.length > 2 ? 2 : col.length;
					for(var j = 0; j < len;)
						 str += col[j].toFixed(3) + (j++ == len - 1 ? '' : ',');
					str += (i == this.length - 1 ? '' : ',');
				}
				break;
		}
	}
	return str;
};
//----------------------------------------------------------------------------
([]).__proto__.mat4FromQuat = function(isColumnMajor){
	var q = this;
	var x = q[0], y = q[1], z = q[2], w = q[3];
	var xx = x * x, yy = y * y, zz = z * z, ww = w * w;
	if(isColumnMajor){
		return [
			ww+xx-yy-zz, 2*x*y+2*w*z, 2*x*z-2*w*y, 0,
			2*x*y-2*w*z, ww-xx+yy-zz, 2*y*z+2*w*x, 0,
			2*x*z+2*w*y, 2*y*z+2*w*x, ww-xx-yy+zz, 0,
			0,           0,           0,           1 
		];
	}
	else{
		return [
			[ ww+xx-yy-zz, 2*x*y-2*w*z, 2*x*z+2*w*y, 0 ],
			[ 2*x*y+2*w*z, ww-xx+yy-zz, 2*y*z+2*w*x, 0 ],
			[ 2*x*z-2*w*y, 2*y*z-2*w*x, ww-xx-yy+zz, 0 ],
			[ 0,           0,           0,           1 ] 
		];
	}
}
