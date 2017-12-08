# gaari-rss

`gaari-rss` is a twitter bots with rss feeds. [幻月があり][e79fb6a1]

  [e79fb6a1]: https://twitter.com/GaariRSS "幻月があり"

## Installation

```bash
$ npm install
```

then input `gaari-rss.sql` to your mysql database

## Config

copy `config.json.example` to `config.json`, there are some params below:

param name | description                                 | required
---------- | ------------------------------------------- | --------
db         | config your mysql db                        | true
feeds      | config your rss feeds list                  | true
twitter    | config your Twitter API keys                | true
schedule   | config your Twitter bots schedule with cron | false
feedparser | config feedparser for rss                   | false
yourls     | config your yourls shorturl rest api        | false

each param has a `.js` file under `config` dir , which you can find and modify it's default value.

## Run

run on front:

```bash
$ node index.js
```

or use `pm2` tools:

```bash
$ npm install pm2 -g
$ pm2 start pm2.json
```

## License

gaari-rss is licensed under the MIT license. (<http://opensource.org/licenses/MIT>)
