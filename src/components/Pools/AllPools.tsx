import React from "react";
import { useHistory } from "react-router-dom";
import Table from "../Table/Table";
import { getPools } from "../../helpers/getPools";
import Loader from "react-loader-spinner";
import Button from "../Button/Button";

interface ITableColumns {
    Header: string;
    accessor: string;
}

const columns: ITableColumns[] = [
    {
        Header: 'Pool Name',
        accessor: 'name'
    },
    {
        Header: 'Address',
        accessor: 'address'
    },
    {
        Header: 'ETH Value',
        accessor: 'balance'
    },
    {
        Header: 'Public',
        accessor: 'priv'
    }
]

const AllPools = () => {
    const [state, setState] = React.useState();
    const [loading, setLoading] = React.useState<boolean> (true);
    const history = useHistory();

    React.useEffect(() => {
        async function get() {
            let data: React.SetStateAction<any> = await getPools().then((res) => {
                res.sort((a: any, b: any) => (a.balance < b.balance) ? 1 : -1);
                let data: any = res.map((item: any) => {
                    return {
                        name: item.poolName,
                        balance: `${Math.floor(item.balance * 10000) / 10000} ETH`,
                        priv: item.priv ? "Private" : "Public",
                        address: item.address
                    }
                })
                return data;
            }).catch((err: any) => {
                console.log(err);
                return [];
            });
            return setState(data);
        }
        get().then(() => setLoading(false));
    }, [])

    return (
        <>
        <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', padding: '12px 0', alignItems: 'center'}}>
            <h2 style={{color: '#CC9966'}}>
                Pools
            </h2>
            <Button variant='primary' size='auto' label='Create New' onClick={() => history.push('/create')} />
        </div>
        {loading ? 
        <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
            <Loader type="ThreeDots" color="#CC9966" height={100} width={100} timeout={5000} />
        </div>
        :
        <Table data={state} columns={columns} />
        }
        </>
    )

}

export default AllPools;