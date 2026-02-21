const artistGenres = 'techno, house, afrobeat, breaks, garage, dnb, jungle, leftfield'
const artistName = 'Venison'
const artistDesc = `Venison is the techno alias of pioneering Jungle and Drum & Bass producer Chris Inperspective`
const artistTags = 'techno, house, afrobeat, breaks, garage, independent artists'
const artistEmail = 'hello@venisonmusic.com'
const artistLinks = 'https://soundcloud.com/venisonbeats https://instagram.com/venisonbeats'

const config = {

	websiteUrl: 'https://venisonmusic.com',
	websiteName: artistName,
	websiteLogo: 'venison_logo.jpg',
	websiteImage: 'venison_music.jpg',
	websiteTitle: artistName,
	websiteDesc: artistDesc,
	websiteEmail: artistEmail,
	websiteKeywords: [
		...artistTags.split(',').map(tag => tag.trim()),
		...artistGenres.split(',').map(genre => genre.trim()),
		artistName.toLowerCase()
	].join(', '),
	websiteLinks: artistLinks.split(' ').map(link => link.trim()),
	websiteGenres: artistGenres.split(',').map(link => link.trim()),
	websiteYear: (new Date()).getFullYear(),
	websiteFooterLinks: '<ul>' + [ artistEmail, ...artistLinks.split(' ') ].map( link => {

		link = link.trim()
		if (link.includes('@')) {
			return `<li><address aria-label="email"><a href="mailto:${link}">${link}</a></address></li>`
		} else {

			const name = link.split('/').filter(bit => {
				return bit != '' && bit != 'http:' && bit != 'https:' && bit != 'www'
			}).join('/')

			console.log('NAME', name)
			return `<li><a itemprop="sameAs" aria-label="${name}" href="${link}">${name}</a></li>`
		}
	}).join('\n') + '</ul>',
	websiteDateString: String(Number(new Date)),
	websiteBandcamps: [
		'https://heresybeats.bandcamp.com/album/hsy003-venison-pink-castle-park-ep',
		'https://papertape.bandcamp.com/album/clc001-weaponized-incompetence',
		'https://papertape.bandcamp.com/album/clc002-florisstraat',
		'https://papertape.bandcamp.com/album/clc003-gaffelstraat',
		'https://papertape.bandcamp.com/album/clc004-tiendplein',
		'https://papertape.bandcamp.com/album/clc005-zuidzijde'
	]

}

export default config