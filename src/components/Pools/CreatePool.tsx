import React from "react";
import { useHistory } from "react-router-dom";
import { ITokens, createPool } from "../../helpers/createPool";
import Slider from "react-input-slider";
import AppContext from "../../AppContext";
import { tokenList } from "../../helpers/tokenList";
import cogoToast from "cogo-toast";
import Input from "../Input/Input";
import Checkbox from "../Input/Checkbox";
import Button from "../Button/Button";
import Select from "../Select/Select";

const CreatePool = () => {
    const [poolName, setPoolName] = React.useState<string> ('');
    const [tokens, setTokens] = React.useState<ITokens[]> ([
        {
            address: '',
            percent: 0
        }
    ])
    const [isPublic, setIsPublic] = React.useState<boolean> (true);
    const [totalPercent, setTotalPercent] = React.useState<number> (0);

    const context = React.useContext(AppContext);
    const history = useHistory();

    const handleTokenChange = (value: any, index: number) => {
        let address = value;
        let list = [...tokens];
        let item = {...list[index], address}
        list[index] = item
        setTokens(list)
    }

    const handlePercentChange = (value: number, index: number) => {
        let percent = value;
        let list = [...tokens];
        let item = {address: tokens[index].address, percent}
        list[index] = item
        setTotalPercent(list.map(item => item.percent).reduce((a, b) => a + b))
        setTokens(list)
    }

    const handleAddToken = () => {
        setTokens(
            [...tokens, {address: '', percent: 0}]
        )
    }

    const handleRemoveToken = (index: number) => {
        let list = [...tokens];
        list.splice(index, 1);
        setTokens(list);
    }

    const checkForErrors = (): boolean => {
        if (poolName === '') {
            cogoToast.error('Add a pool name', {position: 'bottom-right'});
            return false
        } else if (tokens[0].address === '') {
            cogoToast.error('Complete asset allocation', {position: 'bottom-right'});
            return false
        } else if (totalPercent !== 100) {
            cogoToast.error('Please ensure asset allocation = 100%', {position: 'bottom-right'});
            return false
        }
        return true;
    }

    const handleSubmit = async () => {
        let check = checkForErrors();
        if (!check) return false;
        let res = await createPool(context, poolName, tokens, isPublic);
        if (!res) {
            cogoToast.error('Error making transaction', {position: 'bottom-right'});
        }
        if (res) {
            cogoToast.success('Transaction submitted', {position: 'bottom-right'});
            history.push('/pools');
            return res;
        }
        else {
            return res
        }
    }

    return (
        <div className="card" style={{textAlign: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center', padding: '12px'}}>
            <h2 style={{padding: '12px'}}>
                Create New Pool
            </h2>
            <Input variant="primary" placeholder="Enter pool name" style={{width: '256px'}} onChange={e => setPoolName(e.target.value)} />
            <div style={{display: 'flex', fontSize: '12px', height: '32px', textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
                {totalPercent !== 0 && totalPercent !== 100 && `Please check your allocation to make sure it equals 100%`}
            </div>
            <div className="stake-grid" style={{justifyContent: 'center', padding: '12px'}}>
            {tokens.map((item: any, index: number) => (
                <div className="stake-grid-item" key={index} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Select variant='primary'
                        placeholder='Select asset'
                        onChange={e => handleTokenChange(e.target.value, index)}>
                        {tokenList.map((tk: any) => (
                            <option key={tk.symbol} className="option"
                                disabled={tokens.some(token => token.address === tk.value)}
                                value={tk.value}>{tk.label}</option>
                        ))}
                    </Select>
                    <span style={{fontSize: '12px', margin: '16px', fontWeight: 700}}>
                        {item.address !== '' &&
                        `Please verify ${tokenList.find(tk => tk.value === item.address)?.symbol} address: ${item.address}`
                        }
                    </span>
                    <Slider
                        styles={{
                            track: {
                                backgroundColor: '#666'
                            },
                            active: {
                                backgroundColor: '#CC9966'
                            }
                        }}
                        axis="x" xmin={0} xmax={100} x={item.percent}
                        onChange={( { x } ) => handlePercentChange(x, index)} 
                        />
                    <span style={{color: '#cc9966', fontSize: '14px', margin: '16px', fontWeight: 700}}>
                        Allocation: {item.percent}%
                    </span>
                </div>
            ))}
            </div>
            <div style={{display: 'flex', margin: '12px'}}>
                <Button size="lg" variant="primary"
                    onClick={() => handleRemoveToken(tokens.length - 1)}
                    disabled={tokens.length === 1} label="Remove Token" />
                <Button size="lg" variant="primary"
                    onClick={() => handleAddToken()}
                    disabled={tokens.length === 5} label="Add Token" />
            </div>
            <div>
                <Checkbox label="Public Pool?" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
            </div>
            <div>
                <Button variant="primary" size="sm" label="Cancel" onClick={() => history.push('/pools')} />
                <Button variant="secondary" size="sm" onClick={handleSubmit} disabled={totalPercent !== 100} label="Create" />
            </div>
        </div>
    )
}

export default CreatePool;