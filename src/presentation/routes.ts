import { Request, Response, Router } from 'express';
import { getBalances } from './controllers/get-balances';
import { getPrices } from './controllers/get-prices';
import { getPortfolio } from './controllers/get-portfolio';
import { getAddresses } from './controllers/get-addresses';
  

const router = Router();
/**
 * @swagger
 * /blockchains/{blockchain}/balances/{address}:
 *   get:
 *     description: Get the balances, of native currency and fungible tokens, of an address on a blockchain (e.g. Ethereum, Tron, etc.)
 *   parameters:
 *     - in: path
 *       name: blockchain
 *       required: true
 *       schema:
 *         type: string
 *       description: The name of the blockchain (e.g. Ethereum, Tron, etc.)
 *     - in: path
 *       name: address
 *       required: true
 *       schema:
 *         type: string
 *       description: The address on the blockchain
 *   responses:
 *     200:
 *       description: The balances of the address
 *       content:
 *         application/json:
 *       schema:
 *         type: object
 *         properties:
 *           native:
 *             type: object
 *             properties:
 *              balance:
 *               type: string
 */
router.get('/blockchains/:blockchain/balances/:address', async (req: Request, res: Response) => {
    return await getBalances(req, res);
});

/**
 * @swagger
 * /blockchains/{blockchain}/prices/{symbol}:
 *   get:
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
    return await getPrices(req, res);
});

/**
 * @swagger
 * /blockchains/{blockchain}/portfolio/{address}:
 *   get:
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
    return await getPortfolio(req, res);
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
    return await getAddresses(req, res);
});

export default router;