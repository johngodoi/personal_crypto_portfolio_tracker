import { AddressesConfig } from "../entities/addresses";
import * as path from "path";
import * as fs from 'fs';

async function loadAddresses(): Promise<AddressesConfig | null> {
    try {
        const addressesConfigPath = path.resolve(__dirname, "../../../config/addresses.json");
        const data = fs.readFileSync(addressesConfigPath, 'utf8');
        const addressesConfig: AddressesConfig = JSON.parse(data);
        return addressesConfig;    
      } catch (error) {
        console.error("Error loading JSON:", error);
        return null;
      }
}

export { loadAddresses };