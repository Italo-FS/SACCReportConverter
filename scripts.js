function handleFile(input, type) {
	return new Promise((resolve, reject) => {
		const file = input.files[0];

		var reader = new FileReader();
		reader.onload = (e) => {
			var data = new Uint8Array(e.target.result);
			var workbook = XLSX.read(data, { type: 'array' });

			// Extrair o conteúdo da planilha
			var worksheet = workbook.Sheets[workbook.SheetNames[0]];

			// Converte para JSON
			const jsonData = ArquivoPlanilha.worksheetToJson(worksheet);

			// Retorna os dados extraídos da planilha
			resolve(convertReport(jsonData, type));
		};
		reader.onerror = (error) => {
			reject(error);
		};
		reader.readAsArrayBuffer(file);
	});
}

function startComparison() {
	console.log(actualContent)
}

function convertReport(arrayData, type) {
	if (type === 'relatorio_sacc') {
		return new RelatorioContratosSACC(arrayData);
	}
	else if (type === 'relatorio_contratos_vigentes') {
		return new RelatorioContratosAtivos(arrayData);
	}
}

function contractComparison() {
	const promessaContratosSACC = handleFile(document.getElementById('relatorio_sacc'), 'relatorio_sacc');
	const promessaContratosVigentes = handleFile(document.getElementById('relatorio_contratos_vigentes'), 'relatorio_contratos_vigentes');

	newContracts = []
	divergentContracts = [];
	deadContracts = [];
	warns = [];

	Promise.all([promessaContratosSACC, promessaContratosVigentes])
		.then((resultados) => {
			const contratosSACC = resultados[0].contracts;
			const contratosVigentes = resultados[1].contracts;

			newContracts = contratosSACC.filter(contractSACC => {
				contractVigente = contratosVigentes.find(x => {
					return x.getValue('numero_sacc') === contractSACC.getValue('numero_sacc')
				})
				const ignored_contract = config.contratos_novos_ignorados.hasOwnProperty(contractSACC.getValue('numero_sacc'));
				if (ignored_contract) {
					warns.push(`O contrato ${contractSACC.getValue('numero')} SACC ${contractSACC.getValue('numero_sacc')} foi ignorado pelo motivo: ${config.contratos_novos_ignorados[contractSACC.getValue('numero_sacc')]}`)
					return false;
				}
				return (contractVigente === undefined);
			});

			contratosVigentes.forEach(contractVigente => {
				contractSACC = contratosSACC.find(x => {
					return x.getValue('numero_sacc') === contractVigente.getValue('numero_sacc')
				})

				if (contractSACC != undefined) {
					const divergentColumns = contractSACC.compareWith(contractVigente);
					divergentContracts.push({ contrato: contractSACC, divergentColumns: divergentColumns })
				} else {
					divergentContracts.push({ contrato: contractVigente })
				}
			});

			contratosVigentes.forEach(contractVigente => {
				contractSACC = contratosSACC.filter(x => {
					return x.getValue('numero_sacc') === contractVigente.getValue('numero_sacc')
				})[0] // Procura o contrato do relatório SACC com mesmo numero SACC.

				const ignored_contract = config.contratos_inativos_ignorados.hasOwnProperty(contractVigente.getValue('numero_sacc'));
				if (ignored_contract) {
					warns.push(`O contrato ${contractVigente.getValue('numero')} SACC ${contractVigente.getValue('numero_sacc')} foi ignorado pelo motivo: ${config.contratos_inativos_ignorados[contractVigente.getValue('numero_sacc')]}`)
				}
				// const ignored_contract = false;
				if (contractSACC === undefined && !ignored_contract) deadContracts.push(contractVigente);
			});

			showResults(newContracts, divergentContracts, deadContracts)
		})
		.catch((error) => {
			console.error(error);
		});
}

