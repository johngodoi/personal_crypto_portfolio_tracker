import { Request, Response, Router } from 'express';
import { createUseCases } from '.';
import { BalancesController } from '../controllers/get-balances';
import { PricesController } from '../controllers/get-prices';
import { PortfolioController } from '../controllers/get-portfolio';
import { AddressesController } from '../controllers/get-addresses';
  

const router = Router();
const useCases = createUseCases();

/**
 * @swagger
 * /blockchains/{blockchain}/balances/{address}:
 *   get:
 *     tags:
 *      - Balances
 *     description: Get the balances, of native currency and fungible tokens, of an address on a blockchain (e.g. Ethereum, Tron, etc.)
 *     parameters:
 *       - in: path
 *         name: blockchain
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the blockchain (e.g. Ethereum, Tron, etc.)
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The address on the blockchain
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/AddressBalances'
 *             example:
 *               {
 *                  "blockchain": "ethereum",
 *                  "nativeBalance": "0.009009742147357707",
 *                  "tokenBalances": [
 *                      {
 *                          "balance": "8.0614",
 *                          "decimals": 6,
 *                          "symbol": "USDT",
 *                          "contractAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7"
 *                      }
 *                  ]
 *               }
 *       404:
 *         description: Balances not found
 *       500:
 *         description: Internal server error
 */
router.get('/blockchains/:blockchain/balances/:address', async (req: Request, res: Response) => {
    const controller = new BalancesController(useCases)
    return await controller.getBalances(req, res);
});

/**
 * @swagger
 * /blockchains/{blockchain}/prices/{symbol}:
 *   get:
 *     tags:
 *      - Prices
 *     description: Get the price of a token on a blockchain (e.g. Ethereum, Tron, etc.)
 *     parameters:
 *       - in: path
 *         name: blockchain
 *         required: true
 *         schema:
 *           type: string
 *           description: The name of the blockchain (e.g. Ethereum, Tron, etc.)
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *           description: The symbol of the token
 *     responses:
 *       200:
 *         description: The price of the token
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 */
router.get('/blockchains/:blockchain/prices/:symbol', async (req: Request, res: Response) => {
    const controller = new PricesController(useCases);
    return await controller.getPrices(req, res);
});

/**
 * @swagger
 * /blockchains/{blockchain}/portfolio/{address}:
 *   get:
 *     tags:
 *      - Portfolio
 *     description: Get the portfolio of an address on a blockchain (e.g. Ethereum, Tron, etc.)
 *     parameters:
 *       - in: path
 *         name: blockchain
 *         required: true
 *         schema:
 *           type: string
 *           description: The name of the blockchain (e.g. Ethereum, Tron, etc.)
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *           description: The address on the blockchain
 *     responses:
 *       200:
 *         description: The portfolio of the address
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 */
router.get('/blockchains/:blockchain/portfolio/:address', async (req: Request, res: Response) => {
    const controller = new PortfolioController(useCases);
    return await controller.getPortfolio(req, res);
});

/**
 * @swagger
 * /addresses:
 *   get:
 *     description: Get a list of addresses
 *     responses:
 *       200:
 *         description: The list of addresses
 *         content:
 *           application/json:
 *         schema:
 *           type: object
 */
router.get("/addresses", async (req: Request, res: Response) => {
    const controller = new AddressesController(useCases);
    return await controller.getAddresses(req, res);
});

export default router;