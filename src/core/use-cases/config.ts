import { AddressesConfig } from "../entities/addresses";
import * as path from "path";
import * as fs from 'fs';


const CONFIG_ADDRESSES_PATH = process.env.CONFIG_ADDRESSES_PATH;

async function loadAddressesConfig(): Promise<AddressesConfig | null> {
    try {
        const addressesConfigPath = (CONFIG_ADDRESSES_PATH) ? CONFIG_ADDRESSES_PATH: path.resolve(__dirname, '../../../config/addresses.json');
        const data = fs.readFileSync(addressesConfigPath, 'utf8');
        const addressesConfig: AddressesConfig = JSON.parse(data);
        return addressesConfig;    
      } catch (error) {
        console.error("Error loading JSON:", error);
        return null;
      }
}

export { loadAddressesConfig };