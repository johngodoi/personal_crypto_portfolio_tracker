import { expect } from 'chai';
import sinon from 'sinon';
import { SolanaUseCase } from '../../../src/core/use-cases/solana';
import { SolanaDriver } from '../../../src/shared/drivers/solana';
import { PriceGateway } from '../../../src/shared/gateways/price/interface';
import { CoingeckoGateway } from '../../../src/shared/gateways/price/coingecko';

describe('SolanaUseCase', () => {
    let driver: sinon.SinonStubbedInstance<SolanaDriver>;
    let priceGateway: sinon.SinonStubbedInstance<PriceGateway>;
    let useCase: SolanaUseCase;

    beforeEach(() => {
        driver = sinon.createStubInstance(SolanaDriver);
        priceGateway = sinon.createStubInstance(CoingeckoGateway);
        useCase = new SolanaUseCase(driver, priceGateway);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should generate a Solana address', async () => {
        const passphrase = 'test-passphrase';
        const generatedAddress = 'sol123';
        driver.generateSolanaAddress.resolves(generatedAddress);

        const address = await useCase.generateAddress(passphrase);

        expect(address).to.equal(generatedAddress);
        expect(driver.generateSolanaAddress).to.have.been.calledWith(passphrase);
    });

    it('should validate a Solana address', async () => {
        const walletAddress = 'sol123';
        driver.isSolanaAddress.resolves(true);

        const isValid = await useCase.isAddressValid(walletAddress);

        expect(isValid).to.be.true;
        expect(driver.isSolanaAddress).to.have.been.calledWith(walletAddress);
    });

    it('should get the portfolio for a valid address', async () => {
        const walletAddress = 'sol123';
        const nativeBalance = '10';
        const tokenBalances = [
            {  address: 'sol456', balance: 100, decimals: 6 }
        ];
        const addressBalances = { blockchain: 'solana', nativeBalance, tokenBalances };
        const nativeTokenId = 'solana';
        const nativePrice = 1;
        const tokenPrice = 1;

        driver.getBalance.resolves(Number.parseFloat(nativeBalance));
        driver.listTokensOwnedByAddress.resolves(tokenBalances);
        driver.getSymbolFromAddress.withArgs('sol456').returns('USDC');
        driver.getCoinIdFromSymbol.withArgs('sol').returns(nativeTokenId);
        driver.getCoinIdFromSymbol.withArgs('USDC').returns('usdc');
        driver.getNativeCurrencyName.returns('sol');
        driver.getBlockchainName.returns('solana');
        priceGateway.getPrice.withArgs(nativeTokenId).resolves(nativePrice);
        priceGateway.getPrice.withArgs('usdc').resolves(tokenPrice);

        const portfolio = await useCase.getPortfolio(walletAddress);

        expect(portfolio.address).to.equal(walletAddress);
        expect(portfolio.nativeBalance).to.equal(nativeBalance);
        expect(portfolio.nativeBalanceValue).to.equal(Number(nativeBalance) * nativePrice);
        expect(portfolio.tokenBalanceValues[0].value).to.equal(100 * tokenPrice);
    });

    it('should return an empty array if an error occurs while getting token balances', async () => {
        driver.listTokensOwnedByAddress.rejects(new Error('Test error'));

        const tokenBalances = await useCase.getTokenBalances('sol123');

        expect(tokenBalances).to.be.empty;
    });

    it.only('should get address balances', async () => {
        const walletAddress = 'sol123';
        const nativeBalance = '10';
        const tokenBalances = [
            {  address: 'sol456', balance: 100, decimals: 6 }
        ];

        driver.getBalance.resolves(Number.parseFloat(nativeBalance));
        driver.listTokensOwnedByAddress.resolves(tokenBalances);
        driver.getSymbolFromAddress.withArgs('sol456').returns('USDC');
        driver.getBlockchainName.returns('solana');

        const addressBalances = await useCase.getAddressBalances(walletAddress);

        expect(addressBalances.nativeBalance).to.equal(nativeBalance);
        expect(addressBalances.tokenBalances).to.deep.equal([{
            balance: "100",
            decimals: 6,
            symbol: "USDC",
            contractAddress: "sol456",
          }]);
        expect(addressBalances.blockchain).to.equal('solana');
    });
});