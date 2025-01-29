import { AddressesConfig } from "../entities/addresses";
import * as path from "path";
import * as fs from 'fs';
import { env } from "../../shared/config/env";


async function loadAddressesConfig(): Promise<AddressesConfig | null> {
    try {
        const configAddressesPath = env.CONFIG_ADDRESSES_PATH;
        const addressesConfigPath = (configAddressesPath) ? configAddressesPath: path.resolve(__dirname, env.CONFIG_ADDRESSES_PATH_PATTERN);
        const data = fs.readFileSync(addressesConfigPath, 'utf8');
        const addressesConfig: AddressesConfig = JSON.parse(data);
        return addressesConfig;    
      } catch (error) {
        console.error("Error loading JSON:", error);
        return null;
      }
}

export { loadAddressesConfig };