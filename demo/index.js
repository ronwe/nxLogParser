var NginxParser = require('../lib/index.js')
var logFormat =
			'[$remote_addr] - [$remote_user] [$time_local] [$request] '
		+	'[$status]  [$http_referer] '
		+	'[$http_user_agent] [$http_x_forwarded_for] [$request_time]  '

var p = new NginxParser(logFormat)
p.test(
	'[172.17.64.31] - [-] [09/Nov/2015:19:02:52 +0800] [GET /noop HTTP/1.1] [204]  [http://abc.com/share/item] [Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36] [-] [0.000]  [0.000]'
)

p.read('/usr/local/nginx/logs/access.log'
	,{}
	,function(row){
		console.log(row)
	}
	,function(err){
	}
)
