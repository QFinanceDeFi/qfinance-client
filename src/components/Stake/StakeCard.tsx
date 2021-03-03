import React from "react";
import { IUserStake, approveStaking, claimEarnings, withdrawStake, sendStake } from "../../helpers/getStakingDetails";
import AppContext from "../../AppContext";
import Button from "../Button/Button";
import StakeForm from "./StakeForm";

interface ICardProps {
    title: string;
    deadline: number;
    reward: any;
    stakingToken: string;
    address: string;
    apy: any;
    duration: number;
    info: string;
    userStake: IUserStake | null | undefined;
    qfi?: boolean;
    update: Function;
}

const StakeCard = (props: ICardProps) => {
    const [state, setState] = React.useState<any> ();
    const [stakeFormOpen, setStakeFormOpen] = React.useState<boolean> (false);

    const context = React.useContext(AppContext);

    React.useEffect(() => {
        setState(context.state);
    }, [context])

    const sendApproval = async () => {
        let approved = await approveStaking(state, props.address, props.stakingToken, props.userStake);
        if (approved) {
          props.update();
        }
    }

    const sendClaim = async () => {
      let claimed = await claimEarnings(state, props.address);
      if (claimed) {
        props.update();
      }
    }

    const sendWithdrawal = async (staked: number) => {
      let withdrawn = await withdrawStake(state, props.address, staked);
      if (withdrawn) {
        props.update();
      }
    }

    return (
        <div className="card" style={{minHeight: '360px'}}>
            <div className="card-body-content">
                <div style={{display: 'flex', justifyContent: 'center', margin: '12px 0'}}>
                    <h1 className="card_h1" style={{margin: 0}}>
                        {props.title}
                    </h1>
                </div>
                <h3 className="card_h3">
                    Period End: {new Date(props.deadline * 1000).toLocaleDateString()}
                </h3>
                <h4 className="card_h4">
                    APY: {(Number(props.apy) / (props.duration / 31556926) * 100).toFixed(3)}%
                </h4>
                <p className="card_p">
                    {props.info}
                </p>
                <div className="claim">
                    {props.userStake && props.userStake.rewards > 0.01 &&
                        <Button variant='primary' size='auto' onClick={sendClaim}
                            label={`Claim ${Math.floor(props.userStake.rewards * 100) / 100} QFI`} />
                    }
                    {props.userStake && props.userStake.staked > 0.01 &&
                        <Button variant='secondary' size='auto' onClick={() => sendWithdrawal(Math.floor(props.userStake.staked * 100000000) / 100000000)}
                            label='Withdraw Stake' />
                    }
                </div>
            </div>
            <div className="card_footer">
                <div>
                    <p style={{color: '#CC9966'}}>
                        Reward: {Math.round(props.reward).toFixed(0)} QFI
                    </p>
                </div>
                <div>
                    <Button variant='primary' size='sm' label="Approve" disabled={!props.userStake || props.userStake.balance < 0.1} onClick={sendApproval}/>
                    <Button variant='secondary' size='sm' label="Stake" disabled={!props.userStake || props.userStake.allowance < 0.01} onClick={() => setStakeFormOpen(true)} />
                </div>
            </div>
            {props.userStake &&
            <StakeForm
                open={stakeFormOpen}
                close={() => setStakeFormOpen(false)}
                title={props.title}
                balance={props.userStake.balance}
                allowance={props.userStake.allowance}
                contract={props.address}
                update={props.update}
                />
            }
        </div>
    )
}

export default StakeCard;