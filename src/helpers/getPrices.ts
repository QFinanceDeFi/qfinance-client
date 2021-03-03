import axios from "axios";

interface IReturnData {
    name: string,
    symbol: string,
    price: number
}

export const getPrices = async (): Promise<IReturnData[]> => {
    let url = "https://qfiprices.azurewebsites.net/api/GetPrices?tokens=ethereum,qfinance";
    let res = await axios.get(url)

    return res.data;
}