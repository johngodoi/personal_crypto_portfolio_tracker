import { expect } from 'chai';
import { describe, it } from 'mocha';
import request from 'supertest';
import app from '../src/index';
import { env } from '../src/shared/config/env';

describe('GET /balances', () => {
    let walletAddress = env.TEST_WALLET_ADDRESS;

    it("should return 400 if the wallet address is invalid", async () => {
        const res = await request(app).get('/balances/invalid-wallet-address');
        expect(res.status).to.equal(400);
    });

    it("should return 400 if the wallet address is not provided", async () => {
        const res = await request(app).get('/balances/');
        expect(res.status).to.equal(404);
    });

    it('should return a list of balances for a specific address', async () => {
        const res = await request(app).get(`/balances/${walletAddress}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('ethBalance');
        expect(res.body.ethBalance).to.be.a('string');
        expect(res.body).to.have.property('tokenBalances');
        expect(res.body.tokenBalances).to.be.an('object');
        for(const token in res.body.tokenBalances) {
            expect(res.body.tokenBalances[token]).to.be.a('object');
            expect(res.body.tokenBalances[token]).to.have.property('balance');
            expect(res.body.tokenBalances[token].balance).to.be.a("string")
            expect(res.body.tokenBalances[token]).to.have.property('decimals');
            expect(res.body.tokenBalances[token].decimals).to.be.a("number")
            expect(res.body.tokenBalances[token]).to.have.property('contractAddress');
            expect(res.body.tokenBalances[token].contractAddress).to.be.a("string")
            expect(res.body.tokenBalances[token]).to.have.property('symbol');
            expect(res.body.tokenBalances[token].symbol).to.be.a("string")
        }
    });
});