const { Plugin } = require('powercord/entities')
const { get } = require('powercord/http')
const Settings = require('./Settings')

module.exports = class TextReact extends Plugin {
    startPlugin() {
        this.registerSettings('quick-search', 'Quick Search', Settings)

        this.registerCommand('search', [],
            'Quick search things in ddg.',
            '{c} <query>',
            async args => {
                if(!args[0]) {
                    return { result: 'The search query cannot be empty.' }
                }

                const query = encodeURIComponent(args.join(' ')).replace(/%20/g, '+')
                const req = await get('https://duckduckgo.com/html').query('q', query)
                if(req.statusCode != 200) return { result: 'Something went wrong :(' }
                
                let result = { type: 'rich', title: 'Search results', description: '', color: 0xe98622 }
                const res = new DOMParser().parseFromString(req.body.toString(), 'text/html')

                if(this.settings.get('showInstantAnswear') && res.querySelector('.zci')) {
                    let title = res.querySelector('.zci__heading'), url = title.querySelector('a').getAttribute('href')
                    let zres = res.querySelector('.zci__result'), r = zres.textContent.trim().split('\n')
                    r[1] = `[[${r.pop().trim()}]](${url})`

                    console.log( zres.querySelector('img').getAttribute('src'))
                    result.author = { name: title.textContent.trim(), url, icon_url: zres.querySelector('img').getAttribute('src') }
                    result.description += `${r.join('\n')}\n\n**Search results**\n`
                    delete result.title
                }
                
                res.querySelectorAll('.result>.result__body').forEach((r, i) => {
                    if(i >= this.settings.get('maxResults', 3)) return
                    if(result.description != '') result.description += '\n'
                    const url = decodeURIComponent(r.querySelector('.result__url').getAttribute('href').replace('/l/?kh=-1&uddg=', ''))
                    result.description += `**[${r.querySelector('.result__a').textContent}](${url})**`
                    result.description += `\n${r.querySelector('.result__snippet').textContent}\n`
                })

                if(this.settings.get('showSearchInBrowser')) {
                    result.description += `\n[[Google]](https://www.google.com/search?q=${query}) | [[DuckDuckGo]](https://duckduckgo.com/?q=${query})`
                }

                return { result }
            }
        )
    }
}