function showResults(newContracts, divergentContracts, deadContracts) {
	const result = document.getElementById('result');

	result.innerHTML = '';

	let div; let p;

	div = document.createElement('div');
	p = document.createElement('p');
	p.innerHTML = `Avisos:`;
	div.appendChild(p);
	div.appendChild(printWarns(warns));
	result.appendChild(div);

	div = document.createElement('div');
	p = document.createElement('p');
	p.innerHTML = `Há ${newContracts.length} novos contratos:`;
	div.appendChild(p);
	div.appendChild(printContract(newContracts));
	result.appendChild(div);

	div = document.createElement('div');
	p = document.createElement('p');
	p.innerHTML = `Há ${deadContracts.length} contratos inativos:`;
	div.appendChild(p);
	div.appendChild(printContract(deadContracts));
	result.appendChild(div);

	div = document.createElement('div');
	p = document.createElement('p');
	p.innerHTML = `Há ${divergentContracts.filter(contract => contract.divergentColumns != undefined && contract.divergentColumns.length > 0 ).length} contratos divergentes:`;
	div.appendChild(p);
	div.appendChild(printContract(divergentContracts, true));
	result.appendChild(div);	
}

function printContract(contracts, divergets = false) {
	const order = [
		'numero',
		'numero_sacc',
		'',
		'objeto',
		'contratado',
		'data_inicio',
		'data_terminoAtual',
		'',
		'data_publicacao',
		// 'valor_estado',
		// 'valor_contrapartida',
		'valor_original',
		'valor_alteracoes',
		'valor_atualizado',
		'valor_totalPago',
		'valor_saldoAposPagto',
	]

	// let p = document.createElement('p');
	// contracts.forEach(contract => {
	// 	order.forEach(key => {
	// 		if (divergets === false) {
	// 			p.innerHTML += `"${contract.getValue(key)}"| `
	// 		} else {
	// 			console.log(contract)
	// 			if (contract.divergentColumns.includes(key)) {
	// 				p.innerHTML += `"<b>${contract.contrato.getValue(key)}"</b>| `
	// 			} else {
	// 				p.innerHTML += `"${contract.contrato.getValue(key)}"| `
	// 			}
	// 		}
	// 	});
	// 	p.innerHTML = p.innerHTML.slice(0, -2); // Remove o último caractere.
	// 	p.innerHTML += '<br>';
	// });

	let table = document.createElement('table');

	let tbody = document.createElement('tbody');
	let header = document.createElement('thead');

	order.forEach(key => {
		let cell = document.createElement('th');
		cell.innerHTML = key;
		header.appendChild(cell);
	});
	table.appendChild(header)

	contracts.forEach(contract => {
		let row = document.createElement('tr');
		order.forEach(key => {
			let cell = document.createElement('td');
			if (divergets === false) {
				cell.innerHTML = `"${contract.getValue(key)}"`
			} else {
				if (contract.divergentColumns != undefined && contract.divergentColumns.includes(key)) {
					cell.innerHTML = `"<b class="divergent">${contract.contrato.getValue(key)}"</b>`
				} else {
					cell.innerHTML = `"${contract.contrato.getValue(key)}"`
				}
			}
			row.appendChild(cell)
		});
		tbody.appendChild(row)
	});
	table.appendChild(tbody)



	return table;
}

function printWarns(warns) {
	

	let list = document.createElement('ul');

	warns.forEach(warn => {
		let item = document.createElement('li');
		item.innerHTML = warn;
		list.appendChild(item);
	});

	return list;
}

// function contractComparison() {
// 	const contratosSACC = handleFile(document.getElementById('relatorio_sacc'), 'relatorio_sacc');
// 	const contratosVigentes = handleFile(document.getElementById('relatorio_contratos_vigentes'), 'relatorio_contratos_vigentes');

// 	console.log(contratosSACC)
// }

function printContractsReport(contratos) {
	document.getElementById('result').innerHTML = contratos.getAllContracts()
}

function teste() {
}


