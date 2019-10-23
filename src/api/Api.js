import BitcoinApi from "./BitcoinApi";

const oneBitcoinInSatoshi = 100 * 1000 * 1000;

export default class Api {
  constructor() {
    this.bitcoinAddresses = [];
    this.bitcoinHistoryPrices = null;
  }
  addBitcoinAddress(address) {
    this.bitcoinAddresses.push(address);
  }
  async syncBitcoinPrice() {
    this.bitcoinCurrentPrice = await BitcoinApi.getBitcoinCurrentPrice();
    this.bitcoinHistoryPrices = await BitcoinApi.getBitcoinHistoryPrice();
    return {
      bitcoin_current_price_usd: this.bitcoinCurrentPrice.bpi.USD.rate_float,
      bitcoin_price_history: this.bitcoinHistoryPrices
    };
  }
  convertBtcToUsd(btcValue) {
    return parseFloat(btcValue) * this.bitcoinCurrentPrice.bpi.USD.rate_float;
  }
  async getPortfolio() {
    const data = await BitcoinApi.getInfosAddress(this.bitcoinAddresses);
    const total = {
      balance_btc: 0,
      balance_usd: 0,
      received_btc: 0,
      received_usd: 0,
      sent_btc: 0,
      sent_usd: 0
    };
    const addresses = data.map(addressInfo => {
      const finalBalance = parseFloat(
        addressInfo.final_balance / oneBitcoinInSatoshi
      );
      const totalReceived = parseFloat(
        addressInfo.total_received / oneBitcoinInSatoshi
      );
      const totalSent = parseFloat(
        addressInfo.total_sent / oneBitcoinInSatoshi
      );

      // total balance
      total.balance_btc += finalBalance;
      total.balance_usd += this.convertBtcToUsd(finalBalance);
      // total received
      total.received_btc += parseFloat(totalReceived);
      total.received_usd += this.convertBtcToUsd(totalReceived);
      // total sent
      total.sent_btc += parseFloat(totalSent);
      total.sent_usd += this.convertBtcToUsd(totalSent);
      return {
        balance_btc: parseFloat(finalBalance),
        balance_usd: this.convertBtcToUsd(finalBalance)
      };
    });
    console.log(total, addresses);
    return {
      addresses,
      total
    };
  }
}
