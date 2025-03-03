var carregando = false

const traduzirtexto = async (texto, idiomaOrigem, idiomaDestino, callback) => {

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${idiomaOrigem}|${idiomaDestino}`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('Erro na requisição da api (func = traduzirtexto)')
        }
        const result = await response.json()
        const textoTraduzido = result.responseData.translatedText
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
    carregando = true
    fetch('https://v2.jokeapi.dev/joke/Any')
        .then((response => response.json()))
        .then(data => {
            //console.log(data)
            let objPiada = {
                categoria: '',
                piada: '',
                setup: '',
                delivery: '',
            }

            if (data.category === 'Programming') {
                objPiada.categoria = 'Programação'
            } else if (data.category === 'Misc') {
                objPiada.categoria = 'Diversas'
            } else if (data.category === 'Pun') {
                objPiada.categoria = 'Trocadilhos'
            } else if (data.category === 'Spooky') {
                objPiada.categoria = 'Assustadoras'
            } else if (data.category === 'Christmas') {
                objPiada.categoria = 'Natal'
            } else if (data.category === 'Dark') {
                objPiada.categoria = 'Humor Negro'
            } else if (data.category === 'Celebrity') {
                objPiada.categoria = 'Celebridades'
            } else if (data.category === 'Animals') {
                objPiada.categoria = 'Animais'
            } else if (data.category === 'Dev') {
                objPiada.categoria = 'Desenvolvimento'
            } else if (data.category === 'Food') {
                objPiada.categoria = 'Comida'
            } else {
                traduzirtexto(data.category, data.lang, 'pt', (text) => {
                    objPiada.categoria = text
                })
            }

            if (data.type === 'single') {
                traduzirtexto(data.joke, data.lang, 'pt', (text) => {
                    objPiada.piada = text.replace(/\n/g, '<br>')
                })
            }
            else if (data.type === 'twopart') {
                traduzirtexto(data.setup, data.lang, 'pt', (text) => {
                    objPiada.setup = text.replace(/\n/g, '<br>')
                })
                traduzirtexto(data.delivery, data.lang, 'pt', (text) => {
                    objPiada.delivery = text.replace(/\n/g, '<br>')
                })
            }
            setTimeout(() => {
                loading.classList.add('hidden')
                loading.classList.remove('centralizar')
                carregando = false

                const piada = document.querySelector('#piada')
                const categoria = document.querySelector('#categoria')
                const ofensiva = document.querySelector('#ofensiva')

                piada.innerHTML = ''
                categoria.innerHTML = ''
                ofensiva.innerHTML = ''

                if ((objPiada.piada === '' && data.type === 'single') ||
                    (objPiada.piada === undefined && data.type === 'single')) {
                    piada.innerHTML = `${data.joke}`
                    categoria.innerHTML = `Joke Category: ${data.category}`
                    if (data.safe) {
                        document.querySelector('#ofensiva').innerHTML = 'Offensive content'
                    }
                }
                else if (!data.error && data.type === 'single') {
                    piada.innerHTML = `${objPiada.piada}`
                    categoria.innerHTML = `Categoria da piada: ${objPiada.categoria}`
                    if (data.safe) {
                        document.querySelector('#ofensiva').innerHTML = 'Conteúdo ofensivo'
                    }
                }

                else if ((objPiada.setup === '' && objPiada.delivery === '' && data.type === 'twopart') ||
                    (objPiada.setup === undefined && objPiada.delivery === undefined && data.type === 'twopart')) {
                    piada.innerHTML = `${data.setup}<br><br>${data.delivery}`
                    categoria.innerHTML = `Joke Category: ${data.category}`
                    if (data.safe) {
                        document.querySelector('#ofensiva').innerHTML = 'Offensive content'
                    }

                }
                else if (!data.error && data.type === 'twopart') {
                    piada.innerHTML = `${objPiada.setup}<br><br>${objPiada.delivery}`
                    categoria.innerHTML = `Categoria da piada: ${objPiada.categoria}`
                    if (data.safe) {
                        document.querySelector('#ofensiva').innerHTML = 'Conteúdo ofensivo'
                    }
                }


                else if (data.error) {
                    piada.innerHTML = `Desculpe, mas não consegui pensar em uma boa piada para te contar agora.`
                }
                carregando = false
            }, 1500);
        })
        .catch((err) => {
            console.error('Erro:', err)
            const loading = document.querySelector('#loading')
            loading.classList.add('hidden')
            loading.classList.remove('centralizar')
        })

}

getPiada()

document.body.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !carregando) {
        getPiada()
    }
})

