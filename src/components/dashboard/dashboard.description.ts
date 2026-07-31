export const materialTypesList = {
    Steel: "STEEL",
    Plastic: 'PLASTIC',
    Aluminium: 'ALUMINIUM',
    Copper: 'COPPER'
}

export const categoryDistributionColors = {
    'Steel Scrap': "#2F6FE4",
    'Plastic Scrap': "#3C96FF",
    'Copper Scrap': "#FFAA2B",
    'Aluminium Scrap': "#19B38C",
    'Other Scrap': "#FF9E8C",
}

const toNumber = (value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === '') return 0;

    const parsedValue = Number.parseFloat(String(value).replace(/,/g, ''));
    return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

export const numberFormatting = (value: string | number | undefined | null) => {
    return toNumber(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })
}