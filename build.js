import meta from './meta.js'

const SAY = (...args) => console.log(...args)

import * as cheerio from 'cheerio'
import fs from 'fs'

const SITE = 'https://heresybeats.bandcamp.com'

const embed = (item) => `
	<div class="bandcamp-embed">
		<iframe 
			title="${item.artist} - ${item.title} player"
			fetchpriority="high"
			style="width:100%;height:9999px"
			src="${item.embedUrl}" 
			seamless>
			${item.artist} - ${item.title} (released ${item.date})
		</iframe>
	</div>`
const template = (item) => {
	const isoDate = new Date(item.date).toISOString().split('T')[0]
	
	return `
	<article class="release" itemscope itemtype="https://schema.org/MusicRelease">
		<header class="meta">
			<a class="label" href="${item.url}" >${item.url.split('.')[0].substring(8)}</a>
			<span class="sep">/</span>
			<a class="id" href="${item.url}" itemprop="identifier">${item.labelId}</a>
			<span class="sep">/</span>
			<time class="date" itemprop="datePublished" datetime="${isoDate}" >${item.date}</time>
		</header>

		<div class="release-inner">
			<h2 itemprop="name">
				<a href="${item.url}" title="[${item.labelId}] ${item.titleName || item.artistName}">
					<span class="title">${item.titleName || item.artistName}</span>
				</a>
			</h2>
			<div class="player" itemprop="workExample" itemscope itemtype="https://schema.org/AudioObject">

				${embed(item)}
			</div>

			<footer>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
				  	<circle cx="50" cy="50" r="50" fill="#CCCCCC" />
				</svg>
			</footer>
		</div>
	</article>`
}
const run = async () => {

	let outputHtml = fs.readFileSync('./template.html', { encoding: 'utf8' })

	for (const [id,value] of Object.entries(meta)) {
		outputHtml = outputHtml.replaceAll(`"$${id}"`, JSON.stringify(value))
		outputHtml = outputHtml.replaceAll(`$${id}`, String(value))
	}


	const data = await Promise.all(meta.websiteBandcamps.reverse().map(async (path) => {
		const url = path.startsWith('http') ? path : `${SITE}${path}`
		const itemRes = await fetch(url)
		const itemHtml = await itemRes.text()
		const $$ = cheerio.load(itemHtml)

		const albumData = JSON.parse($$('script[data-tralbum]').attr('data-tralbum') || '{}')
		
		const title = $$('.trackTitle').first().text().trim()
		const [labelId, artistName, titleName] = title.split('-').map(bit => bit.trim())
		const image = $$('#tralbumArt img').attr('src')
		const artist = albumData.artist
		const titleId = albumData.id
		const date = (new Date(albumData.current.release_date)).toUTCString().substring(5,17)

		return {
			artist,
			artistName,
			title,
			titleName,
			titleId,
			labelId,
			image,
			url,
			date,
			embedUrl: `https://bandcamp.com/EmbeddedPlayer/album=${titleId}/size=large/bgcol=ffffff/linkcol=ffffff/tracklist=true`
		}
	}))

	let contentHtml = ''
	for (const item of data) contentHtml += template(item)

	outputHtml = outputHtml.replace('$websiteContent', contentHtml)


	fs.writeFileSync('docs/index.html', outputHtml, 'utf8')
	// SAY('HTML OUTPUT:', outputHtml)
}

run()