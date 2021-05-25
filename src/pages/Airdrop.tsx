import React from "react";
import AppContext from "../AppContext";
import AirdropCard from "../components/Airdrop/AirdropCard";
import Button from "../components/Button/Button";
import { checkAirdrop, claimAirdrop } from "../helpers/getAirdrop";

interface IAirdropClaim {
    inAirdrop: boolean;
    amount: string;
}

const Airdrop = () => {
    const [state, setState] = React.useState<IAirdropClaim>({
        inAirdrop: false,
        amount: '0'
    });
    const [update, setUpdate] = React.useState<boolean>(false);
    const context = React.useContext(AppContext);

    React.useEffect(() => {
        async function process() {
            if (context.state.connected) {
                let res = await checkAirdrop(context.state.address);
                if (res) {
                    setState({
                        inAirdrop: res.inAirdrop,
                        amount: res.amount
                    });
                }
            }
        }
        process();
    }, [context, update])

    async function handleSubmit() {
        let res = await claimAirdrop(context);
        if (res) {
            setUpdate(true);
        }
    }

    return (
        <>
        <h1 style={{margin: '24px 12px'}}>QFI Airdrops</h1>
        <AirdropCard>
            <div>
            <h3>{state.inAirdrop ? "You can claim!" : "You have no airdrop claims"}</h3>
            {state.inAirdrop && <span>{state.amount} QFI</span>}
            </div>
            {state.inAirdrop &&
            <Button variant="primary" size="lg" label="Claim Now" onClick={handleSubmit}/>
            }
        </AirdropCard>
        </>
    );
}

export default Airdrop;