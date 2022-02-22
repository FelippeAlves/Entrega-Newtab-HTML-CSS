function getHistory() {
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM'
        }
    }).then( httoRequest => { return httoRequest.json()}).then( response => console.log(response))

}

function filterRecords() {
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?filterByFormula="+ encodeURI("({Responsavel} = '7882')"), {
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM'
        }
    }).then( httoRequest => { return httoRequest.json()}).then( response => { return response })

}

function setRecords(nome, valor, tipo) {
    console.log(tipo);
    if( tipo === 'Compra') {
        fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
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
                            type: "-",
                            name: nome,
                            value: valor
                        }])
                    }
                }]
            })
        })
    } else { 
        fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
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
                            type: "+",
                            name: nome,
                            value: valor
                        }])
                    }
                }]
            })
        })
    }
}

function validarDados() {
    let nome = document.getElementById('mercadoria').value;
    let valor = document.getElementById('valor').value;
    let tipo = document.getElementById('transacao').value;
    if( nome != '' && valor != '') {
        console.log('certo');
        document.getElementById('errorText').className = '';
        setRecords(nome, valor, tipo);
    } else {
        console.log('errado');
        document.getElementById('errorText').className = 'error-text';
    }
    
}

function deletarRecords() {
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?filterByFormula="+ encodeURI("({Responsavel} = '7882')"), {
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM'
        }
    }).then( httoRequest => { return httoRequest.json()}).then( response => { 
        response.records.map(function(item) {
            fetch('https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico/' + item.id, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer key2CwkHb0CKumjuM',
                },
            })
        });
     })
}

document.addEventListener("DOMContentLoaded", async function atualizarLista(){
    let total = 0;
    await fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?filterByFormula="+ encodeURI("({Responsavel} = '7882')"), {
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM'
        }
    }).then( httoRequest => { return httoRequest.json()}).then( response => {
        response.records.map(function (item) {
            let json = JSON.parse(item.fields.Json);
            let valorInt = parseFloat(json[0].value);
            if( json[0].type === '-') {
                total-= valorInt;
            } else {
                total+= valorInt;
            }
            console.log(total);
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
            declaration.innerText = json[0].type;
            declaration.classList.add('declaration');
            div_item.appendChild(declaration);
            text_name.innerText = json[0].name;
            text_name.classList.add('text-declaration');
            div_item.appendChild(text_name);
            text_value.innerText = 'R$ '+ json[0].value;
            div_extract.appendChild(text_value);
        })
    })
    let elemento_pai = document.getElementById('lista');
    let first_hr = document.createElement('hr')
    let last_hr = document.createElement('hr')
    last_hr.classList.add('last-hr')
    elemento_pai.append(first_hr)
    elemento_pai.append(last_hr)
    
    let div_extract = document.createElement('div');
    let total_text = document.createElement('p');
    let div_numbers = document.createElement('div');
    let elemento_p1 = document.createElement('p');
    let elemento_p2 = document.createElement('p');
    elemento_p1.innerText = 'R$ '+ total;
    elemento_p2.innerText = '[LUCRO]';
    div_extract.classList.add('extract-last-line');
    total_text.innerText = 'Total';
    div_extract.append(total_text);
    div_extract.append(div_numbers)
    div_numbers.append(elemento_p1);
    div_numbers.append(elemento_p2);
    elemento_pai.append(div_extract);
})


atualizarLista();





