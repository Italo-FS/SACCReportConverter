class Contrato {
	constructor() {
		this.__attributesList = {
			numero_sacc: {defaultValue: '', attributeType: 'String'},
			numero: {defaultValue: 'error', attributeType: 'String'},
			objeto: {defaultValue: 'error', attributeType: 'String'},
			contratado: {defaultValue: 'error', attributeType: 'String'},
			data_inicio: {defaultValue: 'error', attributeType: 'Date'},
			data_terminoOriginal: {defaultValue: '', attributeType: 'Date'},
			data_terminoAtual: {defaultValue: '', attributeType: 'Date'},
			data_publicacao: {defaultValue: '', attributeType: 'Date'},
			valor_estado: {defaultValue: 0.00, attributeType: 'Number'},
			valor_contrapartida: {defaultValue: 0.00, attributeType: 'Number'},
			valor_original: {defaultValue: 0.00, attributeType: 'Number'},
			valor_alteracoes: {defaultValue: 0.00, attributeType: 'Number'},
			valor_atualizado: {defaultValue: 0.00, attributeType: 'Number'},
			valor_totalPago: {defaultValue: 0.00, attributeType: 'Number'},
			valor_saldoAposPagto: {defaultValue: 0.00, attributeType: 'Number'},
			dias_restantes: {defaultValue: 0, attributeType: 'Number'},
			aditivos: {defaultValue: '', attributeType: 'String'},
			gestor: {defaultValue: '', attributeType: 'String'},
			portaria: {defaultValue: '', attributeType: 'String'},
			modalidade_contratacao: {defaultValue: '', attributeType: 'String'},
			garantia_exigencia: {defaultValue: '', attributeType: 'String'},
			garantia_vigenciaInicio: {defaultValue: '', attributeType: 'Date'},
			garantia_vigenciaTermino: {defaultValue: '', attributeType: 'Date'},
			link: {defaultValue: '', attributeType: 'String'},
		}
	}

	addAtribute(attributeKey, value) {
		if (!Object.keys(this.__attributesList).includes(attributeKey)) throw new Error(`Chave ${attributeKey} não encontrada.`);
		// console.log(this.numero_sacc)
		if (value === undefined) {
			if (this.__attributesList[attributeKey].defaultValue === 'error') throw new Error(`Valor de '${attributeKey}' não pode ser nulo`);
			value = {value: this.__attributesList[attributeKey].defaultValue, type: this.__attributesList[attributeKey].attributeType};
		}
		
		this[attributeKey] = value;
	}

	getValue(attributeKey) {
		if (this[attributeKey] === undefined){
			// console.log(this)
			// throw new Error(`Erro: Não foi possível acessar o atributo '${attributeKey}' do contrato.`)
			return '';
		} 
		switch (this[attributeKey].type) {
			case 'String':
				return this[attributeKey].value;
			case 'Date':
				return this[attributeKey].value;
			case 'Number':
				return this[attributeKey].value.toLocaleString('pt-BR', { useGrouping: false });
		}
		throw new Error('Erro: Tipo de atributo não encontrado.')
	}

	compareWith(anotherContract) {
		let divergentColumns = [];
		Object.keys(this).forEach( key => {
			if (key.substring(0,1) === '__') return // Atributos privados não devem ser comparados.
			if (!anotherContract[key] || !this[key]) return //Contrato comparado não possui o atributo.
			
			const valueA = this._valueToString(anotherContract[key].value);
			const valueB = this._valueToString(this[key].value);

			if (valueA !== valueB) {
				// console.log('Divergente: ', this[key].value, " != ", anotherContract[key].value)
				divergentColumns.push(key);
			}
		});
		return divergentColumns;
	}

	_valueToString(value) {
		let returnedString = value ? value.toString() : '';
		returnedString = returnedString.replaceAll('\n', ' ')
		returnedString = returnedString.replaceAll(/\s{2,}/g, ' ')
		return returnedString;
	}
}