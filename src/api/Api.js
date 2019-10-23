import axios from "axios";

export default {
  async getInfosAddress(address) {
    const { data } = await axios.get(
      `https://api.smartbit.com.au/v1/blockchain/address/${address}`
    );
    return data;
  }
};
