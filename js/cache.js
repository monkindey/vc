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
		if (this.op === 'put') {
			return '将' + this.entry + '塞入到缓存里';
		} else if (this.op === 'get') {
			return '在缓存里查找' + this.entry + ', 并且将它放到队尾';
		}else {
			return '暂无操作'
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
				this.canShow = true;
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
				displayCache.get(this.name);
				this.entries = Object.assign({}, displayCache);
				this.op = 'get';
				this.entry = this.name;
				this.name = '';
			}
		}
	});
})()