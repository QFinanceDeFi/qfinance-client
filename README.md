# NEW QFI APP

## Beta front-end

Please report bugs here or in the Telegram group https://t.me/QFinance_DeFi.

Follow QFinance on Twitter for updates: https://twitter.com/QFinanceDeFi.

## Run locally

To run locally you will need to perform the following steps:

1. Clone repo and open the directory.
2. Run `yarn` to get dependencies
3. Create .env.development file locally and add in the following parameters:
   REACT_APP_INFURAID=[Get token from Infura]
   REACT_APP_WEB3API=[Can use Infura (use whole URL) or Alchemy]
   REACT_APP_FORTMATIC=[Get token from Fortmatic]
   REACT_APP_PORTIS=[Get token from Portis]

   Note: If you don't need Fortmatic or Portis support, you may remove them in IApp.tsx from the providers object.

4. `yarn start` and go to http://localhost:3000.