(function(window) {
	function metaRedirect(path) {
		var encodedPath = encodeURI(path)
		var meta = document.createElement('meta')
		meta.httpEquiv = 'refresh'
		meta.content = '0;url=' + encodedPath

		document.head.appendChild(meta)

		setTimeout(function() {
			document.location = path
		}, 1000)
	}

	function get(needToDecode) {
		var hash = removeHashFromPath(window.location.hash)
		return needToDecode ? decodeURI(hash) : hash
	}

	function removeHashFromPath(path) {
		return (path && path[0] === '#') ? path.substr(1) : path
	}

	function getNeedToDecode() {
		var a = document.createElement('a')
		a.href = '#x x'
		return !/x x/.test(a.hash)
	}

	var intendedDestination = get(getNeedToDecode())
	var match = intendedDestination.match(/\!\/post\/(.+)/)
	if (match) {
		var redirectableDestination = match[1]
		metaRedirect('./' + redirectableDestination)
	}
})(this)
