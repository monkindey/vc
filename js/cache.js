(function() {
	var LIMIT = 10;
	var displayCache = new Cache(LIMIT);
	var framework = {
		react: '48,623',
		angular: '51,917',
		d3: '54,502',
		jquery: '41,273',
		electron: '35,147',
		three: '27,311',
		vue: '26,442',
		glup: '22,999',
		redux: '22,765',
		_: '18,988',
		lodash: '18,613',
		webpack: '18,298'
	};

	var names = Object.keys(framework);
	var name = '';

	for (var i = 0; i < 3; i++) {
		name = names[i];
		displayCache.put(name, framework[name]);
	}

	Vue.filter('getEntries', getEntries);
	Vue.filter('getRemoved', function() {
		return this.removed.map(function(entry) {
			return entry.key + '\n' + entry.value
		})	
	});

	Vue.filter('semantic', function() {
		var html;
		if (this.op === 'put') {
			html = '<span>将<em class="text">' + this.entry + '</em>塞入到缓存里</span>';
			if(this.removed.length > 0) {
				html += ', 并把<em class="text">' + this.removed[this.removed.length - 1].key + '</em>踢出去';
			}
			return html;
		} else if (this.op === 'get') {
			if(!this.entry) {
				return '该框架不存在此缓存里';
			}else {
				return '<span>在缓存里查找<em class="text">' + this.entry + '</em>, 并且将它放到队尾</span>';
			}
		}else {
			return '暂无操作';
		}
	})

	function getEntries(cache) {
		var entries = []
		var entry = cache.head;
		while (entry) {
			entries.push(entry.key + '\n' + entry.value);
			entry = entry.newer;
		}
		return entries;
	}

	var vm = new Vue({
		el: '#cache',
		data: {
			canShow: false,
			limit: 10,
			entries: displayCache,
			removed: [],
			name: '',
			op: '',
			entry: ''
		},
		computed: {
			remain: function() {
				return this.limit - this.entries.size;
			}
		},
		events: {
			'hook:compiled': function() {
				alert(31313);
			}
		},
		methods: {
			put: function() {
				var removed;
				if (i < names.length) {
					removed = displayCache.put(names[i], framework[names[i]]);
					this.entries = Object.assign({}, displayCache);
					this.op = 'put';
					this.entry = names[i];
					i++;
				}

				if(removed) {
					this.removed.push(removed)
				}
			},
			get: function() {
				if(this.name.trim() === '') return;
				var ret = displayCache.get(this.name);
				this.entries = Object.assign({}, displayCache);
				this.op = 'get';
				this.entry = ret ? this.name : undefined;
				this.name = '';
			}
		}
	});
})()