import axios from "axios";

interface IReturnData {
    name: string,
    symbol: string,
    price: number
}

export const getPrices = async (): Promise<IReturnData[]> => {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum,qfinance";
    const res = await axios.get(url)

    const prices: IReturnData[] = [
        {
            name: 'ethereum',
            symbol: 'ETH',
            price: res[0].current_price
        },
        {
            name: 'qfinance',
            symbol: 'QFI',
            price: res[1].current_price
        }
    ]

    return prices;
}