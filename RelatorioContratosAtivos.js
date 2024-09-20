class RelatorioContratosAtivos {
	constructor(dataArray) {
		this.contracts = this.__structReport(dataArray);
	}

	__structReport(dataArray) {
		let contracts = [];

		const filteredEmptyRowsArray = dataArray.filter(data => data != undefined)

		filteredEmptyRowsArray.forEach((data, idx) => {
			if (idx < 2) return // Cabeçalho

			const contract = new Contrato()

			contract.addAtribute('numero', data[1]);
			contract.addAtribute('numero_sacc', data[2]);
			contract.addAtribute('link', data[3]);
			contract.addAtribute('objeto', data[4]);
			contract.addAtribute('contratado', data[5]);
			contract.addAtribute('data_inicio', data[6]);
			contract.addAtribute('data_terminoAtual', data[7]);
			contract.addAtribute('dias_restantes', data[8]);
			contract.addAtribute('data_publicacao', data[9]);
			contract.addAtribute('valor_original', data[10]);
			contract.addAtribute('valor_alteracoes', data[11]);
			contract.addAtribute('valor_atualizado', data[12]);
			contract.addAtribute('valor_totalPago', data[13]);
			contract.addAtribute('valor_saldoAposPagto', data[14]);
			contract.addAtribute('aditivos', data[15]);
			contract.addAtribute('gestor', data[16]);
			contract.addAtribute('portaria', data[17]);
			contract.addAtribute('modalidade_contratacao', data[18]);
			contract.addAtribute('garantia_exigencia', data[19]);
			contract.addAtribute('garantia_vigenciaInicio', data[20]);
			contract.addAtribute('garantia_vigenciaTermino', data[21]);

			contracts.push(contract)			
		});

		return contracts
	}

	getAllContracts() {
		let string = '';
		this.contracts.forEach(contract => {
			// console.log(contract)
			// string += `"${contract.getValue('numero')}"|"${contract.getValue('numero_sacc')}"|"${contract.getValue('objeto')}"|"${contract.getValue('contratado')}"|"${contract.getValue('data_inicio')}"|"${contract.getValue('data_terminoOriginal')}"|"${contract.getValue('data_terminoAtual')}"|"${contract.getValue('data_publicacao')}"|"${contract.getValue('valor_estado')}"|"${contract.getValue('valor_contrapartida')}"|"${contract.getValue('valor_original')}"|"${contract.getValue('valor_alteracoes')}"|"${contract.getValue('valor_atualizado')}"|"${contract.getValue('valor_totalPago')}"|"${contract.getValue('valor_saldoAposPagto')}"<br>`
		});
		return string
	}
}