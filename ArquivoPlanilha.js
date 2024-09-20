class ArquivoPlanilha {
	static worksheetToJson(worksheet) {
		const adressList = Object.keys(worksheet).filter(cell => cell.match(/^\w+\d+$/));

		let arrayResult = [];

		adressList.forEach(adress => {
			let type;
			let value;

			if (worksheet[adress].t === 's') {
				value = worksheet[adress].w;
				type = 'String';
			} else if (worksheet[adress].t === 'n') {
				if (worksheet[adress].w.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
					value = worksheet[adress].w;
					type = 'Date';
				} else {
					value = worksheet[adress].v;
					type = 'Number';
				}				
			} else {
				throw new Error(`Tipo '${worksheet[adress].t}' não reconhecido`)
			}

			let adressMatch = adress.match(/^([A-Z]+)([0-9]+)$/);
			if (!Array.isArray(arrayResult[adressMatch[2]])) arrayResult[adressMatch[2]] = [];

			arrayResult[adressMatch[2]][this.__lettersToNumber(adressMatch[1])] = {
				value: value,
				type: type,
			}
		});

		return arrayResult;
	}

	static __lettersToNumber(letters) {
		let sum = 0;
		for (let i=letters.length-1; i>=0; i--) {
			sum += (letters.charCodeAt(i) - 64) * 26 ** (letters.length - i - 1);
		}
		return sum
	}
}

