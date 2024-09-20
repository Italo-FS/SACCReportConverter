class RelatorioContratosSACC {
	constructor(dataArray) {
		this.contracts = this.__structReport(dataArray);
	}

	__structReport(dataArray) {
		let contracts = [];

		const filteredEmptyRowsArray = dataArray.filter(data => data != undefined).filter(data => {
			if (data[1] != undefined && data[4] != undefined) return (data[1].value != "36000000" || data[4].value != "SECRETARIA DO TURISMO");
			return true;
		});

		let filterAux = [];
		const filteredContracts = filteredEmptyRowsArray.filter(data => {
			if (data[6] != undefined && data[6].value === 'CT') {
				if (filterAux.includes(data[5].value)) {
					return false;
				} else {
					filterAux.push(data[5].value);
					return true;
				}
			} else {
				return true
			}
		});
		filterAux = null;

		filteredContracts.forEach((data, idx) => {			
			if (data[6] != undefined) { // linha não possui coluna 5
				if (data[6].value === 'CT') {
					contracts.push(new Contrato());
					this.__addData(data, contracts[contracts.length - 1]); // linha contrato
				}
			}
			else if (filteredContracts[idx-1] != undefined) {
				if (filteredContracts[idx-1][6] != undefined) {
					if (filteredContracts[idx-1][6].value === 'CT') this.addValues(data, contracts[contracts.length - 1]); // linha valores
				}
			}	
			else {
				return false
			}
		});

		return contracts
	}

	__addData(dataArray, contrato) {
		contrato.addAtribute('numero_sacc', dataArray[5]);
		contrato.addAtribute('numero', dataArray[1]);
		contrato.addAtribute('objeto', dataArray[7]);
		contrato.addAtribute('contratado', dataArray[14]);
		contrato.addAtribute('data_inicio', dataArray[22]);
		contrato.addAtribute('data_terminoOriginal', dataArray[25]);
		contrato.addAtribute('data_terminoAtual', dataArray[27]);
		contrato.addAtribute('data_publicacao', dataArray[29]);
	}

	addValues(dataArray, contrato) {
		contrato.addAtribute('valor_estado', dataArray[9]);
		contrato.addAtribute('valor_contrapartida', dataArray[11]);
		contrato.addAtribute('valor_original', dataArray[16]);
		contrato.addAtribute('valor_alteracoes', dataArray[19]);
		contrato.addAtribute('valor_atualizado', dataArray[23]);
		contrato.addAtribute('valor_totalPago', dataArray[24]);
		contrato.addAtribute('valor_saldoAposPagto', dataArray[27]);
	}

	getAllContracts() {
		let string = '';
		this.contracts.forEach(contract => {
			// console.log(contract)
			string += `"${contract.getValue('numero')}"|"${contract.getValue('numero_sacc')}"|"${contract.getValue('objeto')}"|"${contract.getValue('contratado')}"|"${contract.getValue('data_inicio')}"|"${contract.getValue('data_terminoOriginal')}"|"${contract.getValue('data_terminoAtual')}"|"${contract.getValue('data_publicacao')}"|"${contract.getValue('valor_estado')}"|"${contract.getValue('valor_contrapartida')}"|"${contract.getValue('valor_original')}"|"${contract.getValue('valor_alteracoes')}"|"${contract.getValue('valor_atualizado')}"|"${contract.getValue('valor_totalPago')}"|"${contract.getValue('valor_saldoAposPagto')}"<br>`
		});
		return string
	}
}