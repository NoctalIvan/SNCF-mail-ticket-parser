/* ticket html -> json parser function */

module.exports = (sourceHTML) => {
  // pre-formatting
  let html = sourceHTML
    // rm line breaks & multiple spaces
    .replace(/(\s|\\r|\\n|&nbsp;)+/g, ' ')
    // rm tag contents
    .replace(/<([\w\.#]+).*?>/g, (match, tagname) => `<${tagname}>`)
    // add ticketSplitters
    .replace(/(<table> <tbody> <tr> <td> (Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche \d+))/g, (match, div) => '<ticketSplit/>' + div)

  /* -- get prices -- */
  const priceRegex = RegExp(/(\d+,\d\d) ?€/, 'g')
  let prices = []
  let price = priceRegex.exec(html)
  while(price !== null) {
    prices.push(price[1])
    price = priceRegex.exec(html)
  }

  price = parsePrice(/<td> TOTAL payé en ligne : <\/td> <td> ([\d,]+) € <\/td>/.exec(html)[1])
  prices = prices.map(parsePrice).filter(p => p !== price)

  /* -- generate result -- */
  return {
    status: "ok",
    result: {
      trips: [
        {
          code: /<td> Référence de dossier : <span> (\w+) <\/span> <\/td>/.exec(html)[1],
          name: /<td> Nom associé : <span> (.*?) <\/span>/.exec(html)[1],
          details: {
            price,
            roundTrips: html.split('<ticketSplit/>').slice(1).map((split, index) => parseRoundTrip(html, split, index))
          }
        }
      ],
      custom: {
        prices: prices.map(p => ({value: p}))
      },
    },
  }
}

const parseRoundTrip = (html, splitHtml, index) => {
    const [dateTable, detailsTable, passengerTable] = splitHtml.split('</table> <table>')
    
    /* -- get date -- */
    const dateRegex = RegExp(/\d\d\/\d\d\/\d\d\d\d/, 'g')
    let dates = []
    let date = dateRegex.exec(html)
    while(date !== null) {
      dates.push(date[0])
      date = dateRegex.exec(html)
    }

    date = dates
      .slice(index+1, index+2)[0]
      .split('/')
    date = new Date([date[2]+'-'+date[1]+'-'+date[0]]).toISOString().replace('T', ' ')

    /* -- get stations, times, trainType & number -- */
    const stationRegex = /(?:<td> (Aller|Retour) <\/td> )?<td> (\d\dh\d\d) <\/td> <td> (.*?) <\/td>(?: <td> (.*?) <\/td> <td> (\d*?) <\/td>)?/g
    const departureMatch = stationRegex.exec(splitHtml)
    const arrivalMatch = stationRegex.exec(splitHtml)

    /* -- get passengers -- */
    const passengerRegex = RegExp(/(\(\d+ à \d+ ans\)) .*? (?:Billet (échangeable)|Billet (non échangeable))/, 'g')
    let passengers = []
    let passenger = passengerRegex.exec(splitHtml)
    while(passenger !== null) {
      passengers.push({
        age: passenger[1], 
        type: passenger[2],
      })
      passenger = passengerRegex.exec(splitHtml)
    }

    return {
      date,
      type: departureMatch[1],
      trains: [
        {
          departureTime: departureMatch[2].replace('h', ':'),
          departureStation: departureMatch[3],

          arrivalTime: arrivalMatch[2].replace('h', ':'),
          arrivalStation: arrivalMatch[3],
        
          type: departureMatch[4],
          number: departureMatch[5],

          passengers,
        }
      ]
    }
}

const parsePrice = (price) => parseFloat(price.replace(',', '.'))