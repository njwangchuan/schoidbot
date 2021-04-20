# schoidbot

`schoidbot` is a twitter bot   with rss feeds. [幻月があり][e79fb6a1]

[e79fb6a1]: https://twitter.com/schoidbot "幻月があり"

## System requre

```
Node.js v10
Twitter developer account
```

## Installation

```bash
$ npm install
```

then input `gaari-rss.sql` to your mysql database

## Config

copy `config.json.example` to `config.json`, there are some params below:

| param name | description                    | required |
| ---------- | ------------------------------ | -------- |
| db         | mysql db                       | true     |
| feeds      | rss feeds list                 | true     |
| twitter    | Twitter API keys               | true     |
| schedule   | Twitter bot schedule with cron | false    |
| feedparser | feedparser for rss             | false    |
| yourls     | yourls shorturl rest api       | false    |

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
