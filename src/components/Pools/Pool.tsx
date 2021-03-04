import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import PoolCard, { IPoolState } from "./PoolCard";
import { getPool } from "../../helpers/getPools";
import AppContext from "../../AppContext";
import "./pool.css";

const Pool = () => {
    const [loading, setLoading] = useState<boolean> (true);
    const [state, setState] = useState<IPoolState | undefined> ();
    const [update, setUpdate] = useState<boolean> (false);

    const location = useLocation();
    const history = useHistory();
    const context = React.useContext(AppContext);

    useEffect(() => {
        let address = location.pathname.replace("/pool/", "");
        async function getData() {
            setLoading(true);
            let res: any = await getPool(false, address, context);
            if (!res) {
                return history.push(`/404`);
            }
            setState({
                poolName: res.poolName,
                creator: res.creator,
                address,
                currentValue: res.balance,
                isPublic: res.isPublic,
                breakdown: res.breakdown,
                update: () => setUpdate(!update),
                userBalance: res.userBalance || 0
            })
            setLoading(false);
        }
        getData();
    }, [update, context, history])

    return (
        <div style={{display: 'flex', width: '100%', justifyContent: 'center', flexDirection: 'column'}}>
            {!loading && state &&
            <PoolCard poolName={state.poolName} address={state.address} currentValue={state.currentValue}
                isPublic={state.isPublic} breakdown={state.breakdown} update={state.update} creator={state.creator} />
            }
        </div>
    )
}

export default Pool;