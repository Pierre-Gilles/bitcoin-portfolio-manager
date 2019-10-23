import axios from "axios";
import Promise from "bluebird";

export default {
  async getInfosAddress(addresses) {
    return Promise.map(
      addresses,
      async address => {
        const { data } = await axios.get(
          `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`
        );
        return data;
      },
      { concurrency: 3 }
    );
  },
  async getBitcoinHistoryPrice() {
    const { data } = await axios.get(
      `https://api.coindesk.com/v1/bpi/historical/close.json`
    );
    const result = Object.keys(data.bpi)
      .map(key => {
        var options = {
          month: "short",
          day: "numeric"
        };
        return {
          date: new Date(key).toLocaleDateString("en-US", options),
          price: data.bpi[key],
          date_js: new Date(key)
        };
      })
      .sort((a, b) => {
        if (a.date_js < b.date_js) {
          return -1;
        }
        if (a.date_js > b.date_js) {
          return 1;
        }
        return 0;
      });
    return result;
  },
  async getBitcoinCurrentPrice() {
    const { data } = await axios.get(
      `https://api.coindesk.com/v1/bpi/currentprice.json`
    );
    return data;
  }
};
