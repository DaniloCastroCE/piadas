const traduzirtexto = async (texto,idiomaOrigem, idiomaDestino, callback) => {

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${idiomaOrigem}|${idiomaDestino}`

    try {
        const response = await fetch (url)

        if(!response.ok){
            throw new Error('Erro na requisição da api')
        }
        const result = await response.json()
        const textoTraduzido = result.responseData.translatedText
        //console.log(textoTraduzido)
        callback(textoTraduzido)
        return textoTraduzido

    } catch (err) {
        console.error(err)
    }

}

const getPiada = () => {
    const loading = document.querySelector('#loading')
    loading.classList.remove('hidden')
    loading.classList.add('centralizar')
    fetch ('https://v2.jokeapi.dev/joke/Any?type=single')
    .then((response => response.json()))
    .then(data => {
        //console.log(data)
        let objPiada = {
            categoria : '',
            piada: ''
        }
        traduzirtexto(data.category, data.lang, 'pt', (text) => {
            objPiada.categoria = text
        })
        traduzirtexto(data.joke, data.lang, 'pt', (text) => {
            objPiada.piada = text.replace(/\n/g, '<br>')
        })
        setTimeout(() => {
            loading.classList.add('hidden')
            loading.classList.remove('centralizar')

            if((objPiada.categoria === '' && objPiada.piada === '') || 
            (objPiada.categoria === undefined && objPiada.piada === undefined)){
                document.querySelector('#piada').innerHTML = `${data.joke}`
                document.querySelector('#categoria').innerHTML = `Categoria da piada: ${data.category}`
            }else {
                document.querySelector('#piada').innerHTML = `${objPiada.piada}`
                document.querySelector('#categoria').innerHTML = `Categoria da piada: ${objPiada.categoria}`
            }
        }, 1500);
    })
    .catch ((err) => {
        console.error('Erro:',err)

    })

}

//traduzirtexto('black', 'en', 'pt')

getPiada()

