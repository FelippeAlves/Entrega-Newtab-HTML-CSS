function validarDados() {
    let nome = document.getElementById('mercadoria').value;
    let valor = document.getElementById('valor').value;
    let tipo = document.getElementById('transacao').value;
    if( nome != '' && valor != '') {
        document.getElementById('errorText').className = '';
        filterRecords();
        let limpar = document.getElementById('mercadoria')
        limpar.value = '';
        limpar = document.getElementById('valor');
        limpar.value = '' 
    } else {
        document.getElementById('errorText').classList.add ('error-text');
    }
}

async function filterRecords() {
    let mercadoria = document.getElementById('mercadoria').value;
    let preco = document.getElementById('valor').value;
    let transacao = document.getElementById('transacao').value;
    if( preco.length <= 2) {
        preco+= ',00'
    }
    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?filterByFormula="+ encodeURI("({Responsavel} = '7882')"), {
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM'
        }
    }).then( httoRequest => { return httoRequest.json()}).then( async response => {
        if(response.records.length != 0){
            let id_record = response.records[0].id;
            let json_update = JSON.parse(response.records[0].fields.Json)
            json_update[json_update.length] = {
                type: transacao,
                name: mercadoria,
                value: preco
            }
            await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico/", {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer key2CwkHb0CKumjuM',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    records: [{
                        id: id_record,
                        fields: {
                            Responsavel: '7882',
                            Json: JSON.stringify(json_update)
                        }
                    }]
                })
            })  
            handleReload();
        } else {
            await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
            method: 'POST',
            headers: {
                Authorization: 'Bearer key2CwkHb0CKumjuM',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                records: [{
                    fields: {
                        Responsavel: '7882',
                        Json: JSON.stringify([{
                            type: transacao,
                            name: mercadoria,
                            value: preco
                        }])
                    }
                }]
            })
        })
        handleReload();
        }
    })

}




async function deletarRecords() {
    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?filterByFormula="+ encodeURI("({Responsavel} = '7882')"), {
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM'
        }
    }).then( httoRequest => { return httoRequest.json()}).then( async function(item) {
            await fetch('https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico/' +item.records[0].id, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer key2CwkHb0CKumjuM',
                },
            })
    })
    await handleReload();
}

document.addEventListener("DOMContentLoaded", async function atualizarLista(){
    let total = 0;
    let teste = false;
    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?filterByFormula="+ encodeURI("({Responsavel} = '7882')"), {
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM'
        }
    }).then( httoRequest => { return httoRequest.json()}).then( response => {
        if ( response.records.length != 0) {
            let record = JSON.parse(response.records[0].fields.Json);
            record.map(function (item) {
                let valorInt = item.value.replace(',' , '.');
                valorInt = parseFloat(valorInt);
                if( item.type === '-') {
                    total-= valorInt;
                } else {
                    total+= valorInt;                   
                }
                
                let elemento_pai = document.getElementById('lista');
                let hr = document.createElement('hr');
                let div_extract = document.createElement('div');
                let div_item = document.createElement('div');
                let declaration = document.createElement('p');
                let text_name = document.createElement('p');
                let text_value = document.createElement('p');
                
                elemento_pai.appendChild(hr);
                div_extract.classList.add('extract-itens-line');
                elemento_pai.appendChild(div_extract);
                div_item.classList.add('instruct-item');
                div_extract.appendChild(div_item);
                declaration.innerText = item.type;
                declaration.classList.add('declaration');
                div_item.appendChild(declaration);
                text_name.innerText = item.name;
                text_name.classList.add('text-declaration');
                div_item.appendChild(text_name);
                text_value.innerText = 'R$ '+ item.value;
                div_extract.appendChild(text_value);
                
            })
            
            let elemento_pai = document.getElementById('lista');
            let first_hr = document.createElement('hr')
            let last_hr = document.createElement('hr')
            last_hr.classList.add('last-hr')
            elemento_pai.append(first_hr)
            elemento_pai.append(last_hr)
            
            let div_total = document.createElement('div');
            let total_text = document.createElement('p');
            let div_numbers = document.createElement('div');
            let elemento_p1 = document.createElement('p');
            let elemento_p2 = document.createElement('p');
            if (total.length <= 2) {
                total+= ',00'
            } else {
                total = parseFloat(total.toFixed(2))
            }
            total = total.toString()
            elemento_p1.innerText = 'R$ '+ total;
            if (total[0] === '-') {
                elemento_p2.innerText = '[DÉBITO]';
            } else {
                elemento_p2.innerText = '[LUCRO]';
            }
            div_total.classList.add('extract-last-line');
            total_text.innerText = 'Total';
            div_total.append(total_text);
            div_total.append(div_numbers)
            div_numbers.append(elemento_p1);
            div_numbers.append(elemento_p2);
            elemento_pai.append(div_total);
        } else {
            tratarErro();
        }
    })
})

