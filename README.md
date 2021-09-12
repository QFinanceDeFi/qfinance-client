# Official QFinance Client App

Please report bugs here or in the Telegram group https://t.me/QFinance_DeFi.

Follow QFinance on Twitter for updates: https://twitter.com/QFinanceDeFi.

## Run locally

To run/test locally you will need to perform the following steps:

1. Clone repo and open the directory.
2. Run `yarn` to get dependencies
3. Create .env.development file locally and add in the following parameters:
   REACT_APP_ALCHEMY=[Get app key/url from Alchemy (recommended to use websocket)]
   REACT_APP_PRICES_API=[Need to set up price feed. Probably easier to replace with your own in state/wallet/wallet.ts]
4. Run Ganache with a fork of mainnet `ganache-cli -f {ALCHEMY API URL}`.
5. `yarn start` and go to http://localhost:3000.