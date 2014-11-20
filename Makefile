grunt:
	./node_modules/.bin/grunt

cloc:
	cloc --exclude-dir=node_modules,components .

import-data:
	 @./scripts/clean-collections localhost/xingwall-development > /dev/null
	 @./scripts/import-test-profiles test-dataset.json | mongo localhost/xingwall-development >/dev/null
	 @id=$$(./scripts/create-test-wall localhost/xingwall-development) && echo http://localhost:3000/walls/$$id