async function handleReload(){
    let total = 0;
    let clear_div = document.getElementById('lista');
    clear_div.innerHTML = '';
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?filterByFormula="+ encodeURI("({Responsavel} = '7882')"), {
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM'
        }
    }).then( httoRequest => { return httoRequest.json()}).then( response => {
        if (response.records.length != 0) {
            let lista = document.getElementById('lista');
            lista.innerHTML = ''
            let h3 = document.createElement('h3');
            h3.innerText = 'Extrato de transações';
            lista.appendChild(h3)
            let div_first_line = document.createElement('div')
            div_first_line.classList.add('extract-first-line')
            let phrase1 = document.createElement('p')
            let phrase2 = document.createElement('p')
            phrase1.innerText = 'Mercadoria'
            phrase2.innerText = 'Valor'
            div_first_line.appendChild(phrase1)
            div_first_line.appendChild(phrase2)
            lista.appendChild(div_first_line)
            let record = JSON.parse(response.records[0].fields.Json);
            record.map( function (item) {
                let valorInt = item.value.replace(',' , '.');
                valorInt = parseFloat(valorInt);
                if( item.type === '-') {
                    total-= valorInt;
                } else {
                    total+= valorInt;
                }
                
                let elemento_pai = document.getElementById('lista');
                let hr = document.createElement('hr');
                let div_extract = document.createElement('div');
                let div_item = document.createElement('div');
                let declaration = document.createElement('p');
                let text_name = document.createElement('p');
                let text_value = document.createElement('p');

                elemento_pai.appendChild(hr);
                div_extract.classList.add('extract-itens-line');
                elemento_pai.appendChild(div_extract);
                div_item.classList.add('instruct-item');
                div_extract.appendChild(div_item);
                declaration.innerText = item.type;
                declaration.classList.add('declaration');
                div_item.appendChild(declaration);
                text_name.innerText = item.name;
                text_name.classList.add('text-declaration');
                div_item.appendChild(text_name);
                text_value.innerText = 'R$ '+ item.value;
                div_extract.appendChild(text_value);

            })

            let elemento_pai = document.getElementById('lista');
            let first_hr = document.createElement('hr')
            let last_hr = document.createElement('hr')
            last_hr.classList.add('last-hr')
            elemento_pai.append(first_hr)
            elemento_pai.append(last_hr)
            
            let div_total = document.createElement('div');
            let total_text = document.createElement('p');
            let div_numbers = document.createElement('div');
            let elemento_p1 = document.createElement('p');
            let elemento_p2 = document.createElement('p');
            if (total.length <= 2) {
                total+= ',00'
            } else {
                total = parseFloat(total.toFixed(2))
            }
            elemento_p1.innerText = 'R$ '+ total;
            total = total.toString()
            elemento_p1.innerText = 'R$ '+ total;
            if (total[0] === '-') {
                elemento_p2.innerText = '[DÉBITO]';
            } else {
                elemento_p2.innerText = '[LUCRO]';
            }
            div_total.classList.add('extract-last-line');
            total_text.innerText = 'Total';
            div_total.append(total_text);
            div_total.append(div_numbers)
            div_numbers.append(elemento_p1);
            div_numbers.append(elemento_p2);
            elemento_pai.append(div_total);
        } else {
            tratarErro();
        }
    })
}

function tratarErro() {
        let lista = document.getElementById('lista');
        lista.innerHTML = ''
        let h3 = document.createElement('h3');
        h3.innerText = 'Extrato de transações';
        lista.appendChild(h3)
        let div_first_line = document.createElement('div')
        div_first_line.classList.add('extract-first-line')
        lista.appendChild(div_first_line)
        let p = document.createElement('p');
        p.innerText = 'Não há transações cadastradas';
        lista.append(p);
}




