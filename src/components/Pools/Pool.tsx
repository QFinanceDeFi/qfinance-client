import React from "react";
import { ChevronUp, ChevronDown } from "react-feather";
import Loader from "react-spinners/BounceLoader";
import { web3 } from "../../data/init";
import { useAppDispatch, useAppSelector } from "../../hooks/base";
import { getPoolDetails } from "../../state/pools/pools";
import { depositEth, liquidate, withdrawTokens } from "../../state/tx/tx";
import Modal from "../Modal/Modal";
import "./pool.css";

interface IPoolProps {
  poolName: string;
  address: string;
  value: string;
  isPublic: boolean;
  update: Function;
  index: number;
  open: boolean;
}

const Pool: React.FC<IPoolProps> = ({
  poolName,
  address,
  value,
  isPublic,
  update,
  index,
  open,
}) => {
  const [modal, setModal] = React.useState<{open: boolean; dialog: 'deposit' | 'withdraw' | 'liquidate'}>({
      open: false,
      dialog: 'deposit'
  });
  const [input, setInput] = React.useState<string>('0');
  const { pool, status, ethBalance } = useAppSelector((state) => {
    return {
      pool: isPublic
        ? state.pools.publicPools.find((p) => p.address === address)
        : state.pools.privatePools.find((p) => p.address === address),
      status: state.pools.status,
      ethBalance: state.wallet.ethBalance
    };
  });
  const dispatch = useAppDispatch();

  async function handleConfirm() {
    setModal(m => {
      return {
        ...m,
        open: false
      }
    })
    if (modal.dialog === 'deposit') {
      dispatch(await depositEth({amount: input, isPublic, address}))
    } else if (modal.dialog === 'liquidate') {
      dispatch(await liquidate({isPublic, address}));
    } else if (modal.dialog === 'withdraw') {
      dispatch(await withdrawTokens({isPublic, address}));
    }
  }

  React.useEffect(() => {
    if (open) {
      if (pool && pool.breakdown.length === 0) {
        dispatch(getPoolDetails(address));
      }
    }
    // eslint-disable-next-line
  }, [open, address, dispatch]);

  return (
    <>
      <div
        className="pool-card"
        style={{
          borderBottomLeftRadius: open ? "0" : "8px",
          borderBottomRightRadius: open ? "0" : "8px",
        }}
      >
        <div className="pool-card-content">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {!open && (
                <ChevronDown
                  size="18px"
                  onClick={() => update(index)}
                  style={{ cursor: "pointer" }}
                />
              )}
              {open && (
                <ChevronUp
                  size="18px"
                  onClick={() => update(-1)}
                  style={{ cursor: "pointer" }}
                />
              )}
              <span style={{ display: "block", marginLeft: "14px" }}>
                <a
                  href={`https://etherscan.io/address/${address}`}
                  target="_blank noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {poolName}
                </a>
              </span>
            </div>
            <span style={{ display: "block" }}>
              {Number(web3.utils.fromWei(value, "ether")).toFixed(
                Number(value) !== 0 ? 4 : 0
              )}{" "}
              ETH
            </span>
          </div>
        </div>
      </div>
      <div
        className="pool-card-dropdown"
        style={{ height: open ? "200px" : "0", overflow: "hidden" }}
      >
        <div className="pool-card-dropdown-content">
          <div
            className="pool-card-assets-list"
            style={{ opacity: open ? 1 : 0 }}
          >
            <h4 style={{ margin: 0, textAlign: "center" }}>Pool Breakdown</h4>
            {status === "pending" && (
              <div
                style={{
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "center",
                  margin: "12px 0",
                }}
              >
                <Loader size="24px" color="#BA9860" />
              </div>
            )}
            {status !== "pending" &&
              pool?.breakdown.map((item: any) => (
                <div className="pool-card-asset" key={item.address}>
                  <div className="pool-card-asset-symbol">{item.symbol}</div>
                  <div className="pool-card-asset-percent">{item.percent}%</div>
                </div>
              ))}
          </div>
          <div className="pool-card-actions">
            <div className="pool-card-action">
              <button
                className="staking-card-button"
                onClick={() => setModal({open: true, dialog: 'deposit'})}
              >
                DEPOSIT
              </button>
            </div>
            {/*}
            <div className="pool-card-action">
                className={`staking-card-button ${Number(web3.utils.fromWei(pool?.userBalance ?? '0', 'ether')) === 0 && 'button-disabled'}`}
                disabled={Number(web3.utils.fromWei(pool?.userBalance ?? '0', 'ether')) === 0}
                onClick={() => setModal({open: true, dialog: 'liquidate'})}
              >
                LIQUIDATE
              </button>
            </div>*/}
            <div className="pool-card-action">
              <button
                className={`staking-card-button ${Number(web3.utils.fromWei(pool.userBalance ?? '0', 'ether')) === 0 && 'button-disabled'}`}
                disabled={Number(web3.utils.fromWei(pool.userBalance ?? '0', 'ether')) === 0}
                onClick={() => setModal({open: true, dialog: 'withdraw'})}
              >
                WITHDRAW
              </button>
            </div>
          </div>
          <div style={{ width: "100%", textAlign: "center", fontSize: "14px" }}>
            <span>
              See the pool on Etherscan:{" "}
              <a href="https://etherscan.io" style={{ color: "inherit" }}>
                {address}
              </a>
            </span>
          </div>
        </div>
      </div>
      {modal.open &&
        <Modal open={modal.open} close={() => setModal({...modal, open: false})}>
            <div className="pool-modal">
                <div className="pool-modal-content">
                {modal.dialog === 'deposit' &&
                <>
                    <h3 style={{textAlign: 'center', margin: '12px 0'}}>Deposit ETH to Pool</h3>
                    <h5 style={{textAlign: 'center', margin: '8px 0', cursor: 'pointer'}} onClick={() => setInput(web3.utils.fromWei(ethBalance, 'ether'))}>
                      {`Balance: ${web3.utils.fromWei(ethBalance, 'ether')} ETH`}
                    </h5>
                    <div className="deposit-modal-input"> 
                        <input className="q-input" min={0} max={Number(web3.utils.fromWei(ethBalance, 'ether'))} onChange={(e: any) => setInput(e.target.value)} value={input} />
                        <div className="q-input-token">
                          <span>ETH</span>
                        </div>
                    </div>
                </>
                }
                {modal.dialog === 'liquidate' &&
                    <div className="liquidate-modal">
                        <h3>Liquidate</h3>
                        <span>
                            This function will sell your holdings in the pool for ETH.
                        </span>
                    </div>
                }
                {modal.dialog === 'withdraw' &&
                    <div className="withdraw-modal">
                        <h3>Withdraw</h3>
                        <span>
                            This function will withdraw your tokens to your wallet.
                        </span>
                    </div>
                }
                </div>
            </div>
            <div className="modal-actions">
                  <button className="modal-action-button"
                    onClick={handleConfirm}
                    disabled={modal.dialog === 'deposit' && (Number(input) === 0 || input === '' || Number(input) > Number(web3.utils.fromWei(ethBalance, 'ether')))}>
                      Confirm
                  </button>
                </div>
        </Modal>
    }
    </>
  );
};

export default Pool;
