import WormholeConnect, {
    WormholeConnectConfig,
    WormholeConnectTheme,
} from '@wormhole-foundation/wormhole-connect';

function App() {
    const config: WormholeConnectConfig = {
        network: 'Testnet',
        chains: ['Sui','Aptos','Monad','Avalanche','Holesky'],

        ui: {
            title: 'SUI Connect TS Demo',
        },
    };

    const theme: WormholeConnectTheme = {
        mode: 'dark',
        primary: '#78c4b6',
    };

    return <WormholeConnect config={config} theme={theme} />;
}

export default App;